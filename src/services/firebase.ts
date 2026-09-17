/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 【服務層】Firebase 核心配置與雲端服務實例單例 (Firebase Core Client Singleton)
 * ─────────────────────────────────────────────────────────────────────────────
 * 職責：
 * 1. 讀取環境變數 (VITE_FIREBASE_*) 並初始化 Firebase App。
 * 2. 封裝導出 Authentication、Firestore Database 與 Cloud Storage 實例。
 * 3. 具備防禦性配置驗證，避免因金鑰未提供導致頁面 Crash。
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBCSZG7qTua_22WFJHj5m4xIBf4zCrCFOg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "my-portfolio-website-f2e03.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "my-portfolio-website-f2e03",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "my-portfolio-website-f2e03.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "917634088516",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:917634088516:web:1d7f6731165a63eccc8611",
};

// 防禦性檢查：確認核心 Project ID 與 API Key 是否已設定
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'your_api_key_here'
);

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
    storageInstance = getStorage(appInstance);
  } catch (error) {
    console.error('[Firebase Init Error]: Failed to initialize Firebase services:', error);
  }
} else {
  console.warn('[Firebase Warning]: Firebase credentials not found or unconfigured. Running in static fallback mode.');
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;

export default app;
