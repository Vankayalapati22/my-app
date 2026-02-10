// Upload Service Contracts
import { MediaUpload, ModerationResult } from '../../types/domain';
import {
  InitiateUploadRequest,
  InitiateUploadResponse,
  CompleteUploadRequest,
  CompleteUploadResponse,
  GetUploadHistoryResponse,
} from '../../types/dto';

export interface IUploadService {
  /**
   * Initiate media upload
   */
  initiateUpload(userId: string, request: InitiateUploadRequest): Promise<InitiateUploadResponse>;

  /**
   * Complete upload and process media
   */
  completeUpload(request: CompleteUploadRequest): Promise<CompleteUploadResponse>;

  /**
   * Cancel ongoing upload
   */
  cancelUpload(uploadId: string): Promise<void>;

  /**
   * Get upload status
   */
  getUploadStatus(uploadId: string): Promise<MediaUpload>;

  /**
   * Get user's upload history
   */
  getUploadHistory(userId: string, page?: number, pageSize?: number): Promise<GetUploadHistoryResponse>;

  /**
   * Update upload progress
   */
  updateUploadProgress(uploadId: string, progress: number): Promise<void>;

  /**
   * Get moderation result for upload
   */
  getModerationResult(uploadId: string): Promise<ModerationResult | null>;

  /**
   * Delete uploaded media
   */
  deleteUpload(uploadId: string): Promise<void>;
}
