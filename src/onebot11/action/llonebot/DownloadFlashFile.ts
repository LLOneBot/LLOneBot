import { BaseAction } from '@/onebot11/action/BaseAction'
import { ActionName } from '@/onebot11/action/types'
import { uri2local } from '@/common/utils'

interface Payload {
  share_link?: string
  file_set_id?: string
}


export class DownloadFlashFile extends BaseAction<Payload, void> {
  actionName = ActionName.DownloadFlashFile

  async _handle(payload: Payload) {
    let { share_link, file_set_id } = payload
    if (share_link) {
      // 正则提取 code
      const match = share_link.match(/qfile.qq.com\/q\/([\w\d]+)/)
      if (!match) {
        throw new Error('分享链接格式不正确')
      }
      const code = match[1]
      file_set_id = await this.ctx.ntFileApi.getFlashFileSetIdByCode(code)
    }
    if (!file_set_id) {
      throw new Error('请提供有效的 share_link 或 file_set_id')
    }
    const res = await this.ctx.ntFileApi.downloadFlashFile(file_set_id)
    // return {
    //   message: '闪传文件下载任务已创建，使用 get_flash_file_list 查看状态，或等待上报 notice_type:flash_file',
    // }
  }
}
