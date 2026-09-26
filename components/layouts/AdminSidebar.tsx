"use client";

import useSidebar from "@/store/useSidebar";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdSpaceDashboard,
  MdPeople,
  MdQuiz,
  MdEventSeat,
  MdMilitaryTech,
  MdCardMembership,
  MdReceiptLong,
  MdAccountBalance,
  MdSupportAgent,
  MdHeadsetMic,
  MdShare,
  MdNotificationsActive,
  MdOutlineDevices,
  MdSettings,
  MdAdminPanelSettings,
  MdCardGiftcard,
  MdHistory,
  MdSchool,
} from "react-icons/md";
import useAdminRole from "@/hooks/useAdminRole";

// No `roles` = visible to every staff role. Admin sees everything.
const navLinks = [
  {
    label: "Dashboard",
    href: "/genuslab/dashboard",
    icon: MdSpaceDashboard,
    roles: ["ADMIN"],
  },
  {
    label: "Users",
    href: "/genuslab/users",
    icon: MdPeople,
    roles: ["ADMIN", "ACCOUNTANT", "SUPPORT"],
  },
  { label: "Quizzes", href: "/genuslab/quizzes", icon: MdQuiz, roles: ["ADMIN"] },
  {
    label: "Studio Quizzes",
    href: "/genuslab/studio-quizzes",
    icon: MdEventSeat,
    roles: ["ADMIN"],
  },
  {
    label: "Ranks & XP",
    href: "/genuslab/ranks",
    icon: MdMilitaryTech,
    roles: ["ADMIN"],
  },
  {
    label: "Academy",
    href: "/genuslab/academy",
    icon: MdSchool,
    roles: ["ADMIN"],
  },
  {
    label: "Subscriptions",
    href: "/genuslab/subscriptions",
    icon: MdCardMembership,
    roles: ["ADMIN", "ACCOUNTANT"],
  },
  {
    label: "Transactions",
    href: "/genuslab/transactions",
    icon: MdReceiptLong,
    roles: ["ADMIN", "ACCOUNTANT"],
  },
  {
    label: "Rewards",
    href: "/genuslab/rewards",
    icon: MdCardGiftcard,
    roles: ["ADMIN", "ACCOUNTANT"],
  },
  {
    label: "Finance & Banks",
    href: "/genuslab/finance",
    icon: MdAccountBalance,
    roles: ["ADMIN", "ACCOUNTANT"],
  },
  {
    label: "Support Chats",
    href: "/genuslab/support-chats",
    icon: MdHeadsetMic,
    roles: ["ADMIN", "SUPPORT"],
  },
  {
    label: "Support Messages",
    href: "/genuslab/contacts",
    icon: MdSupportAgent,
    roles: ["ADMIN", "SUPPORT"],
  },
  {
    label: "Referrals",
    href: "/genuslab/referrals",
    icon: MdShare,
    roles: ["ADMIN"],
  },
  {
    label: "Notifications",
    href: "/genuslab/notifications",
    icon: MdNotificationsActive,
    roles: ["ADMIN"],
  },
  {
    label: "Sessions",
    href: "/genuslab/sessions",
    icon: MdOutlineDevices,
    roles: ["ADMIN"],
  },
  {
    label: "Team & Roles",
    href: "/genuslab/subadmins",
    icon: MdAdminPanelSettings,
    roles: ["ADMIN"],
  },
  {
    label: "Audit Log",
    href: "/genuslab/audit-log",
    icon: MdHistory,
    roles: ["ADMIN", "ACCOUNTANT"],
  },
  {
    label: "Settings",
    href: "/genuslab/settings",
    icon: MdSettings,
    roles: ["ADMIN"],
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const { isOpen, collapsed, toggleSidebar } = useSidebar((state) => state);
  const { role } = useAdminRole();
  const visibleLinks = navLinks.filter(
    (link) => !role || link.roles.includes(role),
  );

  return (
    <>
      {isOpen && (
        <div
          onClick={() => toggleSidebar(false)}
          className="fixed inset-0 z-30 bg-slate-950/30 md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 z-40 flex flex-col border-r border-slate-100 bg-white transition-[transform,width] duration-200 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "md:w-[76px]" : "w-64 md:w-64",
        )}
      >
        <div
          className={clsx(
            "flex items-center gap-3 px-6 py-6",
            collapsed && "md:justify-center md:px-0",
          )}
        >
          <Image
            src="/logo/genus_logo_1.png"
            alt="Genus Lab Logo"
            width={36}
            height={36}
            className="shrink-0"
          />
          <div className={clsx(collapsed && "md:hidden")}>
            <p className="text-sm font-extrabold tracking-tight text-slate-900">
              Genus Lab
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Admin Console
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {visibleLinks.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href || pathname?.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => toggleSidebar(false)}
                title={collapsed ? label : undefined}
                aria-label={label}
                className={clsx(
                  "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                  collapsed && "md:justify-center md:px-0",
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                )}
              >
                <Icon
                  size={19}
                  className={clsx(
                    "shrink-0",
                    active ? "text-blue-600" : "text-slate-400",
                  )}
                />
                <span className={clsx(collapsed && "md:hidden")}>
                  {label}
                </span>

                {/* Tooltip shown only while collapsed on desktop */}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:group-hover:block">
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
