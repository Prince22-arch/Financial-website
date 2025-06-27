import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs';

interface ExportRequest {
  fields: string[];
  filters?: {
    category?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    amountMin?: string;
    amountMax?: string;
    user?: string;
  };
}

export class ExportController {
  static async exportTransactions(req: Request, res: Response): Promise<void> {
    try {
      const { fields, filters }: ExportRequest = req.body;

      if (!fields || !Array.isArray(fields) || fields.length === 0) {
        res.status(400).json({ success: false, message: 'Fields array is required' });
        return;
      }

      // Build filter query
      const filter: any = {};
      if (filters) {
        if (filters.category) filter.category = filters.category;
        if (filters.status) filter.status = filters.status;
        if (filters.user) filter.user_id = { $regex: filters.user, $options: 'i' };
        if (filters.dateFrom || filters.dateTo) {
          filter.date = {};
          if (filters.dateFrom) filter.date.$gte = new Date(filters.dateFrom);
          if (filters.dateTo) filter.date.$lte = new Date(filters.dateTo);
        }
        if (filters.amountMin || filters.amountMax) {
          filter.amount = {};
          if (filters.amountMin) filter.amount.$gte = parseFloat(filters.amountMin);
          if (filters.amountMax) filter.amount.$lte = parseFloat(filters.amountMax);
        }
      }

      // Fetch transactions
      const transactions = await Transaction.find(filter).lean();

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `transactions-export-${timestamp}.csv`;
      const filepath = path.join(__dirname, '../../exports', filename);

      // Ensure exports directory exists
      const exportDir = path.dirname(filepath);
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      // Define headers based on selected fields
      const headerMap: { [key: string]: { id: string; title: string } } = {
        _id: { id: '_id', title: 'ID' },
        date: { id: 'date', title: 'Date' },
        amount: { id: 'amount', title: 'Amount' },
        category: { id: 'category', title: 'Category' },
        status: { id: 'status', title: 'Status' },
        user_id: { id: 'user_id', title: 'User ID' },
        user_profile: { id: 'user_profile', title: 'User Profile' }
      };

      const headers = fields
        .filter(field => headerMap[field])
        .map(field => headerMap[field]);

      // Create CSV writer
      const csvWriter = createObjectCsvWriter({
        path: filepath,
        header: headers
      });

      // Transform data for CSV
      const csvData = transactions.map(transaction => {
        const row: any = {};
        fields.forEach(field => {
          if (field === 'date') {
            row[field] = new Date((transaction as any)[field]).toISOString();
          } else {
            row[field] = (transaction as any)[field];
          }
        });
        return row;
      });

      // Write CSV
      await csvWriter.writeRecords(csvData);

      // Send file for download
      res.download(filepath, filename, (err) => {
        if (err) {
          console.error('Download error:', err);
        }
        // Clean up file after download
        setTimeout(() => {
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
        }, 60000); // Delete after 1 minute
      });

    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ success: false, message: 'Export failed' });
    }
  }
}
