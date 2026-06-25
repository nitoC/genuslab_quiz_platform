import Layout from "@/components/layouts/Layout";

const QuizSkeleton = () => {
  return (
    <Layout type="quiz">
      <div className="min-h-screen flex items-center justify-center p-4 font-sans animate-pulse">
        {/* Main Container mirroring the actual quiz page */}
        <div className="w-full max-w-5xl bg-[#0f1933] rounded-[40px] border border-white/5 p-8 md:p-12 relative overflow-hidden shadow-2xl">
          {/* Top Header Bar Skeleton */}
          <div className="flex items-center justify-between mb-12">
            {/* Difficulty Badge Placeholder */}
            <div className="h-8 w-36 bg-white/5 rounded-2xl border border-white/5" />

            {/* Progress Indicators Placeholder (Centered on desktop) */}
            <div className="hidden md:flex flex-col items-center gap-3">
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-1.5 w-8 rounded-full bg-white/10" />
                ))}
              </div>
              <div className="h-3 w-24 bg-white/5 rounded" />
            </div>

            {/* Streaks & Avatar Placeholder */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-14 bg-white/5 rounded-xl border border-white/5" />
              <div className="h-9 w-16 bg-white/5 rounded-xl border border-white/5" />
              <div className="w-10 h-10 rounded-xl bg-white/10 border-2 border-white/10" />
            </div>
          </div>

          {/* Core Content Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
            {/* Left Main Area: Question & Options */}
            <div className="lg:col-span-2 space-y-8">
              {/* Question Text block */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="w-full space-y-3">
                    <div className="h-8 bg-white/10 rounded-lg w-11/12" />
                    <div className="h-8 bg-white/10 rounded-lg w-3/4 md:hidden" />
                  </div>
                  <div className="w-12 h-12 bg-white/5 rounded-full flex-shrink-0" />
                </div>
                {/* Hint Placeholder */}
                <div className="h-4 bg-white/5 rounded w-1/2" />
              </div>

              {/* Options Grid Placeholder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="h-20 w-full bg-white/5 border border-white/5 rounded-3xl"
                  />
                ))}
              </div>
            </div>

            {/* Right Sidebar Widgets Placeholder */}
            <div className="space-y-6 w-full">
              {/* Timer Widget Box */}
              <div className="h-28 w-full bg-white/5 border border-white/5 rounded-3xl" />
              {/* Rivals Widget Box */}
              <div className="h-48 w-full bg-white/5 border border-white/5 rounded-3xl" />
            </div>
          </div>

          {/* Footer Actions Action Bar Skeleton */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-8">
            <div className="h-12 w-28 bg-white/5 rounded-xl" />
            <div className="h-12 w-28 bg-white/10 rounded-xl" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizSkeleton;
