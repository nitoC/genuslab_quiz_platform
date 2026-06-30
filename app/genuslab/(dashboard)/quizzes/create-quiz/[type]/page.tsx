"use client";
import React, { useState } from "react";
import AdminHeader from "@/components/layouts/AdminHeader";
import AdminQuizCreate from "@/components/ui/AdminQuizCreate";
import AdminQuizPublish from "@/components/ui/AdminQuizPublish";
import {
  FiInfo,
  FiEdit,
  FiCheckCircle,
  FiCalendar,
  FiHash,
  FiClock,
  FiX,
  FiArrowRight,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import AdminQuestionCreate from "@/components/ui/AdminQuestionCreate";
import clsx from "clsx";
import { IQuestion } from "@/interfaces";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchQuizDetails } from "@/lib/api/apis";
import toast, { Toaster } from "react-hot-toast";
import { a } from "motion/react-client";

export default function CreateQuiz() {
  const { type } = useParams();
  const [tab, setTab] = useState<"bi" | "qb" | "rp">(
    type && type === "live" ? "bi" : "qb",
  );
  const [quizId, setQuizId] = useState<string | undefined>(undefined);
  const [question, setQuestion] = useState<IQuestion[]>([]);
  const id = useSearchParams().get("id");

  // alert(type);+

  if (!["demo", "live"].includes(type as string)) {
    notFound();
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen w-full bg-gray-50 text-gray-800 antialiased">
        {/* FULL WIDTH CONTAINER */}
        <div className="w-full px-6 lg:px-12 py-8">
          {/* PAGE HEADER / PROGRESS */}
          <div className="w-full bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-2 py-6">
              <div className="flex items-center justify-between gap-6">
                {/* Step 1 */}
                {type && type === "live" && (
                  <div className="flex-1 text-center">
                    <div
                      className={clsx(
                        "flex items-center justify-center gap-2 font-semibold pb-3",
                        tab === "bi"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "border-transparent",
                      )}
                    >
                      <FiInfo />
                      <span>Basic Info</span>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                <div className="flex-1 text-center">
                  <div
                    className={clsx(
                      "flex items-center justify-center gap-2 font-medium pb-3",
                      tab === "qb"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "border-transparent",
                    )}
                  >
                    <FiEdit />
                    <span>Question Builder</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex-1 text-center">
                  <div
                    className={clsx(
                      "flex items-center justify-center gap-2 font-medium pb-3",
                      tab === "rp"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "border-transparent",
                    )}
                  >
                    <FiCheckCircle />
                    <span>Review & Publish</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {tab === "bi" && type && type === "live" && (
          <AdminQuizCreate
            id={id ? id : quizId}
            type={type ? type : ""}
            handler={(quizId: string) => {
              setQuizId(quizId);
              setTab("qb");
            }}
          />
        )}
        {tab === "qb" && (
          <AdminQuestionCreate
            id={id ? id : quizId}
            question={question}
            // type={type && (type as string)}
            quizId={quizId}
            setQuestion={setQuestion}
            handler={(option?: string) => {
              console.log(question, "question");
              const validate = question.every((a, b) => {
                console.log(a, "a");
                return (
                  a.difficulty &&
                  a.explanation &&
                  a.hint &&
                  a.id &&
                  a.questionText &&
                  a.rankRequirement &&
                  a.options.length === 4
                );
              });
              if (question.length < 4) {
                toast.custom((t) => (
                  <div
                    className={`${
                      t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-white pointer-events-auto flex ring-opacity-5 p-4 border-b-red-500 border-b-2`}
                  >
                    <div className="flex-1 font-medium text-black text-center">
                      cannot proceed! Questions must be 4
                    </div>
                  </div>
                ));
                return;
              }
              if (question.length < 10 && quizId) {
                toast.custom((t) => (
                  <div
                    className={`${
                      t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-white pointer-events-auto flex ring-opacity-5 p-4 border-b-red-500 border-b-2`}
                  >
                    <div className="flex-1 font-medium text-black text-center">
                      cannot proceed! Questions must be 10
                    </div>
                  </div>
                ));
                return;
              }

              if (!validate) {
                toast.custom((t) => (
                  <div
                    className={`${
                      t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-white pointer-events-auto flex ring-opacity-5 p-4 border-b-red-500 border-b-2`}
                  >
                    <div className="flex-1 font-medium text-black text-center">
                      cannot proceed! All question fields must be filled
                    </div>
                  </div>
                ));
                return;
              }

              if (option) return setTab(option as "qb" | "rp");
              setTab("rp");
            }}
          />
        )}
        {tab === "rp" && (
          <AdminQuizPublish
            questions={question}
            id={id ? id : quizId}
            reset={() => {
              setQuizId(undefined);
              setQuestion([]);
              window.location.reload();
            }}
            handler={(option?: string) => {
              if (option) return setTab(option as "qb" | "rp");
            }}
          />
        )}
      </div>
    </>
  );
}
