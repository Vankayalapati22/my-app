// Upload Service Implementation
import { IUploadService } from './upload.contracts';
import { MediaUpload, ModerationResult } from '../../types/domain';
import {
  InitiateUploadRequest,
  InitiateUploadResponse,
  CompleteUploadRequest,
  CompleteUploadResponse,
  GetUploadHistoryResponse,
} from '../../types/dto';
import { MOCK_UPLOADS } from '../../mock/uploads';
import { MOCK_MEDIA } from '@mock/media';

class UploadService implements IUploadService {
  private uploads: Map<string, MediaUpload> = new Map();
  private moderations: Map<string, ModerationResult> = new Map();

  constructor() {
    // Initialize with mock uploads
    MOCK_UPLOADS.forEach((u) => {
      this.uploads.set(u.id, { ...u });
    });
  }

  async initiateUpload(userId: string, request: InitiateUploadRequest): Promise<InitiateUploadResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const uploadId = `upload-${Date.now()}`;
    const uploadToken = `token_${Date.now()}`;

    // Create upload record
    const upload: MediaUpload = {
      id: uploadId,
      userId,
      fileName: request.fileName,
      fileSize: request.fileSize,
      status: 'uploaded',
      uploadProgress: 0,
      metadata: request.metadata,
      uploadedAt: new Date(),
    };

    this.uploads.set(uploadId, upload);

    return {
      uploadId,
      uploadUrl: `https://api.example.com/uploads/${uploadId}`,
      uploadToken,
    };
  }

  async completeUpload(request: CompleteUploadRequest): Promise<CompleteUploadResponse> {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate processing

    const upload = this.uploads.get(request.uploadId);
    if (!upload) {
      throw new Error(`Upload ${request.uploadId} not found`);
    }

    upload.status = 'processing';
    upload.uploadProgress = 100;

    // Simulate moderation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    upload.status = 'approved';
    upload.processedAt = new Date();

    // Create media from upload
    const media = MOCK_MEDIA.find((m) => m.uploadedBy === upload.userId);

    if (!media) {
      throw new Error('Failed to create media');
    }

    upload.mediaId = media.id;

    // Create moderation result
    const moderation: ModerationResult = {
      id: `mod-${Date.now()}`,
      uploadId: request.uploadId,
      status: 'approved',
      reviewedAt: new Date(),
      flags: [],
    };

    this.moderations.set(request.uploadId, moderation);

    return {
      media,
      upload,
    };
  }

  async cancelUpload(uploadId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const upload = this.uploads.get(uploadId);
    if (!upload) {
      throw new Error(`Upload ${uploadId} not found`);
    }

    if (upload.status === 'processing' || upload.status === 'approved') {
      throw new Error('Cannot cancel completed upload');
    }

    this.uploads.delete(uploadId);
  }

  async getUploadStatus(uploadId: string): Promise<MediaUpload> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const upload = this.uploads.get(uploadId);
    if (!upload) {
      throw new Error(`Upload ${uploadId} not found`);
    }

    return upload;
  }

  async getUploadHistory(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<GetUploadHistoryResponse> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const userUploads = Array.from(this.uploads.values()).filter((u) => u.userId === userId);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const uploads = userUploads.slice(start, end);

    return {
      uploads,
      pagination: {
        page,
        pageSize,
        total: userUploads.length,
        totalPages: Math.ceil(userUploads.length / pageSize),
      },
    };
  }

  async updateUploadProgress(uploadId: string, progress: number): Promise<void> {
    const upload = this.uploads.get(uploadId);
    if (!upload) {
      throw new Error(`Upload ${uploadId} not found`);
    }

    upload.uploadProgress = Math.min(progress, 100);
  }

  async getModerationResult(uploadId: string): Promise<ModerationResult | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.moderations.get(uploadId) || null;
  }

  async deleteUpload(uploadId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const upload = this.uploads.get(uploadId);
    if (!upload) {
      throw new Error(`Upload ${uploadId} not found`);
    }

    // Delete associated media
    if (upload.mediaId) {
      const index = MOCK_MEDIA.findIndex((m) => m.id === upload.mediaId);
      if (index > -1) {
        MOCK_MEDIA.splice(index, 1);
      }
    }

    this.uploads.delete(uploadId);
    this.moderations.delete(uploadId);
  }
}

export const uploadService = new UploadService();
