import { useState } from "react";
import { Video, Eye, Handshake } from "lucide-react";
import { TopBar } from "../components/TopBar";

const SLIDES = [
  {
    icon: <Video className="w-16 h-16 text-[#e07b00]" strokeWidth={1.5} />,
    text: (
      <>
        Record an <strong>invitation</strong> about activities you would like to do with a buddy
      </>
    ),
  },
  {
    icon: <Eye className="w-16 h-16 text-[#e07b00]" strokeWidth={1.5} />,
    text: (
      <>
        Discover stories from other people after you share yours
      </>
    ),
  },
  {
    icon: <span className="text-6xl">🤝</span>,
    text: (
      <>
        Reply to <strong>invitations</strong> by expressing interest and connect only when both buddies agree
      </>
    ),
  },
];

interface Props {
  language: string;
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
  onLanguageChange?: (lang: string) => void;
  onSkip: () => void;
}

export function TutorialScreen({ language, onLanguageChange, onNext, onBack, onExit, onSkip }: Props) {
  const [slide, setSlide] = useState(0);

  const goNext = () => {
    if (slide < SLIDES.length - 1) setSlide(slide + 1);
    else onNext();
  };

  const goPrev = () => {
    if (slide > 0) setSlide(slide - 1);
    else onBack();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar onBack={onBack} onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-8 text-center max-w-xl mx-auto w-full">
        <h2 className="text-gray-900 mb-12">How it works</h2>
        <div className="flex justify-center mb-8">{SLIDES[slide].icon}</div>
        <p className="text-gray-600 text-base mb-12 leading-relaxed max-w-xs">
          {SLIDES[slide].text}
        </p>
        <div className="flex gap-2 mb-12">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slide ? "w-8 bg-[#e07b00]" : "w-4 bg-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 w-full max-w-sm">
          <button
            onClick={slide > 0 ? goPrev : undefined}
            disabled={slide === 0}
            className={`w-10 h-10 rounded flex items-center justify-center text-sm transition-colors flex-shrink-0 ${
              slide === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#e07b00] hover:bg-[#c96e00] text-white"
            }`}
          >
            &lt;
          </button>
          <button
            onClick={slide < SLIDES.length - 1 ? goNext : undefined}
            disabled={slide === SLIDES.length - 1}
            className={`w-10 h-10 rounded flex items-center justify-center text-sm transition-colors flex-shrink-0 ${
              slide === SLIDES.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#e07b00] hover:bg-[#c96e00] text-white"
            }`}
          >
            &gt;
          </button>
          <button
            onClick={slide === SLIDES.length - 1 ? onNext : onSkip}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded text-sm transition-colors"
          >
            {slide === SLIDES.length - 1 ? "Next" : "Skip"}
          </button>
        </div>
      </div>
    </div>
  );
}
