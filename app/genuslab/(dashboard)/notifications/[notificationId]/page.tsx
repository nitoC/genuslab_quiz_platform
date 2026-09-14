"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AdminCard from "@/components/ui/cards/AdminCard";
import { getAdminNotificationDetail } from "@/lib/api/apis";
import { MdArrowBack, MdNotificationsActive, MdOpenInNew } from "react-icons/md";

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between border-b border-slate-50 py-2.5 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="max-w-[60%] truncate text-sm font-semibold text-slate-800">
      {value}
    </span>
  </div>
);

export default function NotificationDetailPage() {
  const { notificationId } = useParams<{ notificationId: string }>();

  const { data: notification, isLoading, isError } = useQuery({
    queryKey: ["admin-notification-detail", notificationId],
    enabled: !!notificationId,
    queryFn: async () => {
      const res = await getAdminNotificationDetail(notificationId);
      return res?.data?.payload;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (isError || !notification) {
    return (
      <AdminCard className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-semibold text-slate-700">
          Unable to load this notification
        </p>
        <p className="text-sm text-slate-400">
          It may not exist, or something went wrong fetching it.
        </p>
        <Link
          href="/genuslab/notifications"
          className="mt-2 text-sm font-bold text-blue-600 hover:underline"
        >
          Back to Notifications
        </Link>
      </AdminCard>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/genuslab/notifications"
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
      >
        <MdArrowBack size={16} /> Back to Notifications
      </Link>

      <AdminCard>
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <MdNotificationsActive size={24} />
          </span>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              {notification.title}
            </h1>
            <p className="text-sm text-slate-500">
              Sent {formatDate(notification.createdAt)}
            </p>
          </div>
        </div>

        <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {notification.content}
        </p>

        {notification.actionUrl && (
          <a
            href={notification.actionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:underline"
          >
            {notification.actionUrl} <MdOpenInNew size={14} />
          </a>
        )}
      </AdminCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
            Delivery
          </h2>
          <InfoRow
            label="Audience"
            value={
              <span className="capitalize">
                {notification.metadata?.audience || "—"}
              </span>
            }
          />
          <InfoRow
            label="Recipients"
            value={notification.recipients.toLocaleString()}
          />
          <InfoRow label="Read" value={notification.read.toLocaleString()} />
          <InfoRow label="Unread" value={notification.unread.toLocaleString()} />
        </AdminCard>

        <AdminCard>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
            Content
          </h2>
          <InfoRow label="Type" value={notification.type} />
          <InfoRow label="Created" value={formatDate(notification.createdAt)} />
          {notification.readAt && (
            <InfoRow
              label="This recipient read at"
              value={formatDate(notification.readAt)}
            />
          )}
        </AdminCard>
      </div>
    </div>
  );
}
