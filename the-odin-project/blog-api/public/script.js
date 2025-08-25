// API Configuration
const API_BASE_URL = "http://localhost:3000/api";

// State Management
let currentUser = null;
let currentPost = null;

// DOM Elements
const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");
const postsContainer = document.getElementById("posts-container");
const postsLoading = document.getElementById("posts-loading");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginMessage = document.getElementById("login-message");
const registerMessage = document.getElementById("register-message");
const postModal = document.getElementById("post-modal");
const modalClose = document.getElementById("modal-close");
const commentForm = document.getElementById("comment-form");
const notification = document.getElementById("notification");
const adminBtn = document.getElementById("admin-btn");

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function initializeApp() {
  // Load posts on page load
  loadPosts();

  // Set up event listeners
  setupNavigation();
  setupForms();
  setupModal();

  // Check for stored token
  const token = localStorage.getItem("token");
  if (token) {
    currentUser = JSON.parse(localStorage.getItem("user"));
    updateNavigation();
  }
}

// Navigation
function setupNavigation() {
  navButtons.forEach((button) => {
    if (button.dataset.section) {
      button.addEventListener("click", () => {
        const targetSection = button.dataset.section;
        showSection(targetSection);

        // Update active button
        navButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
    }
  });

  // Admin button click handler
  adminBtn.addEventListener("click", () => {
    window.location.href = "/admin.html";
  });
}

function showSection(sectionId) {
  sections.forEach((section) => {
    section.classList.remove("active");
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
  }
}

function updateNavigation() {
  if (currentUser) {
    // Update navigation to show user info
    const loginBtn = document.querySelector('[data-section="login"]');
    const registerBtn = document.querySelector('[data-section="register"]');

    loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.username}`;
    registerBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;

    // Show admin button for AUTHOR users
    if (currentUser.role === "AUTHOR") {
      adminBtn.style.display = "flex";
    }

    // Change logout functionality
    registerBtn.onclick = logout;
  }
}

// API Functions
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Add authorization header if token exists
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

// Posts
async function loadPosts() {
  try {
    showLoading(true);
    const posts = await apiRequest("/posts/published");
    displayPosts(posts);
  } catch (error) {
    showNotification("Error loading posts: " + error.message, "error");
  } finally {
    showLoading(false);
  }
}

function displayPosts(posts) {
  if (posts.length === 0) {
    postsContainer.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-newspaper" style="font-size: 3rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem;"></i>
                <p style="color: white; text-align: center;">No published posts yet.</p>
            </div>
        `;
    return;
  }

  postsContainer.innerHTML = posts
    .map(
      (post) => `
        <div class="post-card" onclick="openPost('${post.id}')">
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <p class="post-excerpt">${escapeHtml(
              post.content.substring(0, 150)
            )}${post.content.length > 150 ? "..." : ""}</p>
            <div class="post-meta">
                <span class="author">By ${escapeHtml(
                  post.author.username
                )}</span>
                <div class="post-info">
                    <span class="date">${formatDate(post.createdAt)}</span>
                    <span class="comments-count">
                        <i class="fas fa-comment"></i>
                        ${post.comments.length}
                    </span>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

async function openPost(postId) {
  try {
    const post = await apiRequest(`/posts/${postId}`);
    currentPost = post;
    displayPostModal(post);
  } catch (error) {
    showNotification("Error loading post: " + error.message, "error");
  }
}

function displayPostModal(post) {
  document.getElementById("modal-title").textContent = post.title;
  document.getElementById(
    "modal-author"
  ).textContent = `By ${post.author.username}`;
  document.getElementById("modal-date").textContent = formatDate(
    post.createdAt
  );
  document.getElementById("modal-content").textContent = post.content;

  displayComments(post.comments);
  postModal.style.display = "block";
}

function displayComments(comments) {
  const commentsContainer = document.getElementById("modal-comments");

  if (comments.length === 0) {
    commentsContainer.innerHTML =
      '<p style="color: #666; text-align: center;">No comments yet. Be the first to comment!</p>';
    return;
  }

  commentsContainer.innerHTML = comments
    .map(
      (comment) => `
        <div class="comment">
            <div class="comment-header">
                <span class="comment-author">${escapeHtml(
                  comment.user.username
                )}</span>
                <span class="comment-date">${formatDate(
                  comment.createdAt
                )}</span>
            </div>
            <div class="comment-content">${escapeHtml(comment.content)}</div>
        </div>
    `
    )
    .join("");
}

// Authentication
function setupForms() {
  loginForm.addEventListener("submit", handleLogin);
  registerForm.addEventListener("submit", handleRegister);
  commentForm.addEventListener("submit", handleComment);
}

async function handleLogin(e) {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await apiRequest("/users/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Store token and user info
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    currentUser = response.user;

    showMessage(loginMessage, "Login successful!", "success");
    updateNavigation();

    // Switch to posts section
    setTimeout(() => {
      showSection("posts");
      document.querySelector('[data-section="posts"]').classList.add("active");
      document
        .querySelector('[data-section="login"]')
        .classList.remove("active");
    }, 1000);
  } catch (error) {
    showMessage(loginMessage, error.message, "error");
  }
}

async function handleRegister(e) {
  e.preventDefault();

  const formData = new FormData(registerForm);
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await apiRequest("/users/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Store token and user info
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    currentUser = response.user;

    showMessage(registerMessage, "Registration successful!", "success");
    updateNavigation();

    // Switch to posts section
    setTimeout(() => {
      showSection("posts");
      document.querySelector('[data-section="posts"]').classList.add("active");
      document
        .querySelector('[data-section="register"]')
        .classList.remove("active");
    }, 1000);
  } catch (error) {
    showMessage(registerMessage, error.message, "error");
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  currentUser = null;

  // Reset navigation
  const loginBtn = document.querySelector('[data-section="login"]');
  const registerBtn = document.querySelector('[data-section="register"]');

  loginBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
  registerBtn.innerHTML = `<i class="fas fa-user-plus"></i> Register`;

  // Hide admin button
  adminBtn.style.display = "none";

  // Reset event listeners
  setupNavigation();

  // Switch to posts section
  showSection("posts");
  document.querySelector('[data-section="posts"]').classList.add("active");

  showNotification("Logged out successfully", "success");
}

async function handleComment(e) {
  e.preventDefault();

  if (!currentUser) {
    showNotification("Please login to comment", "error");
    return;
  }

  const content = document.getElementById("comment-content").value;

  try {
    await apiRequest("/comments", {
      method: "POST",
      body: JSON.stringify({
        content,
        postId: currentPost.id,
      }),
    });

    // Reload comments
    const post = await apiRequest(`/posts/${currentPost.id}`);
    displayComments(post.comments);

    // Clear form
    document.getElementById("comment-content").value = "";

    showNotification("Comment added successfully", "success");
  } catch (error) {
    showNotification("Error adding comment: " + error.message, "error");
  }
}

// Modal
function setupModal() {
  modalClose.addEventListener("click", closeModal);

  // Close modal when clicking outside
  postModal.addEventListener("click", (e) => {
    if (e.target === postModal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && postModal.style.display === "block") {
      closeModal();
    }
  });
}

function closeModal() {
  postModal.style.display = "none";
  currentPost = null;
  document.getElementById("comment-content").value = "";
}

// Utility Functions
function showLoading(show) {
  postsLoading.style.display = show ? "block" : "none";
}

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `auth-message ${type}`;

  setTimeout(() => {
    element.textContent = "";
    element.className = "auth-message";
  }, 3000);
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
