import React from "react";
import { PricingPlan } from "@/types/pricingPlans";
import { FeatureItem } from "@/components/ui/FeatureItem";
import clsx from "clsx";

interface ButtonProps {
  variant: "gradient" | "current" | "primary";
  children: React.ReactNode;
  handlePay?: () => void;
  submitting?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  handlePay,
  submitting,
}) => {
  if (variant === "current") {
    return (
      <button
        disabled
        className="w-full py-3 px-4 rounded-xl bg-slate-800/80 text-slate-400 text-xs font-semibold cursor-not-allowed border border-slate-700/50"
      >
        {children}
      </button>
    );
  }

  if (variant === "gradient") {
    return (
      <button
        onClick={handlePay}
        disabled={submitting}
        className={clsx(
          submitting
            ? "cursor-not-allowed opacity-50 w-full py-3 px-4 rounded-xl bg-slate-800/80 text-slate-400 text-xs font-semibold"
            : "w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white text-xs font-bold transition-opacity shadow-lg shadow-purple-500/20",
        )}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={handlePay}
      disabled={submitting}
      className={clsx(
        submitting
          ? "cursor-not-allowed opacity-50 w-full py-3 px-4 rounded-xl bg-slate-800/80 text-slate-400 text-xs font-semibold"
          : "w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors",
      )}
    >
      {children}
    </button>
  );
};

export const PricingCard: React.FC<{
  plan: PricingPlan;
  activePlan: any;
  handleSubscription: () => void;
  submitting: boolean;
}> = ({ plan, activePlan, handleSubscription, submitting }) => {
  // Check if active plan exists from backend return (e.g. activePlan is an object or subscription name)
  const hasActiveSub = Boolean(
    activePlan &&
    (typeof activePlan === "object"
      ? Object.keys(activePlan).length > 0
      : activePlan !== "free"),
  );

  const activePlanName = (
    activePlan?.name ||
    activePlan?.planName ||
    ""
  ).toLowerCase();

  // Determine exact plan matches
  const isCurrent =
    plan.id === "free"
      ? !hasActiveSub
      : hasActiveSub &&
        (activePlanName.includes(plan.id) ||
          activePlanName.includes("premium"));

  // Dynamic Button Properties
  const buttonVariant = isCurrent
    ? "current"
    : plan.isHighlighted
      ? "gradient"
      : "primary";

  const getButtonText = () => {
    if (isCurrent) return "Current Active Plan";
    if (submitting) return "Subscribing...";
    if (plan.id === "free") return "Downgrade to Free";
    return "Claim Premium Access";
  };

  return (
    <div
      className={clsx(
        "relative rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1",
        plan.isHighlighted
          ? "bg-slate-900/90 border-2 border-purple-500/80 shadow-2xl shadow-purple-950/50"
          : "bg-slate-900/60 border border-slate-800/80",
      )}
    >
      {/* Top Floating Badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-[10px] font-bold tracking-widest uppercase py-1 px-4 rounded-full shadow-md">
          {plan.badge}
        </div>
      )}

      {/* Card Body */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span
            className={clsx(
              "text-xs font-semibold tracking-wide",
              plan.isHighlighted
                ? "text-fuchsia-400"
                : plan.id === "basic"
                  ? "text-blue-400"
                  : "text-emerald-400",
            )}
          >
            {plan.tag}
          </span>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {plan.title}
          </h3>
        </div>

        {/* Price Display */}
        <div className="min-h-[48px] flex items-baseline gap-1">
          <span className="text-lg font-bold text-slate-300">₦</span>
          <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {plan.price}
          </span>
          {plan.period && (
            <span className="text-xs font-medium text-slate-400">
              {plan.period}
            </span>
          )}
        </div>

        {/* Feature List */}
        <ul className="space-y-3.5 pt-2">
          {plan.features.map((feature, idx) => (
            <FeatureItem key={idx} feature={feature} />
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <div className="pt-8">
        <Button
          variant={buttonVariant}
          handlePay={isCurrent ? undefined : handleSubscription}
          submitting={submitting}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};
