"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminCard from "@/components/ui/cards/AdminCard";
import Badge from "@/components/ui/Badge";
import { getAdminContactById, markContactAsRead } from "@/lib/api/apis";
import { MdArrowBack, MdSupportAgent, MdOutlineMail } from "react-icons/md";

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

export default function ContactDetailPage() {
  const { contactId } = useParams<{ contactId: string }>();
  const queryClient = useQueryClient();

  const { data: contact, isLoading, isError } = useQuery({
    queryKey: ["admin-contact-detail", contactId],
    enabled: !!contactId,
    queryFn: async () => {
      const res = await getAdminContactById(contactId);
      return res?.data?.payload;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: () => markContactAsRead(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-detail", contactId] });
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-contact-summary"] });
    },
  });

    // Mark as read when opened.
  useEffect(() => {
    if (contact && !contact.read && !markReadMutation.isPending) {
      markReadMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact?.id, contact?.read]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (isError || !contact) {
    return (
      <AdminCard className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-semibold text-slate-700">
          Unable to load this message
        </p>
        <p className="text-sm text-slate-400">
          It may not exist, or something went wrong fetching it.
        </p>
        <Link
          href="/genuslab/contacts"
          className="mt-2 text-sm font-bold text-blue-600 hover:underline"
        >
          Back to Support Messages
        </Link>
      </AdminCard>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/genuslab/contacts"
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
      >
        <MdArrowBack size={16} /> Back to Support Messages
      </Link>

      <AdminCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MdSupportAgent size={24} />
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                {contact.subject}
              </h1>
              <p className="text-sm text-slate-500">
                {contact.name} &middot; {contact.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge status={contact.type === "consultation" ? "info" : "inactive"}>
              {contact.type}
            </Badge>
            <Badge status={contact.read ? "success" : "warning"}>
              {contact.read ? "Read" : "Unread"}
            </Badge>
          </div>
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AdminCard className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
            Message
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {contact.message}
          </p>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
            Sender Details
          </h2>
          <InfoRow label="Name" value={contact.name} />
          <InfoRow label="Email" value={contact.email} />
          <InfoRow label="Company" value={contact.Company || "—"} />
          <InfoRow label="Type" value={<span className="capitalize">{contact.type}</span>} />
          <InfoRow label="Received" value={formatDate(contact.createdAt)} />
          {contact.readAt && (
            <InfoRow label="Read at" value={formatDate(contact.readAt)} />
          )}

          <a
            href={`mailto:${contact.email}?subject=${encodeURIComponent(`Re: ${contact.subject}`)}`}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            <MdOutlineMail size={16} /> Reply by Email
          </a>
        </AdminCard>
      </div>
    </div>
  );
}
