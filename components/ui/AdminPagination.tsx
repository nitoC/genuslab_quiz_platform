import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Extracted from the pagination footer duplicated across the Users and
// Transactions admin pages so every new list page shares one implementation.
const AdminPagination = ({
  meta,
  onPageChange,
  itemLabel = "items",
}: {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}) => {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
      <p className="text-xs text-slate-500">
        Page {meta.page} of {meta.totalPages} · {meta.total} {itemLabel}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
        >
          <MdChevronLeft size={14} /> Previous
        </button>
        <button
          type="button"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
        >
          Next <MdChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
