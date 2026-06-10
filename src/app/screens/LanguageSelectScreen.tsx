import { LANGUAGES } from "../data/languages";
import { FLAG_IMAGES } from "../data/flagImages";

const SVG_FLAGS: Record<string, JSX.Element> = {
  ru: (
    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="30" height="10" fill="#fff"/>
      <rect y="10" width="30" height="10" fill="#0039A6"/>
      <rect y="20" width="30" height="10" fill="#D52B1E"/>
    </svg>
  ),
  es: (
    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="30" height="30" fill="#c60b1e"/>
      <rect y="7.5" width="30" height="15" fill="#ffc400"/>
    </svg>
  ),
  sv: (
    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="30" height="30" fill="#006AA7"/>
      <rect x="10" width="4" height="30" fill="#FECC02"/>
      <rect y="13" width="30" height="4" fill="#FECC02"/>
    </svg>
  ),
  tr: (
    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="30" height="30" fill="#E30A17"/>
      <circle cx="13" cy="15" r="6" fill="#fff"/>
      <circle cx="15" cy="15" r="4.5" fill="#E30A17"/>
      <polygon points="20,15 22,13.5 22,16.5" fill="#fff"/>
      <polygon points="21,12 24,15 21,18 23,15" fill="#fff"/>
    </svg>
  ),
  uk: (
    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="30" height="15" fill="#005BBB"/>
      <rect y="15" width="30" height="15" fill="#FFD500"/>
    </svg>
  ),
};

interface Props {
  onSelect: (lang: string) => void;
}

export function LanguageSelectScreen({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col items-center justify-center p-8">
      <p className="text-[var(--app-text-40)] text-xs tracking-[0.3em] uppercase mb-3">Heraklion, Crete</p>
      <h1 className="mb-8 text-[var(--app-text)]">Choose Your Language</h1>
      <div className="grid grid-cols-6 gap-3 max-w-2xl w-full">
        {LANGUAGES.map((lang) => {
          const img = FLAG_IMAGES[lang.code];
          const svg = SVG_FLAGS[lang.code];
          return (
            <button
              key={lang.code}
              onClick={() => onSelect(lang.label)}
              className="bg-[var(--app-surface-alt)] hover:bg-[#e07b00] border border-[var(--app-border)] hover:border-[#e07b00] text-[var(--app-text)] px-3 py-3 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-200"
            >
              {img ? (
                <img src={img} alt={lang.label} className="w-8 h-8 rounded-full object-cover" />
              ) : svg ? (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">{svg}</div>
              ) : (
                <span className="text-2xl leading-none">{lang.flag}</span>
              )}
              <span className="text-xs">{lang.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
