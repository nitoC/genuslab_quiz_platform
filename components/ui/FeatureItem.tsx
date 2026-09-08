import React from "react";
import {
  MdCheckCircle,
  MdCancel,
  MdVerified,
  MdCampaign,
  MdAutoAwesome,
  MdMilitaryTech,
  MdSupportAgent,
} from "react-icons/md";
import { PlanFeature } from "@/types/pricingPlans";

const renderCustomIcon = (iconType?: string) => {
  switch (iconType) {
    case "ribbon":
      return <MdVerified className="text-fuchsia-400 text-lg shrink-0" />;
    case "megaphone":
      return <MdCampaign className="text-fuchsia-400 text-lg shrink-0" />;
    case "sparkles":
      return <MdAutoAwesome className="text-fuchsia-400 text-lg shrink-0" />;
    case "badge":
      return <MdMilitaryTech className="text-fuchsia-400 text-lg shrink-0" />;
    case "headset":
      return <MdSupportAgent className="text-fuchsia-400 text-lg shrink-0" />;
    default:
      return null;
  }
};

export const FeatureItem: React.FC<{ feature: PlanFeature }> = ({
  feature,
}) => {
  return (
    <li className="flex items-center gap-3 text-sm md:text-sm font-medium">
      {feature.icon ? (
        renderCustomIcon(feature.icon)
      ) : feature.included ? (
        <MdCheckCircle className="text-cyan-400 text-lg shrink-0" />
      ) : (
        <MdCancel className="text-slate-600 text-lg shrink-0" />
      )}
      <span className={feature.included ? "text-slate-200" : "text-slate-600"}>
        {feature.text}
      </span>
    </li>
  );
};
