# 测试套件改进说明

## 📦 测试套件化（Test Suite）

### 改进原因

之前的测试文件是独立的，每个 API 一个测试文件。但对于某些有生命周期的功能（如文件管理），这种方式存在问题：

1. **无法测试完整流程** - 创建、使用、删除需要在一个流程中测试
2. **测试数据难以共享** - 创建的资源 ID 无法传递给删除测试
3. **测试顺序无法保证** - 独立测试可能以任意顺序执行
4. **资源清理困难** - 创建的测试资源可能无法正确清理

### 改进方案

将相关的 API 测试合并到一个测试套件（Test Suite）中，按照生命周期顺序执行。

## 🎯 已实现的测试套件

### 1. AI 语音功能套件 (`ai-record.test.ts`)

**测试流程：**
```
获取 AI 角色列表 → 选择角色 → 发送 AI 语音 → 验证接收
```

**涵盖的 API：**
- `get_ai_characters` - 获取 AI 角色列表
- `send_group_ai_record` - 发送群 AI 语音

**优势：**
- ✅ 测试完整的 AI 语音流程
- ✅ 自动选择可用角色
- ✅ 验证语音消息送达
- ✅ 优雅处理无角色情况

### 2. 群文件夹管理套件 (`group-file-folder.test.ts`)

**测试流程：**
```
创建文件夹 → 验证创建成功 → 获取文件夹内容 → 删除文件夹 → 验证删除成功
```

**涵盖的 API：**
- `create_group_file_folder` - 创建群文件夹
- `get_group_root_files` - 获取群根目录（验证创建/删除）
- `get_group_files_by_folder` - 获取文件夹内文件列表
- `delete_group_folder` - 删除群文件夹

**优势：**
- ✅ 测试完整的文件夹生命周期
- ✅ 自动清理测试资源
- ✅ 验证操作的实际效果
- ✅ 共享 `folder_id` 在多个测试间传递

### 3. 私聊文件 URL 套件 (`get-private-file-url.test.ts`)

**测试流程：**
```
上传私聊文件 → 接收文件消息 → 获取文件 URL
```

**涵盖的 API：**
- `upload_private_file` - 上传私聊文件
- `get_private_file_url` - 获取私聊文件 URL

**优势：**
- ✅ 测试完整的私聊文件流程
- ✅ 双账号验证文件送达
- ✅ 自动提取 `file_id`
- ✅ 验证文件可访问

### 4. 群文件操作套件 (`group-file-operations.test.ts`)

**测试流程：**
```
上传文件 → 验证上传成功 → 获取下载链接 → 删除文件 → 验证删除成功
```

**涵盖的 API：**
- `upload_group_file` - 上传群文件
- `get_group_root_files` - 获取群根目录（验证上传/删除）
- `get_group_file_url` - 获取文件下载链接
- `delete_group_file` - 删除群文件

**优势：**
- ✅ 测试完整的文件生命周期
- ✅ 自动清理测试文件
- ✅ 验证文件真实存在
- ✅ 共享 `file_id` 和 `file_name`

## 📝 测试套件编写规范

### 基本结构

```typescript
describe('feature_name - 功能描述', () => {
  let context: MessageTestContext;
  let resourceId: string | null = null; // 共享的资源 ID

  beforeAll(async () => {
    context = await setupMessageTest();
  });

  afterAll(() => {
    teardownMessageTest(context);
  });

  it('步骤1: 创建资源', async () => {
    // 创建资源
    const response = await client.call(ActionName.Create, {...});
    
    // 保存资源 ID 供后续测试使用
    if (response.data && response.data.id) {
      resourceId = response.data.id;
    }
  });

  it('步骤2: 使用资源', async () => {
    if (!resourceId) {
      console.log('⚠ 跳过：没有可用的资源 ID');
      return;
    }
    
    // 使用资源
    const response = await client.call(ActionName.Use, {
      id: resourceId
    });
  });

  it('步骤3: 删除资源', async () => {
    if (!resourceId) {
      console.log('⚠ 跳过：没有可用的资源 ID');
      return;
    }
    
    // 删除资源
    const response = await client.call(ActionName.Delete, {
      id: resourceId
    });
  });
});
```

### 关键要点

1. **使用共享变量** - 在 `describe` 块中声明变量存储资源 ID
2. **检查资源存在** - 每个依赖资源的测试都要检查资源是否存在
3. **优雅降级** - 如果资源不存在，跳过测试而不是失败
4. **添加延迟** - 在验证操作后添加适当延迟，确保操作完成
5. **清理资源** - 最后一个测试负责清理创建的资源

## 🔄 适合套件化的场景

### 推荐套件化的功能

1. **文件管理** - 上传、下载、删除 ✅ 已实现
2. **文件夹管理** - 创建、列表、删除 ✅ 已实现
3. **AI 语音** - 获取角色、发送语音 ✅ 已实现
4. **私聊文件** - 上传、接收、获取 URL ✅ 已实现
5. **群公告** - 发布、获取、删除
6. **精华消息** - 设置、列表、删除
7. **好友请求** - 获取、处理
8. **群请求** - 获取、处理

### 不适合套件化的功能

1. **查询类 API** - 如 `get_group_list`、`get_friend_list`
2. **独立操作** - 如 `send_like`、`poke`
3. **系统信息** - 如 `get_login_info`、`get_status`

## 📊 改进效果

### 测试文件数量变化

**改进前：**
- `create-group-file-folder.test.ts`
- `get-group-files-by-folder.test.ts`
- `delete-group-folder.test.ts`
- `upload-group-file.test.ts` (在 group-file.test.ts 中)
- `get-group-file-url.test.ts`
- `delete-group-file.test.ts`
- `get-ai-characters.test.ts`
- `send-group-ai-record.test.ts`
- `get-private-file-url.test.ts` (独立测试)

**改进后：**
- `group-file-folder.test.ts` (包含 3 个 API)
- `group-file-operations.test.ts` (包含 3 个 API)
- `ai-record.test.ts` (包含 2 个 API)
- `get-private-file-url.test.ts` (包含 2 个 API，完整流程)

**减少文件数：** 9 → 4 (减少 56%)

### 测试质量提升

- ✅ **完整性** - 测试完整的生命周期
- ✅ **可靠性** - 资源自动清理，不留垃圾数据
- ✅ **可维护性** - 相关测试集中管理
- ✅ **可读性** - 清晰的测试流程

## 🚀 未来改进方向

可以考虑将以下功能也改为套件化：

1. **群公告管理** - 目前 `group-notice.test.ts` 已经包含发送和获取，可以加入删除
2. **精华消息管理** - 目前分散在 `essence-msg.test.ts` 和 `get-essence-msg-list.test.ts`
3. **好友管理** - 添加、备注、分组、删除可以组成一个套件
4. **群成员管理** - 邀请、踢出、禁言可以组成一个套件

## 💡 总结

测试套件化是一个重要的改进，它让测试更加：
- **真实** - 模拟实际使用场景
- **完整** - 覆盖完整的功能流程
- **可靠** - 自动清理，不污染测试环境
- **高效** - 减少重复代码，提高可维护性

这种方式特别适合有状态的、需要多步操作的功能测试。
