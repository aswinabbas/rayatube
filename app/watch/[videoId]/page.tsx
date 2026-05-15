"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Topbar from "@/components/layout/Topbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import YoutubePlayer from "@/components/player/YoutubePlayer";
import VideoCard from "@/components/common/VideoCard";
import WatchLimitModal from "@/components/parental/WatchLimitModal";
import { Video } from "@/types";
import { useWatchTime } from "@/context/WatchTimeContext";
import { ArrowLeftIcon, ShareIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function WatchPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const router = useRouter();
  const { isLimitReached } = useWatchTime();
  const [related, setRelated] = useState<Video[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    fetch("/api/youtube")
      .then(r => r.json())
      .then(d => setRelated((d.videos || []).filter((v: Video) => v.youtubeVideoId !== videoId).slice(0, 12)))
      .finally(() => setLoadingRelated(false));
  }, [videoId]);

  return (
    <>
      {isLimitReached && <WatchLimitModal />}

      <Topbar onMenuClick={() => { }} searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
      <MobileBottomNav onSearchClick={() => setSearchOpen(true)} />

      {/*
        Layout: fixed topbar + two-column on desktop.
        LEFT  column: sticky player + info (does NOT scroll with page)
        RIGHT column: scrollable related list
        On mobile: stacked, player is sticky at top below topbar
      */}
      <div
        className="flex"
        style={{ marginTop: "var(--topbar-h)", height: "calc(100vh - var(--topbar-h))" }}
      >
        {/* ── Left / Player column ── */}
        <div
          className="flex flex-col overflow-y-auto"
          style={{
            // Mobile: full width. Desktop: ~65% of viewport
            width: "100%",
          }}
        >
          {/* On desktop this left col is sticky — achieved by making it a fixed-height flex child */}
          <div className="lg:hidden w-full flex flex-col" style={{ flex: "none" }}>
            {/* Mobile: player sticky just below topbar */}
            {/* <div className="sticky z-30 w-full mb-20" style={{ top: "var(--topbar-h)", background: "var(--bg)" }}> */}
            <div className="sticky z-30 w-full mb-8 mt-5">
              <div className="px-3 pt-3">
                <button onClick={() => router.back()}
                  className="flex items-center gap-1.5 text-sm mb-2 hover:opacity-70 transition-opacity"
                  style={{ color: "var(--text-2)" }}>
                  <ArrowLeftIcon className="w-4 h-4" /> Kembali
                </button>
                <YoutubePlayer videoId={videoId} />
              </div>
            </div>

            {/* Mobile safe badge */}
            {/* <div className="px-3 pt-3 pb-2">
              <SafeBadge />
            </div> */}

            {/* Mobile related — scrolls normally */}
            <div className="px-3 pb-24">
              <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-1)" }}>Video lainnya</p>
              <RelatedList videos={related} loading={loadingRelated} />
            </div>
          </div>

          {/* Desktop: player column is itself scrollable / overflows */}
          <div className="hidden lg:flex" style={{ height: "100%" }}>
            {/* Sticky player pane */}
            <div
              className="flex flex-col"
              style={{
                position: "sticky",
                top: 0,
                width: "65%",
                height: "calc(100vh - var(--topbar-h))",
                padding: "20px 24px",
                borderRight: "1px solid var(--border)",
                overflowY: "auto",
                flexShrink: 0,
              }}
            >
              <button onClick={() => router.back()}
                className="flex items-center gap-1.5 text-sm mb-4 hover:opacity-70 transition-opacity w-fit"
                style={{ color: "var(--text-2)" }}>
                <ArrowLeftIcon className="w-4 h-4" /> Kembali
              </button>
              <YoutubePlayer videoId={videoId} />
              <div className="mt-4">
                <SafeBadge />
              </div>
            </div>

            {/* Scrollable related pane */}
            <div
              style={{
                flex: 1,
                height: "calc(100vh - var(--topbar-h))",
                overflowY: "auto",
                padding: "20px 16px",
              }}
            >
              <p className="text-sm font-semibold mb-4" style={{ color: "var(--text-1)" }}>Video berikutnya</p>
              {loadingRelated
                ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-2 mb-3 animate-pulse">
                    <div className="rounded-lg shrink-0"
                      style={{ width: 168, height: 94, background: "var(--bg-hover)" }} />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 rounded" style={{ background: "var(--bg-hover)", width: "90%" }} />
                      <div className="h-3 rounded" style={{ background: "var(--bg-hover)", width: "65%" }} />
                      <div className="h-3 rounded" style={{ background: "var(--bg-hover)", width: "50%" }} />
                    </div>
                  </div>
                ))
                : related.map(v => (
                  <div key={v.id} className="mb-3">
                    <VideoCard video={v} compact />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SafeBadge() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ background: "var(--bg-base)", border: "1px solid var(--border)" }}>
      <ShieldCheckIcon className="w-5 h-5 shrink-0" style={{ color: "var(--accent)" }} />
      <div className="flex-1">
        <p className="text-xs font-semibold" style={{ color: "var(--text-1)" }}>Konten Aman untuk Anak</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>
          Dari channel Islami terpercaya, diseleksi khusus
        </p>
      </div>
      <button
        onClick={() => navigator.share?.({ url: location.href })}
        className="p-2 rounded-full hover:opacity-70 transition-opacity"
        style={{ color: "var(--text-2)" }}>
        <ShareIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

function RelatedList({ videos, loading }: { videos: Video[]; loading: boolean }) {
  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-video rounded-xl mb-3" style={{ background: "var(--bg-hover)" }} />
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full shrink-0" style={{ background: "var(--bg-hover)" }} />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3 rounded" style={{ background: "var(--bg-hover)", width: "90%" }} />
              <div className="h-3 rounded" style={{ background: "var(--bg-hover)", width: "60%" }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
      {videos.map(v => <VideoCard key={v.id} video={v} />)}
    </div>
  );
}
