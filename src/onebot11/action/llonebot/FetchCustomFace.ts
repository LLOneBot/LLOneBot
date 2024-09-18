import { BaseAction, Schema } from '../BaseAction'
import { ActionName } from '../types'

interface Payload {
  count: number | string
}

export class FetchCustomFace extends BaseAction<Payload, string[]> {
  actionName = ActionName.FetchCustomFace
  payloadSchema = Schema.object({
    count: Schema.union([Number, String]).default(48)
  })

  async _handle(payload: Payload) {
    const ret = await this.ctx.ntMsgApi.fetchFavEmojiList(+payload.count)
    return ret.emojiInfoList.map(e => e.url)
  }
}
