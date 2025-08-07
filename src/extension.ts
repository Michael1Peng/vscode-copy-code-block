// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { packagedCommands } from './copy-code-block';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  Object.keys(packagedCommands).forEach((key) => {
    const command = packagedCommands[key];
    context.subscriptions.push(
      vscode.commands.registerCommand(key, (option: any) => {
        command(option);
      })
    );
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
