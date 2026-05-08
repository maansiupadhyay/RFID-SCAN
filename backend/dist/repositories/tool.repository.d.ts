import { CreateToolDTO, UpdateToolDTO } from '../dtos/tool.dto';
export declare class ToolRepository {
    findAll(params: {
        skip?: number;
        take?: number;
        where?: any;
        orderBy?: any;
    }): Promise<({
        id: number;
        toolCode: any;
        name: any;
        category: any;
        location: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null)[]>;
    count(where?: any): Promise<number>;
    private mapTool;
    findById(id: number): Promise<{
        id: number;
        toolCode: any;
        name: any;
        category: any;
        location: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null>;
    findByCode(toolCode: string): Promise<{
        id: number;
        toolCode: any;
        name: any;
        category: any;
        location: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null>;
    create(data: CreateToolDTO): Promise<{
        id: number;
        toolCode: any;
        name: any;
        category: any;
        location: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null>;
    update(id: number, data: UpdateToolDTO): Promise<{
        id: number;
        toolCode: any;
        name: any;
        category: any;
        location: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null>;
    delete(id: number): Promise<void>;
    updateStatusBulk(codes: string[], status: string): Promise<void>;
    markMissingIfCurrentlyAvailable(codes: string[]): Promise<void>;
    getAllCodes(): Promise<string[]>;
}
declare const _default: ToolRepository;
export default _default;
//# sourceMappingURL=tool.repository.d.ts.map