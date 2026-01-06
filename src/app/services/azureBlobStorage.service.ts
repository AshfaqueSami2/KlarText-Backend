import { BlobServiceClient, ContainerClient, BlockBlobClient, BlobSASPermissions } from '@azure/storage-blob';
import config from '../config';
import AppError from '../Error/AppError';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';

export class AzureBlobStorageService {
  private containerClient: ContainerClient;
  private containerName: string;

  constructor() {
    if (!config.azure.blob.connectionString) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Azure Blob Storage connection string is required'
      );
    }

    this.containerName = config.azure.blob.container || 'lessonaudio';
    
    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        config.azure.blob.connectionString
      );
      this.containerClient = blobServiceClient.getContainerClient(this.containerName);
    } catch (error) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to initialize Azure Blob Storage: ${error}`
      );
    }
  }

  /**
   * Upload audio buffer to Azure Blob Storage
   * @param buffer Audio file buffer
   * @param fileName Name for the blob file
   * @returns SAS URL of the uploaded blob (valid for 1 year)
   */
  async uploadAudioFile(buffer: Buffer, fileName: string): Promise<string> {
    try {
      // Ensure container exists (private by default - no access level specified)
      await this.containerClient.createIfNotExists();

      const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(fileName);
      
      // Upload the buffer normally (private container)
      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: {
          blobContentType: 'audio/mpeg',
          blobCacheControl: 'public, max-age=31536000' // Cache for 1 year
        },
        metadata: {
          uploadedAt: new Date().toISOString(),
          source: 'azure-tts',
          container: this.containerName
        }
      });

      // Generate SAS URL for secure temporary access (valid for 1 year)
      const sasUrl = await this.generateSasUrl(fileName);
      return sasUrl;
    } catch (error) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to upload audio to blob storage: ${error}`
      );
    }
  }

  /**
   * Delete audio file from Azure Blob Storage
   * @param fileName Name of the blob file to delete
   */
  async deleteAudioFile(fileName: string): Promise<void> {
    try {
      const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(fileName);
      await blockBlobClient.deleteIfExists();
      logger.debug('Audio file deleted from blob storage', { fileName });
    } catch (error) {
      logger.error('Failed to delete audio file', { fileName, error });
      // Don't throw error for delete operations - log and continue
    }
  }

  /**
   * Generate SAS URL for secure access to blob
   * @param fileName Name of the blob file
   * @returns SAS URL valid for 1 year
   */
  private async generateSasUrl(fileName: string): Promise<string> {
    try {
      const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(fileName);
      
      // Generate SAS token valid for 1 year
      const expiresOn = new Date();
      expiresOn.setFullYear(expiresOn.getFullYear() + 1);
      
      const permissions = new BlobSASPermissions();
      permissions.read = true;
      
      const sasUrl = await blockBlobClient.generateSasUrl({
        permissions: permissions,
        expiresOn: expiresOn
      });
      
      return sasUrl;
    } catch (error) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to generate SAS URL: ${error}`
      );
    }
  }

  /**
   * Get SAS URL for audio file
   * @param fileName Name of the blob file
   * @returns SAS URL of the blob
   */
  async getAudioUrl(fileName: string): Promise<string> {
    try {
      return await this.generateSasUrl(fileName);
    } catch (error) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        `Failed to get audio URL: ${error}`
      );
    }
  }

  /**
   * Download audio file as buffer (for backend streaming to client)
   * @param fileName Name of the blob file
   * @returns Buffer containing audio data
   */
  async downloadAudioFile(fileName: string): Promise<Buffer> {
    try {
      const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(fileName);
      const downloadResponse = await blockBlobClient.download();
      
      if (!downloadResponse.readableStreamBody) {
        throw new Error('No readable stream available');
      }

      const chunks: Buffer[] = [];
      for await (const chunk of downloadResponse.readableStreamBody) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        `Failed to download audio file: ${error}`
      );
    }
  }

  /**
   * Check if audio file exists in blob storage
   * @param fileName Name of the blob file
   * @returns Boolean indicating if file exists
   */
  async audioFileExists(fileName: string): Promise<boolean> {
    try {
      const blockBlobClient: BlockBlobClient = this.containerClient.getBlockBlobClient(fileName);
      const exists = await blockBlobClient.exists();
      return exists;
    } catch (error) {
      logger.error('Error checking if file exists', { fileName, error });
      return false;
    }
  }

  /**
   * List all audio files in the container
   * @param prefix Optional prefix to filter files
   * @returns Array of blob names
   */
  async listAudioFiles(prefix?: string): Promise<string[]> {
    try {
      const fileNames: string[] = [];
      const listOptions = prefix ? { prefix } : {};
      
      for await (const blob of this.containerClient.listBlobsFlat(listOptions)) {
        fileNames.push(blob.name);
      }
      
      return fileNames;
    } catch (error) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to list audio files: ${error}`
      );
    }
  }

  /**
   * Get blob storage statistics
   * @returns Object with container statistics
   */
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    containerName: string;
  }> {
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
    } catch (error) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to get storage stats: ${error}`
      );
    }
  }
}

// Export singleton instance
export const azureBlobService = new AzureBlobStorageService();