// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";


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
const analytics = getAnalytics(app);

const fireDB = getFirestore(app);
const auth = getAuth(app);

export {fireDB, auth}