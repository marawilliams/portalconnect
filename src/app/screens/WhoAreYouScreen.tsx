import { CalendarX2 } from "lucide-react";
import { useState } from "react";
import { TopBar } from "../components/TopBar";
import { InlineCalendar } from "../components/InlineCalendar";

interface ProfileData {
  role: "Tourist" | "Local" | "";
  name: string;
  ageRange: string;
  gender: string;
  nationality: string;
  invitationTitle: string;
  shortDescription: string;
  timeline: string;
  departureDate: string;
}

interface Props {
  data: ProfileData;
  onChange: (d: ProfileData) => void;
  onContinue: () => void;
  onBack: () => void;
  onExit: () => void;
  onLanguageChange?: (lang: string) => void;
  language: string;
}

const AGE_RANGES = ["18–24", "25–34", "35–49", "50+"];
const GENDERS = ["Male", "Female", "Nonbinary", "Prefer not to say"];

export function WhoAreYouScreen({ data, onChange, onContinue, onBack, onExit, language, onLanguageChange }: Props) {
  const set = (k: keyof ProfileData, v: string) => onChange({ ...data, [k]: v });
  const today = new Date().toISOString().split("T")[0];
  const maxDate = (() => {
    const later = new Date();
    later.setDate(later.getDate() + 14);
    return later.toISOString().split("T")[0];
  })();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const canContinue =
    data.role !== "" &&
    data.name.trim() !== "" &&
    data.ageRange !== "" &&
    data.gender !== "" &&
    data.invitationTitle.trim() !== "";

  return (
    <div className="h-screen bg-[var(--app-bg)] flex flex-col overflow-hidden">
      <TopBar onBack={onBack} onExit={onExit} language={language} onLanguageChange={onLanguageChange} />

      <div className="flex-1 flex flex-col overflow-hidden mt-[53px] px-6 pt-4 pb-4 max-w-[min(1100px,100%)] mx-auto w-full">
        <h2 className="text-[var(--app-text)] mb-4 text-center text-3xl md:text-4xl shrink-0">Who are you?</h2>

        <div className="flex-1 grid gap-4 md:grid-cols-2 overflow-hidden min-h-0">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-3 overflow-y-auto pr-1">

            {/* I am a */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[var(--app-text-60)]">
                I am a <span className="text-[#e07b00]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["Tourist", "Local"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => set("role", r)}
                    className={`flex items-center justify-center px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors border-2 ${
                      data.role === r
                        ? "bg-[#e07b00] border-[#e07b00] text-white"
                        : "bg-[var(--app-surface-alt)] border-[var(--app-border)] text-[var(--app-text-50)] hover:border-[#e07b00]/60 hover:text-[var(--app-text)]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Your name */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[var(--app-text-60)]">
                Your name <span className="text-[#e07b00]">*</span>
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="First name or nickname"
                className="w-full bg-[var(--app-surface)] border-2 border-[var(--app-border)] text-[var(--app-text)] placeholder-[var(--app-text-25)] rounded-2xl px-4 py-2.5 text-base outline-none focus:border-[#e07b00] transition-colors"
              />
            </div>

            {/* Age range */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[var(--app-text-60)]">
                Age range <span className="text-[#e07b00]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AGE_RANGES.map((a) => (
                  <button
                    key={a}
                    onClick={() => set("ageRange", a)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-2xl border-2 text-sm font-medium transition-colors ${
                      data.ageRange === a
                        ? "bg-[#e07b00] border-[#e07b00] text-white"
                        : "bg-[var(--app-surface-alt)] border-[var(--app-border)] text-[var(--app-text-60)] hover:border-[#e07b00]/60 hover:text-[var(--app-text)]"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      data.ageRange === a ? "border-white" : "border-[var(--app-border-hi)]"
                    }`}>
                      {data.ageRange === a && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[var(--app-text-60)]">
                Gender <span className="text-[#e07b00]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    onClick={() => set("gender", g)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-2xl border-2 text-sm font-medium transition-colors ${
                      data.gender === g
                        ? "bg-[#e07b00] border-[#e07b00] text-white"
                        : "bg-[var(--app-surface-alt)] border-[var(--app-border)] text-[var(--app-text-60)] hover:border-[#e07b00]/60 hover:text-[var(--app-text)]"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      data.gender === g ? "border-white" : "border-[var(--app-border-hi)]"
                    }`}>
                      {data.gender === g && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Departure date — everyone can set it */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[var(--app-text-60)]">
                Keep my invitation available until...{" "}
                <span className="text-[var(--app-text-30)] text-xs">Pick a date up to two weeks from today</span>
              </label>
              <div className="relative">
                <button
                  onClick={() => setCalendarOpen((o) => !o)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border-2 text-sm font-medium transition-colors w-full ${
                    data.departureDate
                      ? "border-[#e07b00] text-[var(--app-text)]"
                      : "border-[var(--app-border)] text-[var(--app-text-50)]"
                  } bg-[var(--app-surface-alt)] hover:border-[#e07b00]/60 hover:text-[var(--app-text)]`}
                >
                  <CalendarX2 className="w-4 h-4 text-[#e07b00] flex-shrink-0" />
                  {data.departureDate ? data.departureDate : "Pick an end date"}
                  {data.departureDate && (
                    <span
                      onClick={(e) => { e.stopPropagation(); set("departureDate", ""); }}
                      className="ml-auto text-[var(--app-text-30)] hover:text-[var(--app-text)] cursor-pointer"
                    >
                      ✕
                    </span>
                  )}
                </button>
                <p className="text-xs text-[var(--app-text-30)] mt-2">
                  Invitations are automatically deleted after two weeks.
                </p>

                {calendarOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40 bg-black/50"
                      onClick={() => setCalendarOpen(false)}
                    />
                    {/* Centered modal */}
                    <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--app-surface)] border-2 border-[var(--app-border)] rounded-2xl shadow-2xl p-4 w-[min(360px,90vw)]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-[var(--app-text-60)] flex items-center gap-2">
                          <CalendarX2 className="w-4 h-4 text-[#e07b00]" />
                          When are you leaving?
                        </span>
                        <button
                          onClick={() => setCalendarOpen(false)}
                          className="text-[var(--app-text-30)] hover:text-[var(--app-text)] text-lg leading-none"
                        >
                          ✕
                        </button>
                      </div>
                      <InlineCalendar
                        value={data.departureDate}
                        onChange={(d) => { set("departureDate", d); setCalendarOpen(false); }}
                        minDate={today}
                        maxDate={maxDate}
                      />
                      <p className="text-xs text-[var(--app-text-30)] mt-3">
                        Invitations are automatically deleted after two weeks.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-3 overflow-y-auto pl-1">

            {/* Nationality */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[var(--app-text-60)]">
                Nationality <span className="text-[var(--app-text-30)] text-xs">(optional)</span>
              </label>
              <input
                type="text"
                value={data.nationality}
                onChange={(e) => set("nationality", e.target.value)}
                placeholder="Where are you from?"
                className="w-full bg-[var(--app-surface)] border-2 border-[var(--app-border)] text-[var(--app-text)] placeholder-[var(--app-text-25)] rounded-2xl px-4 py-2.5 text-base outline-none focus:border-[#e07b00] transition-colors"
              />
            </div>

            {/* Invitation title */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[var(--app-text-60)]">
                Name your invitation <span className="text-[#e07b00]">*</span>
              </label>
              <input
                type="text"
                value={data.invitationTitle}
                onChange={(e) => set("invitationTitle", e.target.value)}
                placeholder="e.g. Looking for a Food Adventure"
                className="w-full bg-[var(--app-surface)] border-2 border-[var(--app-border)] text-[var(--app-text)] placeholder-[var(--app-text-25)] rounded-2xl px-4 py-2.5 text-base outline-none focus:border-[#e07b00] transition-colors"
              />
            </div>

            {/* Short description — fills remaining height */}
            <div className="flex flex-col gap-2 flex-1 min-h-0">
              <label className="text-sm font-medium text-[var(--app-text-60)]">
                Short description <span className="text-[var(--app-text-30)] text-xs">(optional)</span>
              </label>
              <textarea
                value={data.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
                placeholder="Tell people a bit more about what you have in mind…"
                className="w-full flex-1 min-h-[80px] max-h-[315px] bg-[var(--app-surface)] border-2 border-[var(--app-border)] text-[var(--app-text)] placeholder-[var(--app-text-25)] rounded-2xl px-4 py-2.5 text-base outline-none focus:border-[#e07b00] transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={canContinue ? onContinue : undefined}
          className={`w-full mt-3 py-4 rounded-2xl text-lg font-semibold transition-colors shrink-0 ${
            canContinue
              ? "bg-[#e07b00] hover:bg-[#c96e00] text-white"
              : "bg-[var(--app-surface-alt)] text-[var(--app-text-30)] border-2 border-[var(--app-border)] cursor-not-allowed"
          }`}
        >
          {canContinue ? "Continue to Record Your Video" : "Please complete all required fields"}
        </button>
      </div>
    </div>
  );
}

export type { ProfileData };