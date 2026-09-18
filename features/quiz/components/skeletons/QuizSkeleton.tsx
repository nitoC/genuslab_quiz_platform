import Layout from "@/components/layouts/Layout";

const QuizSkeleton = () => {
  return (
    <Layout type="quiz">
      <div className="min-h-screen flex items-center justify-center p-4 font-sans animate-pulse">
        {/* Main Container mirroring the actual quiz page */}
        <div className="w-full max-w-5xl bg-(--background-dark-secondary) rounded-lg border border-white/5 p-8 md:p-12 relative overflow-hidden">
          {/* Top Header Bar Skeleton */}
          <div className="flex items-center justify-between mb-12">
            {/* Difficulty Placeholder */}
            <div className="h-5 w-28 bg-white/5 rounded" />

            {/* Progress Indicators Placeholder (Centered on desktop) */}
            <div className="hidden md:flex flex-col items-center gap-3">
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-1.5 w-8 rounded-full bg-white/10" />
                ))}
              </div>
              <div className="h-3 w-24 bg-white/5 rounded" />
            </div>

            {/* Avatar Placeholder */}
            <div className="w-10 h-10 rounded-lg bg-white/10 border-2 border-white/10" />
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
                </div>
                {/* Hint Placeholder */}
                <div className="h-4 bg-white/5 rounded w-1/2" />
              </div>

              {/* Options Grid Placeholder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="h-20 w-full bg-white/5 border border-white/5 rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Right Sidebar Widgets Placeholder */}
            <div className="space-y-6 w-full">
              {/* Timer Widget Box */}
              <div className="h-28 w-full bg-white/5 border border-white/5 rounded-lg" />
            </div>
          </div>

          {/* Footer Actions Action Bar Skeleton */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 mt-8">
            <div className="h-12 w-28 bg-white/5 rounded-lg" />
            <div className="h-12 w-28 bg-white/10 rounded-lg" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizSkeleton;
