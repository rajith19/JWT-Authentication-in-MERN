import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());

// Use CORS Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend origin
  credentials: true // Allow credentials (cookies, authorization headers)
}));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
