"use client";

import CustomInput from "@/components/ui/FormItems/CustomInput";
import { forgotPassword, verifyToken } from "@/lib/api/apis";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";

/* ------------------------------------------------------------------
   Token Sanitizer Helper
------------------------------------------------------------------- */
const getCleanToken = (
  rawToken: string | string[] | null | undefined,
): string => {
  if (!rawToken) return "";
  let tokenStr = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  try {
    // Handle URL encoding applied by mobile email clients
    tokenStr = decodeURIComponent(tokenStr);
  } catch (e) {
    // Fallback if already decoded
  }

  // Remove potential leading/trailing whitespace or quotes added by mobile browsers
  return tokenStr.trim().replace(/^["']|["']$/g, "");
};

/* ------------------------------------------------------------------
   Reset Password Component Inner
------------------------------------------------------------------- */
const ResetPasswordContent = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // Extract raw token from path params OR query string (?token=xyz)
  const rawToken = params?.token || searchParams.get("token");
  const token = getCleanToken(rawToken);

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenError, setTokenError] = useState("");

  // Safely verify token on mount with mobile delay guard
  useEffect(() => {
    let isMounted = true;

    // Delay check slightly to give mobile hydration time to extract URL params
    const timer = setTimeout(async () => {
      if (!token) {
        if (isMounted) {
          setTokenError("Reset token is missing or malformed.");
          setVerifying(false);
        }
        return;
      }

      try {
        await verifyToken(token);
        if (isMounted) {
          setTokenError("");
        }
      } catch (err: any) {
        console.error("Token Verification Error:", err?.response || err);
        if (isMounted) {
          const msg =
            err?.response?.data?.message ||
            "Your reset link is invalid or has expired.";
          setTokenError(msg);
          toast.error(msg);
        }
      } finally {
        if (isMounted) {
          setVerifying(false);
        }
      }
    }, 150); // Small buffer for mobile router state initialization

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (tokenError) {
      toast.error("Cannot proceed with an invalid token.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await forgotPassword(email);
      if (res?.data?.status) {
        sessionStorage.setItem("reset-email", email);
        router.push(`/success`);
      } else {
        toast.error(res?.data?.message || "Could not process request.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 flex items-center justify-center">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 lg:flex-row">
          {/* ───────── Left Artwork ───────── */}
          <div className="relative block h-64 sm:h-96 lg:flex-1 lg:min-h-[720px]">
            <Image
              src="/images/login.png" // Ensure lowercase matching on Linux
              alt="Security Illustration"
              fill
              className="object-cover"
              priority
            />
            <Link
              href="/"
              className="absolute right-5 top-5 rounded-full bg-black/50 px-4 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-black/70"
            >
              Back to website →
            </Link>
          </div>

          {/* ───────── Right Form ───────── */}
          <div className="flex flex-1 items-center justify-center px-6 py-14 sm:px-10 lg:px-16">
            <div className="w-full max-w-md text-center">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="mx-auto my-6"
              />

              <h1 className="mb-4 text-2xl font-semibold md:text-3xl text-gray-900">
                Reset Password
              </h1>

              {/* Loader State for Mobile */}
              {verifying ? (
                <div className="py-8 text-sm text-gray-500 animate-pulse">
                  Verifying reset link integrity...
                </div>
              ) : tokenError ? (
                /* Token Error View */
                <div className="my-6 rounded-lg bg-red-50 p-4 border border-red-200 text-left">
                  <p className="text-sm font-semibold text-red-800">
                    Invalid Reset Link
                  </p>
                  <p className="mt-1 text-xs text-red-600">{tokenError}</p>
                  <Link
                    href="/forgot-password"
                    className="mt-4 inline-block w-full text-center rounded-md bg-red-600 py-2 text-xs font-medium text-white hover:bg-red-700"
                  >
                    Request New Link
                  </Link>
                </div>
              ) : (
                /* Active Form View */
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  <CustomInput
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    id="email"
                    placeholder="Enter email"
                    disabled={submitting}
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-md bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Reset"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

/* Export wrapped in Suspense for Next.js App Router */
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
