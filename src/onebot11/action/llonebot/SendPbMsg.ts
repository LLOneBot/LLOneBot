import {
  OB11MessageKeyboard,
  OB11MessageText,
} from '../../types'
import { BaseAction } from '../BaseAction'
import { ActionName } from '../types'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

export class WasmModule {
  private instance: WebAssembly.Instance
  private memory: WebAssembly.Memory
  private wasmPath: string

  private constructor(
    wasmPath: string,
    instance: WebAssembly.Instance,
    memory: WebAssembly.Memory
  ) {
    this.wasmPath = wasmPath
    this.instance = instance
    this.memory = memory
  }

  static async create(wasmPath: string): Promise<WasmModule> {
    const fullPath = resolve(wasmPath)
    const buffer = await readFile(fullPath)
    const { instance } = await WebAssembly.instantiate(buffer)

    const mem = instance.exports.memory
    if (!(mem instanceof WebAssembly.Memory)) {
      throw new Error('Exported memory not found or invalid')
    }

    return new WasmModule(wasmPath, instance, mem)
  }

  get exports() {
    return this.instance.exports
  }

  writeString(str: string): number {
    const encoder = new TextEncoder()
    const bytes = encoder.encode(str + '\0')
    const malloc = this.exports.malloc as (size: number) => number
    const ptr = malloc(bytes.length)
    const mem = new Uint8Array(this.memory.buffer, ptr, bytes.length)
    mem.set(bytes)
    return ptr
  }

  readCString(ptr: number): string {
    const mem = new Uint8Array(this.memory.buffer)
    let end = ptr
    while (mem[end] !== 0) end++
    return new TextDecoder().decode(mem.slice(ptr, end))
  }

  free(ptr: number): void {
    const freeFn = this.exports.free_ptr as (ptr: number) => void
    freeFn(ptr)
  }
}

interface PBData{
  cmd: string
  hex: string
  echo?: string
}

interface Payload {
  message_type?: 'private' | 'group' | 'user'
  user_id?: string | number
  group_id?: string | number
  peer_id?: number
  message: (OB11MessageKeyboard | OB11MessageText)[]
  messages?: (OB11MessageKeyboard | OB11MessageText)[]
  seq?: Number
  random_number?: Number
}

export class SendPbMsg extends BaseAction<Payload, PBData> {
  actionName = ActionName.SendPbMsg

  protected async _handle(payload: Payload) {
    payload.message = payload.message || payload.messages

    if (payload.message_type === 'private') {
      payload.message_type = 'user'
    }

    if (!payload.seq) {
      payload.seq = Math.floor(Math.random() * 0xffffffff)
    }

    if (!payload.random_number) {
      payload.random_number = Math.floor(Math.random() * 0xffffffff)
    }

    if (payload.group_id) {
      payload.peer_id = Number(payload.group_id)
      payload.message_type = 'group'
    } else if (payload.user_id) {
      payload.peer_id = Number(payload.user_id)
      payload.message_type = 'user'
    } else if (!(payload.peer_id && payload.message_type))
      throw new Error('请输入user_id或group_id。')

    const json_payload = JSON.stringify(payload)
    const wasm = await WasmModule.create('./qq_msg_encoding.wasm')
    const json_payload_ptr = wasm.writeString(json_payload)

    const encodeFromJson = wasm.exports.encode_from_json as (ptr: number) => number
    const result_ptr = encodeFromJson(json_payload_ptr)
    if (result_ptr == 0) {
      throw new Error("无法解析的数据,请检查输入")
    }
    const hex_result: string = wasm.readCString(result_ptr)

    wasm.free(json_payload_ptr)
    wasm.free(result_ptr)

    let result = await this.ctx.app.pmhq.sendPB("MessageSvc.PbSendMsg",hex_result)

    return {
      cmd: result.cmd,
      hex: result.pb,
      ...(result.echo !== undefined ? { echo: result.echo } : {})
    }
  }
}

export default SendPbMsg
