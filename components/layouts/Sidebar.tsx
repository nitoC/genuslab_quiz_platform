import Link from "next/link";
import { IoGrid } from "react-icons/io5";
import { BsQuestionSquareFill } from "react-icons/bs";
import { FaClock, FaCompass, FaUser } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { BiSolidMessageSquareDots, BiLogOut } from "react-icons/bi";
import Logo from "../ui/Logo";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import useSidebar from "@/store/useSidebar";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { logout } from "@/lib/api/apis";

const navLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: IoGrid,
  },
  {
    label: "Quizzes",
    href: "/quizzes",
    icon: BsQuestionSquareFill,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: MdLeaderboard,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: FaClock,
  },
  {
    label: "Exploral",
    href: "/exploral",
    icon: FaCompass,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: FaUser,
  },
  {
    label: "Support",
    href: "/support",
    icon: BiSolidMessageSquareDots,
  },
];

const defaultStyle =
  "flex gap-2.5 py-4 px-7 hover:bg-blue-light rounded-md border-r-lg border-transparent hover:border-r-blue transition duration-300 text-grey hover:text-(--primary)";
const activeStyle = " bg-blue-light border-r-lg border-r-blue text-(--primary)";

const Sidebar = ({ type }: { type?: string }) => {
  const page = usePathname().split("/")[1];
  const router = useRouter();
  const { isOpen, toggleSidebar } = useSidebar((state: any) => state);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    try {
      setLoading(true);

      // Axios request to your logout server endpoint
      await logout();
      toast.success("logout successfull");
      localStorage.clear();
    } catch (error) {
      console.error(
        "Server-side logout failed, proceeding with client cleanup:",
        error,
      );
    } finally {
      // Clear user data from local storage
      // localStorage.removeItem("user");

      // Cleanly handle mobile state transitions if applicable
      if (type === "mobile") {
        toggleSidebar();
      }

      // Redirect cleanly to login screen
      router.push("/login");
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 "
          onClick={toggleSidebar}
        >
          {/* overlay */}
        </div>
      )}
      <aside
        className={clsx(
          type === "mobile"
            ? `cu-lg:hidden duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
            : "hidden cu-lg:block left-0",
          "p-8 backdrop-blur-3xl bg-[#0f127a33] md:w-fit fixed inset-b-0 h-full w-70 z-30 flex flex-col justify-between",
        )}
      >
        <div>
          <h1>{isOpen}</h1>
          <div className="py-4 px-4 flex items-center">
            <Logo />
          </div>

          <nav className="mt-4">
            <ul className="p-0 m-0 flex flex-col gap-1">
              {navLinks.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={type === "mobile" ? "#" : href}
                    onClick={(e) => {
                      if (type === "mobile") {
                        e.preventDefault();
                        toggleSidebar();
                        router.push(href);
                      }
                    }}
                    className={clsx(
                      defaultStyle,
                      "white-space-nowrap",
                      page === href.split("/")[1] && activeStyle,
                    )}
                  >
                    <Icon size={20} className="text-blue" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Pinned Professional Logout Action */}
        <div className="mt-auto border-t border-white/5 pt-4">
          <button
            onClick={handleLogout}
            disabled={loading}
            className={clsx(
              defaultStyle,
              "w-full text-left items-center whitespace-nowrap disabled:opacity-50",
            )}
          >
            <BiLogOut
              size={20}
              className={clsx("text-blue", loading && "animate-spin")}
            />
            <span>{loading ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
