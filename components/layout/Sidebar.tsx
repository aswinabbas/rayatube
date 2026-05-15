"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon, BookOpenIcon, MusicalNoteIcon,
  MoonIcon, StarIcon, Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon as HomeSolid } from "@heroicons/react/24/solid";
import { CHANNELS } from "@/lib/channels";

interface SidebarProps {
  collapsed: boolean;
  selectedChannel: string;
  onChannelSelect: (id: string) => void;
}

const catNav = [
  { id: "cat:Islami", label: "Islami",  Icon: MoonIcon },
  { id: "cat:Quran",  label: "Quran",   Icon: BookOpenIcon },
  { id: "cat:Lagu",   label: "Lagu",    Icon: MusicalNoteIcon },
];

export default function Sidebar({ collapsed, selectedChannel, onChannelSelect }: SidebarProps) {
  const pathname = usePathname();

  const NavItem = ({ href, label, Icon, active, onClick, emoji }: {
    href?: string; label: string; Icon: React.ElementType;
    active?: boolean; onClick?: () => void; emoji?: string;
  }) => {
    const baseStyle: React.CSSProperties = {
      display: "flex", alignItems: "center",
      gap: collapsed ? 0 : 16,
      padding: collapsed ? "10px 0" : "8px 12px",
      justifyContent: collapsed ? "center" : "flex-start",
      borderRadius: 10, fontSize: 14, fontWeight: active ? 600 : 400,
      color: "var(--text-1)", textDecoration: "none", cursor: "pointer",
      border: "none", background: active ? "var(--bg-hover)" : "transparent",
      width: "100%", whiteSpace: "nowrap", overflow: "hidden",
      transition: "background .1s",
    };
    const inner = (
      <>
        {emoji
          ? <span style={{ fontSize: 18, width: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{emoji}</span>
          : <Icon style={{ width: 24, height: 24, flexShrink: 0, color: active ? "var(--text-1)" : "var(--text-2)" }} />
        }
        {!collapsed && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>}
      </>
    );
    if (href) return <Link href={href} style={baseStyle} title={collapsed ? label : undefined}>{inner}</Link>;
    return <button style={baseStyle} onClick={onClick} title={collapsed ? label : undefined}>{inner}</button>;
  };

  return (
    /* hidden on mobile (< sm), visible sm+ */
    <nav
      className="hidden sm:flex flex-col fixed left-0 bottom-0 overflow-y-auto overflow-x-hidden pt-2 pb-6"
      style={{
        top: "var(--topbar-h)",
        width: collapsed ? "var(--sidebar-c-w)" : "var(--sidebar-w)",
        background: "var(--bg-base)",
        borderRight: "1px solid var(--border)",
        transition: "width .15s ease",
        zIndex: 40,
      }}
    >
      <div className="px-2 mb-2">
        <NavItem href="/" label="Beranda"
          Icon={pathname === "/" ? HomeSolid : HomeIcon}
          active={pathname === "/"} />
      </div>

      <hr className="mx-3 my-1" style={{ borderColor: "var(--border)" }} />

      {!collapsed && <p className="px-4 py-1 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-3)" }}>Kategori</p>}
      <div className="px-2 mb-2">
        {catNav.map(({ id, label, Icon }) => (
          <NavItem key={id} label={label} Icon={Icon}
            active={selectedChannel === id}
            onClick={() => onChannelSelect(selectedChannel === id ? "all" : id)} />
        ))}
      </div>

      <hr className="mx-3 my-1" style={{ borderColor: "var(--border)" }} />

      {!collapsed && <p className="px-4 py-1 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-3)" }}>Channel</p>}
      <div className="px-2 mb-2">
        {CHANNELS.map(ch => (
          <NavItem key={ch.id} label={ch.name} Icon={StarIcon} emoji={ch.emoji}
            active={selectedChannel === ch.id}
            onClick={() => onChannelSelect(selectedChannel === ch.id ? "all" : ch.id)} />
        ))}
      </div>

      <hr className="mx-3 my-1" style={{ borderColor: "var(--border)" }} />

      <div className="px-2 mt-auto">
        <NavItem href="/channels" label="Semua Channel" Icon={StarIcon} active={pathname === "/channels"} />
        <NavItem href="/parental" label="Kontrol Orang Tua" Icon={Cog6ToothIcon} active={pathname === "/parental"} />
      </div>
    </nav>
  );
}
