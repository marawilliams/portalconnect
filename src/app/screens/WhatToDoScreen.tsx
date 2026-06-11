import { TopBar } from "../components/TopBar";

interface Props {
  language: string;
  onCreateInvite: () => void;
  onExit: () => void;
  onLanguageChange?: (lang: string) => void;
  onBack: () => void;
}

export function WhatToDoScreen({ language, onCreateInvite, onExit, onBack, onLanguageChange }: Props) {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col">
      <TopBar onBack={onBack} onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-8 max-w-sm mx-auto w-full text-center">
        <h2 className="text-[var(--app-text)] mb-6">Are you ready to record?</h2>
        <div className="border border-[#e07b00]/40 bg-[#e07b00]/10 rounded-xl px-4 py-3 mb-8 text-sm text-[var(--app-text-60)] text-center">
          You must record an invitation before you can look at potential buddies
        </div>
        <button
          onClick={onCreateInvite}
          className="w-full bg-[#e07b00] hover:bg-[#c96e00] text-white py-4 rounded-xl mb-4 transition-colors font-medium"
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
}
