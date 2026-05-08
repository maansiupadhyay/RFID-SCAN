import prisma from '../config/prisma';
import { CreateToolDTO, UpdateToolDTO } from '../dtos/tool.dto';

export class ToolRepository {
  async findAll(params: { skip?: number; take?: number; where?: any; orderBy?: any }) {
    const limit = params.take || 10;
    const offset = params.skip || 0;
    const result: any[] = await prisma.$queryRaw`SELECT * FROM tools ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    return result.map(t => this.mapTool(t));
  }

  async count(where?: any) {
    let query = 'SELECT COUNT(*) as count FROM tools';
    const params: any[] = [];
    
    if (where && where.status) {
      query += ' WHERE status = ?';
      params.push(where.status);
    }
    
    const result: any[] = await prisma.$queryRawUnsafe(query, ...params);
    return Number(result[0].count);
  }

  private mapTool(tool: any) {
    if (!tool) return null;
    return {
      id: Number(tool.id),
      toolCode: tool.tool_code,
      name: tool.name,
      category: tool.category,
      location: tool.location,
      status: tool.status,
      createdAt: tool.created_at,
      updatedAt: tool.updated_at
    };
  }

  async findById(id: number) {
    const result: any[] = await prisma.$queryRaw`SELECT * FROM tools WHERE id = ${id}`;
    return this.mapTool(result[0]);
  }

  async findByCode(toolCode: string) {
    const result: any[] = await prisma.$queryRaw`SELECT * FROM tools WHERE tool_code = ${toolCode}`;
    return this.mapTool(result[0]);
  }

  async create(data: CreateToolDTO) {
    const loc = data.location || null;
    await prisma.$executeRaw`INSERT INTO tools (tool_code, name, category, location, status, created_at, updated_at) VALUES (${data.toolCode}, ${data.name}, ${data.category}, ${loc}, 'AVAILABLE', NOW(3), NOW(3))`;
    return this.findByCode(data.toolCode);
  }

  async update(id: number, data: UpdateToolDTO) {
    const name = data.name || null;
    const cat = data.category || null;
    const loc = data.location || null;
    const status = data.status || null;
    
    await prisma.$executeRaw`UPDATE tools SET name = COALESCE(${name}, name), category = COALESCE(${cat}, category), location = COALESCE(${loc}, location), status = COALESCE(${status}, status), updated_at = NOW(3) WHERE id = ${id}`;
    return this.findById(id);
  }

  async delete(id: number) {
    return prisma.$executeRaw`DELETE FROM tools WHERE id = ${id}`;
  }

  async updateStatusBulk(codes: string[], status: string) {
    if (codes.length === 0) return;
    const placeholders = codes.map(() => '?').join(',');
    return prisma.$executeRawUnsafe(`UPDATE tools SET status = ?, updated_at = NOW(3) WHERE tool_code IN (${placeholders})`, status, ...codes);
  }

  async getAllCodes() {
    const result: any[] = await prisma.$queryRawUnsafe('SELECT tool_code FROM tools');
    return result.map((t) => t.tool_code);
  }
}

export default new ToolRepository();
