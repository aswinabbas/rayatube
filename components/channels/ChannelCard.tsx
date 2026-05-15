"use client";
import Link from "next/link";
import { Channel } from "@/types";

export default function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <Link href={`/channels/${channel.id}`}
      className="block rounded-xl overflow-hidden transition-all hover:shadow-lg group"
      style={{ background:"var(--bg-base)", border:"1px solid var(--border)" }}>
      {/* Banner */}
      <div className="h-20 flex items-center justify-center text-5xl relative"
        style={{ background: channel.color + "22" }}>
        <div className="h-1 absolute top-0 left-0 right-0" style={{ background:channel.color }} />
        {channel.emoji}
      </div>
      <div className="p-4">
        <p className="font-semibold text-sm truncate mb-1" style={{ color:"var(--text-1)" }}>{channel.name}</p>
        <p className="text-xs" style={{ color:"var(--text-2)" }}>{channel.description}</p>
        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background:channel.color+"22", color:channel.color }}>
          {channel.category}
        </span>
      </div>
    </Link>
  );
}
