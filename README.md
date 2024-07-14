# Task Runner

There are many tools to help you automate different parts of your project, like installing dependencies, building, testing, checking for code errors, and deploying. Visual Studio Code (VS Code) has a "Task Manager" in the Explorer Pane that lets you see and run these tasks easily.

VS Code can automatically recognize task runners such as:

- Gulp
- Grunt
- Jake
- npm

To customize your tasks, you can use a file called `tasks.json`. This file lets you create tasks that fit your project needs. Here's an example of what a `tasks.json` file might look like:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build Project",
            "type": "shell",
            "command": "npm run build",
            "group": "build",
            "problemMatcher": []
        },
        {
            "label": "Lint Code",
            "type": "shell",
            "command": "npm run lint",
            "group": "build",
            "problemMatcher": ["$eslint-stylish"]
        },
        {
            "label": "Run Tests",
            "type": "shell",
            "command": "npm test",
            "group": "test",
            "problemMatcher": ["$mocha"]
        }
    ]
}
```

In this file, you can define tasks such as:

- **Build Project**: Runs `npm run build` to build your project.
- **Lint Code**: Runs `npm run lint` to check your code for errors.
- **Run Tests**: Runs `npm test` to run your tests.

By using the Task Manager and `tasks.json` file in VS Code, you can make your workflow smoother and handle your project's tasks more efficiently.