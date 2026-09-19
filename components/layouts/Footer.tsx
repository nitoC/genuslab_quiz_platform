"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaTelegram,
  FaLinkedinIn,
} from "react-icons/fa6";

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "FAQ", href: "/faq" },
];

const socialLinks = [
  {
    icon: FaYoutube,
    label: "YouTube",
    href: "https://www.youtube.com/@Genuslab_technologies",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/genuslabofficial/",
  },
  {
    icon: FaFacebookF,
    label: "Facebook",
    href: "https://web.facebook.com/people/Genuslab-Technologies/100089159413660/",
  },
  {
    icon: FaTiktok,
    label: "TikTok",
    href: "https://www.tiktok.com/@genus_lab",
  },
  {
    icon: FaTelegram,
    label: "Telegram",
    href: "https://t.me/+J_fNo61NeJs3Mjc1",
  },
  {
    icon: FaLinkedinIn,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/134604192",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#F5F8FC] text-gray-700">
      {/* top section */}
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-20 md:flex-row md:items-start md:justify-between">
        {/* brand + newsletter */}
        <div className="space-y-10">
          {/* logo */}
          <div className="flex items-center gap-3">
            {/* replace with your real logo asset */}
            <Image
              src="/images/logo_desktop.png"
              alt="GenusLab logo"
              width={216}
              height={65}
            />
          </div>

          {/* tagline */}
          <p className="text-xl font-semibold">“Learn. Build. Evolve.”</p>

          {/* newsletter */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex justify-between max-w-md overflow-hidden rounded-full bg-white shadow"
          >
            <input
              type="email"
              placeholder="Enter Your Email..."
              className="flex-1 px-2 md:px-5 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              className="whitespace-nowrap bg-blue relative z-[2] rounded-[32px] px-5 md:px-8 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* social icons */}
        <div className="flex items-center flex-wrap justify-start gap-6 md:justify-end">
          {socialLinks.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="grid h-14 w-14 place-content-center rounded-full border border-gray-900/80 text-lg transition hover:bg-gray-900 hover:text-white"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      {/* divider */}
      <div className="border-t border-gray-300" />

      {/* bottom bar */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 text-sm md:flex-row">
        <span className="order-2 text-center text-gray-500 md:order-1 md:text-left">
          © 2025 GenusLab Technologies. All rights reserved.
        </span>

        <nav className="order-1 flex flex-wrap items-center gap-8 md:order-2">
          {footerLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-medium transition hover:text-blue"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
