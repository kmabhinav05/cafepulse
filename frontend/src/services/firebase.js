import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBtOlp7DVhDV64TVldFqQB_CRSvS85-oMk",
  authDomain: "cafepulse-6c563.firebaseapp.com",
  projectId: "cafepulse-6c563",
  storageBucket: "cafepulse-6c563.firebasestorage.app",
  messagingSenderId: "494522707274",
  appId: "1:494522707274:web:7362f3c4bebb051bbbe5b3",
  measurementId: "G-JKJ2H4HPHH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
