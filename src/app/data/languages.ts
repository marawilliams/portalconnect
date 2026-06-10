export interface Language {
  code: string;
  label: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "ar", label: "Arabic",     flag: "🇸🇦" },
  { code: "zh", label: "Chinese",    flag: "🇨🇳" },
  { code: "nl", label: "Dutch",      flag: "🇳🇱" },
  { code: "en", label: "English",    flag: "🇬🇧" },
  { code: "fr", label: "French",     flag: "🇫🇷" },
  { code: "de", label: "German",     flag: "🇩🇪" },
  { code: "el", label: "Greek",      flag: "🇬🇷" },
  { code: "he", label: "Hebrew",     flag: "🇮🇱" },
  { code: "it", label: "Italian",    flag: "🇮🇹" },
  { code: "ja", label: "Japanese",   flag: "🇯🇵" },
  { code: "ko", label: "Korean",     flag: "🇰🇷" },
  { code: "pl", label: "Polish",     flag: "🇵🇱" },
  { code: "pt", label: "Portuguese", flag: "🇵🇹" },
  { code: "ru", label: "Russian",    flag: "🇷🇺" },
  { code: "es", label: "Spanish",    flag: "🇪🇸" },
  { code: "sv", label: "Swedish",    flag: "🇸🇪" },
  { code: "tr", label: "Turkish",    flag: "🇹🇷" },
  { code: "uk", label: "Ukrainian",  flag: "🇺🇦" },
];

export function findLanguage(label: string): Language {
  return LANGUAGES.find((l) => l.label === label) ?? LANGUAGES[3];
}
