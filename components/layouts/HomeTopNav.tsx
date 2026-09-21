"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { FiX } from "react-icons/fi";
import MenuIcon from "@/assets/icons/Menu";

const navLinks = [
  { label: "Home", href: "/", hasArrow: true },
  { label: "Academy", href: "/academy", hasArrow: true },
  { label: "Job Board", href: "/job-board", hasArrow: true },
  // { label: "Quiz Arena", href: "#" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  /* ── lock body scroll when menu open ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="relative w-full min-w-86.25 px-10 py-10">
      {/* ── main bar ─────────────────────────────────── */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-10">
        {/* logo */}
        <Link href="/" className="block">
          <Image
            src="/images/logo_mobile.png"
            alt="logo"
            width={146}
            height={49}
            className="md:hidden"
          />
          <Image
            src="/images/logo_desktop.png"
            alt="logo"
            width={216}
            height={65}
            className="hidden md:inline-block"
          />
        </Link>

        {/* desktop nav */}
        <nav className="hidden nav-md:flex flex-1 items-center justify-between">
          <ul className="flex gap-5">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="flex items-center gap-1 transition-colors hover:text-blue"
                >
                  {l.label}
                  {/* {l.hasArrow && <IoIosArrowDown />} */}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex gap-2">
            <Link
              href="/login"
              className=" font-bold rounded-[32px] border border-blue px-8 py-[.6rem] text-blue transition hover:bg-blue hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="font-bold rounded-[32px] bg-blue px-8 py-[.6rem] text-white transition hover:bg-blue-300"
            >
              Signup
            </Link>
          </div>
        </nav>

        {/* burger button */}
        {!isOpen ? (
          <button
            onClick={() => setIsOpen((o) => !o)}
            aria-label="Toggle menu"
            className="nav-md:hidden cursor-pointer"
          >
            <MenuIcon />
          </button>
        ) : (
          <button
            onClick={closeMenu}
            aria-label="Close menu"
            className="nav-md:hidden cursor-pointer"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* ── mobile dropdown ──────────────────────────── */}
      <div
        className={`nav-md:hidden absolute left-0 right-0 top-full overflow-hidden bg-white z-10 shadow-lg transition-[height] duration-300 ${
          isOpen ? "h-110" : "h-0"
        }`}
      >
        {/* close button */}
        {/* 
          <FiX />
        </button> */}

        <ul className="mt-14 flex flex-col items-start gap-6 px-10">
          {navLinks.map((l) => (
            <li key={l.label} onClick={closeMenu}>
              <Link
                href={l.href}
                className="flex items-center gap-1 text-lg transition-colors hover:text-blue"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-4 px-10">
          <Link
            onClick={closeMenu}
            href="/dashboard"
            className="rounded-[32px] border border-blue px-8 py-[.6rem] text-center text-black transition hover:bg-blue hover:text-white"
          >
            Login
          </Link>
          <Link
            onClick={closeMenu}
            href="/dashboard"
            className="rounded-[32px] bg-blue px-8 py-[.6rem] text-center text-white transition hover:bg-blue-300"
          >
            Signup
          </Link>
        </div>
      </div>
    </header>
  );
}
