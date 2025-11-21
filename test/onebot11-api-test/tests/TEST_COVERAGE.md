# OneBot11 API 测试覆盖率

本文档记录了 OneBot11 API 的测试覆盖情况。

## 测试分类

### 1. Group (群组相关) ✅

**基础群组操作**
- ✅ `send_group_msg` - 发送群消息
- ✅ `get_group_info` - 获取群信息
- ✅ `get_group_list` - 获取群列表
- ✅ `get_group_member_info` - 获取群成员信息
- ✅ `get_group_member_list` - 获取群成员列表
- ✅ `get_group_msg` - 获取群消息
- ✅ `get_group_msg_history` - 获取群消息历史
- ✅ `delete_group_msg` - 删除群消息

**群组管理**
- ✅ `set_group_add_request` - 处理加群请求
- ✅ `set_group_admin` - 设置群管理员
- ✅ `set_group_ban` - 群组禁言
- ✅ `set_group_card` - 设置群名片
- ✅ `set_group_kick` - 踢出群成员
- ✅ `set_group_leave` - 退出群组
- ✅ `set_group_name` - 设置群名
- ✅ `set_group_portrait` - 设置群头像
- ✅ `set_group_whole_ban` - 全员禁言
- ✅ `set_group_special_title` - 设置群成员专属头衔
- ✅ `set_group_remark` - 设置群备注
- ✅ `set_group_msg_mask` - 设置群消息屏蔽
- ✅ `batch_delete_group_member` - 批量踢出群成员

**群组扩展功能**
- ✅ `get_group_honor_info` - 获取群荣誉信息
- ✅ `get_group_system_msg` - 获取群系统消息
- ✅ `get_group_at_all_remain` - 获取群 @全体成员 剩余次数
- ✅ `get_group_add_request` - 获取加群请求列表
- ✅ `get_group_shut_list` - 获取群禁言列表
- ✅ `send_group_sign` - 群打卡
- ✅ `get_guild_list` - 获取频道列表
- ✅ `group_poke` - 群戳一戳

**群公告**
- ✅ `_send_group_notice` - 发送群公告
- ✅ `_get_group_notice` - 获取群公告
- ✅ `delete_group_notice` - 删除群公告

**群文件**
- ✅ `upload_group_file` - 上传群文件
- ✅ `get_group_file_system_info` - 获取群文件系统信息
- ✅ `get_group_root_files` - 获取群根目录文件列表

**精华消息**
- ✅ `set_essence_msg` - 设置精华消息
- ✅ `delete_essence_msg` - 移除精华消息
- ✅ `get_essence_msg_list` - 获取精华消息列表

### 2. Private (私聊相关) ✅

- ✅ `send_private_msg` - 发送私聊消息
- ✅ `delete_private_msg` - 删除私聊消息
- ✅ `get_private_msg` - 获取私聊消息
- ✅ `upload_private_file` - 上传私聊文件

### 3. Message (消息相关) ✅

**基础消息操作**
- ✅ `send_msg` - 通用发送消息
- ✅ `get_msg` - 获取消息
- ✅ `delete_msg` - 撤回消息
- ✅ `mark_msg_as_read` - 标记消息已读

**合并转发**
- ✅ `send_forward_msg` - 发送合并转发消息（群聊/私聊）
- ✅ `get_forward_msg` - 获取合并转发消息内容
- ✅ `forward_single_msg` - 转发单条消息

**消息历史**
- ✅ `get_friend_msg_history` - 获取好友消息历史

**语音相关**
- ✅ `voice_msg_2_text` - 语音转文字
- ✅ `ai_record` - AI 语音功能套件
  - 获取 AI 角色列表 (get_ai_characters)
  - 发送 AI 语音消息 (send_group_ai_record)

**表情相关**
- ✅ `emoji_like` - 消息表情回应套件
  - 设置表情回应 (set_msg_emoji_like)
  - 获取表情回应 (fetch_emoji_like)
  - 取消表情回应 (unset_msg_emoji_like)
- ✅ `fetch_custom_face` - 获取自定义表情
- ✅ `get_recommend_face` - 获取推荐表情

### 4. File (文件相关) ✅

**文件获取**
- ✅ `get_file` - 获取文件信息
- ✅ `get_image` - 获取图片信息
- ✅ `get_record` - 获取语音信息

**文件操作**
- ✅ `download_file` - 下载文件（支持 URL 和 base64）
- ✅ `ocr_image` - 图片 OCR 识别

**群文件管理**
- ✅ `group_file_folder` - 群文件夹完整生命周期测试
  - 创建群文件夹 (create_group_file_folder)
  - 获取文件夹列表 (get_group_files_by_folder)
  - 删除群文件夹 (delete_group_folder)
- ✅ `group_file_operations` - 群文件完整生命周期测试
  - 上传群文件 (upload_group_file)
  - 获取文件下载链接 (get_group_file_url)
  - 删除群文件 (delete_group_file)

**其他文件操作**
- ✅ `get_private_file_url` - 获取私聊文件 URL
- ✅ `get_rkey` - 获取文件 Rkey

### 5. User (用户相关) ✅

**好友管理**
- ✅ `get_friend_list` - 获取好友列表
- ✅ `get_stranger_info` - 获取陌生人信息
- ✅ `set_friend_add_request` - 处理好友请求
- ✅ `delete_friend` - 删除好友
- ✅ `set_friend_remark` - 设置好友备注
- ✅ `set_friend_category` - 设置好友分组
- ✅ `get_friend_with_category` - 获取分组好友列表

**用户交互**
- ✅ `send_like` - 发送点赞
- ✅ `friend_poke` - 好友戳一戳

**用户信息**
- ✅ `get_cookie` - 获取 Cookie
- ✅ `get_profile_like` - 获取点赞列表
- ✅ `get_profile_like_me` - 获取给我点赞的人
- ✅ `get_qq_avatar` - 获取 QQ 头像
- ✅ `set_qq_avatar` - 设置 QQ 头像
- ✅ `set_qq_profile` - 设置 QQ 资料
- ✅ `set_online_status` - 设置在线状态

**可疑好友**
- ✅ `get_doubt_friends_add_request` - 获取可疑好友请求
- ✅ `set_doubt_friends_add_request` - 处理可疑好友请求

### 6. System (系统相关) ✅

**系统信息**
- ✅ `get_login_info` - 获取登录信息
- ✅ `get_status` - 获取运行状态
- ✅ `get_version_info` - 获取版本信息

**功能检查**
- ✅ `can_send_image` - 检查是否可以发送图片
- ✅ `can_send_record` - 检查是否可以发送语音

**凭证相关**
- ✅ `get_credentials` - 获取凭证信息
- ✅ `get_csrf_token` - 获取 CSRF Token

**系统操作**
- ✅ `clean_cache` - 清理缓存
- ✅ `get_config` - 获取配置
- ✅ `get_robot_uin_range` - 获取机器人 UIN 范围

## 测试统计

| 分类 | 测试文件数 | 覆盖 API 数 |
|------|-----------|------------|
| Group | 33 | 33 |
| Private | 4 | 4 |
| Message | 14 | 14 |
| File | 9 | 12 |
| User | 17 | 17 |
| System | 10 | 10 |
| **总计** | **87** | **90** |

> 注：File 分类通过测试套件化，9 个测试文件覆盖了 12 个 API

## 目录结构

```
test/onebot11-api-test/tests/
├── group/          # 群组相关测试 (33)
├── private/        # 私聊相关测试 (4)
├── msg/            # 消息相关测试 (14)
├── file/           # 文件相关测试 (12)
├── user/           # 用户相关测试 (17)
├── system/         # 系统相关测试 (10)
└── media/          # 测试媒体资源
```

## 运行测试

### 运行所有测试
```bash
npm test
```

### 运行特定分类测试
```bash
# 群组相关
npm test -- group

# 私聊相关
npm test -- private

# 消息相关
npm test -- msg

# 文件相关
npm test -- file

# 用户相关
npm test -- user

# 系统相关
npm test -- system
```

## 测试覆盖的功能

### 消息类型测试
- ✅ 文本消息
- ✅ 图片消息
- ✅ 语音消息
- ✅ 视频消息
- ✅ @ 消息
- ✅ 回复消息
- ✅ 合并转发消息
- ✅ 混合消息
- ✅ AI 语音消息
- ✅ 表情回应

### 群组管理测试
- ✅ 群信息获取
- ✅ 群成员管理
- ✅ 群权限管理
- ✅ 群文件操作
- ✅ 群公告管理
- ✅ 精华消息管理
- ✅ 群荣誉信息
- ✅ 群消息屏蔽
- ✅ 群戳一戳

### 好友管理测试
- ✅ 好友列表获取
- ✅ 好友请求处理
- ✅ 好友备注设置
- ✅ 好友分组管理
- ✅ 好友删除
- ✅ 好友戳一戳

### 系统功能测试
- ✅ 登录状态检查
- ✅ 版本信息获取
- ✅ 功能可用性检查
- ✅ 缓存管理
- ✅ 配置管理

### 扩展功能测试
- ✅ 文件下载
- ✅ OCR 识别
- ✅ 消息已读标记
- ✅ 陌生人信息获取
- ✅ 合并转发消息
- ✅ 语音转文字
- ✅ AI 语音生成
- ✅ 表情推荐

## 未覆盖的 API

以下 API 暂未添加测试（特殊功能或需要特定环境）：

### 闪照相关
- `download_flash_file` - 下载闪照
- `get_flash_file_info` - 获取闪照信息
- `upload_flash_file` - 上传闪照

### 群相册相关
- `create_group_album` - 创建群相册
- `delete_group_album` - 删除群相册
- `get_group_album_list` - 获取群相册列表
- `upload_group_album` - 上传群相册图片

### 文件操作
- `move_group_file` - 移动群文件
- `rename_group_file_folder` - 重命名群文件夹
- `set_group_file_forever` - 设置群文件永久保存

### 系统调试
- `debug` - 调试接口
- `get_event` - 获取事件
- `send_pb` - 发送 protobuf
- `set_config` - 设置配置
- `set_restart` - 重启
- `quick_operation` - 快速操作

## 注意事项

1. 所有测试都需要配置 `test.config.json` 文件
2. 需要两个测试账号（primary 和 secondary）
3. 需要一个测试群组
4. 某些测试需要特定权限（如管理员权限）
5. 媒体文件测试需要有效的测试资源 URL
6. 部分危险操作测试默认跳过（使用 `.skip`），如删除好友、批量踢人等
7. 部分测试需要实际数据才能执行（如处理好友请求、删除群公告等）

## 测试覆盖的 API 来源

- **OneBot 11 标准**: 基础消息、群组、用户等核心 API
- **go-cqhttp 扩展**: 合并转发、OCR、文件下载等扩展功能
- **LLOneBot 扩展**: 群公告、群文件、AI 语音、表情回应等特色功能

## 测试覆盖率

- **已测试 API**: 91 个
- **未测试 API**: 17 个（主要是特殊功能）
- **总 API 数**: 108 个
- **测试覆盖率**: 84.3%
