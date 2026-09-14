"use client";

import AdminSidebar from "@/components/layouts/AdminSidebar";
import AdminTopbar from "@/components/layouts/AdminTopbar";
import AuthProvider from "@/providers/AuthProvider";
import Provider from "@/providers/QueryProvider";
import React from "react";
import { Toaster } from "react-hot-toast";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <Toaster />
      <div className="flex min-h-screen flex-col">
        <AdminTopbar />
        <div className="flex flex-1">
          <AdminSidebar />
          <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-[1440px]">
              <AuthProvider>{children}</AuthProvider>
            </div>
          </section>
        </div>
      </div>
    </Provider>
  );
};

export default layout;
