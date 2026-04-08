// src/integrations/firebase/client.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4QVPHgq4zreIGbA_Du4sQQeQlZfg-imw",
  authDomain: "candidates247-be838.firebaseapp.com",
  projectId: "candidates247-be838",
  messagingSenderId: "1036294583613",
  appId: "1:1036294583613:web:c3ce8f9f4bbdfa2abe8154",
  measurementId: "G-LTSS50ED2Z"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);