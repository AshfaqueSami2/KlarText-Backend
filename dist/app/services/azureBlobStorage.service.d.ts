export declare class AzureBlobStorageService {
    private containerClient;
    private containerName;
    constructor();
    uploadAudioFile(buffer: Buffer, fileName: string): Promise<string>;
    deleteAudioFile(fileName: string): Promise<void>;
    private generateSasUrl;
    getAudioUrl(fileName: string): Promise<string>;
    downloadAudioFile(fileName: string): Promise<Buffer>;
    audioFileExists(fileName: string): Promise<boolean>;
    listAudioFiles(prefix?: string): Promise<string[]>;
    getStorageStats(): Promise<{
        totalFiles: number;
        totalSize: number;
        containerName: string;
    }>;
}
export declare const azureBlobService: AzureBlobStorageService;
//# sourceMappingURL=azureBlobStorage.service.d.ts.map