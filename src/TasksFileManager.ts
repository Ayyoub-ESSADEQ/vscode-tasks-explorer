import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class TasksFileManager {
    private DEFAULT_TASK = {
        "type": "shell",
        "command": "_",
        "label": "_",
        "presentation": {
            "reveal": "never",
            "close": true
        }
    };

    private getTasksJsonPath = () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (workspaceFolders && workspaceFolders.length > 0) {
            const workspaceFolder = workspaceFolders[0].uri.fsPath;
            const tasksJsonPath = path.join(workspaceFolder, '.vscode', 'tasks.json');
            return tasksJsonPath;
        }

        return undefined;
    }

    private ensureVscodeDirectoryExists = (vscodeDir: string) => {
        if (!fs.existsSync(vscodeDir)) {
            fs.mkdirSync(vscodeDir);
        }
    }

    private createTasksJsonFile = (tasksJsonPath: string, defaultTask: object) => {
        const tasksContent = {
            "version": "2.0.0",
            "tasks": [defaultTask]
        };
        fs.writeFileSync(tasksJsonPath, JSON.stringify(tasksContent, null, 4), 'utf-8');
        vscode.window.showInformationMessage('Created tasks.json with default task.');
    }

    private updateTasksJsonFile = (tasksJsonPath: string, DEFAULT_TASK: object) => {
        const content = fs.readFileSync(tasksJsonPath, 'utf-8');
        const tasksJson = JSON.parse(content);

        if (!tasksJson.tasks) {
            tasksJson.tasks = [];
        }

        tasksJson.tasks.push(DEFAULT_TASK);

        fs.writeFileSync(tasksJsonPath, JSON.stringify(tasksJson, null, 4), 'utf-8');
        vscode.window.showInformationMessage('Added new task to tasks.json.');
    }

    public createNewTask = () => {
        const tasksJsonPath = this.getTasksJsonPath();

        if (!tasksJsonPath) {
            vscode.window.showErrorMessage('No workspace folder found.');
            return;
        }

        const vscodeDir = path.dirname(tasksJsonPath);

        this.ensureVscodeDirectoryExists(vscodeDir);

        if (!fs.existsSync(tasksJsonPath)) {
            this.createTasksJsonFile(tasksJsonPath, this.DEFAULT_TASK);
        } else {
            this.updateTasksJsonFile(tasksJsonPath, this.DEFAULT_TASK);
        }
    }
}
