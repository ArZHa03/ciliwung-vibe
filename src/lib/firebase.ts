import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

// Graceful fallback for demonstration purposes if Firebase is not configured
const mockConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo.appspot.com",
  messagingSenderId: "000",
  appId: "1:000:web:000"
};

let app;
let db: any = null;

try {
  // Normally would load from firebase-applet-config.json
  app = initializeApp(mockConfig);
  db = getFirestore(app);
} catch (error) {
  console.warn("Using mock Database due to Firebase init error.");
}

export { db };
