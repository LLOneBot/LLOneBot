# LiteLoaderQQNT-Plugin-Template

LiteLoaderQQNT的插件模板，包含插件创建方法，编写建议，还有技巧  
LiteLoaderQQNT本体：[LiteLoaderQQNT](https://github.com/mo-jinran/LiteLoaderQQNT)

Telegram闲聊群：https://t.me/LiteLoaderQQNT


# 关于插件从 V2 更新至 V3 说明 

各位插件开发者，按照这条提示来更新插件    
建议参考其他已上架插件市场的插件

以下是插件需要的改动  
- 更改manifest.json文件，manifest_version改为3
- 彻底移除了旧版betterQQNT对象，请使用LiteLoader对象
- 主进程脚本onLoad函数不再提供LiteLoader对象，你可以在主进程环境任何地方使用LiteLoader对象
- 因为Windows QQNT渲染进程无法使用file://协议请求文件，请替换为llqqnt://local-file/

对于上架插件市场的插件，建议开单独分支  
方便插件市场获取新与旧的插件仓库并更新插件  
（这些不是必须的，如果你不打算保留旧版，可单分支冲过去（  
可继续使用Repo方式 ，或使用Release来上传插件  
Release附加的插件文件必须是.zip格式  
新版（v3）需压缩插件目录内部必要的文件  
然后在插件仓库提交issue或pr在v3分支（pr的请写在最开始）


# 插件编写指南文档

文档目前还不算完善，但能看，也欢迎各位来完善/修复错误

- [了解数据目录结构](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/1.了解数据目录结构)
    - [LiteLoader的数据目录](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/1.了解数据目录结构#liteloader的数据目录)
        - [plugins](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/1.了解数据目录结构#plugins)
        - [plugins_data](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/1.了解数据目录结构#plugins_data)
        - [plugins_cache](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/1.了解数据目录结构#plugins_cache)
        - [config.json](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/1.了解数据目录结构#config.json)
- [了解插件目录结构](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/1.了解插件目录结构)
    - [插件的目录](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/2.了解插件目录结构#插件的目录)
        - [manifest.json](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/2.了解插件目录结构#manifest.json)
        - [README.md](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/2.了解插件目录结构#README.md)
        - [LICENSE](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/2.了解插件目录结构#LICENSE)
        - [main.js](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/2.了解插件目录结构#main.js)
        - [preload.js](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/2.了解插件目录结构#preload.js)
        - [renderer.js](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/2.了解插件目录结构#renderer.js)
- [插件基本代码结构](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/3.插件基本代码结构)
    - [插件的结构](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/3.插件基本代码结构#插件的结构)
        - [Manifest](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/manifest.json)
        - [主进程](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/main.js)
        - [预加载](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/preload.js)
        - [渲染进程](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/renderer.js)
