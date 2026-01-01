import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletter extends Document {
    email: string;
    subscribedAt: Date;
    status: 'active' | 'unsubscribed';
}

const NewsletterSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active' }
});

export default mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
