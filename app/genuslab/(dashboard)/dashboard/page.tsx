"use client";

import AdminHeader from "@/components/layouts/AdminHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import PerformanceChart from "@/components/ui/charts/CurveArea";
import CustomActiveShapePieChart from "@/components/ui/charts/LinePie";

import {
  FaPiggyBank,
  FaMoneyBill,
  FaUserGroup,
  FaUserPlus,
} from "react-icons/fa6";

import clsx from "clsx";

const Card = ({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}) => {
  return (
    <AdminCard className="hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className={clsx("text-2xl", color)}>{icon}</div>

          <div>
            <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {value}
            </h2>
          </div>
        </div>
      </div>
    </AdminCard>
  );
};

const page = () => {
  const topCardsData = [
    {
      icon: <FaUserGroup size={26} />,
      title: "Total Users",
      value: "1,234",
      color: "text-blue-500",
    },
    {
      icon: <FaUserPlus size={26} />,
      title: "Premium Users",
      value: "123",
      color: "text-emerald-500",
    },
    {
      icon: <FaMoneyBill size={26} />,
      title: "Total Revenue",
      value: "$12,345",
      color: "text-orange-500",
    },
    {
      icon: <FaPiggyBank size={26} />,
      title: "Total Payouts",
      value: "$1,234",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* HEADER SECTION */}
      <section className="flex flex-col gap-3">
        <AdminHeader title="Admin Dashboard" />

        <p className="text-sm text-gray-500">
          Welcome back! Here’s what’s happening with Genus Lab today.
        </p>
      </section>

      {/* KPI GRID */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCardsData.map((cardData, index) => (
            <Card key={index} {...cardData} />
          ))}
        </div>
      </section>

      {/* CHART SECTION */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
        {/* LINE / AREA CHART */}
        <div className="xl:col-span-2">
          <AdminCard className="h-full">
            <div className="flex flex-col gap-4">
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  User Growth
                </h2>

                <div className="flex gap-2">
                  {["Day", "Week", "Month"].map((item) => (
                    <button
                      key={item}
                      className="
                        px-3 py-1.5 text-xs sm:text-sm
                        rounded-lg
                        bg-gray-100 hover:bg-gray-200
                        text-gray-600 hover:text-gray-900
                        transition
                      "
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* CHART */}
              <div className="w-full min-h-[260px] sm:min-h-[300px]">
                {/* <PerformanceChart data={}/> */}
              </div>
            </div>
          </AdminCard>
        </div>

        {/* PIE CHART */}
        <div className="xl:col-span-1">
          <AdminCard className="h-full flex items-center justify-center">
            <div className="w-full min-h-[260px] sm:min-h-[300px] flex items-center justify-center">
              <CustomActiveShapePieChart />
            </div>
          </AdminCard>
        </div>
      </section>
    </div>
  );
};

export default page;
