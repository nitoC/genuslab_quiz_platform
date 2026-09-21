import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Dark-theme counterpart to AdminPagination, for user-facing dashboard pages.
const Pagination = ({
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
    <div className="flex items-center justify-between px-1 py-2">
      <p className="text-xs text-grey">
        Page {meta.page} of {meta.totalPages} · {meta.total} {itemLabel}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-white/10 bg-white/5 text-grey disabled:opacity-40 hover:bg-white/10 hover:text-(--primary) transition-colors"
        >
          <MdChevronLeft size={14} /> Previous
        </button>
        <button
          type="button"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-white/10 bg-white/5 text-grey disabled:opacity-40 hover:bg-white/10 hover:text-(--primary) transition-colors"
        >
          Next <MdChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
