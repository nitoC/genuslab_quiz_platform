"use client";
import useSidebar from "@/store/useSidebar";
import React from "react";
import { MdMenu } from "react-icons/md";

const AdminHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  const { toggleSidebar } = useSidebar((state) => state) as {
    toggleSidebar: (isOpen?: boolean) => void;
  };

  return (
    <header className="flex h-16 items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>

      <button
        type="button"
        onClick={() => toggleSidebar(true)}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
        aria-label="Open menu"
      >
        <MdMenu size={22} />
      </button>
    </header>
  );
};

export default AdminHeader;
