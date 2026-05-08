import { Request, Response } from 'express';
import scanService from '../services/scan.service';
import { ApiResponse, asyncHandler } from '../utils';
import { MESSAGES } from '../constants/messages';

export class ScanController {
  performScan = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await scanService.performScan(userId, req.body);
    return ApiResponse.created(res, MESSAGES.SCAN.COMPLETED, result);
  });

  getScanHistory = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await scanService.getScanHistory({ page, limit });
    return ApiResponse.success(res, MESSAGES.SCAN.HISTORY_FETCHED, result.scans, 200, result.meta);
  });
}

export default new ScanController();
