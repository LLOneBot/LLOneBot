import {
  OB11MessageCustomMusic,
  OB11MessageData,
  OB11MessageDataType,
  OB11MessageJson,
  OB11MessageMusic,
  OB11PostSendMsg,
} from '../../types'
import { BaseAction } from '../BaseAction'
import { ActionName } from '../types'
import { CustomMusicSignPostData, IdMusicSignPostData, MusicSign, MusicSignPostData } from '@/common/utils/sign'
import { convertMessage2List, createSendElements, sendMsg, createPeer, CreatePeerMode } from '../../helper/createMessage'

interface ReturnData {
  message_id: number
}

export class SendMsg extends BaseAction<OB11PostSendMsg, ReturnData> {
  actionName = ActionName.SendMsg

  protected async _handle(payload: OB11PostSendMsg) {
    let contextMode = CreatePeerMode.Normal
    if (payload.message_type === 'group') {
      contextMode = CreatePeerMode.Group
    } else if (payload.message_type === 'private') {
      contextMode = CreatePeerMode.Private
    }
    const peer = await createPeer(this.ctx, payload, contextMode)
    const messages = convertMessage2List(
      payload.message,
      payload.auto_escape === true || payload.auto_escape === 'true',
    )
    if (this.getSpecialMsgNum(messages, OB11MessageDataType.node)) {
      throw new Error('请使用 /send_group_forward_msg 或 /send_private_forward_msg 发送合并转发')
    }
    else if (this.getSpecialMsgNum(messages, OB11MessageDataType.music)) {
      const music = messages[0] as OB11MessageMusic
      if (music) {
        const { musicSignUrl } = this.adapter.config
        if (!musicSignUrl) {
          throw '音乐签名地址未配置'
        }
        const { type } = music.data
        if (!['qq', '163', 'custom'].includes(type)) {
          throw `不支持的音乐类型 ${type}`
        }
        const postData: MusicSignPostData = { ...music.data }
        if (type === 'custom' && music.data.content) {
          const data = postData as CustomMusicSignPostData
          data.singer = music.data.content
          delete (data as OB11MessageCustomMusic['data']).content
        }
        if (type === 'custom') {
          const customMusicData = music.data as CustomMusicSignPostData
          if (!customMusicData.url) {
            throw '自定义音卡缺少参数url'
          }
          if (!customMusicData.audio) {
            throw '自定义音卡缺少参数audio'
          }
          if (!customMusicData.title) {
            throw '自定义音卡缺少参数title'
          }
        }
        if (type === 'qq' || type === '163') {
          const idMusicData = music.data as IdMusicSignPostData
          if (!idMusicData.id) {
            throw '音乐卡片缺少id参数'
          }
        }
        let jsonContent: string
        try {
          jsonContent = await new MusicSign(this.ctx, musicSignUrl).sign(postData)
          if (!jsonContent) {
            throw '音乐消息生成失败，提交内容有误或者签名服务器签名失败'
          }
        } catch (e) {
          throw `签名音乐消息失败：${e}`
        }
        messages[0] = {
          type: OB11MessageDataType.json,
          data: { data: jsonContent },
        } as OB11MessageJson
      }
    }
    const { sendElements, deleteAfterSentFiles } = await createSendElements(this.ctx, messages, peer)
    if (sendElements.length === 1) {
      if (sendElements[0] === null) {
        return { message_id: 0 }
      }
    }
    const returnMsg = await sendMsg(this.ctx, peer, sendElements, deleteAfterSentFiles)
    if (!returnMsg) {
      throw new Error('消息发送失败')
    }
    return { message_id: returnMsg.msgShortId! }
  }

  private getSpecialMsgNum(message: OB11MessageData[], msgType: OB11MessageDataType): number {
    if (Array.isArray(message)) {
      return message.filter((msg) => msg.type === msgType).length
    }
    return 0
  }
}

export default SendMsg
