import { useState, useCallback, useEffect, useRef } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LanguageSelectScreen } from "./screens/LanguageSelectScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { AboutStoryScreen } from "./screens/AboutStoryScreen";
import { JourneyTutorialScreen } from "./screens/JourneyTutorialScreen";
import { WhatToDoScreen } from "./screens/WhatToDoScreen";
import { SelectInterestsScreen } from "./screens/SelectInterestsScreen";
import { RecordInvitationScreen } from "./screens/RecordInvitationScreen";
import { WhoAreYouScreen } from "./screens/WhoAreYouScreen";
import type { ProfileData } from "./screens/WhoAreYouScreen";
import { StayConnectedScreen } from "./screens/StayConnectedScreen";
import { InvitationLiveScreen } from "./screens/InvitationLiveScreen";
import { ExploreInvitationsScreen } from "./screens/ExploreInvitationsScreen";
import type { Invitation } from "./screens/ExploreInvitationsScreen";
import { ViewInvitationScreen } from "./screens/ViewInvitationScreen";
import { ConfirmConnectScreen } from "./screens/ConfirmConnectScreen";
import { ExpressInterestScreen } from "./screens/ExpressInterestScreen";
import { InterestSentScreen } from "./screens/InterestSentScreen";
import { ThankYouScreen } from "./screens/ThankYouScreen";
import { AttractScreen } from "./screens/AttractScreen";

type Screen =
  | "language" | "welcome" | "about" | "journeyTutorial"
  | "whatToDo" | "selectInterests"
  | "whoAreYou" | "recordInvitation" | "stayConnected"
  | "invitationLive" | "explore" | "viewInvitation"
  | "confirmConnect" | "expressInterest" | "interestSent" | "thankYou";

const EMPTY_PROFILE: ProfileData = {
  role: "", name: "", ageRange: "", gender: "", nationality: "",
  invitationTitle: "", shortDescription: "", timeline: "", departureDate: "",
};

function AppInner() {
  const { isDark } = useTheme();
  return <AppContent isDark={isDark} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppInner />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

function AppContent({ isDark }: { isDark: boolean }) {
  const [history, setHistory] = useState<Screen[]>(["language"]);
  const [language, setLanguage] = useState("English");
  const [categories, setCategories] = useState<string[]>([]);
  const [invitationText, setInvitationText] = useState("");
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [email, setEmail] = useState("");
  const [currentInvitation, setCurrentInvitation] = useState<Invitation | null>(null);
  const [recordingDone, setRecordingDone] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingPlaybackUrl, setRecordingPlaybackUrl] = useState<string | undefined>(undefined);
  const [viewedIds, setViewedIds] = useState<Set<number>>(new Set());
  const [repliedIds, setRepliedIds] = useState<Set<number>>(new Set());

  const [attractMode, setAttractMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  const [warningSeconds, setWarningSeconds] = useState(10);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const IDLE_MS = 30_000;

  const clearTimers = useCallback(() => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
    if (warningTimer.current) {
      clearInterval(warningTimer.current);
      warningTimer.current = null;
    }
  }, []);

  const resetWarning = useCallback(() => {
    setTimeoutWarning(false);
    setWarningSeconds(10);
    if (warningTimer.current) {
      clearInterval(warningTimer.current);
      warningTimer.current = null;
    }
  }, []);

  const exit = useCallback(() => {
    try {
      const lastPreview = localStorage.getItem("portal_last_preview");
      // If there's a preview or a recently recorded playback URL, show the thank-you/photo-strip screen
      if (recordingPlaybackUrl || lastPreview) {
        setHistory(["thankYou"]);
        setAttractMode(false);
        return;
      }
    } catch (e) {
      // ignore
    }
    setHistory(["language"]);
    setAttractMode(true);
  }, []);

  const startIdleTimer = useCallback(() => {
    if (busy || attractMode) return;
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
    }
    idleTimer.current = setTimeout(() => {
      setTimeoutWarning(true);
      setWarningSeconds(10);
      warningTimer.current = setInterval(() => {
        setWarningSeconds((current) => {
          if (current <= 1) {
            clearTimers();
            exit();
            return 0;
          }
          return current - 1;
        });
      }, 1000);
    }, IDLE_MS);
  }, [attractMode, busy, clearTimers, exit]);

  // On startup, remove any mistakenly-published invitations that include video data URLs
  useEffect(() => {
    try {
      const raw = localStorage.getItem("portal_invitations");
      if (!raw) return;
      const list = JSON.parse(raw) as any[];
      const filtered = list.filter((i) => !i.videoDataUrl);
      if (filtered.length !== list.length) {
        localStorage.setItem("portal_invitations", JSON.stringify(filtered));
      }
    } catch (err) {
      // ignore
    }
  }, []);

  const resetIdle = useCallback(() => {
    if (busy || attractMode) return;
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
    }
    resetWarning();
    startIdleTimer();
  }, [attractMode, busy, resetWarning, startIdleTimer]);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    const handler = () => {
      if (!attractMode && !busy) {
        if (timeoutWarning) {
          resetWarning();
        }
        resetIdle();
      }
    };
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    resetIdle();
    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      clearTimers();
    };
  }, [resetIdle, attractMode, busy, timeoutWarning, resetWarning, clearTimers]);

  useEffect(() => {
    if (busy) {
      clearTimers();
      resetWarning();
      return;
    }
    if (!attractMode) {
      resetIdle();
    }
  }, [busy, attractMode, resetIdle, resetWarning, clearTimers]);

  const screen = history[history.length - 1];

  useEffect(() => {
    if (!["recordInvitation", "viewInvitation", "expressInterest"].includes(screen)) {
      setBusy(false);
    }
  }, [screen]);

  const go = useCallback((s: Screen) => {
    setHistory((prev) => [...prev, s]);
  }, []);

  const goBack = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const markViewed = (id: number) => setViewedIds((prev) => new Set(prev).add(id));
  const markReplied = (id: number) => setRepliedIds((prev) => new Set(prev).add(id));

  const lang = { language, onLanguageChange: setLanguage };

  const reset = () => {
    setProfile(EMPTY_PROFILE);
    setEmail("");
    setCategories([]); setInvitationText(""); setRecordingDone(false); setRecordingDuration(0); setRecordingPlaybackUrl(undefined);
    setViewedIds(new Set()); setRepliedIds(new Set());
    setCurrentInvitation(null);
    setHistory(["language"]);
    setAttractMode(true);
  };

  const hasBack = history.length > 1;

  return (
    <div className={`min-h-screen ${isDark ? "app-dark" : "app-light"}`}>
      {timeoutWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="max-w-sm w-full bg-white dark:bg-[#111] rounded-3xl border border-[var(--app-border)] p-6 text-center shadow-2xl">
            <p className="text-sm font-semibold text-[#e07b00] uppercase tracking-[0.18em] mb-4">Inactivity warning</p>
            <p className="text-[var(--app-text)] mb-3">You will be signed out in {warningSeconds} second{warningSeconds === 1 ? "" : "s"} unless you tap the screen.</p>
            <button
              onClick={() => {
                resetWarning();
                resetIdle();
              }}
              className="mt-4 w-full bg-[#e07b00] hover:bg-[#c96e00] text-white py-3 rounded-2xl font-medium"
            >
              Stay signed in
            </button>
          </div>
        </div>
      )}
      {attractMode && (
        <AttractScreen onWake={() => { setAttractMode(false); resetIdle(); }} />
      )}
      {screen === "language" && (
        <LanguageSelectScreen onSelect={(l) => { setLanguage(l); go("welcome"); }} />
      )}
      {screen === "welcome" && (
        <WelcomeScreen {...lang} onStart={() => go("about")} onExit={exit} />
      )}
      {screen === "about" && (
        <AboutStoryScreen {...lang} onContinue={() => go("journeyTutorial")} onBack={hasBack ? goBack : undefined} onExit={exit} />
      )}
      {screen === "journeyTutorial" && (
        <JourneyTutorialScreen {...lang} onContinue={() => go("whatToDo")} onBack={hasBack ? goBack : undefined} onExit={exit} />
      )}
      {screen === "whatToDo" && (
        <WhatToDoScreen {...lang} onCreateInvite={() => go("selectInterests")} onBack={hasBack ? goBack : undefined} onExit={exit} />
      )}
      {screen === "selectInterests" && (
        <SelectInterestsScreen {...lang} selected={categories} onChange={setCategories} onContinue={() => go("whoAreYou")} onBack={hasBack ? goBack : undefined} onExit={exit} />
      )}
      {screen === "whoAreYou" && (
        <WhoAreYouScreen {...lang} data={profile} onChange={setProfile} onContinue={() => go("recordInvitation")} onBack={hasBack ? goBack : undefined} onExit={exit} />
      )}
      {screen === "recordInvitation" && (
        <RecordInvitationScreen
          {...lang}
          categories={categories}
          invitationText={invitationText}
          onTextChange={setInvitationText}
          initialDone={recordingDone}
          initialDuration={recordingDuration}
          initialPlaybackUrl={recordingPlaybackUrl}
          onSave={async (dur, url, blob) => {
            setRecordingDone(true);
            setRecordingDuration(dur);

            // persist invitation with video data in localStorage
            let videoDataUrl: string | undefined = undefined;
            try {
              if (blob) {
                videoDataUrl = await new Promise<string>((resolve, reject) => {
                  const fr = new FileReader();
                  fr.onerror = () => reject(new Error("Failed to read blob"));
                  fr.onload = () => resolve(String(fr.result));
                  fr.readAsDataURL(blob);
                });
              }

              // Save as a private draft/preview so it doesn't appear in public browse
              const id = Date.now();
              const inv = {
                id,
                tag: profile.role || "Tourist",
                name: profile.name || undefined,
                ageRange: profile.ageRange || "",
                category: categories[0] || "Custom",
                tags: categories,
                invitationTitle: profile.invitationTitle || invitationText || "",
                description: profile.shortDescription || invitationText || "",
                avatarColor: "#c7d2fe",
                timeline: "Today",
                videoDataUrl,
              };

              // Persist as the 'last preview' so it's available when navigating back
              try {
                localStorage.setItem("portal_last_preview", JSON.stringify(inv));
              } catch (e) {
                console.warn("Failed to persist preview", e);
              }

              // make it the current invitation for immediate preview/navigation
              setCurrentInvitation(inv as any);
            } catch (err) {
              console.warn("Failed to persist invitation", err);
            }

            // prefer the persisted data URL if available so it's stable across pages
            setRecordingPlaybackUrl(videoDataUrl ?? url);

            go("stayConnected");
          }}
          onBack={hasBack ? goBack : undefined}
          onExit={exit}
          onBusyChange={setBusy}
        />
      )}
      {screen === "stayConnected" && (
        <StayConnectedScreen {...lang} email={email} onEmailChange={setEmail} onPublish={() => go("invitationLive")} onBack={hasBack ? goBack : undefined} onExit={exit} />
      )}
      {screen === "invitationLive" && (
        <InvitationLiveScreen {...lang} onExplore={() => go("explore")} onFinish={() => go("thankYou")} onExit={exit} />
      )}
      {screen === "explore" && (
        <ExploreInvitationsScreen {...lang} selectedCategories={categories} userAgeRange={profile.ageRange} viewedIds={viewedIds} repliedIds={repliedIds}
          onView={(inv) => { markViewed(inv.id); setCurrentInvitation(inv); go("viewInvitation"); }}
          onBack={hasBack ? goBack : undefined} onExit={exit} onFinish={() => go("thankYou")}
        />
      )}
      {screen === "viewInvitation" && currentInvitation && (
        <ViewInvitationScreen {...lang} invitation={currentInvitation} onExpressInterest={() => go("confirmConnect")} onBack={hasBack ? goBack : undefined} onExit={exit} onBusyChange={setBusy} replyCount={repliedIds.size} alreadyReplied={repliedIds.has(currentInvitation.id)} />
      )}
      {screen === "confirmConnect" && currentInvitation && (
        <ConfirmConnectScreen {...lang} invitation={currentInvitation} onConfirm={() => go("expressInterest")} onBack={hasBack ? goBack : undefined} onExit={exit} />
      )}
      {screen === "expressInterest" && (
        <ExpressInterestScreen {...lang}
          onSend={() => { if (currentInvitation) markReplied(currentInvitation.id); go("interestSent"); }}
          onBack={hasBack ? goBack : undefined} onExit={exit} onBusyChange={setBusy}
        />
      )}
      {screen === "interestSent" && (
        <InterestSentScreen {...lang} onBrowseMore={() => go("explore")} onExit={() => go("thankYou")} onBack={hasBack ? goBack : undefined} />
      )}
      {screen === "thankYou" && (
        <ThankYouScreen onRestart={reset} videoUrl={recordingPlaybackUrl} />
      )}
    </div>
  );
}
