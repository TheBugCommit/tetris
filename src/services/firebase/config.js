import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCoyINXNLfUw_Pw3nMaq02nXJP44mtkCxQ",
  authDomain: "game-6d5e9.firebaseapp.com",
  databaseURL: "https://game-6d5e9.firebaseio.com",
  projectId: "game-6d5e9",
  storageBucket: "game-6d5e9.firebasestorage.app",
  messagingSenderId: "857074869808",
  appId: "1:857074869808:web:508a75fe2f1adb512a2ff5"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);