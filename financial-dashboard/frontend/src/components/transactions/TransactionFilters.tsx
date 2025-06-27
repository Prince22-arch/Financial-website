import { DatePicker, InputNumber, Select, Button, Input } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { RangePicker } = DatePicker;

const categories = [
  { label: 'All', value: '' },
  { label: 'Revenue', value: 'Revenue' },
  { label: 'Expenses', value: 'Expenses' },
  { label: 'Investment', value: 'Investment' },
  { label: 'Refund', value: 'Refund' },
  { label: 'Other', value: 'Other' },
];

const statuses = [
  { label: 'All', value: '' },
  { label: 'Completed', value: 'Paid' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Failed', value: 'Failed' },
  { label: 'Cancelled', value: 'Cancelled' },
];

const TransactionFilters = ({ onFilter }: { onFilter: (filters: any) => void }) => {
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [amountMin, setAmountMin] = useState<number | undefined>();
  const [amountMax, setAmountMax] = useState<number | undefined>();
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [user, setUser] = useState<string>('');

  const handleApply = () => {
    onFilter({
      dateFrom: dateRange?.[0]?.startOf('day').toISOString(),
      dateTo: dateRange?.[1]?.endOf('day').toISOString(),
      amountMin,
      amountMax,
      category,
      status,
      user,
    });
  };

  return (
    <>
      <style>
        {`
          .custom-filter-bar input {
            color: #fff !important;
          }
          .custom-filter-bar input::placeholder {
            color: #fff !important;
            opacity: 1 !important;
          }
          .custom-filter-bar .ant-picker-input input::placeholder {
            color: #fff !important;
            opacity: 1 !important;
          }
            /* Make the arrow (separator) white */
            .custom-filter-bar .ant-picker-separator {
            color: #fff !important;
          }
            /* Make the calendar icon white */
            .custom-filter-bar .ant-picker-suffix {
            color: #fff !important;
          }   
        `}
      </style>
      <div className="custom-filter-bar" style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <RangePicker
          onChange={setDateRange}
          style={{ background: '#23243a', border: '1px solid #35374a', borderRadius: 8, color: '#fff' }}
          placeholder={['Start date', 'End date']}
        />
        <InputNumber
          placeholder="Min amount"
          value={amountMin}
          onChange={val => setAmountMin(val === null ? undefined : val)}
          style={{ width: 110, background: '#23243a', border: '1px solid #35374a', borderRadius: 8, color: '#fff' }}
        />
        <InputNumber
          placeholder="Max amount"
          value={amountMax}
          onChange={val => setAmountMax(val === null ? undefined : val)}
          style={{ width: 110, background: '#23243a', border: '1px solid #35374a', borderRadius: 8, color: '#fff' }}
        />
        <Select
          placeholder="Category"
          options={categories}
          value={category}
          onChange={setCategory}
          style={{ width: 130 }}
          allowClear
        />
        <Select
          placeholder="Status"
          options={statuses}
          value={status}
          onChange={setStatus}
          style={{ width: 130 }}
          allowClear
        />
        <Input
          placeholder="User"
          value={user}
          onChange={e => setUser(e.target.value)}
          style={{ width: 120, background: '#23243a', border: '1px solid #35374a', borderRadius: 8, color: '#fff' }}
        />
        <Button type="primary" icon={<FilterOutlined />} onClick={handleApply} style={{ background: '#00FF99', border: 'none', color: '#23243a' }}>
          Filter
        </Button>
      </div>
    </>
  );
};

export default TransactionFilters;
