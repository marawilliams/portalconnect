import { Send } from "lucide-react";
import { TopBar } from "../components/TopBar";

interface Props {
  language: string;
  onBrowseMore: () => void;
  onExit: () => void;
  onLanguageChange?: (lang: string) => void;
  onBack: () => void;
}

export function InterestSentScreen({ language, onLanguageChange, onBrowseMore, onExit, onBack }: Props) {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col">
      <TopBar onBack={onBack} onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-8 max-w-sm mx-auto w-full text-center">
        <div className="w-20 h-20 bg-[#e07b00]/20 rounded-full flex items-center justify-center mb-6">
          <Send className="w-9 h-9 text-[#e07b00]" strokeWidth={1.5} />
        </div>
        <h2 className="text-[var(--app-text)] mb-4">Response Sent</h2>
        <p className="text-[var(--app-text-50)] text-sm mb-4 leading-relaxed">
          The original creator will review your response before any contact information is shared.
        </p>
        <p className="text-[var(--app-text-50)] text-sm mb-10 leading-relaxed">
          If your response is accepted, you'll receive an email with connection details and next steps.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onBrowseMore}
            className="w-full bg-[#e07b00] hover:bg-[#c96e00] text-white py-4 rounded-xl font-medium transition-colors"
          >
            Browse More Invitations
          </button>
          <button
            onClick={onExit}
            className="w-full bg-[var(--app-surface-alt)] hover:bg-[var(--app-elevated)] border border-[var(--app-border)] text-[var(--app-text-60)] py-4 rounded-xl font-medium transition-colors"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
