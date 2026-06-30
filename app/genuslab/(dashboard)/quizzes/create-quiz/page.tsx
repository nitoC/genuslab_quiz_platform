import Link from "next/link";
import { FaGraduationCap, FaRocket } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { IoFlash } from "react-icons/io5";
import { BiCodeAlt } from "react-icons/bi";
import { BsLightningFill } from "react-icons/bs";

export default function ChooseQuizType() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto flex-col flex gap-4 max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-slate-900">
            Choose Quiz Type
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
            Select the type of quiz you want to create. Each type serves a
            different pedagogical purpose.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Demo Quiz */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <FaGraduationCap className="text-lg text-slate-700" />
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
                Internal
              </span>
            </div>

            <h2 className="mt-6 text-3xl font-semibold text-slate-900">
              Demo Quiz
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Create a practice quiz for testing, training, or demonstration
              purposes. Results are not considered official.
            </p>

            <div className="mt-7 space-y-4">
              {[
                "Test questions before publishing",
                "Internal training and practice",
                "Safe environment for experimentation",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border border-blue-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  </div>

                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href={"/genuslab/quizzes/create-quiz/demo"}
              className="mt-12 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-200 text-sm font-medium text-slate-700 transition hover:bg-slate-300"
            >
              Create Demo Quiz
              <HiArrowRight className="text-base" />
            </Link>
          </div>

          {/* Live Quiz */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                <FaRocket className="text-lg text-white" />
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-600">
                Official
              </span>
            </div>

            <h2 className="mt-6 text-3xl font-semibold text-slate-900">
              Live Quiz
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Create an official quiz that participants will take and submit as
              part of a real assessment or evaluation.
            </p>

            <div className="mt-7 space-y-4">
              {[
                "Official participant submissions",
                "Real-time participation",
                "Results and scoring enabled",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border border-emerald-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>

                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href={"/genuslab/quizzes/create-quiz/live"}
              className="mt-12 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Create Live Quiz
              <IoFlash className="text-base" />
            </Link>
          </div>
        </div>
        <JsonBuilderCard />
      </div>
    </div>
  );
}

function JsonBuilderCard() {
  return (
    <div className="w-full border border-slate-100 rounded-xl p-6 bg-white shadow-[0_2px_8px_rgba(0,0,0,0,04)] font-sans relative">
      {/* Top Header Section */}
      <div className="flex justify-between items-start mb-5">
        {/* JSON Bracket Icon Wrapper */}
        <div className="p-3 bg-blue-50 rounded-xl flex items-center justify-center text-blue-900">
          <BiCodeAlt className="text-2xl stroke-[0.5]" />
        </div>

        {/* Advanced Badge */}
        <span className="px-3 py-1 bg-blue-50 text-blue-900 text-xs font-semibold rounded-full border border-blue-100 tracking-wide">
          Advanced
        </span>
      </div>

      {/* Content Section */}
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          JSON Builder
        </h2>
        <p className="text-base text-slate-700 leading-relaxed">
          Quickly generate your quiz by importing structured data.
        </p>
        <p className="text-xs italic text-slate-800 font-medium">
          Hint: You can paste your past quiz and questions as a JSON file.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Demo Button */}
        <Link
          href={"/genuslab/quizzes/create-quiz/json/questions"}
          className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-slate-200 hover:bg-slate-300 transition-colors duration-200 text-slate-800 font-semibold rounded-xl text-sm"
        >
          Demo JSON Builder
          <HiArrowRight className="text-lg" />
        </Link>

        {/* Live Button */}
        <Link
          href={"/genuslab/quizzes/create-quiz/json/live"}
          className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white font-semibold rounded-xl text-sm shadow-sm"
        >
          Live JSON Builder
          <BsLightningFill className="text-sm" />
        </Link>
      </div>
    </div>
  );
}
