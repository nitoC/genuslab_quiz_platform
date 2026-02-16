"use client";

import CustomInput from "@/components/FormItems/CustomInput";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

/* ------------------------------------------------------------------
   Reusable wrapped input (same shell used elsewhere)
------------------------------------------------------------------- */
interface WrappedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
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
   Password field with eye‑toggle
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
   Reset‑Password Page
------------------------------------------------------------------- */

/* ------------------------------------------------------------------
   Tailwind config (if you haven't already added it)
   ------------------------------------------------
   module.exports = {
     theme: {
       extend: {
         colors: { primary: "#2A8CFF" }, // the blue background / buttons
       },
     },
   };
------------------------------------------------------------------- */

const page = () => {
  /* for demo only */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call your API here
    alert("Password updated!");
  };

  return (
    <main className="min-h-screen bg-blue px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 lg:flex-row">
          {/* ───────── Left Artwork ───────── */}
          <div className="relative hidden sm:block sm:h-96 lg:flex-1 lg:min-h-[720px]">
            <Image
              src="/images/login.png" /* replace with your asset */
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
              {/* success badge – show conditionally in real app */}
              {/* <span className="inline-block rounded-full bg-emerald-600/90 px-6 py-1.5 text-xs font-medium text-white">
                Email sent
              </span> */}

              {/* logo */}
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="mx-auto my-8"
              />

              <h1 className="mb-10 text-2xl font-semibold md:text-3xl">
                Enter Your mail to reset password!
              </h1>

              <form onSubmit={handleSubmit} className="space-y-5">
                <CustomInput id="email" placeholder="Enter email" />

                <button
                  type="submit"
                  className="w-full rounded-md bg-blue py-3 font-medium text-white transition hover:brightness-110"
                >
                  Reset
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
