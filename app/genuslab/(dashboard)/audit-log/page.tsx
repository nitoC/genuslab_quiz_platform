"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import AdminPagination from "@/components/ui/AdminPagination";
import { MdHistory } from "react-icons/md";
import { getAdminAuditLogs } from "@/lib/api/apis";

interface AuditLogRow {
  id: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  changes: Record<string, { before: unknown; after: unknown }> | null;
  notes: string | null;
  createdAt: string;
}

const formatAction = (action: string) =>
  action
    .split("_")
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(" ");

export default function AuditLogPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-audit-log", page],
    queryFn: async () => {
      const res = await getAdminAuditLogs({ page, limit: 25 });
      return res?.data?.payload as {
        data: AuditLogRow[];
        meta: { total: number; page: number; limit: number; totalPages: number };
      };
    },
  });

  const logs = data?.data ?? [];

  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Audit Log"
        subtitle="Every tracked change made through the admin console — who changed what, and when."
      />

      <AdminCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3.5 font-bold">Actor</th>
                <th className="px-6 py-3.5 font-bold">Action</th>
                <th className="px-6 py-3.5 font-bold">Entity</th>
                <th className="px-6 py-3.5 font-bold">Changes</th>
                <th className="px-6 py-3.5 font-bold">Notes</th>
                <th className="px-6 py-3.5 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                    Loading audit log...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-red-400">
                    Unable to load the audit log. Please try again.
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <MdHistory size={28} className="text-slate-300" />
                      <p className="font-semibold text-slate-500">
                        No changes recorded yet
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors align-top">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{log.actorEmail}</p>
                      <p className="text-xs text-slate-500">{log.actorRole}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatAction(log.action)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {log.entity}
                      <p className="text-xs text-slate-400">{log.entityId}</p>
                    </td>
                    <td className="px-6 py-4 max-w-72 text-xs text-slate-600">
                      {log.changes && Object.keys(log.changes).length > 0 ? (
                        <ul className="space-y-1">
                          {Object.entries(log.changes).map(([field, diff]) => (
                            <li key={field}>
                              <span className="font-semibold capitalize">
                                {field}
                              </span>
                              : {String(diff.before)} → {String(diff.after)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-56 text-slate-500">
                      {log.notes || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination meta={data?.meta} onPageChange={setPage} itemLabel="entries" />
      </AdminCard>
    </div>
  );
}
