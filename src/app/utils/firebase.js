// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "backpack-e9850.firebaseapp.com",
  projectId: "backpack-e9850",
  storageBucket: "backpack-e9850.appspot.com",
  messagingSenderId: "992517707640",
  appId: "1:992517707640:web:13c5ad6292a6f9cb49da8d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);