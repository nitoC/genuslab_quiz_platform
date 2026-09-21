"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import Badge, { BadgeStatus } from "@/components/ui/Badge";
import { createAdminSubAdmin, getAdminSubAdmins } from "@/lib/api/apis";
import toast from "react-hot-toast";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

const ROLE_OPTIONS = [
  { label: "Accountant", value: "ACCOUNTANT" },
  { label: "Support", value: "SUPPORT" },
  { label: "User", value: "USER" },
];

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  ACCOUNTANT: "Accountant",
  SUPPORT: "Support",
  USER: "User",
};

const STATUS_BADGE: Record<string, BadgeStatus> = {
  active: "success",
  inactive: "inactive",
  suspended: "error",
};

const SubAdminsPage = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ACCOUNTANT" | "SUPPORT" | "USER">(
    "ACCOUNTANT",
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-subadmins"],
    queryFn: async () => {
      const res = await getAdminSubAdmins();
      return res?.data?.payload;
    },
  });

  const staff = data ?? [];

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await createAdminSubAdmin({ name, email, password, role });
      return res?.data?.payload;
    },
    onSuccess: () => {
      toast.success("Staff account created");
      setName("");
      setEmail("");
      setPassword("");
      setRole("ACCOUNTANT");
      queryClient.invalidateQueries({ queryKey: ["admin-subadmins"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create staff account",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Name, email and password are required");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Team & Roles"
        subtitle="Create staff accounts and assign them a role — Accountant, Support, or User."
      />

      <AdminCard>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Add a staff account
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Temporary password (min. 8 characters)"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
            <CustomSelect
              options={ROLE_OPTIONS}
              value={role}
              onChange={(value: "ACCOUNTANT" | "SUPPORT" | "USER") =>
                setRole(value)
              }
            />
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="flex w-fit items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg px-5 py-2.5 disabled:opacity-50"
          >
            <FaPlus size={12} />
            {createMutation.isPending ? "Creating..." : "Create Account"}
          </button>
        </form>
      </AdminCard>

      <AdminCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3.5 font-bold">Name</th>
                <th className="px-6 py-3.5 font-bold">Email</th>
                <th className="px-6 py-3.5 font-bold">Role</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
                <th className="px-6 py-3.5 font-bold">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-slate-400">
                    Loading staff accounts...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-red-400">
                    Unable to load staff accounts. Please try again.
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <MdAdminPanelSettings size={28} className="text-slate-300" />
                      <p className="font-semibold text-slate-500">
                        No staff accounts yet
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                staff.map((member: any) => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{member.email}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-600">
                        {ROLE_LABEL[member.role] || member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={STATUS_BADGE[member.status] || "inactive"}>
                        {member.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(member.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
};

export default SubAdminsPage;
