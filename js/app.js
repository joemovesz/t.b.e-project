// T.B.E Bazuri - Shared App Logic

const ADMIN_EMAIL = "tebangenebazuri@gmail.com";
const STORAGE_KEY = "tbe_posts";
const LIKES_KEY = "tbe_likes";

// ---- Post Data Model ----
function createPost(id, title, type, content, mediaUrl) {
  return {
    id,
    title,
    type, // 'video' | 'image' | 'news'
    content,
    mediaUrl,
    createdAt: new Date().toISOString(),
    likes: 0
  };
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ---- Posts (localStorage) ----
function getPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read posts", e);
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function addPost(post) {
  const posts = getPosts();
  posts.unshift(post);
  savePosts(posts);
  return posts;
}

function updatePost(id, updates) {
  const posts = getPosts().map(p => (p.id === id ? { ...p, ...updates } : p));
  savePosts(posts);
  return posts;
}

function deletePost(id) {
  const posts = getPosts().filter(p => p.id !== id);
  savePosts(posts);
  // also remove likes
  const likes = getLikes();
  delete likes[id];
  localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
  return posts;
}

function getPostById(id) {
  return getPosts().find(p => p.id === id);
}

// ---- Likes ----
function getLikes() {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function getLikeCount(postId) {
  const likes = getLikes();
  return likes[postId] || 0;
}

function hasUserLiked(postId) {
  const liked = sessionStorage.getItem("tbe_liked_posts");
  if (!liked) return false;
  try {
    return JSON.parse(liked).includes(postId);
  } catch (e) {
    return false;
  }
}

function toggleLike(postId) {
  const likes = getLikes();
  const current = likes[postId] || 0;

  const liked = sessionStorage.getItem("tbe_liked_posts");
  let likedList = [];
  if (liked) {
    try { likedList = JSON.parse(liked); } catch (e) {}
  }

  if (likedList.includes(postId)) {
    // unlike
    likes[postId] = Math.max(0, current - 1);
    likedList = likedList.filter(id => id !== postId);
  } else {
    // like
    likes[postId] = current + 1;
    likedList.push(postId);
  }

  localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
  sessionStorage.setItem("tbe_liked_posts", JSON.stringify(likedList));
  return { likes: likes[postId], liked: !likedList.includes(postId) };
}

// ---- Auth (session only, admin email gate) ----
function isAdmin() {
  return sessionStorage.getItem("tbe_admin") === "true";
}

function login(email) {
  if (email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()) {
    sessionStorage.setItem("tbe_admin", "true");
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem("tbe_admin");
}

// ---- Redirect helpers ----
function requireAdmin() {
  if (!isAdmin()) {
    window.location.href = "admin-login.html";
  }
}

function requirePublic() {
  // If admin is logged in and tries to hit login page, send to dashboard
  if (isAdmin()) {
    window.location.href = "admin-dashboard.html";
  }
}

// ---- Navigation highlight ----
function setActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("text-primary", "font-bold");
    } else {
      link.classList.remove("text-primary", "font-bold");
    }
  });
}

// ---- Format date ----
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

// ---- Relative date formatting ----
function formatRelativeDate(isoString) {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now - then;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return diffMins + " min ago";
  if (diffHours < 24) return diffHours + " hr ago";
  if (diffDays < 7) return diffDays + " days ago";
  return formatDate(isoString);
}

// ---- View counter ----
const VIEWS_KEY = "tbe_views";

function getViews() {
  try {
    const raw = localStorage.getItem(VIEWS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function incrementViews(postId) {
  const views = getViews();
  views[postId] = (views[postId] || 0) + 1;
  localStorage.setItem(VIEWS_KEY, JSON.stringify(views));
  return views[postId];
}

function getViewCount(postId) {
  return (getViews()[postId] || 0);
}