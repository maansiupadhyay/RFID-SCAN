import { useState, useEffect } from 'react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchHistory();
  }, [pagination.page]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/transactions/history', {
        params: { page: pagination.page, limit: pagination.limit }
      });
      setTransactions(response.data);
      setPagination(prev => ({ ...prev, ...response.meta }));
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      key: 'type', 
      label: 'Type',
      width: '120px',
      render: (val) => (
        <span className={`tx-type ${val.toLowerCase()}`}>
          {val === 'ISSUE' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
          {val}
        </span>
      )
    },
    { 
      key: 'tool', 
      label: 'Tool Information',
      render: (val) => (
        <div className="tool-info">
          <span className="tool-name">{val.name}</span>
          <span className="tool-code">{val.toolCode}</span>
        </div>
      )
    },
    { key: 'issuedTo', label: 'Issued To / Operator', render: (val, row) => val || row.user.name },
    { 
      key: 'createdAt', 
      label: 'Timestamp',
      render: (val) => format(new Date(val), 'MMM dd, yyyy HH:mm:ss')
    },
    { key: 'remarks', label: 'Remarks', width: '250px' }
  ];

  return (
    <div className="history-page fade-in">
      <DataTable 
        title="Transaction History Log"
        columns={columns}
        data={transactions}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />

      <style jsx>{`
        .tx-type {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 0.75rem;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
        }
        .tx-type.issue { background: #FEF3C7; color: #92400E; }
        .tx-type.return { background: #DCFCE7; color: #166534; }
        
        .tool-info {
          display: flex;
          flex-direction: column;
        }
        .tool-name { font-weight: 600; }
        .tool-code { font-size: 0.75rem; color: var(--text-muted); font-family: monospace; }
      `}</style>
    </div>
  );
};

export default TransactionHistory;
