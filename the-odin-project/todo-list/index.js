class Todo {
  constructor(
    title,
    description,
    dueDate,
    priority,
    notes = "",
    checklist = []
  ) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
    this.completed = false;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }

  addChecklistItem(item) {
    this.checklist.push({ item, done: false });
  }

  toggleChecklistItem(index) {
    if (this.checklist[index]) {
      this.checklist[index].done = !this.checklist[index].done;
    }
  }
}

// Project class - for grouping todos
class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(index) {
    this.todos.splice(index, 1);
  }

  getTodos() {
    return this.todos;
  }
}

// ProjectManager class - to manage multiple projects
class ProjectManager {
  constructor() {
    this.projects = {};
    this.defaultProject = new Project("Default");
    this.projects["Default"] = this.defaultProject;
    this.currentProject = this.defaultProject;
  }

  createProject(name) {
    if (!this.projects[name]) {
      const project = new Project(name);
      this.projects[name] = project;
    }
  }

  setCurrentProject(name) {
    if (this.projects[name]) {
      this.currentProject = this.projects[name];
    }
  }

  addTodoToCurrentProject(todo) {
    this.currentProject.addTodo(todo);
  }

  getCurrentTodos() {
    return this.currentProject.getTodos();
  }

  getProjectNames() {
    return Object.keys(this.projects);
  }
}

// Example usage
const manager = new ProjectManager();
manager.createProject("Work");
manager.setCurrentProject("Work");

const todo1 = new Todo(
  "Finish report",
  "Complete the financial report",
  "2025-05-20",
  "High"
);
manager.addTodoToCurrentProject(todo1);

console.log(manager.getCurrentTodos());
