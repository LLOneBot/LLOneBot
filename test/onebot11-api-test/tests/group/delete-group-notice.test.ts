/**
 * delete_group_notice 接口测试
 * 测试删除群公告功能
 */

import { setupMessageTest, teardownMessageTest, MessageTestContext } from '../setup';
import { Assertions } from '@/utils/Assertions';
import { ActionName } from '../../../../src/onebot11/action/types';

describe('delete_group_notice - 删除群公告', () => {
  let context: MessageTestContext;

  beforeAll(async () => {
    context = await setupMessageTest();
  });

  afterAll(() => {
    teardownMessageTest(context);
  });

  it.skip('测试删除群公告 (需要先创建公告)', async () => {
    // 此测试需要先创建一个公告，然后再删除
    const primaryClient = context.twoAccountTest.getClient('primary');

    // 先发送一个公告
    const sendResponse = await primaryClient.call(ActionName.GoCQHTTP_SendGroupNotice, {
      group_id: context.testGroupId,
      content: `测试公告_${Date.now()}`
    });

    Assertions.assertSuccess(sendResponse, 'send_group_notice');

    // 获取公告列表
    const listResponse = await primaryClient.call(ActionName.GoCQHTTP_GetGroupNotice, {
      group_id: context.testGroupId
    });

    if (listResponse.data && listResponse.data.length > 0) {
      const noticeId = listResponse.data[0].notice_id;

      // 删除公告
      const deleteResponse = await primaryClient.call(ActionName.DeleteGroupNotice, {
        group_id: context.testGroupId,
        notice_id: noticeId
      });

      Assertions.assertSuccess(deleteResponse, 'delete_group_notice');
    }
  }, 60000);
});
