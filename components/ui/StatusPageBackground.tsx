"use client";

import { motion } from "motion/react";
import clsx from "clsx";

const orbColors = {
  blue: ["bg-blue/30", "bg-touquise/20", "bg-blue/10"],
  red: ["bg-red/25", "bg-yellow/15", "bg-red/10"],
} as const;

export default function StatusPageBackground({
  accent = "blue",
}: {
  accent?: "blue" | "red";
}) {
  const colors = orbColors[accent];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0a1a33_0%,_#00152f_55%,_#000a1a_100%)]" />

      {/* Faint grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Drifting glow orbs */}
      <motion.div
        className={clsx(
          "absolute -top-32 -left-32 w-[26rem] h-[26rem] rounded-full blur-[110px]",
          colors[0],
        )}
        animate={{ x: [0, 60, -20, 0], y: [0, 40, 80, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={clsx(
          "absolute top-1/3 -right-24 w-[22rem] h-[22rem] rounded-full blur-[100px]",
          colors[1],
        )}
        animate={{ x: [0, -50, 30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={clsx(
          "absolute bottom-0 left-1/4 w-[20rem] h-[20rem] rounded-full blur-[100px]",
          colors[2],
        )}
        animate={{ x: [0, 40, -40, 0], y: [0, -40, -10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Vignette to keep content readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#00152f] via-transparent to-[#00152f]/40" />
    </div>
  );
}
