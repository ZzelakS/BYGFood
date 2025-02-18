importScripts("/firebase-app-compat.js");
importScripts("/firebase-messaging-compat.js");

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAVdC2qdWr31yk1ThZVeHfu8xbDbeXXap0",
    authDomain: "byg-food.firebaseapp.com",
    projectId: "byg-food",
    storageBucket: "byg-food.firebasestorage.app",
    messagingSenderId: "36576160700",
    appId: "1:36576160700:web:ab29952a9b26fa3becd9b9",
};


firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Optional: Add background message handler
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});