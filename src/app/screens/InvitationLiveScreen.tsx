import { CheckCircle, Users } from "lucide-react";
import { TopBar } from "../components/TopBar";

interface Props {
  onExplore: () => void;
  onFinish: () => void;
  onExit: () => void;
  onLanguageChange?: (lang: string) => void;
  language: string;
}

export function InvitationLiveScreen({ onExplore, onFinish, onExit, language, onLanguageChange }: Props) {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col">
      <TopBar onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-10 max-w-sm mx-auto w-full text-center">

        <CheckCircle className="w-24 h-24 text-[#e07b00] mb-6" strokeWidth={1.5} />

        <h2 className="text-[var(--app-text)] mb-4 text-3xl">Your video is live!</h2>

        <p className="text-[var(--app-text-60)] text-xl mb-4 leading-relaxed">
          Your invitation has been posted.
        </p>

        <div className="w-full bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-2xl px-5 py-5 mb-10 flex items-center gap-4">
          <Users className="w-8 h-8 text-[#e07b00] flex-shrink-0" />
          <p className="text-[var(--app-text)] text-lg text-left leading-snug">
            People with similar interests have already been matched to you. Browse their invitations below.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={onExplore}
            className="w-full bg-[#e07b00] hover:bg-[#c96e00] text-white py-5 rounded-2xl text-xl font-semibold transition-colors"
          >
            Browse Matched Invitations
          </button>
          <button
            onClick={onFinish}
            className="w-full bg-[var(--app-surface-alt)] hover:bg-[var(--app-elevated)] border-2 border-[var(--app-border)] text-[var(--app-text-60)] py-5 rounded-2xl text-xl font-medium transition-colors"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
