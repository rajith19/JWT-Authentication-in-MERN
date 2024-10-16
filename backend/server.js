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
  origin: 'https://jwtmern.netlify.app', // Allow requests from your frontend origin
  credentials: true // Allow credentials (cookies, authorization headers)
}));

// Add additional headers to handle CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://jwtmern.netlify.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Handle Preflight requests
app.options('*', cors({
  origin: 'https://jwtmern.netlify.app',
  credentials: true
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
