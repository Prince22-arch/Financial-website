import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';
import { generateToken } from '../middleware/auth';
import mongoose from 'mongoose';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ success: false, message: 'Username and password required' });
        return;
      }

      // Explicitly type user
      const user = await User.findOne({ username }) as (IUser & { _id: mongoose.Types.ObjectId }) | null;
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      // _id is now ObjectId, so .toString() is safe
      const token = generateToken(user._id.toString());

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
