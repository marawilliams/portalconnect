import { useState, useEffect, useRef } from "react";
import { Video, CheckCircle, Eye, MapPin, User, Mail, RotateCcw } from "lucide-react";
import { TopBar } from "../components/TopBar";

interface Props {
  language: string;
  onContinue: () => void;
  onBack: () => void;
  onExit: () => void;
  onLanguageChange?: (lang: string) => void;
}

// Animated cursor dot
function Cursor({ x, y, clicking }: { x: number; y: number; clicking: boolean }) {
  return (
    <div
      className="pointer-events-none absolute z-50 transition-all duration-500 ease-in-out"
      style={{ left: x, top: y, transform: "translate(-4px, -4px)" }}
    >
      <div className={`w-5 h-5 rounded-full border-2 border-white shadow-lg transition-all duration-150 ${clicking ? "scale-75 bg-[#e07b00]" : "bg-[#e07b00]/80"}`} />
    </div>
  );
}

// Step 1: Fill profile + pick categories + type title
function Step1Preview() {
  const [role, setRole] = useState<string>("");
  const [cats, setCats] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [cursor, setCursor] = useState({ x: 60, y: 30 });
  const [clicking, setClicking] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const FULL_TITLE = "Looking for a Food Adventure";
  const ALL_CATS = ["Food & Dining", "Hiking", "Arts & Culture"];

  useEffect(() => {
    const seq = async () => {
      const wait = (ms: number) => new Promise<void>((r) => { t.current = setTimeout(r, ms); });
      const click = async (x: number, y: number, cb: () => void) => {
        setCursor({ x, y });
        await wait(700);
        setClicking(true);
        await wait(200);
        cb();
        setClicking(false);
        await wait(300);
      };

      while (true) {
        setRole(""); setCats([]); setTitle(""); setCursor({ x: 60, y: 30 });
        await wait(600);

        // click Tourist
        await click(72, 52, () => setRole("Tourist"));

        // click categories one by one
        for (let i = 0; i < ALL_CATS.length; i++) {
          await click(30 + i * 70, 130, () => setCats((prev) => [...prev, ALL_CATS[i]]));
          await wait(200);
        }

        // move to title field and type
        setCursor({ x: 200, y: 175 });
        await wait(700);
        for (let i = 0; i <= FULL_TITLE.length; i++) {
          setTitle(FULL_TITLE.slice(0, i));
          await wait(55);
        }
        await wait(2000);
      }
    };
    seq();
    return () => { if (t.current) clearTimeout(t.current); };
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden bg-[var(--app-surface)] border border-[var(--app-border)] p-4 text-left select-none" style={{ minHeight: 220 }}>
      <Cursor x={cursor.x} y={cursor.y} clicking={clicking} />
      <p className="text-xs text-[var(--app-text-40)] uppercase tracking-wide mb-3">Who are you?</p>
      <div className="flex gap-2 mb-4">
        {["Tourist", "Local"].map((r) => (
          <div key={r} className={`flex-1 py-2 rounded-lg text-xs text-center font-medium transition-all duration-300 ${role === r ? "bg-[#e07b00] text-white shadow-md" : "bg-[var(--app-elevated)] text-[var(--app-text-40)]"}`}>
            {r}
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--app-text-40)] mb-2">Select interests</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {ALL_CATS.map((c) => (
          <div key={c} className={`text-xs px-2 py-1 rounded-md transition-all duration-300 ${cats.includes(c) ? "bg-[#e07b00] text-white scale-105" : "bg-[var(--app-elevated)] text-[var(--app-text-40)]"}`}>
            {c}
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--app-text-40)] mb-1">Name your video</p>
      <div className="h-8 bg-[var(--app-bg)] border border-[var(--app-border-hi)] rounded-lg px-3 flex items-center text-xs text-[var(--app-text-70)]">
        {title}<span className="animate-pulse text-[#e07b00]">|</span>
      </div>
    </div>
  );
}

// Step 2: Record timer counting up, then switch to player with moving scrubber
function Step2Preview() {
  const [phase, setPhase] = useState<"idle" | "recording" | "playing">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [scrubber, setScrubber] = useState(0);
  const [cursor, setCursor] = useState({ x: 150, y: 185 });
  const [clicking, setClicking] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iv = useRef<ReturnType<typeof setInterval> | null>(null);
  const MAX = 30;

  useEffect(() => {
    const seq = async () => {
      const wait = (ms: number) => new Promise<void>((r) => { t.current = setTimeout(r, ms); });

      while (true) {
        setPhase("idle"); setElapsed(0); setScrubber(0); setCursor({ x: 150, y: 185 });
        await wait(800);

        // move cursor to Record button
        setCursor({ x: 150, y: 185 });
        await wait(600);
        setClicking(true);
        await wait(200);
        setClicking(false);
        setPhase("recording");

        // count up
        await new Promise<void>((resolve) => {
          let e = 0;
          iv.current = setInterval(() => {
            e++;
            setElapsed(e);
            if (e >= MAX) { clearInterval(iv.current!); resolve(); }
          }, 80);
        });

        // click stop
        setCursor({ x: 150, y: 185 });
        await wait(400);
        setClicking(true);
        await wait(200);
        setClicking(false);
        setPhase("playing");
        setScrubber(0);

        // play scrubber
        await new Promise<void>((resolve) => {
          let s = 0;
          iv.current = setInterval(() => {
            s += 2;
            setScrubber(Math.min(s, 100));
            if (s >= 100) { clearInterval(iv.current!); resolve(); }
          }, 60);
        });

        await wait(1500);
      }
    };
    seq();
    return () => {
      if (t.current) clearTimeout(t.current);
      if (iv.current) clearInterval(iv.current);
    };
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="relative rounded-xl overflow-hidden select-none" style={{ minHeight: 220 }}>
      <Cursor x={cursor.x} y={cursor.y} clicking={clicking} />
      {phase === "idle" && (
        <div className="h-36 bg-gray-200 rounded-xl flex items-center justify-center mb-3">
          <Video className="w-10 h-10 text-gray-400" strokeWidth={1} />
        </div>
      )}
      {phase === "recording" && (
        <div className="h-36 bg-gray-800 rounded-xl flex items-center justify-center relative mb-3 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 animate-ping" />
          </div>
          <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center relative z-10">
            <span className="text-2xl">👩</span>
          </div>
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white text-xs font-medium">REC</span>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-lg">
            {fmt(elapsed)} / 1:00
          </div>
        </div>
      )}
      {phase === "playing" && (
        <div className="h-36 bg-gray-800 rounded-xl flex items-center justify-center relative mb-3 overflow-hidden">
          <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-2xl">👩</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-white text-xs">▶</span>
              <div className="flex-1 h-1 bg-white/30 rounded-full">
                <div className="h-1 bg-[#e07b00] rounded-full transition-all duration-100" style={{ width: `${scrubber}%` }} />
              </div>
              <span className="text-white text-xs">{fmt(Math.round(scrubber * 0.3))}</span>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        {phase !== "done" && (
          <div className={`flex-1 py-2.5 rounded-lg text-xs text-center font-medium transition-all duration-200 ${
            phase === "recording" ? "bg-[var(--app-elevated)] text-[var(--app-text)]" : phase === "playing" ? "bg-[var(--app-elevated)] text-[var(--app-text-40)]" : "bg-[#e05555] text-white"
          }`}>
            {phase === "idle" ? "● Record" : phase === "recording" ? "⬛ Stop" : "▶ Playing..."}
          </div>
        )}
        {phase === "playing" && (
          <div className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg bg-[var(--app-elevated)] text-[var(--app-text-40)] text-xs">
            <RotateCcw className="w-3 h-3" /> Retake
          </div>
        )}
      </div>
    </div>
  );
}

// Step 3: Email types, then publish button clicks
function Step3Preview() {
  const [email, setEmail] = useState("");
  const [published, setPublished] = useState(false);
  const [cursor, setCursor] = useState({ x: 150, y: 80 });
  const [clicking, setClicking] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const FULL_EMAIL = "visitor@email.com";

  useEffect(() => {
    const seq = async () => {
      const wait = (ms: number) => new Promise<void>((r) => { t.current = setTimeout(r, ms); });

      while (true) {
        setEmail(""); setPublished(false); setCursor({ x: 150, y: 80 });
        await wait(700);

        // move to email field
        setCursor({ x: 150, y: 80 });
        await wait(600);
        setClicking(true);
        await wait(200);
        setClicking(false);

        // type email
        for (let i = 0; i <= FULL_EMAIL.length; i++) {
          setEmail(FULL_EMAIL.slice(0, i));
          await wait(70);
        }
        await wait(500);

        // move to publish button
        setCursor({ x: 150, y: 185 });
        await wait(700);
        setClicking(true);
        await wait(300);
        setClicking(false);
        setPublished(true);

        await wait(2500);
      }
    };
    seq();
    return () => { if (t.current) clearTimeout(t.current); };
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden bg-[var(--app-surface)] border border-[var(--app-border)] p-4 text-left select-none" style={{ minHeight: 220 }}>
      <Cursor x={cursor.x} y={cursor.y} clicking={clicking} />
      {published ? (
        <div className="flex flex-col items-center justify-center h-40 gap-3">
          <CheckCircle className="w-12 h-12 text-[#e07b00]" strokeWidth={1.5} />
          <p className="text-sm font-medium text-[var(--app-text)]">Invitation Published!</p>
          <p className="text-xs text-[var(--app-text-40)]">You'll be notified at {email}</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-[var(--app-text-40)] uppercase tracking-wide mb-3">Stay Connected</p>
          <div className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 mb-3 transition-colors ${email ? "border-[#e07b00]" : "border-[var(--app-elevated-hi)]"}`}>
            <Mail className="w-4 h-4 text-[#e07b00] flex-shrink-0" />
            <span className="text-xs text-[var(--app-text-70)] flex-1">
              {email || <span className="text-[var(--app-text-25)]">Email address *</span>}
              {email && <span className="animate-pulse text-[#e07b00]">|</span>}
            </span>
          </div>
          <div className={`w-full mt-[90px] py-2.5 rounded-lg text-xs text-center font-medium transition-all duration-200 ${email ? "bg-[#e07b00] text-white" : "bg-[var(--app-elevated)] text-[var(--app-text-30)]"}`}>
            Publish Invitation
          </div>
        </>
      )}
    </div>
  );
}

// Step 4: Cards fade in, one gets clicked and shows "Replied"
function Step4Preview() {
  const [visibleCards, setVisibleCards] = useState(0);
  const [repliedId, setRepliedId] = useState<number | null>(null);
  const [cursor, setCursor] = useState({ x: 150, y: 50 });
  const [clicking, setClicking] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  const CARDS = [
    { id: 1, tag: "Local" as const, name: "Nikos", title: "Discover Hidden Tavernas", color: "#c7d2fe" },
    { id: 2, tag: "Tourist" as const, name: "Sarah", title: "Samaria Gorge Hike", color: "#fde68a" },
    { id: 3, tag: "Local" as const, title: "Rooftop Concert Tonight", color: "#bfdbfe" },
  ];

  useEffect(() => {
    const seq = async () => {
      const wait = (ms: number) => new Promise<void>((r) => { t.current = setTimeout(r, ms); });

      while (true) {
        setVisibleCards(0); setRepliedId(null); setCursor({ x: 150, y: 50 });
        await wait(500);

        // cards appear one by one
        for (let i = 1; i <= CARDS.length; i++) {
          setVisibleCards(i);
          await wait(500);
        }

        // move cursor to first card
        setCursor({ x: 150, y: 90 });
        await wait(700);
        setClicking(true);
        await wait(200);
        setClicking(false);
        setRepliedId(1);

        await wait(2500);
      }
    };
    seq();
    return () => { if (t.current) clearTimeout(t.current); };
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden bg-[var(--app-surface)] border border-[var(--app-border)] p-4 select-none" style={{ minHeight: 220 }}>
      <Cursor x={cursor.x} y={cursor.y} clicking={clicking} />
      <p className="text-xs text-[var(--app-text-40)] uppercase tracking-wide mb-3">Recommended for you</p>
      <div className="flex flex-col gap-2">
        {CARDS.map((card, i) => (
          <div
            key={card.id}
            className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all duration-500 ${
              visibleCards > i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            } ${repliedId === card.id ? "border-[#e07b00] bg-[#e07b00]/10" : "border-[var(--app-border)] bg-[var(--app-surface-alt)]"}`}
          >
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-[var(--app-elevated)]">
              <User className="w-4 h-4 text-[var(--app-text-40)]" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--app-text-80)] truncate font-medium">{card.title}</p>
              <div className="flex items-center gap-1">
                {card.name && <span className="text-xs text-[var(--app-text-40)]">{card.name} ·</span>}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${card.tag === "Local" ? "bg-[#e07b00]/20 text-[#e07b00]" : "bg-white/10 text-[var(--app-text-50)]"}`}>
                  {card.tag === "Local" ? <><MapPin className="w-2.5 h-2.5 inline" /> Local</> : "Tourist"}
                </span>
              </div>
            </div>
            {repliedId === card.id && (
              <span className="text-xs bg-[#e07b00] text-white px-2 py-0.5 rounded-full">Replied</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const STEPS = [
  {
    number: 1,
    title: "Create Your Invitation",
    icon: <User className="w-8 h-8 text-[var(--app-text)]" strokeWidth={1.5} />,
    color: "#e07b00",
    bg: "bg-[var(--app-surface-alt)]",
    border: "border-[var(--app-border)]",
    Preview: Step1Preview,
    description: "Tell us who you are and what you'd love to do. Select up to 3 interest categories to match you with like-minded people.",
  },
  {
    number: 2,
    title: "Record Your Video",
    icon: <div className="w-3 h-3 bg-white rounded-full" />,
    color: "#e07b00",
    bg: "bg-[var(--app-surface-alt)]",
    border: "border-[var(--app-border)]",
    Preview: Step2Preview,
    description: "Record a video invitation up to 1 minute long, sharing what you'd like to do and who you're looking for.",
  },
  {
    number: 3,
    title: "Review & Publish",
    icon: <CheckCircle className="w-8 h-8 text-[var(--app-text)]" strokeWidth={1.5} />,
    color: "#e07b00",
    bg: "bg-[var(--app-surface-alt)]",
    border: "border-[var(--app-border)]",
    Preview: Step3Preview,
    description: "Add your email for notifications and optionally link social media. Your contact info is only shared when both buddies agree.",
  },
  {
    number: 4,
    title: "Find Your Buddies",
    icon: <Eye className="w-8 h-8 text-[var(--app-text)]" strokeWidth={1.5} />,
    color: "#e07b00",
    bg: "bg-[var(--app-surface-alt)]",
    border: "border-[var(--app-border)]",
    Preview: Step4Preview,
    description: "Browse recommended invitations from people with similar interests and reply to ones that catch your eye.",
  },
];

export function JourneyTutorialScreen({ language, onLanguageChange, onContinue, onBack, onExit }: Props) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const { Preview } = current;

  const touchStartX = useRef<number | null>(null);

  const goNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onContinue();
  };

  const goPrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col">
      <TopBar onBack={onBack} onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 flex flex-col px-8 pt-20 pb-8 max-w-2xl mx-auto w-full">
        <div className="text-center mb-6">
          <h2 className="text-[var(--app-text)]">How it Works</h2>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-10 bg-[#e07b00]" : i < step ? "w-4 bg-[#e07b00]/40" : "w-4 bg-[var(--app-border)]"
              }`}
            />
          ))}
        </div>

        {/* Step card — swipeable */}
        <div
          className={`rounded-2xl border-2 ${current.border} ${current.bg} p-6 mb-5 flex-1 flex flex-col cursor-grab active:cursor-grabbing`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ backgroundColor: current.color }}
            >
              {current.icon}
            </div>
            <div>
              <p className="text-xs text-[var(--app-text-40)] uppercase tracking-wide">Step {current.number} of {STEPS.length}</p>
              <h3 className="text-[var(--app-text)]">{current.title}</h3>
            </div>
          </div>

          {/* Animated preview */}
          <div className="mb-5">
            <Preview />
          </div>

          {/* Description */}
          <p className="text-[var(--app-text-50)] text-sm leading-relaxed">{current.description}</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            disabled={step === 0}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-medium transition-colors flex-shrink-0 ${
              step === 0
                ? "bg-[var(--app-surface)] text-[var(--app-text-20)] cursor-not-allowed border border-[var(--app-border)]"
                : "bg-[var(--app-elevated)] hover:bg-[var(--app-elevated-hi)] text-[var(--app-text)] border border-[var(--app-border-hi)]"
            }`}
          >
            ←
          </button>
          <button
            onClick={goNext}
            className="flex-1 bg-[#e07b00] hover:bg-[#c96e00] text-white py-3 rounded-xl font-medium transition-colors"
          >
            {step < STEPS.length - 1 ? "Next →" : "Let's Start →"}
          </button>
          {step < STEPS.length - 1 && (
            <button
              onClick={onContinue}
              className="px-5 py-3 rounded-xl text-sm text-[var(--app-text-40)] hover:text-[var(--app-text-70)] hover:bg-[var(--app-elevated)] transition-colors flex-shrink-0 border border-[var(--app-border)]"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
