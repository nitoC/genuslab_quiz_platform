"use client";

import { useState, ReactNode } from "react";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import GlassCard from "@/components/ui/cards/GlassCard";

interface ReferralShareProps {
  referralCode?: string;
  baseUrl?: string;
  user?: any;
  share: boolean;
  setShare: (val: boolean) => void;
}

interface SocialOption {
  name: string;
  icon: ReactNode;
  action: () => void;
  accentStyles: {
    hoverBg: string;
    hoverBorder: string;
    iconBg: string;
    iconColor: string;
    iconHoverBg: string;
  };
  className?: string;
}

export default function ReferralShare({
  user,
  referralCode,
  baseUrl,
  //   share,
  setShare,
}: ReferralShareProps) {
  const [copied, setCopied] = useState(false);

  const origin =
    baseUrl ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://yourapp.com");

  const effectiveCode = user?.referralCode || referralCode || "";
  const referralLink = `${origin}/signup?ref=${effectiveCode}`;
  const shareText = `Join me on this amazing Quiz platform! Sign up using my referral link: ${referralLink}`;

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy referral link:", error);
    }
  };

  const openShareUrl = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Centralized Social Platform Configuration
  const socialPlatforms: SocialOption[] = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={22} />,
      action: () =>
        openShareUrl(`https://wa.me/?text=${encodeURIComponent(shareText)}`),
      accentStyles: {
        hoverBg: "hover:bg-emerald-500/10",
        hoverBorder: "hover:border-emerald-500/30",
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-400",
        iconHoverBg: "group-hover:bg-emerald-500/20",
      },
    },
    {
      name: "X",
      icon: <FaXTwitter size={22} />,
      action: () =>
        openShareUrl(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
        ),
      accentStyles: {
        hoverBg: "hover:bg-white/10",
        hoverBorder: "hover:border-white/20",
        iconBg: "bg-white/10",
        iconColor: "text-white",
        iconHoverBg: "group-hover:bg-white/20",
      },
    },
    {
      name: "Facebook",
      icon: <FaFacebook size={22} />,
      action: () =>
        openShareUrl(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
        ),
      accentStyles: {
        hoverBg: "hover:bg-blue-600/10",
        hoverBorder: "hover:border-blue-500/30",
        iconBg: "bg-blue-600/10",
        iconColor: "text-blue-400",
        iconHoverBg: "group-hover:bg-blue-600/20",
      },
    },
    {
      name: "TikTok",
      icon: <FaTiktok size={22} />,
      action: async () => {
        await copyReferralLink();
        openShareUrl("https://www.tiktok.com");
      },
      accentStyles: {
        hoverBg: "hover:bg-cyan-500/10",
        hoverBorder: "hover:border-cyan-500/30",
        iconBg: "bg-cyan-500/10",
        iconColor: "text-cyan-400",
        iconHoverBg: "group-hover:bg-cyan-500/20",
      },
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={22} />,
      action: async () => {
        await copyReferralLink();
        openShareUrl("https://www.instagram.com");
      },
      accentStyles: {
        hoverBg: "hover:bg-pink-500/10",
        hoverBorder: "hover:border-pink-500/30",
        iconBg: "bg-pink-500/10",
        iconColor: "text-pink-400",
        iconHoverBg: "group-hover:bg-pink-500/20",
      },
      className: "col-span-2 sm:col-span-1",
    },
  ];

  return (
    <GlassCard className="w-full p-5 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="mb-6 space-y-1">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
          Invite Your Friends
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Share your referral link to earn bonus XP and move up the leaderboard!
        </p>
      </div>

      {/* Share Link Input & Copy Field */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
          Your Referral Link
        </label>
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/30 border border-white/10 backdrop-blur-md focus-within:border-blue-500/50 transition-colors">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-gray-200 outline-none truncate"
          />
          <button
            onClick={copyReferralLink}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 shrink-0 ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white active:scale-95"
            }`}
          >
            {copied ? (
              <>
                <FaCheck size={12} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <FaCopy size={12} />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Social Share Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {socialPlatforms.map((platform) => (
          <button
            key={platform.name}
            onClick={async () => {
              await platform.action();
              setShare(false);
            }}
            className={`group flex flex-col items-center justify-center gap-2.5 p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-200 active:scale-95 ${platform.accentStyles.hoverBg} ${platform.accentStyles.hoverBorder} ${platform.className || ""}`}
            aria-label={`Share to ${platform.name}`}
          >
            <div
              className={`p-2.5 rounded-full group-hover:scale-110 transition-transform ${platform.accentStyles.iconBg} ${platform.accentStyles.iconColor} ${platform.accentStyles.iconHoverBg}`}
            >
              {platform.icon}
            </div>
            <span className="text-xs font-semibold text-gray-300 group-hover:text-white">
              {platform.name}
            </span>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
