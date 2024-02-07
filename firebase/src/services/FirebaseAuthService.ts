import { createUserWithEmailAndPassword, signInWithCustomToken, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../firebase";

class FirebaseAuthService {

    public async signInUser(email: string, password: string): Promise<void> {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.info("User signed in successfully");
        } catch (err) {
            console.log(err)
            toast.error("User could not be signed in");
        }
    }

    public async signInCustomToken(token: string): Promise<void> {
        try {
            await signInWithCustomToken(auth, token);
            toast.info("User signed in successfully");
        } catch (err) {
            console.log(err)
            toast.error("User could not be signed in");
        }
    }

    public async signOutUser(): Promise<void> {
        await signOut(auth);
        toast.info("User signed out successfully");
    }
}

const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;