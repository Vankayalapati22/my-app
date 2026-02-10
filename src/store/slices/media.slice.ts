// Media Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Media, Favorite, PlaylistAggregate } from '../../types/domain';

export interface MediaState {
  media: Media[];
  currentMedia: Media | null;
  isLoading: boolean;
  error: string | null;
  favorites: Favorite[];
  playlists: PlaylistAggregate[];
  totalItems: number;
  page: number;
  pageSize: number;
}

const initialState: MediaState = {
  media: [],
  currentMedia: null,
  isLoading: false,
  error: null,
  favorites: [],
  playlists: [],
  totalItems: 0,
  page: 1,
  pageSize: 10,
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    // Get media list
    getMediaStart: (state: MediaState) => {
      state.isLoading = true;
      state.error = null;
    },
    getMediaSuccess: (
      state: MediaState,
      action: PayloadAction<{
        data: Media[];
        total: number;
        page: number;
        pageSize: number;
      }>
    ) => {
      state.isLoading = false;
      state.media = action.payload.data;
      state.totalItems = action.payload.total;
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
    },
    getMediaFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get media by ID
    getMediaByIdStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getMediaByIdSuccess: (state, action: PayloadAction<Media>) => {
      state.isLoading = false;
      state.currentMedia = action.payload;
    },
    getMediaByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Favorites
    addToFavoritesSuccess: (state, action: PayloadAction<Favorite>) => {
      state.favorites.push(action.payload);
    },
    removeFromFavoritesSuccess: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((f) => f.id !== action.payload);
    },
    setFavorites: (state, action: PayloadAction<Favorite[]>) => {
      state.favorites = action.payload;
    },

    // Playlists
    addPlaylistSuccess: (state, action: PayloadAction<PlaylistAggregate>) => {
      state.playlists.push(action.payload);
    },
    updatePlaylistSuccess: (state, action: PayloadAction<PlaylistAggregate>) => {
      const index = state.playlists.findIndex((p) => p.id === action.payload.id);
      if (index > -1) {
        state.playlists[index] = action.payload;
      }
    },
    removePlaylistSuccess: (state, action: PayloadAction<string>) => {
      state.playlists = state.playlists.filter((p) => p.id !== action.payload);
    },
    setPlaylists: (state, action: PayloadAction<PlaylistAggregate[]>) => {
      state.playlists = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear current media
    clearCurrentMedia: (state) => {
      state.currentMedia = null;
    },
  },
});

export const {
  getMediaStart,
  getMediaSuccess,
  getMediaFailure,
  getMediaByIdStart,
  getMediaByIdSuccess,
  getMediaByIdFailure,
  addToFavoritesSuccess,
  removeFromFavoritesSuccess,
  setFavorites,
  addPlaylistSuccess,
  updatePlaylistSuccess,
  removePlaylistSuccess,
  setPlaylists,
  clearError,
  clearCurrentMedia,
} = mediaSlice.actions;

export default mediaSlice.reducer;
