// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Allows connection to the database
import { getFirestore } from "firebase/firestore";

// For Authentication storage
import { getAuth } from "firebase/auth";

// For Storage
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7OU1y1VtWESDRGFPFMvfkWCiAMueq1qk",
  authDomain: "blog-cohort27-3d097.firebaseapp.com",
  projectId: "blog-cohort27-3d097",
  storageBucket: "blog-cohort27-3d097.appspot.com",
  messagingSenderId: "665293014336",
  appId: "1:665293014336:web:64f1700df4dfa8b0c3e6a5",
  measurementId: "G-03DT7B2GQR"
};

// Initialize Firebase
// This should be exported before all others
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Set up database and export it
export const db = getFirestore(app);

// Set up auth and export it
export const auth = getAuth(app);

// Set up storage and export it
export const storage = getStorage(app);