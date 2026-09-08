import Link from "next/link";
import React from "react";
import { HiOutlineArchive } from "react-icons/hi";
import {
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlinePlusCircle,
} from "react-icons/hi2";

type CourseCardProps = {
  badge: string;
  id: string;
  day: string | number;
  title: string;
  description: string;
  questions: number;
  onDelete?: (id: string) => void;
  onArchive?: () => void;
  onInsertQuestions?: () => void;
  onViewDetails?: () => void;
  onEdit?: () => void;
};

const CourseCard: React.FC<CourseCardProps> = ({
  badge,
  day,
  id,
  title,
  description,
  questions,
  onDelete,
  onArchive,
  onInsertQuestions,
  onViewDetails,
  onEdit,
}) => {
  return (
    <Link
      href={`/genuslab/quizzes/${id}/edit`}
      className="group rounded-2xl w-full max-w-120 bg-white p-5 border border-gray-100 flex flex-col justify-between transition-all duration-200 hover:border-gray-200"
    >
      <div>
        {/* Top Header Controls Section */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
              • {badge}
            </span>
            <span className="text-sm font-bold text-slate-400">Day {day}</span>
          </div>

          {/* Action Operations Grid with Pure CSS Tooltips */}
          <div className="flex items-center gap-1">
            {/* Insert Questions Utility Button */}
            <div className="relative flex flex-col items-center group/tooltip">
              <Link
                href={`/genuslab/quizzes/create-quiz/json/questions?id=${id}`}
                onClick={onInsertQuestions}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150 cursor-pointer"
                aria-label="Insert Questions"
              >
                <HiOutlinePlusCircle className="text-xl" />
              </Link>
              {/* Tooltip Wrapper Bubble */}
              <span className="absolute bottom-full mb-2 hidden group-hover/tooltip:flex flex-col items-center pointer-events-none z-10">
                <span className="relative z-10 p-2 text-sm leading-none text-white whitespace-nowrap bg-slate-800 rounded-md shadow-sm font-medium">
                  Insert Questions
                </span>
                <span className="w-2 h-2 -mt-1 rotate-45 bg-slate-800" />
              </span>
            </div>

            {/* Archive Utility Button */}
            <div className="relative flex flex-col items-center group/tooltip">
              <button
                type="button"
                onClick={onArchive}
                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-150 cursor-pointer"
                aria-label="Archive Quiz"
              >
                <HiOutlineArchive className="text-xl" />
              </button>
              {/* Tooltip Wrapper Bubble */}
              <span className="absolute bottom-full mb-2 hidden group-hover/tooltip:flex flex-col items-center pointer-events-none z-10">
                <span className="relative z-10 p-2 text-sm leading-none text-white whitespace-nowrap bg-slate-800 rounded-md shadow-sm font-medium">
                  Archive Quiz
                </span>
                <span className="w-2 h-2 -mt-1 rotate-45 bg-slate-800" />
              </span>
            </div>

            {/* Delete / Bin Utility Button */}
            <div className="relative flex flex-col items-center group/tooltip">
              <button
                type="button"
                onClick={() => onDelete && onDelete(id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 cursor-pointer"
                aria-label="Delete Quiz"
              >
                <HiOutlineTrash className="text-xl" />
              </button>
              {/* Tooltip Wrapper Bubble */}
              <span className="absolute bottom-full mb-2 hidden group-hover/tooltip:flex flex-col items-center pointer-events-none z-10">
                <span className="relative z-10 p-2 text-sm leading-none text-white whitespace-nowrap bg-slate-800 rounded-md shadow-sm font-medium">
                  Delete Quiz
                </span>
                <span className="w-2 h-2 -mt-1 rotate-45 bg-slate-800" />
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold leading-tight text-slate-900 tracking-tight">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-2.5 text-sm leading-relaxed text-slate-500 line-clamp-2">
          {description}
        </p>

        {/* Stats Matrix Grid Block */}
        <div className="mt-5 grid grid-cols-1 gap-3">
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <p className="text-[14px] font-bold uppercase tracking-wider text-slate-400">
              Questions
            </p>
            <h3 className="mt-1 text-3xl font-extrabold text-slate-900">
              {questions}
            </h3>
          </div>
        </div>
      </div>

      {/* Primary Context Administration Buttons Block */}
      <div className="mt-6 grid grid-cols-2 gap-3 pt-2">
        {/* View Details Action (Secondary Slate Layout) */}
        <button
          type="button"
          onClick={onViewDetails}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-200 hover:bg-slate-300 transition-colors duration-150 text-slate-800 font-bold rounded-xl text-sm tracking-wide cursor-pointer"
        >
          <HiOutlineEye className="text-base shrink-0" />
          View Details
        </button>

        {/* Edit Quiz Action (Primary Blue Layout) */}
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-150 text-white font-bold rounded-xl text-sm tracking-wide cursor-pointer shadow-sm"
        >
          <HiOutlinePencilSquare className="text-base shrink-0" />
          Edit Quiz
        </button>
      </div>
    </Link>
  );
};

export default CourseCard;
