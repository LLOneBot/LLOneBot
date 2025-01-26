import { GetFileListParam, Peer } from '../types'
import { GeneralCallResult } from './common'

export interface NodeIKernelRichMediaService {
  getVideoPlayUrlV2(peer: Peer, msgId: string, elemId: string, videoCodecFormat: number, exParams: { downSourceType: number, triggerType: number }): Promise<GeneralCallResult & {
    urlResult: {
      v4IpUrl: []
      v6IpUrl: []
      domainUrl: {
        url: string
        isHttps: boolean
        httpsDomain: string
      }[]
      videoCodecFormat: number
    }
  }>

  deleteGroupFolder(groupCode: string, folderId: string): Promise<GeneralCallResult & { groupFileCommonResult: { retCode: number, retMsg: string, clientWording: string } }>

  createGroupFolder(groupCode: string, folderName: string): Promise<GeneralCallResult & {
    resultWithGroupItem: {
      result: {
        retCode: number
        retMsg: string
        clientWording: string
      }
      groupItem: {
        peerId: string
        type: number
        folderInfo: {
          folderId: string
          parentFolderId: string
          folderName: string
          createTime: number
          modifyTime: number
          createUin: string
          creatorName: string
          totalFileCount: number
          modifyUin: string
          modifyName: string
          usedSpace: string
        }
        fileInfo: null
      }
    }
  }>

  getGroupFileList(groupCode: string, params: GetFileListParam): Promise<GeneralCallResult & {
    groupSpaceResult: {
      retCode: number
      retMsg: string
      clientWording: string
      totalSpace: number
      usedSpace: number
      allUpload: boolean
    }
  }>

  deleteGroupFile(groupCode: string, params: Array<number>, files: Array<string>): Promise<GeneralCallResult & {
    transGroupFileResult: {
      result: unknown
      successFileIdList: Array<unknown>
      failFileIdList: Array<unknown>
    }
  }>

  batchGetGroupFileCount(groupIds: string[]): Promise<GeneralCallResult & {
    groupCodes: string[]
    groupFileCounts: number[]
  }>

  getGroupSpace(groupId: string): Promise<GeneralCallResult & {
    groupSpaceResult: {
      retCode: number
      retMsg: string
      clientWording: string
      totalSpace: string
      usedSpace: string
      allUpload: boolean
    }
  }>

  moveGroupFile(...args: unknown[]): Promise<GeneralCallResult & {
    moveGroupFileResult: {
      result: {
        retCode: number
        retMsg: string
        clientWording: string
      }
      successFileIdList: string[]
      failFileIdList: string[]
    }
  }>

  renameGroupFolder(groupId: string, folderId: string, newFolderName: string): Promise<GeneralCallResult & {
    resultWithGroupItem: {
      result: {
        retCode: number
        retMsg: string
        clientWording: string
      }
      groupItem: {
        peerId: string
        type: number
        folderInfo: {
          folderId: string
          parentFolderId: string
          folderName: string
          createTime: number
          modifyTime: number
          createUin: string
          creatorName: string
          totalFileCount: number
          modifyUin: string
          modifyName: string
          usedSpace: string
        }
        fileInfo: null
      }
    }
  }>
}

