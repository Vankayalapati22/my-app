// Upload Hooks
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '@store/index';
import {
  uploadStart,
  updateProgress,
  uploadSuccess,
  uploadFailure,
  getHistoryStart,
  getHistorySuccess,
  getHistoryFailure,
  cancelUploadSuccess,
  clearCurrentUpload,
  clearError,
} from '@store/slices/upload.slice';
import { uploadService } from '@services/upload';
import type { InitiateUploadRequest } from '../types/dto';

export function useUpload() {
  const dispatch = useDispatch<AppDispatch>();
  const upload = useSelector((state: RootState) => state.upload);

  // Initiate upload
  const initiateUpload = useCallback(
    async (userId: string, request: InitiateUploadRequest) => {
      try {
        const result = await uploadService.initiateUpload(userId, request);
        return { success: true, data: result };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to initiate upload';
        return { success: false, error: message };
      }
    },
    []
  );

  // Upload file
  const uploadFile = useCallback(
    async (uploadId: string, _file: File, onProgress?: (progress: number) => void) => {
      dispatch(uploadStart());
      try {
        // Simulate file upload with progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress > 90) progress = 90;
          dispatch(updateProgress(progress));
          onProgress?.(progress);
        }, 300);

        // Simulate upload completion
        await new Promise((resolve) => setTimeout(resolve, 2000));
        clearInterval(interval);

        // Complete upload
        const result = await uploadService.completeUpload({
          uploadId,
          uploadToken: `token_${uploadId}`,
        });

        dispatch(uploadSuccess(result.upload));
        dispatch(updateProgress(100));
        onProgress?.(100);

        return { success: true, data: result.media };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed';
        dispatch(uploadFailure(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Get upload history
  const getUploadHistory = useCallback(
    async (userId: string, page?: number, pageSize?: number) => {
      dispatch(getHistoryStart());
      try {
        const result = await uploadService.getUploadHistory(userId, page, pageSize);
        dispatch(getHistorySuccess(result.uploads));
        return { success: true, data: result.uploads };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch upload history';
        dispatch(getHistoryFailure(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Cancel upload
  const cancelUpload = useCallback(
    async (uploadId: string) => {
      try {
        await uploadService.cancelUpload(uploadId);
        dispatch(cancelUploadSuccess());
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to cancel upload';
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Clear
  const clear = useCallback(() => {
    dispatch(clearCurrentUpload());
  }, [dispatch]);

  const clearUploadError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...(upload as unknown as Record<string, unknown>),
    initiateUpload,
    uploadFile,
    getUploadHistory,
    cancelUpload,
    clear,
    clearError: clearUploadError,
  };
}
