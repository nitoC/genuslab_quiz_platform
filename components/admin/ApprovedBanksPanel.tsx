"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminCard from "@/components/ui/cards/AdminCard";
import AdminPagination from "@/components/ui/AdminPagination";
import ConfirmDialog from "@/components/ui/modals/ConfirmDialog";
import {
  getAdminApprovedBanks,
  createAdminApprovedBank,
  deleteAdminApprovedBank,
} from "@/lib/api/apis";
import toast from "react-hot-toast";
import { FaTrash, FaUniversity } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { MdSearch } from "react-icons/md";

// Shared between Settings and Finance & Banks — both surface the same
// approved-bank CRUD, so the logic lives in one place.
const ApprovedBanksPanel = () => {
  const queryClient = useQueryClient();
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    bankName: string;
  } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-approved-banks", search, page],
    queryFn: async () => {
      const res = await getAdminApprovedBanks({
        search: search || undefined,
        page,
        limit,
      });
      return res?.data?.payload;
    },
  });

  const banks = data?.data ?? [];
  const meta = data?.meta;

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await createAdminApprovedBank({ bankName, bankCode });
      return res?.data?.payload;
    },
    onSuccess: () => {
      toast.success("Bank added");
      setBankName("");
      setBankCode("");
      queryClient.invalidateQueries({ queryKey: ["admin-approved-banks"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add bank");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteAdminApprovedBank(id);
    },
    onSuccess: () => {
      toast.success("Bank removed");
      queryClient.invalidateQueries({ queryKey: ["admin-approved-banks"] });
      setPendingDelete(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to remove bank");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim() || !bankCode.trim()) {
      toast.error("Bank name and code are required");
      return;
    }
    createMutation.mutate();
  };

  return (
    <>
      <ConfirmDialog
        open={!!pendingDelete}
        title="Remove this bank?"
        description={
          <>
            <span className="font-semibold text-slate-700">
              {pendingDelete?.bankName}
            </span>{" "}
            will no longer be available for users to link for reward payouts.
          </>
        }
        confirmLabel="Remove Bank"
        loading={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() =>
          pendingDelete && deleteMutation.mutate(pendingDelete.id)
        }
      />

      <AdminCard>
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Approved Payout Banks
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Banks users are allowed to link for reward payouts.
            </p>
          </div>

          <div className="relative">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by bank name or code..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Bank name (e.g. GTBank)"
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
            <input
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              placeholder="Bank code (e.g. 058)"
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg px-5 py-2.5 disabled:opacity-50"
            >
              <FaPlus size={12} />
              {createMutation.isPending ? "Adding..." : "Add Bank"}
            </button>
          </form>

          <div className="divide-y divide-slate-100 border-t border-slate-100">
            {isLoading ? (
              <p className="py-6 text-center text-slate-400 text-sm">
                Loading banks...
              </p>
            ) : banks.length === 0 ? (
              <p className="py-6 text-center text-slate-400 text-sm">
                {search
                  ? "No banks match your search."
                  : "No approved banks yet."}
              </p>
            ) : (
              banks.map((bank: any) => (
                <div
                  key={bank.id}
                  className="flex items-center justify-between py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <FaUniversity size={14} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {bank.bankName}
                      </p>
                      <p className="text-xs text-slate-400">
                        Code: {bank.bankCode}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setPendingDelete({ id: bank.id, bankName: bank.bankName })
                    }
                    disabled={deleteMutation.isPending}
                    className="text-red-500 hover:text-red-600 p-2 disabled:opacity-40"
                    aria-label={`Remove ${bank.bankName}`}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          <AdminPagination meta={meta} onPageChange={setPage} itemLabel="banks" />
        </div>
      </AdminCard>
    </>
  );
};

export default ApprovedBanksPanel;
