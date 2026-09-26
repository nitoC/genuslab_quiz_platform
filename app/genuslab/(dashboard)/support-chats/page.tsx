"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import StatCard from "@/components/ui/cards/StatCard";
import AdminPagination from "@/components/ui/AdminPagination";
import Badge from "@/components/ui/Badge";
import { CHAT_STATUS } from "@/features/support/chatStatus";
import { getSupportChats, getSupportChatSummary } from "@/lib/api/apis";
import { MdChevronRight, MdHeadsetMic, MdHourglassTop, MdSmartToy, MdForum } from "react-icons/md";


const TABS = [
  { label: "Waiting", value: "WAITING" },
  { label: "With staff", value: "HUMAN" },
  { label: "AI only", value: "AI" },
  { label: "All open", value: "" },
  { label: "Closed", value: "CLOSED" },
];

export default function SupportChatsPage() {
  const [status, setStatus] = useState("WAITING");
  const [page, setPage] = useState(1);

  // Polled so new handoffs show up without a refresh.
  const { data: summary } = useQuery({
    queryKey: ["support-chat-summary"],
    queryFn: async () => (await getSupportChatSummary()).data?.payload,
    refetchInterval: 15000,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["support-chats", status, page],
    queryFn: async () => (await getSupportChats(status, page)).data?.payload,
    refetchInterval: 15000,
  });

  const chats = data?.data ?? [];

  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Support Chats"
        subtitle="Conversations the AI handed to staff, or where a user asked for a person. Reply and the user sees it in their Support chat."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={MdHourglassTop} title="Waiting" value={summary?.WAITING ?? "—"} accent="red" />
        <StatCard icon={MdHeadsetMic} title="With staff" value={summary?.HUMAN ?? "—"} accent="amber" />
        <StatCard icon={MdSmartToy} title="AI only" value={summary?.AI ?? "—"} accent="blue" />
        <StatCard icon={MdForum} title="Closed" value={summary?.CLOSED ?? "—"} accent="slate" />
      </div>

      <AdminCard className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => {
              setStatus(t.value);
              setPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
              status === t.value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.label}
            {t.value === "WAITING" && summary?.WAITING ? ` (${summary.WAITING})` : ""}
          </button>
        ))}
      </AdminCard>

      <AdminCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3.5 font-bold">User</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
                <th className="px-6 py-3.5 font-bold">Last message</th>
                <th className="px-6 py-3.5 font-bold">Handled by</th>
                <th className="px-6 py-3.5 font-bold">Updated</th>
                <th className="px-6 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">Loading…</td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-rose-500">Couldn't load chats.</td>
                </tr>
              )}
              {!isLoading && !isError && chats.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">No conversations here.</td>
                </tr>
              )}
              {chats.map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{c.user?.name}</div>
                    <div className="text-xs text-slate-400">{c.user?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={CHAT_STATUS[c.status]?.badge ?? "info"}>
                      {CHAT_STATUS[c.status]?.label ?? c.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 max-w-sm">
                    <p className="truncate text-slate-600">
                      {c.lastMessage ? `${c.lastMessage.sender === "USER" ? "" : c.lastMessage.sender.toLowerCase() + ": "}${c.lastMessage.content}` : "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{c.assignedTo?.name ?? "—"}</td>
                  <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                    {new Date(c.lastMessageAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/genuslab/support-chats/${c.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                    >
                      Open <MdChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 pb-4">
          <AdminPagination meta={data?.meta} onPageChange={setPage} />
        </div>
      </AdminCard>
    </div>
  );
}
