import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDGC-Cm6s_PLfgIPMggDcq42Kpjn9N3R0k",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "devj-portfolio-c8cf0.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "devj-portfolio-c8cf0",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "devj-portfolio-c8cf0.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "150801261199",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:150801261199:web:7d583900249252f95fc6fa"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
