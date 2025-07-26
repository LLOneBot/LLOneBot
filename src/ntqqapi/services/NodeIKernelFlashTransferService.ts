import { GeneralCallResult } from '@/ntqqapi/services/common'

import { FlashFileListItem, FlashFileSetInfo } from '@/ntqqapi/types/flashfile'

export interface NodeIKernelFlashTransferService {
  createFlashTransferUploadTask(seq: number, createParam: {
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

  startFileSetDownload(fileSetId: string, sceneType: number, option: { isIncludeCompressInnerFiles: boolean }): GeneralCallResult

  getFileList(req: {
    seq: number
    fileSetId: string
    isUseCache: boolean
    sceneType: number
    reqInfos: {
      count: number
      paginationInfo: Uint8Array
      parentId: string
      reqIndexPath: string
      reqDepth: number
      filterCondition: {
        fileCategory: number
        filterType: number
      },
      sortConditions: { sortField: number, sortOrder: number }[]
      isNeedPhysicalInfoReady: boolean
    }[]
  }): {
    rsp: {
      seq: number,
      result: number,
      errMs: string,
      fileLists:
      FlashFileListItem[]
    }
  }

  getFileSetIdByCode(code: string): GeneralCallResult & {
    fileSetId: string
  }

  getFileSet(req: {
    seq: number
    fileSetId: string
    isUseCache: boolean
    isNoReqSvr: boolean
    sceneType: number
  }): GeneralCallResult & {
    fileSet: FlashFileSetInfo
  }
}
