"use client";

import clsx from "clsx";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const PerformanceChart = ({
  size,
  data,
}: {
  size?: string;
  data: { name: string; value: number }[];
}) => {
  const isSmall = size === "sm";

  return (
    <div
      className={clsx(
        isSmall ? "h-40 p-2" : "h-65 p-4",
        "w-full rounded-xl bg-transparent",
      )}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: isSmall ? 5 : 10,
            left: isSmall ? -15 : 0,
            bottom: isSmall ? 5 : 10,
          }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#64748b",
              fontSize: isSmall ? 10 : 12,
            }}
            dy={isSmall ? 5 : 15}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#chartGradient)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
