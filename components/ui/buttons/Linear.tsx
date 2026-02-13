import React from "react";

interface IButton {
  text: string;
  handler: () => void;
  Icon?: any;
}

const Button = ({ text, handler, Icon }: IButton) => {
  return (
    <button
      className={`py-[.6rem] font-bold rounded-[32px] px-7.5 cursor-pointer transition duration-500 ease-in-out btn-animated-gradient bg-linear-to-r from-white to-blue/30 text-blue flex items-center gap-1.5 justify-around`}
      onClick={handler}
    >
      <span>{text}</span>
      {Icon && Icon}
    </button>
  );
};

export default Button;
