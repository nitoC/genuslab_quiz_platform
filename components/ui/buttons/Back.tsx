"use client";

import { useRouter } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import GlassCard from "../cards/GlassCard";

const Back = ({ text }: { text: string }) => {
  const router = useRouter();
  return (
    <button
      className="text-white flex cursor-pointer gap-4 justify-center items-center"
      onClick={() => router.back()}
    >
      <GlassCard className="flex items-center justify-center gap-2 px-2 py-2 rounded-full w-10 h-10 bg-gray-800 hover:bg-gray-700 transition-colors duration-300">
        <IoMdArrowBack size={18} />
      </GlassCard>
      <span className="hidden md:inline-block text-lg font-semibold">
        {text}
      </span>
      {/* {text} */}
    </button>
  );
};

export default Back;
