var initialize = function (self) {
    var CACHE_NAME = 'Prototyp3';
    var urlsToCache = [];
    self.addEventListener('install', function (event) {
        // Perform install steps
        event.waitUntil(caches.open(CACHE_NAME)
            .then(function (cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        }));
    });
    ///////////////
    self.addEventListener('activate', function (event) {
        var cacheWhitelist = [];
        event.waitUntil(caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (cacheName) {
                if (cacheWhitelist.indexOf(cacheName) === -1) {
                    return caches["delete"](cacheName);
                }
            }));
        }));
        self.clients.claim();
    });
};
initialize(self);
