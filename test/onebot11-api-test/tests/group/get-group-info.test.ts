/**
 * get_group_info 接口测试
 * 测试获取群信息功能
 */

import { setupMessageTest, teardownMessageTest, MessageTestContext } from '../setup';
import { Assertions } from '@/utils/Assertions';

describe('get_group_info - 获取群信息', () => {
  let context: MessageTestContext;

  beforeAll(async () => {
    context = await setupMessageTest();
  });

  afterAll(() => {
    teardownMessageTest(context);
  });

  it('测试获取群信息', async () => {
    const primaryClient = context.twoAccountTest.getClient('primary');

    const response = await primaryClient.call('get_group_info', {
      group_id: context.testGroupId,
    });

    Assertions.assertSuccess(response, 'get_group_info');
    Assertions.assertResponseHasFields(response, [
      'group_id',
      'group_name',
      'member_count',
      'max_member_count',
    ]);
    Assertions.assertEqual(response.data.group_id, Number(context.testGroupId), 'Group ID should match');
  }, 30000);
});
