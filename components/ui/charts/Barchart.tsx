"use client";
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

const data = [
  { value: 20 },
  { value: 35 },
  { value: 55 },
  { value: 65 },
  { value: 85 },
  { value: 75 },
  { value: 100 },
];

export default function GradientBarChart() {
  return (
    <div className="w-full h-64 bg-[#050B1A] flex items-end justify-center p-6 rounded-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>
            <Bar
              dataKey="value"
              radius={[8, 8, 8, 8]}
              barSize={40}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === data.length - 1 ? "#3B82F6" : "url(#barGradient)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
