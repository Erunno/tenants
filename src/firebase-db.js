// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBKKmM0oouxhbefwA2zZBLlZG9MU4cVjqA",
    authDomain: "tenats-testing.firebaseapp.com",
    projectId: "tenats-testing",
    storageBucket: "tenats-testing.appspot.com",
    messagingSenderId: "1089474060088",
    appId: "1:1089474060088:web:f575561ffb3b48d92a6bcd",
    measurementId: "G-EM9X5TYN26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);