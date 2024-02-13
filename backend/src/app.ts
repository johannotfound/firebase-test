
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { authVerification } from "./middlewares/firebase";

import * as admin from "firebase-admin";
import { FirebaseApp, initializeApp } from "firebase/app";
// const client = require("firebase")
// import { signInWithCustomToken  } from "firebase";



import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { DocumentChange, QueryDocumentSnapshot, QuerySnapshot } from "firebase-admin/firestore";

import config from "./config.json";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { RoleTypes } from "./globalTypes";
const serviceAccount = config as admin.ServiceAccount;

const firebaseConfig = {
  apiKey: "AIzaSyBzr94Ul6h9f2uutHea6wznjXaHD-DEgiw",
  authDomain: "viio-firebase.firebaseapp.com",
  projectId: "viio-firebase",
  storageBucket: "viio-firebase.appspot.com",
  messagingSenderId: "527065389660",
  appId: "1:527065389660:web:8409161f1c5af1d69ea499",
  measurementId: "G-VGHNVNEFXB"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const client = initializeApp(firebaseConfig);
export const auth = getAuth(client);

const app: Express = express();
app.use(cors())
app.use(express.json());

app.post("/login", async (req: Request, res: Response) => {
  // ! VALIDA CREDENCIALES
  const { uid } = req.body;
  // ! CREA CUSTOM TOKEN
  let voucher: string = await admin.auth().createCustomToken(uid, { role: RoleTypes.USER });
  let token = await signInWithCustomToken(auth, voucher)
  console.log(token)
  // ! REGISTRO EN FIREBASE
  await admin.firestore().collection("session").doc(uid).set({ role: RoleTypes.USER, timestamp: Date.now() }, { merge: true });
  // ! REGRESA TOKEN A FRONTEND
  res.json({ status: "success", voucher, token })
});

app.get("/check", async (req: Request, res: Response) => {
  let { authtoken } = req.headers;
  let { role } = await admin.auth().verifyIdToken(authtoken as string, true);

  res.json({ status: "success", role })
});

app.get("/sessions", async (req: Request, res: Response) => {
  let sessions = await admin.firestore().collection("session").get()
  res.json({ status: "success", sessions })
});

admin.firestore().collection('status')
  .where('state', '==', 'online')
  .onSnapshot((snapshot: QuerySnapshot) => {
    snapshot.docChanges().forEach((change: DocumentChange) => {
      if (change.type === 'added')
        console.log('User ' + change.doc.id + ' is online.');
      if (change.type === 'removed')
        console.log('User ' + change.doc.id + ' is offline.');
    });
  })

app.listen(3000, () => {
  console.log(`[server] Server is running`);
});
