"use client";
import { useEffect, useState } from "react";
import { FiArrowRight, FiCalendar, FiClock, FiHash, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import AdminInput from "./FormItems/AdminInput";
import { useQuery } from "@tanstack/react-query";
import {
  createQuiz,
  fetchQuizDetails,
  getEpisodeDetails,
  getSlotDetails,
  updateQuiz,
} from "@/lib/api/apis";
import CustomSelect from "./FormItems/CustomSelect";
import { toast } from "react-toastify";
import clsx from "clsx";

const AdminQuizCreate = ({
  handler,
  type,
  id,
}: {
  handler: (quizId: string) => void;
  type: string;
  id?: string;
}) => {
  // const [quizType, setQuizType] = useState<"demo" | "live">("demo");
  const [quizInput, setQuizInput] = useState({
    title: "",
    day: "",
    episode: "",
    activeAt: "",
    // type: quizType,
  });

  const {
    data: quizDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["fetchQuizDetails", id],
    queryFn: async () => {
      try {
        if (!id) return null;
        const res = await fetchQuizDetails(id);
        console.log(res, "quiz details in page");
        return res.data.payload;
      } catch (err) {
        console.log(err, "error fetching quiz details");
        throw err;
      }
    },
  });

  const {
    data: slotDetails,
    isLoading: isSlotLoading,
    isError: isSlotError,
  } = useQuery({
    queryKey: ["fetchSlotDetails"],
    queryFn: async () => {
      try {
        const res = await getSlotDetails();
        console.log(res, " slot quiz details in page");
        return res.data.payload;
      } catch (err) {
        console.log(err, "error fetching slot details");
        throw err;
      }
    },
  });

  const {
    data: episodeDetails,
    isLoading: isEpisodeLoading,
    isError: isEpisodeError,
  } = useQuery({
    queryKey: ["fetchEpisodeDetails"],
    queryFn: async () => {
      try {
        const res = await getEpisodeDetails();
        console.log(res, " episode quiz details in page");
        return res.data.payload;
      } catch (err) {
        console.log(err, "error fetching episode details");
        throw err;
      }
    },
  });
  const handleChange = (field: string, value: string) => {
    setQuizInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuizSubmit = async () => {
    // Validate inputs
    if (!quizInput.title || !quizInput.day || !quizInput.episode) {
      return toast.warn("Please fill in all required fields.");
    }
    // console.log(
    //   slotDetails?.find((s: any) => s.label === quizInput.activeAt),
    //   "active at details",
    // );
    // return;
    try {
      const submitItem = {
        ...quizInput,
        episode: episodeDetails?.find((e: any) => e.label === quizInput.episode)
          .tag,
        activeAt: slotDetails?.find((s: any) => s.label === quizInput.activeAt)
          .tag,
      };
      console.log(submitItem, "submit item");
      if (
        !id ||
        quizInput.title !== quizDetails?.title ||
        quizInput.day !== quizDetails?.day ||
        quizInput.episode !== quizDetails?.episode ||
        quizInput.activeAt !== quizDetails?.activeAt
        // quizInput.type !== quizDetails?.type
      ) {
        toast.info("Quiz details updated! Proceeding to question builder...");
        const res = await updateQuiz(id as string, submitItem);
        console.log(res, "quiz details updated in page");
        const quizId = res.data.payload.id;
        handler(quizId);
        return;
      }
      if (id) {
        handler(id);
        return;
      }
      const res = await createQuiz(submitItem);
      console.log(res, "quiz details in page");
      const quizId = res.data.payload.id;
      toast.success("Quiz details saved! Proceeding to question builder...");
      handler(quizId);
      return;
    } catch (err) {
      console.log(err, "error creating quiz");
      toast.error(
        (err as Error).message || "Error creating quiz. Please try again.",
      );
      return;
    }
  };
  const inactive = !quizInput.title || !quizInput.day || !quizInput.episode;

  console.log(quizInput, "quiz input state");
  console.log(inactive, "inactive state");
  // useEffect(() => {
  //   async function fetchData() {
  //     const res = await getSlotDetails();
  //     console.log(res, " slot quiz details in page");
  //   }
  //   fetchData();
  // });
  return (
    <div className="w-full max-w-5xl mx-auto py-10">
      {/* TITLE */}
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-gray-900">
          Create New Quiz
        </h1>
        <p className=" text-gray-500 mt-1">Step 1: General Details</p>
      </div>

      <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
        {/* Quiz Title */}
        <div className="space-y-2 flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Quiz Title
          </label>
          <AdminInput
            value={quizInput.title || quizDetails?.title || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleChange("title", e.target.value);
              console.log(quizInput, "quiz title in input");
            }}
            placeholder="Eg: Advanced Microservices & Architecture"
          />
        </div>

        {/* Quiz Type */}
        <div className="space-y-2 flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Quiz Type
          </label>

          {/* <div className="inline-flex border p-4 border-gray-200">
            <button
              type="button"
              onClick={() => setQuizType("demo")}
              className={`px-6 py-2 text-xs font-semibold transition ${
                quizType === "demo"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Demo Quiz
            </button>

            <button
              type="button"
              onClick={() => setQuizType("live")}
              className={`px-6 py-2 text-xs font-semibold transition border-l border-gray-200 ${
                quizType === "live"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Live Quiz
            </button>
          </div> */}
        </div>

        {/* Row Inputs */}
        <div className="grid grid-cols-1 gap-6">
          {/* Release Day */}
          <div className="space-y-2 flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Release Day
            </label>

            <AdminInput
              value={quizInput.day || quizDetails?.day || ""}
              placeholder="Select release day..."
              Icon={FiCalendar}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("day", e.target.value)
              }
            />
          </div>

          {/* Episode */}
          <div className="space-y-2 flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Episode Number
            </label>
            {/* <AdminInput
              value={quizInput.episode || quizDetails?.episode || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("episode", e.target.value)
              }
              Icon={FiHash}
              placeholder="Episode No."
            /> */}

            {isEpisodeLoading ? (
              <p>Loading episodes...</p>
            ) : isEpisodeError ? (
              <p>Error loading episodes.</p>
            ) : (
              <CustomSelect
                label={quizInput.episode}
                type="flexible"
                placeholder="Episode No."
                onChange={(value: string) => handleChange("episode", value)}
                options={episodeDetails}
              />
            )}
          </div>
        </div>

        {/* Time Slot */}
        <div className="space-y-2 flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Active Time Slot
          </label>

          <div className="relative">
            {isSlotLoading ? (
              <p>Loading time slots...</p>
            ) : isSlotError ? (
              <p>Error loading time slots.</p>
            ) : (
              <CustomSelect
                label={quizInput.activeAt}
                type="flexible"
                placeholder="Select time slot..."
                onChange={(value: string) => handleChange("activeAt", value)}
                options={slotDetails}
              />
            )}
          </div>
        </div>

        {/* AI BLOCK (MORE PREMIUM, LESS CARDY) */}
        <div className="border border-dashed border-blue-200 bg-blue-50/30 px-6 py-5 flex flex-col items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center text-blue-600">
            <HiSparkles />
          </div>

          <div>
            <p className="text-xs text-center font-semibold text-blue-700 uppercase tracking-wider">
              Smart Prep AI
            </p>
            <p className=" text-center text-gray-600 mt-1">
              AI will suggest questions based on your quiz title and category.
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          {
            <button
              type="button"
              onClick={() => {
                setQuizInput({
                  title: "",
                  day: "",
                  episode: "",
                  activeAt: "",
                  // type: quizType,
                });
                toast.info("Draft discarded");
              }}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 "
            >
              <FiX />
              Discard Draft
            </button>
          }
          <button
            onClick={() => handleQuizSubmit()}
            disabled={inactive}
            className={clsx(
              "flex items-center gap-2 text-white px-6 py-3 ",
              inactive
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700",
            )}
          >
            Next: Build Questions
            <FiArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminQuizCreate;
