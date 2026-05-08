import toolRepository from '../repositories/tool.repository';
import transactionRepository from '../repositories/transaction.repository';
import scanRepository from '../repositories/scan.repository';

export class DashboardService {
  async getStats() {
    const [
      totalTools,
      availableTools,
      issuedTools,
      missingTools,
      recentTransactions,
      latestScan,
    ] = await Promise.all([
      toolRepository.count(),
      toolRepository.count({ status: 'AVAILABLE' }),
      toolRepository.count({ status: 'ISSUED' }),
      toolRepository.count({ status: 'MISSING' }),
      transactionRepository.findAll({ take: 10, orderBy: { createdAt: 'desc' } }),
      scanRepository.findLatest(),
    ]);

    return {
      totalTools,
      availableTools,
      issuedTools,
      missingTools,
      recentTransactions,
      latestScan,
    };
  }
}

export default new DashboardService();
