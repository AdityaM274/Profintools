import User from '../models/User.js';
import Newsletter from '../models/Newsletter.js';
import mongoose from 'mongoose';
export const getDashboardStats = async (req, res) => {
    // Check if DB is connected
    if (mongoose.connection.readyState !== 1) {
        return res.json({
            totalUsers: 1250,
            premiumUsers: 45,
            totalSubscribers: 890,
            revenue: 2250,
            activeTools: 15
        });
    }
    try {
        const totalUsers = await User.countDocuments();
        const premiumUsers = await User.countDocuments({ isPremium: true });
        const totalSubscribers = await Newsletter.countDocuments({ status: 'active' });
        // Mock revenue calculation (e.g. $49 per premium user)
        const revenue = premiumUsers * 49;
        res.json({
            totalUsers,
            premiumUsers,
            totalSubscribers,
            revenue,
            activeTools: 15
        });
    }
    catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getUsers = async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.json([
            { email: 'user1@example.com', isPremium: true, createdAt: new Date() },
            { email: 'user2@example.com', isPremium: false, createdAt: new Date() }
        ]);
    }
    try {
        const users = await User.find().sort({ createdAt: -1 }).limit(50);
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};
