// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const FirebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: "rentx-c22fa.firebaseapp.com",
  projectId: "rentx-c22fa",
  storageBucket: "rentx-c22fa.firebasestorage.app",
  messagingSenderId: "790426877168",
  appId: "1:790426877168:web:015f249d1999a69bf29635",
  measurementId: "G-W3JKGSXEPX",
};

// Initialize Firebase
export const app = initializeApp(FirebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
