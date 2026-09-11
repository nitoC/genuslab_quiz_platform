import Link from "next/link";
import React from "react";

interface IButton {
  text: string;
  handler?: () => void;
  url?: string;
  Icon?: any;
  type?: "link" | "button";
}

const Button = ({ text, handler, Icon, type, url }: IButton) => {
  if (type === "button") {
    return (
      <button
        className={`py-[.6rem] font-bold rounded-lg px-7.5 cursor-pointer transition duration-500 ease-in-out btn-animated-gradient bg-linear-to-r from-white to-blue/30 text-blue flex items-center gap-1.5 justify-around`}
        onClick={handler}
      >
        <span>{text}</span>
        {Icon && Icon}
      </button>
    );
  }
  return (
    <Link
      className={`py-[.6rem] font-bold rounded-lg px-7.5 cursor-pointer transition duration-500 ease-in-out btn-animated-gradient bg-linear-to-r from-white to-blue/30 text-blue flex items-center gap-1.5 justify-around`}
      href={url ?? "/signin"}
    >
      <span>{text}</span>
      {Icon && Icon}
    </Link>
  );
};

export default Button;
