import { Request, Response } from 'express';
import Newsletter from '../models/Newsletter.js';
import axios from 'axios';

export const subscribe = async (req: Request, res: Response) => {
    const { email, name } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        // 1. Save to Local DB
        let subscriber = await Newsletter.findOne({ email });
        if (subscriber) {
            if (subscriber.status === 'active') {
                return res.status(400).json({ message: 'Already subscribed' });
            }
            subscriber.status = 'active';
            await subscriber.save();
        } else {
            subscriber = new Newsletter({ email });
            await subscriber.save();
        }

        // 2. Add to Brevo (Sendinblue)
        if (process.env.BREVO_API_KEY) {
            try {
                const brevoUrl = 'https://api.brevo.com/v3/contacts';
                const payload = {
                    email,
                    attributes: { FIRSTNAME: name || 'User' },
                    updateEnabled: true
                };

                await axios.post(brevoUrl, payload, {
                    headers: {
                        'api-key': process.env.BREVO_API_KEY,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                // 3. Send Transactional Email (Welcome) via Brevo
                if (process.env.BREVO_FROM_EMAIL) {
                    const emailData = {
                        sender: { name: process.env.BREVO_FROM_NAME || 'FinCalcPro', email: process.env.BREVO_FROM_EMAIL },
                        to: [{ email, name }],
                        subject: "Welcome to FinCalc Pro!",
                        htmlContent: `<html><body><h1>Welcome!</h1><p>Thanks for joining FinCalc Pro newsletter. Detailed financial tips coming your way.</p></body></html>`
                    };

                    await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
                        headers: {
                            'api-key': process.env.BREVO_API_KEY,
                            'Content-Type': 'application/json'
                        }
                    });
                }

            } catch (apiError: any) {
                console.error("Brevo API Error:", apiError.response?.data || apiError.message);
                // Don't fail the request if Brevo fails, just log it. DB is source of truth.
            }
        }

        res.status(200).json({ message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Newsletter Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
