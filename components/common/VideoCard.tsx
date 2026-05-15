"use client";
import Link from "next/link";
import Image from "next/image";
import { Video } from "@/types";
import { CHANNELS } from "@/lib/channels";

function timeAgo(dateStr: string) {
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (d === 0) return "Hari ini";
  if (d < 7)   return `${d} hari lalu`;
  if (d < 30)  return `${Math.floor(d/7)} minggu lalu`;
  if (d < 365) return `${Math.floor(d/30)} bulan lalu`;
  return `${Math.floor(d/365)} tahun lalu`;
}

interface Props { video: Video; compact?: boolean }

export default function VideoCard({ video, compact = false }: Props) {
  const ch = CHANNELS.find(c => c.youtubeChannelId === video.channelId);

  if (compact) {
    // Horizontal compact card (watch page sidebar)
    return (
      <Link href={`/watch/${video.youtubeVideoId}`} className="vcard flex gap-2">
        <div className="vcard-thumb shrink-0" style={{ width:168, flexShrink:0, borderRadius:8 }}>
          <Image src={video.thumbnailUrl} alt={video.title} fill unoptimized
            className="object-cover" sizes="168px" />
          {video.duration && <span className="vcard-badge">{video.duration}</span>}
        </div>
        <div className="flex-1 min-w-0 py-0.5">
          <p className="vcard-title clamp2 text-[13px]">{video.title}</p>
          <p className="vcard-meta text-[12px] mt-1">{video.channelName}</p>
          <p className="vcard-meta text-[12px]">{timeAgo(video.publishedAt)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/watch/${video.youtubeVideoId}`} className="vcard group">
      {/* Thumbnail */}
      <div className="vcard-thumb mb-3">
        <Image src={video.thumbnailUrl} alt={video.title} fill unoptimized
          className="object-cover" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
        {video.duration && <span className="vcard-badge">{video.duration}</span>}
      </div>

      {/* Meta row */}
      <div className="flex gap-3">
        {/* Channel avatar */}
        <div className="vcard-avatar shrink-0"
          style={{ background: ch ? ch.color + "22" : "var(--bg-hover)" }}>
          <span>{ch?.emoji ?? "📺"}</span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="vcard-title clamp2">{video.title}</p>
          <p className="vcard-meta clamp1 mt-0.5">{video.channelName}</p>
          <p className="vcard-meta">{timeAgo(video.publishedAt)}</p>
        </div>
      </div>
    </Link>
  );
}
