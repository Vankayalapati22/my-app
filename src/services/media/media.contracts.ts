// Media Service Contracts
import { Media, Category, PlaylistAggregate, Favorite } from '../../types/domain';
import { GetMediaListRequest, GetMediaResponse, CreateMediaRequest, UpdateMediaRequest, SearchRequest, SearchResponse } from '../../types/dto';

export interface IMediaService {
  /**
   * Get paginated list of media
   */
  getMediaList(request: GetMediaListRequest): Promise<GetMediaResponse>;

  /**
   * Get single media by ID
   */
  getMediaById(mediaId: string): Promise<Media>;

  /**
   * Get all categories
   */
  getCategories(): Promise<Category[]>;

  /**
   * Get category by ID
   */
  getCategoryById(categoryId: string): Promise<Category>;

  /**
   * Create new media (requires auth)
   */
  createMedia(data: CreateMediaRequest): Promise<Media>;

  /**
   * Update media details
   */
  updateMedia(mediaId: string, data: UpdateMediaRequest): Promise<Media>;

  /**
   * Delete media
   */
  deleteMedia(mediaId: string): Promise<void>;

  /**
   * Search media with filters
   */
  searchMedia(request: SearchRequest): Promise<SearchResponse>;

  /**
   * Get trending media
   */
  getTrendingMedia(limit?: number): Promise<Media[]>;

  /**
   * Get recommended media for user
   */
  getRecommendedMedia(userId: string, limit?: number): Promise<Media[]>;

  /**
   * Add media to favorites
   */
  addToFavorites(userId: string, mediaId: string): Promise<Favorite>;

  /**
   * Remove from favorites
   */
  removeFromFavorites(userId: string, mediaId: string): Promise<void>;

  /**
   * Get user's favorites
   */
  getFavorites(userId: string): Promise<Favorite[]>;

  /**
   * Increment view count for media
   */
  incrementViewCount(mediaId: string): Promise<void>;

  /**
   * Rate media
   */
  rateMedia(userId: string, mediaId: string, rating: number): Promise<Media>;

  /**
   * Create playlist
   */
  createPlaylist(userId: string, name: string, description: string): Promise<PlaylistAggregate>;

  /**
   * Add media to playlist
   */
  addToPlaylist(playlistId: string, mediaId: string): Promise<PlaylistAggregate>;

  /**
   * Remove media from playlist
   */
  removeFromPlaylist(playlistId: string, mediaId: string): Promise<PlaylistAggregate>;

  /**
   * Get user playlists
   */
  getUserPlaylists(userId: string): Promise<PlaylistAggregate[]>;

  /**
   * Get playlist by ID
   */
  getPlaylistById(playlistId: string): Promise<PlaylistAggregate>;
}
