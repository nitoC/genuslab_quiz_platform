import { useQuizCountdownTime } from "@/hooks/useTime";
import { cn } from "@/lib/utils";
import { formatMMSS } from "@/lib/utils/timer";
import { MdTimer } from "react-icons/md";

export const QuizHeader = ({
  currentQuestion,
  progressSegments,
  currentQuestionIndex,
  totalQuestions,
  activeSeg,
}: {
  currentQuestion: any;
  currentQuestionIndex: number;
  totalQuestions: number;
  progressSegments: number;
  activeSeg: number;
}) => {
  return (
    <>
      {/* Changed mb-12 to a fluid mb-6 md:mb-12 to scale spatial bounds down cleanly on small screens */}
      <div className="flex items-center justify-between mb-6 md:mb-12 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border border-white/5">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded flex items-center justify-center flex-shrink-0">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-sm rotate-45" />
          </div>
          <span className="text-slate-300 text-[14px] sm:text-sm font-bold tracking-tight whitespace-nowrap">
            Difficulty:{" "}
            <span className="capitalize text-emerald-400">
              {currentQuestion?.difficulty}
            </span>
          </span>
        </div>

        {/* Progress Indicators */}
        <div className="hidden md:flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            {[...Array(progressSegments)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 w-8 rounded-full transition-all",
                  i === activeSeg
                    ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    : "bg-white/10",
                )}
              />
            ))}
          </div>
          <span className="text-[14px] text-slate-500 font-bold uppercase tracking-[0.2em]">
            Question{" "}
            {Math.min(currentQuestionIndex + 1, Math.max(1, totalQuestions))} of{" "}
            {Math.max(1, totalQuestions)}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* <div className="flex items-center gap-1 sm:gap-2 bg-white/5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-white/5">
            <MdLocalFireDepartment className="text-orange-500 text-base sm:text-lg" />
            <span className="text-white font-bold text-sm sm:text-sm">12</span>
          </div> */}
          <div className="bg-emerald-500/10 text-emerald-500 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-emerald-500/20 text-[14px] sm:text-sm font-black whitespace-nowrap">
            +10 XP
          </div>
          <img
            src="https://i.pravatar.cc/150?u=my"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-white/10 flex-shrink-0"
            alt="avatar"
          />
        </div>
      </div>
    </>
  );
};

interface MobileQuizHeaderProps {
  isLoading: boolean;
  isSubmitted: boolean;
  isError: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
}

export const MobileQuizHeader = ({
  currentQuestionIndex,
  totalQuestions,
  isSubmitted,
  isLoading,
  isError,
}: MobileQuizHeaderProps) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const timeLeft = useQuizCountdownTime(isSubmitted, isLoading, isError);

  return (
    <div className="md:hidden sticky top-0 z-40 bg-[#0f1933]/90 backdrop-blur-md -mx-4 -mt-4 mb-4">
      {/* Optimized wrapper container layout context for touch interaction efficiency */}
      <div className="px-4 py-3 sm:py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div>
            <p className="text-[14px] sm:text-[14px] uppercase tracking-[0.25em] text-slate-500 font-bold">
              Question
            </p>
            <h2 className="text-base sm:text-lg font-black text-white">
              {currentQuestionIndex + 1}
              <span className="text-slate-500 font-semibold text-sm">
                /{totalQuestions}
              </span>
            </h2>
          </div>

          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border transition-all",
              timeLeft <= 60
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
            )}
          >
            <MdTimer className="text-base sm:text-lg" />
            <span className="font-black text-sm sm:text-base">
              {formatMMSS(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[14px] sm:text-sm">
            <span className="text-slate-400">Quiz Progress</span>
            <span className="font-bold text-white">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
