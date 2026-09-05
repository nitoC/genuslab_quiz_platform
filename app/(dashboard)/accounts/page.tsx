"use client";

import React, { useState } from "react";
import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import { BankAccount, IBankAccount } from "@/types/bank";
import { BankAccountCard } from "@/components/ui/cards/bank";
import { EmptyBankState } from "@/components/ui/BankEmpty";
import { LinkBankFormModal as LinkBankForm } from "@/components/ui/FormItems/LinkBankForm";
import { MdEdit, MdAdd } from "react-icons/md";
import useUser from "@/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { deleteBankAccount } from "@/lib/api/apis";
import toast from "react-hot-toast";

// Dummy account initialized to demonstrate the linked state
const DUMMY_ACCOUNT: BankAccount = {
  id: "bank-acc-1",
  bankName: "Guaranty Trust Bank (GTBank)",
  accountNumber: "0123456789",
  accountName: "Alex Morgan",
  isPrimary: true,
};

export default function ManageBankAccountsPage() {
  const [bankAccount, setBankAccount] = useState<IBankAccount | null>(null);

  const { data, isLoading, isError, refetch } = useUser();
  const [showForm, setShowForm] = useState(false);
  //   const {
  //     data: banksData,
  //     isLoading: banksLoading,
  //     isError: banksError,
  //     refetch: refetchBanks,
  //   } = useQuery({ queryKey: ["banks"], queryFn: async()=>{

  //   } });

  // Enforces a single linked account limit
  const handleSaveAccount = (newAccount: IBankAccount) => {
    setBankAccount(newAccount);
    refetch();
    setShowForm(false);
  };

  const handleRemoveAccount = async () => {
    // setBankAccount(null);
    try {
      const accounts = data?.user?.accounts ?? [];

      if (accounts.length > 0) {
        // Assuming the first account is the one to remove
        const accountIdToRemove = accounts[0]?.id;

        if (!accountIdToRemove) {
          return;
        }

        // Call your API to remove the account here
        // Example: await removeBankAccount(accountIdToRemove);
        console.log(`Removing bank account with ID: ${accountIdToRemove}`);
        // After successful removal, update the state
        await deleteBankAccount(accountIdToRemove);
        toast.success("Bank account removed successfully.");
        refetch();
        setBankAccount(null);
      }
    } catch (err) {
      console.error("Error removing bank account:", err);
      toast.error("Failed to remove bank account. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  if (isError) {
    return <div className="p-10">Error occurred while fetching user data.</div>;
  }
  console.log(data?.user, "user data in manage bank accounts page");
  const user = data?.user;
  const account = data?.user?.accounts?.[0];
  return (
    <Layout>
      <Header title="Bank Accounts" backBtn={true} />
      <div className="min-h-screen pb-20 text-slate-200">
        <div className="max-w-3xl mx-auto px-4 md:px-8 pt-6 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-white tracking-tight">
                Manage Bank Account
              </h1>
              <p className="text-xs text-slate-400">
                Connect your primary settlement account for automated payouts
                and withdrawals.
              </p>
            </div>
          </div>

          {/* Account Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Linked Account ({account ? 1 : 0})
              </h2>

              {/* Dynamic Action Button State */}
              {account ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg"
                >
                  <MdEdit size={14} />
                  <span>Update Account</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <MdAdd size={16} />
                  <span>Link Account</span>
                </button>
              )}
            </div>

            {/* Account Display or Empty View */}
            {account ? (
              <BankAccountCard
                account={account ? account : bankAccount}
                onRemove={handleRemoveAccount}
              />
            ) : (
              <EmptyBankState onLinkClick={() => setShowForm(true)} />
            )}
          </div>

          {/* Modal Layer */}
          <LinkBankForm
            isOpen={showForm}
            userName={user?.name || ""}
            onSuccess={() => handleSaveAccount(account as IBankAccount)}
            onClose={() => setShowForm(false)}
          />
        </div>
      </div>
    </Layout>
  );
}
