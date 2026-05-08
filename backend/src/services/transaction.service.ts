import transactionRepository from '../repositories/transaction.repository';
import toolRepository from '../repositories/tool.repository';
import { IssueToolDTO, ReturnToolDTO } from '../dtos/transaction.dto';
import { MESSAGES } from '../constants/messages';

export class TransactionService {
  async issueTool(userId: number, data: IssueToolDTO) {
    const tool = await toolRepository.findByCode(data.toolCode);
    if (!tool) throw new Error(MESSAGES.TOOL.NOT_FOUND);

    if (tool.status === 'ISSUED') throw new Error(MESSAGES.TRANSACTION.ALREADY_ISSUED);
    if (tool.status === 'MISSING') throw new Error(MESSAGES.TRANSACTION.TOOL_MISSING);

    await toolRepository.update(tool.id, { status: 'ISSUED' });

    return transactionRepository.create({
      toolId: tool.id,
      userId,
      type: 'ISSUE',
      issuedTo: data.issuedTo,
      remarks: data.remarks,
    });
  }

  async returnTool(userId: number, data: ReturnToolDTO) {
    const tool = await toolRepository.findByCode(data.toolCode);
    if (!tool) throw new Error(MESSAGES.TOOL.NOT_FOUND);

    if (tool.status !== 'ISSUED') throw new Error(MESSAGES.TRANSACTION.NOT_ISSUED);

    await toolRepository.update(tool.id, { status: 'AVAILABLE' });

    return transactionRepository.create({
      toolId: tool.id,
      userId,
      type: 'RETURN',
      remarks: data.remarks,
    });
  }

  async getTransactionHistory(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      transactionRepository.findAll({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      transactionRepository.count(),
    ]);

    return {
      transactions,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}

export default new TransactionService();
