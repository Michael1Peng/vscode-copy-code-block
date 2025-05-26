# 技术上下文

## VSCode Extension API

### 核心 API 使用

```typescript
// 扩展激活
export function activate(context: vscode.ExtensionContext);

// 命令注册
vscode.commands.registerCommand("extension.copyCodeBlock", handler);

// 编辑器访问
vscode.window.activeTextEditor;

// 选区检测
editor.selection.isEmpty;
editor.document.getText(selection);

// 剪贴板操作
vscode.env.clipboard.writeText(text);
```

### 关键接口

#### TextEditor

```typescript
interface TextEditor {
  document: TextDocument;
  selection: Selection;
  selections: Selection[];
  // ...
}
```

#### Selection

```typescript
class Selection extends Range {
  anchor: Position;
  active: Position;
  isEmpty: boolean;
  // ...
}
```

## 当前实现分析

### 现有令牌处理

基于字符串替换的模板系统：

```typescript
// 示例令牌替换逻辑
const tokens = {
  "${CODE}": getCurrentLineText(),
  "${LINENUMBER}": lineNumber.toString(),
  "${fullPath}": document.fileName,
  // ...
};
```

### 配置系统

```typescript
interface FormatConfig {
  formatName: string;
  codeBlockHeaderFormat: string;
  codeBlockFooterFormat: string;
  codeLineFormat: string;
  multipleSelectionCreateMultipleCodeBlocks: boolean;
  multipleSelectionsBoundalyMarkerFormat: string;
  forcePathSeparatorSlash: boolean;
  forceSpaceIndent: boolean;
}
```

## 新功能技术实现

### `${SELECTED_CODE}` 令牌实现

#### 1. 选区检测逻辑

```typescript
function getSelectedOrCurrentLineText(editor: vscode.TextEditor): string {
  const selection = editor.selection;

  if (selection.isEmpty) {
    // 回退到当前行
    const line = editor.document.lineAt(selection.active.line);
    return line.text;
  } else {
    // 获取选中内容
    return editor.document.getText(selection);
  }
}
```

#### 2. 多选区域处理

```typescript
function handleMultipleSelections(editor: vscode.TextEditor): string[] {
  return editor.selections.map((selection) => {
    if (selection.isEmpty) {
      const line = editor.document.lineAt(selection.active.line);
      return line.text;
    } else {
      return editor.document.getText(selection);
    }
  });
}
```

#### 3. 令牌映射扩展

```typescript
const tokenMap = {
  // 现有令牌
  "${CODE}": getCurrentLineText(),
  "${LINENUMBER}": getLineNumber(),

  // 新增令牌
  "${SELECTED_CODE}": getSelectedOrCurrentLineText(),

  // 可能的扩展令牌
  "${SELECTED_LINES_COUNT}": getSelectedLinesCount(),
  "${SELECTION_START_LINE}": getSelectionStartLine(),
  "${SELECTION_END_LINE}": getSelectionEndLine(),
};
```

## 技术挑战和解决方案

### 1. 兼容性保证

**挑战**: 确保新功能不破坏现有用户配置
**解决方案**:

- 保持 `${CODE}` 令牌原有行为
- 新令牌作为独立功能添加
- 渐进式功能迁移

### 2. 多选区域处理

**挑战**: VSCode 支持多个选区，需要合理处理
**解决方案**:

- 利用现有的 `multipleSelectionCreateMultipleCodeBlocks` 配置
- 为每个选区生成独立的代码块或合并处理

### 3. 性能优化

**挑战**: 大文件选中内容可能影响性能
**解决方案**:

- 设置合理的选中内容大小限制
- 异步处理大文本内容
- 提供用户反馈机制

## 代码结构建议

### 文件组织

```
src/
├── extension.ts          # 扩展入口点
├── copyCodeBlock.ts      # 核心复制逻辑
├── tokenProcessor.ts     # 令牌处理器
├── configManager.ts      # 配置管理
└── utils/
    ├── textUtils.ts      # 文本处理工具
    └── formatUtils.ts    # 格式化工具
```

### 核心类设计

```typescript
class TokenProcessor {
  private tokenMap: Map<string, () => string>;

  constructor(editor: vscode.TextEditor) {
    this.initializeTokens(editor);
  }

  processTemplate(template: string): string {
    // 令牌替换逻辑
  }

  private initializeTokens(editor: vscode.TextEditor) {
    // 初始化所有令牌
  }
}

class CopyCodeBlockHandler {
  execute(args: any): void {
    // 主要执行逻辑
  }

  private getFormatConfig(formatName: string): FormatConfig {
    // 获取格式配置
  }

  private processSelections(editor: vscode.TextEditor): string {
    // 处理选区内容
  }
}
```

## 测试策略

### 单元测试重点

1. **令牌处理**: 验证新令牌的正确解析
2. **选区检测**: 测试各种选区状态
3. **格式化输出**: 验证最终输出格式
4. **边界条件**: 空选区、大文件等

### 集成测试场景

1. **基本功能**: 选中代码并复制
2. **多选区域**: 多个选区的处理
3. **配置兼容**: 现有配置的兼容性
4. **快捷键**: 键盘快捷键触发

## 部署和发布

### 版本管理

- 遵循语义化版本控制
- 当前版本: 0.0.11
- 建议下一版本: 0.1.0 (新功能添加)

### 发布检查清单

- [ ] 功能测试完成
- [ ] 向后兼容性验证
- [ ] 文档更新
- [ ] 示例配置更新
- [ ] 性能基准测试
