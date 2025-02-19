import { BaseAction, Schema } from '../BaseAction'
import { ActionName } from '../types'
import { SendElement } from '@/ntqqapi/entities'
import { uri2local } from '@/common/utils'
import { createPeer, CreatePeerMode } from '../../helper/createMessage'

interface Payload {
  group_id: number | string
  file: string
  name: string
  folder?: string
  folder_id?: string
}

interface Response {
  file_id: string
}

export class UploadGroupFile extends BaseAction<Payload, Response> {
  actionName = ActionName.GoCQHTTP_UploadGroupFile
  payloadSchema = Schema.object({
    group_id: Schema.union([Number, String]).required(),
    file: Schema.string().required(),
    name: Schema.string(),
    folder: Schema.string(),
    folder_id: Schema.string()
  })

  protected async _handle(payload: Payload) {
    const { success, errMsg, path, fileName } = await uri2local(this.ctx, payload.file)
    if (!success) {
      throw new Error(errMsg)
    }
    const name = payload.name || fileName
    if (name.includes('/') || name.includes('\\')) {
      throw new Error(`文件名 ${name} 不合法`)
    }
    const file = await SendElement.file(this.ctx, path, name, payload.folder ?? payload.folder_id)
    const peer = await createPeer(this.ctx, payload, CreatePeerMode.Group)
    const msg = await this.ctx.app.sendMessage(this.ctx, peer, [file], [])
    return {
      file_id: msg!.elements[0].fileElement!.fileUuid
    }
  }
}
