import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  date: Date;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
}

const TransactionSchema: Schema = new Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Revenue', 'Expense'] // <-- match your sample data!
  },
  status: { 
    type: String, 
    required: true,
    enum: ['Paid', 'Pending'] // <-- match your sample data!
  },
  user_id: { type: String, required: true },
  user_profile: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
