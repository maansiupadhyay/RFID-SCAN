import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const DataTable = ({ 
  columns, 
  data, 
  loading, 
  onSearch, 
  pagination, 
  onPageChange,
  title,
  actions
}) => {
  return (
    <div className="data-table-wrapper card">
      <div className="table-header">
        <div className="table-title">
          <h2>{title}</h2>
          {pagination && <span className="total-count">Total: {pagination.total}</span>}
        </div>
        
        <div className="table-actions">
          {onSearch && (
            <div className="search-input">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          )}
          {actions}
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="table-loading">
            <Loader2 className="animate-spin" />
            <span>Loading data...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="table-empty">
            <p>No records found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} style={{ width: col.width }}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={row.id || idx}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="table-pagination">
          <button 
            disabled={pagination.page === 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="pagination-btn"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="page-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button 
            disabled={pagination.page === pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
            className="pagination-btn"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <style jsx>{`
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .table-title h2 {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }
        .total-count {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .table-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .search-input {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-input svg {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }
        .search-input input {
          padding: 0.6rem 1rem 0.6rem 2.5rem;
          border-radius: 10px;
          border: 1px solid var(--border);
          width: 250px;
          background: var(--bg-soft);
          transition: all 0.2s;
        }
        .search-input input:focus {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 4px var(--primary-light);
        }
        .table-loading, .table-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
          gap: 1rem;
          color: var(--text-muted);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .table-pagination {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 1.5rem;
          gap: 1rem;
        }
        .pagination-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .pagination-btn:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-light);
        }
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .page-info {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default DataTable;
