"use client";

import { resetPassword, verifyToken } from "@/lib/api/apis";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiCheck, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

/* ------------------------------------------------------------------
   Reusable wrapped input
------------------------------------------------------------------- */
interface WrappedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasIcon?: boolean;
  hasError?: boolean;
}

const WrappedInput: React.FC<WrappedInputProps> = ({
  className = "",
  hasIcon = false,
  hasError = false,
  ...props
}) => (
  <div
    className={`relative w-full rounded-md border bg-gray-100 px-4 py-3 text-sm transition focus-within:bg-white focus-within:ring-2 ${
      hasError
        ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/30"
        : "border-gray-300 focus-within:border-primary focus-within:ring-primary/30"
    } ${className}`}
  >
    <input
      {...props}
      className={`w-full bg-transparent outline-none placeholder:text-gray-500 ${
        hasIcon ? "pr-8" : ""
      }`}
    />
  </div>
);

/* ------------------------------------------------------------------
   Password field with eye toggle
------------------------------------------------------------------- */
interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  placeholder: string;
  hasError?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  placeholder,
  hasError,
  ...props
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <WrappedInput
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        hasIcon
        hasError={hasError}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------
   Success Modal Component
------------------------------------------------------------------- */
interface SuccessModalProps {
  isOpen: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
      <div className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl transition-all">
        {/* Success Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <FiCheck className="h-8 w-8" />
        </div>

        {/* Modal Header */}
        <h3 className="text-xl font-bold text-gray-900">
          Password Reset Successful
        </h3>

        {/* Modal Body */}
        <p className="mt-2 text-sm text-gray-500">
          Your password has been updated successfully. Please proceed to the
          login page to access your account.
        </p>

        {/* Action Button */}
        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            Proceed to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------
   Reset-Password Page
------------------------------------------------------------------- */
const ResetPasswordPage = () => {
  const params = useParams();
  const token = params?.token as string;
  const router = useRouter();

  // State Management
  const [resetEmail, setResetEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Loading & Async Verification States
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>(null);

  // Validation Rules
  const hasCapital = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasMinLength = password.length >= 8;
  const isMatching = password !== "" && password === confirmPassword;
  const isPasswordValid = hasCapital && hasNumber && hasSpecial && hasMinLength;

  // Retrieve email safely on client side
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const email = sessionStorage.getItem("reset-email");
  //     setResetEmail(email);
  //     // return () => sessionStorage.removeItem("reset-email");
  //   }
  // }, []);

  // Verify reset token on initial mount
  useEffect(() => {
    const verify = async () => {
      if (typeof window !== undefined) {
        const email = sessionStorage.getItem("reset-email");

        if (!token) {
          router.push("/login");
          return;
        }
        console.log(token, "rokwn");
        try {
          const res = await verifyToken(token);
          setData(res);
        } catch (err: any) {
          console.error("Token verification failed:", err.respon);
          setErrorMsg("Your reset link is invalid or has expired.");
          setTimeout(() => router.push("/login"), 5000);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (token) {
      verify();
    }
  }, [token, router]);

  // Submit Password Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isPasswordValid) {
      setErrorMsg("Please ensure your password meets all requirements.");
      return;
    }

    if (!isMatching) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(password, token as string);
      setIsSubmitted(true);
    } catch (err: any) {
      console.log(err.response, "res data");
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 text-slate-300 font-medium text-sm">
          <CgSpinner className="w-6 h-6 animate-spin text-blue-500" />
          <span>Verifying security token...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 flex items-center justify-center">
      {/* Success Modal */}
      <SuccessModal isOpen={isSubmitted} />

      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 lg:flex-row">
          {/* ───────── Left Artwork ───────── */}
          <div className="relative hidden sm:block sm:h-96 lg:flex-1 lg:min-h-[720px]">
            <Image
              src="/images/login.png"
              alt="Security Illustration"
              fill
              className="object-cover"
              priority
            />

            {/* Back button */}
            <Link
              href="/login"
              className="absolute right-5 top-5 rounded-full bg-black/40 px-4 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-black/60"
            >
              Back to Login &rarr;
            </Link>
          </div>

          {/* ───────── Right Form ───────── */}
          <div className="flex flex-1 items-center justify-center px-6 py-14 sm:px-10 lg:px-16">
            <div className="w-full max-w-md text-center">
              {/* Logo */}
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="mx-auto mb-6"
              />

              <h1 className="mb-2 text-2xl font-semibold md:text-3xl text-gray-900">
                Set New Password
              </h1>
              <p className="mb-8 text-sm text-gray-500">
                Your new password must be different from previous passwords.
              </p>

              {errorMsg && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-xs text-red-600 border border-red-200 text-left">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* New Password */}
                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-1 block text-xs font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <PasswordInput
                    id="new-password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Requirement Checklist */}
                <div className="space-y-1.5 rounded-md bg-gray-50 p-3 text-xs">
                  <p className="font-medium text-gray-600 mb-1">
                    Password requirements:
                  </p>
                  <RequirementItem
                    met={hasCapital}
                    text="At least one uppercase letter (A-Z)"
                  />
                  <RequirementItem
                    met={hasNumber}
                    text="At least one number (0-9)"
                  />
                  <RequirementItem
                    met={hasSpecial}
                    text="At least one special character (!@#$%^&*...)"
                  />
                  <RequirementItem
                    met={hasMinLength}
                    text="At least 8 characters long"
                  />
                </div>

                {/* Confirm Password */}
                <div className="pt-2">
                  <label
                    htmlFor="confirm-password"
                    className="mb-1 block text-xs font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <PasswordInput
                    id="confirm-password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    hasError={confirmPassword.length > 0 && !isMatching}
                  />
                  {confirmPassword.length > 0 && !isMatching && (
                    <p className="mt-1 text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isPasswordValid || !isMatching || isSubmitting}
                  className="w-full rounded-md bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <CgSpinner className="w-4 h-4 animate-spin" />
                  )}
                  <span>
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

/* Helper component for rule checks */
const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center space-x-2">
    {met ? (
      <FiCheck className="text-emerald-600 flex-shrink-0" />
    ) : (
      <FiX className="text-gray-400 flex-shrink-0" />
    )}
    <span className={met ? "text-emerald-700 font-medium" : "text-gray-500"}>
      {text}
    </span>
  </div>
);

export default ResetPasswordPage;
