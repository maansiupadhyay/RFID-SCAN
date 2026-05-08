export declare class ScanRepository {
    private mapScanRow;
    create(data: {
        userId: number;
        scannedIds: unknown;
        matchedTools: unknown;
        missingTools: unknown;
        extraTools: unknown;
        totalScanned: number;
        totalMatched: number;
        totalMissing: number;
        totalExtra: number;
    }): Promise<Record<string, unknown> | null>;
    private findById;
    findAll(params: {
        skip?: number;
        take?: number;
        orderBy?: any;
    }): Promise<Record<string, unknown>[]>;
    count(): Promise<number>;
    findLatest(): Promise<Record<string, unknown> | null>;
}
declare const _default: ScanRepository;
export default _default;
//# sourceMappingURL=scan.repository.d.ts.map