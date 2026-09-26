"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi";

const TABS = [
  { label: "Demo Questions", href: "/genuslab/quizzes/create-quiz/json/questions" },
  { label: "Bulk Live Quiz Creator", href: "/genuslab/quizzes/create-quiz/json/live" },
];

// Tabs to switch between the JSON builder pages.
export default function BuilderNavTabs() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="/genuslab/quizzes/create-quiz"
        className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <HiOutlineArrowLeft size={16} />
        Quiz Builders
      </Link>
      <span className="text-slate-300">/</span>
      <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                active
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
