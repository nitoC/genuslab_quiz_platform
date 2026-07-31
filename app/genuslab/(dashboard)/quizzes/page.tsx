"use client";

import AdminHeader from "@/components/layouts/AdminHeader";
import AdminQuiz from "@/components/ui/cards/AdminQuiz";
import EmptyQuizState from "@/features/quiz/components/EmptyData";
import QuizMatrix from "@/features/quiz/components/skeletons/QuizMatrix";
import { deleteQuiz, getAllQuiz } from "@/lib/api/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";

export default function QuizManagementPage() {
  const queryClient = useQueryClient();
  const [active, setActive] = useState("Live Quizzes");

  const tabs = [
    { name: "Live Quizzes", href: "#", current: false, value: "ACTIVE" },
    { name: "Drafts", href: "#", current: false, value: "DRAFT" },
    { name: "Archived", href: "#", current: false, value: "ARCHIVED" },
    { name: "Demo Quizzes", href: "#", current: false, value: "DEMO" },
    { name: "Upcoming Quizzes", href: "#", current: false, value: "UPCOMING" },
  ];

  const {
    data: quizzes = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["quizzes", active],
    queryFn: async () => {
      const tabVal = tabs.find((a) => a.name === active);
      const res = await getAllQuiz(tabVal?.value as string);
      return res?.data?.payload ?? [];
    },
  });

  const quizzesTransform = quizzes.sort((a: any, b: any) => a.day - b.day);

  console.log(quizzesTransform);

  const deleteMutation = useMutation({
    mutationKey: ["delete quiz", active],
    mutationFn: async (quizId: string) => {
      const res = await deleteQuiz(quizId);
      return res.status;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
    onError: (error) => {
      const status = (error as any).response?.status;
      if (status === 404) return toast.error("item not found");
      if (status === 401) return toast.error("user is not permited to do this");

      toast.error((error as any)?.response.data?.message);
    },
  });

  const handleDelete = (quizId: string) => {
    deleteMutation.mutate(quizId);
  };

  return (
    <div className="w-full min-h-screen bg-transparent">
      {/* HEADER SECTION */}
      <section className="flex flex-col gap-3">
        {/* <AdminHeader title="Quiz Management" /> */}
      </section>

      {/* TOP CONTROLS SECTION */}
      <div className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActive(tab.name)}
              className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg transition-colors ${
                active === tab.name
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <Link
          href="/genuslab/quizzes/create-quiz"
          className="flex w-full sm:w-auto border rounded-xl hover:bg-gray-100 transition font-bold py-2.5 px-5 text-gray-600 items-center justify-center gap-2 border-gray-300 shadow-sm text-sm"
        >
          <FaPlus /> Create New Quiz
        </Link>
      </div>

      <div className="w-full h-px bg-gray-200" />
      <div className="p-4" />

      {/* CORE DISPLAY MATRIX */}
      <section className="px-8">
        {isLoading ? (
          <QuizMatrix />
        ) : quizzes.length > 0 ? (
          /* 2. LIVE ACTIVE DATA MAP STATE */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzesTransform.map((quiz: any, idx: number) => (
              <AdminQuiz
                key={quiz.id || idx}
                id={quiz?.id}
                badge="New"
                day={quiz.day}
                title={quiz.title}
                description={quiz.episode}
                questions={10}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          /* 3. EMPTY STATE - Breaks out of layout constraints safely */
          <div className="w-full flex items-center justify-center py-12">
            <EmptyQuizState title={`No ${active} Added Yet`} />
          </div>
        )}
      </section>

      {/* BOTTOM DASHED ACTION BANNER */}
      {!isLoading && quizzes.length > 0 && (
        <section className="flex justify-center px-8 mt-12 pb-12">
          <Link
            href="/genuslab/quizzes/create-quiz"
            className="flex w-full border-dashed border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-bold py-6 px-4 text-gray-500 items-center justify-center gap-2 max-w-4xl"
          >
            <FaPlus /> Create New Quiz
          </Link>
        </section>
      )}
    </div>
  );
}
