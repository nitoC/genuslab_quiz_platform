"use client";

import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { inputField } from "./inputStyles";

interface Props {
  value: Date | undefined;
  onChange: (d: Date | unknown) => void;
  placeholder?: string;
}

interface SelectOption {
  label: string | number;
  value: number;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: number;
  onChange: (val: number) => void;
  ariaLabel: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MIN_AGE = 13;
const MAX_AGE = 110;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
  { length: MAX_AGE - MIN_AGE + 1 },
  (_, i) => CURRENT_YEAR - MIN_AGE - i,
);

const navButtonClass =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 disabled:pointer-events-none disabled:opacity-30";

/** Refined Professional Custom Select */
const CustomSelect = ({
  options,
  value,
  onChange,
  ariaLabel,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-8 items-center justify-between gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 shadow-xs hover:border-gray-300 hover:bg-gray-50/50 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
      >
        <span>{selectedOption.label}</span>
        <ChevronDown
          size={12}
          className={`text-gray-400 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            absolute left-0 z-50 mt-1 max-h-52 min-w-[110px] overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-md
            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-sm
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
          "
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#D1D5DB transparent",
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                ref={isSelected ? selectedRef : null}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors ${
                  isSelected
                    ? "bg-gray-100 font-semibold text-gray-900"
                    : "font-normal text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={12} className="text-gray-700" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const CustomDatePicker = ({
  value,
  onChange,
  placeholder = "Select date of birth",
}: Props) => {
  const monthOptions: SelectOption[] = MONTHS.map((month, index) => ({
    label: month,
    value: index,
  }));

  const yearOptions: SelectOption[] = YEARS.map((year) => ({
    label: year,
    value: year,
  }));

  return (
    <div className="flex w-full items-center gap-2">
      <DatePicker
        selected={value}
        onChange={onChange}
        placeholderText={placeholder}
        className={inputField}
        dateFormat="MMM d, yyyy"
        maxDate={new Date()}
        showPopperArrow={false}
        calendarClassName="dob-datepicker"
        portalId="dob-datepicker-portal"
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex items-center justify-between gap-1 border-b border-gray-100 px-2 py-1.5">
            <button
              type="button"
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              aria-label="Previous month"
              className={navButtonClass}
            >
              <ChevronLeft size={14} />
            </button>

            <div className="flex flex-1 items-center justify-center gap-1.5">
              <CustomSelect
                ariaLabel="Month"
                options={monthOptions}
                value={date.getMonth()}
                onChange={(val) => changeMonth(val)}
              />

              <CustomSelect
                ariaLabel="Year"
                options={yearOptions}
                value={date.getFullYear()}
                onChange={(val) => changeYear(val)}
              />
            </div>

            <button
              type="button"
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              aria-label="Next month"
              className={navButtonClass}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      />
      <Calendar
        size={18}
        className="pointer-events-none shrink-0 text-gray-400"
      />
    </div>
  );
};

export default CustomDatePicker;
