"use client";

import { useId, useState } from "react";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";
import {
  inputField,
  inputLabel,
  inputShell,
  inputShellDisabled,
  inputShellError,
} from "./inputStyles";

type PasswordInputProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  autoComplete?: string;
  showRequirements?: boolean;
  className?: string;
};

const strengthMeta: Record<
  ReturnType<typeof usePasswordValidation>["strength"],
  { label: string; barClass: string }
> = {
  empty: { label: "", barClass: "bg-transparent" },
  weak: { label: "Weak", barClass: "bg-red-400" },
  fair: { label: "Fair", barClass: "bg-amber-400" },
  strong: { label: "Strong", barClass: "bg-emerald-500" },
};

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "Password",
  label,
  disabled,
  error,
  autoComplete = "new-password",
  showRequirements = true,
  className,
}: PasswordInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState(false);

  const { requirements, metCount, totalCount, strength } =
    usePasswordValidation(value);

  const meta = strengthMeta[strength];

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label htmlFor={inputId} className={inputLabel}>
          {label}
        </label>
      )}

      <div
        className={cn(
          inputShell,
          "group",
          error && inputShellError,
          disabled && inputShellDisabled,
        )}
      >
        <input
          id={inputId}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          disabled={disabled}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          className={inputField}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
          className="ml-2 shrink-0 text-gray-400 transition-colors duration-200 hover:text-gray-600"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showRequirements && (value.length > 0 || touched) && (
        <div className="mt-3 space-y-2.5">
          <div className="flex h-1 w-full gap-1 overflow-hidden rounded-full bg-gray-100">
            {Array.from({ length: totalCount }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-full flex-1 rounded-full transition-all duration-300",
                  i < metCount ? meta.barClass : "bg-transparent",
                )}
              />
            ))}
          </div>

          <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
            {requirements.map((req) => (
              <li
                key={req.id}
                className={cn(
                  "flex items-center gap-1.5 text-sm transition-colors duration-200",
                  req.met ? "text-emerald-600" : "text-gray-400",
                )}
              >
                <span
                  className={cn(
                    "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                    req.met ? "bg-emerald-500/15" : "bg-gray-100",
                  )}
                >
                  {req.met ? (
                    <Check size={9} strokeWidth={3} className="text-emerald-600" />
                  ) : (
                    <X size={9} strokeWidth={3} className="text-gray-300" />
                  )}
                </span>
                {req.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
