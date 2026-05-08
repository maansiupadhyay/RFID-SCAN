import { Request, Response } from 'express';
import dashboardService from '../services/dashboard.service';
import { ApiResponse, asyncHandler } from '../utils';
import { MESSAGES } from '../constants/messages';

export class DashboardController {
  getStats = asyncHandler(async (req: Request, res: Response) => {
    const result = await dashboardService.getStats();
    return ApiResponse.success(res, MESSAGES.DASHBOARD.STATS_FETCHED, result);
  });
}

export default new DashboardController();
