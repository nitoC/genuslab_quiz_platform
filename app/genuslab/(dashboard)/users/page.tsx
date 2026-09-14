"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import AdminPagination from "@/components/ui/AdminPagination";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import Badge, { BadgeStatus } from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/modals/ConfirmDialog";
import { getAdminUsers, updateAdminUserStatus } from "@/lib/api/apis";
import toast from "react-hot-toast";
import { FaCrown } from "react-icons/fa";
import { MdSearch, MdChevronRight } from "react-icons/md";

const STATUS_BADGE: Record<string, BadgeStatus> = {
  active: "success",
  inactive: "inactive",
  suspended: "error",
};

const PLAN_OPTIONS = [
  { label: "All Plans", value: "" },
  { label: "Premium", value: "premium" },
  { label: "Free", value: "free" },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const initials = (name: string) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const UsersPage = () => (
  <Suspense fallback={null}>
    <UsersPageContent />
  </Suspense>
);

const UsersPageContent = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState<"" | "premium" | "free">("");
  const [page, setPage] = useState(1);
  const [pendingSuspend, setPendingSuspend] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const limit = 10;

  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam === "premium" || planParam === "free") {
      setPlan(planParam);
    }
  }, [searchParams]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-users", search, status, plan, page],
    queryFn: async () => {
      const res = await getAdminUsers({
        search: search || undefined,
        status: status || undefined,
        plan: plan || undefined,
        page,
        limit,
      });
      return res?.data?.payload;
    },
  });

  const users = data?.data ?? [];
  const meta = data?.meta;

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await updateAdminUserStatus(id, status);
      return res?.data?.payload;
    },
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setPendingSuspend(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update user status.",
      );
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Users"
        subtitle="View and manage every registered Genus Lab user."
      />

      <ConfirmDialog
        open={!!pendingSuspend}
        title="Suspend this user?"
        description={
          <>
            <span className="font-semibold text-slate-700">
              {pendingSuspend?.name}
            </span>{" "}
            will immediately lose access to their account until reactivated.
          </>
        }
        confirmLabel="Suspend User"
        loading={statusMutation.isPending}
        onCancel={() => setPendingSuspend(null)}
        onConfirm={() =>
          pendingSuspend &&
          statusMutation.mutate({ id: pendingSuspend.id, status: "suspended" })
        }
      />

      {/* FILTERS */}
      <AdminCard className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
          />
        </div>

        <div className="w-full sm:w-48">
          <CustomSelect
            options={PLAN_OPTIONS}
            value={plan}
            placeholder="All Plans"
            onChange={(value: "" | "premium" | "free") => {
              setPlan(value);
              setPage(1);
            }}
          />
        </div>

        <div className="w-full sm:w-48">
          <CustomSelect
            options={STATUS_OPTIONS}
            value={status}
            placeholder="All Statuses"
            onChange={(value: string) => {
              setStatus(value);
              setPage(1);
            }}
          />
        </div>
      </AdminCard>

      <AdminCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3.5 font-bold">User</th>
                <th className="px-6 py-3.5 font-bold">Plan</th>
                <th className="px-6 py-3.5 font-bold">XP</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
                <th className="px-6 py-3.5 font-bold">Joined</th>
                <th className="px-6 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-red-400">
                    Unable to load users. Please try again.
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                    <p className="font-semibold text-slate-500">No users found</p>
                    <p className="mt-1 text-xs text-slate-400">
                      No users match your current search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                          {initials(user.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="max-w-[200px] truncate font-bold text-slate-800" title={user.name}>
                            {user.name}
                          </p>
                          <p className="max-w-[200px] truncate text-slate-400 text-xs" title={user.email}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.isSubscribed ? (
                        <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold">
                          <FaCrown size={11} /> Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-bold">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {user.details?.xp ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={STATUS_BADGE[user.status] || "inactive"}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-4">
                        {user.status === "suspended" ? (
                          <button
                            disabled={statusMutation.isPending}
                            onClick={() =>
                              statusMutation.mutate({ id: user.id, status: "active" })
                            }
                            className="text-emerald-600 hover:underline text-xs font-bold disabled:opacity-50"
                          >
                            Activate
                          </button>
                        ) : (
                          <button
                            disabled={statusMutation.isPending}
                            onClick={() =>
                              setPendingSuspend({ id: user.id, name: user.name })
                            }
                            className="text-red-600 hover:underline text-xs font-bold disabled:opacity-50"
                          >
                            Suspend
                          </button>
                        )}
                        <Link
                          href={`/genuslab/users/${user.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                        >
                          View <MdChevronRight size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination meta={meta} onPageChange={setPage} itemLabel="users" />
      </AdminCard>
    </div>
  );
};

export default UsersPage;
