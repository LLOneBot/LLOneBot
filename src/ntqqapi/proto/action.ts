import { ProtoField, ProtoMessage } from '@saltify/typeproto'

export namespace Action {
  const LongMsgPeer = ProtoMessage.of({
    uid: ProtoField(2, 'string')
  })

  const LongMsgSettings = ProtoMessage.of({
    field1: ProtoField(1, 'uint32'),
    field2: ProtoField(2, 'uint32'),
    field3: ProtoField(3, 'uint32'),
    field4: ProtoField(4, 'uint32')
  })

  export const SendLongMsgReq = ProtoMessage.of({
    info: ProtoField(2, () => ({
      type: ProtoField(1, 'uint32'),
      peer: ProtoField(2, () => LongMsgPeer.model),
      groupCode: ProtoField(3, 'uint32'),
      payload: ProtoField(4, 'bytes')
    })),
    settings: ProtoField(15, () => LongMsgSettings.model)
  })

  export const SendLongMsgResp = ProtoMessage.of({
    result: ProtoField(2, () => ({
      resId: ProtoField(3, 'string')
    })),
    settings: ProtoField(15, () => LongMsgSettings.model)
  })

  export const PullPicsReq = ProtoMessage.of({
    uin: ProtoField(2, 'uint32'),
    field3: ProtoField(3, 'uint32'),
    word: ProtoField(6, 'string'),
    word2: ProtoField(7, 'string'),
    field8: ProtoField(8, 'uint32'),
    field9: ProtoField(9, 'uint32'),
    field14: ProtoField(14, 'uint32')
  })

  export const PullPicsResp = ProtoMessage.of({
    info: ProtoField(3, () => ({
      url: ProtoField(5, 'string')
    }), 'repeated')
  })

  export const RecvLongMsgReq = ProtoMessage.of({
    info: ProtoField(1, () => ({
      peer: ProtoField(1, () => LongMsgPeer.model),
      resId: ProtoField(2, 'string'),
      acquire: ProtoField(3, 'bool')
    })),
    settings: ProtoField(15, () => LongMsgSettings.model)
  })

  export const RecvLongMsgResp = ProtoMessage.of({
    result: ProtoField(1, () => ({
      resId: ProtoField(3, 'string'),
      payload: ProtoField(4, 'bytes')
    })),
    settings: ProtoField(15, () => LongMsgSettings.model)
  })

  export const FetchUserLoginDaysReq = ProtoMessage.of({
    field2: ProtoField(2, 'uint32'),
    json: ProtoField(3, 'string')
  })

  export const FetchUserLoginDaysResp = ProtoMessage.of({
    json: ProtoField(4, 'string')
  })
}
