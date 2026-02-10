// Upload Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MediaUpload } from '../../types/domain';

export interface UploadState {
  uploads: MediaUpload[];
  currentUpload: MediaUpload | null;
  isLoading: boolean;
  error: string | null;
  uploadProgress: number; // 0-100
  isUploading: boolean;
}

const initialState: UploadState = {
  uploads: [],
  currentUpload: null,
  isLoading: false,
  error: null,
  uploadProgress: 0,
  isUploading: false,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    // Initiate upload
    initiateUploadStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    initiateUploadSuccess: (state, action: PayloadAction<MediaUpload>) => {
      state.isLoading = false;
      state.currentUpload = action.payload;
    },
    initiateUploadFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Upload start
    uploadStart: (state) => {
      state.isUploading = true;
      state.uploadProgress = 0;
      state.error = null;
    },

    // Update progress
    updateProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = Math.min(action.payload, 100);
    },

    // Complete upload
    uploadSuccess: (state, action: PayloadAction<MediaUpload>) => {
      state.isUploading = false;
      state.uploadProgress = 100;
      state.uploads.unshift(action.payload);
      state.currentUpload = action.payload;
    },

    // Upload failure
    uploadFailure: (state, action: PayloadAction<string>) => {
      state.isUploading = false;
      state.error = action.payload;
      state.uploadProgress = 0;
    },

    // Get upload history
    getHistoryStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getHistorySuccess: (state, action: PayloadAction<MediaUpload[]>) => {
      state.isLoading = false;
      state.uploads = action.payload;
    },
    getHistoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Cancel upload
    cancelUploadSuccess: (state) => {
      state.isUploading = false;
      state.uploadProgress = 0;
      state.currentUpload = null;
    },

    // Delete upload
    deleteUploadSuccess: (state, action: PayloadAction<string>) => {
      state.uploads = state.uploads.filter((u) => u.id !== action.payload);
    },

    // Clear
    clearCurrentUpload: (state) => {
      state.currentUpload = null;
      state.uploadProgress = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  initiateUploadStart,
  initiateUploadSuccess,
  initiateUploadFailure,
  uploadStart,
  updateProgress,
  uploadSuccess,
  uploadFailure,
  getHistoryStart,
  getHistorySuccess,
  getHistoryFailure,
  cancelUploadSuccess,
  deleteUploadSuccess,
  clearCurrentUpload,
  clearError,
} = uploadSlice.actions;

export default uploadSlice.reducer;
