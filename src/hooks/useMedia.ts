// Media Hooks
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { RootState, AppDispatch } from '@store/index';
import {
  getMediaStart,
  getMediaSuccess,
  getMediaFailure,
  getMediaByIdStart,
  getMediaByIdSuccess,
  getMediaByIdFailure,
  addToFavoritesSuccess,
  removeFromFavoritesSuccess,
  setFavorites,

  clearCurrentMedia,
} from '@store/slices/media.slice';
import { mediaService } from '@services/media';
import type { GetMediaListRequest, SearchRequest } from '../types/dto';

export function useMedia() {
  const dispatch = useDispatch<AppDispatch>();
  const media = useSelector((state: RootState) => state.media);

  // Get media list
  const getMediaList = useCallback(
    async (request: GetMediaListRequest) => {
      dispatch(getMediaStart());
      try {
        const result = await mediaService.getMediaList(request);
        dispatch(
          getMediaSuccess({
            data: result.data,
            total: result.pagination.total,
            page: result.pagination.page,
            pageSize: result.pagination.pageSize,
          })
        );
        return { success: true, data: result.data };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch media';
        dispatch(getMediaFailure(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Get media by ID
  const getMediaById = useCallback(
    async (mediaId: string) => {
      dispatch(getMediaByIdStart());
      try {
        const media = await mediaService.getMediaById(mediaId);
        dispatch(getMediaByIdSuccess(media));
        return { success: true, data: media };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch media';
        dispatch(getMediaByIdFailure(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Search media
  const searchMedia = useCallback(
    async (request: SearchRequest) => {
      dispatch(getMediaStart());
      try {
        const result = await mediaService.searchMedia(request);
        dispatch(
          getMediaSuccess({
            data: result.results,
            total: result.pagination.total,
            page: result.pagination.page,
            pageSize: result.pagination.pageSize,
          })
        );
        return { success: true, data: result.results };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Search failed';
        dispatch(getMediaFailure(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Get trending
  const getTrendingMedia = useCallback(
    async (limit?: number) => {
      dispatch(getMediaStart());
      try {
        const trending = await mediaService.getTrendingMedia(limit);
        dispatch(
          getMediaSuccess({
            data: trending,
            total: trending.length,
            page: 1,
            pageSize: limit || 10,
          })
        );
        return { success: true, data: trending };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch trending';
        dispatch(getMediaFailure(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Get recommended
  const getRecommended = useCallback(
    async (userId: string, limit?: number) => {
      dispatch(getMediaStart());
      try {
        const recommended = await mediaService.getRecommendedMedia(userId, limit);
        dispatch(
          getMediaSuccess({
            data: recommended,
            total: recommended.length,
            page: 1,
            pageSize: limit || 10,
          })
        );
        return { success: true, data: recommended };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch recommendations';
        dispatch(getMediaFailure(message));
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Add to favorites
  const addToFavorites = useCallback(
    async (userId: string, mediaId: string) => {
      try {
        const favorite = await mediaService.addToFavorites(userId, mediaId);
        dispatch(addToFavoritesSuccess(favorite));
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to add to favorites';
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Remove from favorites
  const removeFromFavorites = useCallback(
    async (userId: string, mediaId: string) => {
      try {
        await mediaService.removeFromFavorites(userId, mediaId);
        dispatch(removeFromFavoritesSuccess(mediaId));
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to remove favorite';
        return { success: false, error: message };
      }
    },
    [dispatch]
  );

  // Load favorites
  const loadFavorites = useCallback(
    async (userId: string) => {
      try {
        const favorites = await mediaService.getFavorites(userId);
        dispatch(setFavorites(favorites));
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    },
    [dispatch]
  );

  // Clear current media
  const clearCurrent = useCallback(() => {
    dispatch(clearCurrentMedia());
  }, [dispatch]);

  return {
    ...media,
    getMediaList,
    getMediaById,
    searchMedia,
    getTrendingMedia,
    getRecommended,
    addToFavorites,
    removeFromFavorites,
    loadFavorites,
    clearCurrent,
  };
}

export function useMediaPlayer(mediaId: string) {
  const { getMediaById } = useMedia();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getMediaById(mediaId).finally(() => setIsLoading(false));
  }, [mediaId, getMediaById]);

  return { isLoading };
}

