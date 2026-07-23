import GlassCard from "@/components/ui/cards/GlassCard";
// import React from 'react'
import { MdContentCopy, MdGroups } from "react-icons/md";
import PrimaryButton from "@/components/ui/buttons/Primary";
import { useState } from "react";
import toast from "react-hot-toast";

const ShareCard = ({ user }: { user: any }) => {
  const [clipBoard, setclipBoard] = useState(false);
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("in handle copy");
      setclipBoard(true);
    } catch (err) {
      console.log(err);
      toast.error("oops! an error occured");
    } finally {
      setclipBoard(false);
    }
  };

  return (
    <GlassCard className="p-8 flex flex-col items-center text-center gap-4">
      <div className="w-12 h-12 bg-blue/20 rounded-full flex items-center justify-center">
        <MdGroups className="text-blue text-xl" />
      </div>
      <div>
        <h3 className="text-(--primary) font-bold">Invite Friends</h3>
        <p className="text-grey text-xs mt-2">
          Earn ₦1000 for every friend who joins using your unique code.
        </p>
      </div>
      <div className="w-full bg-white/5 p-3 rounded-lg flex justify-between items-center border border-white/5">
        <span className="text-blue font-mono">
          {user?.referralCode?.toUpperCase()}
        </span>
        <button
          onClick={() => {
            handleCopy(user?.referralCode);
            toast.success("referral Code copied!");
          }}
        >
          <MdContentCopy className="text-grey cursor-pointer hover:text-white" />
        </button>
      </div>
      <PrimaryButton
        handler={() => {
          const baseUrl = window.location.origin;
          console.log(`${baseUrl + "/signup?"}ref=${user?.referralCode}`);
          const refLink = `${baseUrl + "/signup?"}ref=${user?.referralCode}`;
          handleCopy(refLink);
          toast.success("referral link copied!");
        }}
        text="Share Link"
        style="w-full bg-white rounded-sm text-black font-bold"
      />
    </GlassCard>
  );
};

export default ShareCard;
