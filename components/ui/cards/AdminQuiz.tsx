import Link from "next/link";
import React from "react";
import { HiOutlineArchive } from "react-icons/hi";
import {
  HiOutlineTrash,
  HiOutlinePencilSquare,
  HiOutlinePlusCircle,
} from "react-icons/hi2";

type CourseCardProps = {
  badge: string; // quiz status
  id: string;
  day: string | number;
  title: string;
  description: string;
  questions: number;
  onDelete?: (id: string) => void;
  onArchive?: () => void;
  onInsertQuestions?: () => void;
};

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  UPCOMING: "bg-blue-50 text-blue-700 ring-blue-200",
  DRAFT: "bg-amber-50 text-amber-700 ring-amber-200",
  ARCHIVED: "bg-slate-100 text-slate-500 ring-slate-200",
};

// Admin quiz card. Not one big link any more: it held other links and
// buttons, so clicking delete also opened the edit page.
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
}) => {
  const iconBtn =
    "p-2 rounded-lg text-slate-400 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500";

  return (
    <div className="group flex w-full min-w-0 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:border-gray-200 hover:shadow-sm">
      <div className="min-w-0">
        {/* Status, day, quick actions */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${
                STATUS_STYLE[badge] ?? STATUS_STYLE.DRAFT
              }`}
            >
              {badge}
            </span>
            <span className="truncate text-sm font-bold text-slate-400">Day {day}</span>
          </div>

          <div className="flex shrink-0 items-center">
            {onArchive && (
              <button
                type="button"
                onClick={onArchive}
                className={`${iconBtn} hover:bg-amber-50 hover:text-amber-600`}
                aria-label="Archive quiz"
                title="Archive quiz"
              >
                <HiOutlineArchive className="text-xl" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete "${title}"? This can't be undone.`)) onDelete(id);
                }}
                className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
                aria-label="Delete quiz"
                title="Delete quiz"
              >
                <HiOutlineTrash className="text-xl" />
              </button>
            )}
          </div>
        </div>

        <Link
          href={`/genuslab/quizzes/${id}/edit`}
          className="block text-xl font-bold leading-snug tracking-tight text-slate-900 break-words line-clamp-2 hover:text-blue-700"
        >
          {title || "Untitled quiz"}
        </Link>

        <p className="mt-1.5 truncate text-sm text-slate-500">{description}</p>

        <div className="mt-4 flex items-baseline justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Questions
          </span>
          <span
            className={`text-2xl font-extrabold tabular-nums ${
              questions ? "text-slate-900" : "text-amber-600"
            }`}
          >
            {questions}
          </span>
        </div>
        {!questions && (
          <p className="mt-2 text-xs text-amber-700">
            No questions yet, so this quiz won&apos;t go live.
          </p>
        )}
      </div>

      {/* Main actions */}
      {/* Buttons sit side by side and wrap to their own rows when the card
          is narrow, instead of cutting the label off. */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/genuslab/quizzes/create-quiz/json/questions?id=${id}`}
          onClick={onInsertQuestions}
          className="flex flex-[1_1_8.5rem] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200"
        >
          <HiOutlinePlusCircle className="shrink-0 text-base" />
          <span>Add questions</span>
        </Link>
        <Link
          href={`/genuslab/quizzes/${id}/edit`}
          className="flex flex-[1_1_5.5rem] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <HiOutlinePencilSquare className="shrink-0 text-base" />
          <span>Edit</span>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
