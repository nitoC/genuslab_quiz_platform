import { PricingPlan } from "@/types/pricingPlans";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    tag: "Essential",
    title: "Free",
    price: "0.00",
    features: [
      { text: "Practice Quiz", included: true },
      { text: "Daily Quiz Access", included: false },
      { text: "Voice Read (TTS)", included: false },
      { text: "Leaderboard Access", included: false },
      { text: "Referral bonus Claiming", included: false },
    ],
  },
  {
    id: "premium",
    tag: "Champion",
    title: "Premium",
    price: "4,000",
    period: "/mo",
    badge: "Premium Tier",
    isHighlighted: true,
    features: [
      { text: "Everything in Basic", included: true, icon: "ribbon" },
      { text: "AI Voice Read (TTS)", included: true, icon: "megaphone" },
      { text: "Studio Quiz Eligibility", included: true, icon: "sparkles" },
      { text: "Exclusive Genus Badge", included: true, icon: "badge" },
      { text: "24/7 Priority Support", included: true, icon: "headset" },
    ],
  },
];
