"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { MdCalendarMonth } from "react-icons/md";
import { Calendar } from "@/components/ui/calendar";

/**
 * A month+year picker built on the existing shadcn-style Calendar
 * (react-day-picker) rather than a bespoke widget — `captionLayout="dropdown"`
 * already gives month/year `<select>`s in the caption, which is exactly the
 * navigation a month+year picker needs. The day grid still shows, but callers
 * only care about which month/year was picked (see `monthKey`).
 */
export default function MonthYearPicker({
  value,
  onChange,
  placeholder = "Select month",
}: {
  value: Date | undefined;
  onChange: (date: Date) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-700 outline-none hover:border-blue-300 focus:border-blue-400 focus:bg-white"
      >
        <MdCalendarMonth size={16} className="shrink-0 text-slate-400" />
        <span className={value ? "text-slate-900" : "text-slate-400"}>
          {value ? format(value, "MMMM yyyy") : placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={value}
            defaultMonth={value}
            onSelect={(date) => {
              if (!date) return;
              onChange(date);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

/** "MM-yyyy" key the backend expects, from a picked Date */
export const monthKey = (date: Date) => format(date, "MM-yyyy");
