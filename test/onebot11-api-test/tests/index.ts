/**
 * OneBot11 API 测试总入口
 * 
 * 测试分类：
 * - group: 群组相关测试 (28 个)
 * - private: 私聊相关测试 (2 个)
 * - msg: 消息相关测试 (6 个)
 * - file: 文件相关测试 (5 个)
 * - user: 用户相关测试 (4 个)
 * - system: 系统相关测试 (8 个)
 */

// 群组相关测试
export * from './group';

// 私聊相关测试
export * from './private/send-private-msg.test';
export * from './private/delete-private-msg.test';

// 消息相关测试
export * from './msg';

// 文件相关测试
export * from './file';

// 用户相关测试
export * from './user';

// 系统相关测试
export * from './system';
