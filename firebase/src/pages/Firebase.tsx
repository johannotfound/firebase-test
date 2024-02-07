import { FC, useEffect, useRef } from 'react';
import { IonButton, IonContent, IonPage, } from '@ionic/react';

import { FirestoreSingleton } from '../instances/FirestoreSingleton';

import { DocumentSnapshot, FirestoreError, QueryDocumentSnapshot, QuerySnapshot, collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Unsubscribe } from 'firebase/auth';

const Firebase: FC = () => {

    const firebaseSingleton = FirestoreSingleton.getInstance();

    useEffect(() => {
        console.log("2Pac")
        const getDocuments = async () => {
            const querySnapshot: QuerySnapshot = await firebaseSingleton.getDocuments("cats")
            querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
                console.log(doc.id, doc.data());
            });
        }
        getDocuments();
    }, [])

    useEffect(() => {
        console.log("Cypress Hill")
        const unsubscribe: Unsubscribe = firebaseSingleton.streamSnapshot("session", "sally-gatita",
            (doc: DocumentSnapshot) => {
                console.log(doc.data());
            },
            (error: FirestoreError) => console.log(error)
        );
        return unsubscribe;
    }, [])

    return (
        <IonPage>
            <IonContent class='ion-padding'>
                <IonButton size='small' expand='block' color="danger">A$AP Rocky</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Firebase;
