"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import StatCard from "@/components/ui/cards/StatCard";
import AdminPagination from "@/components/ui/AdminPagination";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import {
  getAdminNotificationHistory,
  getAdminNotificationSummary,
  broadcastNotification,
  BroadcastNotificationInput,
} from "@/lib/api/apis";
import toast from "react-hot-toast";
import {
  MdNotificationsActive,
  MdMarkEmailUnread,
  MdMarkEmailRead,
  MdChevronRight,
  MdClose,
  MdAdd,
} from "react-icons/md";

const AUDIENCE_OPTIONS = [
  { label: "All Users", value: "all" },
  { label: "Premium Users", value: "premium" },
  { label: "Free Users", value: "free" },
];

const emptyForm: BroadcastNotificationInput = {
  title: "",
  content: "",
  actionUrl: "",
  audience: "all",
};

const BroadcastModal = ({
  open,
  onClose,
  onSent,
}: {
  open: boolean;
  onClose: () => void;
  onSent: () => void;
}) => {
  const [form, setForm] = useState<BroadcastNotificationInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: (payload: BroadcastNotificationInput) =>
      broadcastNotification(payload),
    onSuccess: (res) => {
      const count = res?.data?.payload?.recipientCount ?? 0;
      toast.success(`Notification sent to ${count.toLocaleString()} user(s).`);
      setForm(emptyForm);
      onSent();
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to send notification.",
      );
    },
  });

  if (!open) return null;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (!form.content.trim()) next.content = "Message is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({
      ...form,
      actionUrl: form.actionUrl?.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            Compose Notification
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <MdClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. New quiz episode is live!"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Message</label>
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
              rows={4}
              placeholder="Write the notification message..."
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
            {errors.content && (
              <p className="text-xs text-red-500">{errors.content}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Action URL{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              value={form.actionUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, actionUrl: e.target.value }))
              }
              placeholder="https://..."
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Target audience
            </label>
            <CustomSelect
              options={AUDIENCE_OPTIONS}
              value={form.audience}
              onChange={(value: BroadcastNotificationInput["audience"]) =>
                setForm((f) => ({ ...f, audience: value }))
              }
            />
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {mutation.isPending ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [composeOpen, setComposeOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: summary } = useQuery({
    queryKey: ["admin-notification-summary"],
    queryFn: async () => {
      const res = await getAdminNotificationSummary();
      return res?.data?.payload;
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-notification-history", page],
    queryFn: async () => {
      const res = await getAdminNotificationHistory({ page, limit });
      return res?.data?.payload;
    },
  });

  const history = data?.data ?? [];
  const meta = data?.meta;

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-notification-summary"] });
    queryClient.invalidateQueries({ queryKey: ["admin-notification-history"] });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Notifications"
        subtitle="Broadcast messages and review notification delivery."
        actions={
          <button
            type="button"
            onClick={() => setComposeOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            <MdAdd size={18} /> Compose Notification
          </button>
        }
      />

      <BroadcastModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onSent={refreshAll}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          icon={MdNotificationsActive}
          title="Total Notifications"
          value={summary?.total?.toLocaleString() ?? "—"}
          accent="blue"
        />
        <StatCard
          icon={MdMarkEmailUnread}
          title="Unread"
          value={summary?.unread?.toLocaleString() ?? "—"}
          accent="red"
        />
        <StatCard
          icon={MdMarkEmailRead}
          title="Read"
          value={summary?.read?.toLocaleString() ?? "—"}
          accent="emerald"
        />
      </div>

      <AdminCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3.5 font-bold">Title</th>
                <th className="px-6 py-3.5 font-bold">Audience</th>
                <th className="px-6 py-3.5 font-bold text-right">Recipients</th>
                <th className="px-6 py-3.5 font-bold text-right">Read</th>
                <th className="px-6 py-3.5 font-bold text-right">Unread</th>
                <th className="px-6 py-3.5 font-bold">Sent</th>
                <th className="px-6 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-slate-400">
                    Loading notifications...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-red-400">
                    Unable to load notification history. Please try again.
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <MdNotificationsActive size={28} className="text-slate-300" />
                      <p className="font-semibold text-slate-500">
                        No notifications sent yet
                      </p>
                      <p className="text-xs text-slate-400">
                        Compose your first broadcast to reach your users.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((n: any) => (
                  <tr key={n.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <p className="max-w-[220px] truncate font-bold text-slate-800">
                        {n.title}
                      </p>
                      <p className="max-w-[220px] truncate text-xs text-slate-400">
                        {n.content}
                      </p>
                    </td>
                    <td className="px-6 py-4 capitalize text-slate-600">
                      {n.metadata?.audience || "—"}
                    </td>
                    <td className="font-data px-6 py-4 text-right text-slate-600">
                      {n.recipients.toLocaleString()}
                    </td>
                    <td className="font-data px-6 py-4 text-right text-emerald-600">
                      {n.read.toLocaleString()}
                    </td>
                    <td className="font-data px-6 py-4 text-right text-red-500">
                      {n.unread.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(n.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/genuslab/notifications/${n.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        View <MdChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          meta={meta}
          onPageChange={setPage}
          itemLabel="broadcasts"
        />
      </AdminCard>
    </div>
  );
}
