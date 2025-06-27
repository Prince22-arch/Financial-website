// src/components/dashboard/Dashboard.tsx

import { useEffect, useState } from 'react';
import api from '../../services/api';
import MetricCards from './MetricCards';
import RevenueExpensesLineChart from './LineChart';
import CategoryPieChart from './PieChart';
import RecentTransactions from './RecentTransactions';
import TransactionTable from '../transactions/TransactionTable';

// 👇 Type-only imports for interfaces!
import type { SummaryStats } from './MetricCards';
import type { RecentTransaction } from './RecentTransactions';

type LineChartData = {
  month: string;
  Revenue: number;
  Expenses: number;
};

type PieChartData = {
  name: string;
  value: number;
};

type DashboardStats = {
  summary: SummaryStats;
  categoryBreakdown: { _id: string; total: number }[];
  monthlyData: {
    _id: { year: number; month: number; category: string };
    total: number;
  }[];
  recentTransactions: RecentTransaction[];
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/transactions/dashboard/stats').then(res => {
      setStats(res.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!stats) return <div>No stats available</div>;

  // Prepare line chart data (Jan-Dec)
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const lineData: LineChartData[] = months.map((month, idx) => {
    const revenue = stats.monthlyData.find(
      d => d._id.month === idx + 1 && d._id.category === 'Revenue'
    )?.total || 0;
    const expenses = stats.monthlyData.find(
      d => d._id.month === idx + 1 && d._id.category === 'Expense'
    )?.total || 0;
    return {
      month,
      Revenue: revenue,
      Expenses: expenses
    };
  });

  // Prepare pie chart data
  const pieData: PieChartData[] = stats.categoryBreakdown.map(item => ({
    name: item._id,
    value: item.total
  }));

  return (
    <div style={{ background: '#181A20', minHeight: '100vh', color: '#fff', padding: 24 }}>
      {/* Metric Cards */}
      <MetricCards summary={stats.summary} />

      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        {/* Line Chart */}
        <div style={{ flex: 2, background: '#23243a', borderRadius: 12, padding: 16 }}>
          <h4 style={{ color: '#fff', marginBottom: 16 }}>Overview</h4>
          <RevenueExpensesLineChart data={lineData} />
        </div>
        {/* Pie Chart and Recent Transactions */}
        <div style={{ flex: 1, background: '#23243a', borderRadius: 12, padding: 16 }}>
          <CategoryPieChart data={pieData} />
          <RecentTransactions transactions={stats.recentTransactions} />
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{ background: '#23243a', borderRadius: 12, padding: 16 }}>
        <TransactionTable />
      </div>
    </div>
  );
};

export default Dashboard;
