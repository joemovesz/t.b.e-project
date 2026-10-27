// T.B.E Bazuri - Service Worker
const CACHE_NAME = "tbe-bazuri-v1";
const ASSETS = [
  "/t.b.e-project/",
  "/t.b.e-project/index.html",
  "/t.b.e-project/admin-login.html",
  "/t.b.e-project/admin-dashboard.html",
  "/t.b.e-project/create-post.html",
  "/t.b.e-project/post-detail.html",
  "/t.b.e-project/404.html",
  "/t.b.e-project/css/style.css",
  "/t.b.e-project/js/app.js",
  "/t.b.e-project/js/home.js",
  "/t.b.e-project/js/admin.js",
  "/t.b.e-project/js/toast.js",
  "/t.b.e-project/js/lightbox.js",
  "/t.b.e-project/logo/t.b.e_logo.png",
  "/t.b.e-project/manifest.json"
];

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});