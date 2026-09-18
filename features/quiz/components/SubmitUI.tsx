import Link from "next/link";
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
          color: "text-green",
          ring: "text-green",
        }
      : score >= 60
        ? {
            label: "Good",
            color: "text-blue",
            ring: "text-blue",
          }
        : score >= 40
          ? {
              label: "Fair",
              color: "text-yellow",
              ring: "text-yellow",
            }
          : {
              label: "Needs Improvement",
              color: "text-red",
              ring: "text-red",
            };

  return (
    <div className="py-4 sm:py-8 md:py-12">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center px-2">
          <p className="text-grey text-sm font-semibold uppercase tracking-wider">
            Quiz Completed
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black text-(--primary) tracking-tight">
            Assessment Results
          </h1>
        </div>

        {/* Score Card */}
        <div className="mt-6 sm:mt-10 bg-(--background-dark-secondary) border border-white/5 rounded-lg p-5 sm:p-8 md:p-10 mx-1 sm:mx-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-center">
            {/* Score Circle Container */}
            <div className="flex flex-col items-center gap-3">
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
                    strokeDashoffset={327 - (327 * Math.min(100, Math.max(0, score))) / 100}
                    className={cn("transition-all duration-700 ease-out", performance.ring)}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl md:text-6xl font-black text-(--primary)">
                    {score}
                    <span className="text-xl sm:text-2xl align-top">%</span>
                  </span>
                </div>
              </div>

              <h2 className={cn("text-lg sm:text-xl font-bold", performance.color)}>
                {performance.label}
              </h2>
            </div>

            {/* Stats Breakdown Panel */}
            <div className="space-y-3">
              {type === "live" && (
                <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                  <div className="flex items-center gap-2.5 text-grey">
                    <GiLightningHelix size={16} className="flex-shrink-0" />
                    <span>Experience Awarded</span>
                  </div>
                  <span className="font-bold text-(--primary)">+{exp} XP</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                <div className="flex items-center gap-2.5 text-grey">
                  <MdLockClock size={16} className="flex-shrink-0" />
                  <span>Completion Time</span>
                </div>
                <span className="font-bold text-(--primary)">{timeTaken}</span>
              </div>

              <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                <div className="flex items-center gap-2.5 text-grey">
                  <MdBarChart size={16} className="flex-shrink-0" />
                  <span>Performance</span>
                </div>
                <span className={cn("font-bold", performance.color)}>
                  {performance.label}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm py-2">
                <span className="text-grey">Maximum Allowed Time</span>
                <span className="font-bold text-(--primary)">5 Minutes</span>
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
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/5 text-(--primary) px-6 py-3.5 sm:px-8 sm:py-4 rounded-lg text-sm font-bold transition-colors text-center"
          >
            Take Another Quiz
          </button>

          {type === "demo" ? (
            <button
              onClick={() => {
                resetTime();
                router.push("/dashboard");
              }}
              className="w-full sm:w-auto bg-green hover:bg-green/90 text-[#020617] px-6 py-3.5 sm:px-8 sm:py-4 rounded-lg text-sm font-bold transition-colors text-center"
            >
              Go To Dashboard
            </button>
          ) : (
            <Link
              href={`/quizzes/previous/${attemptId}/${did}`}
              className="w-full sm:w-auto bg-green hover:bg-green/90 text-[#020617] px-6 py-3.5 sm:px-8 sm:py-4 rounded-lg text-sm font-bold transition-colors text-center block"
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
