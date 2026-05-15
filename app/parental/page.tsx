import ParentalPanel from "@/components/parental/ParentalPanel";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function ParentalPage() {
  return (
    <div style={{ marginTop: "var(--topbar-h)" }}>
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheckIcon className="w-7 h-7" style={{ color: "var(--accent)" }} />
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-1)" }}>
            Pengaturan Orang Tua
          </h1>
        </div>
        <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>
          Atur batas waktu, pilih channel, dan lindungi dengan PIN
        </p>
        <ParentalPanel />
      </div>
    </div>
  );
}
