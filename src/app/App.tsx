import { useState, useCallback, useEffect, useRef } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
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
      <AppInner />
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
  const [viewedIds, setViewedIds] = useState<Set<number>>(new Set());
  const [repliedIds, setRepliedIds] = useState<Set<number>>(new Set());

  const [attractMode, setAttractMode] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const IDLE_MS = 60_000;

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setAttractMode(true), IDLE_MS);
  }, []);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    const handler = () => { if (!attractMode) resetIdle(); };
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    resetIdle();
    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdle, attractMode]);

  const screen = history[history.length - 1];

  const go = useCallback((s: Screen) => {
    setHistory((prev) => [...prev, s]);
  }, []);

  const goBack = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const exit = useCallback(() => {
    setHistory(["language"]);
    setAttractMode(true);
  }, []);

  const markViewed = (id: number) => setViewedIds((prev) => new Set(prev).add(id));
  const markReplied = (id: number) => setRepliedIds((prev) => new Set(prev).add(id));

  const lang = { language, onLanguageChange: setLanguage };

  const reset = () => {
    setProfile(EMPTY_PROFILE);
    setEmail("");
    setCategories([]); setInvitationText(""); setRecordingDone(false); setRecordingDuration(0);
    setViewedIds(new Set()); setRepliedIds(new Set());
    setCurrentInvitation(null);
    setHistory(["language"]);
    setAttractMode(true);
  };

  const hasBack = history.length > 1;

  return (
    <div className={`min-h-screen ${isDark ? "app-dark" : "app-light"}`}>
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
        <RecordInvitationScreen {...lang} categories={categories} invitationText={invitationText} onTextChange={setInvitationText} initialDone={recordingDone} initialDuration={recordingDuration} onSave={(dur) => { setRecordingDone(true); setRecordingDuration(dur); go("stayConnected"); }} onBack={hasBack ? goBack : undefined} onExit={exit} />
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
        <ViewInvitationScreen {...lang} invitation={currentInvitation} onExpressInterest={() => go("confirmConnect")} onBack={hasBack ? goBack : undefined} onExit={exit} replyCount={repliedIds.size} alreadyReplied={repliedIds.has(currentInvitation.id)} />
      )}
      {screen === "confirmConnect" && currentInvitation && (
        <ConfirmConnectScreen {...lang} invitation={currentInvitation} onConfirm={() => go("expressInterest")} onBack={hasBack ? goBack : undefined} onExit={exit} />
      )}
      {screen === "expressInterest" && (
        <ExpressInterestScreen {...lang}
          onSend={() => { if (currentInvitation) markReplied(currentInvitation.id); go("interestSent"); }}
          onBack={hasBack ? goBack : undefined} onExit={exit}
        />
      )}
      {screen === "interestSent" && (
        <InterestSentScreen {...lang} onBrowseMore={() => go("explore")} onExit={() => go("thankYou")} onBack={hasBack ? goBack : undefined} />
      )}
      {screen === "thankYou" && (
        <ThankYouScreen onRestart={reset} />
      )}
    </div>
  );
}
