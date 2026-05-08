import { IssueToolDTO, ReturnToolDTO } from '../dtos/transaction.dto';
export declare class TransactionService {
    issueTool(userId: number, data: IssueToolDTO): Promise<{
        id: number;
        toolId: number;
        userId: number;
        type: string;
        issuedTo: string | null;
        remarks: string | null;
        createdAt: Date;
        tool: {
            id: number;
            toolCode: string;
            name: string;
            category: string;
            location: any;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        };
        user: {
            name: string;
            email: string;
        };
    } | null>;
    returnTool(userId: number, data: ReturnToolDTO): Promise<{
        id: number;
        toolId: number;
        userId: number;
        type: string;
        issuedTo: string | null;
        remarks: string | null;
        createdAt: Date;
        tool: {
            id: number;
            toolCode: string;
            name: string;
            category: string;
            location: any;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        };
        user: {
            name: string;
            email: string;
        };
    } | null>;
    getTransactionHistory(params: {
        page: number;
        limit: number;
    }): Promise<{
        transactions: {
            id: number;
            toolId: number;
            userId: number;
            type: string;
            issuedTo: string | null;
            remarks: string | null;
            createdAt: Date;
            tool: {
                id: number;
                toolCode: string;
                name: string;
                category: string;
                location: any;
                status: string;
                createdAt: Date;
                updatedAt: Date;
            };
            user: {
                name: string;
                email: string;
            };
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
declare const _default: TransactionService;
export default _default;
//# sourceMappingURL=transaction.service.d.ts.map