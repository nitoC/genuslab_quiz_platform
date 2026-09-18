"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Header from "@/components/layouts/HomeTopNav";
import Footer from "@/components/layouts/Footer";
import {
  MdAdd,
  MdRocketLaunch,
  MdQuiz,
  MdCreditCard,
  MdEmojiEvents,
  MdSupportAgent,
} from "react-icons/md";
import type { IconType } from "react-icons";

const faqGroups: { category: string; icon: IconType; items: { q: string; a: string }[] }[] = [
  {
    category: "Getting Started",
    icon: MdRocketLaunch,
    items: [
      {
        q: "What is GenusLab Technologies?",
        a: "GenusLab Technologies is a technology and digital education company. GenusLab Academy is our digital learning platform for practical tech skills, and GenusLab Quiz is our interactive knowledge and competition platform where you can earn XP, climb ranks, and compete for rewards.",
      },
      {
        q: "What's the difference between a demo and a live quiz?",
        a: "A demo quiz is unlimited practice — it doesn't affect your XP, rank, or rewards. A live quiz runs on a fixed schedule, counts toward the leaderboard, and is where prize pools are won.",
      },
      {
        q: "Do I need to subscribe to play?",
        a: "You can take demo quizzes for free. Joining live quiz episodes, appearing on the leaderboard, and earning referral cash rewards requires a Premium subscription.",
      },
    ],
  },
  {
    category: "Quizzes & Competitions",
    icon: MdQuiz,
    items: [
      {
        q: "How long do I have to complete a quiz?",
        a: "Each live quiz attempt has a 5-minute time limit. Your answers are auto-submitted when the timer runs out.",
      },
      {
        q: "How are ties broken on the leaderboard?",
        a: "Rankings are sorted by score first. If two participants score the same, whoever completed the quiz faster ranks higher. Leaderboard results may remain provisional while we check for unusual activity before confirming winners.",
      },
      {
        q: "Is winning a reward guaranteed?",
        a: "No. GenusLab Technologies does not guarantee that any user will earn money or win a prize. Rewards depend on your knowledge, performance, ranking, eligibility, and compliance with the rules published for each competition.",
      },
    ],
  },
  {
    category: "Subscriptions & Payments",
    icon: MdCreditCard,
    items: [
      {
        q: "What does a Premium subscription unlock?",
        a: "Premium unlocks live quiz events, leaderboard participation, and referral cash rewards. Free accounts can still play demo quizzes.",
      },
      {
        q: "Can I get a refund on my subscription?",
        a: "Subscription payments are generally non-refundable once access has been activated and used, since digital access begins immediately after payment. Refunds may be considered for duplicate charges, a technical error causing an incorrect charge, or where GenusLab cancels a paid service before it starts. See our Terms & Conditions for the full refund policy.",
      },
      {
        q: "I was charged twice, or my payment failed but I was still charged — what do I do?",
        a: "Contact support with your full name, registered account details, transaction reference, payment date, amount charged, and proof of payment, and we'll investigate with our payment processing partner.",
      },
    ],
  },
  {
    category: "Rewards & Referrals",
    icon: MdEmojiEvents,
    items: [
      {
        q: "How much can I win?",
        a: "Daily, weekly, and monthly leaderboards each have their own prize pool, split between the top 3 finishers (the monthly leaderboard is winner-takes-all). Current amounts are listed on the Rewards Breakdown page.",
      },
      {
        q: "How does the referral programme work?",
        a: "Share your referral code or link from your Profile. When someone signs up with it and completes the required verification, you earn a cash reward.",
      },
      {
        q: "Do I need Premium to earn referral rewards?",
        a: "Yes — referral cash rewards are available to Premium subscribers only. Non-subscribers can still invite friends, but won't earn the cash bonus until they subscribe. Rewards may be cancelled if referral activity involves fake accounts or other fraud.",
      },
    ],
  },
  {
    category: "Account & Support",
    icon: MdSupportAgent,
    items: [
      {
        q: "How do I change my password?",
        a: "Go to Settings from your account menu, or use \"Forgot password\" on the login page if you're signed out.",
      },
      {
        q: "How do I contact support?",
        a: "Reach us through the official contact information on our website, or through the Support page from your dashboard.",
      },
    ],
  },
];

export default function FaqPage() {
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
              Support
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#080820] md:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600">
              Answers to the questions we hear most about quizzes, rewards,
              subscriptions, and your account. Can't find what you need?
              Reach out through the official contact information on our
              website.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative mx-auto w-full max-w-[280px] md:max-w-sm"
          >
            <Image
              src="/images/contact.png"
              alt=""
              width={420}
              height={420}
              className="h-auto w-full"
              priority
            />
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="space-y-10">
          {faqGroups.map((group) => {
            const Icon = group.icon;
            return (
              <motion.section
                key={group.category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F9FF] text-blue">
                    <Icon size={18} />
                  </span>
                  <h2 className="text-lg font-bold text-[#080820]">
                    {group.category}
                  </h2>
                </div>

                <div className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
                  {group.items.map((item) => (
                    <details key={item.q} className="group p-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#080820] marker:content-none">
                        {item.q}
                        <MdAdd
                          size={20}
                          className="shrink-0 text-blue transition-transform duration-200 group-open:rotate-45"
                        />
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        {item.a}
                      </p>
                    </details>
                  ))}
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
