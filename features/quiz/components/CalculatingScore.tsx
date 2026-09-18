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
          <div className="inline-flex items-center gap-2 bg-green/10 text-green px-4 py-2 rounded-lg border border-green/20 text-sm font-bold uppercase tracking-[0.15em]">
            Assessment Complete
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-black text-(--primary)">
            Processing Your Results
          </h1>

          <p className="mt-4 text-grey max-w-xl mx-auto">
            Please wait while we analyze your answers, calculate your
            performance, and prepare your assessment report.
          </p>
        </div>

        {/* Main Card */}

        <div className="mt-12 bg-(--background-dark-secondary) border border-white/5 rounded-lg p-8 md:p-10">
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
                    className="text-green transition-all duration-300"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-(--primary)">
                    {progress}
                  </span>

                  <span className="text-xl font-bold text-green">%</span>

                  <span className="mt-2 text-sm uppercase tracking-[0.25em] text-grey font-bold">
                    Processing
                  </span>
                </div>
              </div>
            </div>

            {/* Analysis Section */}

            <div>
              <h2 className="text-3xl font-black text-(--primary)">
                Assessment Analysis
              </h2>

              <p className="mt-3 text-grey">
                Your submitted answers are being processed and validated before
                generating the final performance report.
              </p>

              <div className="mt-8 space-y-4">
                {steps.map((step) => {
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.label}
                      className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center">
                          <Icon size={18} className="text-grey" />
                        </div>

                        <span className="text-(--primary) font-medium">
                          {step.label}
                        </span>
                      </div>

                      {step.completed ? (
                        <FaCircleCheck size={20} className="text-green" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-white/10 border-t-green animate-spin" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}

              <div className="mt-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-grey">Overall Progress</span>

                  <span className="text-(--primary) font-semibold">
                    {progress}%
                  </span>
                </div>

                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green transition-all duration-300"
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
          <p className="text-sm text-grey">
            This usually takes only a few seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculatingScore;
