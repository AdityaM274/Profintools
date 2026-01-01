import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
    maintenanceMode: boolean;
    adsEnabled: boolean;
    googlePublisherId: string;
    adSlots: {
        homeHeader: boolean;
        homeInFeed: boolean;
        homeFooter: boolean;
        homeSidebar: boolean;
        toolHeader: boolean;
        toolInContent: boolean;
        toolFooter: boolean;
        toolSidebar: boolean;
    };
    affiliateAds: Array<{
        id: string;
        name: string;
        imageUrl: string;
        linkUrl: string;
        active: boolean;
    }>;
    disabledTools: string[]; // List of Tool IDs
    updatedAt: Date;
}

const SettingsSchema: Schema = new Schema({
    maintenanceMode: { type: Boolean, default: false },
    adsEnabled: { type: Boolean, default: true },
    googlePublisherId: { type: String, default: '' },
    adSlots: {
        homeHeader: { type: Boolean, default: true },
        homeInFeed: { type: Boolean, default: true },
        homeFooter: { type: Boolean, default: true },
        homeSidebar: { type: Boolean, default: true },
        toolHeader: { type: Boolean, default: true },
        toolInContent: { type: Boolean, default: true },
        toolFooter: { type: Boolean, default: true },
        toolSidebar: { type: Boolean, default: true },
    },
    affiliateAds: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        imageUrl: { type: String, required: true },
        linkUrl: { type: String, required: true },
        active: { type: Boolean, default: true }
    }],
    disabledTools: [{ type: String }],
    updatedAt: { type: Date, default: Date.now }
});

// Singleton pattern helper
SettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

export default mongoose.model<ISettings>('Settings', SettingsSchema);
