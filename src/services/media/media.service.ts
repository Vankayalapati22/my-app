// Media Service Implementation using Mock Data
import { IMediaService } from './media.contracts';
import { Media, Category, PlaylistAggregate, Favorite } from '../../types/domain';
import { GetMediaListRequest, GetMediaResponse, CreateMediaRequest, UpdateMediaRequest, SearchRequest, SearchResponse } from '../../types/dto';
import { MOCK_MEDIA, MOCK_CATEGORIES } from '@mock/media';

class MediaService implements IMediaService {
  private playlists: Map<string, PlaylistAggregate> = new Map();
  private favorites: Map<string, Set<string>> = new Map(); // userId -> Set<mediaId>
  private ratings: Map<string, number> = new Map(); // mediaId -> rating

  async getMediaList(request: GetMediaListRequest): Promise<GetMediaResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...MOCK_MEDIA];

    // Filter by type
    if (request.type) {
      filtered = filtered.filter((m) => m.type === request.type);
    }

    // Filter by genre
    if (request.genre) {
      filtered = filtered.filter((m) => m.genre.includes(request.genre!));
    }

    // Search
    if (request.search) {
      const q = request.search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.artist?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (request.sortBy) {
      filtered.sort((a, b) => {
        let aVal: number = 0;
        let bVal: number = 0;

        switch (request.sortBy) {
          case 'date':
            aVal = a.uploadedAt.getTime();
            bVal = b.uploadedAt.getTime();
            break;
          case 'views':
            aVal = a.totalViews;
            bVal = b.totalViews;
            break;
          case 'rating':
            aVal = a.rating;
            bVal = b.rating;
            break;
          default:
            return 0;
        }

        return bVal - aVal;
      });
    }

    // Paginate
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filtered.slice(start, end);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / pageSize),
      },
    };
  }

  async getMediaById(mediaId: string): Promise<Media> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const media = MOCK_MEDIA.find((m) => m.id === mediaId);
    if (!media) {
      throw new Error(`Media ${mediaId} not found`);
    }

    return media;
  }

  async getCategories(): Promise<Category[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_CATEGORIES;
  }

  async getCategoryById(categoryId: string): Promise<Category> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const category = MOCK_CATEGORIES.find((c) => c.id === categoryId);
    if (!category) {
      throw new Error(`Category ${categoryId} not found`);
    }

    return category;
  }

  async createMedia(data: CreateMediaRequest): Promise<Media> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const media: Media = {
      id: `media-${Date.now()}`,
      title: data.title,
      description: data.description,
      type: data.type,
      artist: data.artist,
      director: data.director,
      genre: data.genre,
      duration: data.duration,
      releaseDate: new Date(data.releaseDate),
      thumbnailUrl: '',
      rating: 0,
      totalViews: 0,
      isExplicit: data.isExplicit,
      isApproved: false, // Requires admin approval
      uploadedBy: 'current-user', // In real app, from auth context
      uploadedAt: new Date(),
      quality: [],
    };

    MOCK_MEDIA.push(media);
    return media;
  }

  async updateMedia(mediaId: string, data: UpdateMediaRequest): Promise<Media> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const media = MOCK_MEDIA.find((m) => m.id === mediaId);
    if (!media) {
      throw new Error(`Media ${mediaId} not found`);
    }

    if (data.title) media.title = data.title;
    if (data.description) media.description = data.description;
    if (data.genre) media.genre = data.genre;
    if (typeof data.isExplicit === 'boolean') media.isExplicit = data.isExplicit;

    return media;
  }

  async deleteMedia(mediaId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = MOCK_MEDIA.findIndex((m) => m.id === mediaId);
    if (index === -1) {
      throw new Error(`Media ${mediaId} not found`);
    }

    MOCK_MEDIA.splice(index, 1);
  }

  async searchMedia(request: SearchRequest): Promise<SearchResponse> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const startTime = Date.now();

    let results = [...MOCK_MEDIA];

    // Filter by type
    if (request.type && request.type !== 'artist' && request.type !== 'category') {
      results = results.filter((m) => m.type === request.type);
    }

    // Filter by genre
    if (request.filters?.genre) {
      results = results.filter((m) => m.genre.some((g) => request.filters?.genre?.includes(g)));
    }

    // Filter by rating
    if (request.filters?.rating) {
      results = results.filter(
        (m) => m.rating >= request.filters!.rating!.min && m.rating <= request.filters!.rating!.max
      );
    }

    // Search query
    const q = request.query.toLowerCase();
    results = results.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.artist?.toLowerCase().includes(q) ||
        m.genre.some((g) => g.toLowerCase().includes(q))
    );

    // Paginate
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = results.slice(start, end);

    const executionTime = Date.now() - startTime;

    return {
      results: data,
      pagination: {
        page,
        pageSize,
        total: results.length,
        totalPages: Math.ceil(results.length / pageSize),
      },
      executionTime,
    };
  }

  async getTrendingMedia(limit: number = 10): Promise<Media[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return MOCK_MEDIA.sort((a, b) => b.totalViews - a.totalViews).slice(0, limit);
  }

  async getRecommendedMedia(_userId: string, limit: number = 10): Promise<Media[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Simple recommendation: sort by rating and views
    return MOCK_MEDIA.sort((a, b) => {
      const aScore = a.rating * a.totalViews;
      const bScore = b.rating * b.totalViews;
      return bScore - aScore;
    }).slice(0, limit);
  }

  async addToFavorites(userId: string, mediaId: string): Promise<Favorite> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const media = await this.getMediaById(mediaId);

    if (!this.favorites.has(userId)) {
      this.favorites.set(userId, new Set());
    }

    this.favorites.get(userId)!.add(mediaId);

    return {
      id: `fav-${Date.now()}`,
      userId,
      mediaId,
      mediaType: media.type,
      createdAt: new Date(),
    };
  }

  async removeFromFavorites(userId: string, mediaId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (this.favorites.has(userId)) {
      this.favorites.get(userId)!.delete(mediaId);
    }
  }

  async getFavorites(userId: string): Promise<Favorite[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const mediaIds = this.favorites.get(userId) || new Set();

    return Array.from(mediaIds).map((mediaId) => {
      const media = MOCK_MEDIA.find((m) => m.id === mediaId)!;
      return {
        id: `fav-${mediaId}`,
        userId,
        mediaId,
        mediaType: media.type,
        createdAt: new Date(),
      };
    });
  }

  async incrementViewCount(mediaId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const media = MOCK_MEDIA.find((m) => m.id === mediaId);
    if (media) {
      media.totalViews += 1;
    }
  }

  async rateMedia(userId: string, mediaId: string, rating: number): Promise<Media> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (rating < 0 || rating > 5) {
      throw new Error('Rating must be between 0 and 5');
    }

    const media = await this.getMediaById(mediaId);

    // Store rating (in real app, associated with user)
    this.ratings.set(`${userId}-${mediaId}`, rating);

    // Update average rating
    const allRatings = Array.from(this.ratings.values());
    if (allRatings.length > 0) {
      const avg = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
      media.rating = Math.round(avg * 10) / 10;
    }

    return media;
  }

  async createPlaylist(userId: string, name: string, description: string): Promise<PlaylistAggregate> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const playlist: PlaylistAggregate = {
      id: `playlist-${Date.now()}`,
      userId,
      name,
      description,
      isPublic: false,
      mediaIds: [],
      totalDuration: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.playlists.set(playlist.id, playlist);
    return playlist;
  }

  async addToPlaylist(playlistId: string, mediaId: string): Promise<PlaylistAggregate> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const playlist = this.playlists.get(playlistId);
    if (!playlist) {
      throw new Error(`Playlist ${playlistId} not found`);
    }

    const media = await this.getMediaById(mediaId);

    if (!playlist.mediaIds.includes(mediaId)) {
      playlist.mediaIds.push(mediaId);
      playlist.totalDuration += media.duration;
      playlist.updatedAt = new Date();
    }

    return playlist;
  }

  async removeFromPlaylist(playlistId: string, mediaId: string): Promise<PlaylistAggregate> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const playlist = this.playlists.get(playlistId);
    if (!playlist) {
      throw new Error(`Playlist ${playlistId} not found`);
    }

    const index = playlist.mediaIds.indexOf(mediaId);
    if (index > -1) {
      playlist.mediaIds.splice(index, 1);
      const media = await this.getMediaById(mediaId);
      playlist.totalDuration -= media.duration;
      playlist.updatedAt = new Date();
    }

    return playlist;
  }

  async getUserPlaylists(userId: string): Promise<PlaylistAggregate[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return Array.from(this.playlists.values()).filter((p) => p.userId === userId);
  }

  async getPlaylistById(playlistId: string): Promise<PlaylistAggregate> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const playlist = this.playlists.get(playlistId);
    if (!playlist) {
      throw new Error(`Playlist ${playlistId} not found`);
    }

    return playlist;
  }
}

export const mediaService = new MediaService();
