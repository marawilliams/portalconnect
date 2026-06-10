import { useState, useEffect, useRef } from "react";
import { MapPin, User, Clock, AlertTriangle, PlayCircle } from "lucide-react";
import { TopBar } from "../components/TopBar";
import type { Invitation } from "./ExploreInvitationsScreen";

const REPLY_LIMIT = 3;
const DEFAULT_INVITATION_VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

interface Props {
  invitation: Invitation;
  language: string;
  onExpressInterest: () => void;
  onBack: () => void;
  onExit: () => void;
  onLanguageChange?: (lang: string) => void;
  onBusyChange?: (busy: boolean) => void;
  replyCount: number;
  alreadyReplied: boolean;
}

export function ViewInvitationScreen({ invitation, language, onLanguageChange, onExpressInterest, onBack, onExit, onBusyChange, replyCount, alreadyReplied }: Props) {
  const [videoWatched, setVideoWatched] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [previewComplete, setPreviewComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const atLimit = replyCount >= REPLY_LIMIT;

  const formatPostedTime = (timeline: string) => {
    switch (timeline) {
      case "Today":
        return "Posted 9 min ago";
      case "Tomorrow":
        return "Posted 1 hr ago";
      case "This Week":
        return "Posted 2 days ago";
      case "Next Week":
        return "Posted 5 days ago";
      default:
        return timeline;
    }
  };

  useEffect(() => {
    setVideoWatched(false);
    setVideoPlaying(false);
    setPreviewComplete(false);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
    }
  }, [invitation]);

  useEffect(() => {
    onBusyChange?.(videoPlaying);
  }, [videoPlaying, onBusyChange]);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col">
      <TopBar onBack={onBack} onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 px-8 pt-20 pb-8 max-w-md mx-auto w-full">

        {/* Prominent disclaimer */}
        <div className="flex items-start gap-3 bg-[#e07b00]/15 border-2 border-[#e07b00]/50 rounded-2xl px-4 py-3 mb-5">
          <AlertTriangle className="w-5 h-5 text-[#e07b00] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[#e07b00] font-semibold text-sm">Reply limit: {replyCount}/{REPLY_LIMIT} used</p>
            <p className="text-[var(--app-text-60)] text-xs mt-0.5 leading-relaxed">
              You may respond to a maximum of {REPLY_LIMIT} invitations per session. Watch the first 10 seconds before responding.
            </p>
          </div>
        </div>

        {/* Profile row */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: invitation.avatarColor + "44" }}
          >
            <User className="w-6 h-6 text-[var(--app-text-60)]" strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                invitation.tag === "Local" ? "bg-[#e07b00] text-white" : "bg-[var(--app-elevated)] text-[var(--app-text-70)]"
              }`}>
                {invitation.tag === "Local" ? <MapPin className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {invitation.tag}
              </span>
              {invitation.name && <span className="text-xs text-[#e07b00]">{invitation.name}</span>}
              <span className="text-xs text-[var(--app-text-30)]">{invitation.ageRange}</span>
            </div>
            <p className="text-sm text-[var(--app-text)] mt-0.5">{invitation.invitationTitle}</p>
          </div>
        </div>

        {invitation.timeline && (
          <div className="flex items-center gap-1.5 mb-4 text-sm bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-lg px-3 py-2">
            <Clock className="w-4 h-4 text-[#e07b00]" />
            <span className="text-[var(--app-text-80)]">{formatPostedTime(invitation.timeline)}</span>
          </div>
        )}

        {/* Video player */}
        <div className="mb-2">
          <div className="relative rounded-xl overflow-hidden bg-[var(--app-surface)] border border-[var(--app-border)]" style={{ aspectRatio: "16/9" }}>
            <video
              ref={videoRef}
              src={invitation.videoDataUrl ?? invitation.videoUrl ?? DEFAULT_INVITATION_VIDEO}
              controls
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              onPlay={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
              onEnded={() => {
                setVideoPlaying(false);
                setVideoWatched(true);
                setPreviewComplete(true);
              }}
              onTimeUpdate={(e) => {
                const current = e.currentTarget.currentTime;
                if (!previewComplete && current >= 10) {
                  e.currentTarget.pause();
                  setPreviewComplete(true);
                  setVideoWatched(true);
                  setVideoPlaying(false);
                }
              }}
            />
            {previewComplete && (
              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs text-center py-2">
                Video preview ended at 10 seconds.
              </div>
            )}
          </div>
        </div>

        {/* Watch prompt */}
        {!videoWatched && (
          <div className="flex items-center gap-2 mb-4 bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-xl px-4 py-2.5">
            <PlayCircle className="w-4 h-4 text-[#e07b00] flex-shrink-0" />
            <p className="text-xs text-[var(--app-text-50)]">Watch the first 10 seconds to unlock the respond button.</p>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {invitation.tags.map(t => (
            <span key={t} className="text-xs bg-[#e07b00]/20 text-[#e07b00] px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>

        <div className="bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-xl px-4 py-3 mb-6">
          <p className="text-xs text-[var(--app-text-30)] uppercase tracking-wide mb-1">Transcript</p>
          <p className="text-sm text-[var(--app-text-60)] italic">"{invitation.description}"</p>
        </div>

        {alreadyReplied ? (
          <div className="w-full bg-[#e07b00]/10 border-2 border-[#e07b00]/40 text-[#e07b00] py-4 rounded-xl font-medium text-center text-sm">
            ✓ You already responded to this invitation
          </div>
        ) : atLimit ? (
          <div className="w-full text-center">
            <div className="w-full bg-[var(--app-surface-alt)] border border-[var(--app-border)] text-[var(--app-text-40)] py-4 rounded-xl font-medium text-sm cursor-not-allowed">
              Response limit reached ({REPLY_LIMIT}/{REPLY_LIMIT})
            </div>
          </div>
        ) : !videoWatched ? (
          <div className="w-full bg-[var(--app-surface-alt)] border-2 border-[var(--app-border)] text-[var(--app-text-30)] py-4 rounded-xl font-medium text-center text-sm cursor-not-allowed">
            Watch the full video to respond
          </div>
        ) : (
          <button
            onClick={onExpressInterest}
            className="w-full bg-[#e07b00] hover:bg-[#c96e00] text-white py-4 rounded-xl font-medium transition-colors"
          >
            Respond to Invitation
          </button>
        )}
      </div>
    </div>
  );
}
