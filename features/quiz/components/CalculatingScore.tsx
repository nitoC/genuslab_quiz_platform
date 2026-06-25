"use client";

// import { CheckCircle2, Brain, BarChart3, ShieldCheck } from "lucide-react";

import {
  FaBrain,
  FaChartLine,
  FaShieldHalved,
  FaCircleCheck,
} from "react-icons/fa6";
import { useEffect, useState } from "react";

interface CalculatingScoreProps {
  onComplete: () => void;
}

const CalculatingScore = ({ onComplete }: CalculatingScoreProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;

        if (next >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            onComplete();
          }, 800);

          return 100;
        }

        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  const steps = [
    {
      label: "Analyzing responses",
      icon: FaBrain,
      completed: progress > 25,
    },
    {
      label: "Calculating score",
      icon: FaChartLine,
      completed: progress > 55,
    },
    {
      label: "Verifying results",
      icon: FaShieldHalved,
      completed: progress > 85,
    },
  ];

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-2xl border border-emerald-500/20 text-xs font-black uppercase tracking-[0.2em]">
            Assessment Complete
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-black text-white">
            Processing Your Results
          </h1>

          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Please wait while we analyze your answers, calculate your
            performance, and prepare your assessment report.
          </p>
        </div>

        {/* Main Card */}

        <div className="mt-12 bg-[#11192e] border border-white/5 rounded-[32px] p-8 md:p-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Progress Circle */}

            <div className="flex justify-center">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-white/5"
                  />

                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    className="text-emerald-500 transition-all duration-300"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-white">
                    {progress}
                  </span>

                  <span className="text-xl font-bold text-emerald-400">%</span>

                  <span className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500 font-bold">
                    Processing
                  </span>
                </div>
              </div>
            </div>

            {/* Analysis Section */}

            <div>
              <h2 className="text-3xl font-black text-white">
                Assessment Analysis
              </h2>

              <p className="mt-3 text-slate-400">
                Your submitted answers are being processed and validated before
                generating the final performance report.
              </p>

              <div className="mt-8 space-y-4">
                {steps.map((step) => {
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.label}
                      className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-2xl p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center">
                          <Icon size={18} className="text-slate-300" />
                        </div>

                        <span className="text-white font-medium">
                          {step.label}
                        </span>
                      </div>

                      {step.completed ? (
                        <FaCircleCheck size={20} className="text-emerald-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-600 border-t-emerald-500 animate-spin" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}

              <div className="mt-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Overall Progress</span>

                  <span className="text-white font-semibold">{progress}%</span>
                </div>

                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}

        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            This usually takes only a few seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculatingScore;
