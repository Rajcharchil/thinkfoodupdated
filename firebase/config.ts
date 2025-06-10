import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration from the google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyCmWN11bKhb_gPg6-WLONATeK2XgCJZ1DI",
  authDomain: "mini-food-odering.firebaseapp.com",
  projectId: "mini-food-odering",
  storageBucket: "mini-food-odering.firebasestorage.app",
  messagingSenderId: "107771029649",
  appId: "1:107771029649:android:24e39873dfd383831df730"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;