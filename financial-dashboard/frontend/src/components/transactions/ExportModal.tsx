import { Modal, Checkbox, Button } from 'antd';
import { useState } from 'react';

const fields = [
  { label: 'ID', value: '_id' },
  { label: 'Date', value: 'date' },
  { label: 'Amount', value: 'amount' },
  { label: 'Category', value: 'category' },
  { label: 'Status', value: 'status' },
  { label: 'User ID', value: 'user_id' },
  { label: 'User Profile', value: 'user_profile' },
];

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  filters: any;
}

const ExportModal = ({ visible, onClose, filters }: ExportModalProps) => {
  const [selectedFields, setSelectedFields] = useState<string[]>(fields.map(f => f.value));
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ fields: selectedFields, filters }),
    });
    if (res.status !== 200) {
      setLoading(false);
      onClose();
      alert('Export failed. Please make sure you are logged in.');
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      title="Export Transactions to CSV"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="export" type="primary" loading={loading} onClick={handleExport} style={{ background: '#00FF99', border: 'none', color: '#23243a' }}>
          Export
        </Button>,
      ]}
    >
      <Checkbox.Group
        options={fields}
        value={selectedFields}
        onChange={val => setSelectedFields(val as string[])}
        style={{ display: 'flex', flexDirection: 'column', gap: 8, color: '#fff' }}
      />
    </Modal>
  );
};

export default ExportModal;
