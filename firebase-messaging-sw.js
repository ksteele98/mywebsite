importScripts(
  'https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js'
);

// --- Firebase project config (same values you use in index.html) ---
firebase.initializeApp({
  apiKey:            "AIzaSyCmtc69JDgCWtxPNgPU73Y4n7-asl6M72w",
  authDomain:        "my-website-5dfa1.firebaseapp.com",
  projectId:         "my-website-5dfa1",
  storageBucket:     "my-website-5dfa1.appspot.com",
  messagingSenderId: "36790147861",
  appId:             "1:36790147861:web:6391e58fe3193c4fabe71c"
});

// Get messaging instance that works inside a SW
const messaging = firebase.messaging();

// ------------------------------------------------------------------
// Background-message handler.
// This fires when the page is closed or in the background.
// ------------------------------------------------------------------
messaging.onBackgroundMessage(({ notification }) => {
  // Silent data message?  Nothing to display.
  if (!notification) return;

  self.registration.showNotification(
    notification.title ?? 'Notification',
    {
      body: notification.body ?? '',
      icon: '/icon-192.png'   // Path to one of your icons (optional)
    }
  );
});
