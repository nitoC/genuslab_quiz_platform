"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MdVisibility, MdVisibilityOff, MdLock } from "react-icons/md";
import toast from "react-hot-toast";
import { changePassword } from "@/lib/api/apis";
import { useUser } from "@/store/useUser";

const PASSWORD_RULE =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstLogin = searchParams.get("first") === "true";
  const user = useUser((state) => state.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const landingPage =
    user?.role === "ACCOUNTANT"
      ? "/genuslab/transactions"
      : user?.role === "SUPPORT"
        ? "/genuslab/users"
        : "/genuslab/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation don't match");
      return;
    }
    if (!PASSWORD_RULE.test(newPassword)) {
      toast.error(
        "Password must be at least 8 characters and include an uppercase letter, a number, and a special character",
      );
      return;
    }

    try {
      setSubmitting(true);
      await changePassword({ currentPassword, newPassword });
      toast.success("Password updated");
      router.push(landingPage);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update password",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f4fa] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="mb-6 flex flex-col items-center text-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <MdLock size={22} />
          </span>
          <h1 className="text-xl font-bold text-slate-900">
            {isFirstLogin ? "Set a new password" : "Change password"}
          </h1>
          <p className="text-sm text-slate-500">
            {isFirstLogin
              ? "For security, you need to set your own password before continuing."
              : "Update the password used to sign in to the admin console."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {isFirstLogin ? "Temporary password" : "Current password"}
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-11 text-sm outline-none focus:border-blue-400 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? (
                  <MdVisibilityOff size={18} />
                ) : (
                  <MdVisibility size={18} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              New password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-11 text-sm outline-none focus:border-blue-400 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? (
                  <MdVisibilityOff size={18} />
                ) : (
                  <MdVisibility size={18} />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              At least 8 characters, with an uppercase letter, a number, and a
              special character.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Confirm new password
            </label>
            <input
              type={showNew ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={null}>
      <ChangePasswordForm />
    </Suspense>
  );
}
