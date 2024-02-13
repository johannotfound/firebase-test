import { IonButton, IonContent, IonItemDivider, IonPage, } from '@ionic/react';
import './Home.css';

import { useState, useEffect } from 'react';

import { getAuth, Auth, onAuthStateChanged, IdTokenResult, onIdTokenChanged } from "firebase/auth";

import firebaseNotificationsService from '../services/FirebaseNotificationsService';
import firebaseAuthService from '../services/FirebaseAuthService';
import { MessagePayload, onMessage } from 'firebase/messaging';
import { db, messaging } from '../firebase';
import { toast } from 'react-toastify';
import biometricAuthService from '../services/BiometricAuthService';
import axios from 'axios';
import { IUser } from './HomeDefinitions';

import { QueryDocumentSnapshot, QuerySnapshot, collection, getDocs, onSnapshot, doc, DocumentSnapshot, updateDoc, deleteDoc } from "firebase/firestore";

const Home: React.FC = () => {

  const [currentUser, setCurrentUser] = useState<Auth["currentUser"]>()
  const auth: Auth = getAuth();

  useEffect(() => {
    fetchCats();
  }, [])

  useEffect(() => {
    console.log("normal")
    return onSnapshot(doc(db, "session", "sally-gatita"), (doc: DocumentSnapshot) => {
      console.log(doc.data())
      if (!doc.data())
        logout();
    });
  }, [])

  useEffect(() => {
    setOnline();
    return () => {
      window.addEventListener("beforeunload", () => {
        setOffline()
      });
    }
  }, [])

  async function setOnline() {
    await updateDoc(doc(db, "status", "sally-gatita"), {
      state: "online"
    });
  }

  async function setOffline() {
    await updateDoc(doc(db, "status", "sally-gatita"), {
      state: "offline"
    });
  }

  async function fetchCats() {
    // const querySnapshot: QuerySnapshot = await getDocs(collection(db, "cats"));
    // querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
    //   console.log(doc.id, doc.data())
    // });
  }

  onMessage(messaging, (message: MessagePayload): void => {
    toast.info(message?.notification?.title);
  })

  onAuthStateChanged(auth, (user): void => {
    console.log("auth changed", user)
    setCurrentUser(user);
  })

  function signInUser(): void {
    firebaseAuthService.signInUser("email@gmail.com", "123456")
  }

  function registerNotifications(): void {
    firebaseNotificationsService.requestPermission();
  }

  function checkBiometry(): void {
    biometricAuthService.authenticate();
  }

  async function checkToken(): Promise<void> {
    try {
      let token: string | undefined = await currentUser?.getIdToken();
      let tokenResult: IdTokenResult | undefined = await currentUser?.getIdTokenResult();
      await axios.get('http://localhost:3000/check', {
        headers: { 'authtoken': `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJod…YQe3JZgbX2CcSoPGj_zhtGjlNFcOEetKVC8-X1H4xmyKCWfVA` }
      });
      console.log("token result: ", tokenResult)
      toast.success("Token is valid");
    } catch (error) {
      toast.info("Token does not exist");
    }
  }

  async function checkUser(userIndex: number): Promise<void> {
    try {
      const user: IUser[] = [
        { userId: 11, uid: "sally-gatita" },
        { userId: 12, uid: "dalla-gatita" },
      ]
      const { data } = await axios.post('http://localhost:3000/user', user[userIndex]);
      console.log(data.user)
      // firebaseAuthService.signInCustomToken(data.token)
    } catch (error) {
      console.log(error)
    }
  }


  async function deleteToken(): Promise<void> {
    setOffline();
    // try {
    //   let token: string | undefined = await currentUser?.getIdToken();
    //   await axios.get('http://localhost:3000/delete', {
    //     headers: { 'authtoken': `${token}` }
    //   });
    //   toast.success("Token is valid");
    // } catch (error) {
    //   toast.info("Token does not exist");
    // }
  }

  async function signInToken(userIndex: number): Promise<void> {
    try {
      const user: IUser[] = [
        { userId: 11, uid: "sally-gatita" },
        { userId: 12, uid: "dalla-gatita" },
      ]
      const { data } = await axios.post('http://localhost:3000/custom-token', user[userIndex]);
      firebaseAuthService.signInCustomToken(data.token)
    } catch (error) {
      console.log(error)
    }
  }

  async function login(): Promise<void> {
    try {
      const { data } = await axios.post('http://localhost:3000/login', { userId: 100, uid: "sally-gatita" });
      console.log("token nuevo", data)
      firebaseAuthService.signInCustomToken(data.token)
    } catch (error) {
      console.log(error)
    }
  }



  async function deleteSession(): Promise<void> {
    await deleteDoc(doc(db, "session", "sally-gatita"));
  }

  async function logout(): Promise<void> {
    firebaseAuthService.signOutUser();
  }

  return (
    <IonPage>
      <IonContent class='ion-padding'>
        <IonButton size='small' expand='block' color="success" disabled={!!currentUser?.uid} onClick={login}>LOGIN</IonButton>
        <IonButton size='small' expand='block' color="danger" disabled={!currentUser?.uid} onClick={deleteSession}>LOGOUT</IonButton>
        <IonItemDivider />
        <IonButton size='small' expand='block' color="danger" disabled onClick={setOffline}>OFFLINE</IonButton>
        <IonButton size='small' expand='block' color="warning" disabled={!currentUser?.uid} onClick={registerNotifications}>NOTIFICATIONS</IonButton>
        <IonButton size='small' expand='block' color="tertiary" onClick={checkToken}>CHECK TOKEN</IonButton>
        <IonButton size='small' expand='block' color="light" disabled={!currentUser?.uid} onClick={() => checkUser(0)}>CHECK USER</IonButton>
        <IonButton size='small' expand='block' color="danger" disabled={!currentUser?.uid} onClick={firebaseAuthService.signOutUser}>SIGN OUT</IonButton>
        <IonItemDivider />
        <IonButton size='small' expand='block' color="light" disabled={!!currentUser?.uid} onClick={() => signInToken(0)}>SIGN IN SALLY 🐈</IonButton>
        <IonButton size='small' expand='block' color="danger" disabled={!currentUser?.uid} onClick={deleteToken}>DELETE SALLY 🐈</IonButton>
        <IonButton size='small' expand='block' color="dark" disabled={!!currentUser?.uid} onClick={() => signInToken(1)}>SIGN IN DALLA 🐈</IonButton>
        <IonItemDivider />
        <IonButton size='small' expand='block' color="success" disabled={!!currentUser?.uid} onClick={signInUser}>SIGN IN FIREBASE 🔥</IonButton>
        <IonItemDivider />
        <IonButton size='small' expand='block' color="tertiary" disabled={!!currentUser?.uid} onClick={checkBiometry}>BIOMETRIC AUTH 👀</IonButton>
        <IonItemDivider />
        {auth && <pre>{JSON.stringify(auth, null, 4)}</pre>}
      </IonContent>
    </IonPage>
  );
};

export default Home;
