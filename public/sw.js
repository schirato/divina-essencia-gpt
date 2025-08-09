const CACHE = "divina-v2"; // Incrementar versão para forçar atualização
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest"];

// Recursos que não devem ser cacheados agressivamente
const NO_CACHE_PATTERNS = [/\/data\/content\.json$/, /\/api\//, /\?timestamp=/];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)));
  // Força ativação imediata do novo service worker
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((k) => k !== CACHE && caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Não cachear recursos específicos
  const shouldNotCache = NO_CACHE_PATTERNS.some((pattern) =>
    pattern.test(url.pathname)
  );

  if (shouldNotCache) {
    // Sempre buscar da rede para recursos dinâmicos
    e.respondWith(fetch(e.request).catch(() => caches.match("/index.html")));
    return;
  }

  // Cache normal para outros recursos
  e.respondWith(
    caches.match(e.request).then(
      (r) =>
        r ||
        fetch(e.request)
          .then((resp) => {
            // Só cachear se a resposta for ok
            if (resp.status === 200) {
              const copy = resp.clone();
              caches.open(CACHE).then((c) => c.put(e.request, copy));
            }
            return resp;
          })
          .catch(() => caches.match("/index.html"))
    )
  );
});
