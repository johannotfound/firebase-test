import { FC, useEffect, useRef, useState } from 'react';
import { IonButton, IonContent, IonItemDivider, IonPage, } from '@ionic/react';

import { FirestoreSingleton } from '../instances/FirestoreSingleton';

import { DocumentSnapshot, FirestoreError, QueryDocumentSnapshot, QuerySnapshot, collection, doc, getDocs, onSnapshot, query } from 'firebase/firestore';
import { Auth, Unsubscribe, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import firebaseAuthService from '../services/FirebaseAuthService';

import { auth, db } from '../firebase';
import { toast } from 'react-toastify';

const Firebase: FC = () => {

    const firebaseSingleton = FirestoreSingleton.getInstance();

    const [currentUser, setCurrentUser] = useState<Auth["currentUser"]>()

    onAuthStateChanged(auth, (user): void => {
        setCurrentUser(user);
    })

    // useEffect(() => {
    //     const getDocuments = async () => {
    //         const querySnapshot: QuerySnapshot = await firebaseSingleton.getDocuments("session")
    //         querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
    //             console.log(doc.id, doc.data());
    //         });
    //     }
    //     getDocuments();
    // }, [])

    // useEffect(() => {
    //     const unsubscribe: Unsubscribe = firebaseSingleton.streamSnapshot("session", "s411yg4t1t4",
    //         (doc: DocumentSnapshot) => {
    //             console.log(doc.data());
    //         },
    //         (error: FirestoreError) => console.log(error)
    //     );
    //     return unsubscribe;
    // }, [])

    async function getSessions(): Promise<void> {
        const { data } = await axios.get('http://localhost:3000/sessions');
        firebaseAuthService.signInCustomToken(data.voucher);
    }

    async function getLocalSessions(): Promise<void> {
        try {
            await getDocs(query(collection(db, "session")))
            console.log("to tranqui")
        } catch (error) {
            console.log("pailas")
        }
    }

    async function login(): Promise<void> {
        const { data } = await axios.post('http://localhost:3000/login', { uid: "s411yg4t1t4" });
        firebaseAuthService.signInCustomToken(data.voucher);
    }

    async function checkToken(): Promise<void> {
        try {
            let token: string | undefined = await currentUser?.getIdToken();
            await axios.get('http://localhost:3000/check', { headers: { 'authtoken': token } });
            toast.success("Token is valid");
        } catch (error) {
            toast.info("Token does not exist");
        }
    }

    async function logout(): Promise<void> {
        firebaseAuthService.signOutUser();
    }

    return (
        <IonPage>
            <IonContent class='ion-padding'>
                <IonButton size='small' expand='block' color="success" disabled={!!currentUser?.uid} onClick={login}>PADENTRO</IonButton>
                <IonButton size='small' expand='block' color="danger" disabled={!currentUser?.uid} onClick={logout}>PAFUERA</IonButton>
                <IonButton size='small' expand='block' color="tertiary" onClick={checkToken}>CHECK TOKEN</IonButton>
                {/* <IonButton size='small' expand='block' color="warning" onClick={getSessions}>SESSIONS</IonButton> */}
                <IonButton size='small' expand='block' color="warning" onClick={getLocalSessions}>SESSIONS</IonButton>
                <IonItemDivider />
                {auth && <pre>{JSON.stringify(auth, null, 4)}</pre>}
            </IonContent>
        </IonPage>
    );
};

export default Firebase;
