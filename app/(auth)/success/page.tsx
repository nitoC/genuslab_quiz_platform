"use client";
import { authErrorMessage } from "@/lib/utils/authErrorMessage";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import {
  Mail,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Inbox,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/lib/api/apis";
import { toast } from "react-toastify";

function PasswordResetSuccessPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [copied, setCopied] = useState(false);

  // Initialize client state and safely read sessionStorage
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const storedEmail = sessionStorage.getItem("reset-email");
      setEmail(storedEmail);
    }
  }, []);

  // Handle Resend Request
  const handleResend = useCallback(async () => {
    if (cooldown > 0 || isResending || !email) return;

    setIsResending(true);
    setResendStatus("idle");

    try {
      await forgotPassword(email);
      setResendStatus("success");
      setCooldown(60);
    } catch (error) {
      setResendStatus("error");
      toast.error(authErrorMessage(error, "forgot"));
    } finally {
      setIsResending(false);
    }
  }, [cooldown, isResending, email]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Safe redirect check: ONLY trigger after client hydration completes and email check is done
  useEffect(() => {
    if (isMounted && !email) {
      router.replace("/login");
    }
  }, [isMounted, email, router]);

  // Prevent rendering before hydration or if email is missing
  if (!isMounted || !email) {
    return (
      <main className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <span>Verifying request details...</span>
        </div>
      </main>
    );
  }

  // Copy email to clipboard
  const handleCopyEmail = () => {
    if (!email) return toast.error("no email available");
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to open common webmail client in new tab
  const getWebmailUrl = (emailStr: string) => {
    if (!emailStr) return "#";
    const domain = emailStr.split("@")[1]?.toLowerCase() || "";
    if (domain.includes("gmail")) return "https://mail.google.com";
    if (
      domain.includes("outlook") ||
      domain.includes("hotmail") ||
      domain.includes("live")
    )
      return "https://outlook.live.com";
    if (domain.includes("yahoo")) return "https://mail.yahoo.com";
    if (domain.includes("icloud")) return "https://www.icloud.com/mail";
    return `https://${domain}`;
  };

  return (
    <main className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-xl">
        {/* Main Card */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-2xl backdrop-blur-xl p-6 sm:p-10 lg:p-12 text-center transition-all">
          {/* Header Brand Bar */}
          <div className="flex items-center justify-between pb-8 mb-8 border-b border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt="GenusLab Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="text-sm font-semibold tracking-wide text-slate-200">
                GenusLab Academy
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure Verification
            </span>
          </div>

          {/* Mail icon */}
          <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-8 flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-blue-600 text-white flex items-center justify-center border border-blue-500/40">
              <Mail className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1.5 rounded-full ring-4 ring-slate-900">
              <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-slate-950" />
            </div>
          </div>

          {/* Heading & Intro */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
            Check your inbox
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md mx-auto mb-6">
            If an account exists for this email, we’ve sent it a password reset
            link. Follow the link inside to set a new password.
          </p>

          {/* User Email Badge Component */}
          <div className="inline-flex items-center justify-between gap-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl px-4 py-3 max-w-full mb-8 text-left group">
            <div className="flex items-center gap-2.5 min-w-0">
              <Inbox className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-sm sm:text-sm font-mono text-slate-200 truncate select-all">
                {email}
              </span>
            </div>
            <button
              onClick={handleCopyEmail}
              title="Copy email to clipboard"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Primary Action Button: Open Webmail */}
          <div className="space-y-3 mb-8">
            <a
              href={getWebmailUrl(email)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-[0.99]"
            >
              <span>Open Email Client</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              href="/login"
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 border border-slate-700/50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>

          {/* Resend Feedback Banner */}
          {resendStatus === "success" && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm sm:text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>A fresh reset link has been dispatched to your inbox.</span>
            </div>
          )}

          {resendStatus === "error" && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm sm:text-sm flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Failed to resend link. Please try again shortly.</span>
            </div>
          )}

          {/* Resend Cooldown Section */}
          <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-sm sm:text-sm gap-3">
            <span className="text-slate-400">Didn't receive the email?</span>
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className={`inline-flex items-center gap-2 font-semibold transition-colors ${
                cooldown === 0 && !isResending
                  ? "text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                  : "text-slate-500 cursor-not-allowed"
              }`}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`}
              />
              <span>
                {isResending
                  ? "Resending..."
                  : cooldown > 0
                    ? `Resend code in ${cooldown}s`
                    : "Click to Resend"}
              </span>
            </button>
          </div>

          {/* Spam Callout Warning */}
          <div className="mt-8 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 text-left text-sm text-slate-400 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-300">Can’t find it?</strong> Please
              inspect your{" "}
              <span className="text-slate-200 underline decoration-slate-600">
                Spam
              </span>{" "}
              or{" "}
              <span className="text-slate-200 underline decoration-slate-600">
                Junk
              </span>{" "}
              folder. If it hasn't arrived in 5 minutes, double-check your email
              address entry.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-sm text-slate-500 mt-6">
          &copy; {new Date().getFullYear()} GenusLab Technologies Academy. All
          rights reserved.
        </p>
      </div>
    </main>
  );
}

const Page = () => {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
          <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
            <span>Loading...</span>
          </div>
        </main>
      }
    >
      <PasswordResetSuccessPage />
    </Suspense>
  );
};

export default Page;
