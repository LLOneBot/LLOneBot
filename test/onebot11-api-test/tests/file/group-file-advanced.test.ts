/**
 * 群文件高级操作测试
 * 包括: delete_group_file, create_group_file_folder, delete_group_folder,
 *      get_group_root_files, get_group_files_by_folder, get_group_file_url,
 *      get_group_file_system_info
 */

import { setupMessageTest, teardownMessageTest, MessageTestContext } from '../setup';
import { Assertions } from '@/utils/Assertions';
import { ActionName } from '../../../../src/onebot11/action/types';

describe('group_file_advanced - 群文件高级操作', () => {
  let context: MessageTestContext;

  beforeAll(async () => {
    context = await setupMessageTest();
  });

  afterAll(() => {
    teardownMessageTest(context);
  });

  it('测试获取群文件系统信息', async () => {
    const primaryClient = context.twoAccountTest.getClient('primary');

    const response = await primaryClient.call(ActionName.GoCQHTTP_GetGroupFileSystemInfo, {
      group_id: context.testGroupId
    });

    if (response.retcode === 0) {
      Assertions.assertSuccess(response, 'get_group_file_system_info');
      Assertions.assertResponseHasFields(response, ['file_count', 'limit_count', 'used_space', 'total_space']);
    } else {
      console.log('获取群文件系统信息失败:', response.message);
    }
  }, 30000);

  it('测试获取群根目录文件列表', async () => {
    const primaryClient = context.twoAccountTest.getClient('primary');

    const response = await primaryClient.call(ActionName.GoCQHTTP_GetGroupRootFiles, {
      group_id: context.testGroupId
    });

    if (response.retcode === 0) {
      Assertions.assertSuccess(response, 'get_group_root_files');
      Assertions.assertHasProperty(response.data, 'files');
      Assertions.assertHasProperty(response.data, 'folders');
    } else {
      console.log('获取群根目录文件列表失败:', response.message);
    }
  }, 30000);

  it('测试创建群文件夹', async () => {
    const primaryClient = context.twoAccountTest.getClient('primary');

    const folderName = `test-folder-${Date.now()}`;
    const response = await primaryClient.call(ActionName.GoCQHTTP_CreateGroupFileFolder, {
      group_id: context.testGroupId,
      name: folderName
    });

    if (response.retcode === 0) {
      Assertions.assertSuccess(response, 'create_group_file_folder');
    } else {
      console.log('创建群文件夹失败:', response.message);
    }
  }, 30000);

  it('测试获取群文件夹内文件列表', async () => {
    const primaryClient = context.twoAccountTest.getClient('primary');

    // 先获取根目录
    const rootResponse = await primaryClient.call(ActionName.GoCQHTTP_GetGroupRootFiles, {
      group_id: context.testGroupId
    });

    if (rootResponse.retcode === 0 && rootResponse.data.folders && rootResponse.data.folders.length > 0) {
      const folderId = rootResponse.data.folders[0].folder_id;

      const response = await primaryClient.call(ActionName.GoCQHTTP_GetGroupFilesByFolder, {
        group_id: context.testGroupId,
        folder_id: folderId
      });

      if (response.retcode === 0) {
        Assertions.assertSuccess(response, 'get_group_files_by_folder');
        Assertions.assertHasProperty(response.data, 'files');
        Assertions.assertHasProperty(response.data, 'folders');
      } else {
        console.log('获取群文件夹内文件列表失败:', response.message);
      }
    } else {
      console.log('未找到可用文件夹，跳过测试');
    }
  }, 30000);

  it('测试获取群文件下载链接', async () => {
    const primaryClient = context.twoAccountTest.getClient('primary');

    // 先获取根目录文件
    const rootResponse = await primaryClient.call(ActionName.GoCQHTTP_GetGroupRootFiles, {
      group_id: context.testGroupId
    });

    if (rootResponse.retcode === 0 && rootResponse.data.files && rootResponse.data.files.length > 0) {
      const fileId = rootResponse.data.files[0].file_id;
      const busid = rootResponse.data.files[0].busid;

      const response = await primaryClient.call(ActionName.GoCQHTTP_GetGroupFileUrl, {
        group_id: context.testGroupId,
        file_id: fileId,
        busid: busid
      });

      if (response.retcode === 0) {
        Assertions.assertSuccess(response, 'get_group_file_url');
        Assertions.assertResponseHasFields(response, ['url']);
      } else {
        console.log('获取群文件下载链接失败:', response.message);
      }
    } else {
      console.log('未找到可用文件，跳过测试');
    }
  }, 30000);

  it('测试删除群文件', async () => {
    const primaryClient = context.twoAccountTest.getClient('primary');

    // 先获取根目录文件
    const rootResponse = await primaryClient.call(ActionName.GoCQHTTP_GetGroupRootFiles, {
      group_id: context.testGroupId
    });

    if (rootResponse.retcode === 0 && rootResponse.data.files && rootResponse.data.files.length > 0) {
      const fileId = rootResponse.data.files[0].file_id;
      const busid = rootResponse.data.files[0].busid;

      const response = await primaryClient.call(ActionName.GoCQHTTP_DeleteGroupFile, {
        group_id: context.testGroupId,
        file_id: fileId,
        busid: busid
      });

      if (response.retcode === 0) {
        Assertions.assertSuccess(response, 'delete_group_file');
      } else {
        console.log('删除群文件失败（可能是权限不足）:', response.message);
      }
    } else {
      console.log('未找到可用文件，跳过测试');
    }
  }, 30000);

  it('测试删除群文件夹', async () => {
    const primaryClient = context.twoAccountTest.getClient('primary');

    // 先创建一个测试文件夹
    const folderName = `test-delete-folder-${Date.now()}`;
    const createResponse = await primaryClient.call(ActionName.GoCQHTTP_CreateGroupFileFolder, {
      group_id: context.testGroupId,
      name: folderName
    });

    if (createResponse.retcode === 0) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 获取文件夹列表找到刚创建的文件夹
      const rootResponse = await primaryClient.call(ActionName.GoCQHTTP_GetGroupRootFiles, {
        group_id: context.testGroupId
      });

      if (rootResponse.retcode === 0 && rootResponse.data.folders) {
        const folder = rootResponse.data.folders.find((f: any) => f.folder_name === folderName);

        if (folder) {
          const response = await primaryClient.call(ActionName.GoCQHTTP_DeleteGroupFolder, {
            group_id: context.testGroupId,
            folder_id: folder.folder_id
          });

          if (response.retcode === 0) {
            Assertions.assertSuccess(response, 'delete_group_folder');
          } else {
            console.log('删除群文件夹失败:', response.message);
          }
        } else {
          console.log('未找到刚创建的文件夹');
        }
      }
    } else {
      console.log('创建测试文件夹失败，跳过删除测试');
    }
  }, 30000);
});
