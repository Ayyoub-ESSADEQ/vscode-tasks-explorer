import * as vscode from "vscode";

export class TaskTreeDataProvider implements vscode.TreeDataProvider<TreeTask> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeTask | null> =
    new vscode.EventEmitter<TreeTask | null>();
  readonly onDidChangeTreeData: vscode.Event<TreeTask | null> =
    this._onDidChangeTreeData.event;

  constructor(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument(this.watchTaskFile)
    );
  }

  refresh = (item?: TreeTask) => {
    if (item) {
      this._onDidChangeTreeData.fire(item);
      return;
    }

    this._onDidChangeTreeData.fire();
  };

  getChildren = async (): Promise<TreeTask[]> => {
    let tasks = await vscode.tasks.fetchTasks().then(function (value) {
      return value;
    });

    let taskNames: TreeTask[] = [];
    if (tasks.length != 0) {
      for (let i = 0; i < tasks.length; i++) {
        const taskTree = new TreeTask(
          tasks[i].definition.type,
          tasks[i].name,
          vscode.TreeItemCollapsibleState.None
        );

        const taskCommand = {
          command: "TaskRunner.executeTask",
          title: "Execute",
          arguments: [tasks[i], taskTree, this.refresh],
        };

        taskTree.command = taskCommand;
        taskTree.tooltip = "click to run task ..";
        taskNames[i] = taskTree;
      }
    }
    return taskNames;
  };

  getTreeItem(task: TreeTask): vscode.TreeItem {
    return task;
  }

  watchTaskFile = (e: vscode.TextDocumentChangeEvent) => {
    const fileNameParts = e.document.fileName.split("\\");
    const n = fileNameParts.length;
    const folder = fileNameParts[n - 2];
    const fileName = fileNameParts[n - 1];

    if (folder === ".vscode" && fileName === "tasks.json") {
      this.refresh();
    }
  };
}

export class TreeTask extends vscode.TreeItem {
  type: string;
  taskExecution?: vscode.TaskExecution;

  constructor(
    type: string,
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.type = type;
    this.command = command;
    //@ts-ignore
    this.iconPath = new vscode.ThemeIcon("debug-start");
  }
}
