import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/financial-dashboard');
  const password = await bcrypt.hash('admin123', 10);
  await User.deleteMany({}); // Optional: clear users
  await User.create({
    username: 'admin',
    email: 'admin@example.com',
    password,
    role: 'admin'
  });
  console.log('Seeded admin user!');
  process.exit();
};

seed();
