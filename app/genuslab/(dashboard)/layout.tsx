"use client";

import AdminSidebar from "@/components/layouts/AdminSidebar";
import AuthProvider from "@/providers/AuthProvider";
import Provider from "@/providers/QueryProvider";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "react-hot-toast";

const layout = ({ children }: { children: React.ReactNode }) => {
  // const {isLoading, isError,data} = useQuery({queryKey: ["fetchUserData"], queryFn: });

  return (
    <Provider>
      <Toaster />
      <div className="flex">
        <aside className="grow-0">
          <AdminSidebar />
        </aside>
        <section className="grow p-8">
          <AuthProvider>{children}</AuthProvider>
        </section>
      </div>
    </Provider>
  );
};

export default layout;
