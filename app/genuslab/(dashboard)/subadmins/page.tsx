"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import Badge, { BadgeStatus } from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/modals/ConfirmDialog";
import {
  createAdminSubAdmin,
  deleteAdminSubAdmin,
  getAdminSubAdmins,
} from "@/lib/api/apis";
import toast from "react-hot-toast";
import { MdAdminPanelSettings, MdVisibility, MdVisibilityOff, MdContentCopy, MdAutorenew } from "react-icons/md";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useUser } from "@/store/useUser";

// Cryptographically random, no ambiguous-looking characters (no 0/O, 1/l/I).
// Guarantees at least one uppercase letter, one digit, and one special
// character by construction — the backend requires all three, and relying
// on chance to hit every category from a mixed charset risks an occasional
// generated password that fails its own validation.
const generatePassword = (length = 14) => {
  const upper = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "!@#$%&*";
  const all = upper + lower + digits + special;

  const pick = (set: string) =>
    set[crypto.getRandomValues(new Uint32Array(1))[0] % set.length];

  const required = [pick(upper), pick(digits), pick(special)];
  const rest = Array.from(
    crypto.getRandomValues(new Uint32Array(Math.max(length - required.length, 0))),
    (n) => all[n % all.length],
  );

  const combined = [...required, ...rest];
  // Shuffle so the required characters aren't always at the front.
  for (let i = combined.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined.join("");
};

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

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

const SubAdminsPage = () => {
  const queryClient = useQueryClient();
  const currentUserId = useUser((state) => state.user?.userId);
  const [pendingDelete, setPendingDelete] = useState<StaffMember | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [requirePasswordChange, setRequirePasswordChange] = useState(true);
  const [role, setRole] = useState<"ACCOUNTANT" | "SUPPORT" | "USER">(
    "ACCOUNTANT",
  );

  const handleGeneratePassword = () => {
    const generated = generatePassword();
    setPassword(generated);
    setShowPassword(true);
  };

  const handleCopyPassword = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      toast.success("Password copied to clipboard");
    } catch {
      toast.error("Couldn't copy — please copy it manually");
    }
  };

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
      const res = await createAdminSubAdmin({
        name,
        email,
        password,
        role,
        requirePasswordChange,
      });
      return res?.data?.payload;
    },
    onSuccess: () => {
      toast.success("Staff account created");
      setName("");
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setRequirePasswordChange(true);
      setRole("ACCOUNTANT");
      queryClient.invalidateQueries({ queryKey: ["admin-subadmins"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create staff account",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminSubAdmin(id),
    onSuccess: () => {
      toast.success("Staff account removed");
      setPendingDelete(null);
      queryClient.invalidateQueries({ queryKey: ["admin-subadmins"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove staff account",
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Temporary password (min. 8 characters)"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-4 pr-20 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  {showPassword ? (
                    <MdVisibilityOff size={16} />
                  ) : (
                    <MdVisibility size={16} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  aria-label="Copy password"
                  disabled={!password}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
                >
                  <MdContentCopy size={15} />
                </button>
              </div>
            </div>
            <CustomSelect
              options={ROLE_OPTIONS}
              value={role}
              onChange={(value: "ACCOUNTANT" | "SUPPORT" | "USER") =>
                setRole(value)
              }
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <MdAutorenew size={14} /> Auto-generate password
            </button>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={requirePasswordChange}
                onChange={(e) => setRequirePasswordChange(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-600"
              />
              Require password change on first login
            </label>
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

      <ConfirmDialog
        open={!!pendingDelete}
        title="Remove this staff account?"
        description={
          <>
            <span className="font-semibold text-slate-700">
              {pendingDelete?.name}
            </span>{" "}
            ({pendingDelete?.email}) will lose access immediately. This
            can&apos;t be undone.
          </>
        }
        confirmLabel="Remove Account"
        loading={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() =>
          pendingDelete && deleteMutation.mutate(pendingDelete.id)
        }
      />

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
                <th className="px-6 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                    Loading staff accounts...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-red-400">
                    Unable to load staff accounts. Please try again.
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <MdAdminPanelSettings size={28} className="text-slate-300" />
                      <p className="font-semibold text-slate-500">
                        No staff accounts yet
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                staff.map((member: StaffMember) => {
                  const isSelf = member.id === currentUserId;
                  const isAdmin = member.role === "ADMIN";
                  return (
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
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          {!isAdmin && !isSelf && (
                            <button
                              type="button"
                              onClick={() => setPendingDelete(member)}
                              aria-label={`Remove ${member.name}`}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <FaTrash size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
};

export default SubAdminsPage;
