"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { inputField } from "./inputStyles";

interface Props {
  value: Date | undefined;
  onChange: (d: Date | unknown) => void;
  placeholder?: string;
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
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-30";

const dropdownClass =
  "cursor-pointer rounded-lg border border-gray-200 bg-white py-1.5 pl-2.5 pr-1.5 text-[15px] font-medium text-gray-700 transition-colors hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500";

const CustomDatePicker = ({
  value,
  onChange,
  placeholder = "Select date of birth",
}: Props) => {
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
          <div className="flex items-center justify-between gap-1 px-1">
            <button
              type="button"
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              aria-label="Previous month"
              className={navButtonClass}
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex flex-1 items-center justify-center gap-1.5">
              <select
                aria-label="Month"
                value={date.getMonth()}
                onChange={(e) => changeMonth(Number(e.target.value))}
                className={dropdownClass}
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                aria-label="Year"
                value={date.getFullYear()}
                onChange={(e) => changeYear(Number(e.target.value))}
                className={dropdownClass}
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              aria-label="Next month"
              className={navButtonClass}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      />
      <Calendar size={18} className="pointer-events-none shrink-0 text-gray-400" />
    </div>
  );
};

export default CustomDatePicker;
