importScripts("https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyBzr94Ul6h9f2uutHea6wznjXaHD-DEgiw",
    authDomain: "viio-firebase.firebaseapp.com",
    projectId: "viio-firebase",
    storageBucket: "viio-firebase.appspot.com",
    messagingSenderId: "527065389660",
    appId: "1:527065389660:web:8409161f1c5af1d69ea499",
    measurementId: "G-VGHNVNEFXB"
};

const app = firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging(app);

messaging.onBackgroundMessage(payload => {
    console.log("Background message", payload);
    self.registration.showNotification(payload.notification.title, { body: payload.notification.body });
})
