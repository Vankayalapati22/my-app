// Streaming Service Implementation
import { IStreamingService } from './streaming.contracts';
import { StreamingSession, ViewingHistory } from '../../types/domain';
import { StartStreamRequest, StartStreamResponse, UpdateStreamProgressRequest, EndStreamRequest } from '../../types/dto';

class StreamingService implements IStreamingService {
  private activeSessions: Map<string, StreamingSession> = new Map();
  private viewingHistory: Map<string, ViewingHistory> = new Map();
  private resumePoints: Map<string, number> = new Map(); // userId-mediaId -> position

  async startStream(request: StartStreamRequest): Promise<StartStreamResponse> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check concurrent limit
    const canStream = await this.checkConcurrentStreamLimit(request.deviceId);
    if (!canStream) {
      throw new Error('Concurrent stream limit exceeded');
    }

    // Create session
    const sessionId = `stream-${Date.now()}`;
    const resumeKey = `${request.deviceId}-${request.mediaId}`;
    const resumePosition = this.resumePoints.get(resumeKey) || 0;

    const session: StreamingSession = {
      id: sessionId,
      userId: request.deviceId, // Using deviceId as userId for demo
      mediaId: request.mediaId,
      deviceId: request.deviceId,
      status: 'active',
      currentPosition: resumePosition,
      quality: request.quality || '720p',
      startTime: new Date(),
      totalWatchTime: 0,
    };

    this.activeSessions.set(sessionId, session);

    return {
      sessionId,
      streamUrl: `https://stream.example.com/${request.mediaId}/${request.quality || '720p'}.m3u8`,
      duration: 3600, // 1 hour
      currentPosition: resumePosition,
    };
  }

  async updateStreamProgress(
    sessionId: string,
    request: UpdateStreamProgressRequest
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return;
    }

    session.currentPosition = request.currentPosition;
    session.quality = request.quality;
    session.totalWatchTime = request.currentPosition;
  }

  async endStream(sessionId: string, request: EndStreamRequest): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return;
    }

    // Create viewing history record
    const historyKey = `${session.userId}-${session.mediaId}`;
    const history: ViewingHistory = {
      id: `history-${Date.now()}`,
      userId: session.userId,
      mediaId: session.mediaId,
      watchedAt: new Date(),
      watchDuration: request.watchDuration,
      completionPercentage: request.reason === 'completed' ? 100 : (request.watchDuration / 3600) * 100,
    };

    this.viewingHistory.set(historyKey, history);

    // Store resume point if not completed
    if (request.reason !== 'completed') {
      const resumeKey = `${session.userId}-${session.mediaId}`;
      this.resumePoints.set(resumeKey, request.watchDuration);
    }

    session.status = request.reason === 'completed' ? 'completed' : 'stopped';
    session.endTime = new Date();

    // Remove active session after a delay
    setTimeout(() => {
      this.activeSessions.delete(sessionId);
    }, 5000);
  }

  async getStreamStatus(sessionId: string): Promise<StreamingSession | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.activeSessions.get(sessionId) || null;
  }

  async getViewingHistory(userId: string, page: number = 1, pageSize: number = 10): Promise<ViewingHistory[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const userHistory = Array.from(this.viewingHistory.values()).filter((h) => h.userId === userId);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return userHistory.slice(start, end).sort((a, b) => b.watchedAt.getTime() - a.watchedAt.getTime());
  }

  async getResumePoint(userId: string, mediaId: string): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const key = `${userId}-${mediaId}`;
    return this.resumePoints.get(key) || 0;
  }

  async getActiveStreams(userId: string): Promise<StreamingSession[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return Array.from(this.activeSessions.values()).filter((s) => s.userId === userId && s.status === 'active');
  }

  async checkConcurrentStreamLimit(userId: string): Promise<boolean> {
    // Maximum 2 concurrent streams for demo
    const activeCount = await this.getActiveStreams(userId);
    return activeCount.length < 2;
  }
}

export const streamingService = new StreamingService();
