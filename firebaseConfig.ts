// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import getFirestore
// import { getAnalytics } from "firebase/analytics"; //Commented out as it's not needed for now.
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCL65TQ4RbJBkbjrFdpJGakNDVLrbUIKf8",
  authDomain: "gastro-app-v2-69c2a.firebaseapp.com",
  projectId: "gastro-app-v2-69c2a",
  storageBucket: "gastro-app-v2-69c2a.firebasestorage.app",
  messagingSenderId: "1080951811547",
  appId: "1:1080951811547:web:afa86c2dd8913c06788bfe",
  measurementId: "G-DRQQN9VXGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); //Commented out as it's not needed for now.
export const db = getFirestore(app);  // Export the Firestore instance
