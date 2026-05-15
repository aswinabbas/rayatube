import { NextRequest, NextResponse } from "next/server";
import { STATIC_VIDEOS, enrichVideosWithOEmbed } from "@/lib/staticVideos";
import { CHANNELS } from "@/lib/channels";
import { Video } from "@/types";

// Enrich once at module level so the cache persists across requests in prod
let enrichedCache: Video[] | null = null;

async function getEnrichedVideos(): Promise<Video[]> {
  if (enrichedCache) return enrichedCache;
  enrichedCache = await enrichVideosWithOEmbed(STATIC_VIDEOS);
  return enrichedCache;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get("channel"); // youtubeChannelId value
  const query = searchParams.get("q");

  try {
    let videos = await getEnrichedVideos();

    // Filter by channel
    if (channelId) {
      videos = videos.filter((v) => v.channelId === channelId);
    }

    // Filter by allowed channels (from parental settings passed as comma-separated ids)
    const allowedIds = searchParams.get("allowed");
    if (allowedIds) {
      const allowed = allowedIds.split(",");
      const allowedYtIds = CHANNELS
        .filter((c) => allowed.includes(c.id))
        .map((c) => c.youtubeChannelId);
      videos = videos.filter((v) => allowedYtIds.includes(v.channelId));
    }

    // Search filter (client-side style, since data is static)
    if (query) {
      const q = query.toLowerCase();
      videos = videos.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.channelName.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Videos error:", error);
    // Always return static data as fallback — never a bare 500
    return NextResponse.json({ videos: STATIC_VIDEOS });
  }
}
