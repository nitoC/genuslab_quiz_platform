"use client";
import { IoIosNotifications, IoMdMenu } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import Back from "../ui/buttons/Back";
// import Image from "next/image";
import ImageWithFallback from "../ui/ImageWithFallback";
import GlassCard from "../ui/cards/GlassCard";
import clsx from "clsx";
import useSidebar from "@/store/useSidebar";
import Link from "next/link";

const Header = ({ title, backBtn }: { title?: string; backBtn: boolean }) => {
  const toggleSidebar = useSidebar((state: any) => state.toggleSidebar);
  return (
    <div className=" sticky top-0 z-10">
      <GlassCard type="header">
        <div
          className={clsx(
            "w-full flex p-6 items-center",
            title ? "justify-between" : "justify-end",
          )}
        >
          <h2 className="text-(--primary) font-bold">{title}</h2>
          <div className="flex gap-4 items-center">
            {backBtn && <Back text="Back" />}
            <div className="flex gap-4 md:gap-8 items-center">
              <Link href="/notifications" className="relative">
                <IoIosNotifications size={30} className="text-(--primary)" />
                <LuDot
                  size={40}
                  className="text-red absolute top-[-.8rem] right-[-.8rem]"
                />
              </Link>
              <div className="avatar-header">
                <ImageWithFallback rounded={true} />
              </div>
              <button
                onClick={toggleSidebar}
                className=" cursor-pointer cu-lg:hidden"
              >
                <IoMdMenu size={30} className="text-(--primary)" />
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Header;
