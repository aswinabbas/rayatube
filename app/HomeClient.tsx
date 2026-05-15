"use client";
import { useState, useEffect, useCallback } from "react";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import ChipFilter from "@/components/channels/ChipFilter";
import VideoGrid from "@/components/common/VideoGrid";
import WatchLimitModal from "@/components/parental/WatchLimitModal";
import { Video } from "@/types";
import { CHANNELS } from "@/lib/channels";
import { useWatchTime } from "@/context/WatchTimeContext";

export default function HomeClient() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLimitReached, parentalSettings } = useWatchTime();

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (!selectedChannel.startsWith("cat:") && selectedChannel !== "all") {
        const ch = CHANNELS.find(c => c.id === selectedChannel);
        if (ch) params.set("channel", ch.youtubeChannelId);
      }
      if (searchQuery) params.set("q", searchQuery);
      if (parentalSettings.allowedChannels.length < CHANNELS.length)
        params.set("allowed", parentalSettings.allowedChannels.join(","));

      const res = await fetch(`/api/youtube?${params}`);
      const data = await res.json();
      let vids: Video[] = data.videos || [];

      if (selectedChannel.startsWith("cat:")) {
        const cat = selectedChannel.replace("cat:", "");
        const ids = CHANNELS.filter(c => c.category === cat).map(c => c.youtubeChannelId);
        vids = vids.filter(v => ids.includes(v.channelId));
      }
      setVideos(vids);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [selectedChannel, searchQuery, parentalSettings.allowedChannels]);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  // Desktop sidebar width (0 on mobile)
  const sidebarW = sidebarCollapsed ? 72 : 240;

  return (
    <>
      {isLimitReached && <WatchLimitModal />}

      <Topbar
        onMenuClick={() => setSidebarCollapsed(c => !c)}
        onSearch={q => { setSearchQuery(q); setSelectedChannel("all"); }}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
      />

      {/* Desktop sidebar — hidden sm: is handled inside Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        selectedChannel={selectedChannel}
        onChannelSelect={setSelectedChannel}
      />

      {/* Mobile bottom nav */}
      <MobileBottomNav onSearchClick={() => setSearchOpen(true)} />

      {/* Main content — shifts right on desktop for sidebar, no shift on mobile */}
      <div
        className="sm:transition-all sm:duration-150"
        style={{
          marginTop: "var(--topbar-h)",
          // sm+ gets sidebar offset; mobile stays full-width
        }}
      >
        {/* We use a responsive wrapper: on mobile marginLeft=0, on sm+ use sidebarW */}
        <div className="sm:hidden">
          {/* Mobile: no left margin */}
          <ChipFilter selectedChannel={selectedChannel} onSelect={setSelectedChannel} />
          <main className="px-4 py-4 pb-20">
            <SectionHeading query={searchQuery} selected={selectedChannel} count={videos.length} loading={loading} />
            <VideoGrid videos={videos} loading={loading}
              emptyMessage={searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Belum ada video"} />
          </main>
        </div>
        <div className="hidden sm:block" style={{ marginLeft: sidebarW, transition: "margin-left .15s ease" }}>
          <ChipFilter selectedChannel={selectedChannel} onSelect={setSelectedChannel} />
          <main className="px-6 py-6">
            <SectionHeading query={searchQuery} selected={selectedChannel} count={videos.length} loading={loading} />
            <VideoGrid videos={videos} loading={loading}
              emptyMessage={searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Belum ada video"} />
          </main>
        </div>
      </div>
    </>
  );
}

function SectionHeading({ query, selected, count, loading }: {
  query: string; selected: string; count: number; loading: boolean;
}) {
  const label = query
    ? `Hasil untuk "${query}"`
    : selected === "all" ? "Untuk kamu"
    : selected.startsWith("cat:") ? selected.replace("cat:", "")
    : CHANNELS.find(c => c.id === selected)?.name ?? "";
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-base font-medium" style={{ color: "var(--text-1)" }}>{label}</h2>
      {!loading && <span className="text-sm" style={{ color: "var(--text-3)" }}>{count} video</span>}
    </div>
  );
}
