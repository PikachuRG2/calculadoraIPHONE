const CACHE = "posto-app-v1";
const ASSETS = ["./", "index.html", "money-posto.png", "manifest.json", "sw.js"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) =>
      Promise.all(ks.map((k) => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(
    caches.match(r).then(
      (m) =>
        m ||
        fetch(r).then((res) => {
          const cp = res.clone();
          caches.open(CACHE).then((c) => c.put(r, cp));
          return res;
        })
    )
  );
});
