// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-vedant.firebaseapp.com",
  projectId: "blog-vedant",
  storageBucket: "blog-vedant.appspot.com",
  messagingSenderId: "195429389121",
  appId: "1:195429389121:web:c3c62b098fe3e3134a07c0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
