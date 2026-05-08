import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <motion.div 
      className="card stat-card"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="stat-header">
        <div className="stat-icon" style={{ backgroundColor: `${color}15`, color: color }}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>

      <style jsx>{`
        .stat-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-content {
          margin-top: 0.5rem;
        }
        .stat-value {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .stat-title {
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 500;
        }
        .stat-trend {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }
        .stat-trend.positive { background: #DCFCE7; color: #166534; }
        .stat-trend.negative { background: #FEE2E2; color: #991B1B; }
      `}</style>
    </motion.div>
  );
};

export default StatCard;
