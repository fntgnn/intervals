
self.addEventListener('install', function(event){
  console.log("sw installing service worker...", event);
});

self.addEventListener('activate', function(event){
//  console.log("sw activate service worker...", event);
  return self.clients.claim();
})

self.addEventListener('fetch', function(event){
});
