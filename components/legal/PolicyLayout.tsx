"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Header from "@/components/layouts/HomeTopNav";
import Footer from "@/components/layouts/Footer";
import type { IconType } from "react-icons";
import type { ReactNode } from "react";

export interface PolicySection {
  id: string;
  title: string;
  icon: IconType;
  body: ReactNode;
}

export default function PolicyLayout({
  eyebrow,
  title,
  dates,
  intro,
  heroImage,
  sections,
}: {
  eyebrow: string;
  title: string;
  dates: string;
  intro?: ReactNode;
  heroImage: string;
  sections: PolicySection[];
}) {
  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F5F9FF]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-blue">
              {eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#080820] md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-gray-500">{dates}</p>
            {intro && (
              <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600">
                {intro}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative mx-auto w-full max-w-[280px] md:max-w-sm"
          >
            <Image
              src={heroImage}
              alt=""
              width={420}
              height={420}
              className="h-auto w-full"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[220px_1fr] md:py-16">
        {/* TABLE OF CONTENTS */}
        <aside className="hidden md:block">
          <nav className="sticky top-28">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
              On this page
            </p>
            <ul className="space-y-1 border-l border-gray-200 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block border-l-2 border-transparent py-1 pl-4 text-gray-500 transition hover:border-blue hover:text-blue"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="space-y-12">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4 }}
                className="scroll-mt-24"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F9FF] text-blue">
                    <Icon size={18} />
                  </span>
                  <h2 className="text-xl font-bold text-[#080820]">
                    {section.title}
                  </h2>
                </div>
                <div className="mt-3 space-y-3 pl-12 text-base leading-relaxed text-gray-700">
                  {section.body}
                </div>
              </motion.section>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
