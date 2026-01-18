import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWyLXZ4_H2bABRfYVxi8X5mBm2soBer6U",
  authDomain: "ccplus-3de90.firebaseapp.com",
  projectId: "ccplus-3de90",
  storageBucket: "ccplus-3de90.firebasestorage.app",
  messagingSenderId: "745640994995",
  appId: "1:745640994995:web:397bfb7690eb8d4183e8c6",
  measurementId: "G-JQZQ5GM05N",
};

// Initialize Firebase (singleton pattern)
function initFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore } {
  const app =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const auth = getAuth(app);
  const db = getFirestore(app);
  return { app, auth, db };
}

// Initialize on import
const { app, auth, db } = initFirebase();

export { app, auth, db, firebaseConfig };
