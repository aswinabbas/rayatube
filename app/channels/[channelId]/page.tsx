"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import VideoGrid from "@/components/common/VideoGrid";
import { Video } from "@/types";
import { CHANNELS } from "@/lib/channels";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ChannelPage() {
  const { channelId } = useParams<{ channelId: string }>();
  const ch = CHANNELS.find(c => c.id === channelId);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ch) return;
    fetch(`/api/youtube?channel=${ch.youtubeChannelId}`)
      .then(r=>r.json()).then(d=>setVideos(d.videos||[])).finally(()=>setLoading(false));
  }, [ch]);

  if (!ch) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <span className="text-5xl">😕</span>
      <p className="font-medium" style={{ color:"var(--text-2)" }}>Channel tidak ditemukan</p>
      <Link href="/" className="text-sm" style={{ color:"var(--accent)" }}>Kembali ke Beranda</Link>
    </div>
  );

  return (
    <div style={{ marginTop:"var(--topbar-h)" }}>
      {/* Channel header */}
      <div className="relative h-32 flex items-end px-6 pb-4"
        style={{ background:`linear-gradient(135deg,${ch.color}33,${ch.color}11)`, borderBottom:"1px solid var(--border)" }}>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background:ch.color }} />
        <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:opacity-70 transition-opacity"
          style={{ color:"var(--text-2)" }}>
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl"
            style={{ background:ch.color+"22" }}>
            {ch.emoji}
          </div>
          <div>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background:ch.color+"22", color:ch.color }}>{ch.category}</span>
            <h1 className="text-xl font-bold mt-1" style={{ color:"var(--text-1)" }}>{ch.name}</h1>
          </div>
        </div>
      </div>

      <main className="px-6 py-6 max-w-7xl mx-auto">
        <VideoGrid videos={videos} loading={loading} emptyMessage={`Belum ada video dari ${ch.name}`} />
      </main>
    </div>
  );
}
