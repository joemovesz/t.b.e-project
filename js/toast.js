// T.B.E Bazuri - Toast Notifications

let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }
}

function showToast(message, type = "info") {
  ensureToastContainer();
  const div = document.createElement("div");
  div.className = `toast toast-${type}`;
  div.textContent = message;
  toastContainer.appendChild(div);
  setTimeout(() => {
    div.style.opacity = "0";
    setTimeout(() => div.remove(), 300);
  }, 3000);
}