import { FaCheckCircle, FaCrown } from "react-icons/fa";
import { HiOutlineTv } from "react-icons/hi2";
import PrimaryButton from "@/components/ui/buttons/Primary";

const FREE_BENEFITS = [
  { text: "Demo Quiz", active: true },
  { text: "7 Daily Quizzes", active: false },
  { text: "Global Leaderboard", active: false },
  { text: "Unlimited Quizzes", active: false },
  { text: "Double XP Boost", active: false },
];

const PREMIUM_BENEFITS = [
  { text: "Demo Quiz", active: true },
  { text: "7 Daily Quizzes", active: true },
  { text: "Global Leaderboard", active: true },
  { text: "Unlimited Quizzes", active: true },
  { text: "Double XP Boost", active: true },
];

const SubscriptionCard = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const plan = isSubscribed
    ? {
        name: "Premium",
        price: "₦4000/month",
        badge: "Premium Member",
        badgeStyle: "bg-amber-400/10 border border-amber-400/30 text-amber-400",
        icon: <FaCrown className="text-amber-400 text-lg" />,
        glow: "bg-amber-400/10",
        benefits: PREMIUM_BENEFITS,
      }
    : {
        name: "Free Tier",
        price: "₦0/month",
        badge: "Current Plan",
        badgeStyle: "bg-blue/10 border border-blue/20 text-blue",
        icon: <HiOutlineTv className="text-blue text-xl" />,
        glow: "bg-blue/5",
        benefits: FREE_BENEFITS,
      };

  return (
    <div className="flex flex-col h-full">
      <div>
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <HiOutlineTv className="text-blue text-xl" />
            <h3 className="text-base font-bold text-(--primary)">
              Subscription Plan
            </h3>
          </div>
          <span
            className={`text-[14px] font-bold px-3 py-1 rounded-full ${plan.badgeStyle}`}
          >
            {plan.badge}
          </span>
        </div>

        <div className="mt-5 bg-white/[0.02] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
          <div
            className={`absolute top-0 right-0 w-32 h-32 blur-[50px] rounded-full -mr-10 -mt-10 ${plan.glow}`}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <h4 className="text-2xl font-black text-(--primary)">
                {plan.name}
              </h4>
              <span className="text-grey text-sm font-medium">
                {plan.price}
              </span>
            </div>
            {isSubscribed && plan.icon}
          </div>

          <p className="text-grey font-bold mt-4 mb-3 tracking-wide uppercase text-xs">
            {isSubscribed ? "Your Benefits" : "Active Benefits"}
          </p>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            {plan.benefits.map((benefit) => (
              <BenefitItem
                key={benefit.text}
                active={benefit.active}
                text={benefit.text}
              />
            ))}
          </div>
        </div>
      </div>

      <PrimaryButton
        type="link"
        to="/pricing"
        text={isSubscribed ? "See Pricing" : "Upgrade Plan"}
        style="bg-blue text-white hover:bg-blue/90 rounded-xl py-3.5 w-full text-sm font-bold tracking-wide flex justify-center items-center gap-2 mt-5"
      />
    </div>
  );
};

const BenefitItem = ({ active, text }: { active: boolean; text: string }) => (
  <div
    className={`flex items-center gap-2 ${active ? "text-(--primary)" : "text-grey/40"}`}
  >
    <FaCheckCircle
      className={`shrink-0 ${active ? "text-green-500" : "text-grey/20"}`}
      size={12}
    />
    <span className={!active ? "line-through opacity-80" : "font-medium"}>
      {text}
    </span>
  </div>
);

export default SubscriptionCard;
