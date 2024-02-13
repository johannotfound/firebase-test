
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { authVerification } from "./middlewares/firebase";

import * as admin from "firebase-admin";
import { DocumentChange, QueryDocumentSnapshot, QuerySnapshot } from "firebase-admin/firestore";

import config from "./config.json";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { RoleTypes } from "./globalTypes";
const serviceAccount = config as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app: Express = express();
app.use(cors())
app.use(express.json());

app.post("/login", async (req: Request, res: Response) => {
  // ! VALIDA CREDENCIALES
  const { uid } = req.body;
  // ! CREA CUSTOM TOKEN
  let voucher: string = await admin.auth().createCustomToken(uid, { role: RoleTypes.USER });
  // ! REGISTRO EN FIREBASE
  await admin.firestore().collection("session").doc(uid).set({ role: RoleTypes.USER, timestamp: Date.now() }, { merge: true });
  // ! REGRESA TOKEN A FRONTEND
  res.json({ status: "success", voucher })
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
