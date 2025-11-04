import { BaseAction } from '../../BaseAction'
import { ActionName } from '../../types'
import { selfInfo } from '@/common/globalVars'

interface Payload {
  group_id: string,
  album_id: string
  file: string
}

export class UploadGroupAlbum extends BaseAction<Payload, unknown> {
  actionName = ActionName.UploadGroupAlbum

  protected async _handle(payload: Payload): Promise<unknown> {
    return this.ctx.ntWebApi.uploadGroupAlbum(payload.group_id.toString(), selfInfo.uin.toString(), payload.file, 'test', payload.album_id, 'test')
  }
}
