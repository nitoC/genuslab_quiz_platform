import clsx from "clsx";
import React from "react";
import {
  inputField,
  inputLabel,
  inputShell,
  inputShellDisabled,
  inputShellError,
} from "./inputStyles";

const CustomInput = (props: any) => {
  const { Icon, disabled, error, label, className } = props;
  const inputProps = { ...props };
  delete inputProps.Icon;
  delete inputProps.error;
  delete inputProps.label;
  delete inputProps.className;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id} className={inputLabel}>
          {label}
        </label>
      )}
      <div
        className={clsx(
          inputShell,
          error && inputShellError,
          disabled && inputShellDisabled,
          className,
        )}
      >
        <input
          {...inputProps}
          placeholder={props.placeholder}
          className={inputField}
        />
        {Icon && <div className="ml-2 shrink-0 text-gray-400">{Icon}</div>}
      </div>
    </div>
  );
};

export default CustomInput;
