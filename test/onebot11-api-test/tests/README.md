# OneBot11 API 测试套件

> 完整的 OneBot11 API 测试覆盖，确保 LLOneBot 的功能正确性和稳定性

## 📊 快速概览

- **测试覆盖率**: 84.3% (91/108 APIs)
- **测试文件数**: 88 个
- **测试分类**: 6 大类
- **测试框架**: Jest + TypeScript

## 🚀 快速开始

### 1. 配置测试环境

创建配置文件 `config/test.config.json`:

```json
{
  "accounts": {
    "primary": {
      "host": "127.0.0.1",
      "port": 3000,
      "user_id": "123456"
    },
    "secondary": {
      "host": "127.0.0.1",
      "port": 3001,
      "user_id": "789012"
    }
  },
  "test_group_id": "987654321",
  "timeout": 30000
}
```

### 2. 运行测试

```bash
# 运行所有测试
npm test

# 运行特定分类
npm test -- group      # 群组相关
npm test -- msg        # 消息相关
npm test -- user       # 用户相关
npm test -- file       # 文件相关
npm test -- system     # 系统相关
npm test -- private    # 私聊相关
```

## 📁 测试分类

| 分类 | 测试数 | 主要功能 |
|------|--------|---------|
| **Group** | 33 | 群组管理、文件、公告、精华消息 |
| **Message** | 14 | 消息操作、转发、语音、表情 |
| **User** | 17 | 好友管理、用户信息、交互 |
| **File** | 9 | 文件管理、OCR、文件夹操作 |
| **System** | 10 | 系统信息、配置、凭证 |
| **Private** | 4 | 私聊消息、文件上传 |

## ✨ 主要特性

### 🎯 完整的功能覆盖
- 消息发送/接收/撤回
- 群组管理和权限控制
- 文件上传/下载/管理
- 好友管理和交互
- 系统信息和配置

### 🔄 测试套件化
- 群文件夹完整生命周期测试
- 群文件操作完整流程测试
- 自动资源创建和清理

### 👥 双账号验证
- 发送方和接收方分离
- 事件监听验证消息送达
- 确保测试真实性

### 🛡️ 安全设计
- 危险操作默认跳过
- 测试资源自动清理
- 详细的错误提示

## 📚 文档导航

### 核心文档
- [**COMPLETION_REPORT.md**](./COMPLETION_REPORT.md) - 完成报告（推荐首先阅读）
- [**TEST_COVERAGE.md**](./TEST_COVERAGE.md) - 详细的测试覆盖率
- [**FINAL_SUMMARY.md**](./FINAL_SUMMARY.md) - 测试套件总结

### 改进说明
- [**IMPROVEMENTS.md**](./IMPROVEMENTS.md) - 测试套件化改进
- [**REMAINING_APIS.md**](./REMAINING_APIS.md) - 未测试 API 列表

### 使用指南
- [**RUN_TESTS.md**](./RUN_TESTS.md) - 运行测试指南
- [**EVENTLISTENER_USAGE.md**](./EVENTLISTENER_USAGE.md) - 事件监听器使用
- [**IMPLEMENTATION_SUMMARY.md**](./IMPLEMENTATION_SUMMARY.md) - 实现总结

## 🎯 测试示例

### 基础测试

```typescript
it('测试发送群消息', async () => {
  const client = context.twoAccountTest.getClient('primary');
  
  const response = await client.call(ActionName.SendGroupMsg, {
    group_id: context.testGroupId,
    message: [{ type: 'text', data: { text: 'Hello' } }]
  });
  
  Assertions.assertSuccess(response, 'send_group_msg');
  
  // 等待消息被接收
  await context.twoAccountTest.secondaryListener.waitForEvent({
    post_type: 'message',
    message_id: response.data.message_id
  });
});
```

### 测试套件

```typescript
describe('group_file_folder - 群文件夹管理', () => {
  let folderId: string | null = null;

  it('创建文件夹', async () => {
    const response = await client.call(ActionName.CreateFolder, {...});
    folderId = response.data.folder_id;
  });

  it('删除文件夹', async () => {
    await client.call(ActionName.DeleteFolder, {
      folder_id: folderId
    });
  });
});
```

## 🔧 开发指南

### 添加新测试

1. 在对应分类目录创建 `xxx.test.ts`
2. 使用 `setupMessageTest()` 初始化
3. 使用 `Assertions` 进行断言
4. 使用 `EventListener` 验证事件
5. 更新 `index.ts` 导出

### 测试套件化

对于有生命周期的功能（创建→使用→删除），建议使用测试套件：

```typescript
describe('feature - 功能描述', () => {
  let resourceId: string | null = null;
  
  it('步骤1: 创建', async () => {
    // 创建并保存 ID
  });
  
  it('步骤2: 使用', async () => {
    if (!resourceId) return;
    // 使用资源
  });
  
  it('步骤3: 清理', async () => {
    if (!resourceId) return;
    // 删除资源
  });
});
```

## 📈 测试覆盖详情

### 已覆盖的核心功能

✅ 消息类型
- 文本、图片、语音、视频
- @消息、回复、合并转发
- AI 语音、表情回应

✅ 群组管理
- 成员管理、权限设置
- 群文件、群公告
- 精华消息、群戳一戳

✅ 好友管理
- 好友列表、请求处理
- 备注、分组、删除
- 点赞、戳一戳

✅ 文件操作
- 上传、下载、删除
- OCR 识别、文件夹管理

✅ 系统功能
- 登录信息、状态查询
- 版本信息、配置管理

### 未覆盖的功能 (17 个)

主要是特殊功能或高风险操作：
- 闪照相关 (3 个)
- 群相册相关 (4 个)
- 文件高级操作 (3 个)
- 系统调试 (5 个)
- 其他 (2 个)

详见 [REMAINING_APIS.md](./REMAINING_APIS.md)

## 🤝 贡献指南

欢迎贡献新的测试用例！请确保：

1. 遵循现有的测试结构和命名规范
2. 添加完整的注释和文档
3. 使用统一的断言工具
4. 测试通过后再提交
5. 更新相关文档

## 📝 注意事项

1. 需要两个测试账号（primary 和 secondary）
2. 需要一个测试群组
3. 某些测试需要管理员权限
4. 危险操作测试默认跳过（使用 `.skip`）
5. 媒体文件测试需要有效的资源 URL

## 📞 支持

如有问题，请查看：
- [测试覆盖报告](./TEST_COVERAGE.md)
- [完成报告](./COMPLETION_REPORT.md)
- [改进说明](./IMPROVEMENTS.md)

---

**测试覆盖率**: 84.3% | **测试文件**: 88 个 | **覆盖 API**: 91 个
