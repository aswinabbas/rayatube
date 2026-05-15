import { Video } from "@/types";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export interface YouTubeSearchResult {
  videos: Video[];
  nextPageToken?: string;
}

export async function fetchChannelVideos(
  channelId: string,
  channelName: string,
  maxResults = 20,
  pageToken?: string
): Promise<YouTubeSearchResult> {
  const params = new URLSearchParams({
    part: "snippet",
    channelId,
    type: "video",
    order: "date",
    maxResults: String(maxResults),
    key: YOUTUBE_API_KEY,
    safeSearch: "strict",
    ...(pageToken && { pageToken }),
  });

  const res = await fetch(`${BASE_URL}/search?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`YouTube API error: ${res.status}`);
  }

  const data = await res.json();

  const videos: Video[] = (data.items || []).map((item: YoutubeItem) => ({
    id: item.id.videoId,
    youtubeVideoId: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.medium?.url ||
      item.snippet.thumbnails?.default?.url,
    channelId,
    channelName,
    publishedAt: item.snippet.publishedAt,
  }));

  return {
    videos,
    nextPageToken: data.nextPageToken,
  };
}

export async function fetchVideoDetails(videoIds: string[]): Promise<Video[]> {
  if (!videoIds.length) return [];

  const params = new URLSearchParams({
    part: "snippet,contentDetails,statistics",
    id: videoIds.join(","),
    key: YOUTUBE_API_KEY,
  });

  const res = await fetch(`${BASE_URL}/videos?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const data = await res.json();

  return (data.items || []).map((item: YoutubeVideoItem) => ({
    id: item.id,
    youtubeVideoId: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.medium?.url,
    channelId: item.snippet.channelId,
    channelName: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    duration: formatDuration(item.contentDetails?.duration),
    viewCount: formatViewCount(item.statistics?.viewCount),
  }));
}

export async function searchVideos(
  query: string,
  channelIds: string[],
  maxResults = 20
): Promise<Video[]> {
  const results = await Promise.allSettled(
    channelIds.map(async (channelId) => {
      const params = new URLSearchParams({
        part: "snippet",
        q: query,
        channelId,
        type: "video",
        maxResults: String(Math.ceil(maxResults / channelIds.length)),
        key: YOUTUBE_API_KEY,
        safeSearch: "strict",
      });

      const res = await fetch(`${BASE_URL}/search?${params}`, {
        next: { revalidate: 1800 },
      });

      if (!res.ok) return [];

      const data = await res.json();

      return (data.items || []).map((item: YoutubeItem) => ({
        id: item.id.videoId,
        youtubeVideoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url,
        channelId,
        channelName: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      }));
    })
  );

  return results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => (r as PromiseFulfilledResult<Video[]>).value);
}

function formatDuration(iso?: string): string {
  if (!iso) return "";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const h = parseInt(match[1] || "0");
  const m = parseInt(match[2] || "0");
  const s = parseInt(match[3] || "0");
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatViewCount(count?: string): string {
  if (!count) return "";
  const n = parseInt(count);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt x ditonton`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb x ditonton`;
  return `${n} x ditonton`;
}

// Type helpers
interface YoutubeItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
}

interface YoutubeVideoItem {
  id: string;
  snippet: YoutubeItem["snippet"];
  contentDetails?: { duration: string };
  statistics?: { viewCount: string };
}
