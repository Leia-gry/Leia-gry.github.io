// Cat Condo Leia – pamięć podręczna (Etap 43). Grafiki z ?v= z pamięci telefonu (szybki start), strona zawsze świeża z sieci, bez sieci – ostatnia wersja.
var C = 'cc-leia-1';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var rq = e.request, u = new URL(rq.url);
  if (rq.method !== 'GET' || u.origin !== self.location.origin) return;
  if (/[?&]v=/.test(u.search)) {
    e.respondWith(caches.open(C).then(function (c) {
      return c.match(rq).then(function (hit) {
        return hit || fetch(rq).then(function (r) {
          if (r.ok) { var cp = r.clone(); c.put(rq, cp).then(function () { return c.keys(); }).then(function (ks) { ks.forEach(function (k) { var ku = new URL(k.url); if (ku.pathname === u.pathname && ku.search !== u.search) c.delete(k); }); }).catch(function () { }); }
          return r;
        });
      });
    }));
    return;
  }
  if (rq.mode === 'navigate') {
    e.respondWith(fetch(rq).then(function (r) { if (r.ok) { var cp = r.clone(); caches.open(C).then(function (c) { c.put(u.pathname, cp); }); } return r; })
      .catch(function () { return caches.open(C).then(function (c) { return c.match(u.pathname); }).then(function (r) { return r || Response.error(); }); }));
  }
});
