import AdminHeader from "@/components/layouts/AdminHeader";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AdminHeader title="Quiz Management" />
      {children}
    </>
  );
};

export default layout;
