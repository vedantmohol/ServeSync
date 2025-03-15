// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "servesync-508c1.firebaseapp.com",
  projectId: "servesync-508c1",
  storageBucket: "servesync-508c1.firebasestorage.app",
  messagingSenderId: "863344842651",
  appId: "1:863344842651:web:371ac0b41c68c974c8333e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);