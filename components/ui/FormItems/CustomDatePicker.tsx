import { useEffect, useRef, useState } from "react";
import { format } from "date-fns"; // npm i date-fns
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import "react-datepicker/dist/react-datepicker.module.css";

interface Props {
  value: Date | undefined;
  onChange: (d: Date | unknown) => void;
  placeholder?: string;
}

const CalendarIcon = ({
  value,
  onChange,
  placeholder = "Select date of birth",
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <DatePicker
      //   showIcon
      //   icon={<FaCalendarAlt />}
      className="border-none outline-none text-gray-800 px-3 bg-transparent w-full h-10"
      selected={value}
      placeholderText={placeholder}
      onChange={onChange}
    />
  );
};

export default CalendarIcon;
