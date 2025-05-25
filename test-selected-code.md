# 测试 ${SELECTED_CODE} 令牌功能

## 测试目的

验证新添加的 `${SELECTED_CODE}` 令牌是否正确工作。

## 测试场景

### 场景 1: 无选中内容（回退到当前行）

1. 将光标放在任意代码行
2. 使用快捷键 `Alt+J Alt+1` (默认格式)
3. 预期结果: `${SELECTED_CODE}` 应该返回当前光标所在行的内容

### 场景 2: 选中单行内容

1. 选中一行代码的部分内容
2. 使用快捷键 `Alt+J Alt+1`
3. 预期结果: `${SELECTED_CODE}` 应该返回选中的内容

### 场景 3: 选中多行内容

1. 选中多行代码
2. 使用快捷键 `Alt+J Alt+1`
3. 预期结果: `${SELECTED_CODE}` 应该返回所有选中的内容

### 场景 4: 使用新的选中代码格式

1. 选中代码块
2. 在设置中添加新的格式配置:

```json
{
  "formatName": "selected",
  "codeBlockHeaderFormat": "${fullPath}:${topLineNumber}${EOL}Selected Code:${EOL}",
  "codeBlockFooterFormat": "${EOL}",
  "codeLineFormat": "${SELECTED_CODE}${EOL}",
  "multipleSelectionCreateMultipleCodeBlocks": false,
  "multipleSelectionsBoundalyMarkerFormat": "---${EOL}",
  "forcePathSeparatorSlash": true,
  "forceSpaceIndent": true
}
```

3. 使用自定义快捷键触发新格式
4. 预期结果: 应该输出选中的代码块，格式为 "Selected Code:" 开头

## 测试代码示例

```typescript
function testFunction() {
  console.log("这是测试代码");
  const message = "Hello World";
  return message;
}
```

## 兼容性测试

### 验证现有 ${CODE} 令牌仍然工作

1. 使用包含 `${CODE}` 的格式
2. 确认 `${CODE}` 仍然返回当前行内容
3. 确认现有用户配置不受影响

### 验证多选区域处理

1. 使用 Ctrl/Cmd+Click 创建多个选区
2. 测试 `${SELECTED_CODE}` 在多选区域的行为
3. 验证 `multipleSelectionCreateMultipleCodeBlocks` 配置的影响

## 预期输出示例

### 默认格式输出

```
/path/to/file.ts:1
1: function testFunction() {
```

### 新的选中代码格式输出

```
/path/to/file.ts:1
Selected Code:
function testFunction() {
    console.log("这是测试代码");
    const message = "Hello World";
    return message;
}
```

## 测试检查清单

- [ ] 无选中时回退到当前行 ✓
- [ ] 单行选中正确处理 ✓
- [ ] 多行选中正确处理 ✓
- [ ] 新格式配置正确工作 ✓
- [ ] 现有 ${CODE} 令牌兼容性 ✓
- [ ] 多选区域处理 ✓
- [ ] 文档更新完整 ✓
- [ ] 配置说明准确 ✓
