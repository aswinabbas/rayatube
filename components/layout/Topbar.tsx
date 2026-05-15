"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Bars3Icon, MagnifyingGlassIcon, XMarkIcon,
  MoonIcon, SunIcon, ShieldCheckIcon, ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "@/context/ThemeContext";
import WatchTimePill from "./WatchTimePill";

interface TopbarProps {
  onMenuClick: () => void;
  onSearch?: (q: string) => void;
  searchOpen?: boolean;
  setSearchOpen?: (v: boolean) => void;
}

export default function Topbar({ onMenuClick, onSearch, searchOpen: extOpen, setSearchOpen: extSetOpen }: TopbarProps) {
  const { theme, toggle } = useTheme();
  const [localOpen, setLocalOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searching = extOpen ?? localOpen;
  const setSearching = extSetOpen ?? setLocalOpen;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
    setSearching(false);
  };

  const closeSearch = () => { setSearching(false); setQuery(""); onSearch?.(""); };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center gap-2 px-3"
      style={{ height: "var(--topbar-h)", background: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}
    >
      {/* Hamburger — hidden on mobile (sidebar hidden anyway) */}
      <button onClick={onMenuClick}
        className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:opacity-70 transition-opacity shrink-0"
        style={{ color: "var(--text-1)" }} aria-label="Menu">
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-1.5 select-none shrink-0 mr-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: "var(--accent)" }}>
          <span className="text-white text-base font-black leading-none">K</span>
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-black text-[15px]" style={{ color: "var(--text-1)" }}>RayaTube</span>
          <span className="text-[10px] font-medium" style={{ color: "var(--accent)" }}>Islami</span>
        </div>
      </Link>

      {/* Search bar — center, full-width on mobile when open */}
      <div className={`flex-1 flex items-center ${searching ? "max-w-none" : "max-w-2xl mx-auto"}`}>
        {searching ? (
          <form onSubmit={submit} className="flex w-full items-center gap-1">
            <button type="button" onClick={closeSearch}
              className="w-9 h-9 flex items-center justify-center rounded-full shrink-0"
              style={{ color: "var(--text-2)" }}>
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex flex-1 rounded-full border overflow-hidden"
              style={{ borderColor: "var(--border)", background: "var(--bg-base)" }}>
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Cari video Islami..."
                className="flex-1 px-4 py-2 text-sm outline-none"
                style={{ background: "transparent", color: "var(--text-1)" }} />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="px-3" style={{ color: "var(--text-2)" }}>
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            <button type="submit"
              className="w-9 h-9 flex items-center justify-center rounded-full shrink-0 ml-1"
              style={{ background: "var(--bg-hover)", color: "var(--text-1)" }}>
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <button onClick={() => setSearching(true)}
            className="hidden sm:flex w-full items-center gap-3 rounded-full border px-5 py-2 text-sm"
            style={{ borderColor: "var(--border)", background: "var(--bg-input)", color: "var(--text-3)" }}>
            <MagnifyingGlassIcon className="w-4 h-4 shrink-0" />
            Cari video Islami...
          </button>
        )}
      </div>

      {/* Right actions */}
      {!searching && (
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Mobile search icon */}
          <button onClick={() => setSearching(true)}
            className="sm:hidden w-10 h-10 flex items-center justify-center rounded-full"
            style={{ color: "var(--text-1)" }}>
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>

          <WatchTimePill />

          <button onClick={toggle}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-1)" }}
            title={theme === "dark" ? "Mode terang" : "Mode gelap"}>
            {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          {/* Parental — desktop only (mobile has bottom nav) */}
          <Link href="/parental"
            className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-1)" }} title="Pengaturan Orang Tua">
            <ShieldCheckIcon className="w-6 h-6" />
          </Link>
        </div>
      )}
    </header>
  );
}
