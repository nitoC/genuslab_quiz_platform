// Turns an axios error from an auth call into a sentence a user can act on,
// instead of "Request failed with status code 401".
type Context = "login" | "adminLogin" | "signup" | "forgot" | "reset" | "changePassword";

const tidy = (s: string) => {
  const t = s.trim().replace(/\.$/, "");
  return t ? t.charAt(0).toUpperCase() + t.slice(1) + "." : "";
};

// Backend 400s: { message: string | string[] } from Nest validation.
const serverMessage = (data: any): string => {
  const m = data?.message;
  if (Array.isArray(m)) return tidy(String(m[0] ?? ""));
  return typeof m === "string" ? tidy(m) : "";
};

export function authErrorMessage(err: any, context: Context): string {
  if (!err?.response) {
    return "Can't reach the server. Check your internet connection and try again.";
  }
  const status: number = err.response.status;
  const data = err.response.data;
  const raw = String(data?.message ?? "").toLowerCase();

  if (status === 429) return "Too many attempts. Please wait a minute and try again.";
  if (status >= 500) return "Something went wrong on our side. Please try again in a moment.";

  switch (context) {
    case "login":
    case "adminLogin":
      if (status === 403 && raw.includes("suspended"))
        return "This account has been suspended. Please contact support.";
      if (status === 401 && raw.includes("only admin"))
        return "This account doesn't have access to the admin console.";
      if (status === 401) return "Email or password is incorrect.";
      if (status === 400) return "Enter a valid email and password.";
      break;
    case "signup":
      if (status === 409) return "An account with this email already exists. Please log in instead.";
      if (status === 404 && raw.includes("ref")) return "That referral code doesn't exist. Check it or leave it empty.";
      if (status === 400) return serverMessage(data) || "Some details are missing or invalid. Please check the form.";
      break;
    case "forgot":
      if (status === 400) return "Enter a valid email address.";
      break;
    case "reset":
      if (status === 403 || status === 404)
        return "This reset link is invalid or has expired. Please request a new one.";
      if (status === 400) return serverMessage(data) || "Please choose a stronger password.";
      break;
    case "changePassword":
      if (status === 403) return "Your current password is incorrect.";
      if (status === 401) return "Your session has ended. Please log in again.";
      if (status === 400) return serverMessage(data) || "Please choose a stronger password.";
      break;
  }
  return serverMessage(data) || "Something went wrong. Please try again.";
}
