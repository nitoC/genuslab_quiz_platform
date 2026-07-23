import clsx from "clsx";
import React from "react";

const CustomInput = (props: any) => {
  const { Icon, disabled } = props;
  const inputProps = { ...props };
  delete inputProps.Icon; // Remove Icon from input props to avoid passing it to the input element
  return (
    <div
      className={clsx(
        disabled && "pointer-events-none cursor-not-allowed",
        "w-full overflow-hidden h-10 rounded-sm border border-blue-300 text-white px-3 focus-within:outline-2 outline-blue-10 focus-within:outline-blue-500/10",
      )}
    >
      <input
        {...inputProps}
        placeholder={props.placeholder}
        className={clsx(
          disabled ? "text-gray-300" : "text-gray-800",
          "w-full h-10 px-3 border-none focus:outline-none bg-transparent",
        )}
      />
      {Icon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {Icon}
        </div>
      )}
    </div>
  );
};

export default CustomInput;
