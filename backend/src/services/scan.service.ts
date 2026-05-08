import scanRepository from '../repositories/scan.repository';
import toolRepository from '../repositories/tool.repository';
import { ScanInputDTO } from '../dtos/scan.dto';

export class ScanService {
  async performScan(userId: number, data: ScanInputDTO) {
    const { scannedIds } = data;
    const allInventoryCodes = await toolRepository.getAllCodes();

    const scannedSet = new Set(scannedIds);
    const inventorySet = new Set(allInventoryCodes);

    const matchedTools = scannedIds.filter((id) => inventorySet.has(id));
    const extraTools = scannedIds.filter((id) => !inventorySet.has(id));
    
    // Find missing tools (in DB but not scanned)
    const missingTools = allInventoryCodes.filter((id) => !scannedSet.has(id));

    // Update status to MISSING only for tools that WERE available but were NOT scanned
    // This avoids marking "ISSUED" tools as "MISSING" if they are just out in the field
    if (missingTools.length > 0) {
      await toolRepository.markMissingIfCurrentlyAvailable(missingTools);
    }

    const result = {
      userId,
      scannedIds,
      matchedTools,
      missingTools,
      extraTools,
      totalScanned: scannedIds.length,
      totalMatched: matchedTools.length,
      totalMissing: missingTools.length,
      totalExtra: extraTools.length,
    };

    return scanRepository.create(result);
  }

  async getScanHistory(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [scans, total] = await Promise.all([
      scanRepository.findAll({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      scanRepository.count(),
    ]);

    return {
      scans,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}

export default new ScanService();
