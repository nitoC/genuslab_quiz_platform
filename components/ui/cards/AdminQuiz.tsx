import React from "react";

type CourseCardProps = {
  badge: string;
  day: string | number;
  title: string;
  description: string;
  questions: number;
  attempts: number;
  completionRate: number;
};

const CourseCard: React.FC<CourseCardProps> = ({
  badge,
  day,
  title,
  description,
  questions,
  attempts,
  completionRate,
}) => {
  return (
    <div className="rounded-2xl max-w-120 bg-white p-5 shadow-sm border border-gray-100">
      {/* Top Section */}
      <div className="mb-6 flex items-center justify-between">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          • {badge}
        </span>

        <span className="text-sm font-semibold text-gray-500">Day {day}</span>
      </div>

      {/* Title */}
      <h2 className="text-[28px] font-bold leading-tight text-gray-900">
        {title}
      </h2>

      {/* Description */}
      <p className="mt-3 text-sm leading-6 text-gray-500">{description}</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Questions
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">{questions}</h3>
        </div>

        <div className="rounded-xl bg-gray-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Attempts
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {attempts.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Completion Rate
          </p>

          <span className="text-lg font-bold text-emerald-600">
            {completionRate}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
