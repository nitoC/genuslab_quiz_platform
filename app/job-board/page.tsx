"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import Header from "@/components/layouts/HomeTopNav";
import Footer from "@/components/layouts/Footer";
import { MdConstruction, MdArrowBack } from "react-icons/md";

export default function JobBoardPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center md:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-xs"
        >
          <Image
            src="/images/coming soon.png"
            alt=""
            width={360}
            height={360}
            className="h-auto w-full"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F5F9FF] px-4 py-1.5 text-sm font-semibold text-blue">
            <MdConstruction size={16} />
            Under Construction
          </span>

          <h1 className="mt-4 text-3xl font-extrabold text-[#080820] md:text-4xl">
            The GenusLab Job Board is on its way
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-600">
            We're building a job board that connects GenusLab Academy
            graduates and quiz champions directly with hiring partners,
            filterable by role, location, and skill. It isn't live yet, but
            it's coming.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/academy"
              className="rounded-full bg-blue px-7 py-3 font-bold text-white transition hover:bg-blue-300"
            >
              Explore the Academy
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full border border-gray-200 px-7 py-3 font-bold text-gray-700 transition hover:border-blue hover:text-blue"
            >
              <MdArrowBack size={18} />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
