import toolRepository from '../repositories/tool.repository';
import { CreateToolDTO, UpdateToolDTO } from '../dtos/tool.dto';
import { PaginationParams } from '../types';
import { MESSAGES } from '../constants/messages';

export class ToolService {
  async getAllTools(params: PaginationParams) {
    const { page, limit, search, status, category } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { toolCode: { contains: search } },
      ];
    }
    if (status) where.status = status;
    if (category) where.category = category;

    const [tools, total] = await Promise.all([
      toolRepository.findAll({
        skip,
        take: limit,
        where,
        orderBy: { updatedAt: 'desc' },
      }),
      toolRepository.count(where),
    ]);

    return {
      tools,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getToolById(id: number) {
    const tool = await toolRepository.findById(id);
    if (!tool) throw new Error(MESSAGES.TOOL.NOT_FOUND);
    return tool;
  }

  async createTool(data: CreateToolDTO) {
    const existingTool = await toolRepository.findByCode(data.toolCode);
    if (existingTool) throw new Error(MESSAGES.TOOL.CODE_EXISTS);
    return toolRepository.create(data);
  }

  async updateTool(id: number, data: UpdateToolDTO) {
    const tool = await toolRepository.findById(id);
    if (!tool) throw new Error(MESSAGES.TOOL.NOT_FOUND);
    return toolRepository.update(id, data);
  }

  async deleteTool(id: number) {
    return toolRepository.delete(id);
  }
}

export default new ToolService();
