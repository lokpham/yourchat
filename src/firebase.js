import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC14M35sCCMuV9llecRL_uM2G9z2HuB3AE",
  authDomain: "chat-app-abb23.firebaseapp.com",
  projectId: "chat-app-abb23",
  storageBucket: "chat-app-abb23.appspot.com",
  messagingSenderId: "956425406706",
  appId: "1:956425406706:web:a18ad0349bed7c07a6a86b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();

// Create a root reference
export const storage = getStorage();

export const db = getFirestore(app);