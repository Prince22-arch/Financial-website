import mongoose from 'mongoose';
import Transaction from '../models/Transaction';
import fs from 'fs';

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/financial-dashboard');
  const raw = fs.readFileSync('data.json', 'utf-8');
  const transactions = JSON.parse(raw);

  // Fix category/status if needed
  transactions.forEach((t: any) => {
    if (t.category === 'Expenses') t.category = 'Expense';
    if (t.status === 'Completed') t.status = 'Paid';
  });

  await Transaction.deleteMany({});
  await Transaction.insertMany(transactions);
  console.log('Sample transactions seeded!');
  process.exit();
};

run();
