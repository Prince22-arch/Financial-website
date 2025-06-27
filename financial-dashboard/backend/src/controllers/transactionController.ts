import { Request, Response } from 'express';
import Transaction from '../models/Transaction';

export class TransactionController {
  // Get paginated, filtered, sorted transactions (table)
  static async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = '1',
        limit = '10',
        search,
        category,
        status,
        dateFrom,
        dateTo,
        amountMin,
        amountMax,
        sortField = 'date',
        sortOrder = 'desc'
      } = req.query;

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      const filter: any = {};

      if (search) {
        filter.$or = [
          { category: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } },
          { user_id: { $regex: search, $options: 'i' } }
        ];
      }
      if (category) filter.category = category;
      if (status) filter.status = status;

      if (dateFrom || dateTo) {
        filter.date = {};
        if (dateFrom) filter.date.$gte = new Date(dateFrom as string);
        if (dateTo) filter.date.$lte = new Date(dateTo as string);
      }

      if (amountMin || amountMax) {
        filter.amount = {};
        if (amountMin) filter.amount.$gte = parseFloat(amountMin as string);
        if (amountMax) filter.amount.$lte = parseFloat(amountMax as string);
      }

      const sort: any = {};
      sort[sortField as string] = sortOrder === 'asc' ? 1 : -1;

      const [transactions, total] = await Promise.all([
        Transaction.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
        Transaction.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: transactions,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      });
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Dashboard stats for charts, metrics, and recent transactions
  static async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      // Summary metrics
      const [totalRevenue, totalExpenses, transactionsByCategory, monthlyData, recentTransactions] = await Promise.all([
        Transaction.aggregate([
          { $match: { category: 'Revenue' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        Transaction.aggregate([
          { $match: { category: 'Expense' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        Transaction.aggregate([
          { $group: { _id: '$category', total: { $sum: '$amount' } } }
        ]),
        Transaction.aggregate([
          {
            $match: { category: { $in: ['Revenue', 'Expense'] } }
          },
          {
            $group: {
              _id: {
                year: { $year: '$date' },
                month: { $month: '$date' },
                category: '$category'
              },
              total: { $sum: '$amount' }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]),
        Transaction.find().sort({ date: -1 }).limit(5).lean()
      ]);

      const revenue = totalRevenue[0]?.total || 0;
      const expenses = totalExpenses[0]?.total || 0;
      const netProfit = revenue - expenses;
      const balance = revenue - expenses; // You can adjust this logic if needed
      const savings = netProfit; // Or use another calculation

      res.json({
        success: true,
        data: {
          summary: {
            totalRevenue: revenue,
            totalExpenses: expenses,
            netProfit,
            balance,
            savings
          },
          categoryBreakdown: transactionsByCategory,
          monthlyData,
          recentTransactions
        }
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
