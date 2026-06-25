import {
  Pie,
  PieChart,
  Sector,
  PieSectorDataItem,
  Tooltip,
  TooltipIndex,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Premium",
    value: 400,
    color: "green",
    description: "Premium Users",
  },
  {
    name: "Demo",
    value: 3000,
    color: "crimson",
    description: "Demo Users",
  },
];

/**
 * CENTER HOVER RENDER (NO OUTSIDE LABELS)
 */
const renderActiveShape = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  payload,
  value,
  percent,
}: PieSectorDataItem) => {
  return (
    <g>
      {/* ACTIVE SEGMENT */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.color}
      />

      {/* OUTER HIGHLIGHT RING */}
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 3}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={payload.color}
      />

      {/* CENTER LABEL: NAME */}
      <text
        x={cx}
        y={(cy ?? 0) - 18}
        textAnchor="middle"
        fill="#111827"
        fontSize={16}
        fontWeight={700}
      >
        {payload.name}
      </text>

      {/* CENTER VALUE */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        fill={payload.color}
        fontSize={14}
        fontWeight={800}
      >
        {value}
      </text>

      {/* CENTER PERCENT */}
      <text
        x={cx}
        y={(cy ?? 0) + 26}
        textAnchor="middle"
        fill="#6B7280"
        fontSize={12}
        fontWeight={500}
      >
        {`${((percent ?? 0) * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};

export default function CustomActiveShapePieChart({
  isAnimationActive = true,
  // defaultIndex = 0,
}: {
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
}) {
  return (
    <div
      style={{
        width: "100%",
        minWidth: 300,
        height: 340,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1 }}>
        <ResponsiveContainer>
          <PieChart
            margin={{
              top: 40,
              right: 40,
              bottom: 20,
              left: 40,
            }}
          >
            <Pie
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="75%"
              dataKey="value"
              labelLine={false}
              isAnimationActive={isAnimationActive}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            {/* tooltip disabled visually but keeps interaction system alive */}
            <Tooltip content={() => null} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND / DESCRIPTIONS */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "24px",
          marginTop: "12px",
          flexWrap: "wrap",
        }}
      >
        {data.map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: item.color,
              }}
            />

            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              {item.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
