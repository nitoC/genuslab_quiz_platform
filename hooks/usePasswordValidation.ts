import { useMemo } from "react";

export type PasswordRequirement = {
  id: string;
  label: string;
  met: boolean;
};

export type PasswordValidation = {
  requirements: PasswordRequirement[];
  metCount: number;
  totalCount: number;
  isValid: boolean;
  strength: "empty" | "weak" | "fair" | "strong";
};

const RULES: { id: string; label: string; test: (value: string) => boolean }[] = [
  { id: "length", label: "At least 6 characters", test: (v) => v.length >= 6 },
  { id: "lowercase", label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { id: "uppercase", label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { id: "number", label: "One number", test: (v) => /\d/.test(v) },
  {
    id: "special",
    label: "One special character",
    test: (v) => /[@$!%*?#&^()[\]{}]/.test(v),
  },
];

export function usePasswordValidation(password: string): PasswordValidation {
  return useMemo(() => {
    const requirements = RULES.map((rule) => ({
      id: rule.id,
      label: rule.label,
      met: rule.test(password),
    }));

    const metCount = requirements.filter((r) => r.met).length;
    const totalCount = requirements.length;
    const isValid = metCount === totalCount;

    let strength: PasswordValidation["strength"] = "empty";
    if (password.length > 0) {
      if (metCount <= 2) strength = "weak";
      else if (metCount <= 4) strength = "fair";
      else strength = "strong";
    }

    return { requirements, metCount, totalCount, isValid, strength };
  }, [password]);
}
