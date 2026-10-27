// T.B.E Bazuri - Image Lightbox

let currentLightboxSrc = "";
let currentLightboxCaption = "";

function openLightbox(src, caption) {
  currentLightboxSrc = src;
  currentLightboxCaption = caption;

  // Remove existing lightbox if any
  const existing = document.querySelector(".lightbox");
  if (existing) existing.remove();

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <div class="lightbox-close" onclick="closeLightbox()" aria-label="Close lightbox">✕</div>
    <img src="${src}" alt="${caption}" class="lightbox-content" onclick="event.stopPropagation()">
    <div class="lightbox-caption">${caption}</div>
  `;
  lightbox.onclick = (e) => {
    if (e.target === lightbox) closeLightbox();
  };
  document.body.appendChild(lightbox);
  // Small delay to allow transition
  requestAnimationFrame(() => {
    lightbox.classList.add("open");
  });
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.querySelector(".lightbox");
  if (!lightbox) return;
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  setTimeout(() => lightbox.remove(), 300);
}

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// Make images clickable to open lightbox
function initLightboxImages() {
  document.querySelectorAll(".post-media img, #postMedia img").forEach(img => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      openLightbox(img.src, img.alt || "Image");
    });
  });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", initLightboxImages);
// Re-initialize after dynamic content changes (e.g., pagination)
window.reinitLightbox = initLightboxImages;