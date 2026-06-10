import { useState, useEffect } from "react";
import { Video, RotateCcw, Shield } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { LiveVideoRecorder } from "../components/LiveVideoRecorder";
import { useVideoRecorder } from "../hooks/useVideoRecorder";

interface Props {
  language: string;
  onSend: () => void;
  onBack: () => void;
  onExit: () => void;
  onLanguageChange?: (lang: string) => void;
  onBusyChange?: (busy: boolean) => void;
}

export function ExpressInterestScreen({ language, onLanguageChange, onSend, onBack, onExit, onBusyChange }: Props) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const { videoRef, playbackUrl, error, recordState, elapsed, startRecording, stopRecording, retake, fmt } = useVideoRecorder({ maxSeconds: 30 });
  const canSend = recordState === "done";

  useEffect(() => {
    onBusyChange?.(recordState === "recording" || videoPlaying);
  }, [recordState, videoPlaying, onBusyChange]);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col">
      <TopBar onBack={onBack} onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 flex flex-col px-8 pt-20 pb-8 max-w-md mx-auto w-full">
        <h2 className="text-[var(--app-text)] mb-2 text-center">Record Your Response</h2>
        <p className="text-[var(--app-text-40)] text-sm text-center mb-5">
          Introduce yourself and explain why you'd like to connect.
        </p>

        <div className="flex items-start gap-2 bg-[var(--app-surface-alt)] border border-[#e07b00]/30 rounded-xl px-4 py-3 mb-5">
          <Shield className="w-4 h-4 text-[#e07b00] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--app-text-50)] leading-relaxed">
            The original creator will review your response before any contact information is shared.
          </p>
        </div>

        <div className="w-full mb-4">
          <LiveVideoRecorder
            state={recordState}
            elapsed={elapsed}
            maxSeconds={30}
            fmt={fmt}
            videoRef={videoRef}
            playbackUrl={playbackUrl}
            error={error}
            onVideoActiveChange={setVideoPlaying}
          />
        </div>

        {recordState === "idle" && (
          <button
            onClick={startRecording}
            className="w-full bg-[#e05555] hover:bg-[#cc4444] text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors mb-4"
          >
            <div className="w-3 h-3 bg-white rounded-full" /> Record Response
          </button>
        )}
        {recordState === "recording" && (
          <button
            onClick={stopRecording}
            className="w-full bg-[var(--app-elevated)] hover:bg-[var(--app-elevated-hi)] text-[var(--app-text)] py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-[var(--app-border-hi)] mb-4"
          >
            ⬛ Stop
          </button>
        )}
        {recordState === "done" && (
          <div className="flex gap-2 w-full mb-4">
            <button
              onClick={retake}
              className="flex-1 border border-[var(--app-border)] text-[var(--app-text-60)] py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--app-surface-alt)] transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Retake
            </button>
          </div>
        )}

        {recordState === "done" && (
          <button
            onClick={onSend}
            className="w-full mt-4 py-4 rounded-xl font-medium transition-colors bg-[#e07b00] hover:bg-[#c96e00] text-white"
          >
            Send Response
          </button>
        )}
      </div>
    </div>
  );
}
