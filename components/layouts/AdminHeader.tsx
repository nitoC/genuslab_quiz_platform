"use client";
import useSidebar from "@/store/useSidebar";
import React from "react";
import { MdMenu } from "react-icons/md";

const AdminHeader = ({ title }: { title: string }) => {
  const { toggleSidebar, isOpen } = useSidebar((state) => state) as {
    toggleSidebar: (isOpen?: boolean) => void;
    isOpen: any;
  };
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <button className="bg-blue-500 hidden md:inline-block hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
      <button
        onClick={() => {
          console.log(isOpen);
          toggleSidebar(true);
        }}
        className="p-8 inline-block md:hidden"
      >
        <MdMenu size={23} />
      </button>
    </header>
  );
};

export default AdminHeader;
