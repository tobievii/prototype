var cacheName = 'Prototype-3';
var filesToCache = [
    '/',
    '/index.js',
    '/App.jsx',
    '/favicon.png'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('push', function (e) {
    console.log(e.data)
    var options = {
        body: 'This notification was generated from a push!',
        icon: '/favicon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        actions: [
            {
                action: 'explore', title: 'Explore this new world',
                icon: '/favicon.png'
            },
            {
                action: 'close', title: 'Close',
                icon: '/favicon.png'
            },
        ]
    };
    e.waitUntil(
        self.registration.showNotification('Hello world!', options)
    );
});