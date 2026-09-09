"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased">
        <main
          className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden text-white"
          style={{
            background:
              "radial-gradient(ellipse at top, #0a1a33 0%, #00152f 55%, #000a1a 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute -top-32 -left-32 w-[26rem] h-[26rem] rounded-full blur-[110px] bg-red/20"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 w-[22rem] h-[22rem] rounded-full blur-[100px] bg-yellow/10"
            aria-hidden
          />

          <div className="relative z-10 w-full max-w-lg text-center animate-scaleIn">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-red/30 bg-red/10 text-red text-4xl">
              ⚠
            </div>

            <h1 className="text-3xl sm:text-4xl font-black">
              The app hit a snag
            </h1>
            <p className="mt-3 text-sm sm:text-base text-grey max-w-md mx-auto leading-relaxed">
              A critical error stopped the app from loading. Refreshing
              usually fixes it — if it keeps happening, please reach out to
              support.
            </p>

            {error?.digest && (
              <p className="mt-3 font-mono text-[13px] text-grey/60">
                Reference: {error.digest}
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => reset()}
                className="bg-red hover:bg-red/90 text-white text-sm font-bold px-6 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto"
              >
                Try Again
              </button>
              <a
                href="/"
                className="bg-white/5 hover:bg-white/10 text-white text-sm font-bold px-6 py-3 rounded-full border border-white/10 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto"
              >
                Reload Homepage
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
