# VSCode Copy Code Block 扩展项目简介

## 项目概述

这是一个 VSCode 扩展项目，名为"Copy Code Block"，允许用户以自定义格式复制代码块，包含文件名和行号信息。

## 项目基本信息

- **项目名称**: vscode-copy-code-block
- **显示名称**: Copy Code Block
- **版本**: 0.0.11
- **发布者**: Matsuyanagi
- **类型**: VSCode 扩展
- **主要语言**: TypeScript
- **VSCode 引擎版本**: ^1.77.0

## 核心功能

1. 复制当前光标行或选中内容，支持自定义格式
2. 支持多种预设格式（默认格式、Markdown 格式等）
3. 丰富的令牌系统，支持文件路径、行号、语言 ID 等变量
4. 可配置的键盘快捷键绑定
5. 支持多选区域的处理

## 当前需求（PRD）

- **主要需求**: 添加新的参数 `${SELECTED_CODE}` 来获取当前选中的内容
- **现状**: 目前 settings 只能通过 `${CODE}` 获取当前光标所在行的内容
- **目标**: 扩展功能以支持获取用户选中的代码块内容

## 技术栈

- TypeScript
- VSCode Extension API
- Node.js
- ESLint
- Mocha (测试框架)

## 项目结构

- `src/`: 源代码目录
- `out/`: 编译输出目录
- `images/`: 项目图片资源
- `test/`: 测试文件
- 配置文件: package.json, tsconfig.json, .eslintrc.json

## 关键特性

- 支持多种代码块格式输出
- 丰富的路径和时间令牌系统
- 可配置的多选区域处理
- 跨平台路径分隔符处理
- 强制空格缩进选项
