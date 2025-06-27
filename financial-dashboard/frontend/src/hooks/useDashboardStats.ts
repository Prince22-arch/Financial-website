import { useEffect, useState } from 'react';
import api from '../services/api';

export const useDashboardStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/transactions/dashboard/stats')
      .then(res => setStats(res.data.data))
      .finally(() => setLoading(false));
  }, []);
  return { stats, loading };
};
