import React from "react";

// Micro Skeleton for a Single Quiz Card
export const QuizCardSkeleton = () => {
  return (
    <div className="h-90 basis-70 shrink-0 bg-white/5 border border-white/10 animate-pulse p-4 rounded-lg flex flex-col gap-4 justify-between">
      <div className="w-24 h-7 bg-white/10 rounded-full" />

      <div className="flex flex-col gap-4">
        {/* Day / Episode Box */}
        <div className="flex bg-white/5 p-1 border border-white/10 rounded-sm w-fit gap-2">
          <div className="w-10 h-8 bg-white/10 rounded" />
          <div className="w-12 h-8 bg-white/10 rounded" />
        </div>

        {/* Status / Participants text */}
        <div className="w-32 h-8 bg-white/10 rounded" />
        <div className="w-40 h-4 bg-white/10 rounded" />
      </div>

      <div className="flex items-end w-full justify-between">
        <div className="flex flex-col gap-1">
          <div className="w-14 h-3 bg-white/10 rounded" />
          <div className="w-20 h-5 bg-white/10 rounded" />
        </div>
        <div className="w-10 h-10 bg-white/10 rounded-full" />
      </div>
    </div>
  );
};

// Full Page Skeleton Loader
export const DashboardSkeleton = () => {
  return (
    <div className="relative min-h-screen bg-(--background) animate-pulse">
      {/* Header Mimic */}
      <div className="h-16 border-b border-white/5 bg-white/5 w-full mb-6" />

      {/* Top Stats Row */}
      <section className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 h-32 bg-white/5 border border-white/10 rounded-xl" />
          <div className="flex-1 h-32 bg-white/5 border border-white/10 rounded-xl" />
        </div>
      </section>

      {/* Slider Header */}
      <section className="px-4 md:px-8 flex flex-col gap-2 mb-4">
        <div className="w-48 h-7 bg-white/10 rounded" />
        <div className="w-64 h-4 bg-white/10 rounded" />
      </section>

      {/* Horizontal Slider Area */}
      <section className="px-4 md:px-8 mb-8">
        <div className="flex gap-4 overflow-x-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <QuizCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Core Bottom Grid */}
      <section className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-48 bg-white/5 border border-white/10 rounded-xl" />
          <div className="h-48 bg-white/5 border border-white/10 rounded-xl" />
          <div className="h-48 bg-white/5 border border-white/10 rounded-xl" />
        </div>
      </section>
    </div>
  );
};
