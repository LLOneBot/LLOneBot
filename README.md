
# LLOneBot API
A Onebot v11 implementation for LiteLoaderQQNT

[![Telegram group](https://img.shields.io/badge/Join_-Telegram-blue)](https://t.me/+nLZEnpne-pQ1OWFl)

Required LiteLoader >= 1.0.0.  
  
LLAPI not longer required in v3.

## Installation

1. Make sure [LiteLoaderQQNT](https://liteloaderqqnt.github.io/guide/install.html) is installed.

2. Get LLOnebot from [Releases](https://github.com/linyuchen/LiteLoaderQQNT-OneBotApi/releases/). Notice that version lower than 2.0 not working with LiteLoader 1.x.

3. Extract LLOnebot to plugins directory of LiteLoader.

*Plugin directory:`LiteLoaderQQNT/plugins`*

## Support status

### Protocol
- [x] HTTP API
- [x] HTTP Event
- [x] WebSocket
- [x] Reverse WebSocket

### Main Features
- [x] 发送好友消息
- [x] 发送群消息
- [x] 获取好友列表
- [x] 获取群列表
- [x] 获取群成员列表
- [x] 撤回消息
- [x] 处理加群请求
- [x] 退群
- [x] 上报好友消息
- [x] 上报群消息
- [x] 上报好友、群消息撤回
- [x] 上报加群请求
- [x] 上报群员人数变动（尚不支持识别群员人数变动原因）

### Formats
- [x] CQ 码
- [x] 文字
- [x] 表情
- [x] 图片
- [x] 引用消息
- [x] @ 群成员
- [x] 语音(支持 mp3、wav 等多种音频格式直接发送)
- [x] JSON 消息 (只上报)
- [x] 转发消息记录(目前只能发不能收)
- [ ] 红包
- [ ] XML

### Endpoints
- [x] get_login_info
- [x] send_msg
- [x] send_group_msg
- [x] send_private_msg
- [x] delete_msg
- [x] get_group_list
- [x] get_group_info
- [x] get_group_member_list
- [x] get_group_member_info
- [x] get_friend_list
- [x] get_msg
- [x] send_like
- [x] set_group_add_request
- [x] set_group_leave
- [x] get_version_info
- [x] get_status
- [x] can_send_image
- [x] can_send_record

### go-cqhttp Features:
- [x] send_private_forward_msg
- [x] send_group_forward_msg
- [x] get_stranger_info

## Example

![](doc/image/example.jpg)

## FAQ

<details>
    <summary>下载了插件但是没有看到在NTQQ中生效</summary>
<br/>
    检查是否下载的是插件 Release 的版本，如果是源码的话需要自行编译。依然不生效请查阅<a href="https://liteloaderqqnt.github.io/guide/plugins.html">LiteLoaderQQNT的文档</a>
</details>
<br/>

<details>
    <summary>调用接口报 404</summary>
<br/>
    目前没有支持全部的 Onebot 规范接口，请检查是否调用了不支持的接口
</details>
<br/>

<details>
    <summary>发送不了图片和语音</summary>
<br/>
    检查当前操作用户是否有 LiteLoaderQQNT/data/LLOneBot 的写入权限，如Windows把QQ上安装到C盘有可能会出现无权限导致发送失败
</details>
<br/>

<details>
    <summary>QQ 变得很卡</summary>
<br/>
    这是你的群特别多导致的，因为启动后会批量获取群成员列表，获取完之后就正常了
</details>
<br/>


## TODO
- [x] 重构摆脱LLAPI，目前调用LLAPI只能在renderer进程调用，需重构成在main进程调用
- [x] 支持正、反向websocket（感谢@disymayufei的PR）
- [x] 转发消息记录 
- [x] 好友点赞api

## Onebot v11 文档
See <https://11.onebot.dev/>
