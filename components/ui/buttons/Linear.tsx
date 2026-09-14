import clsx from "clsx";
import Link from "next/link";
import React from "react";

interface IButton {
  text: string;
  handler?: () => void;
  url?: string;
  Icon?: any;
  type?: "link" | "button";
  style?: string;
}

const Button = ({ text, handler, Icon, type, url, style }: IButton) => {
  if (type === "button") {
    return (
      <button
        className={clsx(
          `py-[.6rem] font-bold rounded-lg px-7.5 cursor-pointer transition duration-500 ease-in-out btn-animated-gradient bg-linear-to-r from-white to-blue/30 text-blue flex items-center gap-1.5 justify-around`,
          style,
        )}
        onClick={handler}
      >
        <span>{text}</span>
        {Icon && Icon}
      </button>
    );
  }
  return (
    <Link
      className={clsx(
        `py-[.6rem] font-bold rounded-lg px-7.5 cursor-pointer transition duration-500 ease-in-out btn-animated-gradient bg-linear-to-r from-white to-blue/30 text-blue flex items-center gap-1.5 justify-around`,
        style,
      )}
      href={url ?? "/login"}
    >
      <span>{text}</span>
      {Icon && Icon}
    </Link>
  );
};

export default Button;
