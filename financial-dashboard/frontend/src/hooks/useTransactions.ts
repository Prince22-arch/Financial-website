import { useState, useEffect } from 'react';
import api from '../services/api';

export const useTransactions = (params: any) => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/transactions', { params })
      .then(res => {
        setTransactions(res.data.data);
        setPagination(res.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { transactions, pagination, loading };
};
