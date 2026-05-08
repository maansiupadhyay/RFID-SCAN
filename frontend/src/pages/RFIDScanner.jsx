import { useState } from 'react';
import api from '../services/api';
import { ScanLine, CheckCircle2, XCircle, AlertCircle, RefreshCw, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RFIDScanner = () => {
  const [scanInput, setScanInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    // Convert comma/newline separated list to array
    const scannedIds = scanInput
      .split(/[\n,]+/)
      .map(id => id.trim())
      .filter(id => id !== '');

    if (scannedIds.length === 0) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.post('/scans/scan', { scannedIds });
      setResult(response.data);
      setScanInput('');
    } catch (err) {
      setError(err.message || 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scanner-page fade-in">
      <header className="page-header">
        <h1>RFID Scan Simulator</h1>
        <p>Simulate industrial batch scanning by inputting RFID tool codes.</p>
      </header>

      <div className="scanner-layout">
        <div className="scanner-input-section card">
          <div className="scanner-header">
            <ScanLine size={24} className="primary-icon" />
            <h3>RFID Reader Input</h3>
          </div>
          <p className="helper-text">Enter tool IDs separated by commas or new lines.</p>
          
          <form onSubmit={handleScan}>
            <textarea 
              className="scan-textarea"
              placeholder="Paste RFID codes here..."
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              disabled={loading}
            ></textarea>
            
            <button type="submit" className="btn btn-primary btn-block" disabled={loading || !scanInput.trim()}>
              {loading ? <RefreshCw className="animate-spin" /> : 'Execute Batch Scan'}
            </button>
          </form>

          {error && <div className="error-msg card">{error}</div>}
        </div>

        <div className="scanner-results-section">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="results-container"
              >
                <div className="results-summary card">
                  <h3>Scan Results Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-item matched">
                      <span className="summary-value">{result.totalMatched}</span>
                      <span className="summary-label">Matched</span>
                    </div>
                    <div className="summary-item missing">
                      <span className="summary-value">{result.totalMissing}</span>
                      <span className="summary-label">Missing</span>
                    </div>
                    <div className="summary-item extra">
                      <span className="summary-value">{result.totalExtra}</span>
                      <span className="summary-label">Extra</span>
                    </div>
                  </div>
                </div>

                <div className="details-grid">
                  <div className="detail-card card missing">
                    <div className="detail-header">
                      <AlertCircle size={20} />
                      <h4>Missing Tools ({result.totalMissing})</h4>
                    </div>
                    <p className="detail-desc">In database but not scanned.</p>
                    <div className="id-list">
                      {result.missingTools.map(id => <span key={id} className="id-tag">{id}</span>)}
                      {result.totalMissing === 0 && <span className="empty-text">None</span>}
                    </div>
                  </div>

                  <div className="detail-card card extra">
                    <div className="detail-header">
                      <XCircle size={20} />
                      <h4>Extra Tools ({result.totalExtra})</h4>
                    </div>
                    <p className="detail-desc">Scanned but not in database.</p>
                    <div className="id-list">
                      {result.extraTools.map(id => <span key={id} className="id-tag">{id}</span>)}
                      {result.totalExtra === 0 && <span className="empty-text">None</span>}
                    </div>
                  </div>

                  <div className="detail-card card matched full-width">
                    <div className="detail-header">
                      <CheckCircle2 size={20} />
                      <h4>Matched Tools ({result.totalMatched})</h4>
                    </div>
                    <div className="id-list horizontal">
                      {result.matchedTools.map(id => <span key={id} className="id-tag">{id}</span>)}
                      {result.totalMatched === 0 && <span className="empty-text">None</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="placeholder-card card"
              >
                <Database size={64} className="placeholder-icon" />
                <h3>No Active Scan</h3>
                <p>Submit a batch of RFID codes to generate a comparison report.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .scanner-layout {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 2rem;
          align-items: flex-start;
        }
        .scanner-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .primary-icon { color: var(--primary); }
        .helper-text {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        .scan-textarea {
          width: 100%;
          height: 300px;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-soft);
          resize: none;
          font-family: 'Courier New', Courier, monospace;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          transition: all 0.2s;
        }
        .scan-textarea:focus {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 4px var(--primary-light);
        }
        .results-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .summary-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem;
          border-radius: 16px;
        }
        .summary-item.matched { background: #DCFCE7; color: #166534; }
        .summary-item.missing { background: #FEE2E2; color: #991B1B; }
        .summary-item.extra { background: #F1F5F9; color: #475569; }
        .summary-value { font-size: 2rem; font-weight: 700; }
        .summary-label { font-size: 0.875rem; font-weight: 600; text-transform: uppercase; }
        
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .detail-card h4 { margin-bottom: 0.25rem; }
        .detail-desc { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem; }
        .detail-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
        .detail-card.missing h4 { color: var(--error); }
        .detail-card.extra h4 { color: #64748B; }
        .detail-card.matched h4 { color: var(--success); }
        .full-width { grid-column: span 2; }
        
        .id-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          max-height: 200px;
          overflow-y: auto;
        }
        .id-tag {
          padding: 0.25rem 0.5rem;
          background: var(--bg-soft);
          border: 1px solid var(--border);
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.75rem;
        }
        .placeholder-card {
          height: 100%;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--text-muted);
          gap: 1rem;
        }
        .placeholder-icon { opacity: 0.2; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .scanner-layout { grid-template-columns: 1fr; }
          .details-grid { grid-template-columns: 1fr; }
          .full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default RFIDScanner;
