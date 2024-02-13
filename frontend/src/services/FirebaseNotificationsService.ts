import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getToken } from 'firebase/messaging';
import { toast } from 'react-toastify';
import { messaging } from '../firebase';

class FirebaseNotificationsService {

    public async sessionSignIn(): Promise<void> {
        await signInAnonymously(getAuth());
        toast.success("User signed in anonymously");
    }

    public async requestPermission() {
        try {
            const token = await getToken(messaging, { vapidKey: "BIZBLiwLQ3h8qzNnJKeMqGhc5IhfZfBZ192xBWOj8TCwh_rRQyB-7Kth7lucsGMh0Xp7-QFn6VkYTcfqV_o8yhc" })
            console.log(token)
        } catch (err) {
            console.log("Permission denied");
        }
    }

}

const firebaseNotificationsService = new FirebaseNotificationsService();
export default firebaseNotificationsService;