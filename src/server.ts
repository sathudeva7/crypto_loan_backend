import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cryptoRoutes from './routes/crypto.route';
import authRoutes from './routes/auth.route';
import fiatRoutes from './routes/fiat.route';
import loanRoutes from './routes/loan.route';
import userRoutes from './routes/user.route';
import mongoose from 'mongoose';
import connectDB from './config/db';

dotenv.config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Ensure Express parses JSON bodies

// Initialize Stripe with your secret key
//const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Routes
app.use('/api/crypto', cryptoRoutes);
app.use('/api/fiat', fiatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/user', userRoutes);

// Make sure to define a port, either via environment variable or a default value
const port = process.env.PORT || 3000;

// Start server
app.listen(port, () => {
    console.info(`Server running on port: ${port}`);
});

export default app;
