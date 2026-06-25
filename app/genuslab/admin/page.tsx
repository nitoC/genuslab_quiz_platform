"use client";

import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FaShieldHalved } from "react-icons/fa6";
import { adminLogin } from "@/lib/api/apis";
import { toast, ToastContainer } from "react-toastify";
import { set } from "react-datepicker/dist/dist/date_utils.js";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [sending, setSending] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("admin@genuslab.com");
  const [password, setPassword] = useState("password123");

  const validate = (email: string, password: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warn("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      toast.warn("Please enter your password.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      setSending(true);
      const res = await adminLogin({
        email,
        password,
      });
      console.log(res, "admin login response in page");
      toast.success("admin Login successful!");
      setTimeout(() => {
        router.push("/genuslab/dashboard");
      }, 1500);
    } catch (err) {
      console.log(err, "admin login error in page");
      toast.error(
        "admin Login failed. Please check your credentials and try again.",
      );
    } finally {
      setEmail("admin@genuslab.com");
      setPassword("password123");
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f4fa] px-4 font-sans text-[#333333]">
      {/* Header / Logo Section */}
      <ToastContainer />
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#0a0a0a]">
          GenusLab Admin
        </h1>
        <p className="mt-1 text-sm font-medium text-[#666666]">
          Sign in to your account to manage genuslab quizzes, users, and more.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-110 rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!validate(email, password)) return;
            handleLogin();
          }}
          className="space-y-5"
        >
          {/* Work Email Field */}
          <div>
            <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">
              Work Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#999999]">
                <FiMail size={18} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#e2e8f0] py-3 pl-11 pr-4 text-sm font-medium text-[#333333] outline-none transition-all focus:border-blue focus:ring-2 focus:ring-blue/10"
                placeholder="name@company.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Password
              </label>
              <a
                href="#"
                className="text-xs font-semibold text-blue hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#999999]">
                <FiLock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#e2e8f0] py-3 pl-11 pr-12 text-sm font-medium tracking-wide text-[#333333] outline-none transition-all focus:border-blue focus:ring-2 focus:ring-blue/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#999999] hover:text-[#666666]"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember This Device Toggle */}
          <div className="flex items-center space-x-3 pt-1">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                rememberMe ? "bg-blue" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  rememberMe ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm font-medium text-[#444444]">
              Remember this device
            </span>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-[#1d4ed8] active:scale-[0.99]"
          >
            {sending ? "Signing In..." : "Sign In"}
            {!sending && <FiArrowRight size={18} className="mt-0.5" />}
          </button>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-[#e2e8f0]"></div>
            <span className="absolute bg-white px-3 text-[10px] font-bold tracking-widest text-[#999999] uppercase">
              OR SECURELY ACCESS WITH
            </span>
          </div>

          {/* SSO Button */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] bg-white py-3 text-sm font-semibold text-[#444444] transition-all hover:bg-gray-50 active:scale-[0.99]"
          >
            <FaShieldHalved size={14} className="text-[#444444]" />
            Sign in with SSO
          </button>
        </form>
      </div>

      {/* Footer Section */}
      <div className="mt-8 text-center text-xs font-medium text-[#777777]">
        <div className="flex justify-center space-x-4 mb-3">
          <a href="#" className="flex items-center gap-1 hover:text-[#333333]">
            <FaShieldHalved size={11} /> Security Policy
          </a>
          <span className="text-gray-300">|</span>
          <a href="#" className="flex items-center gap-1 hover:text-[#333333]">
            <span className="inline-block rounded-full border border-[#777777] w-3.5 h-3.5 text-[9px] leading-3 font-bold">
              ?
            </span>{" "}
            Help Center
          </a>
        </div>
        <p className="text-[#999999]">
          &copy; 2024 GenusLab Enterprise. All rights reserved.
        </p>
      </div>
    </div>
  );
}
