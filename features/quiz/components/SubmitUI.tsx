import React from "react";
import { BiTrophy } from "react-icons/bi";
import { MdLockClock, MdBarChart } from "react-icons/md";

interface SubmitUIProps {
  score: number;
  timeTaken: string; // seconds
  router: any;
  resetTime: () => void;
}

const SubmitUI = ({ score, timeTaken, router, resetTime }: SubmitUIProps) => {
  // const minutes = Math.floor(timeTaken / 60);
  // const seconds = timeTaken % 60;
  // resetTime();

  const performance =
    score >= 80
      ? {
          label: "Excellent",
          color: "text-emerald-400",
          bg: "bg-emerald-500/10 border-emerald-500/20",
        }
      : score >= 60
        ? {
            label: "Good",
            color: "text-blue-400",
            bg: "bg-blue-500/10 border-blue-500/20",
          }
        : score >= 40
          ? {
              label: "Fair",
              color: "text-amber-400",
              bg: "bg-amber-500/10 border-amber-500/20",
            }
          : {
              label: "Needs Improvement",
              color: "text-red-400",
              bg: "bg-red-500/10 border-red-500/20",
            };

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-black uppercase tracking-[0.2em] ${performance.bg} ${performance.color}`}
          >
            <BiTrophy size={14} />
            Quiz Completed
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-black text-white">
            Assessment Results
          </h1>

          <p className="mt-3 text-slate-400 max-w-lg mx-auto">
            Your responses have been evaluated successfully. Review your
            performance summary below.
          </p>
        </div>

        {/* Score Card */}
        <div className="mt-10 bg-[#11192e] border border-white/5 rounded-[32px] p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Score Circle */}
            <div className="flex justify-center">
              <div className="relative w-52 h-52">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-white/5"
                  />

                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={327}
                    strokeDashoffset={327 - (327 * score) / 100}
                    className="text-emerald-500"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-white">
                    {score}
                  </span>
                  <span className="text-emerald-400 font-bold">%</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div>
              <h2 className="text-3xl font-black text-white">
                {performance.label}
              </h2>

              <p className="mt-3 text-slate-400">
                Your performance has been calculated based on the answers
                submitted for this assessment.
              </p>

              <div className="mt-8 space-y-4">
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MdLockClock size={18} className="text-slate-400" />
                    <span className="text-slate-300">Completion Time</span>
                  </div>

                  <span className="font-bold text-white">{timeTaken}</span>
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MdBarChart size={18} className="text-slate-400" />
                    <span className="text-slate-300">Performance</span>
                  </div>

                  <span className={performance.color}>{performance.label}</span>
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-slate-300">Maximum Allowed Time</span>

                  <span className="font-bold text-white">5 Minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => {
              resetTime();
              router.push("/quizzes");
            }}
            className="bg-white/5 hover:bg-white/10 border border-white/5 text-white px-8 py-4 rounded-2xl font-bold transition"
          >
            Take Another Quiz
          </button>

          <button
            onClick={() => {
              resetTime();
              router.push("/dashboard");
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-2xl font-bold transition"
          >
            Go To Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitUI;
