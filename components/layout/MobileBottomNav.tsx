"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon, MagnifyingGlassIcon, Squares2X2Icon, ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolid, Squares2X2Icon as Squares2X2Solid, ShieldCheckIcon as ShieldSolid,
} from "@heroicons/react/24/solid";
import { useWatchTime } from "@/context/WatchTimeContext";

interface Props {
  onSearchClick: () => void;
}

export default function MobileBottomNav({ onSearchClick }: Props) {
  const pathname = usePathname();
  const { remainingSeconds, dailyLimitSeconds } = useWatchTime();
  const pct = Math.min(100, ((dailyLimitSeconds - remainingSeconds) / dailyLimitSeconds) * 100);
  const remMin = Math.floor(remainingSeconds / 60);
  const barColor = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "var(--accent)";

  const items = [
    { href: "/",         label: "Beranda",   Icon: HomeIcon,         ActiveIcon: HomeSolid },
    { href: null,        label: "Cari",      Icon: MagnifyingGlassIcon, ActiveIcon: MagnifyingGlassIcon, onClick: onSearchClick },
    { href: "/channels", label: "Channel",   Icon: Squares2X2Icon,   ActiveIcon: Squares2X2Solid },
    { href: "/parental", label: "Orang Tua", Icon: ShieldCheckIcon,  ActiveIcon: ShieldSolid },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden flex flex-col"
      style={{ background: "var(--bg-base)", borderTop: "1px solid var(--border)" }}
    >
      {/* Watch time bar — thin strip at top of bottom nav */}
      <div className="h-[3px] w-full" style={{ background: "var(--border)" }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>

      <div className="flex items-stretch">
        {items.map(({ href, label, Icon, ActiveIcon, onClick }) => {
          const active = href ? pathname === href : false;
          const Ic = active ? ActiveIcon : Icon;
          const content = (
            <span className="flex flex-col items-center gap-0.5 py-2 flex-1">
              <Ic className="w-6 h-6" style={{ color: active ? "var(--accent)" : "var(--text-2)" }} />
              <span className="text-[10px] font-medium"
                style={{ color: active ? "var(--accent)" : "var(--text-2)" }}>
                {label === "Orang Tua" ? `${remMin}m` : label}
              </span>
            </span>
          );
          if (onClick) return (
            <button key={label} onClick={onClick} className="flex-1 flex items-center justify-center">
              {content}
            </button>
          );
          return (
            <Link key={label} href={href!} className="flex-1 flex items-center justify-center">
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
