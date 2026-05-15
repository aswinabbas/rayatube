"use client";
import { Video } from "@/types";
import VideoCard from "./VideoCard";

interface Props { videos: Video[]; loading?: boolean; emptyMessage?: string }

export default function VideoGrid({ videos, loading=false, emptyMessage="Belum ada video" }: Props) {
  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
      {Array.from({length:12}).map((_,i)=>(
        <div key={i} className="animate-pulse">
          <div className="aspect-video rounded-xl mb-3" style={{ background:"var(--bg-hover)" }} />
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full shrink-0" style={{ background:"var(--bg-hover)" }} />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3.5 rounded" style={{ background:"var(--bg-hover)", width:"90%" }} />
              <div className="h-3 rounded" style={{ background:"var(--bg-hover)", width:"60%" }} />
              <div className="h-3 rounded" style={{ background:"var(--bg-hover)", width:"40%" }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!videos.length) return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
      <span className="text-6xl">🔍</span>
      <p className="text-lg font-medium" style={{ color:"var(--text-2)" }}>{emptyMessage}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
      {videos.map(v => <VideoCard key={v.id} video={v} />)}
    </div>
  );
}
