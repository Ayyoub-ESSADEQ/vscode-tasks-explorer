import * as vscode from "vscode";

interface TreeTask extends vscode.TreeItem {
  taskExecution?: vscode.TaskExecution;
}

export class TaskExecutionHandler {
  private disposables: vscode.Disposable[] = [];

  public executeTaskHandler = (
    task: vscode.Task,
    treeItem: TreeTask,
    refresh: (item?: TreeTask) => void
  ) => {
    vscode.tasks.executeTask(task).then(
      (taskExecution: vscode.TaskExecution) => {
        treeItem.taskExecution = taskExecution;
      },
      (e) => vscode.window.showErrorMessage(e)
    );

    this.disposables.push(
      vscode.tasks.onDidStartTaskProcess((e) => {
        if (e.execution.task === task) {
          //@ts-ignore
          treeItem.iconPath = new vscode.ThemeIcon("debug-stop");
          treeItem.description = "running ..";
          treeItem.tooltip = "click to stop task ..";

          treeItem.command = {
            command: "TaskRunner.terminateTask",
            title: "Terminate Task",
            arguments: [treeItem.taskExecution],
          };
          refresh(treeItem);
        }
      })
    );

    this.disposables.push(
      vscode.tasks.onDidEndTaskProcess((e) => {
        if (e.execution.task === task) {
          //@ts-ignore
          treeItem.iconPath = new vscode.ThemeIcon("debug-start");
          treeItem.description = undefined;
          treeItem.tooltip = "click to run task ..";

          treeItem.command = {
            command: "TaskRunner.executeTask",
            title: "Execute",
            arguments: [task, treeItem, refresh],
          };
          refresh(treeItem);
        }
      })
    );
  };

  public terminateTask = (taskExecution: vscode.TaskExecution) => {
    taskExecution.terminate();
  };

  public dispose = () => {
    this.disposables.forEach((disposable) => disposable.dispose());
  };
}
