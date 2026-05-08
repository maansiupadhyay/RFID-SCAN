import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatCard from '../components/StatCard';
import { Wrench, CheckCircle2, Clock, AlertTriangle, ArrowUpRight, ArrowDownLeft, Activity } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally { setLoading(false); }
  };

  if (loading) return <div className="loading-screen">Loading Dashboard...</div>;
  if (!stats) return <div className="loading-screen">Failed to load. Check if the server is running.</div>;

  const totalNonZero = stats.totalTools || 1;
  const bars = [
    { label: 'Available', count: stats.availableTools, color: '#10B981', pct: Math.round((stats.availableTools / totalNonZero) * 100) },
    { label: 'Issued',    count: stats.issuedTools,    color: '#F59E0B', pct: Math.round((stats.issuedTools    / totalNonZero) * 100) },
    { label: 'Missing',   count: stats.missingTools,   color: '#EF4444', pct: Math.round((stats.missingTools   / totalNonZero) * 100) },
  ];

  return (
    <div className="dashboard-page fade-in">

      {/* Header */}
      <div className="page-top">
        <div>
          <h1>Inventory Dashboard</h1>
          <p>Real-time overview of your RFID-tagged assets.</p>
        </div>
        <div className="last-updated">
          <Clock size={14} />
          Last updated: {format(new Date(), 'HH:mm:ss')}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-grid">
        <StatCard title="Total Tools"   value={stats.totalTools}     icon={Wrench}       color="#0066FF" />
        <StatCard title="Available"     value={stats.availableTools} icon={CheckCircle2} color="#10B981" trend={12} />
        <StatCard title="Issued"        value={stats.issuedTools}    icon={ArrowUpRight}  color="#F59E0B" trend={-5} />
        <StatCard title="Missing"       value={stats.missingTools}   icon={AlertTriangle} color="#EF4444" />
      </div>

      {/* Bottom row */}
      <div className="dash-bottom">

        {/* Inventory breakdown (progress bars instead of chart) */}
        <div className="card breakdown-card">
          <div className="card-head">
            <h3>Inventory Breakdown</h3>
            <Activity size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <div className="breakdown-list">
            {bars.map(b => (
              <div key={b.label} className="bar-row">
                <div className="bar-meta">
                  <span className="bar-label">{b.label}</span>
                  <span className="bar-count">{b.count} <small>({b.pct}%)</small></span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Compact legend */}
          <div className="legend-row">
            {bars.map(b => (
              <div key={b.label} className="legend-dot">
                <span style={{ background: b.color }} />
                {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card activity-card">
          <div className="card-head">
            <h3>Recent Transactions</h3>
            <Link to="/history" className="view-all-link">View All</Link>
          </div>
          <div className="activity-list">
            {stats.recentTransactions.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No recent transactions.</p>
            )}
            {stats.recentTransactions.map(tx => (
              <div key={tx.id} className="tx-item">
                <div className={`tx-icon ${tx.type === 'ISSUE' ? 'issue' : 'ret'}`}>
                  {tx.type === 'ISSUE' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                </div>
                <div className="tx-info">
                  <p className="tx-title">
                    <strong>{tx.tool?.name}</strong>
                    {' '}{tx.type === 'ISSUE' ? 'issued to' : 'returned by'}{' '}
                    <em>{tx.issuedTo || tx.user?.name}</em>
                  </p>
                  <p className="tx-time">{format(new Date(tx.createdAt), 'MMM dd, HH:mm')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .page-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1.75rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .page-top h1 { font-size: 1.85rem; margin-bottom: 0.2rem; }
        .page-top p  { color: var(--text-muted); font-size: 0.9rem; }
        .last-updated {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.8125rem; color: var(--text-muted);
          background: white; padding: 0.45rem 0.9rem;
          border-radius: 10px; border: 1px solid var(--border);
        }
        .dash-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .card-head {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 1.5rem;
        }
        .view-all-link { font-size: 0.875rem; color: var(--primary); font-weight: 600; }

        /* Breakdown bars */
        .breakdown-list { display: flex; flex-direction: column; gap: 1.25rem; }
        .bar-row { display: flex; flex-direction: column; gap: 0.4rem; }
        .bar-meta { display: flex; justify-content: space-between; font-size: 0.875rem; }
        .bar-label { font-weight: 600; }
        .bar-count { color: var(--text-muted); }
        .bar-count small { font-size: 0.8em; }
        .bar-track { height: 10px; background: var(--bg-soft); border-radius: 999px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 999px; transition: width 0.8s ease; }
        .legend-row {
          display: flex; gap: 1.25rem; margin-top: 1.5rem;
          flex-wrap: wrap;
        }
        .legend-dot { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: var(--text-muted); }
        .legend-dot span { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }

        /* Activity */
        .activity-list { display: flex; flex-direction: column; gap: 1.1rem; }
        .tx-item { display: flex; gap: 0.85rem; align-items: flex-start; }
        .tx-icon {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 2px;
        }
        .tx-icon.issue { background: #FEF3C7; color: #92400E; }
        .tx-icon.ret   { background: #DCFCE7; color: #166534; }
        .tx-info { display: flex; flex-direction: column; gap: 0.2rem; }
        .tx-title { font-size: 0.85rem; color: var(--text-main); line-height: 1.4; }
        .tx-title em { color: var(--primary); font-style: normal; }
        .tx-time { font-size: 0.75rem; color: var(--text-muted); }

        .loading-screen {
          height: 400px; display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; color: var(--text-muted);
        }

        @media (max-width: 1024px) { .dash-bottom { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default Dashboard;
