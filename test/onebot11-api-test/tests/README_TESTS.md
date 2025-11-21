# OneBot11 API 测试说明

## 当前测试覆盖

本测试套件已覆盖 **53 个** OneBot11 API 接口，按功能分类如下：

### 📁 测试目录结构

```
tests/
├── group/          # 群组相关 (28 个测试)
│   ├── 基础操作: send/get/delete 群消息
│   ├── 群组管理: 成员管理、权限设置
│   ├── 群文件: 上传、获取文件列表
│   ├── 群公告: 发送、获取公告
│   └── 精华消息: 设置、删除、获取列表
│
├── private/        # 私聊相关 (2 个测试)
│   ├── send_private_msg
│   └── delete_private_msg
│
├── msg/            # 消息相关 (6 个测试)
│   ├── send_msg (通用发送)
│   ├── get_msg
│   ├── delete_msg
│   ├── mark_msg_as_read
│   ├── send_forward_msg (合并转发)
│   └── get_forward_msg
│
├── file/           # 文件相关 (5 个测试)
│   ├── get_file
│   ├── get_image
│   ├── get_record
│   ├── download_file
│   └── ocr_image
│
├── user/           # 用户相关 (4 个测试)
│   ├── get_friend_list
│   ├── get_cookie
│   ├── send_like
│   └── get_stranger_info
│
└── system/         # 系统相关 (8 个测试)
    ├── get_login_info
    ├── get_status
    ├── get_version_info
    ├── can_send_image
    ├── can_send_record
    ├── get_credentials
    ├── get_csrf_token
    └── clean_cache
```

## 测试覆盖的 API 标准

### ✅ OneBot 11 标准 API
- 消息发送/接收/撤回
- 群组管理
- 好友管理
- 系统信息

### ✅ go-cqhttp 扩展 API
- 合并转发消息
- OCR 图片识别
- 文件下载
- 陌生人信息
- 消息已读标记

### ✅ LLOneBot 部分扩展 API
- 群公告管理
- 群文件操作
- 精华消息管理
- 群打卡

## 未覆盖的 API

以下 LLOneBot 扩展 API 暂未添加测试（可根据需要补充）：

### 文件扩展
- `download_flash_file` - 下载闪照
- `get_flash_file_info` - 获取闪照信息
- `upload_flash_file` - 上传闪照
- `get_private_file_url` - 获取私聊文件 URL
- `move_group_file` - 移动群文件
- `rename_group_file_folder` - 重命名群文件夹
- `set_group_file_forever` - 设置群文件永久保存

### 群组扩展
- `batch_delete_group_member` - 批量踢人
- `delete_group_notice` - 删除群公告
- `get_group_add_request` - 获取加群请求
- `get_group_shut_list` - 获取禁言列表
- `group_poke` - 群戳一戳
- `set_group_msg_mask` - 设置群消息屏蔽
- `set_group_remark` - 设置群备注
- 群相册相关操作

### 消息扩展
- `fetch_custom_face` - 获取自定义表情
- `fetch_emoji_like` - 获取表情回应
- `forward_single_msg` - 转发单条消息
- `get_ai_characters` - 获取 AI 角色
- `get_friend_msg_history` - 获取好友消息历史
- `get_recommend_face` - 获取推荐表情
- `send_group_ai_record` - 发送群 AI 语音
- `set_msg_emoji_like` - 设置消息表情回应
- `voice_msg_2_text` - 语音转文字

### 用户扩展
- `friend_poke` - 好友戳一戳
- `get_doubt_friends_add_request` - 获取可疑好友请求
- `get_friend_with_category` - 获取分组好友
- `get_profile_like` - 获取点赞列表
- `get_profile_like_me` - 获取给我点赞的人
- `get_qq_avatar` - 获取 QQ 头像
- `set_doubt_friends_add_request` - 处理可疑好友请求
- `set_friend_category` - 设置好友分组
- `set_friend_remark` - 设置好友备注
- `set_online_status` - 设置在线状态
- `set_qq_avatar` - 设置 QQ 头像

### 系统扩展
- `get_robot_uin_range` - 获取机器人 UIN 范围
- `debug` - 调试接口
- `get_event` - 获取事件
- `send_pb` - 发送 protobuf

## 运行测试

```bash
# 运行所有测试
npm test

# 运行特定分类
npm test -- group
npm test -- msg
npm test -- file
npm test -- user
npm test -- system
npm test -- private
```

## 添加新测试

如需添加新的测试，请参考现有测试的结构：

1. 在对应分类目录下创建 `xxx.test.ts` 文件
2. 使用 `setupMessageTest()` 初始化测试环境
3. 使用 `Assertions` 工具类进行断言
4. 使用 `EventListener` 等待和验证事件
5. 更新对应的 `index.ts` 导出文件

详细说明请参考 `IMPLEMENTATION_SUMMARY.md` 和 `EVENTLISTENER_USAGE.md`。
