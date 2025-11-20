# 群组接口测试

本目录包含所有群组相关的 OneBot 11 API 测试。

## 测试文件列表

### 消息相关
- `send-group-msg.test.ts` - 发送群消息（文本、图片、语音、视频、@、回复、混合消息）
- `get-group-msg.test.ts` - 获取群消息
- `delete-group-msg.test.ts` - 撤回群消息

### 群信息查询
- `get-group-info.test.ts` - 获取群信息
- `get-group-list.test.ts` - 获取群列表
- `get-group-member-info.test.ts` - 获取群成员信息
- `get-group-member-list.test.ts` - 获取群成员列表
- `get-group-honor-info.test.ts` - 获取群荣誉信息

### 群设置
- `set-group-name.test.ts` - 设置群名称（需要管理员权限）
- `set-group-card.test.ts` - 设置群名片

### 群管理（需要管理员权限）
- `set-group-admin.test.ts` - 设置/取消管理员（需要群主权限）
- `set-group-ban.test.ts` - 单人禁言/解除禁言
- `set-group-whole-ban.test.ts` - 全员禁言/解除全员禁言
- `set-group-kick.test.ts` - 踢出群成员（⚠️ 破坏性操作，默认跳过）
- `set-group-leave.test.ts` - 退出群组（⚠️ 破坏性操作，默认跳过）
- `set-group-add-request.test.ts` - 处理加群请求（需要实际请求，默认跳过）

## 运行测试

### 运行所有群组测试（并行）
```bash
npm test -- tests/message/group
```

### 运行所有群组测试（串行，一个接一个）
```bash
npm run test:serial -- tests/message/group
# 或者
npm test -- tests/message/group --runInBand
```

推荐使用串行模式，避免测试之间的相互干扰。

### 运行特定测试文件
```bash
npm test -- tests/message/group/send-group-msg.test.ts
```

### 运行包括跳过的测试
```bash
npm test -- tests/message/group --testNamePattern=".*"
```

## 注意事项

### 权限要求
- 部分测试需要管理员权限（如禁言、踢人、设置管理员等）
- `set-group-admin.test.ts` 需要群主权限
- 确保测试账号在测试群组中有相应权限

### 破坏性操作
以下测试默认使用 `describe.skip` 跳过，因为它们会执行破坏性操作：
- `set-group-kick.test.ts` - 会实际踢出成员
- `set-group-leave.test.ts` - 会实际退出群组
- `set-group-add-request.test.ts` - 需要实际的加群请求

如需运行这些测试，请：
1. 确保理解测试的影响
2. 使用专门的测试群组
3. 手动移除 `describe.skip`

### 配置要求
在 `config/test.config.json` 中需要配置：
- `test_group_id` - 测试群组 ID
- `accounts.primary` - 主测试账号（需要管理员权限）
- `accounts.secondary` - 辅助测试账号

## 测试覆盖的接口

| 接口名称 | 测试文件 | 状态 |
|---------|---------|------|
| send_group_msg | send-group-msg.test.ts | ✅ |
| get_group_msg | get-group-msg.test.ts | ✅ |
| delete_msg (群消息) | delete-group-msg.test.ts | ✅ |
| get_group_info | get-group-info.test.ts | ✅ |
| get_group_list | get-group-list.test.ts | ✅ |
| get_group_member_info | get-group-member-info.test.ts | ✅ |
| get_group_member_list | get-group-member-list.test.ts | ✅ |
| get_group_honor_info | get-group-honor-info.test.ts | ✅ |
| set_group_card | set-group-card.test.ts | ✅ |
| set_group_name | set-group-name.test.ts | ✅ |
| set_group_admin | set-group-admin.test.ts | ✅ |
| set_group_ban | set-group-ban.test.ts | ✅ |
| set_group_whole_ban | set-group-whole-ban.test.ts | ✅ |
| set_group_kick | set-group-kick.test.ts | ⚠️ (跳过) |
| set_group_leave | set-group-leave.test.ts | ⚠️ (跳过) |
| set_group_add_request | set-group-add-request.test.ts | ⚠️ (跳过) |

## 测试模式

### 双账号测试模式
大部分测试使用双账号模式：
- Primary 账号：发送消息/执行操作
- Secondary 账号：接收消息/验证结果

### 事件监听验证
消息发送测试使用事件监听器验证：
1. Primary 发送消息
2. Secondary 监听并验证接收到的消息
3. 确保消息内容、类型、发送者等信息正确

## 故障排除

### 测试超时
- 增加 `config/test.config.json` 中的 `timeout` 值
- 检查网络连接和 QQ 客户端状态

### 权限错误
- 确认测试账号在群组中的权限
- 检查是否需要群主权限

### 消息未接收
- 确保两个测试账号都在同一个群组中
- 检查事件监听器是否正常启动
- 增加等待时间或重试次数
