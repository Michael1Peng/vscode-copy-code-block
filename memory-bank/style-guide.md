# VSCode Copy Code Block 扩展 - 代码风格指南

## TypeScript 编码规范

### 基本规则

- 使用 4 空格缩进
- 使用分号结尾
- 使用单引号字符串
- 行长度限制 120 字符
- 使用 camelCase 命名变量和函数
- 使用 PascalCase 命名类和接口

### 文件结构

```typescript
// 1. 导入语句
import * as vscode from "vscode";
import { SomeInterface } from "./types";

// 2. 类型定义
interface LocalInterface {
  property: string;
}

// 3. 常量定义
const CONSTANTS = {
  DEFAULT_FORMAT: "default",
};

// 4. 主要功能实现
export function activate(context: vscode.ExtensionContext) {
  // 实现代码
}
```

### 命名约定

- **变量**: `selectedText`, `lineNumber`
- **函数**: `getSelectedCode()`, `formatCodeBlock()`
- **类**: `CodeFormatter`, `TokenProcessor`
- **接口**: `IFormatConfig`, `ITokenMap`
- **常量**: `DEFAULT_FORMAT`, `TOKEN_PATTERNS`

### 注释规范

```typescript
/**
 * 获取当前选中的代码内容
 * @param editor VSCode 编辑器实例
 * @returns 选中的文本内容，如果没有选中则返回当前行内容
 */
function getSelectedCode(editor: vscode.TextEditor): string {
  // 实现逻辑
}
```

## 项目结构规范

### 目录组织

```
src/
├── extension.ts          # 主入口文件
├── formatters/          # 格式化器模块
│   ├── tokenProcessor.ts
│   └── codeFormatter.ts
├── types/               # 类型定义
│   └── index.ts
└── test/               # 测试文件
    └── suite/
```

### 文件命名

- 使用 camelCase: `tokenProcessor.ts`
- 测试文件添加 `.test.ts` 后缀
- 类型定义文件使用 `types/` 目录

## Git 提交规范

### 提交消息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型说明

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例

```
feat(token): add SELECTED_CODE token support

- Implement selection detection logic
- Add fallback to current line when no selection
- Update token processor to handle new token

Closes #123
```

## 测试规范

### 测试文件结构

```typescript
import * as assert from "assert";
import * as vscode from "vscode";
import { getSelectedCode } from "../formatters/tokenProcessor";

suite("Token Processor Tests", () => {
  test("should return selected text when text is selected", () => {
    // 测试实现
  });

  test("should fallback to current line when no selection", () => {
    // 测试实现
  });
});
```

### 测试覆盖要求

- 单元测试覆盖率 > 80%
- 所有公共 API 必须有测试
- 边界条件和错误情况必须测试

## 错误处理规范

### 错误类型

```typescript
class TokenProcessingError extends Error {
  constructor(message: string, public readonly token: string) {
    super(message);
    this.name = "TokenProcessingError";
  }
}
```

### 错误处理模式

```typescript
try {
  const result = processToken(token);
  return result;
} catch (error) {
  console.error(`Token processing failed: ${error.message}`);
  return fallbackValue;
}
```

## 性能规范

### 性能要求

- 令牌处理时间 < 100ms
- 大文件选中处理 < 500ms
- 内存使用增长 < 10MB

### 优化策略

- 使用缓存避免重复计算
- 大文本分块处理
- 异步处理避免阻塞 UI

## 文档规范

### README 结构

1. 项目简介
2. 安装说明
3. 使用方法
4. 配置选项
5. 开发指南
6. 贡献指南

### 代码文档

- 所有公共 API 必须有 JSDoc 注释
- 复杂逻辑必须有行内注释
- 配置选项必须有详细说明

## 发布规范

### 版本号规则

遵循语义化版本控制 (SemVer):

- MAJOR: 不兼容的 API 修改
- MINOR: 向下兼容的功能性新增
- PATCH: 向下兼容的问题修正

### 发布检查清单

- [ ] 所有测试通过
- [ ] 代码检查无错误
- [ ] 文档更新完成
- [ ] CHANGELOG 更新
- [ ] 版本号更新
- [ ] 功能验证完成
