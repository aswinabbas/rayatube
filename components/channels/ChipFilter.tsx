"use client";
import { CHANNELS, CATEGORIES } from "@/lib/channels";

interface ChipFilterProps {
  selectedChannel: string;
  onSelect: (val: string) => void;
}

export default function ChipFilter({ selectedChannel, onSelect }: ChipFilterProps) {
  const chips = [
    { id:"all", label:"Semua" },
    ...CATEGORIES.filter(c=>c!=="Semua").map(c=>({ id:"cat:"+c, label:c })),
    ...CHANNELS.map(c=>({ id:c.id, label:c.name })),
  ];

  return (
    <div className="sticky z-20 flex gap-2 px-4 py-3 overflow-x-auto no-scroll"
      style={{ top:"var(--topbar-h)", background:"var(--bg-base)", borderBottom:"1px solid var(--border)" }}>
      {chips.map(({ id, label }) => (
        <button key={id} onClick={() => onSelect(id)}
          className={`chip${selectedChannel===id ? " active" : ""}`}>
          {label}
        </button>
      ))}
    </div>
  );
}
