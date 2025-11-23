/**
 * 群组相关接口测试入口
 */

// 基础群组操作
export * from './send-group-msg.test';
export * from './get-group-info.test';
export * from './get-group-list.test';
export * from './get-group-member-info.test';
export * from './get-group-member-list.test';
export * from './get-group-msg-history.test';

// 群组管理
export * from './set-group-add-request.test';
export * from './set-group-admin.test';
export * from './set-group-ban.test';
export * from './set-group-card.test';
export * from './set-group-name.test';
export * from './set-group-portrait.test';
export * from './set-group-whole-ban.test';
export * from './set-group-special-title.test';
export * from './set-group-remark.test';
export * from './set-group-msg-mask.test';

// 群组扩展功能
export * from './get-group-honor-info.test';
export * from './get-group-system-msg.test';
export * from './get-group-at-all-remain.test';
export * from './get-group-add-request.test';
export * from './get-group-shut-list.test';
export * from './send-group-sign.test';
export * from './get-guild-list.test';
export * from './group-poke.test';
export * from './batch-delete-group-member.test';
export * from './set-group-kick.test';
export * from './set-group-leave.test';

// 群公告
export * from './group-notice.test';
export * from './delete-group-notice.test';

// 群文件
export * from './group-file.test';

// 精华消息
export * from './essence-msg.test';
export * from './get-essence-msg-list.test';
