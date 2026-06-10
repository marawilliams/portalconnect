import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

interface Props {
  durationSeconds?: number;
  accentColor?: string;
  placeholderContent?: React.ReactNode;
  onComplete?: () => void;
}

export function SimulatedPlayer({
  durationSeconds = 12,
  accentColor = "#e07b00",
  placeholderContent,
  onComplete,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { timerRef.current && clearInterval(timerRef.current); };
  }, []);

  const start = () => {
    if (elapsed >= durationSeconds) {
      setElapsed(0);
    }
    setPlaying(true);
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= durationSeconds) {
          clearInterval(timerRef.current!);
          setPlaying(false);
          onComplete?.();
          return durationSeconds;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const pause = () => {
    timerRef.current && clearInterval(timerRef.current);
    setPlaying(false);
  };

  const restart = () => {
    timerRef.current && clearInterval(timerRef.current);
    setElapsed(0);
    setPlaying(false);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = Math.round(ratio * durationSeconds);
    setElapsed(newTime);
    if (playing) {
      timerRef.current && clearInterval(timerRef.current);
      if (newTime < durationSeconds) {
        timerRef.current = setInterval(() => {
          setElapsed((prev) => {
            if (prev + 1 >= durationSeconds) {
              clearInterval(timerRef.current!);
              setPlaying(false);
              return durationSeconds;
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        setPlaying(false);
        onComplete?.();
      }
    }
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const progress = (elapsed / durationSeconds) * 100;
  const ended = elapsed >= durationSeconds;

  return (
    <div className="w-full rounded-xl overflow-hidden bg-[var(--app-player-bg)] select-none">
      {/* Video area */}
      <div className="relative w-full flex items-center justify-center bg-[var(--app-player-bg)]" style={{ aspectRatio: "16/9" }}>
        {placeholderContent ?? (
          <button
            onClick={playing ? pause : (ended ? restart : start)}
            className="flex flex-col items-center gap-3 opacity-40 hover:opacity-70 transition-opacity"
          >
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              {playing ? <Pause className="w-7 h-7 text-[var(--app-player-text)]" /> : <Play className="w-7 h-7 text-[var(--app-player-text)] ml-1" />}
            </div>
          </button>
        )}

        {/* Overlay pulse when playing */}
        {playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
          </div>
        )}

        {/* Ended overlay */}
        {ended && !playing && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              onClick={restart}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Replay
            </button>
          </div>
        )}

        {/* Time badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-[var(--app-player-text)] text-xs px-2 py-0.5 rounded">
          {fmt(elapsed)} / {fmt(durationSeconds)}
        </div>
      </div>

      {/* Controls bar */}
      <div className="bg-[var(--app-player-bar)] px-3 py-2 flex flex-col gap-2">
        {/* Scrubber */}
        <div
          className="w-full h-1.5 bg-[var(--app-player-track)] rounded-full cursor-pointer relative group"
          onClick={seek}
        >
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${progress}%`, backgroundColor: accentColor }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow transition-all duration-200"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-3">
          {playing ? (
            <button onClick={pause} className="text-[var(--app-player-text)] hover:text-[var(--app-player-text)] transition-colors">
              <Pause className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={ended ? restart : start} className="text-[var(--app-player-text)] hover:text-[var(--app-player-text)] transition-colors">
              {ended ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          )}
          <button onClick={() => setMuted((m) => !m)} className="text-[var(--app-player-text)] hover:text-[var(--app-player-text)] transition-colors">
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <span className="text-[var(--app-player-text)] text-xs ml-auto">{fmt(elapsed)} / {fmt(durationSeconds)}</span>
        </div>
      </div>
    </div>
  );
}
