import React from "react";

const AdminCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`shadow/10 p-8 rounded ${className || ""}`}>{children}</div>
  );
};

export default AdminCard;
