"use client";

import { useRouter } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";

const Back = ({ text }: { text: string }) => {
  const router = useRouter();
  return (
    <button onClick={() => router.back()}>
      <IoMdArrowBack size={18} />
      {text}
    </button>
  );
};

export default Back;
