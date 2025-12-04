// API Configuration
const API_BASE_URL = "http://localhost:3000/api";

// State Management
let currentUser = null;
let editingPost = null;
let editingUser = null;

// DOM Elements
const navItems = document.querySelectorAll(".nav-item");
const contentSections = document.querySelectorAll(".content-section");
const pageTitle = document.getElementById("page-title");
const currentUserSpan = document.getElementById("current-user");
const logoutBtn = document.getElementById("logout-btn");
const notification = document.getElementById("notification");

// Dashboard elements
const totalPosts = document.getElementById("total-posts");
const publishedPosts = document.getElementById("published-posts");
const totalComments = document.getElementById("total-comments");
const totalUsers = document.getElementById("total-users");
const recentPosts = document.getElementById("recent-posts");

// Modal elements
const postModal = document.getElementById("post-modal");
const userModal = document.getElementById("user-modal");
const postModalClose = document.getElementById("post-modal-close");
const userModalClose = document.getElementById("user-modal-close");
const postForm = document.getElementById("post-form");
const userForm = document.getElementById("user-form");

// Button elements
const newPostBtn = document.getElementById("new-post-btn");
const newUserBtn = document.getElementById("new-user-btn");
const cancelPostBtn = document.getElementById("cancel-post");
const cancelUserBtn = document.getElementById("cancel-user");

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeAdmin();
});

function initializeAdmin() {
  // Check authentication
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return;
  }

  // Get current user
  currentUser = JSON.parse(localStorage.getItem("user"));
  if (!currentUser || currentUser.role !== "AUTHOR") {
    showNotification("Access denied. Author role required.", "error");
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
    return;
  }

  // Set up event listeners
  setupNavigation();
  setupModals();
  setupForms();
  setupButtons();

  // Update UI
  updateUserInfo();
  loadDashboard();
}

// Navigation
function setupNavigation() {
  navItems.forEach((item) => {
    if (item.dataset.section) {
      item.addEventListener("click", () => {
        const targetSection = item.dataset.section;
        showSection(targetSection);

        // Update active nav item
        navItems.forEach((nav) => nav.classList.remove("active"));
        item.classList.add("active");
      });
    }
  });

  logoutBtn.addEventListener("click", logout);
}

function showSection(sectionId) {
  contentSections.forEach((section) => {
    section.classList.remove("active");
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
    pageTitle.textContent = getSectionTitle(sectionId);

    // Load section data
    switch (sectionId) {
      case "dashboard":
        loadDashboard();
        break;
      case "posts":
        loadPosts();
        break;
      case "comments":
        loadComments();
        break;
      case "users":
        loadUsers();
        break;
    }
  }
}

function getSectionTitle(sectionId) {
  const titles = {
    dashboard: "Dashboard",
    posts: "Manage Posts",
    comments: "Manage Comments",
    users: "Manage Users",
  };
  return titles[sectionId] || "Dashboard";
}

// API Functions
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Add authorization header
  const token = localStorage.getItem("token");
  if (token) {
    defaultOptions.headers["Authorization"] = `Bearer ${token}`;
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Dashboard
async function loadDashboard() {
  try {
    const [posts, comments, users] = await Promise.all([
      apiRequest("/posts"),
      apiRequest("/comments"),
      apiRequest("/users"),
    ]);

    // Update stats
    totalPosts.textContent = posts.length;
    publishedPosts.textContent = posts.filter((post) => post.published).length;
    totalComments.textContent = comments.length;
    totalUsers.textContent = users.length;

    // Load recent posts
    displayRecentPosts(posts.slice(0, 5));
  } catch (error) {
    showNotification("Error loading dashboard: " + error.message, "error");
  }
}

function displayRecentPosts(posts) {
  if (posts.length === 0) {
    recentPosts.innerHTML =
      '<p style="color: #6c757d; text-align: center;">No posts yet.</p>';
    return;
  }

  recentPosts.innerHTML = posts
    .map(
      (post) => `
        <div class="activity-item">
            <div>
                <strong>${escapeHtml(post.title)}</strong>
                <br>
                <small>By ${escapeHtml(post.author.username)} • ${formatDate(
        post.createdAt
      )}</small>
            </div>
            <span class="status-badge ${
              post.published ? "published" : "draft"
            }">
                ${post.published ? "Published" : "Draft"}
            </span>
        </div>
    `
    )
    .join("");
}

// Posts Management
async function loadPosts() {
  try {
    const posts = await apiRequest("/posts");
    displayPosts(posts);
  } catch (error) {
    showNotification("Error loading posts: " + error.message, "error");
  }
}

function displayPosts(posts) {
  const tbody = document.getElementById("posts-table-body");

  if (posts.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align: center; color: #6c757d;">No posts found.</td></tr>';
    return;
  }

  tbody.innerHTML = posts
    .map(
      (post) => `
        <tr>
            <td>
                <strong>${escapeHtml(post.title)}</strong>
                <br>
                <small style="color: #6c757d;">${escapeHtml(
                  post.content.substring(0, 100)
                )}${post.content.length > 100 ? "..." : ""}</small>
            </td>
            <td>${escapeHtml(post.author.username)}</td>
            <td>
                <span class="status-badge ${
                  post.published ? "published" : "draft"
                }">
                    ${post.published ? "Published" : "Draft"}
                </span>
            </td>
            <td>${post.comments.length}</td>
            <td>${formatDate(post.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editPost('${
                      post.id
                    }')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm ${
                      post.published ? "btn-warning" : "btn-success"
                    }" onclick="togglePublish('${post.id}', ${post.published})">
                        <i class="fas fa-${
                          post.published ? "eye-slash" : "eye"
                        }"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletePost('${
                      post.id
                    }')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

// Comments Management
async function loadComments() {
  try {
    const comments = await apiRequest("/comments");
    displayComments(comments);
  } catch (error) {
    showNotification("Error loading comments: " + error.message, "error");
  }
}

function displayComments(comments) {
  const tbody = document.getElementById("comments-table-body");

  if (comments.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; color: #6c757d;">No comments found.</td></tr>';
    return;
  }

  tbody.innerHTML = comments
    .map(
      (comment) => `
        <tr>
            <td>
                <div style="max-width: 300px;">
                    ${escapeHtml(comment.content)}
                </div>
            </td>
            <td>${escapeHtml(comment.user.username)}</td>
            <td>${escapeHtml(comment.post.title)}</td>
            <td>${formatDate(comment.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-danger" onclick="deleteComment('${
                      comment.id
                    }')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

// Users Management
async function loadUsers() {
  try {
    const users = await apiRequest("/users");
    displayUsers(users);
  } catch (error) {
    showNotification("Error loading users: " + error.message, "error");
  }
}

function displayUsers(users) {
  const tbody = document.getElementById("users-table-body");

  if (users.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align: center; color: #6c757d;">No users found.</td></tr>';
    return;
  }

  tbody.innerHTML = users
    .map(
      (user) => `
        <tr>
            <td>${escapeHtml(user.username)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>
                <span class="status-badge ${
                  user.role === "AUTHOR" ? "author" : "user"
                }">
                    ${user.role}
                </span>
            </td>
            <td>${user.posts ? user.posts.length : 0}</td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editUser('${
                      user.id
                    }')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${
                      user.id
                    }')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

// Modal Setup
function setupModals() {
  // Post modal
  postModalClose.addEventListener("click", closePostModal);
  cancelPostBtn.addEventListener("click", closePostModal);

  // User modal
  userModalClose.addEventListener("click", closeUserModal);
  cancelUserBtn.addEventListener("click", closeUserModal);

  // Close modals when clicking outside
  postModal.addEventListener("click", (e) => {
    if (e.target === postModal) closePostModal();
  });

  userModal.addEventListener("click", (e) => {
    if (e.target === userModal) closeUserModal();
  });
}

function setupButtons() {
  newPostBtn.addEventListener("click", () => {
    editingPost = null;
    document.getElementById("modal-title").textContent = "New Post";
    postForm.reset();
    postModal.style.display = "block";
  });

  newUserBtn.addEventListener("click", () => {
    editingUser = null;
    userForm.reset();
    userModal.style.display = "block";
  });
}

function setupForms() {
  postForm.addEventListener("submit", handlePostSubmit);
  userForm.addEventListener("submit", handleUserSubmit);
}

// Post Management
async function handlePostSubmit(e) {
  e.preventDefault();

  const formData = new FormData(postForm);
  const data = {
    title: formData.get("title"),
    content: formData.get("content"),
    published: formData.get("published") === "on",
  };

  try {
    if (editingPost) {
      await apiRequest(`/posts/${editingPost}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      showNotification("Post updated successfully", "success");
    } else {
      await apiRequest("/posts", {
        method: "POST",
        body: JSON.stringify(data),
      });
      showNotification("Post created successfully", "success");
    }

    closePostModal();
    loadPosts();
    loadDashboard();
  } catch (error) {
    showNotification("Error saving post: " + error.message, "error");
  }
}

async function editPost(postId) {
  try {
    const post = await apiRequest(`/posts/${postId}`);
    editingPost = postId;

    document.getElementById("modal-title").textContent = "Edit Post";
    document.getElementById("post-title").value = post.title;
    document.getElementById("post-content").value = post.content;
    document.getElementById("post-published").checked = post.published;

    postModal.style.display = "block";
  } catch (error) {
    showNotification("Error loading post: " + error.message, "error");
  }
}

async function togglePublish(postId, currentStatus) {
  try {
    const endpoint = currentStatus
      ? `/posts/${postId}/unpublish`
      : `/posts/${postId}/publish`;
    await apiRequest(endpoint, { method: "PATCH" });

    showNotification(
      `Post ${currentStatus ? "unpublished" : "published"} successfully`,
      "success"
    );
    loadPosts();
    loadDashboard();
  } catch (error) {
    showNotification("Error updating post status: " + error.message, "error");
  }
}

async function deletePost(postId) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    await apiRequest(`/posts/${postId}`, { method: "DELETE" });
    showNotification("Post deleted successfully", "success");
    loadPosts();
    loadDashboard();
  } catch (error) {
    showNotification("Error deleting post: " + error.message, "error");
  }
}

// User Management
async function handleUserSubmit(e) {
  e.preventDefault();

  const formData = new FormData(userForm);
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  try {
    if (editingUser) {
      await apiRequest(`/users/${editingUser}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      showNotification("User updated successfully", "success");
    } else {
      await apiRequest("/users", {
        method: "POST",
        body: JSON.stringify(data),
      });
      showNotification("User created successfully", "success");
    }

    closeUserModal();
    loadUsers();
    loadDashboard();
  } catch (error) {
    showNotification("Error saving user: " + error.message, "error");
  }
}

async function editUser(userId) {
  try {
    const user = await apiRequest(`/users/${userId}`);
    editingUser = userId;

    document.getElementById("user-username").value = user.username;
    document.getElementById("user-email").value = user.email;
    document.getElementById("user-role").value = user.role;
    document.getElementById("user-password").value = "";

    userModal.style.display = "block";
  } catch (error) {
    showNotification("Error loading user: " + error.message, "error");
  }
}

async function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    await apiRequest(`/users/${userId}`, { method: "DELETE" });
    showNotification("User deleted successfully", "success");
    loadUsers();
    loadDashboard();
  } catch (error) {
    showNotification("Error deleting user: " + error.message, "error");
  }
}

// Comment Management
async function deleteComment(commentId) {
  if (!confirm("Are you sure you want to delete this comment?")) return;

  try {
    await apiRequest(`/comments/${commentId}`, { method: "DELETE" });
    showNotification("Comment deleted successfully", "success");
    loadComments();
    loadDashboard();
  } catch (error) {
    showNotification("Error deleting comment: " + error.message, "error");
  }
}

// Modal Functions
function closePostModal() {
  postModal.style.display = "none";
  editingPost = null;
  postForm.reset();
}

function closeUserModal() {
  userModal.style.display = "none";
  editingUser = null;
  userForm.reset();
}

// Utility Functions
function updateUserInfo() {
  if (currentUser) {
    currentUserSpan.textContent = currentUser.username;
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
}

function showNotification(message, type) {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
