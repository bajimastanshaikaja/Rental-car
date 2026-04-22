// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const FirebaseConfig = {
    apiKey: "AIzaSyCJ4K0kTIZ-9XBoSDKTHeyhruPINMeCCc8",
    authDomain: "rentx-c22fa.firebaseapp.com",
    projectId: "rentx-c22fa",
    storageBucket: "rentx-c22fa.firebasestorage.app",
    messagingSenderId: "790426877168",
    appId: "1:790426877168:web:015f249d1999a69bf29635",
    measurementId: "G-W3JKGSXEPX"
};
 
// Initialize Firebase
const app = initializeApp(FirebaseConfig);
export const db=getFirestore(app);