import { Request, Response } from 'express';
import toolService from '../services/tool.service';
import { ApiResponse, asyncHandler } from '../utils';
import { MESSAGES } from '../constants/messages';

export class ToolController {
  getAllTools = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const category = req.query.category as string;

    const result = await toolService.getAllTools({ page, limit, search, status, category });
    return ApiResponse.success(res, MESSAGES.TOOL.LIST_FETCHED, result.tools, 200, result.meta);
  });

  getToolById = asyncHandler(async (req: Request, res: Response) => {
    const raw = req.params.id;
    const id = parseInt(Array.isArray(raw) ? raw[0] : raw, 10);
    const result = await toolService.getToolById(id);
    return ApiResponse.success(res, MESSAGES.TOOL.FETCHED, result);
  });

  createTool = asyncHandler(async (req: Request, res: Response) => {
    const result = await toolService.createTool(req.body);
    return ApiResponse.created(res, MESSAGES.TOOL.CREATED, result);
  });

  updateTool = asyncHandler(async (req: Request, res: Response) => {
    const raw = req.params.id;
    const id = parseInt(Array.isArray(raw) ? raw[0] : raw, 10);
    const result = await toolService.updateTool(id, req.body);
    return ApiResponse.success(res, MESSAGES.TOOL.UPDATED, result);
  });

  deleteTool = asyncHandler(async (req: Request, res: Response) => {
    const raw = req.params.id;
    const id = parseInt(Array.isArray(raw) ? raw[0] : raw, 10);
    await toolService.deleteTool(id);
    return ApiResponse.success(res, MESSAGES.TOOL.DELETED);
  });
}

export default new ToolController();
