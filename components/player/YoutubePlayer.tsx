"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useWatchTime } from "@/context/WatchTimeContext";

interface YoutubePlayerProps {
  videoId: string;
  onEnded?: () => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLElement | string,
        opts: object
      ) => YoutubePlayerInstance;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YoutubePlayerInstance {
  destroy: () => void;
  getPlayerState: () => number;
}

export default function YoutubePlayer({ videoId, onEnded }: YoutubePlayerProps) {
  const playerRef = useRef<YoutubePlayerInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addWatchTime, isLimitReached } = useWatchTime();
  const [playerReady, setPlayerReady] = useState(false);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      addWatchTime(1);
    }, 1000);
  }, [addWatchTime]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isLimitReached) stopTimer();
  }, [isLimitReached, stopTimer]);

  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current || !window.YT) return;

      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
          fs: 1,
          cc_load_policy: 0,
        },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: (e: { data: number }) => {
            const YT = window.YT;
            if (e.data === YT.PlayerState.PLAYING) {
              if (!isLimitReached) startTimer();
            } else if (
              e.data === YT.PlayerState.PAUSED ||
              e.data === YT.PlayerState.ENDED
            ) {
              stopTimer();
              if (e.data === YT.PlayerState.ENDED) onEnded?.();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      if (!document.querySelector("#yt-api-script")) {
        const script = document.createElement("script");
        script.id = "yt-api-script";
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
    }

    return () => {
      stopTimer();
      playerRef.current?.destroy();
    };
  }, [videoId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
      <div ref={containerRef} className="w-full h-full" />
      {!playerReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/60 text-sm">Memuat video...</p>
          </div>
        </div>
      )}
    </div>
  );
}
