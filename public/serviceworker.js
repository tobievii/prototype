var cacheName = 'Prototyp3';
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
        }).then(() => {
            return self.skipWaiting();
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

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});

self.addEventListener('push', function (e) {
    var message = " ";
    var options = {
        body: '',
        icon: '/favicon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        actions: [
            {
                action: 'explore', title: 'Open',
                icon: '/favicon.png'
            },
            {
                action: 'close', title: 'Close',
                icon: '/favicon.png'
            },
        ]
    };

    fetch('/api/v3/notifications/getNew', {
        method: 'GET', headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then((response) => {
            if (response.result) {
                for (var n in response.result) {
                    if (response.result[n].message == undefined || response.result[n].message == null) {
                        if (response.result[n].type == "NEW DEVICE ADDED" || response.result[n].type == "New dewvice added") {
                            message = "has been successfuly added to PROTOTYP3.";
                        } else if (response.result[n].type == "CONNECTION DOWN 24HR WARNING") {
                            message = "hasn't sent data in the last 24hours";
                        }
                    } else {
                        message = response.result[n].message;
                    }

                    options.data.dateOfArrival = response.result[n].created;
                    options.body = '"' + response.result[n].device + '" ' + message;

                    self.registration.showNotification(response.result[n].type, options)
                }
            }
        })
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    event.waitUntil(clients.matchAll({
        type: 'window'
    }).then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url === '/' && 'focus' in client) {
                return client.focus();
            }
        }
        if (clients.openWindow) {
            return clients.openWindow('/');
        }
    }));
});