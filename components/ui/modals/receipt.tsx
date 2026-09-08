"use client";
"use client";
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CheckCircle2, Download, X, ShieldCheck, Loader2 } from "lucide-react";

export interface TransactionReceiptData {
  transactionId: string | number;
  amount: number;
  currency: string;
  txRef: string;
  paymentType?: string;
  createdAt: string;
  user: {
    name?: string;
    email?: string;
  };
  planName: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: TransactionReceiptData | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  receiptData,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !receiptData) return null;

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);

    try {
      const element = receiptRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution export
        useCORS: true,
        backgroundColor: "#0f172a", // Match slate-900 background
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Genuslab_Receipt_${receiptData.transactionId}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      {/* Overlay backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-auto">
        {/* Header Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold text-slate-200">
              Payment Successful
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable/Downloadable Receipt Canvas */}
        <div
          ref={receiptRef}
          className="p-6 md:p-8 bg-slate-900 text-slate-100 space-y-6 relative overflow-hidden"
        >
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Brand Header & Status */}
          <div className="text-center space-y-2 border-b border-slate-800/80 pb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Payment Receipt
            </h2>
            <p className="text-sm text-slate-400">
              Genuslab Academy Subscription
            </p>
          </div>

          {/* Amount Display */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-slate-400">
              Total Amount Paid
            </span>
            <div className="text-3xl font-extrabold text-white mt-1">
              {receiptData.currency} {receiptData.amount.toLocaleString()}
            </div>
          </div>

          {/* Key Transaction Metadata */}
          <div className="space-y-3 text-sm md:text-sm">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Plan Enrolled</span>
              <span className="font-semibold text-slate-200">
                {receiptData.planName}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-800/50">
              <span className="text-slate-400">Billed To</span>
              <span className="font-medium text-slate-200">
                {receiptData.user.name || receiptData.user.email}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-800/50">
              <span className="text-slate-400">Transaction ID</span>
              <span className="font-mono text-slate-300">
                {receiptData.transactionId}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-800/50">
              <span className="text-slate-400">Reference Ref</span>
              <span className="font-mono text-sm text-slate-400 truncate max-w-[200px]">
                {receiptData.txRef}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-800/50">
              <span className="text-slate-400">Payment Channel</span>
              <span className="capitalize font-medium text-slate-300">
                {receiptData.paymentType || "Card / Web"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-800/50">
              <span className="text-slate-400">Date & Time</span>
              <span className="text-slate-300">{receiptData.createdAt}</span>
            </div>
          </div>

          {/* Footer Note inside printable area */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-[14px] text-slate-500">
              Thank you for subscribing to Genuslab Academy. For queries,
              contact support@genuslabtech.online
            </p>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-sm shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Receipt PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
