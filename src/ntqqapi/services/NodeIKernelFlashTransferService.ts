import { GeneralCallResult } from '@/ntqqapi/services/common'

export interface NodeIKernelFlashTransferService {
  createFlashTransferUploadTask(timestamp: string, params: {
    scene: number,  // 1
    name: string,
    uploaders: Array<{
      uin: string,
      nickname: string,
      uid: string,
      sendEntrance: string // 可为空字符串
    }>,
    permission: Record<string, any>, // 可为空对象
    coverPath: string,  // 可为空字符串
    paths: string[],
    excludePaths: string[],
    expireLeftTime: number,  // 默认为 0
    isNeedDelExif: boolean,
    coverOriginalInfos: Array<{
      path: string, // 可为空字符串
      thumbnailPath: string // 可为空字符串
    }>,
    uploadSceneType: number // 1
  }): GeneralCallResult & {
    seq: number,
    createFlashTransferResult: {
      fileSetId: string,
      shareLink: string,
      expireTime: string,
      expireLeftTime: string
    }
  }
}
