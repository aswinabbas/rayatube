"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { WatchTimeContextType, ParentalSettings } from "@/types";
import { DEFAULT_PARENTAL_SETTINGS } from "@/lib/channels";

const WatchTimeContext = createContext<WatchTimeContextType | null>(null);

const STORAGE_KEY_SESSION = "kidstube_watch_session";
const STORAGE_KEY_SETTINGS = "kidstube_parental_settings";

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export function WatchTimeProvider({ children }: { children: React.ReactNode }) {
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [parentalSettings, setParentalSettings] = useState<ParentalSettings>(
    DEFAULT_PARENTAL_SETTINGS
  );

  // Load from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (storedSettings) {
      try {
        setParentalSettings(JSON.parse(storedSettings));
      } catch {}
    }

    const storedSession = localStorage.getItem(STORAGE_KEY_SESSION);
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        if (session.date === getTodayKey()) {
          setWatchedSeconds(session.watchedSeconds || 0);
        }
      } catch {}
    }
  }, []);

  // Persist watch time
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY_SESSION,
      JSON.stringify({ date: getTodayKey(), watchedSeconds })
    );
  }, [watchedSeconds]);

  const addWatchTime = useCallback((seconds: number) => {
    setWatchedSeconds((prev) => prev + seconds);
  }, []);

  const resetWatchTime = useCallback(() => {
    setWatchedSeconds(0);
  }, []);

  const updateParentalSettings = useCallback(
    (settings: Partial<ParentalSettings>) => {
      setParentalSettings((prev) => {
        const updated = { ...prev, ...settings };
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const verifyPin = useCallback(
    (pin: string) => {
      return pin === parentalSettings.pin;
    },
    [parentalSettings.pin]
  );

  const dailyLimitSeconds = parentalSettings.dailyLimitMinutes * 60;
  const isLimitReached = watchedSeconds >= dailyLimitSeconds;
  const remainingSeconds = Math.max(0, dailyLimitSeconds - watchedSeconds);

  return (
    <WatchTimeContext.Provider
      value={{
        watchedSeconds,
        dailyLimitSeconds,
        addWatchTime,
        resetWatchTime,
        isLimitReached,
        remainingSeconds,
        parentalSettings,
        updateParentalSettings,
        verifyPin,
      }}
    >
      {children}
    </WatchTimeContext.Provider>
  );
}

export function useWatchTime() {
  const ctx = useContext(WatchTimeContext);
  if (!ctx) throw new Error("useWatchTime must be used inside WatchTimeProvider");
  return ctx;
}
