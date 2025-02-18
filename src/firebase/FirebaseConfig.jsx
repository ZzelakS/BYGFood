// Import the functions you need from the SDKs you need
import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {getAuth} from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVdC2qdWr31yk1ThZVeHfu8xbDbeXXap0",
  authDomain: "byg-food.firebaseapp.com",
  projectId: "byg-food",
  storageBucket: "byg-food.firebasestorage.app",
  messagingSenderId: "36576160700",
  appId: "1:36576160700:web:ab29952a9b26fa3becd9b9",
  measurementId: "G-V0BQ102W7P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const analytics = getAnalytics(app);

const fireDB = getFirestore(app);
const auth = getAuth(app);

// Assuming you have a Firebase app initialized and a user is authenticated

// const db = firebase.firestore();
// const newOrder = {
//   orderId: generateUUID(), // Function to generate a UUID
//   customerUid: getFirestore.auth().currentUser.uid,
//   orderDate: getFirestore.firestore.FieldValue.serverTimestamp(), //Use server time for accuracy
//   // ... other order details ...
// };

// fireDB.collection('orders').add(newOrder)
//   .then(docRef => {
//     console.log("Order added with ID: ", docRef.id);
//   })
//   .catch(error => {
//     console.error("Error adding order: ", error);
//   });


const useNotifications = () => {
  useEffect(() => {

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js",{
          scope: "/",
        });
        console.log("Service Worker registered:", registration);
        return registration;
      } catch (error) {
        console.error("Error registering service worker:", error);
        return null;
      }
    };
    
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");
  
           // Register the service worker
      const registration = await registerServiceWorker();
      if (!registration) {
        throw new Error("Service Worker registration failed");
      }
          const token = await getToken(messaging, { vapidKey: "BIb3q1G6eff68E4Whi61EFOWH18f8A6U0tdaKiqf2X4c55ra6jphqLVeaIMPF_X0ksAsmNzByGuBxB8nzhL9_NM", serviceWorkerRegistration: registration,});
          console.log("FCM Token:", token);
          // Save this token to your database or send it to your backend
        } else {
          console.log("Permission denied");
        }
      } catch (error) {
        console.error("Error getting token:", error);
      }
    };

    requestNotificationPermission();

    const saveTokenToFirestore = async (userId, token) => {
      if (!userId) {
        console.error("Error: userId is undefined!");
        return;
      }
    
      try {
        await setDoc(doc(fireDB, "users", userId), { fcmToken: token }, { merge: true });
        console.log("Token saved successfully");
      } catch (error) {
        console.error("Error saving token:", error);
      }
    };
    
    

    // Handle incoming messages while the app is in the foreground
    onMessage(messaging, (payload) => {
      console.log("Message received:", payload);
      const { title, body } = payload.notification;
      alert(`${title}\n${body}`);
    });
  }, []);
};

export default useNotifications;

export {fireDB, auth}