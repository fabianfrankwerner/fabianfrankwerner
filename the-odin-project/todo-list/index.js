class Task {
  constructor(
    title,
    description,
    deadline,
    priority,
    notes = "",
    checklist = []
  ) {
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
    this.completed = false;
    this.id = Date.now().toString(); // Unique identifier for each task
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }

  updatePriority(priority) {
    this.priority = priority;
  }

  updateDetails(details) {
    Object.assign(this, details);
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      deadline: this.deadline,
      priority: this.priority,
      notes: this.notes,
      checklist: this.checklist,
      completed: this.completed,
    };
  }

  static fromJSON(json) {
    const task = new Task(
      json.title,
      json.description,
      json.deadline,
      json.priority,
      json.notes,
      json.checklist
    );
    task.id = json.id;
    task.completed = json.completed;
    return task;
  }
}

class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
    this.id = Date.now().toString();
  }

  addTask(task) {
    this.tasks.push(task);
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  getTask(taskId) {
    return this.tasks.find((task) => task.id === taskId);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      tasks: this.tasks.map((task) => task.toJSON()),
    };
  }

  static fromJSON(json) {
    const project = new Project(json.name);
    project.id = json.id;
    project.tasks = json.tasks.map((taskJson) => Task.fromJSON(taskJson));
    return project;
  }
}

class TodoApp {
  constructor() {
    this.projects = [];
    this.currentProject = null;
    this.loadFromLocalStorage();
  }

  addProject(name) {
    const project = new Project(name);
    this.projects.push(project);
    this.saveToLocalStorage();
    return project;
  }

  deleteProject(projectId) {
    this.projects = this.projects.filter((project) => project.id !== projectId);
    if (this.currentProject && this.currentProject.id === projectId) {
      this.currentProject = this.projects[0] || null;
    }
    this.saveToLocalStorage();
  }

  getProject(projectId) {
    return this.projects.find((project) => project.id === projectId);
  }

  saveToLocalStorage() {
    localStorage.setItem(
      "todoApp",
      JSON.stringify({
        projects: this.projects.map((project) => project.toJSON()),
        currentProjectId: this.currentProject?.id,
      })
    );
  }

  loadFromLocalStorage() {
    const data = localStorage.getItem("todoApp");
    if (data) {
      const parsed = JSON.parse(data);
      this.projects = parsed.projects.map((projectJson) =>
        Project.fromJSON(projectJson)
      );
      this.currentProject =
        this.projects.find((p) => p.id === parsed.currentProjectId) ||
        this.projects[0];
    } else {
      // Create default project if no data exists
      const defaultProject = this.addProject("Default");
      this.currentProject = defaultProject;
    }
  }
}

// Initialize the app
const app = new TodoApp();

// DOM Manipulation
function renderProjects() {
  const projectsList = document.querySelector("#projects-list");
  projectsList.innerHTML = "";

  app.projects.forEach((project) => {
    const projectElement = document.createElement("div");
    projectElement.classList.add("project");
    if (app.currentProject && project.id === app.currentProject.id) {
      projectElement.classList.add("active");
    }

    projectElement.innerHTML = `
      <div class="project-header">
        <h2>${project.name}</h2>
        <span class="task-count">${project.tasks.length} tasks</span>
      </div>
      <button class="delete-project" data-project-id="${project.id}">Delete</button>
    `;

    // Project selection
    projectElement
      .querySelector(".project-header")
      .addEventListener("click", () => {
        app.currentProject = project;
        renderProjects(); // Update active state
        renderTasks();
      });

    // Project deletion
    const deleteBtn = projectElement.querySelector(".delete-project");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent project selection when clicking delete
      if (
        confirm(
          `Are you sure you want to delete "${project.name}" and all its tasks?`
        )
      ) {
        app.deleteProject(project.id);
        renderProjects();
        renderTasks();
      }
    });

    projectsList.appendChild(projectElement);
  });
}

function renderTasks() {
  const tasksContainer = document.querySelector("#tasks");
  tasksContainer.innerHTML = "";

  if (!app.currentProject) {
    tasksContainer.innerHTML =
      '<p class="no-tasks">Select a project to view its tasks</p>';
    return;
  }

  const tasks = app.currentProject.tasks;
  if (tasks.length === 0) {
    tasksContainer.innerHTML =
      '<p class="no-tasks">No tasks in this project yet</p>';
    return;
  }

  tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.classList.add(`priority-${task.priority}`);
    if (task.completed) taskElement.classList.add("completed");

    taskElement.innerHTML = `
      <div class="task-header">
        <h3>${task.title}</h3>
        <span class="deadline">${new Date(
          task.deadline
        ).toLocaleDateString()}</span>
      </div>
      <div class="task-details" style="display: none;">
        <p><strong>Description:</strong> ${task.description}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Notes:</strong> ${task.notes}</p>
        <div class="checklist">
          ${task.checklist
            .map(
              (item) => `
            <div class="checklist-item">
              <input type="checkbox" ${item.completed ? "checked" : ""}>
              <span>${item.text}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
      <div class="task-actions">
        <button class="toggle-btn">${task.completed ? "Done" : "To-Do"}</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // Add event listeners
    const toggleBtn = taskElement.querySelector(".toggle-btn");
    toggleBtn.addEventListener("click", () => {
      task.toggleCompleted();
      taskElement.classList.toggle("completed");
      toggleBtn.textContent = task.completed ? "Done" : "To-Do";
      app.saveToLocalStorage();
    });

    const editBtn = taskElement.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      showEditForm(task);
    });

    const deleteBtn = taskElement.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this task?")) {
        app.currentProject.deleteTask(task.id);
        app.saveToLocalStorage();
        renderTasks();
      }
    });

    // Toggle task details on click
    taskElement.querySelector(".task-header").addEventListener("click", () => {
      const details = taskElement.querySelector(".task-details");
      details.style.display =
        details.style.display === "none" ? "block" : "none";
    });

    tasksContainer.appendChild(taskElement);
  });
}

function showEditForm(task) {
  const form = document.querySelector("#task-form");
  form.querySelector("#title").value = task.title;
  form.querySelector("#description").value = task.description;
  form.querySelector("#deadline").value = task.deadline;
  form.querySelector("#priority").value = task.priority;
  form.querySelector("#notes").value = task.notes;

  // Update form submit handler
  form.onsubmit = (e) => {
    e.preventDefault();
    task.updateDetails({
      title: form.querySelector("#title").value,
      description: form.querySelector("#description").value,
      deadline: form.querySelector("#deadline").value,
      priority: form.querySelector("#priority").value,
      notes: form.querySelector("#notes").value,
    });
    app.saveToLocalStorage();
    renderTasks();
    form.reset();
    form.onsubmit = null; // Reset to default handler
  };
}

// Event Listeners
document.querySelector("#project-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.querySelector("#project-name").value;
  app.addProject(name);
  renderProjects();
  e.target.reset();
});

document.querySelector("#task-form").addEventListener("submit", (e) => {
  e.preventDefault();

  if (!app.currentProject) {
    alert("Please select a project first");
    return;
  }

  const title = document.querySelector("#title").value;
  const description = document.querySelector("#description").value;
  const deadline = document.querySelector("#deadline").value;
  const priority = document.querySelector("#priority").value;
  const notes = document.querySelector("#notes").value;

  const newTask = new Task(title, description, deadline, priority, notes);
  app.currentProject.addTask(newTask);
  app.saveToLocalStorage();
  renderTasks();
  renderProjects(); // Update task count
  e.target.reset();
});

// Initial render
renderProjects();
renderTasks();
