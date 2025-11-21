# 缺失的测试分析

## 已有测试 (50 个)

### Group 相关 ✅
- send_group_msg
- get_group_info
- get_group_list
- get_group_member_info
- get_group_member_list
- get_group_msg
- get_group_msg_history
- delete_group_msg
- set_group_add_request
- set_group_admin
- set_group_ban
- set_group_card
- set_group_kick (无 .test 后缀)
- set_group_leave (无 .test 后缀)
- set_group_name
- set_group_portrait
- set_group_whole_ban
- set_group_special_title
- get_group_honor_info
- get_group_system_msg
- get_group_at_all_remain
- send_group_sign
- get_guild_list
- group_notice (包含 send/get)
- group_file (包含 upload/get_file_system_info/get_root_files)
- essence_msg (包含 set/delete)
- get_essence_msg_list

### Private 相关 ✅
- send_private_msg
- delete_private_msg
- get_private_msg

### Message 相关 ✅
- send_msg
- get_msg
- delete_msg
- mark_msg_as_read
- send_forward_msg
- get_forward_msg

### File 相关 ✅
- get_file
- get_image
- get_record
- download_file
- ocr_image

### User 相关 ✅
- get_friend_list
- get_cookie
- send_like
- get_stranger_info

### System 相关 ✅
- get_login_info
- get_status
- get_version_info
- can_send_image
- can_send_record
- get_credentials
- get_csrf_token
- clean_cache

## 缺失的测试

### Group 相关 (需要补充)
- ❌ `CreateGroupFileFolder` - 创建群文件夹
- ❌ `DelGroupFile` - 删除群文件
- ❌ `DelGroupFolder` - 删除群文件夹
- ❌ `GetGroupFilesByFolder` - 获取群文件夹文件列表
- ❌ `GetGroupFileUrl` - 获取群文件下载链接
- ❌ `BatchDeleteGroupMember` - 批量踢出群成员
- ❌ `DeleteGroupNotice` - 删除群公告
- ❌ `GetGroupAddRequest` - 获取加群请求列表
- ❌ `GetGroupShutList` - 获取群禁言列表
- ❌ `GroupPoke` - 群戳一戳
- ❌ `SetGroupMsgMask` - 设置群消息屏蔽
- ❌ `SetGroupRemark` - 设置群备注
- ❌ `CreateGroupAlbum` - 创建群相册
- ❌ `DeleteGroupAlbum` - 删除群相册
- ❌ `GetGroupAlbumList` - 获取群相册列表
- ❌ `UploadGroupAlbum` - 上传群相册图片

### File 相关 (需要补充)
- ❌ `DownloadFlashFile` - 下载闪照
- ❌ `GetFlashFileInfo` - 获取闪照信息
- ❌ `UploadFlashFile` - 上传闪照
- ❌ `GetPrivateFileUrl` - 获取私聊文件 URL
- ❌ `MoveGroupFile` - 移动群文件
- ❌ `RenameGroupFileFolder` - 重命名群文件夹
- ❌ `SetGroupFileForever` - 设置群文件永久保存
- ❌ `GetRkey` - 获取文件 Rkey
- ❌ `UploadGroupFile` - 上传群文件 (已在 group-file.test 中)
- ❌ `UploadPrivateFile` - 上传私聊文件

### Message 相关 (需要补充)
- ❌ `FetchCustomFace` - 获取自定义表情
- ❌ `FetchEmojiLike` - 获取表情回应
- ❌ `ForwardSingleMsg` - 转发单条消息 (ForwardFriendSingleMsg/ForwardGroupSingleMsg)
- ❌ `GetAiCharacters` - 获取 AI 角色列表
- ❌ `GetFriendMsgHistory` - 获取好友消息历史
- ❌ `GetRecommendFace` - 获取推荐表情
- ❌ `SendGroupAiRecord` - 发送群 AI 语音
- ❌ `SetMsgEmojiLike` - 设置消息表情回应
- ❌ `UnSetMsgEmojiLike` - 取消消息表情回应
- ❌ `VoiceMsg2Text` - 语音转文字

### User 相关 (需要补充)
- ❌ `FriendPoke` - 好友戳一戳
- ❌ `GetDoubtFriendsAddRequest` - 获取可疑好友请求
- ❌ `SetDoubtFriendsAddRequest` - 处理可疑好友请求
- ❌ `GetFriendWithCategory` - 获取分组好友列表
- ❌ `GetProfileLike` - 获取点赞列表
- ❌ `GetProfileLikeMe` - 获取给我点赞的人
- ❌ `GetQQAvatar` - 获取 QQ 头像
- ❌ `SetFriendAddRequest` - 处理好友请求
- ❌ `SetFriendCategory` - 设置好友分组
- ❌ `SetFriendRemark` - 设置好友备注
- ❌ `SetOnlineStatus` - 设置在线状态
- ❌ `SetQQAvatar` - 设置 QQ 头像
- ❌ `DeleteFriend` - 删除好友
- ❌ `SetQQProfile` - 设置 QQ 资料

### System 相关 (需要补充)
- ❌ `GetRobotUinRange` - 获取机器人 UIN 范围
- ❌ `Debug` - 调试接口
- ❌ `GetEvent` - 获取事件
- ❌ `SendPB` - 发送 protobuf
- ❌ `GetConfig` - 获取配置
- ❌ `SetConfig` - 设置配置
- ❌ `SetRestart` - 重启
- ❌ `QuickOperation` - 快速操作

## 优先级建议

### 高优先级 (常用功能)
1. `UploadPrivateFile` - 上传私聊文件
2. `GetFriendMsgHistory` - 获取好友消息历史
3. `SetFriendAddRequest` - 处理好友请求
4. `DeleteFriend` - 删除好友
5. `FriendPoke` - 好友戳一戳
6. `GroupPoke` - 群戳一戳
7. `ForwardSingleMsg` - 转发单条消息
8. `SetMsgEmojiLike` - 设置消息表情回应

### 中优先级 (扩展功能)
1. `GetGroupFileUrl` - 获取群文件下载链接
2. `DelGroupFile` - 删除群文件
3. `CreateGroupFileFolder` - 创建群文件夹
4. `SetFriendRemark` - 设置好友备注
5. `SetGroupRemark` - 设置群备注
6. `GetFriendWithCategory` - 获取分组好友列表
7. `VoiceMsg2Text` - 语音转文字
8. `GetAiCharacters` - 获取 AI 角色列表
9. `SendGroupAiRecord` - 发送群 AI 语音

### 低优先级 (特殊功能)
1. 闪照相关 (DownloadFlashFile, GetFlashFileInfo, UploadFlashFile)
2. 群相册相关 (CreateGroupAlbum, DeleteGroupAlbum, GetGroupAlbumList, UploadGroupAlbum)
3. 表情相关 (FetchCustomFace, FetchEmojiLike, GetRecommendFace)
4. 系统调试 (Debug, SendPB, GetEvent)
5. 配置管理 (GetConfig, SetConfig)

## 统计

- **已有测试**: 91 个
- **缺失测试**: 17 个
- **总 API 数**: 108 个
- **测试覆盖率**: 84.3%

## 建议

1. 优先补充高优先级的常用功能测试
2. 对于需要特殊权限或环境的 API（如闪照、群相册），可以标注为可选测试
3. 系统调试类 API 可以考虑单独分类或跳过测试
