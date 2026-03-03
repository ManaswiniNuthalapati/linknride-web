// web/firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import {
  getFirestore,
  setLogLevel // ✅ to control Firestore logging
} from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ storage import

// ✅ Correct Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxniKL0VsNhhxUsgqgA3_17f4URTlC8TQ",
  authDomain: "linknride-app.firebaseapp.com",
  projectId: "linknride-app",
  storageBucket: "linknride-app.appspot.com", // ✅ must end with .appspot.com
  messagingSenderId: "1085092506795",
  appId: "1:1085092506795:web:2131da0625f4b5a22c1bee",
};

// ✅ Initialize Firebase once
const app = initializeApp(firebaseConfig);

// ✅ Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Optional but highly recommended:
// This line silences repetitive "WebChannelConnection RPC 'Listen'" logs
setLogLevel("error");

// ✅ Export everything needed
export { auth, RecaptchaVerifier, signInWithPhoneNumber, db, storage };
