import mongoose, { Schema } from 'mongoose';
const NewsletterSchema = new Schema({
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active' }
});
export default mongoose.model('Newsletter', NewsletterSchema);
