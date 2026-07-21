import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId);

let app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

function getApp() {
  if (!isFirebaseConfigured) return null;
  if (!app) app = getApps()[0] ?? initializeApp(config);
  return app;
}

export function getFirebaseAuth() {
  if (!_auth) {
    const a = getApp();
    if (!a) return null;
    _auth = getAuth(a);
  }
  return _auth;
}

export function getDb() {
  if (!_db) {
    const a = getApp();
    if (!a) return null;
    _db = getFirestore(a);
  }
  return _db;
}

export function getFirebaseStorage() {
  if (!_storage) {
    const a = getApp();
    if (!a) return null;
    _storage = getStorage(a);
  }
  return _storage;
}
