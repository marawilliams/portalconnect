import { CalendarX2 } from "lucide-react";
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

  const canContinue =
    data.role !== "" &&
    data.name.trim() !== "" &&
    data.ageRange !== "" &&
    data.gender !== "" &&
    data.invitationTitle.trim() !== "";

  return (
    <div className="h-screen bg-[var(--app-bg)] flex flex-col overflow-hidden">
      <TopBar onBack={onBack} onExit={onExit} language={language} onLanguageChange={onLanguageChange} />
      <div className="flex-1 px-6 pt-16 pb-6 max-w-[min(1100px,100%)] mx-auto w-full flex flex-col overflow-hidden">
        <h2 className="text-[var(--app-text)] mb-5 text-center text-3xl md:text-4xl">Who are you?</h2>

        <div className="space-y-4">
          <div>
            <label className="text-lg text-[var(--app-text-60)] mb-3 block">I am a <span className="text-[#e07b00]">*</span></label>
            <div className="flex gap-4 flex-col sm:flex-row">
              {(["Tourist", "Local"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => set("role", r)}
                  className={`flex-1 py-5 rounded-2xl text-xl font-semibold transition-colors border-2 ${
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-lg text-[var(--app-text-60)] mb-2 block">Your name <span className="text-[#e07b00]">*</span></label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="First name or nickname"
                className="w-full bg-[var(--app-surface)] border-2 border-[var(--app-border)] text-[var(--app-text)] placeholder-[var(--app-text-25)] rounded-2xl px-4 py-3 text-lg outline-none focus:border-[#e07b00] transition-colors"
              />
            </div>

            <div>
              <label className="text-lg text-[var(--app-text-60)] mb-2 block">Age range <span className="text-[#e07b00]">*</span></label>
              <div className="grid gap-3 sm:grid-cols-2">
                {AGE_RANGES.map((a) => (
                  <button
                    key={a}
                    onClick={() => set("ageRange", a)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-base font-medium transition-colors ${
                      data.ageRange === a
                        ? "bg-[#e07b00] border-[#e07b00] text-white"
                        : "bg-[var(--app-surface-alt)] border-[var(--app-border)] text-[var(--app-text-60)] hover:border-[#e07b00]/60 hover:text-[var(--app-text)]"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      data.ageRange === a ? "border-white" : "border-[var(--app-border-hi)]"
                    }`}>
                      {data.ageRange === a && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </span>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-lg text-[var(--app-text-60)] mb-2 block">Gender <span className="text-[#e07b00]">*</span></label>
              <div className="grid gap-3 sm:grid-cols-2">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    onClick={() => set("gender", g)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-base font-medium transition-colors ${
                      data.gender === g
                        ? "bg-[#e07b00] border-[#e07b00] text-white"
                        : "bg-[var(--app-surface-alt)] border-[var(--app-border)] text-[var(--app-text-60)] hover:border-[#e07b00]/60 hover:text-[var(--app-text)]"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      data.gender === g ? "border-white" : "border-[var(--app-border-hi)]"
                    }`}>
                      {data.gender === g && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </span>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-lg text-[var(--app-text-60)] mb-2 block">Nationality <span className="text-[var(--app-text-30)] text-sm">(optional)</span></label>
              <input
                type="text"
                value={data.nationality}
                onChange={(e) => set("nationality", e.target.value)}
                placeholder="Where are you from?"
                className="w-full bg-[var(--app-surface)] border-2 border-[var(--app-border)] text-[var(--app-text)] placeholder-[var(--app-text-25)] rounded-2xl px-4 py-3 text-lg outline-none focus:border-[#e07b00] transition-colors"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-lg text-[var(--app-text-60)] mb-2 block">Name your invitation <span className="text-[#e07b00]">*</span></label>
              <input
                type="text"
                value={data.invitationTitle}
                onChange={(e) => set("invitationTitle", e.target.value)}
                placeholder="e.g. Looking for a Food Adventure"
                className="w-full bg-[var(--app-surface)] border-2 border-[var(--app-border)] text-[var(--app-text)] placeholder-[var(--app-text-25)] rounded-2xl px-4 py-3 text-lg outline-none focus:border-[#e07b00] transition-colors"
              />
            </div>

            {data.role === "Tourist" && (
              <div>
                <label className="text-lg text-[var(--app-text-60)] mb-2 flex items-center gap-2">
                  <CalendarX2 className="w-5 h-5 text-[#e07b00]" />
                  When are you leaving? <span className="text-[var(--app-text-30)] text-sm">(optional)</span>
                </label>
                <InlineCalendar
                  value={data.departureDate}
                  onChange={(d) => set("departureDate", d)}
                  minDate={today}
                />
                <p className="text-sm text-[var(--app-text-30)] mt-2">Your invitation will be automatically removed on this date.</p>
              </div>
            )}
          </div>

          <div>
            <label className="text-lg text-[var(--app-text-60)] mb-2 block">Short description <span className="text-[var(--app-text-30)] text-sm">(optional)</span></label>
            <textarea
              value={data.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              placeholder="Tell people a bit more about what you have in mind…"
              rows={4}
              className="w-full bg-[var(--app-surface)] border-2 border-[var(--app-border)] text-[var(--app-text)] placeholder-[var(--app-text-25)] rounded-2xl px-4 py-3 text-lg outline-none focus:border-[#e07b00] transition-colors resize-none"
            />
          </div>
        </div>

        <button
          onClick={canContinue ? onContinue : undefined}
          className={`w-full mt-10 py-5 rounded-2xl text-xl font-semibold transition-colors ${
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
