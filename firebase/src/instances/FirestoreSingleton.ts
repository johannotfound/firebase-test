import { CollectionReference, DocumentReference, collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export class FirestoreSingleton {
    private static instance: FirestoreSingleton;

    private constructor() { }

    public static getInstance(): FirestoreSingleton {
        if (!FirestoreSingleton.instance) {
            FirestoreSingleton.instance = new FirestoreSingleton();
        }
        return FirestoreSingleton.instance;
    }

    public streamSnapshot = (path: string, uid: string, snapshot: any, error: any) => {
        const documentReference: DocumentReference = doc(db, path, uid);
        return onSnapshot(documentReference, snapshot, error);
    };

    public getDocuments = (path: string) => {
        const collectionReference: CollectionReference = collection(db, path);
        return getDocs(collectionReference);
    };

}