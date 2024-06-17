import { GetFileBase, GetFilePayload, GetFileResponse } from './GetFile'
import { ActionName } from '../types'
import {decodeSilk} from "@/common/utils/audio";

interface Payload extends GetFilePayload {
  out_format: 'mp3' | 'amr' | 'wma' | 'm4a' | 'spx' | 'ogg' | 'wav' | 'flac'
}

export default class GetRecord extends GetFileBase {
  actionName = ActionName.GetRecord

  protected async _handle(payload: Payload): Promise<{file: string}> {
    let res = await super._handle(payload)
    res.file = await decodeSilk(res.file, payload.out_format)
    return {file: res.file}
  }
}
