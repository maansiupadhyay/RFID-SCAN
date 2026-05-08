import { useState, useEffect } from 'react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ToolManagement = () => {
  const { user } = useAuth();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [formData, setFormData] = useState({ toolCode: '', name: '', category: '', location: '', status: 'AVAILABLE' });

  useEffect(() => {
    fetchTools();
  }, [pagination.page, search]);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/tools`, {
        params: { page: pagination.page, limit: pagination.limit, search }
      });
      setTools(response.data);
      setPagination(prev => ({ ...prev, ...response.meta }));
    } catch (err) {
      console.error('Failed to fetch tools', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (editingTool) {
        await api.put(`/tools/${editingTool.id}`, formData);
      } else {
        await api.post('/tools', formData);
        setPagination(prev => ({ ...prev, page: 1 })); // Go to page 1 to see new item
      }
      setIsModalOpen(false);
      setEditingTool(null);
      setFormData({ toolCode: '', name: '', category: '', location: '', status: 'AVAILABLE' });
      
      // Small delay ensures DB has finished write before we fetch
      setTimeout(() => fetchTools(), 100);
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleEdit = (tool) => {
    setEditingTool(tool);
    setFormData({ 
      toolCode: tool.toolCode, 
      name: tool.name, 
      category: tool.category, 
      location: tool.location || '',
      status: tool.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert('Error: Tool ID is missing');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this tool?')) return;
    
    try {
      // Use direct api call with full assurance
      await api.delete(`/tools/${id}`);
      
      // Force a slightly longer delay and then a hard refresh to be 100% sure
      setTimeout(() => {
        window.location.reload();
      }, 300);
      
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err.message || 'Delete failed. Please ensure you have admin privileges.');
    }
  };

  const columns = [
    { key: 'toolCode', label: 'RFID Code', width: '150px' },
    { key: 'name', label: 'Tool Name' },
    { key: 'category', label: 'Category' },
    { key: 'location', label: 'Location' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`badge badge-${val.toLowerCase()}`}>{val}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-btns">
          {user?.role === 'ADMIN' ? (
            <>
              <button className="icon-btn edit" onClick={() => handleEdit(row)}><Edit2 size={16} /></button>
              <button className="icon-btn delete" onClick={() => handleDelete(row.id)}><Trash2 size={16} /></button>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>View Only</span>
          )}
        </div>
      )
    }
  ];

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="tools-page fade-in">
      <DataTable 
        title="Inventory Management"
        columns={columns}
        data={tools}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        onSearch={setSearch}
        actions={isAdmin && (
          <button className="btn btn-primary" onClick={() => { setEditingTool(null); setIsModalOpen(true); }}>
            <Plus size={18} /> New Tool
          </button>
        )}
      />

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="modal-header">
                <h3>{editingTool ? 'Edit Tool' : 'Add New Tool'}</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X /></button>
              </div>
              <form onSubmit={handleCreate} className="tool-form">
                <div className="form-group">
                  <label>RFID Tool Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. RFID-00042" 
                    required 
                    disabled={!!editingTool}
                    value={formData.toolCode}
                    onChange={(e) => setFormData({...formData, toolCode: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Tool Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Bosch Drill" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="Power Tools">Power Tools</option>
                    <option value="Hand Tools">Hand Tools</option>
                    <option value="Measurement">Measurement</option>
                    <option value="Safety Gear">Safety Gear</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Warehouse A" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                {editingTool && (
                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="ISSUED">ISSUED</option>
                      <option value="MISSING">MISSING</option>
                    </select>
                  </div>
                )}
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    <Save size={18} /> {editingTool ? 'Update Tool' : 'Save Tool'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .action-btns {
          display: flex;
          gap: 0.5rem;
        }
        .icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-soft);
          color: var(--text-muted);
          transition: all 0.2s;
        }
        .icon-btn.edit:hover { color: var(--primary); background: var(--primary-light); }
        .icon-btn.delete:hover { color: var(--error); background: #FEE2E2; }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 2rem;
        }
        .modal-content {
          width: 100%;
          max-width: 500px;
          padding: 2rem;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .tool-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
        }
        .form-group input, .form-group select {
          padding: 0.75rem;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--bg-soft);
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ToolManagement;
