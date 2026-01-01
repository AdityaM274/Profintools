import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { ENV } from '../config/env';

const firebaseConfig = {
    apiKey: ENV.FIREBASE.API_KEY,
    authDomain: ENV.FIREBASE.AUTH_DOMAIN,
    projectId: ENV.FIREBASE.PROJECT_ID,
};

// Initialize Firebase
let app;
let auth: any;

if (firebaseConfig.apiKey) {
    try {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        auth = getAuth(app);
    } catch (error) {
        console.error("Firebase initialization failed:", error);
    }
} else {
    console.warn("Firebase API key missing. Auth features will be disabled.");
}

export { auth };
