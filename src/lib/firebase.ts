// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "passion-path-1fnxm",
  "appId": "1:1053725110091:web:655cf02581987e5c8942ce",
  "storageBucket": "passion-path-1fnxm.firebasestorage.app",
  "apiKey": "AIzaSyCoTn0BOOeWB2U9fhlEHalluUw-EOjZafc",
  "authDomain": "passion-path-1fnxm.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1053725110091"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
