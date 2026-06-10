import { useState, useEffect, useRef } from "react";
import { Fingerprint, MapPin, Video, Shield, Users } from "lucide-react";

interface Props {
  onWake: () => void;
}

const SLIDES = [
  {
    bg: "https://images.unsplash.com/photo-1601836743857-4d1e6da20a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDcmV0ZSUyMEdyZWVjZSUyME1lZGl0ZXJyYW5lYW4lMjB0cmF2ZWx8ZW58MXx8fHwxNzgxMDA2MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: <MapPin className="w-10 h-10 text-[#e07b00]" strokeWidth={1.5} />,
    headline: "Don't Just Visit.",
    subheadline: "Belong.",
    body: "Connect with locals and travelers for real-world adventures in Heraklion.",
    accent: "#e07b00",
  },
  {
    bg: "https://images.unsplash.com/photo-1669456920788-215ea17430c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwY2FmZSUyMHN1bW1lciUyME1lZGl0ZXJyYW5lYW4lMjBwZW9wbGV8ZW58MXx8fHwxNzgxMDA2Mzg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: <Users className="w-10 h-10 text-white" strokeWidth={1.5} />,
    headline: "42,346",
    subheadline: "Invitations Created.",
    body: "Every day, locals and visitors connect through shared experiences right here in the city.",
    accent: "#ffffff",
  },
  {
    bg: "https://images.unsplash.com/photo-1514582086679-4024becf927e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwaG9uZSUyMHZpZGVvJTIwcmVjb3JkaW5nJTIwc2VsZmllfGVufDF8fHx8MTc4MTAwNjM3OHww&ixlib=rb-4.1.0&q=80&w=1080",
    icon: <Video className="w-10 h-10 text-[#e07b00]" strokeWidth={1.5} />,
    headline: "Your Voice,",
    subheadline: "Your Invitation.",
    body: "Record a short video about what you'd love to do and who you'd love to do it with.",
    accent: "#e07b00",
  },
  {
    bg: "https://images.unsplash.com/photo-1758525226597-6263703aca5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHx0d28lMjBwZW9wbGUlMjBtZWV0aW5nJTIwdGFsa2luZyUyMG91dGRvb3JzJTIwY2FmZXxlbnwxfHx8fDE3ODEwMDg1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: <Shield className="w-10 h-10 text-emerald-400" strokeWidth={1.5} />,
    headline: "Safe. Simple.",
    subheadline: "Local.",
    body: "No public emails. No spam. Just meaningful cultural exchange — your details stay private until both buddies agree.",
    accent: "#34d399",
  },
];

const SLIDE_DURATION = 4500;
const FADE_MS = 900;

export function AttractScreen({ onWake }: Props) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current]);

  return (
    <div className="fixed inset-0 z-50 cursor-pointer overflow-hidden" onClick={onWake}>

      {/* All background images stacked — CSS controls which is visible */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${s.bg})`,
            opacity: i === current ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
          }}
        />
      ))}

      {/* Gradient overlay — always on top of images */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />

      {/* All slide content layers stacked — CSS controls which is visible */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center"
          style={{
            opacity: i === current ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
          }}
        >
          <div className="mb-6">{s.icon}</div>
          <h1
            className="text-white mb-2"
            style={{ fontSize: "3.8rem", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            {s.headline}
          </h1>
          <h1
            style={{ fontSize: "3.8rem", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", color: s.accent, textShadow: "0 2px 20px rgba(0,0,0,0.4)", marginBottom: "1.5rem" }}
          >
            {s.subheadline}
          </h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-md" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>
            {s.body}
          </p>
        </div>
      ))}

      {/* Brand — always visible */}
      <div className="absolute top-8 left-0 right-0 flex justify-center">
        <div className="text-center">
          <p className="text-white/50 text-xs tracking-[0.3em] uppercase">Heraklion, Crete</p>
          <p className="text-white/80 text-sm tracking-[0.2em] uppercase mt-1">Portal Connect</p>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="h-1 rounded-full"
            style={{
              width: i === current ? 32 : 8,
              backgroundColor: i === current ? SLIDES[current].accent : "rgba(255,255,255,0.35)",
              transition: `all ${FADE_MS}ms ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* Pulsing tap indicator */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 rounded-full border-2 border-white/20 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute w-14 h-14 rounded-full border-2 border-white/30 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.3s" }} />
          <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
            <Fingerprint className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
        </div>
        <p className="text-white/60 text-xs tracking-widest uppercase">Tap anywhere to start</p>
      </div>
    </div>
  );
}
