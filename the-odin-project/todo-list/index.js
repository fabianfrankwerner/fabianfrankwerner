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

function renderTasks() {
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
      <button onclick="${() => task.toggleCompleted()}">${
      task.toggleCompleted() ? "Done" : "To-Do"
    }</button>
    `;

    // Append to the tasks container
    tasks.appendChild(taskDiv);
  });
}

document
  .querySelector("#task-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const deadline = document.querySelector("#deadline").value;
    const priority = document.querySelector("#priority").value;

    const newTask = new Task(title, description, deadline, priority);
    meal.addTask(newTask);

    // Optionally clear form
    event.target.reset();

    // Refresh task list in DOM
    renderTasks();
  });

renderTasks();
