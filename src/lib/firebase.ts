// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);


export { db, auth };
