import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Initialize Firebase Admin (this should be done in a separate config file ideally)
// Initialize Firebase Admin (this should be done in a separate config file ideally)
const initFirebase = () => {
    if (admin.apps.length) return;

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                }),
            });
            console.log('Firebase Admin initialized Lazily');
        } catch (e) { console.error("Firebase init failed", e); }
    } else {
        console.warn('Firebase Admin NOT initialized - Missing credentials');
    }
};

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    initFirebase();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        (req as any).user = decodedToken;
        next();
    } catch (error) {
        console.error('Firebase Auth Error:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
