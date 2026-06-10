import { Shield, Mail } from "lucide-react";
import { TopBar } from "../components/TopBar";

interface Props {
  email: string;
  onEmailChange: (v: string) => void;
  onPublish: () => void;
  onBack: () => void;
  onExit: () => void;
  onLanguageChange?: (lang: string) => void;
  language: string;
}

export function StayConnectedScreen({
  email, onEmailChange, onPublish, onBack, onExit, language, onLanguageChange,
}: Props) {
  const hasEmail = email.trim().length > 0;

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col">
      <TopBar onBack={onBack} onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 flex flex-col justify-center px-8 pt-20 pb-10 max-w-lg mx-auto w-full">
        <h2 className="text-[var(--app-text)] mb-3 text-center text-3xl">Your Email Address</h2>
        <p className="text-[var(--app-text-50)] text-lg text-center mb-10 leading-relaxed">
          Required to publish your invitation.
        </p>

        <div className="flex items-center gap-4 bg-[var(--app-surface)] border-2 border-[var(--app-border)] rounded-2xl px-5 py-4 focus-within:border-[#e07b00] transition-colors mb-4">
          <Mail className="w-6 h-6 text-[#e07b00] flex-shrink-0" />
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 text-xl outline-none text-[var(--app-text)] placeholder-[var(--app-text-25)] bg-transparent"
          />
        </div>

        <div className="bg-[var(--app-surface-alt)] border border-[#e07b00]/30 rounded-2xl px-5 py-4 mb-10 flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#e07b00] flex-shrink-0 mt-0.5" />
          <p className="text-[var(--app-text-60)] text-base leading-relaxed">
            Your email is used only to let you know when someone wants to connect with you after leaving the booth. It is never publicly displayed or shared without your agreement.
          </p>
        </div>

        <button
          onClick={hasEmail ? onPublish : undefined}
          className={`w-full py-5 rounded-2xl text-xl font-semibold transition-colors ${
            hasEmail
              ? "bg-[#e07b00] hover:bg-[#c96e00] text-white"
              : "bg-[var(--app-surface-alt)] text-[var(--app-text-30)] border-2 border-[var(--app-border)] cursor-not-allowed"
          }`}
        >
          {hasEmail ? "Publish My Invitation" : "Enter your email to continue"}
        </button>
      </div>
    </div>
  );
}
