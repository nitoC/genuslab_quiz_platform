import clsx from "clsx";

const ProgressBar = ({
  value,
  total,
  color,
}: {
  value: number;
  total: number;
  color: string;
}) => {
  const percent = total > 0 ? Math.min(100, Math.max(0, (value / total) * 100)) : 0;

  return (
    <div
      className="w-full h-2 bg-white/10 rounded-full overflow-hidden"
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={clsx("h-full rounded-full transition-all duration-500", color)}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
