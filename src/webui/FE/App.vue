<template>
  <el-container class="main-container">
    <el-header class="header">
      <h2 style="display:inline-block;">LLTwoBot</h2>
    </el-header>
    <el-main v-loading="loading">
      <el-row :gutter="24" justify="center">
        <el-col :xs="24" :sm="22" :md="20" :lg="16" :xl="12">
          <el-card shadow="hover" class="config-card">
            <div class="account-info" style="margin-bottom: 12px; text-align: right;">
              {{ accountNick }} <span v-if="accountUin">({{ accountUin }})</span>
            </div>
            <el-menu mode="horizontal" :default-active="activeIndex" @select="handleSelect">
              <el-menu-item index="1">OneBot 11 配置</el-menu-item>
              <el-menu-item index="2">Satori 配置</el-menu-item>
              <el-menu-item index="3">其他配置</el-menu-item>
            </el-menu>
            <el-form :model="form" label-width="160px" size="large" class="config-form">
              <div v-if="activeIndex === '1'">
                <el-divider content-position="left">
                  OneBot 11 协议
                </el-divider>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="启用 OneBot 11">
                      <el-switch v-model="form.ob11.enable" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="OneBot 11 Token">
                      <el-input v-model="form.ob11.token" placeholder="请输入 Token" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="启用正向 WS 服务">
                      <el-switch v-model="form.ob11.enableWs" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="正向 WS 端口">
                      <el-input-number v-model="form.ob11.wsPort" :min="1" :max="65535" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="启用反向 WS 服务">
                      <el-switch v-model="form.ob11.enableWsReverse" />
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-form-item label="反向 WS 地址">
                  <el-input
                    v-model="wsReverseUrlInput"
                    placeholder="输入后回车添加"
                    @keyup.enter="addWsReverseUrl"
                    clearable
                  />
                  <div class="tag-list">
                    <el-tag
                      v-for="(url, idx) in form.ob11.wsReverseUrls"
                      :key="url"
                      closable
                      @close="removeWsReverseUrl(idx)"
                      style="margin-right: 4px; margin-top: 4px;"
                    >{{ url }}
                    </el-tag>
                  </div>
                </el-form-item>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="启用 HTTP 服务">
                      <el-switch v-model="form.ob11.enableHttp" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="HTTP 端口">
                      <el-input-number v-model="form.ob11.httpPort" :min="1" :max="65535" />
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="启用 HTTP 上报">
                      <el-switch v-model="form.ob11.enableHttpPost" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="启用 HTTP 心跳">
                      <el-switch v-model="form.ob11.enableHttpHeart" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="HTTP 上报地址">
                  <el-input
                    v-model="httpPostUrlInput"
                    placeholder="输入后回车添加"
                    @keyup.enter="addHttpPostUrl"
                    clearable
                  />
                  <div class="tag-list">
                    <el-tag
                      v-for="(url, idx) in form.ob11.httpPostUrls"
                      :key="url"
                      closable
                      @close="removeHttpPostUrl(idx)"
                      style="margin-right: 4px; margin-top: 4px;"
                    >{{ url }}
                    </el-tag>
                  </div>
                </el-form-item>
                <el-form-item label="HTTP 上报密钥">
                  <el-input v-model="form.ob11.httpSecret" placeholder="请输入密钥" clearable />
                </el-form-item>

                <el-divider content-position="left">
                  上报消息设置
                </el-divider>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="消息上报格式">
                      <el-radio-group v-model="form.ob11.messagePostFormat">
                        <el-radio label="array">消息段</el-radio>
                        <el-radio label="string">CQ码</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="上报自己发出的消息">
                      <el-switch v-model="form.ob11.reportSelfMessage" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div v-if="activeIndex === '2'">
                <el-divider content-position="left">
                  <el-icon>
                    <i-ep-cpu />
                  </el-icon>
                  Satori 协议
                </el-divider>
                <el-row :gutter="20" class="satori-row">
                  <el-col :span="8">
                    <el-form-item>
                      <template #label>启用 Satori</template>
                      <el-switch v-model="form.satori.enable" style="width: 100%;" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <template #label>Satori 端口</template>
                      <el-input-number v-model="form.satori.port" :min="1" :max="65535" style="width: 100%;" />
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row :gutter="20" class="satori-row">
                  <el-col :span="20">
                    <el-form-item>
                      <template #label>Satori Token</template>
                      <el-input v-model="form.satori.token" placeholder="Satori Token" clearable style="width: 100%;" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div v-if="activeIndex === '3'">
                <el-divider content-position="left">
                  全局设置
                </el-divider>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="心跳间隔 (ms)">
                      <el-input-number v-model="form.heartInterval" :min="1000" :max="600000" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="本地文件转URL">
                      <el-switch v-model="form.enableLocalFile2Url" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="调试模式">
                      <el-switch v-model="form.debug" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="日志">
                      <el-switch v-model="form.log" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="自动删除收到的文件">
                      <el-switch v-model="form.autoDeleteFile" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="自动删除文件时间 (秒)">
                      <el-input-number v-model="form.autoDeleteFileSecond" :min="1" :max="3600" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="音乐签名地址">
                  <el-input v-model="form.musicSignUrl" placeholder="请输入音乐签名地址" clearable />
                </el-form-item>
                <el-form-item label="消息缓存过期 (秒)">
                  <el-input-number v-model="form.msgCacheExpire" :min="1" :max="86400" />
                </el-form-item>
                <el-form-item label="只监听本地地址">
                  <el-switch v-model="form.onlyLocalhost" />
                  <el-tooltip content="取消则监听0.0.0.0，暴露在公网请务必填写 Token ！" placement="top">
                    <el-icon class="info-icon">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </el-form-item>
              </div>
              <el-form-item class="form-actions">
                <el-button type="primary" @click="onSave" size="large" style="float: right;" :loading="loading">保存配置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <el-dialog
      v-model="showTokenDialog"
      title="请输入 WebUI 密码"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="350px"
      @close="handleTokenDialogClose"
    >
      <el-input
        v-model="tokenInput"
        placeholder="请输入密码"
        show-password
        @keyup.enter="handleTokenDialogConfirm"
        :disabled="tokenDialogLoading"
      />
      <div v-if="tokenDialogError" style="color: red; margin-top: 8px;">{{ tokenDialogError }}</div>
      <template #footer>
        <el-button @click="handleTokenDialogConfirm" type="primary" :loading="tokenDialogLoading">确定</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElDialog, ElInput, ElButton } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'

// Token logic
const tokenKey = 'webui_token'
const token = ref(localStorage.getItem(tokenKey) || '')
const showTokenDialog = ref(false)
const tokenInput = ref('')
const tokenDialogLoading = ref(false)
const tokenDialogError = ref('')

async function setToken(newToken: string) {
  // 先请求后端
  try {
    const resp = await fetch('/api/set-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: newToken })
    })
    const data = await resp.json()
    if (!data.success) {
      throw new Error(data.message || '设置密码失败')
    }
    token.value = newToken
    localStorage.setItem(tokenKey, newToken)
    ElMessage.success('密码设置成功')
  } catch (e: any) {
    ElMessage.error(e.message || '设置密码失败')
    throw e
  }
}

// 弹出密码输入框，直到用户输入非空密码并点击确定/回车才resolve
async function promptPassword(tip: string): Promise<string> {
  return new Promise<string>((resolve) => {
    tokenDialogError.value = ''
    tokenInput.value = ''
    showTokenDialog.value = true
    tokenDialogError.value = tip
    async function onConfirm() {
      const pwd = tokenInput.value.trim()
      if (!pwd) {
        tokenDialogError.value = '密码不能为空'
        return
      }
      showTokenDialog.value = false
      resolve(pwd)
    }
    // 监听弹窗关闭（防止用户点ESC或X关闭）
    const stopShow = watch(showTokenDialog, (val) => {
      if (!val) {
        stopShow()
      }
    })
    // 监听确定按钮
    handleTokenDialogConfirm = onConfirm
  })
}

// 包装 fetch，自动带 token
async function apiFetch(url: string, options: any = {}): Promise<Response> {
  options.headers = options.headers || {}
  if (token.value) {
    options.headers['x-webui-token'] = token.value
  }
  let resp = await fetch(url, options)
  // 如果不是401/403，直接返回
  if (resp.status !== 401 && resp.status !== 403) {
    return resp
  }
  while (resp.status === 401 || resp.status === 403) {
    if (resp.status === 401) {
      token.value = ''
      localStorage.removeItem(tokenKey)
      const inputPwd = await promptPassword('请设置密码')
      // 401时需要setToken
      try {
        await setToken(inputPwd)
      } catch {
        throw new Error('设置密码失败')
      }
      tokenInput.value = ''
    }
    else if (resp.status === 403) {
      token.value = ''
      localStorage.removeItem(tokenKey)
      const inputPwd = await promptPassword('密码校验失败，请输入密码')
      // 403时只保存本地密码，不调用setToken
      token.value = inputPwd
      localStorage.setItem(tokenKey, token.value)
      tokenInput.value = ''
    }
    // 重新带新密码请求
    options.headers['x-webui-token'] = token.value
    resp = await fetch(url, options)
    if (resp.status !== 401 && resp.status !== 403) {
      return resp
    }
  }
  return resp
}

const defaultConfig = {
  satori: { enable: false, port: 5600, token: '' },
  ob11: {
    enable: true,
    token: '',
    httpPort: 3000,
    httpPostUrls: [],
    httpSecret: '',
    wsPort: 3001,
    wsReverseUrls: [],
    enableHttp: true,
    enableHttpPost: true,
    enableWs: true,
    enableWsReverse: false,
    messagePostFormat: 'array',
    enableHttpHeart: false,
    reportSelfMessage: true,
  },
  heartInterval: 60000,
  enableLocalFile2Url: false,
  debug: false,
  log: true,
  autoDeleteFile: false,
  autoDeleteFileSecond: 60,
  musicSignUrl: '',
  msgCacheExpire: 120,
  onlyLocalhost: true,
}

const form = ref(JSON.parse(JSON.stringify(defaultConfig)))
const activeIndex = ref('1')

const httpPostUrlInput = ref('')
const wsReverseUrlInput = ref('')
const loading = ref(false)

const accountNick = ref('')
const accountUin = ref('')

// 获取配置
async function fetchConfig() {
  try {
    loading.value = true
    const resp = await apiFetch('/api/config')
    const data = await resp.json()
    if (data.success) {
      // 兼容新格式
      if (data.data.config && data.data.selfInfo) {
        form.value = data.data.config
        accountNick.value = data.data.selfInfo.nick || ''
        accountUin.value = data.data.selfInfo.uin || ''
      } else {
        form.value = data.data
        accountNick.value = ''
        accountUin.value = ''
      }
      console.log('config接口返回:', data)
      ElMessage.success('配置加载成功')
    } else {
      throw new Error(data.message || '获取配置失败')
    }
  } catch (error: any) {
    ElMessage.error(`获取配置失败: ${error.message || String(error)}`)
    console.error('获取配置失败:', error)
  } finally {
    loading.value = false
  }
}

// 保存配置
async function onSave() {
  // 校验 ws 反向输入框
  const wsVal = wsReverseUrlInput.value.trim()
  if (wsVal && !/^wss?:\/\//.test(wsVal)) {
    ElMessage.error('反向WS地址必须以 ws:// 或 wss:// 开头')
    return
  }
  // 校验 http 上报输入框
  const httpVal = httpPostUrlInput.value.trim()
  if (httpVal && !/^https?:\/\//.test(httpVal)) {
    ElMessage.error('HTTP上报地址必须以 http:// 或 https:// 开头')
    return
  }
  // 自动添加输入框内容到列表
  if (wsVal && !form.value.ob11.wsReverseUrls.includes(wsVal)) {
    form.value.ob11.wsReverseUrls.push(wsVal)
    wsReverseUrlInput.value = ''
  }
  if (httpVal && !form.value.ob11.httpPostUrls.includes(httpVal)) {
    form.value.ob11.httpPostUrls.push(httpVal)
    httpPostUrlInput.value = ''
  }
  try {
    loading.value = true
    const resp = await apiFetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    const data = await resp.json()
    if (data.success) {
      ElMessage.success('配置保存成功')
    } else {
      throw new Error(data.message || '保存配置失败')
    }
  } catch (error: any) {
    ElMessage.error(`保存配置失败: ${error.message || String(error)}`)
    console.error('保存配置失败:', error)
  } finally {
    loading.value = false
  }
}

// 页面加载时获取配置
onMounted(() => {
  fetchConfig()
})

function addHttpPostUrl() {
  const val = httpPostUrlInput.value.trim()
  if (val && !form.value.ob11.httpPostUrls.includes(val)) {
    form.value.ob11.httpPostUrls.push(val)
  }
  httpPostUrlInput.value = ''
}

function removeHttpPostUrl(idx: number) {
  form.value.ob11.httpPostUrls.splice(idx, 1)
}

function addWsReverseUrl() {
  const val = wsReverseUrlInput.value.trim()
  if (val && !form.value.ob11.wsReverseUrls.includes(val)) {
    form.value.ob11.wsReverseUrls.push(val)
  }
  wsReverseUrlInput.value = ''
}

function removeWsReverseUrl(idx: number) {
  form.value.ob11.wsReverseUrls.splice(idx, 1)
}

function handleSelect(key: string) {
  activeIndex.value = key
}

// 修改handleTokenDialogConfirm为let变量，便于promptPassword里动态赋值
let handleTokenDialogConfirm = async () => {}

function handleTokenDialogClose() {
  tokenDialogError.value = ''
  return true
}
</script>

<style scoped>
.main-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f3fa 0%, #e8f0fe 100%);
}

.header {
  text-align: center;
  margin-bottom: 24px;
  background: transparent;
  padding-top: 32px;
  padding-bottom: 0;
}

.logo {
  font-size: 40px;
  color: #409eff;
  vertical-align: middle;
  margin-bottom: 8px;
}

.config-card {
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(64, 158, 255, 0.08);
  background: #fff;
  padding: 32px 24px 16px 24px;
}

.config-form {
  margin-top: 8px;
}

.el-divider {
  margin-top: 32px;
  margin-bottom: 18px;
  font-size: 18px;
  color: #409eff;
  font-weight: bold;
}

.form-actions {
  float: right;
}

.tag-list {
  margin-top: 4px;
}

.satori-row {
  margin-bottom: 18px;
}

.info-icon {
  margin-left: 8px;
  color: #909399;
}

.account-info {
  float: right;
  margin-top: 12px;
  font-size: 16px;
  color: #666;
}

@media (max-width: 600px) {
  .config-card {
    padding: 12px 2px 8px 2px;
  }

  .header {
    padding-top: 12px;
  }

  .el-divider {
    font-size: 15px;
  }
}
</style>
