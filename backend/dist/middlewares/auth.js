import admin from 'firebase-admin';
// Initialize Firebase Admin (this should be done in a separate config file ideally)
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (!admin.apps.length && projectId && clientEmail && privateKey) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
    });
    console.log('Firebase Admin initialized');
}
else {
    console.warn('Firebase Admin NOT initialized - Missing credentials');
}
export const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    }
    catch (error) {
        console.error('Firebase Auth Error:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
