import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeoB0EaLt2WMYAhryZa7IXnTO-WAAPPvs",
  authDomain: "hopebridge-humanitarian-trust.firebaseapp.com",
  projectId: "hopebridge-humanitarian-trust",
  storageBucket: "hopebridge-humanitarian-trust.firebasestorage.app",
  messagingSenderId: "206811315953",
  appId: "1:206811315953:web:b0f1930c38281f07833350",
  measurementId: "G-60ST0EDNJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication & Providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Cloud Firestore
export const db = getFirestore(app);

export default app;
