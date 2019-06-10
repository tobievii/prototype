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
    //console.log(e)

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
            if (response.message == undefined || response.message == null) {
                if (response.type == "NEW DEVICE ADDED" || response.type == "New dewvice added") {
                    message = "has been successfuly added to PROTOTYP3.";
                } else if (response.type == "CONNECTION DOWN 24HR WARNING") {
                    message = "hasn't sent data in the last 24hours";
                }
            } else {
                message = response.message;
            }

            options.body = '"' + response.device + '" ' + message;

            self.registration.showNotification(response.type, options)
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