/**
 * Firebase initialization (Auth + Firestore).
 *
 * Credentials are read from Vite environment variables so nothing sensitive
 * is committed. Copy `.env.example` to `.env` and fill it with the values
 * from your Firebase project settings before running the app.
 */

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/** Firebase web app configuration sourced from environment variables. */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Whether the required Firebase credentials are present. When false, the UI
 * shows a friendly setup hint instead of crashing at startup.
 * @type {boolean}
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

/** The Firebase application instance (null until configured). */
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

/** Firebase Authentication instance (null until configured). */
export const auth = app ? getAuth(app) : null;

/** Cloud Firestore instance (null until configured). */
export const db = app ? getFirestore(app) : null;

/** Shared Google auth provider used by the "Sign in with Google" button. */
export const googleProvider = new GoogleAuthProvider();
