"use client";

import Link from "next/link";
import { ReactNode } from "react";

// Links a leaderboard entry to that player's stats (not for your own entry).
const ClickableUserLink = ({
  userDetailsId,
  currentUserDetailsId,
  children,
  className,
}: {
  userDetailsId?: string | null;
  currentUserDetailsId?: string | null;
  children: ReactNode;
  className?: string;
}) => {
    // Always a real element — callers pass layout classes (e.g. `relative`).
  if (!userDetailsId || userDetailsId === currentUserDetailsId) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Link
      href={`/users/${userDetailsId}`}
      className={className ?? "cursor-pointer"}
      aria-label="View player stats"
    >
      {children}
    </Link>
  );
};

export default ClickableUserLink;
