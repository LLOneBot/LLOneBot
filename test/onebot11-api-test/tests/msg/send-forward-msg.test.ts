/**
 * send_forward_msg 接口测试
 * 测试发送合并转发消息功能
 */

import { setupMessageTest, teardownMessageTest, MessageTestContext } from '../setup';
import { Assertions } from '@/utils/Assertions';
import { ActionName } from '../../../../src/onebot11/action/types';
import { OB11MessageDataType, OB11MessageData } from '@llonebot/onebot11/types';

describe('send_forward_msg - 发送合并转发消息', () => {
  let context: MessageTestContext;

  beforeAll(async () => {
    context = await setupMessageTest();
  });

  afterAll(() => {
    teardownMessageTest(context);
  });

  it('测试发送群合并转发消息', async () => {
    context.twoAccountTest.clearAllQueues();
    const primaryClient = context.twoAccountTest.getClient('primary');

    // 构造合并转发消息
    const forwardMessages = [
      {
        type: 'node',
        data: {
          name: '测试用户1',
          uin: context.primaryUserId,
          content: [
            {
              type: OB11MessageDataType.Text,
              data: { text: '这是第一条消息' }
            }
          ]
        }
      },
      {
        type: 'node',
        data: {
          name: '测试用户2',
          uin: context.secondaryUserId,
          content: [
            {
              type: OB11MessageDataType.Text,
              data: { text: '这是第二条消息' }
            }
          ]
        }
      }
    ];

    const response = await primaryClient.call(ActionName.GoCQHTTP_SendGroupForwardMsg, {
      group_id: context.testGroupId,
      messages: forwardMessages
    });

    Assertions.assertSuccess(response, 'send_group_forward_msg');
    Assertions.assertResponseHasFields(response, ['message_id']);

    // 等待消息被接收
    await context.twoAccountTest.secondaryListener.waitForEvent({
      post_type: 'message',
      message_type: 'group',
      message_id: response.data.message_id,
    }, (event) => {
      const messages = Array.isArray(event.message) ? event.message : [];
      return messages.some((msg: OB11MessageData) => msg.type === OB11MessageDataType.Forward);
    }, 60000);
  }, 90000);

  it('测试发送私聊合并转发消息', async () => {
    context.twoAccountTest.clearAllQueues();
    const primaryClient = context.twoAccountTest.getClient('primary');

    const forwardMessages = [
      {
        type: 'node',
        data: {
          name: '测试用户',
          uin: context.primaryUserId,
          content: [
            {
              type: OB11MessageDataType.Text,
              data: { text: '私聊转发测试' }
            }
          ]
        }
      }
    ];

    const response = await primaryClient.call(ActionName.GoCQHTTP_SendPrivateForwardMsg, {
      user_id: context.secondaryUserId,
      messages: forwardMessages
    });

    Assertions.assertSuccess(response, 'send_private_forward_msg');
    Assertions.assertResponseHasFields(response, ['message_id']);

    await context.twoAccountTest.secondaryListener.waitForEvent({
      post_type: 'message',
      message_type: 'private',
    }, (event) => {
      const messages = Array.isArray(event.message) ? event.message : [];
      return messages.some((msg: OB11MessageData) => msg.type === OB11MessageDataType.Forward);
    }, 60000);
  }, 90000);
});
