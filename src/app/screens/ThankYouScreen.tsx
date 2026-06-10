import { useState } from "react";
import { Camera, Mail } from "lucide-react";

interface Props {
  onRestart: () => void;
}

export function ThankYouScreen({ onRestart }: Props) {
  const [showStrip, setShowStrip] = useState(false);

  if (showStrip) {
    return (
      <div className="min-h-screen bg-[var(--app-surface)] flex flex-col items-center justify-center px-8 text-center">
        <div className="max-w-xs w-full">
          <p className="text-[var(--app-text-60)] text-xs uppercase tracking-widest mb-4">Portal Connect</p>
          <h2 className="text-[var(--app-text)] mb-6">Your Photo Strip</h2>
          <div className="bg-white rounded-2xl p-4 mb-6 flex flex-col items-center gap-2 shadow-2xl">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full h-28 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm"
              >
                📸 Photo {i}
              </div>
            ))}
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-400">Portal Connect</p>
              <p className="text-xs text-gray-300">Heraklion, Crete</p>
            </div>
          </div>
          <button
            onClick={onRestart}
            className="w-full bg-[#e07b00] hover:bg-[#c96e00] text-white py-4 rounded-xl font-medium transition-colors"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col items-center justify-center px-8 text-center">
      <div className="max-w-sm w-full">
        <div className="w-20 h-20 bg-[#e07b00]/20 border border-[#e07b00]/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>
        <h2 className="text-[var(--app-text)] mb-3 leading-snug">
          Thank You for Using Portal Connect
        </h2>
        <p className="text-[var(--app-text-40)] text-sm mb-6 leading-relaxed">
          We'll send an email with:
        </p>
        <div className="bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-xl p-4 mb-8 text-left space-y-2">
          {["Next steps and important information", "Your privacy controls", "A secure link to your invitation"].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-[#e07b00] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--app-text-60)]">{item}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowStrip(true)}
            className="w-full bg-[#e07b00] hover:bg-[#c96e00] text-white py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Take Complimentary Photo Strip
          </button>
          <button
            onClick={onRestart}
            className="w-full bg-[var(--app-surface-alt)] hover:bg-[var(--app-elevated)] border border-[var(--app-border)] text-[var(--app-text-60)] py-4 rounded-xl font-medium transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
