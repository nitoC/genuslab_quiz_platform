import React from "react";

// The page-header pattern for every admin page EXCEPT /genuslab/quizzes,
// which keeps its own pre-existing AdminHeader untouched (see
// components/layouts/AdminHeader.tsx). The sidebar menu toggle lives in the
// global AdminTopbar now, so this component only ever renders title,
// subtitle, and contextual actions.
const AdminPageHeader = ({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) => {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
};

export default AdminPageHeader;
