import { useState, useEffect } from "react";
import { Video, RotateCcw } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { LiveVideoRecorder } from "../components/LiveVideoRecorder";
import { useVideoRecorder } from "../hooks/useVideoRecorder";

interface Props {
  categories: string[];
  invitationText: string;
  onTextChange: (t: string) => void;
  onSave: (duration: number, playbackUrl?: string, recordedBlob?: Blob | null) => void;
  onBack: () => void;
  onExit: () => void;
  onLanguageChange?: (lang: string) => void;
  onBusyChange?: (busy: boolean) => void;
  language: string;
  initialDone?: boolean;
  initialDuration?: number;
  initialPlaybackUrl?: string;
}

const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  "Food & Dining": [
    "Anyone want to try a local taverna with me tonight?",
    "Looking for a buddy to explore the street food market!",
    "Want to join me for a proper Cretan dinner?",
  ],
  "Hiking": [
    "Anyone up for hiking Samaria Gorge tomorrow?",
    "Looking for a trail buddy for a morning hike!",
    "Want to explore the mountain paths around Heraklion?",
  ],
  "Sports": [
    "Looking for a beach volleyball partner this afternoon!",
    "Anyone want to join a casual football kickabout?",
    "Want to find a sports buddy for today?",
  ],
  "Arts & Culture": [
    "Want to visit the Archaeological Museum together?",
    "Looking for someone to explore local galleries with!",
    "Anyone interested in the new exhibition opening this weekend?",
  ],
  "Music": [
    "Looking for someone to check out live music tonight!",
    "There's a rooftop concert, want to join me?",
    "Anyone want to explore the local music scene?",
  ],
  "Nightlife": [
    "Up for a relaxed bar crawl through the old harbour?",
    "Looking for fun people to explore the nightlife with!",
    "Anyone want to check out the bars in the old town tonight?",
  ],
  "History": [
    "Want to explore Knossos Palace together?",
    "Looking for a buddy to walk the Venetian walls with!",
    "Anyone interested in the history of the old city?",
  ],
  "Photography": [
    "Planning a golden hour photo walk, any photographers?",
    "Want to shoot the Koules Fortress at sunrise with me?",
    "Looking for a photo buddy to explore the harbour!",
  ],
  "Shopping": [
    "On a mission to find the best thrift shops, come with us!",
    "Anyone want to explore the Saturday market together?",
    "Looking for a shopping buddy to find local crafts!",
  ],
  "Language Exchange": [
    "I'm learning Greek, happy to help with English in return!",
    "Coffee and conversation? Let's do a language swap!",
    "Looking for someone to practice languages with over coffee.",
  ],
  "Exploring the City": [
    "I know some hidden gems, want to explore together?",
    "Looking for a buddy to discover the city's secret spots!",
    "Want to explore the corners the guidebooks always miss?",
  ],
  "Custom Category": [
    "I have something unique planned, want to join me?",
    "Looking for an open-minded buddy for a special activity!",
    "Got a fun idea, anyone interested in joining?",
  ],
};

function getSuggestions(categories: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const cat of categories) {
    const items = CATEGORY_SUGGESTIONS[cat] ?? [];
    for (const s of items) {
      if (!seen.has(s) && result.length < 5) {
        seen.add(s);
        result.push(s);
      }
    }
  }
  return result;
}

export function RecordInvitationScreen({
  categories, invitationText, onTextChange, onSave, onBack, onExit, language, onLanguageChange,
  onBusyChange, initialDone = false, initialDuration = 0, initialPlaybackUrl,
}: Props) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const { videoRef, playbackUrl, recordedBlob, error, recordState, elapsed, startRecording, stopRecording, retake, fmt } = useVideoRecorder({ maxSeconds: 60, initialDone, initialDuration, initialPlaybackUrl });

  useEffect(() => {
    onBusyChange?.(recordState === "recording" || videoPlaying);
  }, [recordState, videoPlaying, onBusyChange]);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col">
      <TopBar onBack={onBack} onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 px-8 pt-20 pb-8 max-w-2xl mx-auto w-full">
        <h2 className="text-[var(--app-text)] mb-2 text-center">Record Your Invitation</h2>
        <p className="text-center text-sm text-[var(--app-text-40)] mb-1">
          Categories: <span className="text-[#e07b00]">{categories.join(", ")}</span>
        </p>
        <p className="text-[var(--app-text-40)] text-sm mb-5 text-center">
          Record a short invitation sharing what you'd like to do with a possible buddy.
        </p>

        <div className="flex gap-6">
          <div className="flex-1 flex flex-col gap-3">
            <LiveVideoRecorder
              state={recordState}
              elapsed={elapsed}
              maxSeconds={60}
              fmt={fmt}
              videoRef={videoRef}
              playbackUrl={playbackUrl}
              error={error}
              onVideoActiveChange={setVideoPlaying}
            />

            {recordState === "idle" && (
              <button
                onClick={startRecording}
                className="w-full bg-[#e05555] hover:bg-[#cc4444] text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <div className="w-3 h-3 bg-white rounded-full" /> Record
              </button>
            )}
            {recordState === "recording" && (
              <button
                onClick={stopRecording}
                className="w-full bg-[var(--app-elevated)] hover:bg-[var(--app-elevated-hi)] text-[var(--app-text)] py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-[var(--app-border-hi)]"
              >
                ⬛ Stop
              </button>
            )}
            {recordState === "done" && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={retake}
                    className="flex-1 border border-[var(--app-border)] text-[var(--app-text-60)] py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--app-surface-alt)] transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Retake
                  </button>
                  <button
                    onClick={() => onSave(elapsed, playbackUrl, recordedBlob)}
                    disabled={!playbackUrl}
                    className={`flex-1 py-3 rounded-xl transition-colors ${playbackUrl ? "bg-[#e07b00] hover:bg-[#c96e00] text-white" : "bg-[var(--app-surface-alt)] text-[var(--app-text-40)] cursor-not-allowed"}`}
                  >
                    {playbackUrl ? "Save & Continue" : "Preparing video…"}
                  </button>
                </div>
                {!playbackUrl && (
                  <p className="text-xs text-[var(--app-text-30)]">Please wait while your recording is processed before continuing.</p>
                )}
              </div>
            )}
          </div>

          <div className="w-48 flex-shrink-0">
            <p className="text-xs text-[var(--app-text-30)] mb-2 uppercase tracking-wide">Suggestions:</p>
            <ul className="space-y-2">
              {getSuggestions(categories).map((s) => (
                <li
                  key={s}
                  className="text-xs text-[var(--app-text-50)] bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-lg px-3 py-2 leading-relaxed select-none"
                >
                  • {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
