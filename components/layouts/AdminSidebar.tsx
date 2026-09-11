"use client";

import useSidebar from "@/store/useSidebar";
import { useUser as useUserStore } from "@/store/useUser";
import { logout } from "@/lib/api/apis";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  MdSpaceDashboard,
  MdPeople,
  MdQuiz,
  MdOutlineDevices,
  MdReceiptLong,
  MdSettings,
  MdLogout,
} from "react-icons/md";

const navLinks = [
  { label: "Dashboard", href: "/genuslab/dashboard", icon: MdSpaceDashboard },
  { label: "Users", href: "/genuslab/users", icon: MdPeople },
  { label: "Quizzes", href: "/genuslab/quizzes", icon: MdQuiz },
  { label: "Sessions", href: "/genuslab/sessions", icon: MdOutlineDevices },
  {
    label: "Transactions",
    href: "/genuslab/transactions",
    icon: MdReceiptLong,
  },
  { label: "Settings", href: "/genuslab/settings", icon: MdSettings },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, toggleSidebar } = useSidebar((state: any) => state);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      // ignore — proceed with client-side cleanup regardless
    } finally {
      useUserStore.setState({ user: null });
      router.push("/genuslab/admin");
      setLoggingOut(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={() => toggleSidebar(false)}
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 z-40 flex w-64 flex-col border-r border-slate-100 bg-white transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 px-6 py-6">
          <Image
            src="/logo/genus_logo_1.png"
            alt="Genus Lab Logo"
            width={36}
            height={36}
          />
          <div>
            <p className="text-sm font-extrabold tracking-tight text-slate-900">
              Genus Lab
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Admin Console
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href || pathname?.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => toggleSidebar(false)}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                )}
              >
                <Icon
                  size={19}
                  className={active ? "text-blue-600" : "text-slate-400"}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <MdLogout size={19} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
