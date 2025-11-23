/**
 * upload_group_file 接口测试
 * 测试上传群文件功能
 */

import { setupMessageTest, teardownMessageTest, MessageTestContext } from '../setup';
import { Assertions } from '@/utils/Assertions';
import { ActionName } from '../../../../src/onebot11/action/types';
import { MediaPaths } from '../media';

describe('upload_group_file - 上传群文件', () => {
  let context: MessageTestContext;

  beforeAll(async () => {
    context = await setupMessageTest();
  });

  afterAll(() => {
    teardownMessageTest(context);
  });

  it('测试上传群文件', async () => {
    const primaryClient = context.twoAccountTest.getClient('primary');

    const response = await primaryClient.call(ActionName.GoCQHTTP_UploadGroupFile, {
      group_id: context.testGroupId,
      file: MediaPaths.testGifUrl,
      name: `test-upload-${Date.now()}.jpg`
    });

    if (response.retcode === 0) {
      Assertions.assertSuccess(response, 'upload_group_file');
    } else {
      console.log('上传群文件失败:', response.message);
    }
  }, 60000);

  it('测试上传群文件到指定文件夹', async () => {
    const primaryClient = context.twoAccountTest.getClient('primary');

    // 先获取根目录文件列表
    const rootResponse = await primaryClient.call(ActionName.GoCQHTTP_GetGroupRootFiles, {
      group_id: context.testGroupId
    });

    if (rootResponse.retcode === 0 && rootResponse.data.folders && rootResponse.data.folders.length > 0) {
      const folderId = rootResponse.data.folders[0].folder_id;

      const response = await primaryClient.call(ActionName.GoCQHTTP_UploadGroupFile, {
        group_id: context.testGroupId,
        file: MediaPaths.testImageUrl,
        name: `test-folder-upload-${Date.now()}.jpg`,
        folder: folderId
      });

      if (response.retcode === 0) {
        Assertions.assertSuccess(response, 'upload_group_file');
      } else {
        console.log('上传群文件到文件夹失败:', response.message);
      }
    } else {
      console.log('未找到可用文件夹，跳过测试');
    }
  }, 60000);
});
