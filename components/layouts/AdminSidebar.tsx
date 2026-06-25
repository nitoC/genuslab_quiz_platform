import Image from "next/image";
import Link from "next/link";
import React from "react";

const AdminSidebar = () => {
  return (
    <div className="flex flex-col gap-4">
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
  );
};

export default AdminSidebar;
