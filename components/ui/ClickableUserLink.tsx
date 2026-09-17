"use client";

import Link from "next/link";
import { ReactNode } from "react";

/**
 * Wraps a leaderboard avatar/name so clicking it opens that player's public
 * stats page — except when it's the current user's own entry, where it just
 * renders the children inertly (no point linking to your own public-stats
 * view of yourself from a leaderboard).
 */
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
  // Always renders a real wrapping element (not a bare Fragment) even when
  // inert — callers pass layout-critical classes here (e.g. `relative` for
  // a Next.js <Image fill> child), which a Fragment would silently drop.
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
