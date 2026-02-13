import clsx from "clsx";
import React from "react";

const GlassCard = ({
  type,
  className,
  children,
}: {
  type?: string;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        className && className,
        "border bg-white/1 backdrop-blur-3xl relative border-white/10 before:absolute before:content-[''] before:bg-linear-45 before:from-transparent before:via-white/10 before:to-transparent before:inset-0 before:rounded-md before:-z-1 isolate",
        type === "header" ? "rounded-b-md" : "rounded-md",
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
