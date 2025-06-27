import { useState } from 'react';
import { Table, Input, Button } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import type { TablePaginationConfig, FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionFilters from './TransactionFilters';
import ExportModal from './ExportModal';

interface Transaction {
  _id: string;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
}

const TransactionTable: React.FC = () => {
  const [params, setParams] = useState({ page: 1, limit: 10, sortField: 'date', sortOrder: 'desc', search: '' });
  const [filters, setFilters] = useState({});
  const [exportVisible, setExportVisible] = useState(false);

  const { transactions, pagination, loading } = useTransactions(params);

  // Inline style for white placeholder
  const placeholderStyle = (
    <style>
      {`
        .custom-search-input input::placeholder {
          color: #fff !important;
          opacity: 1 !important;
        }
      `}
    </style>
  );

  const columns = [
    {
      title: '',
      dataIndex: 'user_profile',
      key: 'user_profile',
      width: 48,
      render: (src: string) => (
        <img
          src={src}
          alt="profile"
          style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #23243a' }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (text: string) => (
        <span style={{ color: '#fff', fontWeight: 500 }}>{text}</span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      render: (date: string) => (
        <span style={{ color: '#b0b3be' }}>
          {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      render: (amount: number) => (
        <span
          style={{
            color: amount > 0 ? '#00FF99' : '#FFD700',
            fontWeight: 500,
          }}
        >
          {amount > 0 ? '+' : ''}${amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span
          style={{
            background: status === 'Paid' ? '#1f8c5f' : '#bfa600',
            color: '#fff',
            borderRadius: 8,
            padding: '2px 16px',
            fontSize: 12,
            fontWeight: 500,
            display: 'inline-block',
            minWidth: 80,
            textAlign: 'center',
          }}
        >
          {status === 'Paid' ? 'Completed' : 'Pending'}
        </span>
      ),
    },
  ];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Transaction> | SorterResult<Transaction>[],
    _extra: TableCurrentDataSource<Transaction>
  ) => {
    let sortField = 'date';
    let sortOrder: 'asc' | 'desc' = 'desc';

    if (!Array.isArray(sorter) && sorter.field && sorter.order) {
      sortField = sorter.field as string;
      sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    }

    setParams({
      ...params,
      page: pagination.current ?? 1,
      limit: pagination.pageSize ?? 10,
      sortField,
      sortOrder,
    });
  };

  const handleFilter = (newFilters: any) => {
    setParams({ ...params, ...newFilters, page: 1 });
    setFilters(newFilters);
  };

  return (
    <div style={{
      background: '#23243a',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 2px 12px 0 #181a2030',
      marginTop: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 600, margin: 0 }}>Transactions</h2>
        <div>
          <Button icon={<DownloadOutlined />} onClick={() => setExportVisible(true)} style={{ marginRight: 8, background: '#00FF99', border: 'none', color: '#23243a' }}>
            Export CSV
          </Button>
          <>
            {placeholderStyle}
            <Input
              prefix={<SearchOutlined style={{ color: '#00FF99' }} />}
              placeholder="Search for anything..."
              onPressEnter={e => setParams({ ...params, search: (e.target as HTMLInputElement).value, page: 1 })}
              style={{
                background: '#23243a',
                border: '1px solid #35374a',
                color: '#fff',
                borderRadius: 8,
                padding: 8,
                width: 220,
              }}
              allowClear
              className="custom-search-input"
            />
          </>
        </div>
      </div>
      <TransactionFilters onFilter={handleFilter} />
      <Table<Transaction>
        columns={columns}
        dataSource={transactions}
        loading={loading}
        pagination={{
          current: pagination?.currentPage ?? 1,
          pageSize: pagination?.itemsPerPage ?? 10,
          total: pagination?.totalItems ?? 0,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
        rowKey="_id"
        rowClassName={() => 'dashboard-row'}
        style={{
          background: '#23243a',
          color: '#fff',
        }}
      />
      <ExportModal visible={exportVisible} onClose={() => setExportVisible(false)} filters={filters} />
      {/* Table row styling */}
      <style>
        {`
          .dashboard-row td {
            background: #23243a !important;
            color: #fff !important;
            border-bottom: 1px solid #35374a !important;
          }
          .ant-table-thead > tr > th {
            background: #181A20 !important;
            color: #fff !important;
            border-bottom: 1px solid #35374a !important;
            font-weight: 600;
          }
        `}
      </style>
    </div>
  );
};

export default TransactionTable;


