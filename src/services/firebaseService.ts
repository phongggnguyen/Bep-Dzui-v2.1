// services/firebaseService.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Cấu hình Firebase từ biến môi trường
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo và export các dịch vụ Firebase dùng trong ứng dụng
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google provider cho đăng nhập OAuth
export const googleProvider = new GoogleAuthProvider();
