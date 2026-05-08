import { CreateToolDTO, UpdateToolDTO } from '../dtos/tool.dto';
import { PaginationParams } from '../types';
export declare class ToolService {
    getAllTools(params: PaginationParams): Promise<{
        tools: ({
            id: number;
            toolCode: any;
            name: any;
            category: any;
            location: any;
            status: any;
            createdAt: any;
            updatedAt: any;
        } | null)[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getToolById(id: number): Promise<{
        id: number;
        toolCode: any;
        name: any;
        category: any;
        location: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    }>;
    createTool(data: CreateToolDTO): Promise<{
        id: number;
        toolCode: any;
        name: any;
        category: any;
        location: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null>;
    updateTool(id: number, data: UpdateToolDTO): Promise<{
        id: number;
        toolCode: any;
        name: any;
        category: any;
        location: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null>;
    deleteTool(id: number): Promise<void>;
}
declare const _default: ToolService;
export default _default;
//# sourceMappingURL=tool.service.d.ts.map