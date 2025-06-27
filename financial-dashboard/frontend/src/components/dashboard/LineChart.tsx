import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface LineChartData {
  month: string;
  Revenue: number;
  Expenses: number;
}

const RevenueExpensesLineChart = ({ data }: { data: LineChartData[] }) => (
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={data}>
      <XAxis dataKey="month" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="Revenue" stroke="#00FF99" strokeWidth={2} dot={false} />
      <Line type="monotone" dataKey="Expenses" stroke="#FFD700" strokeWidth={2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

export default RevenueExpensesLineChart;
