"use client";

import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import ApprovedBanksPanel from "@/components/admin/ApprovedBanksPanel";

const AdminSettingsPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Settings"
        subtitle="Manage platform-level configuration."
      />

      <ApprovedBanksPanel />
    </div>
  );
};

export default AdminSettingsPage;
