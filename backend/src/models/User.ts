import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    firebaseUid: string;
    email: string;
    isPremium: boolean;
    stripeCustomerId?: string;
    subscriptionId?: string;
    premiumExpiresAt?: Date;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isPremium: { type: Boolean, default: false },
    stripeCustomerId: { type: String },
    subscriptionId: { type: String },
    premiumExpiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
