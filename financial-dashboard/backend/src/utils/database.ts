import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/financial-dashboard');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('DB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
