"use client";

import AdminHeader from "@/components/layouts/AdminHeader";
import AdminQuiz from "@/components/ui/cards/AdminQuiz";
import Link from "next/link";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

const page = () => {
  const [active, setActive] = useState("All Quizzes");
  const tabs = [
    { name: "All Quizzes", href: "#", current: true },
    { name: "Drafts", href: "#", current: false },
    { name: "Archived", href: "#", current: false },
    { name: "Demo Quizzes", href: "#", current: false },
    { name: "Live Quizzes", href: "#", current: false },
  ];
  return (
    <div>
      {/* HEADER SECTION */}
      <section className="flex flex-col gap-3">
        {/* <AdminHeader title="Quiz Management" /> */}

        {/* <p className="text-sm text-gray-500">
          Welcome back! Here’s what’s happening with Genus Lab today.
        </p> */}
      </section>
      <div className="p-8 flex justify-between items-center">
        <div>
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActive(tab.name)}
              className={`px-3 cursor-pointer py-2 text-sm font-medium rounded ${
                active === tab.name
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <Link
          href="/genuslab/quizzes/create-quiz"
          className="flex w-full max-w-50 border rounded-sm hover:bg-gray-100 transition duration-75 font-bold py-2 px-4 text-gray-500 items-center justify-center gap-2 border-2 border-gray-300"
        >
          <FaPlus /> Create New Quiz
        </Link>
      </div>
      <div className="w-full h-px bg-gray-200" />
      <div className="p-8"></div>
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AdminQuiz
            badge="New"
            day={1}
            title="Introduction to Biology"
            description="Test your knowledge on the basics of Tech, including Networking, computer basics, and software."
            questions={10}
            attempts={1500}
            completionRate={85}
          />
          <AdminQuiz
            badge="New"
            day={1}
            title="Introduction to Biology"
            description="Test your knowledge on the basics of biology, including cell structure, genetics, and evolution."
            questions={10}
            attempts={1500}
            completionRate={85}
          />
          <AdminQuiz
            badge="New"
            day={1}
            title="Introduction to Biology"
            description="Test your knowledge on the basics of biology, including cell structure, genetics, and evolution."
            questions={10}
            attempts={1500}
            completionRate={85}
          />
          <AdminQuiz
            badge="New"
            day={1}
            title="Introduction to Biology"
            description="Test your knowledge on the basics of biology, including cell structure, genetics, and evolution."
            questions={10}
            attempts={1500}
            completionRate={85}
          />
        </div>
      </section>
      <section className="flex justify-center mt-8">
        <Link
          href="/genuslab/quizzes/create-quiz"
          className="flex w-full border-dashed aspect-3/1 rounded-sm hover:bg-gray-100 transition duration-75 font-bold py-2 px-4 text-gray-500 items-center justify-center gap-2 border-2 border-gray-300"
        >
          <FaPlus /> Create New Quiz
        </Link>
      </section>
    </div>
  );
};

export default page;
