import { Shield, Heart, Globe } from "lucide-react";
import { TopBar } from "../components/TopBar";

interface Props {
  language: string;
  onContinue: () => void;
  onBack: () => void;
  onExit: () => void;
  onLanguageChange?: (lang: string) => void;
}

export function AboutStoryScreen({ language, onLanguageChange, onContinue, onBack, onExit }: Props) {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col">
      <TopBar onBack={onBack} onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 px-8 pt-20 pb-8 max-w-2xl mx-auto w-full">
        <h2 className="text-[var(--app-text)] mb-8 text-center">About Portal Connect</h2>

        <div className="mb-5 p-5 bg-[var(--app-surface-alt)] rounded-xl border border-[var(--app-border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#e07b00] rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <h3 className="text-[var(--app-text)]">Our Mission</h3>
          </div>
          <p className="text-[var(--app-text-55)] text-sm leading-relaxed mb-2">
            Portal Connect helps locals and travelers create meaningful real-world connections through shared experiences, interests, and activities.
          </p>
          <p className="text-[var(--app-text-55)] text-sm leading-relaxed">
            Rather than endlessly scrolling online, users can discover people currently exploring the same city, share invitations, and create new memories together.
          </p>
        </div>

        <div className="mb-5 p-5 bg-[var(--app-surface-alt)] rounded-xl border border-[var(--app-border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#e07b00] rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <h3 className="text-[var(--app-text)]">Privacy &amp; Safety</h3>
          </div>
          <p className="text-[var(--app-text-55)] text-sm leading-relaxed mb-2">
            Privacy and user safety are central to Portal Connect. Your email address is never publicly displayed.
          </p>
          <p className="text-[var(--app-text-55)] text-sm mb-2">You will only receive an email notification if:</p>
          <ul className="text-[var(--app-text-55)] text-sm space-y-1 mb-2 list-disc list-inside">
            <li>someone replies to your invitation, or</li>
            <li>a person accepts your response to their invitation.</li>
          </ul>
          <p className="text-[var(--app-text-55)] text-sm leading-relaxed">
            Contact information is only shared after both participants choose to connect. Portal Connect does not send spam.
          </p>
        </div>

        <div className="mb-8 p-5 bg-[var(--app-surface-alt)] rounded-xl border border-[var(--app-border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#e07b00] rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <h3 className="text-[var(--app-text)]">Cultural Context</h3>
          </div>
          <p className="text-[var(--app-text-55)] text-sm leading-relaxed mb-2">
            Portal Connect is designed for destinations where people from different cultures, backgrounds, and countries naturally cross paths.
          </p>
          <p className="text-[var(--app-text-55)] text-sm leading-relaxed">
            By helping locals and visitors connect through common interests, Portal Connect encourages cultural exchange, community engagement, and memorable experiences beyond traditional tourism.
          </p>
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-[#e07b00] hover:bg-[#c96e00] text-white py-4 rounded-xl text-base font-medium transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
