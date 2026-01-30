import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app, analytics, db, storage, auth;

if (!firebaseConfig.apiKey) {
    console.error("Firebase Configuration is missing! Please check your .env file.");
    // Alert only in browser environment
    if (typeof window !== "undefined") {
        alert("CRITICAL ERROR: Firebase configuration is missing. Please create a .env file with your Firebase credentials. The app will not function correctly.");
    }
    // Mock objects to prevent crash
    app = {};
    analytics = {};
    db = {};
    storage = {};
    auth = {};
} else {
    try {
        app = initializeApp(firebaseConfig);
        analytics = getAnalytics(app);
        db = getFirestore(app);
        storage = getStorage(app);
        auth = getAuth(app);
    } catch (error) {
        console.error("Firebase Initialization Error:", error);
        if (typeof window !== "undefined") alert("Firebase Initialization Error: " + error.message);
    }
}
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, db, storage, auth };
export { app, analytics, auth, db, storage };
