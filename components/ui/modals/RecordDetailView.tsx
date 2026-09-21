"use client";

import React, { useRef, useState } from "react";
// html2canvas-pro (not vanilla html2canvas) — Tailwind v4's default palette
// emits modern CSS color functions (oklch/lab) that html2canvas 1.x can't
// parse and crashes on; this fork adds support for them, same API.
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { MdArrowBack, MdDownload } from "react-icons/md";
import GlassBadge from "@/components/ui/GlassBadge";
import { cn } from "@/lib/utils/cn";

export interface RecordDetailRow {
  label: string;
  value: React.ReactNode;
}

export interface RecordDetailViewProps {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  documentTitle: string; // e.g. "Transaction Receipt", "Subscription Receipt"
  subtitle?: string; // e.g. plan/transaction title
  amount?: string; // pre-formatted, e.g. "₦4,000"
  amountLabel?: string;
  statusLabel?: string;
  statusVariant?: "success" | "warning" | "danger" | "neutral";
  reference: string; // the transaction/subscription reference shown prominently
  rows: RecordDetailRow[];
  filename: string; // used as the downloaded PDF's file name
}

// Full-screen (not a centered card) detail view, reused for both
// transactions and subscriptions so a single PDF-export implementation
// (html2canvas + jsPDF, same technique as components/ui/modals/receipt.tsx)
// serves every downloadable record on the frontend.
export const RecordDetailView: React.FC<RecordDetailViewProps> = ({
  open,
  onClose,
  loading,
  documentTitle,
  subtitle,
  amount,
  amountLabel = "Amount",
  statusLabel,
  statusVariant = "neutral",
  reference,
  rows,
  filename,
}) => {
  const printableRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!open) return null;

  const handleDownloadPDF = async () => {
    if (!printableRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(printableRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0f172a",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-(--background) overflow-y-auto">
      {/* Sticky header bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-(--background)/95 backdrop-blur-md px-4 md:px-8 py-4">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm font-semibold text-grey hover:text-(--primary) transition-colors cursor-pointer"
        >
          <MdArrowBack size={18} /> Back
        </button>

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isDownloading || loading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue/90 disabled:opacity-50 cursor-pointer"
        >
          <MdDownload size={16} />
          {isDownloading ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 px-4 md:px-8 py-8 md:py-12">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div
            ref={printableRef}
            className="mx-auto w-full max-w-xl bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
          >
            <div className="p-6 md:p-8 space-y-6">
              {/* Header — plain title/subtitle, no decorative icon. The
                  amount (the actual important number) carries the visual
                  weight instead of a checkmark-in-a-circle badge. */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-6">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white">
                    {documentTitle}
                  </h2>
                  {subtitle && (
                    <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>
                  )}
                </div>
                {statusLabel && (
                  <GlassBadge variant={statusVariant}>{statusLabel}</GlassBadge>
                )}
              </div>

              {amount && (
                <div>
                  <p className="text-sm text-slate-400">{amountLabel}</p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {amount}
                  </p>
                </div>
              )}

              <div className="space-y-3 text-sm md:text-sm">
                <div className="flex justify-between items-center py-1 gap-4">
                  <span className="text-slate-400 shrink-0">Reference</span>
                  <span className="font-mono font-medium text-slate-200 text-right break-all">
                    {reference}
                  </span>
                </div>
                {rows.map((row, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-1 gap-4 border-t border-slate-800/50"
                  >
                    <span className="text-slate-400 shrink-0">
                      {row.label}
                    </span>
                    <span className="font-medium text-slate-200 text-right break-words">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-[14px] text-slate-500">
                  For queries, contact support@genuslabtech.online
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordDetailView;
