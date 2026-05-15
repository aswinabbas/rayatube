"use client";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useWatchTime } from "@/context/WatchTimeContext";

export default function WatchTimePill() {
  const { watchedSeconds, dailyLimitSeconds, remainingSeconds } = useWatchTime();
  const pct = Math.min(100, (watchedSeconds / dailyLimitSeconds) * 100);
  const rem = Math.floor(remainingSeconds / 60);
  const color = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "var(--accent)";

  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium select-none"
      style={{ background:"var(--bg-hover)", color:"var(--text-2)" }}
      title={`Sisa ${rem} menit menonton hari ini`}
    >
      <ClockIcon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background:"var(--border)" }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width:`${pct}%`, background:color }} />
      </div>
      <span style={{ color }}>{rem}m</span>
    </div>
  );
}
