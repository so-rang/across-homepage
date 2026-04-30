// Stub service worker. The site no longer ships a service worker, but
// browsers that registered a previous version still ping /sw.js. This file
// activates once, clears caches, unregisters itself, and reloads open tabs
// so visitors fall back to the network without a stale install lingering.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        if (self.caches) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
        await self.registration.unregister();
        const clients = await self.clients.matchAll({ type: "window" });
        clients.forEach((client) => client.navigate(client.url));
      } catch {}
    })()
  );
});
