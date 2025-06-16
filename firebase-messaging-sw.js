importScripts('https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCmtc69JDgCWtxPNgPU73Y4n7-asl6M72w",
  authDomain: "my-website-5dfa1.firebaseapp.com",
  projectId: "my-website-5dfa1",
  storageBucket: "my-website-5dfa1.appspot.com",
  messagingSenderId: "36790147861",
  appId: "1:36790147861:web:6391e58fe3193c4fabe71c",
  measurementId: "G-SSJEV8WQFT"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/mywebsite/icon-192x192.png' // Optional
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
