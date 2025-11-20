/**
 * set_group_kick 接口测试
 * 测试群组踢人功能
 * 
 * 注意: 需要管理员权限
 * 警告: 此测试会实际踢出成员，请谨慎使用
 */

import { setupMessageTest, teardownMessageTest, MessageTestContext } from '../setup';
import { Assertions } from '@/utils/Assertions';

describe.skip('set_group_kick - 群组踢人', () => {
  let context: MessageTestContext;

  beforeAll(async () => {
    context = await setupMessageTest();
  });

  afterAll(() => {
    teardownMessageTest(context);
  });

  it('测试踢出群成员 (不拒绝加群请求)', async () => {
    const primaryClient = context.twoAccountTest.getClient('primary');

    // 警告: 这会实际踢出成员
    const response = await primaryClient.call('set_group_kick', {
      group_id: context.testGroupId,
      user_id: context.secondaryUserId,
      reject_add_request: false,
    });

    Assertions.assertSuccess(response, 'set_group_kick');

    // 等待一段时间让操作生效
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 验证成员已被踢出
    const memberList = await primaryClient.call('get_group_member_list', {
      group_id: context.testGroupId,
    });

    Assertions.assertSuccess(memberList, 'get_group_member_list');
    const kickedMember = memberList.data.find((m: any) => m.user_id === Number(context.secondaryUserId));
    Assertions.assertUndefined(kickedMember, 'User should be kicked from group');
  }, 30000);
});
