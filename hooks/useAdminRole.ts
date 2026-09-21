import { useUser } from "@/store/useUser";

export type AdminRole = "USER" | "ADMIN" | "SUPPORT" | "ACCOUNTANT";

// Central place for role-gating admin UI. Session restore (on refresh) and
// login both populate `role` on the stored user, so this is available as
// soon as the admin shell mounts — no extra fetch needed.
const useAdminRole = () => {
  const role = useUser((state) => state.user?.role);

  return {
    role,
    isAdmin: role === "ADMIN",
    isAccountant: role === "ACCOUNTANT",
    isSupport: role === "SUPPORT",
  };
};

export default useAdminRole;
