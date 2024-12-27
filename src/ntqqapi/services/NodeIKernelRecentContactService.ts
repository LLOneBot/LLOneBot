import { GeneralCallResult } from './common'
import { Dict } from 'cosmokit'

export interface NodeIKernelRecentContactService {
  getRecentContactListSnapShot(count: number): Promise<GeneralCallResult & {
    info: {
      errCode: number
      errMsg: string
      sortedContactList: string[]
      changedList: {
        id: string
        contactId: string
        sortField: string
        chatType: number
        senderUid: string
        senderUin: string
        peerUid: string
        peerUin: string
        msgSeq: string
        c2cClientMsgSeq: string
        msgUid: string
        msgRandom: string
        msgTime: string
        sendRemarkName: string
        sendMemberName: string
        sendNickName: string
        peerName: string
        remark: string
        memberName: unknown
        avatarUrl: string
        avatarPath: string
        abstractContent: Dict[]
        sendStatus: number
        topFlag: number
        topFlagTime: string
        draftFlag: number
        draftTime: string
        specialCareFlag: number
        sessionType: number
        shieldFlag: string
        atType: number
        draft: unknown[]
        hiddenFlag: number
        keepHiddenFlag: number
        isMsgDisturb: boolean
        nestedSortedContactList: unknown[]
        nestedChangedList: unknown[]
        unreadCnt: string
        unreadChatCnt: number
        unreadFlag: string
        isBeat: boolean
        isOnlineMsg: boolean
        msgId: string
        notifiedType: number
        isBlock: boolean
        listOfSpecificEventTypeInfosInMsgBox: unknown[]
        guildContactInfo: unknown
        vasPersonalInfo: Dict
        vasMsgInfo: Dict
        anonymousFlag: number
        extBuffer: unknown
        extAttrs: unknown[]
        liteBusiness: Map<unknown, unknown>
      }[]
      dataBuffer: Uint8Array
    }
  }>
}
