// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.REACT_FIREBASE_API,
  authDomain: "loan-repayment-predic.firebaseapp.com",
  projectId: "loan-repayment-predic",
  storageBucket: "loan-repayment-predic.firebasestorage.app",
  messagingSenderId: "875577409390",
  appId: "1:875577409390:web:ee2e027483a29eb1c50b7f",
  measurementId: "G-YC970Q1NXV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);