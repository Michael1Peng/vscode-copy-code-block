# 产品上下文

## 产品定位

VSCode Copy Code Block 是一个提升开发者代码分享和文档编写效率的扩展工具。

## 目标用户

- **主要用户**: VSCode 开发者
- **使用场景**:
  - 代码审查和讨论
  - 技术文档编写
  - 代码片段分享
  - 教学和培训材料制作
  - 问题报告和 bug 反馈

## 核心价值主张

1. **格式化复制**: 自动包含文件路径和行号信息
2. **多格式支持**: 支持纯文本、Markdown、HTML 等多种输出格式
3. **高度可定制**: 丰富的令牌系统和配置选项
4. **提升效率**: 快捷键操作，一键复制格式化代码

## 当前功能分析

### 现有令牌系统

- **文件信息**: `${fullPath}`, `${fileBasename}`, `${workspaceFolderRelativePath}`
- **行号信息**: `${topLineNumber}`, `${LINENUMBER}`
- **代码内容**: `${CODE}` (当前光标行内容)
- **语言信息**: `${languageId}`
- **时间信息**: `${YYYY}`, `${MM}`, `${DD}`, `${HH}`, `${mm}`, `${ss}`
- **格式控制**: `${EOL}`, `${LF}`, `${CRLF}`

### 功能缺口

**关键缺失**: `${SELECTED_CODE}` 令牌

- **问题**: 当前只能获取光标所在行内容，无法获取用户选中的代码块
- **影响**: 限制了用户复制多行代码的灵活性
- **需求**: 添加对选中内容的支持

## 用户工作流程

### 当前工作流程

1. 用户将光标定位到目标行
2. 使用快捷键 (Alt+J Alt+1 或 Alt+J Alt+2)
3. 系统复制当前行内容到剪贴板
4. 用户粘贴到目标位置

### 期望工作流程

1. 用户选中目标代码块（单行或多行）
2. 使用快捷键触发复制
3. 系统复制选中内容到剪贴板（包含格式化信息）
4. 用户粘贴到目标位置

## 竞品分析

- **Copy With Line Numbers**: 基础的行号复制功能
- **优势**: 更丰富的格式化选项和令牌系统
- **差异化**: 高度可定制的格式配置

## 成功指标

- 用户能够成功复制选中的代码块
- 保持现有功能的兼容性
- 新功能的使用率和用户反馈
