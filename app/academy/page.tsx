"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Header from "@/components/layouts/HomeTopNav";
import Footer from "@/components/layouts/Footer";
import {
  MdWorkspacePremium,
  MdPeople,
  MdBuild,
  MdWork,
  MdBrush,
  MdDesignServices,
  MdCode,
  MdCloud,
  MdSmartToy,
  MdPrecisionManufacturing,
  MdCampaign,
  MdRocketLaunch,
  MdArrowForward,
} from "react-icons/md";

import Flutterwave from "@/assets/images/svg/flutterwave.svg";
import Amazon from "@/assets/images/svg/amazon.svg";
import Palmpay from "@/assets/images/svg/palmpay.svg";
import Genus from "@/assets/images/svg/genus_villa_logo transparent 1.svg";
import Paypal from "@/assets/images/svg/PayPal.svg";

const stats = [
  // { value: "2,500+", label: "Graduates" },
  { value: "95%", label: "Job Placement" },
  // { value: "50+", label: "Partner Companies" },
  { value: "4.8/5", label: "Average Rating" },
];

const tiers = ["Foundations", "Core Dev", "Advanced", "Leadership"] as const;

const levelsByTier: Record<
  (typeof tiers)[number],
  { level: number; difficulty: string; title: string }[]
> = {
  Foundations: [
    { level: 1, difficulty: "Beginner", title: "Digital Foundations" },
    { level: 2, difficulty: "Beginner", title: "Digital Creativity" },
    { level: 3, difficulty: "Beginner", title: "Programming Foundations" },
    { level: 4, difficulty: "Beginner", title: "Web Development" },
    {
      level: 5,
      difficulty: "Beginner",
      title: "Graphic & Product Design Basics",
    },
  ],
  "Core Dev": [
    { level: 6, difficulty: "Intermediate", title: "Frontend Development" },
    { level: 7, difficulty: "Intermediate", title: "Backend Development" },
    { level: 8, difficulty: "Intermediate", title: "Databases & APIs" },
    { level: 9, difficulty: "Intermediate", title: "Mobile App Development" },
    {
      level: 10,
      difficulty: "Intermediate",
      title: "Cloud Computing Foundations",
    },
  ],
  Advanced: [
    {
      level: 11,
      difficulty: "Advanced",
      title: "Advanced Software Engineering",
    },
    {
      level: 12,
      difficulty: "Advanced",
      title: "Artificial Intelligence & Machine Learning",
    },
    { level: 13, difficulty: "Advanced", title: "Robotics & Automation" },
    { level: 14, difficulty: "Advanced", title: "Cloud & DevOps" },
    { level: 15, difficulty: "Advanced", title: "Cybersecurity Essentials" },
  ],
  Leadership: [
    { level: 16, difficulty: "Expert", title: "Technology Entrepreneurship" },
    { level: 17, difficulty: "Expert", title: "Digital Marketing Strategy" },
    { level: 18, difficulty: "Expert", title: "Product Management" },
    { level: 19, difficulty: "Expert", title: "Team & Tech Leadership" },
    { level: 20, difficulty: "Expert", title: "Capstone & Career Launch" },
  ],
};

const skills = [
  { icon: MdBrush, label: "Graphic Design" },
  { icon: MdDesignServices, label: "Product Design" },
  { icon: MdCode, label: "Software Development & Coding" },
  { icon: MdCloud, label: "Cloud Computing" },
  { icon: MdSmartToy, label: "Artificial Intelligence" },
  { icon: MdPrecisionManufacturing, label: "Robotics" },
  { icon: MdCampaign, label: "Digital Marketing" },
  { icon: MdRocketLaunch, label: "Technology Entrepreneurship" },
];

const whyAcademy = [
  {
    icon: MdWorkspacePremium,
    title: "Industry Certification",
    body: "Recognized certificates that boost your career prospects.",
  },
  {
    icon: MdPeople,
    title: "Expert Instructors",
    body: "Learn from industry veterans with real-world experience.",
  },
  {
    icon: MdBuild,
    title: "Hands-on Projects",
    body: "Build portfolio-worthy projects during the program.",
  },
  {
    icon: MdWork,
    title: "Job Support",
    body: "Career coaching, resume review, and job placement assistance.",
  },
];

const partnerLogos = [Genus, Flutterwave, Paypal, Amazon, Palmpay];

const difficultyColor: Record<string, string> = {
  Beginner: "text-green-700",
  Intermediate: "text-blue",
  Advanced: "text-amber-700",
  Expert: "text-purple-700",
};

export default function AcademyPage() {
  const [activeTier, setActiveTier] =
    useState<(typeof tiers)[number]>("Foundations");

  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#F5F9FF]">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-blue">
                GenusLab Academy
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-[#080820] md:text-5xl">
                Launch Your Tech Career
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600">
                Industry-leading training programs designed to transform
                beginners into job-ready professionals. Learn from experts,
                build real projects, and join Africa's fastest-growing tech
                community.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#course-levels"
                  className="rounded-full bg-blue px-7 py-3 font-bold text-white transition hover:bg-blue-300"
                >
                  Browse Courses
                </a>
                <Link
                  href="/signup"
                  className="rounded-full border border-blue px-7 py-3 font-bold text-blue transition hover:bg-blue hover:text-white"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative mx-auto w-full max-w-xs md:max-w-sm"
            >
              <Image
                src="/images/Student Img.png"
                alt=""
                width={480}
                height={480}
                className="h-auto w-full rounded-2xl object-cover"
                priority
              />
            </motion.div>
          </div>
        </section>

        {/* STATS */}
        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 justify-center content-center items-center">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center"
              >
                <p className="text-2xl font-extrabold text-blue md:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-gray-600">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* COURSE LEVELS */}
        <section
          id="course-levels"
          className="mx-auto max-w-5xl px-4 py-12 scroll-mt-20"
        >
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-[#080820] md:text-3xl">
              Academy Course Levels
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-gray-600">
              Progress through 20 structured level, from digital foundations to
              technology leadership.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {tiers.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setActiveTier(tier)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeTier === tier
                    ? "bg-blue text-white"
                    : "bg-[#F5F9FF] text-gray-600 hover:text-blue"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTier}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {levelsByTier[activeTier].map((lvl) => (
                <div
                  key={lvl.level}
                  className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F9FF] font-bold text-blue">
                    {String(lvl.level).padStart(2, "0")}
                  </span>
                  <div>
                    <span
                      className={`text-xs font-semibold ${difficultyColor[lvl.difficulty]}`}
                    >
                      Level {lvl.level} · {lvl.difficulty}
                    </span>
                    <h3 className="mt-1 font-bold text-[#080820]">
                      {lvl.title}
                    </h3>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* WHAT YOU'LL LEARN */}
        <section className="bg-[#F5F9FF]">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <h2 className="text-center text-2xl font-extrabold text-[#080820] md:text-3xl">
              What You'll Learn
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {skills.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F9FF] text-blue">
                      <Icon size={22} />
                    </span>
                    <p className="text-sm font-semibold text-[#080820]">
                      {s.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* WHY GENUSLAB ACADEMY */}
        <section className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-center text-2xl font-extrabold text-[#080820] md:text-3xl">
            Why GenusLab Academy?
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {whyAcademy.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-2xl border border-gray-200 bg-white p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F9FF] text-blue">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 font-bold text-[#080820]">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                    {f.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* PARTNERS */}
        <section className="border-y border-gray-100 bg-[#F5F9FF] py-10">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-gray-400">
            Trusted by graduates working at
          </p>
          <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-8 px-4 md:justify-between">
            {partnerLogos.map((logo, i) => (
              <Image
                key={i}
                src={logo}
                alt="partner logo"
                width={90}
                height={90}
                className="h-10 w-auto opacity-70"
              />
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-3xl px-4 py-16 text-center"
        >
          <h2 className="text-2xl font-extrabold text-[#080820] md:text-3xl">
            Ready to start learning?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-gray-600">
            Join thousands of graduates who turned practical skills into real
            careers with GenusLab Academy.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-full bg-blue px-8 py-3 font-bold text-white transition hover:bg-blue-300"
            >
              Get Started <MdArrowForward />
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-blue px-8 py-3 font-bold text-blue transition hover:bg-blue hover:text-white"
            >
              Learn More About Us
            </Link>
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
