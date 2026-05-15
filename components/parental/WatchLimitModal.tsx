"use client";
import { useState } from "react";
import { useWatchTime } from "@/context/WatchTimeContext";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { ClockIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function WatchLimitModal({ onUnlock }: { onUnlock?: () => void }) {
  const { parentalSettings, verifyPin, resetWatchTime, watchedSeconds } = useWatchTime();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const watchedMin = Math.floor(watchedSeconds / 60);

  const unlock = () => {
    if (verifyPin(pin)) { resetWatchTime(); onUnlock?.(); }
    else { setError(true); setPin(""); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)" }}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background:"var(--bg-base)", border:"1px solid var(--border)" }}>

        {/* Top accent band */}
        <div className="h-1.5 w-full" style={{ background:"var(--accent)" }} />

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background:"var(--bg-hover)" }}>
            <ClockIcon className="w-8 h-8" style={{ color:"var(--accent)" }} />
          </div>

          <h2 className="text-xl font-bold mb-1" style={{ color:"var(--text-1)" }}>
            Waktu menonton habis
          </h2>
          <p className="text-sm mb-2" style={{ color:"var(--text-2)" }}>
            Sudah {watchedMin} menit menonton hari ini.
          </p>

          {/* Tips */}
          <div className="rounded-xl p-4 mb-6 text-left"
            style={{ background:"var(--bg-hover)" }}>
            <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color:"var(--text-1)" }}>
              <SparklesIcon className="w-4 h-4" style={{ color:"var(--accent)" }} />
              Aktivitas seru lainnya
            </p>
            {["📖 Baca buku atau Iqra","🎨 Menggambar & mewarnai","🏃 Bermain di luar","🤲 Berdoa dan mengaji"]
              .map(a=><p key={a} className="text-xs py-0.5" style={{ color:"var(--text-2)" }}>{a}</p>)}
          </div>

          {parentalSettings.requirePinToUnlock ? (
            <>
              <p className="text-xs mb-3" style={{ color:"var(--text-3)" }}>
                Masukkan PIN untuk membuka kunci
              </p>
              <input
                type="password" value={pin} maxLength={6}
                onChange={e => { setPin(e.target.value); setError(false); }}
                onKeyDown={e => e.key==="Enter" && unlock()}
                placeholder="• • • •"
                className="w-full text-center text-xl tracking-[0.5em] py-3 px-4 rounded-xl outline-none mb-2"
                style={{
                  background:"var(--bg-hover)",
                  border:`1.5px solid ${error ? "#ef4444" : "var(--border)"}`,
                  color:"var(--text-1)",
                }}
              />
              {error && <p className="text-xs text-red-500 mb-2">PIN salah. Coba lagi.</p>}
              <button onClick={unlock} disabled={pin.length<4}
                className="w-full py-2.5 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background:"var(--accent)", color:"#fff" }}>
                <LockOpenIcon className="w-4 h-4" /> Buka Kunci
              </button>
            </>
          ) : (
            <button onClick={()=>{ resetWatchTime(); onUnlock?.(); }}
              className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              style={{ background:"var(--accent)", color:"#fff" }}>
              <LockOpenIcon className="w-4 h-4" /> Reset & Lanjut Tonton
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
