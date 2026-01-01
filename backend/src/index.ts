import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Load manual config if .env is missing/blocked
import fs from 'fs';
import path from 'path';

// Parse config.ts manually content since it's not a real module in this context or just read it
// Actually simpler to just hardcode load if it exists or rely on the fact I just wrote it as a TS file which exports nothing but sets env? 
// No, the previous file was effectively a .env file content but saved as .ts. 
// I need to parse it.

const loadManualConfig = () => {
  try {
    const configPath = path.join(process.cwd(), 'src', 'config.txt');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      content.split('\n').forEach(line => {
        const part = line.indexOf('=');
        if (part !== -1) {
          const key = line.substring(0, part);
          const value = line.substring(part + 1);
          if (key && value) {
            process.env[key.trim()] = value.trim().replace(/"/g, '').replace(/\\n/g, '\n');
          }
        }
      });
      console.log("Loaded manual config.txt");
    }
  } catch (e) {
    console.log("Error loading config.ts", e);
  }
};
loadManualConfig();

dotenv.config();
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { handleWebhook } from './controllers/paymentController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Stripe webhook must be placed before express.json() for raw body
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'FinCalcHub API is running' });
});

app.use('/api/users', userRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/tools', toolRoutes);

const startServer = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log("Connecting to MongoDB URI:", JSON.stringify(mongoUri));
    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB');
    } else {
      console.warn('MONGODB_URI not found in environment variables. Running without DB.');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
