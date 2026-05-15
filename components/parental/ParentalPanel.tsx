"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWatchTime } from "@/context/WatchTimeContext";
import { CHANNELS } from "@/lib/channels";
import {
  LockClosedIcon, ClockIcon, ArrowPathIcon, ShieldCheckIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

/* ── Precise toggle: knob travels exactly from left edge to right edge ── */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  // Outer: w-11 (44px) h-6 (24px). Knob: w-5 h-5 (20px).
  // Off: translateX(2px)  → knob sits at left with 2px gap
  // On:  translateX(22px) → 44 - 20 - 2 = 22px gap from left
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      className="relative flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: on ? "var(--accent)" : "var(--border)",
        transition: "background .2s",
      }}
    >
      <span
        className="absolute top-[2px] left-0 flex items-center justify-center rounded-full bg-white shadow"
        style={{
          width: 20, height: 20,
          transform: on ? "translateX(22px)" : "translateX(2px)",
          transition: "transform .2s",
        }}
      >
        {on && <CheckIcon className="w-3 h-3" style={{ color: "var(--accent)" }} />}
      </span>
    </button>
  );
}

function Card({ title, icon: Icon, children }: {
  title: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-5" style={{ background: "var(--bg-base)", border: "1px solid var(--border)" }}>
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-4" style={{ color: "var(--text-1)" }}>
        <Icon className="w-5 h-5" style={{ color: "var(--accent)" }} />
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function ParentalPanel() {
  const router = useRouter();
  const { parentalSettings, updateParentalSettings, watchedSeconds, resetWatchTime, verifyPin } = useWatchTime();
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [saving, setSaving] = useState(false);

  const doUnlock = () => {
    if (verifyPin(pinInput)) { setUnlocked(true); setPinError(""); }
    else setPinError("PIN salah");
    setPinInput("");
  };

  const doSave = async () => {
    if (newPin && newPin !== confirmPin) { setPinError("PIN tidak cocok"); return; }
    if (newPin) updateParentalSettings({ pin: newPin });
    setSaving(true);
    // Brief visual feedback then navigate home
    await new Promise(r => setTimeout(r, 600));
    router.push("/");
  };

  const watchedMin = Math.floor(watchedSeconds / 60);

  if (!unlocked) return (
    <div className="max-w-sm mx-auto">
      <div className="rounded-2xl p-8 text-center" style={{ background: "var(--bg-base)", border: "1px solid var(--border)" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--bg-hover)" }}>
          <LockClosedIcon className="w-8 h-8" style={{ color: "var(--accent)" }} />
        </div>
        <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text-1)" }}>Mode Orang Tua</h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>
          Masukkan PIN untuk mengakses pengaturan
        </p>
        <input
          type="password" value={pinInput} maxLength={6}
          onChange={e => { setPinInput(e.target.value); setPinError(""); }}
          onKeyDown={e => e.key === "Enter" && doUnlock()}
          placeholder="• • • •"
          className="w-full text-center text-xl tracking-[0.5em] py-3 rounded-xl outline-none mb-2"
          style={{
            background: "var(--bg-hover)",
            border: `1.5px solid ${pinError ? "#ef4444" : "var(--border)"}`,
            color: "var(--text-1)",
          }}
        />
        {pinError && <p className="text-xs text-red-500 mb-2">{pinError}</p>}
        <button onClick={doUnlock}
          className="w-full py-2.5 rounded-xl font-semibold text-sm"
          style={{ background: "var(--accent)", color: "#fff" }}>
          Masuk
        </button>
        <p className="text-xs mt-3" style={{ color: "var(--text-3)" }}>PIN default: 1234</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-24 sm:pb-6">
      {/* Status */}
      <Card title="Status Hari Ini" icon={ClockIcon}>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl font-bold" style={{ color: "var(--text-1)" }}>{watchedMin}</span>
          <span className="text-sm mb-0.5" style={{ color: "var(--text-2)" }}>/ {parentalSettings.dailyLimitMinutes} menit</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: "var(--bg-hover)" }}>
          <div className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(100, (watchedMin / parentalSettings.dailyLimitMinutes) * 100)}%`,
              background: "var(--accent)",
            }} />
        </div>
        <button onClick={resetWatchTime}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ background: "var(--bg-hover)", color: "var(--text-2)" }}>
          <ArrowPathIcon className="w-3.5 h-3.5" /> Reset waktu hari ini
        </button>
      </Card>

      {/* Limit */}
      <Card title="Batas Waktu Harian" icon={ClockIcon}>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[30, 60, 90, 120].map(m => (
            <button key={m}
              onClick={() => updateParentalSettings({ dailyLimitMinutes: m })}
              className="py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: parentalSettings.dailyLimitMinutes === m ? "var(--chip-active-bg)" : "var(--bg-hover)",
                color: parentalSettings.dailyLimitMinutes === m ? "var(--chip-active-fg)" : "var(--text-1)",
              }}>
              {m}m
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "var(--text-2)" }}>Kustom:</span>
          <input type="number" value={parentalSettings.dailyLimitMinutes}
            onChange={e => updateParentalSettings({ dailyLimitMinutes: Math.max(5, parseInt(e.target.value) || 60) })}
            className="w-20 text-center py-1 rounded-lg outline-none text-sm font-medium"
            style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-1)" }}
          />
          <span className="text-xs" style={{ color: "var(--text-2)" }}>menit</span>
        </div>
      </Card>

      {/* Security */}
      <Card title="Keamanan & PIN" icon={ShieldCheckIcon}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>Wajib PIN saat batas habis</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>Orang tua perlu memasukkan PIN untuk lanjut</p>
          </div>
          <Toggle
            on={parentalSettings.requirePinToUnlock}
            onToggle={() => updateParentalSettings({ requirePinToUnlock: !parentalSettings.requirePinToUnlock })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "PIN Baru", val: newPin, set: setNewPin },
            { label: "Konfirmasi PIN", val: confirmPin, set: setConfirmPin },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label className="block text-xs mb-1" style={{ color: "var(--text-2)" }}>{label}</label>
              <input type="password" value={val} maxLength={6}
                onChange={e => { set(e.target.value.slice(0, 6)); setPinError(""); }}
                placeholder="••••"
                className="w-full text-center py-2 rounded-lg outline-none text-sm tracking-widest"
                style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-1)" }}
              />
            </div>
          ))}
        </div>
        {pinError && <p className="text-xs text-red-500 mt-2">{pinError}</p>}
      </Card>

      {/* Channels */}
      <Card title="Channel yang Diizinkan" icon={ShieldCheckIcon}>
        <div className="space-y-2">
          {CHANNELS.map(ch => {
            const on = parentalSettings.allowedChannels.includes(ch.id);
            return (
              <div key={ch.id} className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: "var(--bg-hover)" }}>
                <span className="text-xl">{ch.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text-1)" }}>{ch.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>{ch.category}</p>
                </div>
                <Toggle on={on} onToggle={() => {
                  const updated = on
                    ? parentalSettings.allowedChannels.filter(id => id !== ch.id)
                    : [...parentalSettings.allowedChannels, ch.id];
                  updateParentalSettings({ allowedChannels: updated });
                }} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Save → redirect home */}
      <button
        onClick={doSave}
        disabled={saving}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        style={{ background: saving ? "#10b981" : "var(--accent)", color: "#fff" }}
      >
        {saving ? (
          <><CheckIcon className="w-4 h-4" /> Disimpan! Kembali ke Beranda...</>
        ) : "Simpan Pengaturan"}
      </button>
    </div>
  );
}
