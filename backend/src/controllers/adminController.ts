import { Request, Response } from 'express';
import User from '../models/User.js';
import Newsletter from '../models/Newsletter.js';
import Settings from '../models/Settings.js';
import mongoose from 'mongoose';

// --- STATS & READS ---

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const premiumUsers = await User.countDocuments({ isPremium: true });
        const totalSubscribers = await Newsletter.countDocuments({ status: 'active' });

        // Revenue based on ₹1 per premium user
        const revenue = premiumUsers * 1;

        res.json({
            totalUsers,
            premiumUsers,
            totalSubscribers,
            revenue,
            activeTools: 50 // Static for now, or fetch from code constant if shared
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }).limit(100);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

export const getSubscribers = async (req: Request, res: Response) => {
    try {
        const subscribers = await Newsletter.find().sort({ subscribedAt: -1 }).limit(100);
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscribers' });
    }
};

// --- USER MANAGEMENT ---

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body; // Expecting { isPremium: boolean }
    try {
        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};

// --- SETTINGS MANAGEMENT ---

export const getSettings = async (req: Request, res: Response) => {
    try {
        // @ts-ignore - Schema static method
        const settings = await Settings.getSettings();
        res.json(settings);
    } catch (error) {
        console.error("Get Settings Error", error);
        res.status(500).json({ message: 'Error fetching settings' });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    try {
        // @ts-ignore - Schema static method
        let settings = await Settings.getSettings();

        // Update fields
        if (req.body.maintenanceMode !== undefined) settings.maintenanceMode = req.body.maintenanceMode;
        if (req.body.adsEnabled !== undefined) settings.adsEnabled = req.body.adsEnabled;
        if (req.body.googlePublisherId !== undefined) settings.googlePublisherId = req.body.googlePublisherId;
        if (req.body.disabledTools) settings.disabledTools = req.body.disabledTools;
        if (req.body.adSlots) settings.adSlots = { ...settings.adSlots, ...req.body.adSlots };
        if (req.body.affiliateAds) settings.affiliateAds = req.body.affiliateAds;

        settings.updatedAt = new Date();
        await settings.save();
        res.json(settings);
    } catch (error) {
        console.error("Update Settings Error", error);
        res.status(500).json({ message: 'Error updating settings' });
    }
};
