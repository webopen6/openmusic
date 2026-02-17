
``javascript name=sw.js
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', function(event) {
  const action = event.action;
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      if (clientList && clientList.length > 0) {
        // ���׸�ҳ��ͻ��˷�����Ϣ��ҳ����պ�������ͣ/���ţ�
        clientList[0].postMessage({ type: 'notification-action', action: action || 'main' });
        clientList[0].focus();
      } else {
        return clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('notificationclose', function(event) {
});