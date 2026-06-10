import { TopBar } from "../components/TopBar";

export const ALL_CATEGORIES = [
  "Food & Dining", "Sports", "Hiking", "Arts & Culture",
  "Music", "Nightlife", "History", "Photography",
  "Shopping", "Language Exchange", "Exploring the City", "Custom Category",
];

interface Props {
  selected: string[];
  onChange: (s: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
  onExit: () => void;
  onLanguageChange?: (lang: string) => void;
  language: string;
}

export function SelectInterestsScreen({ selected, onChange, onContinue, onBack, onExit, language, onLanguageChange }: Props) {
  const MAX = 3;
  const toggle = (cat: string) => {
    if (selected.includes(cat)) {
      onChange(selected.filter((s) => s !== cat));
    } else if (selected.length < MAX) {
      onChange([...selected, cat]);
    }
  };

  const leftCol = ALL_CATEGORIES.filter((_, i) => i % 2 === 0);
  const rightCol = ALL_CATEGORIES.filter((_, i) => i % 2 !== 0);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col">
      <TopBar onBack={onBack} onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 px-8 pt-20 pb-8 max-w-xl mx-auto w-full flex flex-col">
        <h2 className="text-[var(--app-text)] text-center mb-1">What would you like to explore?</h2>
        <p className="text-[var(--app-text-50)] text-sm text-center mb-2">
          Pick up to 3 categories. These match you with like-minded people and describe your invitation.
        </p>
        <p className="text-center text-xs mb-4 h-4">
          {selected.length === 0
            ? <span className="text-[var(--app-text-30)]">No categories selected yet</span>
            : selected.length < 3
            ? <span className="text-[#e07b00]">{selected.join(", ")} · {3 - selected.length} more allowed</span>
            : <span className="text-[#e07b00]">{selected.join(", ")} · max reached</span>
          }
        </p>
        <div className="flex gap-3 flex-1 mb-6">
          <div className="flex flex-col gap-3 flex-1">
            {leftCol.map((cat) => (
              <button
                key={cat}
                onClick={() => toggle(cat)}
                className={`py-3 px-4 rounded-lg text-sm text-left transition-all duration-200 ${
                  selected.includes(cat)
                    ? "bg-[#e07b00] text-white border border-[#e07b00]"
                    : selected.length >= MAX
                    ? "bg-[var(--app-surface)] text-[var(--app-text-20)] border border-[var(--app-border)] cursor-not-allowed"
                    : "bg-[var(--app-surface-alt)] text-[var(--app-text-70)] border border-[var(--app-border)] hover:border-[#e07b00]/50 hover:text-[var(--app-text)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {rightCol.map((cat) => (
              <button
                key={cat}
                onClick={() => toggle(cat)}
                className={`py-3 px-4 rounded-lg text-sm text-left transition-all duration-200 ${
                  selected.includes(cat)
                    ? "bg-[#e07b00] text-white border border-[#e07b00]"
                    : selected.length >= MAX
                    ? "bg-[var(--app-surface)] text-[var(--app-text-20)] border border-[var(--app-border)] cursor-not-allowed"
                    : "bg-[var(--app-surface-alt)] text-[var(--app-text-70)] border border-[var(--app-border)] hover:border-[#e07b00]/50 hover:text-[var(--app-text)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => selected.length > 0 && onContinue()}
          className={`w-full py-4 rounded-xl text-base font-medium transition-colors ${
            selected.length > 0
              ? "bg-[#e07b00] hover:bg-[#c96e00] text-white"
              : "bg-[var(--app-surface-alt)] text-[var(--app-text-30)] border border-[var(--app-border)] cursor-not-allowed"
          }`}
        >
          {selected.length > 0 ? "Continue" : "Select at least one category"}
        </button>
      </div>
    </div>
  );
}
