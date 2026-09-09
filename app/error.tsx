"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { MdErrorOutline, MdRefresh, MdHome } from "react-icons/md";
import Logo from "@/components/ui/Logo";
import StatusPageBackground from "@/components/ui/StatusPageBackground";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error boundary caught:", error);
  }, [error]);

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      <StatusPageBackground accent="red" />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10"
      >
        <Logo />
      </motion.div>

      <div className="relative z-10 w-full max-w-xl text-center">
        <motion.div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-red/30 bg-red/10 text-red shadow-[0_0_40px_-8px_rgba(239,68,68,0.6)]"
          animate={{ scale: [1, 1.08, 1], rotate: [0, -4, 4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <MdErrorOutline size={38} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl sm:text-5xl font-black leading-tight text-white"
        >
          Something went wrong
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <p className="mt-3 text-sm sm:text-base text-grey max-w-md mx-auto leading-relaxed">
            An unexpected error interrupted this page. It's not you — our team
            has been notified. You can try again or head back home.
          </p>

          {error?.digest && (
            <p className="mt-3 font-mono text-[13px] text-grey/60">
              Reference: {error.digest}
            </p>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="group flex items-center gap-2 bg-red hover:bg-red/90 text-white text-sm font-bold px-6 py-3 rounded-full shadow-lg shadow-red/20 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto justify-center"
            >
              <MdRefresh className="transition-transform group-hover:rotate-180 duration-300" />
              Try Again
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold px-6 py-3 rounded-full border border-white/10 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto justify-center"
            >
              <MdHome />
              Go Home
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
