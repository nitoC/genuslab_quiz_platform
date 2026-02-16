"use client";
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { value: 10 },
  { value: 20 },
  { value: 35 },
  { value: 40 },
  { value: 50 },
  { value: 45 },
  { value: 60 },
];

// Colors extracted from your image (dark teal to bright blue)
const colors = [
  "#132b3d", // Darkest teal
  "#174d63",
  "#1a6b85",
  "#1d86a3",
  "#22a1bd",
  "#29b2cf",
  "#448fff", // Bright blue highlight
];

const CustomCardChart = () => {
  return (
    <div
      style={{
        backgroundColor: "transparent",
        padding: "20px",
        borderRadius: "12px",
        width: "400px",
      }}
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Bar
            dataKey="value"
            radius={[4, 4, 4, 4]} // Provides the rounded corners seen in the image
            barSize={45} // Adjust spacing
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomCardChart;
