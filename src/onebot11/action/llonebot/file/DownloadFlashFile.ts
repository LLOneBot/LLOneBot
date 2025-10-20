import { ActionName } from '@/onebot11/action/types'
import { GetFlashFileInfoBase, GetFlashFilePayload } from '@/onebot11/action/llonebot/file/GetFlashFileInfo'


export class DownloadFlashFile extends GetFlashFileInfoBase<null> {
  actionName = ActionName.DownloadFlashFile

  async _handle(payload: GetFlashFilePayload) {
    const file_set_id = await this.get_file_set_id(payload)
    const res = await this.ctx.ntFileApi.downloadFlashFile(file_set_id)
    // return {
    //   message: '闪传文件下载任务已创建，等待上报 notice_type:flash_file 获取下载状态',
    // }
    return null
  }
}
