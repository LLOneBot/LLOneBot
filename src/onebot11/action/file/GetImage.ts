import { GetFileBase } from './GetFile'
import { ActionName } from '../types'

export default class GetImage extends GetFileBase {
  actionName = ActionName.GetImage

  protected async _handle(payload: { file: string }) {
    if (!payload.file) {
      throw new Error('参数 file 不能为空')
    }
    return super._handle(payload)
  }
}
