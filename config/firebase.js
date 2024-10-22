// Import necessary functions from Firebase SDK
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore, collection} from 'firebase/firestore';

// Firebase configuration object containing the necessary details
const firebaseConfig = {
  apiKey: 'AIzaSyBImHx7-hMM7dAfdmS2JgM39fcKBIfVVaA', // API key for your Firebase project
  authDomain: 'expensify-7480c.firebaseapp.com', // Auth domain for authentication
  projectId: 'expensify-7480c', // Project ID for Firestore and other services
  storageBucket: 'expensify-7480c.appspot.com', // Storage bucket for file storage
  messagingSenderId: '713681478913', // Messaging sender ID (for Firebase Cloud Messaging)
  appId: '1:713681478913:web:dca16830ec35bdb35fe700', // App ID for identifying your Firebase app
};

// Initialize Firebase app with the given configuration
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication services
export const db = getFirestore(app); // Firestore database instance
export const auth = getAuth(app); // Firebase authentication instance

// Define references to specific collections in Firestore
export const tripsRef = collection(db, 'trips'); // Reference to the 'trips' collection
export const expensesRef = collection(db, 'expenses'); // Reference to the 'expenses' collection

// Export the initialized Firebase app instance
export default app;
