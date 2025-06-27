export interface SummaryStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  balance: number;
  savings: number;
}

const MetricCards = ({ summary }: { summary: SummaryStats }) => (
  <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
    <div className="metric-card" style={cardStyle}>
      <div>Balance</div>
      <b>${summary.balance.toLocaleString()}</b>
    </div>
    <div className="metric-card" style={cardStyle}>
      <div>Revenue</div>
      <b>${summary.totalRevenue.toLocaleString()}</b>
    </div>
    <div className="metric-card" style={cardStyle}>
      <div>Expenses</div>
      <b>${summary.totalExpenses.toLocaleString()}</b>
    </div>
    <div className="metric-card" style={cardStyle}>
      <div>Savings</div>
      <b>${summary.savings.toLocaleString()}</b>
    </div>
  </div>
);

const cardStyle = {
  background: '#23243a',
  borderRadius: 12,
  padding: 16,
  flex: 1,
  color: '#fff',
  textAlign: 'center' as const,
};

export default MetricCards;
