export interface Channel {
  id: string;
  name: string;
  handle: string;
  youtubeChannelId: string;
  description: string;
  color: string;
  emoji: string;
  category: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelId: string;
  channelName: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
  youtubeVideoId: string;
}

export interface WatchSession {
  startTime: number;
  totalWatchedSeconds: number;
  lastUpdated: number;
}

export interface ParentalSettings {
  dailyLimitMinutes: number;
  requirePinToUnlock: boolean;
  pin: string;
  allowedChannels: string[];
}

export interface WatchTimeContextType {
  watchedSeconds: number;
  dailyLimitSeconds: number;
  addWatchTime: (seconds: number) => void;
  resetWatchTime: () => void;
  isLimitReached: boolean;
  remainingSeconds: number;
  parentalSettings: ParentalSettings;
  updateParentalSettings: (settings: Partial<ParentalSettings>) => void;
  verifyPin: (pin: string) => boolean;
}
