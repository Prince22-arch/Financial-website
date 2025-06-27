import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface PieChartData {
  name: string;
  value: number;
}

const COLORS = ['#00FF99', '#FFD700', '#FF8042', '#0088FE'];

const CategoryPieChart = ({ data }: { data: PieChartData[] }) => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        outerRadius={80}
        label
      >
        {data.map((_, idx) => (
          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export default CategoryPieChart;
