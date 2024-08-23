import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth"; // Uncomment if using Firebase Authentication
 import { getFirestore } from "firebase/firestore"; // Uncomment if using Firestore


const firebaseConfig = {
  apiKey: "AIzaSyDxZ6klqW7G8kjKG4yNYNy0WeEDQgKLuH0",
  authDomain: "flascard-saas.firebaseapp.com",
  projectId: "flascard-saas",
  storageBucket: "flascard-saas.appspot.com",
  messagingSenderId: "123450728329",
  appId: "1:123450728329:web:aa2c2c8ffc6ef5c7568b58",
  measurementId: "G-KHSF4V3R2X"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only if window is defined, for SSR compatibility)
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Initialize other Firebase services as needed
//const auth = getAuth(app); // Uncomment if using Firebase Authentication
 const db = getFirestore(app); // Uncomment if using Firestore

// Export the initialized services
export { app, analytics, db };