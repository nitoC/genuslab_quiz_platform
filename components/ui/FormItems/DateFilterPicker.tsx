"use client";

import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import {
  MdCalendarToday,
  MdChevronLeft,
  MdChevronRight,
  MdExpandMore,
  MdCheck,
} from "react-icons/md";
import { cn } from "@/lib/utils/cn";

interface Props {
  value: string; // yyyy-MM-dd, or "" for unset
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  theme?: "light" | "dark";
  maxDate?: Date;
  minDate?: Date;
  // Use "bottom-end" near the right edge so the calendar stays on screen.
  popperPlacement?: "bottom-start" | "bottom-end";
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR - i);

interface DropdownOption {
  label: string | number;
  value: number;
}

// Quick month/year jump.
const HeaderDropdown = ({
  options,
  value,
  onChange,
  ariaLabel,
  theme,
}: {
  options: DropdownOption[];
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
  theme: "light" | "dark";
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "filter-datepicker-dropdown-trigger flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm font-semibold",
          theme === "dark"
            ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
        )}
      >
        {selected.label}
        <MdExpandMore
          size={14}
          className={cn("text-gray-400 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          className={cn(
            "filter-datepicker-dropdown-menu absolute left-0 top-[calc(100%+4px)] z-10 max-h-56 w-32 overflow-y-auto rounded-lg border p-1 shadow-lg",
            theme === "dark"
              ? "border-white/10 menu-scrollbar-dark"
              : "border-gray-100 bg-white menu-scrollbar",
          )}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-sm",
                  isSelected
                    ? theme === "dark"
                      ? "filter-datepicker-dropdown-option-selected font-semibold"
                      : "bg-blue-50 font-semibold text-blue-600"
                    : theme === "dark"
                      ? "filter-datepicker-dropdown-option"
                      : "text-gray-600 hover:bg-gray-50",
                )}
              >
                {opt.label}
                {isSelected && <MdCheck size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Date filter using react-datepicker, rendered in a portal.
const DateFilterPicker = ({
  value,
  onChange,
  placeholder = "Select date",
  label,
  theme = "light",
  maxDate,
  minDate,
  popperPlacement = "bottom-start",
}: Props) => {
  const selected = value ? new Date(`${value}T00:00:00`) : null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-1.5">
      {label && (
        <label
          className={cn(
            "text-xs font-semibold",
            theme === "dark" ? "text-grey" : "text-slate-500",
          )}
        >
          {label}
        </label>
      )}
      <div className="relative min-w-0">
        <MdCalendarToday
          size={14}
          className={cn(
            "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 z-10",
            theme === "dark" ? "text-grey" : "text-slate-400",
          )}
        />
        <DatePicker
          selected={selected}
          onChange={(date: Date | null) =>
            onChange(date ? format(date, "yyyy-MM-dd") : "")
          }
          placeholderText={placeholder}
          dateFormat="MMM d, yyyy"
          maxDate={maxDate}
          minDate={minDate}
          popperPlacement={popperPlacement}
          isClearable={!!value}
          showPopperArrow={false}
          wrapperClassName="w-full min-w-0"
          calendarClassName={cn(
            "filter-datepicker",
            theme === "dark" && "filter-datepicker-dark",
          )}
          portalId="filter-datepicker-portal"
          className={cn(
            "w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none transition-colors",
            theme === "dark"
              ? "bg-white/5 border border-white/5 text-grey placeholder:text-grey focus:border-blue/50"
              : "bg-slate-50 border border-slate-100 text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white",
          )}
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div
              className={cn(
                "filter-datepicker-header flex items-center justify-between gap-2 border-b px-3 py-2.5",
                theme === "dark" ? "border-white/10" : "border-gray-100",
              )}
            >
              <button
                type="button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                aria-label="Previous month"
                className={cn(
                  "filter-datepicker-nav-btn flex h-7 w-7 shrink-0 items-center justify-center rounded-md border disabled:pointer-events-none disabled:opacity-30",
                  theme === "dark"
                    ? "border-white/10 bg-white/5 text-grey hover:bg-white/10 hover:text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-800",
                )}
              >
                <MdChevronLeft size={16} />
              </button>

              <div className="flex flex-1 items-center justify-center gap-1.5">
                <HeaderDropdown
                  ariaLabel="Month"
                  theme={theme}
                  options={MONTHS.map((m, i) => ({ label: m, value: i }))}
                  value={date.getMonth()}
                  onChange={changeMonth}
                />
                <HeaderDropdown
                  ariaLabel="Year"
                  theme={theme}
                  options={YEARS.map((y) => ({ label: y, value: y }))}
                  value={date.getFullYear()}
                  onChange={changeYear}
                />
              </div>

              <button
                type="button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                aria-label="Next month"
                className={cn(
                  "filter-datepicker-nav-btn flex h-7 w-7 shrink-0 items-center justify-center rounded-md border disabled:pointer-events-none disabled:opacity-30",
                  theme === "dark"
                    ? "border-white/10 bg-white/5 text-grey hover:bg-white/10 hover:text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-800",
                )}
              >
                <MdChevronRight size={16} />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default DateFilterPicker;
