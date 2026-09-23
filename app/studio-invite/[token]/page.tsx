"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GlassCard from "@/components/ui/cards/GlassCard";
import PageLoader from "@/components/ui/PageLoader";
import toast from "react-hot-toast";
import {
  MdCheckCircle,
  MdCancel,
  MdEventSeat,
  MdCalendarToday,
} from "react-icons/md";
import {
  getStudioQuizInviteByToken,
  acceptStudioQuizInvite,
  declineStudioQuizInvite,
} from "@/lib/api/apis";

export default function StudioInvitePage() {
  const { token } = useParams<{ token: string }>();
  const queryClient = useQueryClient();

  const {
    data: invite,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["studio-quiz-invite", token],
    enabled: !!token,
    queryFn: async () => {
      const res = await getStudioQuizInviteByToken(token);
      return res?.data?.payload;
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => acceptStudioQuizInvite(token),
    onSuccess: () => {
      toast.success("Invite accepted — you're confirmed!");
      queryClient.invalidateQueries({
        queryKey: ["studio-quiz-invite", token],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to accept invite.");
    },
  });

  const declineMutation = useMutation({
    mutationFn: () => declineStudioQuizInvite(token),
    onSuccess: () => {
      toast.success("Invite declined.");
      queryClient.invalidateQueries({
        queryKey: ["studio-quiz-invite", token],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to decline invite.",
      );
    },
  });

  if (isLoading) return <PageLoader theme="dark" label="Loading invite..." />;

  if (isError || !invite) {
    return (
      <main
        data-theme="dark"
        className="min-h-screen w-full bg-(--background-dark-primary) flex items-center justify-center p-4"
      >
        <GlassCard className="w-full max-w-md p-8 text-center">
          <p className="text-lg font-bold text-(--primary)">Invite not found</p>
          <p className="mt-2 text-sm text-grey">
            This invite link is invalid or has expired.
          </p>
        </GlassCard>
      </main>
    );
  }

  const quiz = invite.studioQuiz;
  const status: string = invite.inviteStatus;

  return (
    <main
      data-theme="dark"
      className="min-h-screen w-full bg-(--background-dark-primary) flex items-center justify-center p-4"
    >
      <GlassCard className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue/10 border border-blue/20 text-blue">
            <MdEventSeat size={28} />
          </span>

          <div>
            <h1 className="text-xl font-bold text-(--primary)">
              You're invited to {quiz?.title || "the Studio Quiz"}
            </h1>
            {quiz?.scheduledAt && (
              <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-grey">
                <MdCalendarToday size={14} />
                {new Date(quiz.scheduledAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
          </div>

          {status === "ACCEPTED" ? (
            <p className="flex items-center gap-2 text-green text-sm font-semibold">
              <MdCheckCircle size={18} /> You've accepted this invite.
            </p>
          ) : status === "DECLINED" ? (
            <p className="flex items-center gap-2 text-red text-sm font-semibold">
              <MdCancel size={18} /> You've declined this invite.
            </p>
          ) : status === "WITHDRAWN" ? (
            <p className="flex items-center gap-2 text-grey text-sm font-semibold">
              <MdCancel size={18} /> This invitation was withdrawn by the
              organizer.
            </p>
          ) : status === "EXPIRED" ? (
            <p className="flex items-center gap-2 text-grey text-sm font-semibold">
              <MdCancel size={18} /> This invitation has expired.
            </p>
          ) : (
            <>
              <p className="text-sm text-grey">
                Congratulations on topping last month's leaderboard! Accept
                below to confirm your spot in this studio quiz session.
              </p>
              <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={
                    acceptMutation.isPending || declineMutation.isPending
                  }
                  onClick={() => acceptMutation.mutate()}
                  className="flex-1 rounded-lg bg-blue px-4 py-3 text-sm font-bold text-white hover:bg-blue/90 disabled:opacity-50"
                >
                  {acceptMutation.isPending
                    ? "Accepting..."
                    : "Accept Invitation"}
                </button>
                <button
                  type="button"
                  disabled={
                    acceptMutation.isPending || declineMutation.isPending
                  }
                  onClick={() => declineMutation.mutate()}
                  className="flex-1 rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm font-bold text-grey hover:bg-white/10 disabled:opacity-50"
                >
                  {declineMutation.isPending ? "Declining..." : "Decline"}
                </button>
              </div>
            </>
          )}
        </div>
      </GlassCard>
    </main>
  );
}
