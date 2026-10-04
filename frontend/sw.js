/**
 * Universal PWA - Service Worker
 */

// 🎯 १. जेव्हा जेव्हा कोड किंवा कंटेंट बदलाल, तेव्हा व्हर्जन बदला (v1 -> v2)
const CACHE_NAME = 'universal-pwa-cache-v00001';

// Paths relative to SW location
const ASSETS_TO_CACHE = [
    './index.html',
    './app.js',
    '../assets/icons/icon-192x192.png',
    '../assets/icons/icon-512x512.png'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
    console.log('SW: Installing and caching core assets...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(
                ASSETS_TO_CACHE.map(url => {
                    return cache.add(url).catch(err => 
                        console.warn('SW Cache Warning: Failed to cache', url, err)
                    );
                })
            );
        }).then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('SW: Activating and clearing old cache...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('SW: Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - Network-First for HTML, Cache-First for static assets
self.addEventListener('fetch', (event) => {
    if (!event.request.url.startsWith(self.location.origin) || event.request.method !== 'GET') {
        return;
    }

    const isHTMLRequest = event.request.mode === 'navigate' || event.request.url.endsWith('index.html');

    // 🎯 २. HTML/होमपेजसाठी आधी नेटवर्कवरून नवीन फाईल आणणार (Network-First)
    if (isHTMLRequest) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // इंटरनेट नसल्यास कॅशमधील फाईल दाखवेल
                    return caches.match('./index.html');
                })
        );
    } else {
        // इमेज, सीएसएस, जेएस साठी आधी कॅश तपासणार (Cache-First)
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                });
            })
        );
    }
});