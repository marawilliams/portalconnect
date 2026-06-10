import { AlertTriangle, User } from "lucide-react";
import { TopBar } from "../components/TopBar";
import type { Invitation } from "./ExploreInvitationsScreen";

interface Props {
  invitation: Invitation;
  language: string;
  onConfirm: () => void;
  onBack: () => void;
  onExit: () => void;
  onLanguageChange?: (lang: string) => void;
}

export function ConfirmConnectScreen({ invitation, language, onLanguageChange, onConfirm, onBack, onExit }: Props) {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col">
      <TopBar onBack={onBack} onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-10 max-w-lg mx-auto w-full text-center">

        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: invitation.avatarColor + "44" }}
        >
          <User className="w-12 h-12 text-[var(--app-text-50)]" strokeWidth={1.5} />
        </div>

        <p className="text-[#e07b00] text-base mb-2 font-medium">{invitation.name || "Anonymous"}</p>
        <p className="text-[var(--app-text)] text-xl mb-8 leading-snug">"{invitation.invitationTitle}"</p>

        {/* Warning box */}
        <div className="w-full bg-[var(--app-surface-alt)] border-2 border-[#e07b00]/40 rounded-2xl px-6 py-5 mb-8 text-left">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[#e07b00] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[var(--app-text)] text-lg font-semibold mb-2">Before you connect</p>
              <ul className="space-y-2 text-[var(--app-text-60)] text-base">
                <li>• Have you watched this person's full invitation video?</li>
                <li>• Are you genuinely interested in this activity?</li>
                <li>• Are you comfortable meeting this person in person?</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-[var(--app-text)] text-2xl font-semibold mb-2">
          Are you sure you would like to connect?
        </p>
        <p className="text-[var(--app-text-50)] text-base mb-10 leading-relaxed">
          You will record a short response video introducing yourself. The other person will review it before any contact details are shared.
        </p>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={onConfirm}
            className="w-full bg-[#e07b00] hover:bg-[#c96e00] text-white py-5 rounded-2xl text-xl font-semibold transition-colors"
          >
            Yes — Record My Response
          </button>
          <button
            onClick={onBack}
            className="w-full bg-[var(--app-surface-alt)] hover:bg-[var(--app-elevated)] border-2 border-[var(--app-border)] text-[var(--app-text-60)] py-5 rounded-2xl text-xl font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
