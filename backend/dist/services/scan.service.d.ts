import { ScanInputDTO } from '../dtos/scan.dto';
export declare class ScanService {
    performScan(userId: number, data: ScanInputDTO): Promise<Record<string, unknown> | null>;
    getScanHistory(params: {
        page: number;
        limit: number;
    }): Promise<{
        scans: Record<string, unknown>[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
declare const _default: ScanService;
export default _default;
//# sourceMappingURL=scan.service.d.ts.map