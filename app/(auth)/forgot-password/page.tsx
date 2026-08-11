"use client";

import CustomInput from "@/components/ui/FormItems/CustomInput";
import { forgotPassword } from "@/lib/api/apis";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";

/* ------------------------------------------------------------------
   Reusable wrapped input
------------------------------------------------------------------- */
interface WrappedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasIcon?: boolean;
}

const WrappedInput: React.FC<WrappedInputProps> = ({
  className = "",
  hasIcon = false,
  ...props
}) => (
  <div
    className={`relative w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm
                transition focus-within:border-primary focus-within:bg-white
                focus-within:ring-2 focus-within:ring-primary/30 ${className}`}
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
   Password field with eye-toggle
------------------------------------------------------------------- */
interface PasswordInputProps {
  id: string;
  placeholder: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id, placeholder }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <WrappedInput
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        hasIcon
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------
   Reset-Password Page
------------------------------------------------------------------- */
const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const isValid = validateEmail(email);
    if (!isValid) {
      toast.error("Not a valid email address");
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
      console.error(error.response);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-blue px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 lg:flex-row">
          {/* ───────── Left Artwork (Fixed Mobile Visibility & Height) ───────── */}
          <div className="relative hidden lg:block lg:flex-1 lg:min-h-180">
            <Image
              src="/images/Login.png"
              alt="Security Illustration"
              fill
              className="object-cover"
              priority
            />

            {/* back button */}
            <Link
              href="/"
              className="absolute right-5 top-5 rounded-full bg-blue/80 px-4 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-blue"
            >
              Back to website →
            </Link>
          </div>

          {/* ───────── Right Form ───────── */}
          <div className="flex flex-1 items-center justify-center px-6 py-14 sm:px-10 lg:px-16">
            <div className="w-full max-w-md text-center">
              {/* logo */}
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="mx-auto my-8"
              />

              <h1 className="mb-10 text-2xl font-semibold md:text-3xl">
                Enter Your email to reset password!
              </h1>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full rounded-md bg-blue py-3 font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Reset"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
