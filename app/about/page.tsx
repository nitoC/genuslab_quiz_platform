"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import Header from "@/components/layouts/HomeTopNav";
import Footer from "@/components/layouts/Footer";
import GradCap from "@/assets/icons/GradCap";
import Trophy from "@/assets/icons/Trophy";
import Group from "@/assets/icons/Group";

const pillars = [
  {
    icon: <GradCap />,
    title: "Learn",
    body: "Expert-led bootcamps in coding, AI, blockchain, and digital marketing — designed to get you job-ready, not just certificate-ready.",
  },
  {
    icon: <Trophy />,
    title: "Compete",
    body: "Scheduled live quiz episodes test what you actually know, with real-time leaderboards and a 5-minute clock that rewards both accuracy and speed.",
  },
  {
    icon: <Group />,
    title: "Earn",
    body: "Daily, weekly, and monthly prize pools pay out to top performers, and Premium members earn cash for every friend they bring into the community.",
  },
];

const stats = [
  {
    value: "₦15K",
    label: "Paid out daily to the top 3, per quiz episode performers",
  },
  {
    value: "5 min",
    label: "Per live episode — speed matters as much as accuracy",
  },
  { value: "₦1K", label: "Referral reward per active Premium invite" },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.4 },
};

export default function AboutPage() {
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
                About GenusLab
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-[#080820] md:text-5xl">
                Learn. Compete. Get paid to grow.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600">
                GenusLab is a tech learning and quiz platform built for people
                who want proof of what they know, not just another course. We
                turn practical knowledge into real opportunities — bootcamps,
                live competitions, and cash rewards, all in one place.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="rounded-full bg-blue px-7 py-3 font-bold text-white transition hover:bg-blue-300"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-blue px-7 py-3 font-bold text-blue transition hover:bg-blue hover:text-white"
                >
                  Log In
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
                src="/images/human-laptop.png"
                alt=""
                width={420}
                height={420}
                className="h-auto w-full"
                priority
              />
            </motion.div>
          </div>
        </section>

        {/* STATS */}
        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.value}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center"
              >
                <p className="text-3xl font-extrabold text-blue">{s.value}</p>
                <p className="mt-1 text-sm text-gray-600">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PILLARS */}
        <section className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-gray-200 bg-white p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F9FF] text-blue">
                  {p.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#080820]">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHY WE EXIST */}
        <section className="bg-[#F5F9FF]">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 md:grid-cols-2">
            <motion.div {...fadeUp} className="order-2 md:order-1">
              <Image
                src="/images/classroom.jpg"
                alt=""
                width={480}
                height={360}
                className="h-auto w-full rounded-2xl object-cover"
              />
            </motion.div>
            <motion.div {...fadeUp} className="order-1 md:order-2">
              <h2 className="text-2xl font-extrabold text-[#080820] md:text-3xl">
                Why we exist
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600">
                Too many talented people are stuck waiting for a "big break"
                that never comes. GenusLab exists to shorten that wait —
                connecting learning directly to income, and giving anyone who
                shows up and competes a genuine shot at being recognized and
                rewarded for it.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <motion.section
          {...fadeUp}
          className="mx-auto max-w-3xl px-4 py-16 text-center"
        >
          <h2 className="text-2xl font-extrabold text-[#080820] md:text-3xl">
            Ready to see where you rank?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-gray-600">
            Try a free demo quiz, or subscribe to join live episodes and start
            competing for real prizes.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-full bg-blue px-8 py-3 font-bold text-white transition hover:bg-blue-300"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-blue px-8 py-3 font-bold text-blue transition hover:bg-blue hover:text-white"
            >
              Log In
            </Link>
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
