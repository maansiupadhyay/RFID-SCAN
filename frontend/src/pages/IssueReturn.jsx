import { useState } from 'react';
import api from '../services/api';
import { ArrowUpRight, ArrowDownLeft, Wrench, User, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const IssueReturn = () => {
  const [activeTab, setActiveTab] = useState('issue');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    toolCode: '',
    issuedTo: '',
    remarks: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const endpoint = activeTab === 'issue' ? '/transactions/issue' : '/transactions/return';
      const payload = activeTab === 'issue' 
        ? { toolCode: formData.toolCode, issuedTo: formData.issuedTo, remarks: formData.remarks }
        : { toolCode: formData.toolCode, remarks: formData.remarks };

      await api.post(endpoint, payload);
      
      setMessage({ 
        type: 'success', 
        text: `Tool ${activeTab === 'issue' ? 'issued' : 'returned'} successfully!` 
      });
      setFormData({ toolCode: '', issuedTo: '', remarks: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="issue-return-page fade-in">
      <header className="page-header">
        <h1>Issue & Return Management</h1>
        <p>Control the flow of tools in your inventory ecosystem.</p>
      </header>

      <div className="form-container card">
        <div className="tab-switcher">
          <button 
            className={`tab-btn ${activeTab === 'issue' ? 'active' : ''}`}
            onClick={() => { setActiveTab('issue'); setMessage({type:'', text:''}); }}
          >
            <ArrowUpRight size={18} />
            Issue Tool
          </button>
          <button 
            className={`tab-btn ${activeTab === 'return' ? 'active' : ''}`}
            onClick={() => { setActiveTab('return'); setMessage({type:'', text:''}); }}
          >
            <ArrowDownLeft size={18} />
            Return Tool
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label>RFID Tool Code</label>
            <div className="input-icon-wrapper">
              <Wrench size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="RFID-00001" 
                required 
                value={formData.toolCode}
                onChange={(e) => setFormData({...formData, toolCode: e.target.value})}
              />
            </div>
          </div>

          {activeTab === 'issue' && (
            <div className="form-group">
              <label>Issue To (Personnel Name)</label>
              <div className="input-icon-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="e.g. Michael Chen" 
                  required 
                  value={formData.issuedTo}
                  onChange={(e) => setFormData({...formData, issuedTo: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Remarks / Notes</label>
            <div className="input-icon-wrapper">
              <FileText size={18} className="input-icon top" />
              <textarea 
                placeholder="Any specific notes for this transaction..." 
                value={formData.remarks}
                onChange={(e) => setFormData({...formData, remarks: e.target.value})}
              ></textarea>
            </div>
          </div>

          {message.text && (
            <div className={`message-box ${message.type}`}>
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <FileText size={18} />}
              {message.text}
            </div>
          )}

          <button type="submit" className={`btn btn-block ${activeTab === 'issue' ? 'btn-primary' : 'btn-outline'}`} disabled={loading}>
            {loading ? 'Processing...' : (activeTab === 'issue' ? 'Confirm Issue' : 'Confirm Return')}
          </button>
        </form>
      </div>

      <div className="business-rules card">
        <h3>System Rules</h3>
        <ul>
          <li><strong>Availability:</strong> Only 'Available' tools can be issued.</li>
          <li><strong>Verification:</strong> Returning a tool requires it to be currently 'Issued'.</li>
          <li><strong>Traceability:</strong> All actions are logged to the transaction history for auditing.</li>
        </ul>
      </div>

      <style jsx>{`
        .form-container {
          max-width: 600px;
          margin: 0 auto 2rem;
          padding: 2.5rem;
        }
        .tab-switcher {
          display: flex;
          background: var(--bg-soft);
          padding: 0.5rem;
          border-radius: 14px;
          margin-bottom: 2.5rem;
          gap: 0.5rem;
        }
        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 10px;
          font-weight: 600;
          color: var(--text-muted);
          background: transparent;
          transition: all 0.2s;
        }
        .tab-btn.active {
          background: white;
          color: var(--primary);
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .transaction-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .input-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }
        .input-icon.top { top: 12px; }
        .input-icon-wrapper input, .input-icon-wrapper textarea {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--bg-soft);
        }
        .input-icon-wrapper textarea {
          height: 100px;
          resize: none;
        }
        .message-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
        }
        .message-box.success { background: #DCFCE7; color: #166534; }
        .message-box.error { background: #FEE2E2; color: #991B1B; }
        
        .business-rules {
          max-width: 600px;
          margin: 0 auto;
          background: var(--primary-light);
          border: 1px solid rgba(0,102,255,0.1);
        }
        .business-rules h3 { font-size: 1rem; margin-bottom: 1rem; color: var(--primary); }
        .business-rules ul { padding-left: 1.25rem; }
        .business-rules li { font-size: 0.875rem; color: var(--text-main); margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
};

export default IssueReturn;
