"use client";

import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import useUser from "@/hooks/useUser";
import SettingsView from "@/features/settings/ui/Settings";

const Skeleton = ({ className = "" }: { className?: string }) => {
  return <div className={`animate-pulse rounded-xl bg-white/10 ${className}`} />;
};

const SettingsSkeleton = () => {
  return (
    <Layout>
      <Header title="Settings" backBtn={false} />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden lg:flex">
          <div className="lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 p-3 lg:p-5 flex lg:flex-col gap-1.5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 w-full lg:w-full" />
            ))}
          </div>
          <div className="flex-1 p-6 sm:p-8 space-y-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const SettingsPage = () => {
  const { data, isLoading, storedUser } = useUser();
  const user = data?.user;

  if (isLoading || !storedUser || !data?.user) {
    return <SettingsSkeleton />;
  }

  return (
    <Layout>
      <Header title="Settings" backBtn={false} />
      <SettingsView user={user} />
    </Layout>
  );
};

export default SettingsPage;
