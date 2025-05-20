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

const meal = new List("meal");

const breakfast = new Task(
  "Eat",
  "Something fresh and healthy.",
  "2025-05-21",
  "Medium"
);

meal.addTask(breakfast);

const dinner = new Task(
  "Feast",
  "Something cozy and warm.",
  "2025-07-13",
  "High"
);

meal.addTask(dinner);

const tasks = document.querySelector("#tasks");

meal.getTasks().forEach((task) => {
  // Create a task container
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");

  // Add task details
  taskDiv.innerHTML = `
    <h3>${task.title}</h3>
    <p><strong>Description:</strong> ${task.description}</p>
    <p><strong>Deadline:</strong> ${task.deadline}</p>
    <p><strong>Priority:</strong> ${task.priority}</p>
  `;

  // Append to the tasks container
  tasks.appendChild(taskDiv);
});
