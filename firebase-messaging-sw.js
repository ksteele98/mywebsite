// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js');

// Initialize Firebase inside the Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyCmtc69JDgCWtxPNgPU73Y4n7-asl6M72w",
  authDomain: "my-website-5dfa1.firebaseapp.com",
  projectId: "my-website-5dfa1",
  storageBucket: "my-website-5dfa1.appspot.com",
  messagingSenderId: "36790147861",
  appId: "1:36790147861:web:6391e58fe3193c4fabe71c"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(({ data }) => {
  const title = data?.title ?? 'Notification';
  const body  = data?.body  ?? '';
  self.registration.showNotification(title, { body });
});
