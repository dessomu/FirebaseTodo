import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLqve9Rzw_DAWtNRIpjuH2zjrZTlfDdCE",
  authDomain: "authsignlog.firebaseapp.com",
  projectId: "authsignlog",
  storageBucket: "authsignlog.firebasestorage.app",
  messagingSenderId: "243682628581",
  appId: "1:243682628581:web:dc06818cd62df0cd4f150c",
  measurementId: "G-X3N6G24LWM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication
export const auth = getAuth(app);
// Initialize Firestore
export const db = getFirestore(app);
