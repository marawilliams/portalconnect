import { Video } from "lucide-react";
import type { RecordState } from "../hooks/useVideoRecorder";

interface Props {
  state: RecordState;
  elapsed: number;
  maxSeconds: number;
  fmt: (seconds: number) => string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  playbackUrl?: string;
  error?: string;
  onVideoActiveChange?: (active: boolean) => void;
}

export function LiveVideoRecorder({
  state,
  elapsed,
  maxSeconds,
  fmt,
  videoRef,
  playbackUrl,
  error,
  onVideoActiveChange,
}: Props) {
  return (
    <div
      className="relative rounded-xl overflow-hidden flex items-center justify-center bg-[var(--app-surface)] border border-[var(--app-border)]"
      style={{ aspectRatio: "16/9" }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted={state === "recording"}
        controls={state === "done"}
        onPlay={() => { if (state === "done") onVideoActiveChange?.(true); }}
        onPause={() => { if (state === "done") onVideoActiveChange?.(false); }}
        onEnded={() => { if (state === "done") onVideoActiveChange?.(false); }}
      />

      {(state === "idle" || state === "recording") && (
        <>
          <div className="absolute top-3 left-3 bg-black/60 text-white text-[11px] tracking-[0.08em] uppercase px-2 py-1 rounded-lg">
            {fmt(maxSeconds)}
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff4d4f] animate-pulse shadow-[0_0_8px_rgba(255,77,79,0.55)]" />
            <span className="text-white text-[11px] tracking-[0.08em] uppercase">REC</span>
          </div>
        </>
      )}

      {state === "idle" && (
        <div className="relative z-10 flex flex-col items-center justify-center text-[var(--app-text-20)]">
          <Video className="w-12 h-12" strokeWidth={1} />
        </div>
      )}

      {state === "recording" && (
        <>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-[#e07b00]/20 animate-ping" />
          </div>
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-lg">
            {fmt(elapsed)} / {fmt(maxSeconds)}
          </div>
        </>
      )}

      {state === "done" && !playbackUrl && (
        <div className="relative z-10 flex items-center justify-center text-[var(--app-text-40)] text-sm">
          Recording ready to review
        </div>
      )}

      {error && (
        <div className="absolute inset-x-0 bottom-0 bg-red-600/90 text-white text-xs px-3 py-2 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
