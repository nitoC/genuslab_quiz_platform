"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AdminCard from "@/components/ui/cards/AdminCard";
import Badge from "@/components/ui/Badge";
import { getAdminReferralById } from "@/lib/api/apis";
import { MdArrowBack, MdShare } from "react-icons/md";

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between border-b border-slate-50 py-2.5 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="max-w-[60%] truncate text-sm font-semibold text-slate-800">
      {value}
    </span>
  </div>
);

export default function ReferralDetailPage() {
  const { referralId } = useParams<{ referralId: string }>();

  const { data: referral, isLoading, isError } = useQuery({
    queryKey: ["admin-referral-detail", referralId],
    enabled: !!referralId,
    queryFn: async () => {
      const res = await getAdminReferralById(referralId);
      return res?.data?.payload;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (isError || !referral) {
    return (
      <AdminCard className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-semibold text-slate-700">
          Unable to load this referral
        </p>
        <p className="text-sm text-slate-400">
          It may not exist, or something went wrong fetching it.
        </p>
        <Link
          href="/genuslab/referrals"
          className="mt-2 text-sm font-bold text-blue-600 hover:underline"
        >
          Back to Referrals
        </Link>
      </AdminCard>
    );
  }

  const totalReward = (referral.rewards ?? []).reduce(
    (sum: number, r: any) => sum + Number(r.value),
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/genuslab/referrals"
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
      >
        <MdArrowBack size={16} /> Back to Referrals
      </Link>

      <AdminCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MdShare size={24} />
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                {referral.name}
              </h1>
              <p className="text-sm text-slate-500">{referral.email}</p>
            </div>
          </div>

          <Badge status={referral.verified ? "success" : "warning"}>
            {referral.verified ? "Verified" : "Pending"}
          </Badge>
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
            Referred Person
          </h2>
          <InfoRow label="Name" value={referral.name} />
          <InfoRow label="Email" value={referral.email} />
          <InfoRow
            label="Verified"
            value={referral.verified ? "Yes" : "Not yet"}
          />
          <InfoRow label="Referred on" value={formatDate(referral.createdAt)} />
        </AdminCard>

        <AdminCard>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
            Referrer
          </h2>
          <InfoRow label="Name" value={referral.referrer?.name ?? "—"} />
          <InfoRow label="Email" value={referral.referrer?.email ?? "—"} />
          <InfoRow
            label="Referral code"
            value={referral.referrer?.referralCode ?? "—"}
          />
          <InfoRow
            label="Acquisition source"
            value={referral.referrer?.referrer ?? "Unknown"}
          />
          {referral.referrer?.id && (
            <div className="mt-4">
              <Link
                href={`/genuslab/users/${referral.referrer.id}`}
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                View referrer&apos;s profile →
              </Link>
            </div>
          )}
        </AdminCard>
      </div>

      <AdminCard>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
          Rewards
        </h2>
        {!referral.rewards?.length ? (
          <p className="text-sm text-slate-400">
            No rewards have been issued for this referral yet.
          </p>
        ) : (
          <>
            <InfoRow
              label="Total reward value"
              value={`₦${totalReward.toLocaleString()}`}
            />
            <div className="mt-3 divide-y divide-slate-50">
              {referral.rewards.map((r: any) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between py-2.5"
                >
                  <span className="text-sm text-slate-600">
                    ₦{Number(r.value).toLocaleString()}
                  </span>
                  <Badge status={r.claimed ? "success" : "warning"}>
                    {r.claimed ? "Claimed" : "Unclaimed"}
                  </Badge>
                </div>
              ))}
            </div>
          </>
        )}
      </AdminCard>
    </div>
  );
}
