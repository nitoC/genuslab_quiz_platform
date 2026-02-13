import React from "react";
import { AiFillDollarCircle } from "react-icons/ai";
import { MdShield } from "react-icons/md";

const ShieldIcon = () => {
  return (
    <div className="w-20 h-20 p-3 rounded-full text-yellow isolate relative flex items-center justify-center bg-yellow/10">
      <AiFillDollarCircle size={20} className="absolute z-10 top-0 right-0" />
      <MdShield size={34} className="" />
    </div>
  );
};

export default ShieldIcon;
