"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FaCompass } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { IoGrid } from "react-icons/io5";
import Logo from "@/components/ui/Logo";
import StatusPageBackground from "@/components/ui/StatusPageBackground";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      <StatusPageBackground accent="blue" />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10"
      >
        <Logo />
      </motion.div>

      <div className="relative z-10 w-full max-w-xl text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-[5rem] sm:text-[6rem] font-black leading-none tracking-tight text-white"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
            This page wandered off the map
          </h2>
          <p className="mt-3 text-sm sm:text-base text-grey max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist, was moved, or the link is
            broken. Let's get you back on track.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-blue hover:bg-blue/90 text-white text-sm font-bold px-6 py-3 rounded-lg transition-colors w-full sm:w-auto justify-center"
            >
              <IoGrid />
              Go to Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold px-6 py-3 rounded-lg border border-white/10 transition-colors w-full sm:w-auto justify-center"
            >
              <IoMdArrowBack />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
