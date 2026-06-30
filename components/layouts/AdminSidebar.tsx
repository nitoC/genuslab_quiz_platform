"use client";

import useSidebar from "@/store/useSidebar";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const AdminSidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar((state: any) => state);

  useEffect(() => {
    console.log(isOpen, "isopen");
  });
  return (
    <>
      {isOpen && (
        <div
          onClick={() => toggleSidebar(false)}
          className="inset-0 md:hidden fixed z-18 bg-black/20"
        ></div>
      )}
      <div
        className={clsx(
          "flex bg-white inset-y-0 w-50 md:w-40 fixed md:static flex-col gap-4 z-20",
          isOpen ? "left-0" : "-left-full",
        )}
      >
        <p>{isOpen}</p>
        <div className="flex p-8 justify-center">
          <Image
            src="/logo/genus_logo_1.png"
            alt="Genus Lab Logo"
            width={50}
            height={25}
          />
        </div>
        <Link
          href="/genuslab/dashboard"
          className="block px-8 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          Dashboard
        </Link>
        <Link
          href="/genuslab/users"
          className="block px-8 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          Users
        </Link>
        <Link
          href="/genuslab/quizzes"
          className="block px-8 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          Quizzes
        </Link>
        <Link
          href="/genuslab/sessions"
          className="block px-8 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          Sessions
        </Link>
        <Link
          href="/genuslab/transactions"
          className="block px-8 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          Transactions
        </Link>
        <Link
          href="/genuslab/settings"
          className="block px-8 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          Settings
        </Link>
      </div>
    </>
  );
};

export default AdminSidebar;
