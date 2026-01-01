import User from '../models/User.js';
export const syncUser = async (req, res) => {
    const { firebaseUid, email } = req.user;
    try {
        let user = await User.findOne({ firebaseUid });
        if (!user) {
            user = new User({
                firebaseUid,
                email,
            });
            await user.save();
        }
        res.status(200).json({
            message: 'User synced successfully',
            user: {
                email: user.email,
                isPremium: user.isPremium,
                premiumExpiresAt: user.premiumExpiresAt,
            },
        });
    }
    catch (error) {
        console.error('Sync User Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getPremiumStatus = async (req, res) => {
    const { firebaseUid } = req.user;
    try {
        const user = await User.findOne({ firebaseUid });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.status(200).json({
            isPremium: user.isPremium,
            premiumExpiresAt: user.premiumExpiresAt,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
