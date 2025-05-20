class Task {
  constructor(title, description, deadline, priority) {
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.priority = priority;
    this.completed = false;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }

  updatePriority(priority) {
    return (this.priority = priority);
  }
}

class List {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
  }

  getTasks() {
    return this.tasks;
  }
}
