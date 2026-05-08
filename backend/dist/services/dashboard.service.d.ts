export declare class DashboardService {
    getStats(): Promise<{
        totalTools: number;
        availableTools: number;
        issuedTools: number;
        missingTools: number;
        recentTransactions: {
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
        latestScan: Record<string, unknown> | null;
    }>;
}
declare const _default: DashboardService;
export default _default;
//# sourceMappingURL=dashboard.service.d.ts.map