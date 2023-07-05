# LiteLoaderQQNT-Plugin-Template

LiteLoaderQQNT的插件模板，包含插件创建方法，编写建议，还有技巧  
LiteLoaderQQNT本体：[LiteLoaderQQNT](https://github.com/mo-jinran/BetterQQNT)

Telegram闲聊群：https://t.me/LiteLoaderQQNT


# 插件编写指南文档

使用此模板生成仓库后，一定要记得更换许可证！  
或是修改许可证，将信息更换为你的！

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
