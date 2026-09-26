import { useAdminUser } from "@/store/useAdminUser";

export type AdminRole = "USER" | "ADMIN" | "SUPPORT" | "ACCOUNTANT";

// Role checks for admin UI. `role` is set on login and session restore.
const useAdminRole = () => {
  const role = useAdminUser((state) => state.user?.role);

  return {
    role,
    isAdmin: role === "ADMIN",
    isAccountant: role === "ACCOUNTANT",
    isSupport: role === "SUPPORT",
  };
};

export default useAdminRole;
