/**
 * set_group_name 接口测试
 * 测试设置群名称功能
 *
 * 注意: 需要管理员权限
 */

import { setupMessageTest, teardownMessageTest, MessageTestContext } from '../setup';
import { Assertions } from '@/utils/Assertions';

describe('set_group_name - 设置群名称', () => {
  let context: MessageTestContext;

  beforeAll(async () => {
    context = await setupMessageTest();
  });

  afterAll(() => {
    teardownMessageTest(context);
  });

  it('测试设置群名称', async () => {
    const primaryClient = context.twoAccountTest.getClient('primary');
    const newName = `TestGroup_${Date.now()}`;

    // 设置群名称
    const setResponse = await primaryClient.call('set_group_name', {
      group_id: context.testGroupId,
      group_name: newName,
    });

    Assertions.assertSuccess(setResponse, 'set_group_name');

    // 等待一段时间让设置生效
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 验证群名称是否设置成功
    const secondaryClient = context.twoAccountTest.getClient('secondary');
    const getResponse = await secondaryClient.call('get_group_info', {
      group_id: context.testGroupId,
    });

    Assertions.assertSuccess(getResponse, 'get_group_info');
    Assertions.assertEqual(getResponse.data.group_name, newName, 'Group name should be updated');
  }, 30000);
});
