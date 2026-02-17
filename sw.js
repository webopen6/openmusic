// sw.js - Service Worker（请保存为 UTF-8，无 BOM）
// 将来自通知操作的action转发到页面客户端（例如：play/pause/next/prev）
self.addEventListener('install', (event) => {
  console.log('Service Worker 正在安装');
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage({ type: 'sw-log', message: '安装成功' }));
  });
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker 已激活');
  event.waitUntil(self.clients.claim());
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage({ type: 'sw-log', message: '激活成功' }));
  });
});

self.addEventListener('notificationclick', function(event) {
  const action = event.action;
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      if (clientList && clientList.length > 0) {
        // 将 notification action 发给第一个可用客户端页面
        clientList[0].postMessage({ type: 'notification-action', action: action || 'main' });
        clientList[0].focus();
      } else {
        // 没有打开的客户端，尝试打开页面（相对路径或根路径，按需调整）
        return self.clients.openWindow('./');
      }
    })
  );
});

self.addEventListener('notificationclose', function(event) {
  // 可选：处理通知被关闭的逻辑
});