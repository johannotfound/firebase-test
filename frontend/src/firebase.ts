import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { Messaging, getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBzr94Ul6h9f2uutHea6wznjXaHD-DEgiw",
    authDomain: "viio-firebase.firebaseapp.com",
    projectId: "viio-firebase",
    storageBucket: "viio-firebase.appspot.com",
    messagingSenderId: "527065389660",
    appId: "1:527065389660:web:8409161f1c5af1d69ea499",
    measurementId: "G-VGHNVNEFXB"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const messaging: Messaging = getMessaging(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

export default app;