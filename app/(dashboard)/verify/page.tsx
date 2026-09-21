"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import {
  FaEnvelope,
  FaArrowRight,
  FaRedo,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import OtpInputWrapper from "@/components/ui/Otp";
import GlassCard from "@/components/ui/cards/GlassCard";
import PageLoader from "@/components/ui/PageLoader";
import useUser from "@/hooks/useUser";
import { getOtp, verifyEmail } from "@/lib/api/apis";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { constants } from "@/app/constants";

const INITIAL_TIME_IN_SECONDS = 300; // 5 minutes

const hasSent = "otp_sent";
const OTP_TIMESTAMP_KEY = "otp_sent_timestamp";

function OtpVerificationContent() {
  const params = useSearchParams();
  const router = useRouter();

  const timeOutRef = useRef<NodeJS.Timeout | null>(null);
  const hasSentOtp = useRef(false); // Prevents Strict Mode double-firing in dev

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_IN_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const { data, isLoading, isError } = useUser();

  // 1. Initial OTP send on load (Waits for user data to arrive safely)
  useEffect(() => {
    const sent = sessionStorage.getItem(hasSent);
    const prevTime = sessionStorage.getItem(OTP_TIMESTAMP_KEY);
    if (sent && prevTime) {
      const elapsedSeconds = Math.floor((Date.now() - Number(prevTime)) / 1000);
      const remaining = INITIAL_TIME_IN_SECONDS - elapsedSeconds;
      setTimeLeft(remaining > 0 ? remaining : 0);
    }
    if (
      data?.user?.email &&
      !data?.user?.verified &&
      !hasSentOtp.current &&
      !sent
    ) {
      hasSentOtp.current = true; // Lock it instantly
      sessionStorage.setItem(hasSent, String(true));
      sessionStorage.setItem(OTP_TIMESTAMP_KEY, String(Date.now()));

      const sendInitialOtp = async () => {
        try {
          await getOtp(data.user.email);
          setStatusMessage({
            type: "success",
            text: "A verification code has been sent to your email.",
          });
        } catch (err: any) {
          console.error("Initial OTP Send Error:", err?.response);
          sessionStorage.removeItem(hasSent);
          sessionStorage.removeItem(OTP_TIMESTAMP_KEY);
          hasSentOtp.current = false;
          setStatusMessage({
            type: "error",
            text: "Failed to send verification code. Please click resend.",
          });
        }
      };

      sendInitialOtp();
    }
  }, [data?.user?.email, data?.user?.verified]);

  // 2. Countdown Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) return;

    if (data?.user && !data?.user.verified) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, data?.user]);

  // 3. Clear redirect timeouts on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeOutRef.current) clearTimeout(timeOutRef.current);
    };
  }, []);

  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle OTP Submission
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otp.length < 4 || isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      if (data?.user?.email) {
        await verifyEmail(data.user.email, otp);

        sessionStorage.removeItem(hasSent);
        sessionStorage.removeItem(OTP_TIMESTAMP_KEY);

        setStatusMessage({
          type: "success",
          text: "Email verified successfully! Redirecting...",
        });

        await queryClient.invalidateQueries({
          queryKey: [constants.USER, data.user.id],
        });

        timeOutRef.current = setTimeout(() => {
          router.replace("/dashboard");
        }, 1000);
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Invalid or expired verification code. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Resend Code Action
  const handleResend = useCallback(async () => {
    if (timeLeft > 0 || isResending) return;

    setIsResending(true);
    setStatusMessage(null);

    try {
      if (data?.user?.email) {
        await getOtp(data.user.email);

        sessionStorage.setItem(hasSent, String(true));
        sessionStorage.setItem(OTP_TIMESTAMP_KEY, String(Date.now()));
        setTimeLeft(INITIAL_TIME_IN_SECONDS);
        setOtp("");
        setStatusMessage({
          type: "success",
          text: "A new verification code has been sent to your email.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Failed to resend code. Please try again shortly.",
      });
    } finally {
      setIsResending(false);
    }
  }, [timeLeft, isResending, data?.user?.email]);

  const isTimerExpired = timeLeft === 0;

  if (isLoading) {
    return <PageLoader theme="dark" label="Loading user profile..." />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <div className="w-full max-w-md">
        <GlassCard className="p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl border border-white/10">
          {/* Header Icon */}
          <div className="w-16 h-16 rounded-2xl bg-blue/20 border border-blue/30 text-blue flex items-center justify-center mb-6 shadow-inner">
            <FaEnvelope size={28} />
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-sm sm:text-sm text-slate-300 max-w-xs mb-6 leading-relaxed">
            We've sent a verification code to your email address. Please enter
            it below to confirm your account.
          </p>

          {/* Status Message Notification */}
          {statusMessage && (
            <div
              className={`w-full p-3 rounded-xl mb-6 text-sm sm:text-sm flex items-center gap-2 text-left border ${
                statusMessage.type === "success"
                  ? "bg-green/20 text-green border-green/30"
                  : "bg-red/20 text-red border-red/30"
              }`}
            >
              {statusMessage.type === "success" ? (
                <FaCheckCircle className="shrink-0" size={14} />
              ) : (
                <FaExclamationCircle className="shrink-0" size={14} />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* OTP Input Form */}
          <form
            onSubmit={handleVerify}
            className="w-full flex flex-col items-center gap-6"
          >
            <div className="w-full text-blue-400 flex justify-center my-2 otp items-center">
              <OtpInputWrapper
                otp={otp}
                setOtp={(val: string) => setOtp(val)}
              />
            </div>

            {/* Countdown Timer Display */}
            <div className="flex items-center gap-2 text-sm sm:text-sm font-medium">
              <span className="text-slate-400">Code expires in:</span>
              <span
                className={`font-mono font-bold ${isTimerExpired ? "text-red" : "text-blue"}`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || otp.length < 4 || isTimerExpired}
              className="w-full py-3 px-6 rounded-xl text-sm sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-blue hover:opacity-90 text-white shadow-lg shadow-blue/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isSubmitting ? (
                <span>Verifying Code...</span>
              ) : (
                <>
                  <span>Verify Email</span>
                  <FaArrowRight size={12} />
                </>
              )}
            </button>
          </form>

          {/* Resend Action Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 w-full flex items-center justify-between text-sm sm:text-sm">
            <span className="text-slate-400">Didn't receive a code?</span>
            <button
              onClick={handleResend}
              disabled={!isTimerExpired || isResending}
              className={`flex items-center gap-1.5 font-semibold transition-colors ${
                isTimerExpired && !isResending
                  ? "text-blue hover:underline cursor-pointer"
                  : "text-slate-500 cursor-not-allowed"
              }`}
            >
              <FaRedo size={10} className={isResending ? "animate-spin" : ""} />
              <span>{isResending ? "Sending..." : "Resend Code"}</span>
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default function OtpVerificationPage() {
  return (
    <Suspense fallback={<PageLoader theme="dark" />}>
      <OtpVerificationContent />
    </Suspense>
  );
}
