import Topbar from "@/components/layout/Topbar";
import ChannelCard from "@/components/channels/ChannelCard";
import { CHANNELS } from "@/lib/channels";

export default function ChannelsPage() {
  return (
    <>
      <div style={{ marginTop:"var(--topbar-h)" }}>
        <main className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color:"var(--text-1)" }}>Channel Islami Terpercaya</h1>
          <p className="text-sm mb-8" style={{ color:"var(--text-2)" }}>Konten dipilih khusus untuk anak-anak Muslim Indonesia</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CHANNELS.map(ch=><ChannelCard key={ch.id} channel={ch} />)}
          </div>
        </main>
      </div>
    </>
  );
}
