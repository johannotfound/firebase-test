
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { authVerification } from "./middlewares/firebase";

import * as admin from "firebase-admin";
import { DocumentChange, QueryDocumentSnapshot, QuerySnapshot } from "firebase-admin/firestore";

import config from "./config.json";
const serviceAccount = config as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app: Express = express();
app.use(cors())
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("ok");
});

app.post("/custom-token", async (req: Request, res: Response) => {
  const { uid, userId } = req.body;
  try {
    admin.auth().revokeRefreshTokens(uid)
      .then(() => {
        return admin.auth().getUser(uid);
      })
      .then((userRecord: any) => {
        return new Date(userRecord.tokensValidAfterTime).getTime();
      })
      .then((timestamp: number) => {
        let difference = new Date().getTime() - timestamp
        setTimeout(async () => {
          let token = await admin.auth().createCustomToken(uid, { userId })
          res.json({ token })
        }, difference + 100)
        console.log(`Tokens revoked at: ${timestamp}`);
      });
  } catch (error) {
    res.send("Pailas")
  }
});

app.post("/user", async (req: Request, res: Response) => {
  const { uid, userId } = req.body;
  let user = await admin.auth().getUser(uid);
  console.log("user", user)
  res.json({ status: "success", user });
});

app.get("/delete", async (req: Request, res: Response) => {
  await admin.auth().revokeRefreshTokens("sally-gatita");
  res.json({ status: "success" })
});

app.post("/login", async (req: Request, res: Response) => {
  // ! VALIDA CREDENCIALES
  const { uid, userId } = req.body;
  // ! CREA CUSTOM TOKEN
  let token: string = await admin.auth().createCustomToken(uid, { userId });
  // ! REGISTRO DE TOKEN EN FIREBASE
  await admin.firestore().collection("session").doc("sally-gatita").set({ token }, { merge: true });
  // ! REGRESA TOKEN A FRONTEND
  res.json({ status: "success", token })
});

app.get("/check", [authVerification], (req: Request, res: Response) => {
  res.json({ status: "success" })
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
