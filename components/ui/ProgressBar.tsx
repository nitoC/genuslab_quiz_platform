"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

const ProgressBar = ({
  value,
  total,
  color,
}: {
  value: number;
  total: number;
  color: string;
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setprogress] = useState(0);

  useEffect(() => {
    console.log(progressRef.current?.clientWidth, "width changed");
    setprogress((value / total) * (progressRef.current?.clientWidth || 0));
  }, [progressRef.current?.clientWidth, value, total]);

  return (
    <div
      className="w-full h-2 bg-gray-300/50 rounded-full overflow-hidden"
      ref={progressRef}
    >
      <div
        className={clsx(
          "h-full rounded-full transition-all duration-300",
          color,
        )}
        style={{ width: progress }}
      ></div>
    </div>
  );
};

export default ProgressBar;
