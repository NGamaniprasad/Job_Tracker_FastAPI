import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Failed to load stats. API might be down.</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        <div className="card"><h3>Total</h3><p style={{ fontSize: '2rem', margin: 0 }}>{stats.total_applications}</p></div>
        <div className="card"><h3>Today</h3><p style={{ fontSize: '2rem', margin: 0 }}>{stats.applications_today}</p></div>
        <div className="card"><h3>Applied</h3><p style={{ fontSize: '2rem', margin: 0, color: '#0284c7' }}>{stats.applied}</p></div>
        <div className="card"><h3>Interview</h3><p style={{ fontSize: '2rem', margin: 0, color: '#d97706' }}>{stats.interview}</p></div>
        <div className="card"><h3>Selected</h3><p style={{ fontSize: '2rem', margin: 0, color: '#16a34a' }}>{stats.selected}</p></div>
        <div className="card"><h3>Rejected</h3><p style={{ fontSize: '2rem', margin: 0, color: '#dc2626' }}>{stats.rejected}</p></div>
      </div>
    </div>
  );
};

export default Dashboard;
