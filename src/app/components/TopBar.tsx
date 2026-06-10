import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe, Sun, Moon } from "lucide-react";
import { LANGUAGES, findLanguage } from "../data/languages";
import { FLAG_IMAGES } from "../data/flagImages";
import { useTheme } from "../context/ThemeContext";

interface Props {
  onBack?: () => void;
  onExit?: () => void;
  language?: string;
  onLanguageChange?: (lang: string) => void;
  showLanguage?: boolean;
}

const SVG_FLAGS: Record<string, JSX.Element> = {
  ru: (
    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="10" fill="#fff"/>
      <rect y="10" width="30" height="10" fill="#0039A6"/>
      <rect y="20" width="30" height="10" fill="#D52B1E"/>
    </svg>
  ),
  es: (
    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="30" fill="#c60b1e"/>
      <rect y="7.5" width="30" height="15" fill="#ffc400"/>
    </svg>
  ),
  sv: (
    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="30" fill="#006AA7"/>
      <rect x="10" width="4" height="30" fill="#FECC02"/>
      <rect y="13" width="30" height="4" fill="#FECC02"/>
    </svg>
  ),
  tr: (
    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="30" fill="#E30A17"/>
      <circle cx="13" cy="15" r="6" fill="#fff"/>
      <circle cx="15" cy="15" r="4.5" fill="#E30A17"/>
      <polygon points="20,15 22,13.5 22,16.5" fill="#fff"/>
      <polygon points="21,12 24,15 21,18 23,15" fill="#fff"/>
    </svg>
  ),
  uk: (
    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="15" fill="#005BBB"/>
      <rect y="15" width="30" height="15" fill="#FFD500"/>
    </svg>
  ),
};

function FlagIcon({ code, flag, size = "sm" }: { code: string; flag: string; size?: "sm" | "lg" }) {
  const img = FLAG_IMAGES[code];
  const dim = size === "lg" ? "w-7 h-7" : "w-5 h-5";
  if (img) {
    return <img src={img} alt={flag} className={`${dim} rounded-full object-cover flex-shrink-0`} />;
  }
  const svg = SVG_FLAGS[code];
  if (svg) {
    return (
      <div className={`${dim} rounded-full overflow-hidden flex-shrink-0`}>
        {svg}
      </div>
    );
  }
  return <span className={size === "lg" ? "text-xl leading-none" : "text-base leading-none"}>{flag}</span>;
}

export function TopBar({
  onBack,
  onExit,
  language = "English",
  onLanguageChange,
  showLanguage = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = findLanguage(language);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const select = (label: string) => {
    onLanguageChange?.(label);
    setOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--app-surface)] flex items-center justify-between px-4 py-2.5 min-h-[52px] shadow-lg border-b border-[var(--app-border)]">
      {/* Back */}
      <div className="w-36">
        {onBack && (
          <button
            onClick={onBack}
            className="text-[var(--app-text)] text-sm font-medium flex items-center gap-2 bg-[var(--app-elevated)] hover:bg-[var(--app-elevated-hi)] px-3 py-2 rounded-lg transition-colors"
          >
            ← Back
          </button>
        )}
      </div>

      {/* Center: brand */}
      <span className="text-[var(--app-text-60)] text-xs tracking-widest uppercase select-none">Portal Connect</span>

      {/* Right side: theme toggle + language picker + exit */}
      <div className="flex items-center gap-2 w-36 justify-end">
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--app-elevated)] hover:bg-[var(--app-elevated-hi)] text-[var(--app-text-60)] hover:text-[var(--app-text)] transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {showLanguage && (
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-1.5 bg-[var(--app-elevated)] hover:bg-[var(--app-elevated-hi)] text-[var(--app-text)] text-xs px-3 py-2 rounded-lg transition-colors"
            >
              <FlagIcon code={current.code} flag={current.flag} size="sm" />
              <Globe className="w-3 h-3 opacity-60" />
              <ChevronDown className={`w-3 h-3 opacity-60 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--app-surface-alt)] rounded-xl shadow-2xl border border-[var(--app-border)] overflow-hidden z-50">
                <div className="px-3 py-2 border-b border-[var(--app-border)]">
                  <p className="text-xs text-[var(--app-text-30)] uppercase tracking-wider">Select language</p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => select(lang.label)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-[var(--app-elevated)] ${
                        lang.label === language ? "bg-[#e07b00]/10 text-[#e07b00]" : "text-[var(--app-text-70)]"
                      }`}
                    >
                      <FlagIcon code={lang.code} flag={lang.flag} size="lg" />
                      <span>{lang.label}</span>
                      {lang.label === language && (
                        <span className="ml-auto text-[#e07b00] text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {onExit && (
          <button
            onClick={onExit}
            className="bg-[#e05555] hover:bg-[#cc4444] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            EXIT
          </button>
        )}
      </div>
    </div>
  );
}
