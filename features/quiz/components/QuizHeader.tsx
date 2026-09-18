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
  avatarUrl,
}: {
  currentQuestion: any;
  currentQuestionIndex: number;
  totalQuestions: number;
  progressSegments: number;
  activeSeg: number;
  avatarUrl?: string;
}) => {
  return (
    <>
      {/* Changed mb-12 to a fluid mb-6 md:mb-12 to scale spatial bounds down cleanly on small screens */}
      <div className="flex items-center justify-between mb-6 md:mb-12 gap-2">
        <div className="flex items-center gap-2 text-[14px] sm:text-sm font-bold tracking-tight whitespace-nowrap">
          <span className="text-grey">Difficulty:</span>
          <span className="capitalize text-green">
            {currentQuestion?.difficulty}
          </span>
        </div>

        {/* Progress Indicators */}
        <div className="hidden md:flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            {[...Array(progressSegments)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 w-8 rounded-full transition-colors",
                  i === activeSeg ? "bg-green" : "bg-white/10",
                )}
              />
            ))}
          </div>
          <span className="text-[14px] text-grey font-bold uppercase tracking-[0.2em]">
            Question{" "}
            {Math.min(currentQuestionIndex + 1, Math.max(1, totalQuestions))} of{" "}
            {Math.max(1, totalQuestions)}
          </span>
        </div>

        <img
          src={avatarUrl || "/images/avatar.png"}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/avatar.png";
          }}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-white/10 flex-shrink-0 object-cover"
          alt="avatar"
        />
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
    <div className="md:hidden sticky top-0 z-40 bg-(--background-dark-secondary)/90 backdrop-blur-md -mx-4 -mt-4 mb-4">
      <div className="px-4 py-3 sm:py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div>
            <p className="text-[14px] uppercase tracking-[0.25em] text-grey font-bold">
              Question
            </p>
            <h2 className="text-base sm:text-lg font-black text-(--primary)">
              {currentQuestionIndex + 1}
              <span className="text-grey font-semibold text-sm">
                /{totalQuestions}
              </span>
            </h2>
          </div>

          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border transition-colors",
              timeLeft <= 60
                ? "bg-red/10 border-red/20 text-red"
                : "bg-green/10 border-green/20 text-green",
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
            <span className="text-grey">Quiz Progress</span>
            <span className="font-bold text-(--primary)">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-green rounded-full transition-all duration-500"
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
