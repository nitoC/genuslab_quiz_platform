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
        {/* Floating compass — "you're lost" motif */}
        <motion.div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-blue/20 bg-blue/10 text-blue shadow-[0_0_40px_-8px_rgba(37,99,235,0.6)]"
          animate={{ rotate: [0, 15, -10, 0], y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaCompass size={34} />
        </motion.div>

        {/* Glitchy 404 */}
        <div className="relative select-none">
          <motion.h1
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative text-[6rem] sm:text-[8rem] font-black leading-none tracking-tight text-white"
          >
            404
            <motion.span
              aria-hidden
              className="absolute inset-0 text-touquise mix-blend-screen"
              animate={{ x: [0, -3, 2, 0], opacity: [0, 0.6, 0, 0] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            >
              404
            </motion.span>
            <motion.span
              aria-hidden
              className="absolute inset-0 text-red mix-blend-screen"
              animate={{ x: [0, 3, -2, 0], opacity: [0, 0.5, 0, 0] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
                delay: 0.1,
              }}
            >
              404
            </motion.span>
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
            This page wandered off the map
          </h2>
          <p className="mt-3 text-sm sm:text-base text-grey max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist, was moved, or the link
            is broken. Let's get you back on track.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 bg-blue hover:bg-blue/90 text-white text-sm font-bold px-6 py-3 rounded-full shadow-lg shadow-blue/20 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto justify-center"
            >
              <IoGrid className="transition-transform group-hover:-translate-y-0.5" />
              Go to Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold px-6 py-3 rounded-full border border-white/10 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto justify-center"
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
