// T.B.E Bazuri - Admin Dashboard Logic

function renderDashboard() {
  const postList = document.getElementById("postList");
  const emptyState = document.getElementById("emptyState");
  const alertContainer = document.getElementById("alertContainer");

  const posts = getPosts();

  if (posts.length === 0) {
    postList.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  postList.innerHTML = posts.map(post => `
    <div class="admin-post-card bg-white border border-gray-200 rounded-xl p-4">
      <div class="admin-post-media">
        ${getMediaThumb(post)}
      </div>
      <div class="admin-post-info">
        <a href="post-detail.html?id=${post.id}" class="admin-post-title block mb-1 hover:underline">
          ${escapeHtml(post.title)}
        </a>
        <div class="admin-post-meta flex items-center gap-4 text-sm text-gray-500">
          <span><span class="badge badge-${post.type} mr-2">${post.type.toUpperCase()}</span>${formatDate(post.createdAt)}</span>
          <span>❤️ ${getLikeCount(post.id)}</span>
        </div>
      </div>
      <div class="admin-actions">
        <span class="${post.featured ? 'text-yellow-500' : 'text-gray-400'} text-xs font-bold" title="${post.featured ? 'Featured' : 'Not featured'}">
          ${post.featured ? '📌' : '📄'}
        </span>
        <button onclick="toggleFeaturedConfirm('${post.id}')" class="btn btn-outline btn-sm">
          ${post.featured ? 'Unfeature' : 'Feature'}
        </button>
        <a href="create-post.html?id=${post.id}" class="btn btn-outline btn-sm">
          Edit
        </a>
        <button onclick="deletePostConfirm('${post.id}')" class="btn btn-danger btn-sm">
          Delete
        </button>
      </div>
    </div>
  `).join("");
}

function getMediaThumb(post) {
  if (post.type === "image" && post.mediaUrl) {
    return `<img src="${escapeHtml(post.mediaUrl)}" alt="thumb" loading="lazy">`;
  }
  if (post.type === "video" && post.mediaUrl) {
    return `<div class="flex items-center justify-center h-full bg-gray-200 text-gray-500 text-xs font-medium">▶️ Video</div>`;
  }
  return `<div class="flex items-center justify-center h-full bg-gray-100 text-gray-400 text-xs">📰 News</div>`;
}

function toggleFeaturedConfirm(id) {
  const result = toggleFeatured(id);
  renderDashboard();
  showToast(result.featured ? "Post featured!" : "Post unfeatured.", "success");
}

function handleImport(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const result = importData(e.target.result);
    if (result.success) {
      showToast(`Imported ${result.posts} posts successfully!`, "success");
      renderDashboard();
    } else {
      showToast("Import failed: " + result.error, "error");
    }
    input.value = "";
  };
  reader.readAsText(file);
}

function deletePostConfirm(id) {
  if (confirm("Are you sure you want to delete this post?")) {
    deletePost(id);
    renderDashboard();
    showToast("Post deleted successfully.", "success");
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}