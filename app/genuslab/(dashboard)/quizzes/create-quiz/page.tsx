import Link from "next/link";
import { FaGraduationCap, FaRocket } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { IoFlash } from "react-icons/io5";
import { BiCodeAlt } from "react-icons/bi";
import { BsLightningFill } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
import AdminCard from "@/components/ui/cards/AdminCard";

export default function ChooseQuizType() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto flex-col flex gap-6 max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Choose Quiz Type
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Select the type of quiz you want to create. Each type serves a
            different pedagogical purpose.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Demo Quiz */}
          <AdminCard className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <FaGraduationCap className="text-base" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Internal
              </span>
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Demo Quiz
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create a practice quiz for testing, training, or demonstration
              purposes. Results are not considered official.
            </p>

            <ul className="mt-5 space-y-2.5">
              {[
                "Test questions before publishing",
                "Internal training and practice",
                "Safe environment for experimentation",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <MdCheck className="mt-0.5 shrink-0 text-slate-400" size={16} />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href={"/genuslab/quizzes/create-quiz/demo"}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-100 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Create Demo Quiz
              <HiArrowRight className="text-base" />
            </Link>
          </AdminCard>

          {/* Live Quiz */}
          <AdminCard className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FaRocket className="text-base" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Official
              </span>
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Live Quiz
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create an official quiz that participants will take and submit as
              part of a real assessment or evaluation.
            </p>

            <ul className="mt-5 space-y-2.5">
              {[
                "Official participant submissions",
                "Real-time participation",
                "Results and scoring enabled",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <MdCheck className="mt-0.5 shrink-0 text-blue-500" size={16} />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href={"/genuslab/quizzes/create-quiz/live"}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Create Live Quiz
              <IoFlash className="text-base" />
            </Link>
          </AdminCard>
        </div>
        <JsonBuilderCard />
      </div>
    </div>
  );
}

function JsonBuilderCard() {
  return (
    <AdminCard>
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <BiCodeAlt className="text-lg" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Advanced
        </span>
      </div>

      <div className="mt-5">
        <h2 className="text-lg font-bold text-slate-900">JSON Builder</h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Quickly generate your quiz by importing structured data.
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Hint: you can paste your past quiz and questions as a JSON file.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href={"/genuslab/quizzes/create-quiz/json/questions"}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-100 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Demo JSON Builder
          <HiArrowRight className="text-base" />
        </Link>

        <Link
          href={"/genuslab/quizzes/create-quiz/json/live"}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Live JSON Builder
          <BsLightningFill className="text-sm" />
        </Link>
      </div>
    </AdminCard>
  );
}
