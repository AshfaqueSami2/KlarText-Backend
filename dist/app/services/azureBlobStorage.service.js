"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.azureBlobService = exports.AzureBlobStorageService = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../Error/AppError"));
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
class AzureBlobStorageService {
    constructor() {
        if (!config_1.default.azure.blob.connectionString) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Azure Blob Storage connection string is required');
        }
        this.containerName = config_1.default.azure.blob.container || 'lessonaudio';
        try {
            const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(config_1.default.azure.blob.connectionString);
            this.containerClient = blobServiceClient.getContainerClient(this.containerName);
        }
        catch (error) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Failed to initialize Azure Blob Storage: ${error}`);
        }
    }
    async uploadAudioFile(buffer, fileName) {
        try {
            await this.containerClient.createIfNotExists();
            const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
            await blockBlobClient.uploadData(buffer, {
                blobHTTPHeaders: {
                    blobContentType: 'audio/mpeg',
                    blobCacheControl: 'public, max-age=31536000'
                },
                metadata: {
                    uploadedAt: new Date().toISOString(),
                    source: 'azure-tts',
                    container: this.containerName
                }
            });
            const sasUrl = await this.generateSasUrl(fileName);
            return sasUrl;
        }
        catch (error) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Failed to upload audio to blob storage: ${error}`);
        }
    }
    async deleteAudioFile(fileName) {
        try {
            const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
            await blockBlobClient.deleteIfExists();
            logger_1.default.debug('Audio file deleted from blob storage', { fileName });
        }
        catch (error) {
            logger_1.default.error('Failed to delete audio file', { fileName, error });
        }
    }
    async generateSasUrl(fileName) {
        try {
            const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
            const expiresOn = new Date();
            expiresOn.setFullYear(expiresOn.getFullYear() + 1);
            const permissions = new storage_blob_1.BlobSASPermissions();
            permissions.read = true;
            const sasUrl = await blockBlobClient.generateSasUrl({
                permissions: permissions,
                expiresOn: expiresOn
            });
            return sasUrl;
        }
        catch (error) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Failed to generate SAS URL: ${error}`);
        }
    }
    async getAudioUrl(fileName) {
        try {
            return await this.generateSasUrl(fileName);
        }
        catch (error) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, `Failed to get audio URL: ${error}`);
        }
    }
    async downloadAudioFile(fileName) {
        try {
            const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
            const downloadResponse = await blockBlobClient.download();
            if (!downloadResponse.readableStreamBody) {
                throw new Error('No readable stream available');
            }
            const chunks = [];
            for await (const chunk of downloadResponse.readableStreamBody) {
                chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            return Buffer.concat(chunks);
        }
        catch (error) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, `Failed to download audio file: ${error}`);
        }
    }
    async audioFileExists(fileName) {
        try {
            const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
            const exists = await blockBlobClient.exists();
            return exists;
        }
        catch (error) {
            logger_1.default.error('Error checking if file exists', { fileName, error });
            return false;
        }
    }
    async listAudioFiles(prefix) {
        try {
            const fileNames = [];
            const listOptions = prefix ? { prefix } : {};
            for await (const blob of this.containerClient.listBlobsFlat(listOptions)) {
                fileNames.push(blob.name);
            }
            return fileNames;
        }
        catch (error) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Failed to list audio files: ${error}`);
        }
    }
    async getStorageStats() {
        try {
            let totalFiles = 0;
            let totalSize = 0;
            for await (const blob of this.containerClient.listBlobsFlat()) {
                totalFiles++;
                totalSize += blob.properties.contentLength || 0;
            }
            return {
                totalFiles,
                totalSize,
                containerName: this.containerName
            };
        }
        catch (error) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Failed to get storage stats: ${error}`);
        }
    }
}
exports.AzureBlobStorageService = AzureBlobStorageService;
exports.azureBlobService = new AzureBlobStorageService();
//# sourceMappingURL=azureBlobStorage.service.js.map