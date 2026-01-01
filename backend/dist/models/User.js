import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isPremium: { type: Boolean, default: false },
    stripeCustomerId: { type: String },
    subscriptionId: { type: String },
    premiumExpiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('User', UserSchema);
