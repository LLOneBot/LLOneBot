import { Msg, RichMedia } from '@/ntqqapi/proto'
import { Context } from 'cordis'
import { OB11MessageData, OB11MessageDataType } from '../types'
import { encodeCQCode } from '../cqcode'
import { InferProtoModel } from '@saltify/typeproto'

export async function decodeMultiMessage(ctx: Context, items: InferProtoModel<typeof Msg.PbMultiMsgItem>[], messageFormat: 'string' | 'array') {
  return await Promise.all(items[0].buffer!.msg!.map(async msg => {
    const { body, contentHead, routingHead } = msg
    let content: string | OB11MessageData[] = messageFormat === 'string' ? '' : []
    for (const element of body!.richText!.elems!) {
      let segment: OB11MessageData | undefined
      if (element.text) {
        segment = {
          type: OB11MessageDataType.Text,
          data: {
            text: element.text.str!
          }
        }
      } else if (element.commonElem && element.commonElem.serviceType === 48) {
        const richMediaInfo = RichMedia.MsgInfo.decode(element.commonElem.pbElem)
        const infoBody = richMediaInfo.msgInfoBody[0]
        const parsedUrl = new URL('https://' + infoBody.pic!.domain + infoBody.pic!.urlPath + infoBody.pic!.ext!.originalParam)
        const imageAppid = parsedUrl.searchParams.get('appid')
        const rkeyData = await ctx.ntFileApi.rkeyManager.getRkey()
        const url = parsedUrl.href + (imageAppid === '1406' ? rkeyData.private_rkey : rkeyData.group_rkey)
        const { info } = richMediaInfo.msgInfoBody[0].index!
        const { pic } = richMediaInfo.extBizInfo!
        segment = {
          type: OB11MessageDataType.Image,
          data: {
            file: info!.fileName!,
            subType: pic!.bizType!,
            url,
            file_size: info!.fileSize!.toString(),
          }
        }
      }
      if (segment) {
        if (typeof content === 'string') {
          content += encodeCQCode(segment)
        } else {
          content.push(segment)
        }
      }
    }
    return {
      content,
      sender: {
        nickname: routingHead?.group ? routingHead.group.groupCard! : routingHead!.c2c!.friendName!,
        user_id: routingHead!.fromUin!
      },
      time: contentHead!.msgTime!,
      message_format: messageFormat === 'string' ? 'string' : 'array',
      message_type: routingHead?.group ? 'group' : 'private'
    }
  }))
}
