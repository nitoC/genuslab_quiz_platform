import Link from "next/link";
import { BiTrophy } from "react-icons/bi";
import { MdLockClock, MdBarChart } from "react-icons/md";
import { GiLightningHelix } from "react-icons/gi";
import { cn } from "@/lib/utils/cn";

interface SubmitUIProps {
  score: number;
  timeTaken: string; // seconds
  router: any;
  type: "live" | "demo";
  resetTime: () => void;
  attemptId?: string;
  exp?: number;
  // quizId: string;
  did?: string;
}

const SubmitUI = ({
  score,
  timeTaken,
  router,
  resetTime,
  type,
  // quizId,
  did,
  attemptId,
  exp = 0,
}: SubmitUIProps) => {
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
    <div className="py-4 sm:py-8 md:py-12">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center px-2">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] ${performance.bg} ${performance.color}`}
          >
            <BiTrophy size={14} />
            Quiz Completed
          </div>

          {/* Scaled typography down for standard small displays */}
          <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight">
            Assessment Results
          </h1>

          <p className="mt-2 sm:mt-3 text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Your responses have been evaluated successfully. Review your
            performance summary below.
          </p>
        </div>

        {/* Score Card - Layout context shifts fluidly from column stack to row grid */}
        <div className="mt-6 sm:mt-10 bg-[#11192e] border border-white/5 rounded-2xl sm:rounded-[32px] p-5 sm:p-8 md:p-10 mx-1 sm:mx-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-center">
            {/* Score Circle Container */}
            <div className="flex justify-center">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52">
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
                  <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white">
                    {score}
                  </span>
                  <span className="text-emerald-400 font-bold text-xs sm:text-sm">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Breakdown Panel */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {performance.label}
              </h2>

              <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed">
                Your performance has been calculated based on the answers
                submitted for this assessment.
              </p>

              {/* Smaller font layout variables and compact paddings for statistics items */}
              <div className="mt-6 space-y-3">
                {/* Experience Points Row */}
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-[0_0_20px_rgba(245,158,11,0.03)] text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <GiLightningHelix
                      size={16}
                      className="text-amber-400 animate-pulse flex-shrink-0"
                    />
                    <span className="text-amber-200/80 font-medium">
                      Experience Awarded
                    </span>
                  </div>
                  <span className="font-black text-base sm:text-xl text-amber-400 tracking-wide">
                    {type === "demo" ? "0 XP" : `+${exp} XP`}
                  </span>
                </div>

                {/* Completion Time Row */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <MdLockClock
                      size={16}
                      className="text-slate-400 flex-shrink-0"
                    />
                    <span className="text-slate-300">Completion Time</span>
                  </div>
                  <span className="font-bold text-white">{timeTaken}</span>
                </div>

                {/* Performance Evaluation Row */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <MdBarChart
                      size={16}
                      className="text-slate-400 flex-shrink-0"
                    />
                    <span className="text-slate-300">Performance</span>
                  </div>
                  <span className={cn("font-bold", performance.color)}>
                    {performance.label}
                  </span>
                </div>

                {/* Maximum Allowed Time Row */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-300">Maximum Allowed Time</span>
                  <span className="font-bold text-white">5 Minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions - Flex container handles narrow mobile vertical flow gracefully */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 px-1 sm:px-0">
          <button
            onClick={() => {
              resetTime();
              router.push("/quizzes");
            }}
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/5 text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-sm font-bold transition text-center"
          >
            Take Another Quiz
          </button>

          {type === "demo" ? (
            <button
              onClick={() => {
                resetTime();
                router.push("/dashboard");
              }}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-sm font-bold transition text-center"
            >
              Go To Dashboard
            </button>
          ) : (
            <Link
              href={`/quizzes/previous/${attemptId}/${did}`}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-sm font-bold transition text-center block"
            >
              View results
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitUI;
