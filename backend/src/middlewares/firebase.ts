import * as admin from "firebase-admin";

export const authVerification = async (req: any, res: any, next: any) => {
    try {
        const { authtoken } = req.headers;
        let response = await admin.auth().verifyIdToken(authtoken, true);
        return next();
    } catch (err) {
        res.status(401);
        return next("Unauthorized");
    }
}