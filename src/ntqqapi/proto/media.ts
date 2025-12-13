import { ProtoField, ProtoMessage } from '@saltify/typeproto'

export namespace Media {
  export const IndexNode = ProtoMessage.of({
    info: ProtoField(1, {
      fileSize: ProtoField(1, 'uint32'),
      md5HexStr: ProtoField(2, 'string'),
      sha1HexStr: ProtoField(3, 'string'),
      fileName: ProtoField(4, 'string'),
      fileType: ProtoField(5, {
        type: ProtoField(1, 'uint32'),
        picFormat: ProtoField(2, 'uint32'),
        videoFormat: ProtoField(3, 'uint32'),
        pttFormat: ProtoField(4, 'uint32')
      }),
      width: ProtoField(6, 'uint32'),
      height: ProtoField(7, 'uint32'),
      time: ProtoField(8, 'uint32'),
      original: ProtoField(9, 'uint32')
    }),
    fileUuid: ProtoField(2, 'string'),
    storeID: ProtoField(3, 'uint32'),
    uploadTime: ProtoField(4, 'uint32'),
    expire: ProtoField(5, 'uint32'),
    type: ProtoField(6, 'uint32')
  })

  export const NTV2RichMediaReq = ProtoMessage.of({
    reqHead: ProtoField(1,{
      common: ProtoField(1, {
        requestId: ProtoField(1, 'uint32'),
        command: ProtoField(2, 'uint32')
      }),
      scene: ProtoField(2, {
        requestType: ProtoField(101, 'uint32'),
        businessType: ProtoField(102, 'uint32'),
        field103: ProtoField(103, 'uint32'),
        sceneType: ProtoField(200, 'uint32'),
        c2c: ProtoField(201, {
          accountType: ProtoField(1, 'uint32'),
          targetUid: ProtoField(2, 'string')
        }),
        group: ProtoField(202, {
          groupId: ProtoField(1, 'uint32')
        })
      }),
      client: ProtoField(3, {
        agentType: ProtoField(1, 'uint32')
      })
    }),
    download: ProtoField(3, {
      node: ProtoField(1, IndexNode)
    })
  })

  export const MsgInfo = ProtoMessage.of({
    msgInfoBody: ProtoField(1, {
      index: ProtoField(1, IndexNode),
      pic: ProtoField(2, {
        urlPath: ProtoField(1, 'string'),
        ext: ProtoField(2, {
          originalParam: ProtoField(1, 'string'),
          bigParam: ProtoField(2, 'string'),
          thumbParam: ProtoField(3, 'string')
        }),
        domain: ProtoField(3, 'string')
      }),
      fileExist: ProtoField(5, 'bool')
    }, 'repeated'),
    extBizInfo: ProtoField(2, {
      pic: ProtoField(1, {
        bizType: ProtoField(1, 'uint32'),
        summary: ProtoField(2, 'string'),
        fromScene: ProtoField(1001, 'uint32'),
        toScene: ProtoField(1002, 'uint32'),
        oldFileId: ProtoField(1003, 'uint32')
      }),
      video: ProtoField(2, {
        pbReserve: ProtoField(3, 'bytes')
      }),
      busiType: ProtoField(10, 'uint32')
    })
  })

  export const FileIdInfo = ProtoMessage.of({
    sha1: ProtoField(2, 'bytes'),
    size: ProtoField(3, 'uint32'),
    appid: ProtoField(4, 'uint32'),
    time: ProtoField(5, 'uint32'),
    expire: ProtoField(10, 'uint32')
  })

  export const NTV2RichMediaResp = ProtoMessage.of({
    download: ProtoField(3, {
      rKeyParam: ProtoField(1, 'string'),
      rKeyTtlSecond: ProtoField(2, 'uint32'),
      info: ProtoField(3, {
        domain: ProtoField(1, 'string'),
        urlPath: ProtoField(2, 'string'),
        httpsPort: ProtoField(3, 'uint32')
      }),
      rKeyCreateTime: ProtoField(4, 'uint32')
    })
  })
}
