// T.B.E Bazuri - Homepage Logic

document.addEventListener("DOMContentLoaded", () => {
  const postsGrid = document.getElementById("postsGrid");
  const emptyState = document.getElementById("emptyState");
  const adminBtn = document.getElementById("adminBtn");
  const viewPostsBtn = document.getElementById("viewPostsBtn");
  const authLink = document.getElementById("authLink");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  const paginationContainer = document.getElementById("pagination");

  let allPosts = [];
  let filteredPosts = [];
  let currentPage = 1;

  // Update nav based on auth state
  function updateAuthUI() {
    if (isAdmin()) {
      adminBtn.classList.remove("hidden");
      authLink.innerHTML = `
        <a href="#" onclick="logout()" class="text-gray-600 hover:text-red-600 font-medium px-3 py-1 rounded hover:bg-red-50">Logout</a>
      `;
    } else {
      authLink.innerHTML = `
        <a href="admin-login.html" class="text-gray-600 hover:text-blue-600 font-medium px-3 py-1 rounded hover:bg-blue-50">Admin Login</a>
      `;
    }
  }

  // Render category filter options
  function renderCategoryFilter() {
    if (!categoryFilter) return;
    const categories = getCategories();
    categoryFilter.innerHTML = categories.map(cat => `
      <option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>
    `).join("");
  }

  // Render posts with pagination
  function renderPosts(postsToRender = filteredPosts) {
    if (postsToRender.length === 0) {
      postsGrid.innerHTML = "";
      emptyState.classList.remove("hidden");
      return;
    }

    // Sort: featured posts first, then by date
    const sorted = [...postsToRender].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    emptyState.classList.add("hidden");

    // Paginate
    const totalPages = getTotalPages(sorted);
    currentPage = Math.min(currentPage, totalPages) || 1;
    const pageItems = paginate(sorted, currentPage);

    postsGrid.innerHTML = pageItems.map(post => {
      const likeCount = getLikeCount(post.id);
      const liked = hasUserLiked(post.id);
      const viewCount = getViewCount(post.id);
      const mediaHtml = getMediaHtml(post);
      const featuredBadge = post.featured ? `<span class="badge" style="background:var(--accent);color:#fff;">📌 FEATURED</span>` : "";
      const categoryTags = (post.categories || []).map(cat => `
        <span class="badge text-xs">${escapeHtml(cat)}</span>
      `).join("");

      return `
        <article class="post-card post-card-group ${post.featured ? 'featured-post' : ''}">
          ${mediaHtml}
          <div class="post-content">
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span class="post-type badge badge-${post.type}">${post.type.toUpperCase()}</span>
              ${featuredBadge}
              ${categoryTags}
            </div>
            <h3 class="post-title"><a href="post-detail.html?id=${post.id}" style="text-decoration:none; color:inherit">${escapeHtml(post.title)}</a></h3>
            <p class="post-excerpt">${escapeHtml(post.content.substring(0, 120))}${post.content.length > 120 ? "…" : ""}</p>
            <div class="post-footer">
              <div class="flex items-center gap-2 text-xs text-gray-400">
                <span>📅 ${formatRelativeDate(post.createdAt)}</span>
                <span>•</span>
                <span>👁️ ${viewCount}</span>
              </div>
              <button class="like-btn ${liked ? "liked" : ""}" onclick="handleLike('${post.id}', this)" aria-label="Like post">
                <span class="liked-icon ${liked ? '' : 'hidden'}">❤️</span>
                <span class="unliked-icon ${liked ? 'hidden' : ''}">🤍</span>
                <span class="like-count">${likeCount}</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    renderPagination(totalPages);
    if (typeof reinitLightbox === "function") reinitLightbox();
  }

  function renderPagination(totalPages) {
    if (!paginationContainer) return;
    if (totalPages <= 1) {
      paginationContainer.innerHTML = "";
      return;
    }

    let html = `<div class="flex items-center gap-2 text-sm">`;
    html += `<button onclick="changePage(${currentPage - 1})" class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" ${currentPage === 1 ? 'disabled' : ''}>← Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button onclick="changePage(${i})" class="px-3 py-1 rounded ${currentPage === i ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}">${i}</button>`;
    }
    html += `<button onclick="changePage(${currentPage + 1})" class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" ${currentPage === totalPages ? 'disabled' : ''}>Next →</button>`;
    html += `</div>`;
    paginationContainer.innerHTML = html;
  }

  window.changePage = function(page) {
    currentPage = page;
    renderPosts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function applyFilters() {
    const search = searchInput.value.toLowerCase().trim();
    const type = typeFilter.value;
    const category = categoryFilter ? categoryFilter.value : "all";

    filteredPosts = allPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(search) ||
        post.content.toLowerCase().includes(search);
      const matchesType = type === "all" || post.type === type;
      const matchesCategory = category === "all" || (post.categories || []).includes(category);
      return matchesSearch && matchesType && matchesCategory;
    });

    currentPage = 1;
    renderPosts();
  }

  function getMediaHtml(post) {
    if (post.type === "video" && post.mediaUrl) {
      const videoId = extractYouTubeId(post.mediaUrl);
      if (videoId) {
        return `
          <div class="post-media">
            <iframe src="https://www.youtube.com/embed/${videoId}" title="${escapeHtml(post.title)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        `;
      }
      return `
        <div class="post-media">
          <video src="${escapeHtml(post.mediaUrl)}" poster="" class="w-full h-full object-cover" muted playsinline></video>
        </div>
      `;
    }
    if (post.type === "image" && post.mediaUrl) {
      return `
        <div class="post-media">
          <img src="${escapeHtml(post.mediaUrl)}" alt="${escapeHtml(post.title)}" loading="lazy">
        </div>
      `;
    }
    return `
      <div class="post-media bg-gray-100 flex items-center justify-center">
        <div class="text-gray-400 text-sm">📰 No image available</div>
      </div>
    `;
  }

  function extractYouTubeId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  window.handleLike = function(postId, btn) {
    const result = toggleLike(postId);
    const countEl = btn.querySelector(".like-count");
    const heartEl = btn.querySelector(".liked-icon");
    const unheartEl = btn.querySelector(".unliked-icon");

    countEl.textContent = result.likes;

    if (result.liked) {
      btn.classList.add("liked");
      heartEl.classList.remove("hidden");
      unheartEl.classList.add("hidden");
    } else {
      btn.classList.remove("liked");
      heartEl.classList.add("hidden");
      unheartEl.classList.remove("hidden");
    }
  };

  // Initialize
  updateAuthUI();
  renderCategoryFilter();
  allPosts = getPosts();
  filteredPosts = [...allPosts];
  renderPosts();

  // Search & filter listeners
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }
  if (typeFilter) {
    typeFilter.addEventListener("change", applyFilters);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener("change", applyFilters);
  }

  // Hero CTA buttons
  viewPostsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    renderPosts();
    window.scrollTo({ top: postsGrid.offsetTop, behavior: "smooth" });
  });
});