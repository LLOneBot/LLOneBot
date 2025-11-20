/**
 * delete_msg 接口测试 - 群消息撤回
 * 测试撤回群消息功能
 *
 * 需求: 6.1
 */

import { setupMessageTest, teardownMessageTest, sleep, MessageTestContext } from '../setup'
import { Assertions } from '../../utils/Assertions'
import { ActionName } from '../../../../src/onebot11/action/types'

describe('delete_msg - 撤回群消息', () => {
  let context: MessageTestContext

  beforeAll(async () => {
    context = await setupMessageTest()

    if (!context.testGroupId) {
      const primaryClient = context.twoAccountTest.getClient('primary')
      const groupListResponse = await primaryClient.call(ActionName.GetGroupList, {})

      if (groupListResponse.retcode === 0 && groupListResponse.data.length > 0) {
        context.testGroupId = String(groupListResponse.data[0].group_id)
      }
    }
  })

  afterAll(() => {
    teardownMessageTest(context)
  })

  it('should delete sent group message', async () => {
    if (!context.testGroupId) {
      console.log('Skipping test: No test group available')
      return
    }

    const testMessage = `Test delete group message ${Date.now()}`
    const primaryClient = context.twoAccountTest.getClient('primary')

    const sendResponse = await primaryClient.call(ActionName.SendGroupMsg, {
      group_id: context.testGroupId,
      message: testMessage,
    })

    Assertions.assertSuccess(sendResponse, 'send_group_msg')
    const messageId = sendResponse.data.message_id

    // 等待消息发送完成
    await sleep(1000)

    const deleteResponse = await primaryClient.call(ActionName.DeleteMsg, {
      message_id: messageId,
    })

    Assertions.assertSuccess(deleteResponse, 'delete_msg')

    // wait for event
    const secondaryListener = context.twoAccountTest.getListener('secondary')
    const eventReceived = await secondaryListener.waitForEvent(
      {
        notice_type: 'group_recall',
        group_id: Number(context.testGroupId),
        user_id: Number(context.primaryUserId),
      },
    )
  }, 60000)
})
