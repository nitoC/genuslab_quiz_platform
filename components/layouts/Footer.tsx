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

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Academy", href: "/academy" },
  { label: "Job Board", href: "/job-board" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Refund Policy", href: "/refund-policy" },
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
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-20 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        {/* brand + newsletter */}
        <div className="space-y-10 sm:col-span-2 lg:col-span-1">
          {/* logo */}
          <div className="flex items-center gap-3">
            {/* replace with your real logo asset */}
            <Image
              src="/logo/genusacademy.png"
              alt="GenusLab logo"
              width={216}
              height={65}
            />
          </div>

          {/* tagline */}
          <p className="text-xl font-semibold">&ldquo;Learn. Build. Evolve.&rdquo;</p>

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

          {/* social icons */}
          <div className="flex flex-wrap items-center gap-4">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-content-center rounded-full border border-gray-900/80 text-base transition hover:bg-gray-900 hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* quick links */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-gray-900">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="font-medium transition hover:text-blue"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* legal links */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-gray-900">
            Legal
          </h3>
          <ul className="space-y-3 text-sm">
            {legalLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="font-medium transition hover:text-blue"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* contact */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-gray-900">
            Contact
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="mailto:support@genuslabtechnologies.com"
                className="font-medium transition hover:text-blue"
              >
                support@genuslabtechnologies.com
              </a>
            </li>
            <li className="font-medium text-gray-600">Abuja, Nigeria</li>
          </ul>
        </div>
      </div>

      {/* divider */}
      <div className="border-t border-gray-300" />

      {/* bottom bar */}
      <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-500">
        &copy; 2026 GenusLab Technologies. All rights reserved.
      </div>
    </footer>
  );
}
