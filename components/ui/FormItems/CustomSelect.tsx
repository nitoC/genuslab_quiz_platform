"use client";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { inputShell, inputShellDisabled } from "./inputStyles";

const CustomSelect = (props: any) => {
  const [drop, setDrop] = useState(false);
  const options = props.options ?? [];
  const { onChange: handler, disabled } = props;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setDrop(false);
      }
    }
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={clsx(
        inputShell,
        disabled && inputShellDisabled,
        drop && "border-blue-500 ring-4 ring-blue-500/10",
        "relative cursor-pointer justify-between select-none",
      )}
      onClick={(e) => {
        setDrop(!drop);
        e.stopPropagation();
      }}
    >
      <span
        className={clsx(
          "truncate text-[15px]",
          props.label ? "text-gray-800" : "text-gray-400",
        )}
      >
        {!props.label ? props.placeholder : props.label}
      </span>

      {drop && (
        <div className="animate-fadeIn absolute inset-x-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl shadow-black/10">
          <div className="menu-scrollbar max-h-56 overflow-y-auto">
            {options.map((item: any, index: number) => {
              const isSelected = item.label === props.label;
              return (
                <div
                  key={index}
                  className={clsx(
                    "flex items-center justify-between gap-2 px-4 py-2.5 text-[15px] transition-colors duration-150",
                    isSelected
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                  onClick={(e) => {
                    handler(item.label);
                    setDrop(false);
                    e.stopPropagation();
                  }}
                >
                  <span className="truncate">{item.label}</span>
                  {isSelected && (
                    <Check size={16} strokeWidth={2.5} className="shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ChevronDown
        size={18}
        className={clsx(
          "shrink-0 text-gray-400 transition-transform duration-200",
          drop && "rotate-180",
        )}
      />
    </div>
  );
};

export default CustomSelect;
