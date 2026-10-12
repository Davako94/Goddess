self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(e){
  var d = {title:'GODDESS', body:'Hai una nuova notifica'};
  try{ if(e.data){ d = Object.assign(d, e.data.json()); } }catch(x){}
  e.waitUntil(self.registration.showNotification(d.title, {
    body: d.body,
    data: {url: d.url || './', ordine: d.ordine || null}
  }));
});

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var data = e.notification.data || {};
  var target = new URL(data.url || './', self.registration.scope).href;
  e.waitUntil(
    self.clients.matchAll({type:'window', includeUncontrolled:true}).then(function(list){
      for(var i = 0; i < list.length; i++){
        if('focus' in list[i]){
          try{ list[i].postMessage({type:'open', ordine:data.ordine}); }catch(x){}
          return list[i].focus();
        }
      }
      if(self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
