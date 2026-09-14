"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import StatCard from "@/components/ui/cards/StatCard";
import AdminPagination from "@/components/ui/AdminPagination";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import Badge from "@/components/ui/Badge";
import { getAdminContacts, getAdminContactSummary } from "@/lib/api/apis";
import {
  MdSupportAgent,
  MdChevronRight,
  MdMarkEmailUnread,
  MdOutlineForum,
} from "react-icons/md";

const TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "Message", value: "message" },
  { label: "Consultation", value: "consultation" },
];

const READ_OPTIONS = [
  { label: "All", value: "" },
  { label: "Unread", value: "false" },
  { label: "Read", value: "true" },
];

export default function ContactsPage() {
  const [type, setType] = useState("");
  const [read, setRead] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: summary } = useQuery({
    queryKey: ["admin-contact-summary"],
    queryFn: async () => {
      const res = await getAdminContactSummary();
      return res?.data?.payload;
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-contacts", type, read, page],
    queryFn: async () => {
      const res = await getAdminContacts({
        type: type || undefined,
        read: read === "" ? undefined : read === "true",
        page,
        limit,
      });
      return res?.data?.payload;
    },
  });

  const contacts = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Support Messages"
        subtitle="Leads and inquiries submitted through the website."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={MdSupportAgent}
          title="Total Messages"
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
          icon={MdOutlineForum}
          title="Consultations"
          value={summary?.consultations?.toLocaleString() ?? "—"}
          accent="purple"
        />
        <StatCard
          icon={MdSupportAgent}
          title="General Messages"
          value={summary?.messages?.toLocaleString() ?? "—"}
          accent="slate"
        />
      </div>

      <AdminCard className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-48">
          <CustomSelect
            options={TYPE_OPTIONS}
            value={type}
            placeholder="All Types"
            onChange={(value: string) => {
              setType(value);
              setPage(1);
            }}
          />
        </div>
        <div className="w-full sm:w-48">
          <CustomSelect
            options={READ_OPTIONS}
            value={read}
            placeholder="All"
            onChange={(value: string) => {
              setRead(value);
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
                <th className="px-6 py-3.5 font-bold">Sender</th>
                <th className="px-6 py-3.5 font-bold">Company</th>
                <th className="px-6 py-3.5 font-bold">Type</th>
                <th className="px-6 py-3.5 font-bold">Subject</th>
                <th className="px-6 py-3.5 font-bold">Date</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
                <th className="px-6 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-slate-400">
                    Loading messages...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-red-400">
                    Unable to load messages. Please try again.
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <MdSupportAgent size={28} className="text-slate-300" />
                      <p className="font-semibold text-slate-500">
                        No messages found
                      </p>
                      <p className="text-xs text-slate-400">
                        No messages match your current filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                contacts.map((c: any) => (
                  <tr
                    key={c.id}
                    className={
                      c.read
                        ? "hover:bg-slate-50/70 transition-colors"
                        : "bg-blue-50/30 hover:bg-blue-50/50 transition-colors"
                    }
                  >
                    <td className="px-6 py-4">
                      <p className="max-w-[160px] truncate font-bold text-slate-800">
                        {c.name}
                      </p>
                      <p className="max-w-[160px] truncate text-xs text-slate-400">
                        {c.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {c.Company || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-slate-600">
                        {c.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-[220px] truncate text-slate-700">
                        {c.subject}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={c.read ? "inactive" : "info"}>
                        {c.read ? "Read" : "Unread"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/genuslab/contacts/${c.id}`}
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

        <AdminPagination meta={meta} onPageChange={setPage} itemLabel="messages" />
      </AdminCard>
    </div>
  );
}
