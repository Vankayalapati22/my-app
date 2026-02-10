// Streaming Service Contracts
import { StreamingSession, ViewingHistory } from '../../types/domain';
import { StartStreamRequest, StartStreamResponse, UpdateStreamProgressRequest, EndStreamRequest } from '../../types/dto';

export interface IStreamingService {
  /**
   * Start streaming media
   */
  startStream(request: StartStreamRequest): Promise<StartStreamResponse>;

  /**
   * Update stream progress
   */
  updateStreamProgress(
    sessionId: string,
    request: UpdateStreamProgressRequest
  ): Promise<void>;

  /**
   * End streaming session
   */
  endStream(sessionId: string, request: EndStreamRequest): Promise<void>;

  /**
   * Get current stream status
   */
  getStreamStatus(sessionId: string): Promise<StreamingSession | null>;

  /**
   * Get viewing history for user
   */
  getViewingHistory(userId: string, page?: number, pageSize?: number): Promise<ViewingHistory[]>;

  /**
   * Get resume point for media
   */
  getResumePoint(userId: string, mediaId: string): Promise<number>;

  /**
   * Get active streams for user
   */
  getActiveStreams(userId: string): Promise<StreamingSession[]>;

  /**
   * Check concurrent stream limit
   */
  checkConcurrentStreamLimit(userId: string): Promise<boolean>;
}
