"use strict";

import * as vscode from "vscode";
import { TaskTreeDataProvider } from "./TaskTreeDataProvider";
import { TasksFileManager } from "./TasksFileManager";
import { TaskExecutionHandler } from "./TaskExecutionHandler";

export function activate(context: vscode.ExtensionContext) {
  const taskTreeDataProvider = new TaskTreeDataProvider(context);
  const taskManager = new TasksFileManager();
  const taskHandler = new TaskExecutionHandler();

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider("TaskRunner", taskTreeDataProvider),
    vscode.commands.registerCommand("TaskRunner.refresh", () =>
      taskTreeDataProvider.refresh()
    ),
    vscode.commands.registerCommand(
      "TaskRunner.executeTask",
      taskHandler.executeTaskHandler
    ),
    vscode.commands.registerCommand(
      "TaskRunner.terminateTask",
      taskHandler.terminateTask
    ),
    vscode.commands.registerCommand(
      "TaskRunner.createNewTask",
      taskManager.createNewTask
    )
  );
}

export function deactivate(): void {
  // Do nothing
}
