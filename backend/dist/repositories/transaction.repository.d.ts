export declare class TransactionRepository {
    create(data: {
        toolId: number;
        userId: number;
        type: string;
        issuedTo?: string;
        remarks?: string;
    }): Promise<{
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
    private findById;
    findAll(params: {
        skip?: number;
        take?: number;
        where?: any;
        orderBy?: any;
    }): Promise<{
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
    }[]>;
    count(_where?: any): Promise<number>;
    findLatestByToolId(toolId: number): Promise<{
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
}
declare const _default: TransactionRepository;
export default _default;
//# sourceMappingURL=transaction.repository.d.ts.map