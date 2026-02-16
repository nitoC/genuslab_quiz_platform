"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import GlassCard from "../cards/GlassCard";

const CustomSelect = (props: any) => {
  const [drop, setdrop] = useState(false);
  const options = props.options ?? [];
  const { onChange: handler } = props;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      setdrop(false);
    }
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative flex justify-between items-center cursor-pointer w-full h-10 rounded-sm border border-blue-300 text-white px-3 focus-within:outline-2 outline-blue-10 focus-within:outline-blue-500/10"
      onClick={(e) => {
        setdrop(!drop);
        console.log(options, "options");
        e.stopPropagation();
      }}
    >
      <label className="block text-sm font-medium text-gray-400 mb-1">
        {!props.label ? props.placeholder : props.label}
      </label>
      <div className="absolute inset-x-0 flex-col flex z-5 top-full">
        {drop && (
          <GlassCard className="bg-white-800/50 overflow-hidden rounded-md mt-1 py-1">
            {options.map((item: any, index: number) => (
              <div
                key={index}
                className="p-4 text-black hover:bg-blue-100 cursor-pointer"
                onClick={(e) => {
                  handler(item.label);
                  setdrop(false);
                  e.stopPropagation();
                }}
              >
                {item.label}
              </div>
            ))}
          </GlassCard>
        )}
      </div>
      {drop ? (
        <IoIosArrowUp className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      ) : (
        <IoIosArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      )}{" "}
    </div>
  );
};

export default CustomSelect;
