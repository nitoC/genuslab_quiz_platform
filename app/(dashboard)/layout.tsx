"";
import { cookies } from "next/headers";
import React from "react";

const dashLayout = async ({ children }: { children: React.ReactNode }) => {
  const theme = (await cookies()).get("theme")?.value ?? "dark";
  return (
    <>
      <div className="flex-2" data-theme={theme}>
        {children}
      </div>
    </>
  );
};

export default dashLayout;
