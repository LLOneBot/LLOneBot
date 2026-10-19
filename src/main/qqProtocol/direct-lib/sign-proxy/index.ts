import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { getLogger } from '@/common/logger'
import { isDevMode } from '@/common/utils/environment'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const requireBin = createRequire(import.meta.url)

// --dev: dev build from SignProxy `npm run build:dev-bot` (base_url baked to localhost:8090, no TLS pinning).
// Names differ end to end, so a missing dev build fails to load instead of falling back to prod.
const isDev = isDevMode()
const baseName = isDev ? 'sign-proxy-dev' : 'sign-proxy'

// alpine/musl 判据: glibc 的 node report 带 glibcVersionRuntime, musl 上没有 (napi-rs 同款).
// 兜底再看 alpine 标志文件 / musl 动态加载器. 直连 sign-proxy .node 分 glibc / musl 两套 (ABI 不通用).
function isMusl(): boolean {
  if (process.platform !== 'linux') return false
  try {
    const report = (process.report?.getReport?.() ?? {}) as { header?: { glibcVersionRuntime?: string } }
    if (report.header && 'glibcVersionRuntime' in report.header) return !report.header.glibcVersionRuntime
  } catch { /* 忽略, 走下面兜底 */ }
  return existsSync('/etc/alpine-release') || existsSync('/lib/ld-musl-x86_64.so.1') || existsSync('/lib/ld-musl-aarch64.so.1')
}

function pickTriple(): string {
  const p = process.platform
  const a = process.arch
  if (p === 'win32' && a === 'x64') return 'win-x64'
  if (p === 'win32' && a === 'arm64') return 'win-arm64'
  if (p === 'linux' && a === 'x64') return isMusl() ? 'linux-x64-musl' : 'linux-x64-glibc'
  if (p === 'linux' && a === 'arm64') return isMusl() ? 'linux-arm64-musl' : 'linux-arm64-glibc'
  if (p === 'darwin' && a === 'x64') return 'darwin-x64'
  if (p === 'darwin' && a === 'arm64') return 'darwin-arm64'
  throw new Error(`sign-proxy: unsupported platform ${p}-${a}; rebuild lucky-lillia-sign-proxy on this target and drop the .node into ${here}`)
}

/** 读 sign-proxy 版本号. 版本号塞进 tmpdir 文件名做 .node 热更新缓存 key. */
function pickVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(here, `${baseName}.package.json`), 'utf-8'))
    if (typeof pkg.version === 'string' && pkg.version.length > 0) return pkg.version
  } catch {
    // 读不到就 fallback, 热更新失效但不影响加载
  }
  return '0.0.0'
}

/**
 * 把同目录的 .node 拷到 tmpdir/lucky-lillia-sign-proxy/<baseName>.<triple>.<version>.node 再 require.
 *
 * 为什么转一道: Bot 跑着时 require 的 .node 文件被 OS 锁定 (Windows 尤甚), 无法被
 * `npm run build:dev-bot` / 外部部署脚本覆盖 -- 等于阻止热更新. 转 tmpdir + 把版本号
 * 串进文件名后, 升级时 src/ 目录 .node 随便覆盖 (它没被 require), 重启 Bot 时
 * version bump -> 新 tmpdir 路径 -> 新文件被复制并 require, 旧 tmpdir 副本留着不影响.
 *
 * 复制策略 (existsSync 优先, copy 失败 swallow):
 *   1. 目标已存在 -> 直接用, 不复制 (这是 99% 的情况, 同一版本第二次起 Bot)
 *   2. 不存在 -> copyFileSync; 失败 (e.g. tmpdir 写不进) -> fallback 到原路径加载
 *      (开发场景方便; 生产 tmpdir 总该可写)
 */
function ensureLoadablePath(srcPath: string, version: string, triple: string): string {
  const cacheRoot = join(tmpdir(), 'lucky-lillia-sign-proxy')
  const cachedName = `${baseName}.${triple}.${version}.node`
  const cachedPath = join(cacheRoot, cachedName)

  if (existsSync(cachedPath)) return cachedPath

  try {
    mkdirSync(cacheRoot, { recursive: true })
    copyFileSync(srcPath, cachedPath)
    return cachedPath
  } catch (e) {
    getLogger('sign-proxy').warn(`[sign-proxy] hot-update copy failed (${(e as Error).message}); falling back to ${srcPath}`)
    return srcPath
  }
}

interface Native {
  init(args: InitArgs, sendPacket: (p: RelayPacket) => Promise<Buffer>, logger: (log: SignLog) => void): Promise<void>
  ping(): string
  setAuthToken(authToken: string): Promise<void>
  /** 运行中切换 16B device GUID (hex). 老版 .node 没这 export 时 swallow. */
  setMachineGuid?(guidHex: string): void
  preflight(): Promise<string | null>
  /**
   * 登录前软校验 auth_token (打 /api/sign/info, 401/403 不 exit)。base_url 跟 sign 链路同源。
   * 返回 "valid" / "invalid" / "retry:<reason>"。老版 .node 没这 export 时为 undefined。
   */
  validateAuthToken?(args: ValidateAuthTokenArgs): Promise<string>
  signRequest(args: SignRequestArgs): Promise<SignResultJs>
  acquireSignToken(args: AcquireSignTokenArgs): Promise<AcquireSignTokenResult>
  postEnvelope(args: PostEnvelopeArgs): Promise<string>
  /**
   * Linux ESK -> SA: 用 SDK 采的设备事实本地组 device_pb, 先 ESK 拿 token1, 再 SA 换 token2
   * (登录态活跃 sign-token), 返回 token2。走 bot 自己的 SSO 发, 本地解, 不经 manager
   * (acquireSignToken 那条要打 manager 两趟 HTTP)。老 .node 没这个 export 时为 undefined。
   */
  getLinuxSAToken?(args: LinuxEskTokenArgs): Promise<LinuxTokenResult>
  startSsoReportLinux?(args: StartSsoReportLinuxArgs): Promise<void>
  stopSsoReport?(): void
  /**
   * 取 Linux SsoReport 的 xwid body (常量 protobuf)。Bot 侧 sendXwidBurst 用它做登录连号突发:
   * body 恒定, 每帧只 sign(ts 各异) 不同。reportId 缺省 = 跨装机常量 "0df00071646"。
   * 同步返回 Buffer。老 .node 没这个 export 时为 undefined。
   */
  buildXwidBody?(qua: string, reportId?: string | null): Buffer
  /**
   * Linux xwid 登录突发**批量签**: 一次调用返回 count 个各异 sign (Rust 循环, ~450k/s, count=2500≈5ms)。
   * 取代 Bot 逐条 signRequest 打 count 次 NAPI 往返 (那才是慢的根源)。老 .node 没这个 export 时为 undefined。
   */
  signXwidBurst?(args: SignRequestArgs, count: number): Promise<SignResultJs[]>
  // ---- macOS o3 链 (全部本地组包, 只借 sendPacket 走 bot 自己的 SSO) ----
  // 老 .node 没这几个 export 时为 undefined, 调用前先判一下再报"请重新 build"。
  /** qimei 取号。打 StarTrail, 走**本机**网络出口 (服务端代取会把全站设备注册到同一 IP)。 */
  getMacosQimei?(args: MacosQimeiArgs): Promise<MacosQimeiResult>
  /** 组 device_pb (34 字段设备指纹) hex, o3 各步共用同一份。 */
  buildMacosDevicePb?(args: MacosDevicePbArgs): string
  /** 登录前 ESK: 拿引导 token1; 通道 (aesKey/shareId) 缓存在 .node 内, 不出 Rust。 */
  getMacosEskToken?(args: MacosEstablishArgs): Promise<MacosTokenResult>
  /** 登录后业务 token: A2Establish + A2Access 一步跑完 (通道/密钥全在 .node 内, 复用缓存的 ESK 通道)。 */
  getMacosLoginToken?(args: MacosEstablishArgs): Promise<MacosTokenResult>
  /**
   * 登录后一把发 macOS o3 SsoReport 爆发 (sec_init + channel_report + env_detect + login 埋点)。
   * 名字跟 startSsoReportLinux 对齐; macOS 是**一次性**爆发 (非循环), 无需 stop。老 .node 无此 export 时 undefined。
   */
  startSsoReportMacos?(args: StartSsoReportMacosArgs): Promise<void>
  /**
   * macOS 免扫码 EasyLogin: SsoKeyExchange 握手 + SsoNTLoginEasyLogin, 用存档 TLV 0x106 凭证刷新
   * d2/d2key/tgt/0x106。success=false 表示任一步失败 (不抛错), 调用方回退直接恢复 / 扫码。老 .node 无此 export 时 undefined。
   */
  macosEasyLogin?(args: MacosEasyLoginArgs): Promise<MacosEasyLoginResult>
}

export interface LinuxEskTokenArgs {
  /** 选 ProtocolVersion 用 (拿 ESK field4 的 xwid 常量)。 */
  qua: string
}

export interface LinuxTokenResult {
  /** 12B ASCII token; 解不出是空串而不是报错。 */
  token: string
  /** ESK 响应 field 3 的 TTL(秒); 没解析到是 0 —— 调用方别直接拿 0 算过期时间。 */
  ttlSecs: number
  /** 诊断 (攒样本定 TTL 语义, 不参与过期计算): ESK 内层明文 field2 原值; 老 .node 无此字段。 */
  eskInnerF2?: number
  /** 诊断: ESK 内层 field3 (相对 TTL 或绝对时间戳, 待定)。 */
  eskInnerF3?: number
  /** 诊断: ESK 内层 field4 子消息里跟 token 同级的时间戳。 */
  eskInnerTokenTs?: number
}

export interface StartSsoReportLinuxArgs {
  qua: string
  guidHex: string
  uin: string
  reportId?: string
  loginXwidBurst?: number
  verifyFileIntervalMs?: number
  uiReportMetric?: string
}

export interface MacosQimeiArgs {
  seedHex: string
  appKey?: string
  /** Entry QUA, drives the reported app_version; without it the crate default won't match the device_pb QUA. */
  qua?: string
}

export interface MacosQimeiResult {
  qimei36: string
  /** macOS schema 下 StarTrail 不返这个, 基本恒空。别依赖。 */
  qimei16: string
}

export interface MacosDevicePbArgs {
  seedHex: string
  qua: string
  q36: string
}

export interface MacosEstablishArgs {
  devicePbHex: string
  /** 毫秒时间戳; 不传 = .node 用当前时间。 */
  tsMs?: number
}

export interface MacosTokenResult {
  /** 12B token; 解不出是空串而不是报错。aesKey/shareId 不出 Rust, 这里看不到。 */
  token: string
  ttlSecs: number
}

export interface StartSsoReportMacosArgs {
  /** 32-hex 设备 guid (= report body arg[2], 与登录 / device_pb 同源)。 */
  guidHex: string
  /** 设备 qimei36 (= report body arg[3])。 */
  qimei36: string
  /** 账号 uin (进 login 埋点)。 */
  uin: string
  /** QQ.app 的 Contents/Resources/app 绝对路径; 缺省 /Applications/QQ.app/Contents/Resources/app。 */
  appDir?: string
}

export interface MacosEasyLoginArgs {
  uin: string
  /** 32-hex 设备 guid (前 16B 进 KEX / EasyLogin body)。 */
  guidHex: string
  /** 存档 TLV 0x106 凭证 hex (= session.tempPassword, 登录响应 0x119 内层 0x106)。 */
  a1106Hex: string
  /** 稳定设备种子 hex (= machine guid; 派生 serial/osver, 与 device_pb 同源)。 */
  seedHex: string
  qua: string
  /** 设备 qimei36 (复用 synth_device; 不影响 serial)。可省。 */
  q36?: string
}

export interface MacosEasyLoginResult {
  /** 全链成功才 true; 任一步失败 false (其余字段空)。 */
  success: boolean
  d2Hex: string
  /** 注意 napi 命名: 数字后首字母大写, 故 d2key_hex -> d2KeyHex (跟 SessionInfo.d2Key 一致)。 */
  d2KeyHex: string
  tgtHex: string
  /** 刷新后的 TLV 0x106 凭证 hex (存回 session 供下次 EasyLogin)。 */
  a1106Hex: string
}

const triple = pickTriple()
const version = pickVersion()
const srcPath = join(here, `${baseName}.${triple}.node`)
const loadPath = ensureLoadablePath(srcPath, version, triple)

export interface InitArgs {
  botVersion: string
  /** manager JWT. */
  authToken: string
  /** 16B device GUID hex (32 chars). 跟 wtlogin client.guid 同源. */
  machineGuidHex: string
  /** 当前账号 uin, 可选; 没有就等登录完成 SignProxy 自己绑. */
  uin?: number
  /** 接入点 CDN: "cf" (默认) / "china". 决定 base_url + TLS pin. 不传按 cf. */
  cdn?: string
}

/** 发包回调入参: 把 body relay 给 QQ 的 cmd. */
export interface RelayPacket {
  cmd: string
  body: Buffer
  /** [SA 1001 修复] 本命令签名用的 12B sign-token (SecInfo sf2); 仅 SA 带 = token1。
   *  缺省 = Bot 用 session 默认 token (ESK/其它命令走这条)。 */
  signToken?: string
}

/** SDK logger 回调入参: level 是 "warn" / "error". 401/403 fatal 时 SDK 报 error 然后 exit. */
export interface SignLog {
  level: string
  message: string
}

export interface ValidateAuthTokenArgs {
  authToken: string
  /** "cf" | "china"; 省略按 cf。dev build 忽略 (base_url 编译期锁 localhost)。 */
  cdn?: string
}

export interface SignRequestArgs {
  cmd: string
  bodyHex: string
  seq: number
  guidHex: string
  qua: string
  uin: number
  /** QQ 12B session token 的 utf-8 hex (登录后由 acquireSignToken 拿到). 登录前传 "". */
  protocolTokenHex: string
  /**
   * watch 端设备身份: 32B per-install GUID 的 hex (64 chars). 仅 watch 协议需要 —— 后端据此
   * 派生 device_blob 做设备绑定; **不传的话后端用空 blob = 模拟器身份, 真机服务器会拒**。
   * Linux/macOS 省略即可。
   *
   * 注意: 这是手写 loader, 原生侧 napi `#[napi(object)]` 对未知字段是**静默丢弃**的 ——
   * 声明加了但 .node 没重编的话, 传了也白传且不报错。加字段必须连带重编 + sync-to-bot。
   */
  device32Hex?: string
}

export interface SignResultJs {
  sign: Buffer
  token: Buffer
  extra: Buffer
}

export interface AcquireSignTokenArgs {
  uin: number
  qua: string
}

/** acquireSignToken 返回: 12B token + QQ 下发的 TTL(秒, 0 = native 没解析到 ESK field 3). */
export interface AcquireSignTokenResult {
  token: Buffer
  ttlSecs: number
}

export interface PostEnvelopeArgs {
  path: string
  plaintextJson: string
}

let native: Native
export function getSignProxy() {
  try {
    native ??= requireBin(loadPath) as Native
    return native
  } catch (error) {
    const { message } = error as Error
    let hint = ''
    if (isDev) {
      hint = ' (--dev: run `npm run build:dev-bot` in LuckyLillia.SignProxy to sync the dev build)'
    } else if (process.platform === 'win32') {
      // Windows 上 .node 常被杀毒软件误杀/隔离, require 直接报文件缺失或加载失败.
      hint = ` (${loadPath} 可能被杀毒软件删除或隔离, 请检查杀软记录并将其加入白名单)`
    }
    throw new Error(`sign-proxy: failed to load ${loadPath}: ${message}${hint}`)
  }
}
