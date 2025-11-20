/**
 * set_group_leave 接口测试
 * 测试退出群组功能
 * 
 * 警告: 此测试会实际退出群组，请谨慎使用
 */

import { setupMessageTest, teardownMessageTest, MessageTestContext } from '../setup';
import { Assertions } from '@/utils/Assertions';

describe.skip('set_group_leave - 退出群组', () => {
  let context: MessageTestContext;

  beforeAll(async () => {
    context = await setupMessageTest();
  });

  afterAll(() => {
    teardownMessageTest(context);
  });

  it('测试退出群组', async () => {
    const primaryClient = context.twoAccountTest.getClient('primary');

    // 警告: 这会实际退出群组
    const response = await primaryClient.call('set_group_leave', {
      group_id: context.testGroupId,
    });

    Assertions.assertSuccess(response, 'set_group_leave');

    // 等待一段时间让操作生效
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 验证已退出群组
    const groupList = await primaryClient.call('get_group_list', {
      no_cache: true,
    });

    Assertions.assertSuccess(groupList, 'get_group_list');
    const leftGroup = groupList.data.find((g: any) => g.group_id === Number(context.testGroupId));
    Assertions.assertUndefined(leftGroup, 'Should have left the group');
  }, 30000);
});
