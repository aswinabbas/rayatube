"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Video } from "@/types";

export function useWatchTimer(onTick: (seconds: number) => void) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isActive, setIsActive] = useState(false);

  const start = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
    }
  }, [isActive]);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        onTick(1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, onTick]);

  return { start, stop, isActive };
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored));
    } catch {}
  }, [key]);

  const set = useCallback(
    (newValue: T) => {
      setValue(newValue);
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch {}
    },
    [key]
  );

  return [value, set] as const;
}

export function useVideoSearch(initialVideos: Video[]) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Video[]>(initialVideos);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered(initialVideos);
    } else {
      const q = query.toLowerCase();
      setFiltered(
        initialVideos.filter(
          (v) =>
            v.title.toLowerCase().includes(q) ||
            v.channelName.toLowerCase().includes(q)
        )
      );
    }
  }, [query, initialVideos]);

  return { query, setQuery, filtered };
}

export function useCountdown(seconds: number) {
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}j ${m}m`;
    if (m > 0) return `${m}m ${sec}d`;
    return `${sec}d`;
  };

  const percentage = seconds > 0 ? (seconds / seconds) * 100 : 0;
  return { formatted: formatTime(seconds), percentage };
}
