import { Request, Response } from 'express';
import transactionService from '../services/transaction.service';
import { ApiResponse, asyncHandler } from '../utils';
import { MESSAGES } from '../constants/messages';

export class TransactionController {
  issueTool = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await transactionService.issueTool(userId, req.body);
    return ApiResponse.created(res, MESSAGES.TRANSACTION.ISSUED, result);
  });

  returnTool = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await transactionService.returnTool(userId, req.body);
    return ApiResponse.created(res, MESSAGES.TRANSACTION.RETURNED, result);
  });

  getTransactionHistory = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await transactionService.getTransactionHistory({ page, limit });
    return ApiResponse.success(res, MESSAGES.TRANSACTION.HISTORY_FETCHED, result.transactions, 200, result.meta);
  });
}

export default new TransactionController();
