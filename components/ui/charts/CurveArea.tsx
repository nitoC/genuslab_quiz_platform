"use client";

import clsx from "clsx";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

// Mock data to match the Monday-Sunday flow in your image
const data = [
  { name: "Mon", value: 30 },
  { name: "Tue", value: 45 },
  { name: "Wed", value: 35 },
  { name: "Thu", value: 40 },
  { name: "Fri", value: 65 },
  { name: "Sat", value: 50 },
  { name: "Sun", value: 60 },
];

const PerformanceChart = ({ size }: { size?: string }) => {
  return (
    <div
      className={clsx(
        size === "sm" ? "h-40" : "h-65",
        "w-full bg-transparent p-4 rounded-xl",
      )}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            {/* This gradient creates the fade from the emerald line 
              down into the dark background.
            */}
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* XAxis matches the muted gray labels in your image */}
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: size === "sm" ? "transparent" : "#64748b",
              fontSize: 12,
            }}
            dy={15}
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
            type="monotone" // This creates the "wave" curve
            dataKey="value"
            stroke="#10b981" // Emerald green line
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#chartGradient)" // Uses the gradient defined above
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
