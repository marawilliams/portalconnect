import { Video, Search, Users } from "lucide-react";
import { TopBar } from "../components/TopBar";

interface Props {
  language: string;
  onStart: () => void;
  onExit: () => void;
  onLanguageChange?: (lang: string) => void;
}

export function WelcomeScreen({ language, onLanguageChange, onStart, onExit }: Props) {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col">
      <TopBar onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-8 text-center max-w-xl mx-auto w-full">

        <div className="mb-8">
          <p className="text-[#e07b00] text-sm tracking-widest uppercase mb-3">Heraklion, Crete</p>
          <h1 style={{ fontSize: "3.5rem", lineHeight: 1.05, fontWeight: 800, letterSpacing: "-0.02em" }} className="text-[var(--app-text)] mb-0">
            Portal<br />Connect
          </h1>
        </div>

        <p className="text-[var(--app-text-50)] text-sm mb-10 leading-relaxed max-w-xs">
          Connect with locals and travelers through shared video invitations and meaningful real-world experiences.
        </p>

        <div className="flex justify-center gap-12 mb-10">
          <div className="flex flex-col items-center gap-2">
            <Video className="w-8 h-8 text-[#e07b00]" strokeWidth={1.5} />
            <span className="text-xs text-[var(--app-text-40)] text-center leading-tight">Record an<br />invitation</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Search className="w-8 h-8 text-[#e07b00]" strokeWidth={1.5} />
            <span className="text-xs text-[var(--app-text-40)] text-center leading-tight">Discover<br />invitations</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Users className="w-8 h-8 text-[#e07b00]" strokeWidth={1.5} />
            <span className="text-xs text-[var(--app-text-40)] text-center leading-tight">Make<br />connections</span>
          </div>
        </div>

        <div className="mb-8 px-6 py-4 bg-[var(--app-surface-alt)] rounded-2xl border border-[var(--app-border)]">
          <p style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.1 }} className="text-[#e07b00]">
            42,346
          </p>
          <p className="text-[var(--app-text-40)] text-sm mt-1">invitations created so far</p>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-[#e07b00] hover:bg-[#c96e00] text-white py-4 rounded-xl text-base font-medium transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
