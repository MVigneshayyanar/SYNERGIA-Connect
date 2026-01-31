import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

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
    if (typeof window !== "undefined") {
        // alert("CRITICAL ERROR: Firebase configuration is missing. Please create a .env file with your Firebase credentials. The app will not function correctly.");
        console.warn("Running in MOCK mode due to missing Firebase keys.");
    }
    
    // Mock objects to prevent crash and allow UI to render
    const mockUnsubscribe = () => {};
    
    auth = {
        currentUser: null,
        onAuthStateChanged: (cb) => { cb(null); return mockUnsubscribe; },
        signInWithEmailAndPassword: async () => { throw new Error("Mock Mode: Cannot sign in without Firebase keys."); },
        createUserWithEmailAndPassword: async () => { throw new Error("Mock Mode: Cannot sign up without Firebase keys."); },
        signOut: async () => { return true; }
    };

    db = {
        type: 'mock'
    };

    // We must mock the firestore exports used in other files if we want them to not crash, 
    // but those are imported from 'firebase/firestore', not from here. 
    // However, the *instances* passed to them are these mocks.
    // The SDK functions (collection, getDocs) typically throw if passed an invalid instance.
    // So fully preventing crashes in services requires more checks, but fixing Auth is the big one.
    
    storage = {};
    analytics = {};
} else {
    try {
        app = initializeApp(firebaseConfig);
        analytics = getAnalytics(app);
        db = getFirestore(app);
        storage = getStorage(app);
        auth = getAuth(app);
    } catch (error) {
        console.error("Firebase Initialization Error:", error);
    }
}

export { app, analytics, db, storage, auth };
