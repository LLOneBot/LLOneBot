export enum FlashFileDownloadStatus {
  DOWNLOADING = 1,
  DOWNLOADED = 2,
}

export enum FlashFileUploadStatus {
  // UPLOADING = 1,
  UPLOADED = 4,
}

export interface FlashFileSetInfo {
  fileSetId: string,
  name: string,
  totalFileCount: string,
  totalFileSize: string,
  shareInfo: {
    shareLink: string,
    extractionCode: string
  },
  uploaders: Array<{
    uin: string,
    nickname: string,
    uid: string,
    sendEntrance: string
  }>,
  uploadInfo: {
    totalUploadedFileSize: string,
    successCount: number,
    failedCount: number
  },
  expireTime: string,
  expireLeftTime: number,
  status: number,  // 2 是 ok？
  uploadStatus: FlashFileUploadStatus,
  downloadStatus: number, // 0 是未下载?
}


export interface FlashFileUploadingInfo {
  uploadedFileCount: string
  failedFileCount: string
  totalFileCount: string
  uploadedFileSize: string
  uploadSpeed: string, // 上传速度，字节每秒
  vipUploadSpeed: string,  // VIP 上传速度，字节每秒
  timeRemain: string, // 剩余时间，单位秒
  reportSpeed: string // 字节每秒，暂时不知这个字段作用
}

export interface FlashFileDownloadingInfo {
  curDownLoadFailFileNum: number,
  curDownLoadedPauseFileNum: number,
  curDownLoadedFileNum: number,
  curDownloadingFileNum: number,
  totalDownLoadedFileNum: number,
  curDownLoadedBytes: string,
  totalDownLoadedBytes: string,
  curSpeedBps: number,
  avgSpeedBps: number,
  maxSpeedBps: number,
  remainDownLoadSeconds: number,
  failFileIdList: string[],
  allFileIdList: string[],
  hasNormalFileDownloading: boolean,
  onlyCompressInnerFileDownloading: boolean,
  isAllFileAlreadyDownloaded: boolean,
  saveFileSetDir: string,
  allWaitingStatusTask: boolean,
  downloadSceneType: number,
  retryCount: number
}

export interface FlashFileListItem {
  fileList: {
    fileSetId: string,
    cliFileId: string,
    fileType: number,
    name: string,
    fileSize: string,
    saveFilePath?: string,
    status: number,
    uploadStatus: number,  // 3 是完成
    downloadStatus: number, // 3 是完成
    filePhysicalSize: string,
    physical: {
      id: string,
      status: number, // 2 是已完成?
      localPath: string,
    }
  }[],
  isEnd: boolean,
  isCache: boolean
}
