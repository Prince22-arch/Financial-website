export interface RecentTransaction {
  user_profile: string;
  user_id: string;
  date: string;
  amount: number;
  status: string;
  category: string;
}

const RecentTransactions = ({ transactions }: { transactions: RecentTransaction[] }) => (
  <div className="recent-transactions" style={{ marginTop: 32 }}>
    <h4 style={{ color: '#fff', marginBottom: 8 }}>Recent Transactions</h4>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {transactions.map((trx, idx) => (
        <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <img src={trx.user_profile} alt="profile" style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }} />
          <span style={{ flex: 1, color: '#fff' }}>{trx.user_id}</span>
          <span style={{ color: trx.amount > 0 ? '#00FF99' : '#FFD700', minWidth: 70, textAlign: 'right', display: 'inline-block' }}>
            {trx.amount > 0 ? '+' : ''}${trx.amount}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentTransactions;
