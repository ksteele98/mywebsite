// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyCmtc69JDgCWtxPNgPU73Y4n7-asl6M72w",
  authDomain: "my-website-5dfa1.firebaseapp.com",
  projectId: "my-website-5dfa1",
  messagingSenderId: "36790147861",
  appId: "1:36790147861:web:6391e58fe3193c4fabe71c"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png' // optional
  });
});
