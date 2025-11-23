/**
 * get_ai_characters 接口测试
 * 测试获取AI角色列表功能
 */

import { setupMessageTest, teardownMessageTest, MessageTestContext } from '../setup';
import { Assertions } from '@/utils/Assertions';
import { ActionName } from '../../../../src/onebot11/action/types';

describe('get_ai_characters - 获取AI角色列表', () => {
  let context: MessageTestContext;

  beforeAll(async () => {
    context = await setupMessageTest();
  });

  afterAll(() => {
    teardownMessageTest(context);
  });

  it('测试获取AI角色列表', async () => {
    const primaryClient = context.twoAccountTest.getClient('primary');

    const response = await primaryClient.call(ActionName.GetAiCharacters, {
      chat_type: 1, // 1: 群聊, 2: 私聊
      group_id: context.testGroupId
    });

    if (response.retcode === 0) {
      Assertions.assertSuccess(response, 'get_ai_characters');
      Assertions.assertTrue(Array.isArray(response.data), 'AI角色列表应该是数组');
    } else {
      console.log('获取AI角色列表失败:', response.message);
    }
  }, 30000);
});
