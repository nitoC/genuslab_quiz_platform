import React from "react";

const AdminHeader = ({ title }: { title: string }) => {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;
