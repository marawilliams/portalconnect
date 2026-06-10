import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string; // YYYY-MM-DD
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toYMD(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function InlineCalendar({ value, onChange, minDate }: Props) {
  const today = new Date();
  const todayStr = toYMD(today.getFullYear(), today.getMonth(), today.getDate());
  const min = minDate ?? todayStr;

  const initDate = value ? new Date(value + "T00:00:00") : today;
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-2xl p-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--app-elevated)] hover:bg-[var(--app-elevated-hi)] text-[var(--app-text)] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-[var(--app-text)] font-semibold text-lg">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--app-elevated)] hover:bg-[var(--app-elevated-hi)] text-[var(--app-text)] transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-[var(--app-text-40)] py-1 font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = toYMD(viewYear, viewMonth, day);
          const isSelected = dateStr === value;
          const isToday = dateStr === todayStr;
          const isPast = dateStr < min;

          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => !isPast && onChange(dateStr)}
              className={`mx-auto w-10 h-10 flex items-center justify-center rounded-xl text-base transition-colors ${
                isSelected
                  ? "bg-[#e07b00] text-white font-semibold"
                  : isPast
                  ? "text-[var(--app-text-20)] cursor-not-allowed"
                  : isToday
                  ? "border-2 border-[#e07b00] text-[#e07b00] font-semibold hover:bg-[#e07b00]/10"
                  : "text-[var(--app-text)] hover:bg-[var(--app-elevated)]"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {value && (
        <div className="mt-4 pt-4 border-t border-[var(--app-border)] flex items-center justify-between">
          <span className="text-sm text-[var(--app-text-60)]">
            Leaving: <span className="text-[#e07b00] font-medium">{new Date(value + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
          </span>
          <button
            onClick={() => onChange("")}
            className="text-xs text-[var(--app-text-30)] hover:text-[var(--app-text-60)] transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
