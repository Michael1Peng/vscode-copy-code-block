'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import { EOL } from 'os';

const COPY_CODE_BLOCK = 'extension.copyCodeBlock';

export const packagedCommands: { [key: string]: (args: any) => void } = {
  [COPY_CODE_BLOCK]: (option: any) => {
    copyCodeBlock(option);
  },
};

type ReplaceRule = { re: RegExp; str: string };
type ReplaceRuleMap = Map<string, ReplaceRule>;

interface FormatConfiguration {
  codeBlockHeaderFormat?: string;
  codeBlockFooterFormat?: string;
  codeLineFormat?: string;
  multipleSelectionCreateMultipleCodeBlocks?: boolean;
  multipleSelectionsBoundalyMarkerFormat?: string;
  forcePathSeparatorSlash?: boolean;
  forceSpaceIndent?: boolean;
  formatName?: string;
}

interface PathInfo {
  fullPath: string;
  workspaceFolderRelativePath: string;
  fileBasename: string;
  fileExtname: string;
  fileBasenameWithoutExtension: string;
  workspaceFolder: string;
  fileDirname: string;
  pathSeparator: string;
  osPathSeparator: string;
  pathParse: path.ParsedPath;
}

function getFormatConfiguration(option?: any): FormatConfiguration {
  const copyCodeFormats = vscode.workspace
    .getConfiguration('copyCodeBlock')
    .get<Array<FormatConfiguration>>('formats');

  let selectedFormat: FormatConfiguration | null = null;

  if (copyCodeFormats) {
    for (const format of copyCodeFormats) {
      if (option && format.formatName === option.formatName) {
        selectedFormat = format;
        break;
      }
      if (format.formatName === 'default') {
        selectedFormat = format;
      }
    }
  }

  return {
    codeBlockHeaderFormat: selectedFormat?.codeBlockHeaderFormat || '',
    codeBlockFooterFormat: selectedFormat?.codeBlockFooterFormat || '',
    codeLineFormat: selectedFormat?.codeLineFormat || '',
    multipleSelectionCreateMultipleCodeBlocks: selectedFormat?.multipleSelectionCreateMultipleCodeBlocks || false,
    multipleSelectionsBoundalyMarkerFormat: selectedFormat?.multipleSelectionsBoundalyMarkerFormat || '',
    forcePathSeparatorSlash: selectedFormat?.forcePathSeparatorSlash || false,
    forceSpaceIndent: selectedFormat?.forceSpaceIndent || false,
  };
}

function getPathInfo(document: vscode.TextDocument, forcePathSeparatorSlash: boolean): PathInfo {
  let fullPath = document.fileName;
  let workspaceFolderRelativePath = vscode.workspace.workspaceFolders
    ? path.relative(vscode.workspace.workspaceFolders[0].uri.fsPath, fullPath)
    : fullPath;
  const fileBasename = path.basename(fullPath);
  const fileExtname = path.extname(fullPath);
  const fileBasenameWithoutExtension = path.basename(fullPath, fileExtname);
  let workspaceFolder = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : '';
  let fileDirname = path.dirname(fullPath);
  let pathSeparator = path.sep;
  const osPathSeparator = path.sep;
  let pathParse = path.parse(fullPath);

  if (forcePathSeparatorSlash) {
    fullPath = fullPath.replace(/\\/g, '/');
    workspaceFolderRelativePath = workspaceFolderRelativePath.replace(/\\/g, '/');
    workspaceFolder = workspaceFolder.replace(/\\/g, '/');
    fileDirname = fileDirname.replace(/\\/g, '/');
    pathParse.root = pathParse.root.replace(/\\/g, '/');
    pathParse.dir = pathParse.dir.replace(/\\/g, '/');
    pathParse.base = pathParse.base.replace(/\\/g, '/');
    pathParse.ext = pathParse.ext.replace(/\\/g, '/');
    pathParse.name = pathParse.name.replace(/\\/g, '/');
    pathSeparator = '/';
  }

  return {
    fullPath,
    workspaceFolderRelativePath,
    fileBasename,
    fileExtname,
    fileBasenameWithoutExtension,
    workspaceFolder,
    fileDirname,
    pathSeparator,
    osPathSeparator,
    pathParse,
  };
}

function createPlaceholderMap(
  pathInfo: PathInfo,
  document: vscode.TextDocument,
  editor: vscode.TextEditor
): ReplaceRuleMap {
  const languageId = document.languageId;
  const currentDate = new Date();
  const YYYY = currentDate.getFullYear().toString();
  const MM = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  const DD = ('0' + currentDate.getDate()).slice(-2);
  const HH = ('0' + currentDate.getHours()).slice(-2);
  const mm = ('0' + currentDate.getMinutes()).slice(-2);
  const ss = ('0' + currentDate.getSeconds()).slice(-2);
  const editorEOL = document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';

  const placeHolderMap = new Map<string, ReplaceRule>([
    ['fullPath', { re: /\$\{fullPath\}/g, str: pathInfo.fullPath }],
    ['workspaceFolderRelativePath', { re: /\$\{workspaceFolderRelativePath\}/g, str: pathInfo.workspaceFolderRelativePath }],
    ['fileBasename', { re: /\$\{fileBasename\}/g, str: pathInfo.fileBasename }],
    ['fileExtname', { re: /\$\{fileExtname\}/g, str: pathInfo.fileExtname }],
    ['fileExtnameWithoutDot', { re: /\$\{fileExtnameWithoutDot\}/g, str: pathInfo.fileExtname.replace(/\./g, '') }],
    ['fileBasenameWithoutExtension', { re: /\$\{fileBasenameWithoutExtension\}/g, str: pathInfo.fileBasenameWithoutExtension }],
    ['workspaceFolder', { re: /\$\{workspaceFolder\}/g, str: pathInfo.workspaceFolder }],
    ['fileDirname', { re: /\$\{fileDirname\}/g, str: pathInfo.fileDirname }],
    ['pathSeparator', { re: /\$\{pathSeparator\}/g, str: pathInfo.pathSeparator }],
    ['osPathSeparator', { re: /\$\{osPathSeparator\}/g, str: pathInfo.osPathSeparator }],
    ['pathParse.root', { re: /\$\{pathParse\.root\}/g, str: pathInfo.pathParse.root }],
    ['pathParse.dir', { re: /\$\{pathParse\.dir\}/g, str: pathInfo.pathParse.dir }],
    ['pathParse.base', { re: /\$\{pathParse\.base\}/g, str: pathInfo.pathParse.base }],
    ['pathParse.ext', { re: /\$\{pathParse\.ext\}/g, str: pathInfo.pathParse.ext }],
    ['pathParse.name', { re: /\$\{pathParse\.name\}/g, str: pathInfo.pathParse.name }],
    ['languageId', { re: /\$\{languageId\}/g, str: languageId }],
    ['topLineNumber', { re: /\$\{topLineNumber\}/g, str: '1' }],
    ['LINENUMBER', { re: /\$\{LINENUMBER\}/g, str: '1' }],
    ['YYYY', { re: /\$\{YYYY\}/g, str: YYYY }],
    ['MM', { re: /\$\{MM\}/g, str: MM }],
    ['DD', { re: /\$\{DD\}/g, str: DD }],
    ['HH', { re: /\$\{HH\}/g, str: HH }],
    ['mm', { re: /\$\{mm\}/g, str: mm }],
    ['ss', { re: /\$\{ss\}/g, str: ss }],
    ['osEOL', { re: /\$\{osEOL\}/g, str: EOL }],
    ['EOL', { re: /\$\{EOL\}/g, str: editorEOL }],
    ['LF', { re: /\$\{LF\}/g, str: '\n' }],
    ['CRLF', { re: /\$\{CRLF\}/g, str: '\r\n' }],
  ]);

  const mainLineText = document.lineAt(editor.selection.active.line).text;
  const headingMatch = mainLineText.match(/^\s*#+\s*(.+)$/);
  const markdownHeading = headingMatch ? headingMatch[1].trim() : '';
  
  placeHolderMap.set('MARKDOWN_HEADING', {
    re: /\$\{MARKDOWN_HEADING\}/g,
    str: markdownHeading,
  });

  return placeHolderMap;
}

function getSelectedOrCurrentLineText(
  selection: vscode.Selection,
  document: vscode.TextDocument
): string {
  if (selection.isEmpty) {
    const line = document.lineAt(selection.active.line);
    return line.text;
  } else {
    return document.getText(selection);
  }
}

function copyCodeBlock(option?: any) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('No editor is active');
    return;
  }

  const config = getFormatConfiguration(option);
  const pathInfo = getPathInfo(editor.document, config.forcePathSeparatorSlash || false);
  const document = editor.document;

  const selections = [...editor.selections].sort(
    (a, b) => a.start.line - b.start.line
  );
  const lastSelection = selections[selections.length - 1];
  const largestLineNumber = lastSelection.end.line + 1;
  const largestLineNumberLength = largestLineNumber.toString().length;

  const placeHolderMap = createPlaceholderMap(pathInfo, document, editor);

  let codeLine = '';
  let copyText = '';
  let tabSize: number = 4;
  if (config.forceSpaceIndent && typeof editor.options.tabSize === 'number') {
    tabSize = editor.options.tabSize;
  }

  selections.forEach((selection, i) => {
    if (config.multipleSelectionCreateMultipleCodeBlocks || i === 0) {
      const topLineNumber = selection.start.line + 1;
      const selectedCode = getSelectedOrCurrentLineText(selection, document);
      placeHolderMap.set('topLineNumber', {
        re: /\$\{topLineNumber\}/g,
        str: topLineNumber.toString(),
      });
      placeHolderMap.set('SELECTED_CODE', {
        re: /\$\{SELECTED_CODE\}/g,
        str: selectedCode,
      });
      const codeBlockHeader = replacePlaceHolderMap(
        config.codeBlockHeaderFormat || '',
        placeHolderMap
      );
      codeLine = replacePlaceHolderMap(config.codeLineFormat || '', placeHolderMap);
      copyText += codeBlockHeader;
    } else {
      const selectedCode = getSelectedOrCurrentLineText(selection, document);
      placeHolderMap.set('SELECTED_CODE', {
        re: /\$\{SELECTED_CODE\}/g,
        str: selectedCode,
      });
      const multipleSelectionsBoundalyMarker = replacePlaceHolderMap(
        config.multipleSelectionsBoundalyMarkerFormat || '',
        placeHolderMap
      );
      copyText += multipleSelectionsBoundalyMarker;
    }

    for (let n = selection.start.line; n <= selection.end.line; n += 1) {
      const number = leftPad(String(n + 1), largestLineNumberLength, ' ');
      let line = document.lineAt(n).text;
      if (config.forceSpaceIndent) {
        line = line.replace(/^(\t+)/, (match: string, p1: string) => {
          return ' '.repeat(p1.length * tabSize);
        });
      }

      placeHolderMap.set('LINENUMBER', {
        re: /\$\{LINENUMBER\}/g,
        str: number,
      });
      placeHolderMap.set('CODE', {
        re: /\$\{CODE\}/g,
        str: line,
      });
      const processedCodeLine = replacePlaceHolderMap(codeLine, placeHolderMap);
      copyText += processedCodeLine;
    }
    
    if (
      config.multipleSelectionCreateMultipleCodeBlocks ||
      i === selections.length - 1
    ) {
      const codeBlockFooter = replacePlaceHolderMap(
        config.codeBlockFooterFormat || '',
        placeHolderMap
      );
      copyText += codeBlockFooter;
    }
  });

  // 复制到剪贴板
  vscode.env.clipboard.writeText(copyText);
}

/**
 * 左填充（右对齐）
 */
function leftPad(str: string, len: number, ch: string = ' ') {
  if (ch.length === 0) {
    ch = ' ';
  }
  if (len - str.length > 0) {
    return ch.repeat(len - str.length) + str;
  } else {
    return str;
  }
}

/**
 * 将输入字符串中的标记正则表达式替换为指定字符串
 * @param str 待替换的原始字符串
 * @param placeHolderMap 替换规则映射
 */
function replacePlaceHolderMap(str: string, placeHolderMap: ReplaceRuleMap) {
  for (const [, rule] of placeHolderMap) {
    str = str.replace(rule.re, rule.str);
  }
  return str;
}
