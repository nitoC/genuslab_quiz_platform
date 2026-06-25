"use client";

import React from "react";
import {
  MdLock,
  MdEmojiEvents,
  MdAccountBalanceWallet,
  MdSchool,
  MdArrowBack,
} from "react-icons/md";
import { cn } from "@/lib/utils/cn";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/store/useUser";
import DemoQuizModal from "@/components/ui/modals/quizDemo";
import { useSocket } from "@/store/useSocket";
// import { set } from "react-datepicker/dist/dist/date_utils.js";

const GetReadyModal = () => {
  const { socketId } = useParams();
  const [showDemo, setShowDemo] = React.useState(false);
  const [showLive, setShowLive] = React.useState(false);
  const sid = useSocket((state: any) => state.socketId);
  console.log("Socket ID from URL:", socketId);
  const router = useRouter();
  const benefits = [
    {
      title: "Unlock Ranks",
      desc: "Climb the global tier system",
      icon: MdEmojiEvents,
      color: "text-amber-500",
      bg: "bg-amber-100",
    },
    {
      title: "Earn Rewards",
      desc: "Exclusive EXPs & point rewards",
      icon: MdAccountBalanceWallet,
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
    {
      title: "Learn Skills",
      desc: "Curated educational paths",
      icon: MdSchool,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
  ];

  const steps = [
    { id: 1, title: "Choose Quiz", desc: "Select from various categories" },
    { id: 2, title: "Compete Live", desc: "Real-time multiplayer battles" },
    { id: 3, title: "Win Prizes", desc: "Top scorers claim the bounty" },
  ];

  return (
    <>
      {showDemo && (
        <DemoQuizModal
          open={true}
          onClose={() => {
            setShowDemo(false);
          }}
          onProceed={() => {
            // alert("Proceeding to demo quiz...", socketId, "socket:", sid);
            // alert("Proceeding to demo quiz..." + socketId + "socket:" + sid);

            router.push("/quiz/demo");
          }}
        />
      )}
      <div className=" bg-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-280 flex-col items-center justify-center px-4 py-10">
          {/* MAIN CARD */}
          <div className="w-full overflow-hidden rounded-[34px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
            <div className="grid grid-cols-1 md:grid-cols-[420px_1fr]">
              {/* LEFT: IMAGE */}
              <div className="relative min-h-105 md:min-h-145">
                <img
                  src="/images/lady-office.jpg"
                  className="absolute inset-0 h-full w-full object-cover"
                  alt="Start Challenge"
                />

                {/* overlays to match screenshot tone */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/65 via-emerald-950/20 to-slate-950/30" />
                <div className="absolute inset-0 bg-emerald-500/10" />

                {/* Back button (pill, grey) */}
                <button
                  type="button"
                  onClick={() => router.back()}
                  className={cn(
                    "absolute left-6 top-6 inline-flex items-center gap-2",
                    "rounded-full bg-slate-200/80 px-4 py-2 text-xs font-semibold text-slate-700",
                    "backdrop-blur-md shadow-sm hover:bg-slate-200",
                  )}
                >
                  <MdArrowBack className="text-slate-600" />
                  Back to Dashboard
                </button>

                {/* Play button */}
                <button
                  type="button"
                  aria-label="Play video"
                  className={cn(
                    "absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2",
                    "h-16 w-16 rounded-full bg-white/55 backdrop-blur",
                    "shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
                    "grid place-items-center hover:bg-white/70 transition",
                  )}
                >
                  <span className="ml-1 block h-0 w-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white" />
                </button>

                {/* Text */}
                <div className="absolute bottom-16 left-10 right-10">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white">
                    Start Your Challenge
                  </h2>
                  <p className="mt-2 max-w-[320px] text-sm leading-relaxed text-white/75">
                    Master new skills and climb the global leaderboards with
                    Genuslab.
                  </p>
                </div>

                {/* Brand */}
                <div className="absolute bottom-8 left-10 flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-sm font-black text-white backdrop-blur">
                    G
                  </span>
                  <span className="text-sm font-semibold text-white/85">
                    Genuslab
                  </span>
                </div>
              </div>

              {/* RIGHT: CONTENT */}
              <div className="px-8 py-10 md:px-16 md:py-12">
                <div className="mx-auto flex max-w-[520px] flex-col items-center text-center">
                  {/* logo */}
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 ring-1 ring-blue-100">
                    <span className="text-lg font-black text-blue-600">G</span>
                  </div>

                  <h3 className="mt-4 text-[34px] font-extrabold tracking-tight text-slate-900">
                    Get Ready
                  </h3>

                  <p className="mt-2 max-w-[420px] text-sm leading-relaxed text-slate-400">
                    Prepare yourself before jumping into the live challenge. Try
                    the demo or unlock the live quiz experience.
                  </p>

                  {/* mode cards */}
                  <div className="mt-9 grid w-full grid-cols-2 gap-8">
                    {/* Demo */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowDemo(true);
                        setShowLive(false);
                      }}
                      className={cn(
                        "rounded-2xl bg-white p-6 text-center",
                        "shadow-[0_16px_50px_rgba(15,23,42,0.06)] cursor-pointer",
                        "hover:shadow-[0_22px_65px_rgba(15,23,42,0.10)] transition",
                      )}
                    >
                      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100">
                        <span className="block h-0 w-0 border-y-[7px] border-y-transparent border-l-[11px] border-l-emerald-700" />
                      </div>
                      <div className="mt-4 text-sm font-extrabold text-slate-900">
                        Demo Quiz
                      </div>
                      <div className="mt-1 text-[11px] font-bold text-emerald-600">
                        Warm-up round
                      </div>
                    </button>

                    {/* Live */}
                    <button
                      type="button"
                      className={cn(
                        "rounded-2xl bg-white p-6 text-center",
                        "shadow-[0_16px_50px_rgba(15,23,42,0.06)]",
                        "hover:shadow-[0_22px_65px_rgba(15,23,42,0.10)] transition",
                      )}
                    >
                      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-100">
                        <MdLock className="text-xl text-blue-600" />
                      </div>
                      <div className="mt-4 text-sm font-extrabold text-slate-900">
                        Live Quiz
                      </div>
                      <div className="mt-1 text-[11px] font-bold text-blue-600">
                        Competitive
                      </div>
                    </button>
                  </div>

                  {/* benefits + steps */}
                  <div className="mt-12 grid w-full grid-cols-2 gap-12">
                    {/* Benefits */}
                    <div className="text-left">
                      <p className="text-[11px] font-extrabold tracking-wide text-blue-600">
                        Benefits
                      </p>

                      <div className="mt-6 space-y-6">
                        {benefits.map((b, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <div
                              className={cn(
                                "grid h-9 w-9 place-items-center rounded-xl",
                                b.bg,
                              )}
                            >
                              <b.icon className={cn("text-lg", b.color)} />
                            </div>
                            <div>
                              <p className="text-sm font-extrabold text-slate-900">
                                {b.title}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-400">
                                {b.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* How it Works */}
                    <div className="text-left">
                      <p className="text-[11px] font-extrabold tracking-wide text-blue-600">
                        How it Works
                      </p>

                      <div className="relative mt-6 space-y-6">
                        {/* line */}
                        <div className="absolute left-[14px] top-2 bottom-2 w-[2px] rounded-full bg-slate-100" />

                        {steps.map((s) => (
                          <div key={s.id} className="relative z-10 flex gap-4">
                            <div className="grid h-8 w-8 place-items-center rounded-full bg-white ring-2 ring-slate-100 text-[11px] font-extrabold text-blue-600">
                              {s.id}
                            </div>
                            <div>
                              <p className="text-sm font-extrabold text-slate-900">
                                {s.title}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-400">
                                {s.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* /grid */}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM STATUS BAR */}
          <div className="mt-8 w-full max-w-[1120px]">
            <div className="mx-auto flex w-full items-center justify-between rounded-3xl bg-white px-7 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              {/* left */}
              <div className="flex items-center gap-4">
                <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-white ring-1 ring-blue-200">
                  <MdSchool className="text-xl text-blue-600" />
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                </div>

                <div className="leading-tight">
                  <p className="text-[11px] font-bold text-blue-600">
                    Status:{" "}
                    <span className="font-extrabold text-slate-700">
                      Waiting
                    </span>
                  </p>
                  <p className="text-sm font-extrabold text-slate-900">
                    Next: Episode 4
                  </p>
                </div>
              </div>

              {/* right */}
              <div className="flex items-center gap-6">
                <div className="text-right leading-tight">
                  <p className="text-[11px] font-bold text-slate-400">
                    Starting in
                  </p>
                  <p className="text-xl font-extrabold tabular-nums text-slate-900">
                    04:52
                  </p>
                </div>

                {/* progress ring */}
                <div className="relative h-12 w-12">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 48 48">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-slate-100"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 20}
                      strokeDashoffset={2 * Math.PI * 20 * (1 - 0.75)}
                      className="text-blue-600"
                    />
                  </svg>
                  <div className="absolute inset-0 grid place-items-center text-[11px] font-extrabold text-blue-600">
                    75%
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /bottom bar */}
        </div>
      </div>
    </>
  );
};

export default GetReadyModal;
