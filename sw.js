/* SunNile Service Worker — Offline-first caching
 * Strategy: Cache-first for static assets, Network-first for pages
 * Falls back to offline page when network unavailable
 */

var CACHE_VERSION = 'sunnile-v1';

var SHELL = [
  '/',
  '/index.html',
  '/calculator.html',
  '/inverters.html',
  '/standards.html',
  '/future.html',
  '/policy.html',
  '/institute.html',
  '/about.html',
  '/installers.html',
  '/installer-auth.html',
  '/installer-dashboard.html',
  '/i18n.js',
  '/manifest.json',
  '/lessons/unit-01-electrical-safety.html',
  '/lessons/unit-02-solar-panels.html',
  '/lessons/unit-03-inverter.html',
  '/lessons/unit-04-system-sizing.html',
  '/lessons/unit-05-batteries.html',
  '/lessons/unit-06-cables.html',
  '/lessons/unit-07-installation.html',
  '/lessons/unit-08-testing.html',
  '/lessons/unit-09-advanced-design.html',
  '/lessons/unit-10-hybrid-grid.html',
  '/lessons/unit-11-maintenance.html',
  '/lessons/unit-12-advanced-inverters.html',
  '/lessons/unit-13-grid-integration.html',
  '/lessons/unit-14-electrical-diagrams.html',
  '/lessons/unit-15-commercial-systems.html',
  '/lessons/unit-16-documentation.html',
  '/lessons/unit-17-derms.html',
  '/lessons/unit-18-vpp.html',
  '/lessons/unit-19-sunspec-modbus.html',
  '/lessons/unit-20-performance-monitoring.html',
  '/lessons/unit-21-community-systems.html',
  '/lessons/unit-22-certification.html',
  '/lessons/unit-23-project-management.html',
  '/lessons/unit-24-leadership.html'
];

/* ── INSTALL: cache app shell ── */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

/* ── ACTIVATE: remove old caches ── */
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_VERSION; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* ── FETCH: network-first for HTML, cache-first for assets ── */
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);

  /* Only handle same-origin requests */
  if (url.origin !== location.origin) return;

  /* Google Fonts — cache-first, long TTL */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.match(e.request).then(function (cached) {
        return cached || fetch(e.request).then(function (res) {
          var clone = res.clone();
          caches.open(CACHE_VERSION).then(function (c) { c.put(e.request, clone); });
          return res;
        });
      })
    );
    return;
  }

  var isHTML = e.request.headers.get('accept') &&
               e.request.headers.get('accept').indexOf('text/html') !== -1;

  if (isHTML) {
    /* Network-first for HTML: fresh content when online, fallback to cache */
    e.respondWith(
      fetch(e.request).then(function (res) {
        var clone = res.clone();
        caches.open(CACHE_VERSION).then(function (c) { c.put(e.request, clone); });
        return res;
      }).catch(function () {
        return caches.match(e.request).then(function (cached) {
          return cached || caches.match('/index.html');
        });
      })
    );
  } else {
    /* Cache-first for JS/CSS/images */
    e.respondWith(
      caches.match(e.request).then(function (cached) {
        return cached || fetch(e.request).then(function (res) {
          var clone = res.clone();
          caches.open(CACHE_VERSION).then(function (c) { c.put(e.request, clone); });
          return res;
        });
      })
    );
  }
});
