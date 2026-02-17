"use client";
import { socket } from "@/lib/api/socket";
import { ParamValue } from "next/dist/server/request/params";

interface Choice {
  id: string;
  label: string;
  [key: string]: any;
}

interface QuestionItem {
  number: number;
  question: string;
  answer: string;
  explanation: string;
  [key: string]: any;
}

const useQuestion = (socketId: ParamValue, sid: string) => {
  let questions: any;
  const isId = !(socketId !== sid && null);

  // --- STORE HANDLERS FOR OFF() ---
  const questionEvent = socketId + "question";
  const answerEvent = socketId + "answer";

  // Handler references (these must not be recreated)
  const onQuestion = (data: QuestionItem[]) => {
    questions = data;
    if (currentSetter) currentSetter(data);
    console.log("Received questions:", data);
  };

  const onAnswer = (data: any) => {
    console.log("Received score or answer results:", data);
  };

  // Store setData to use inside the handler
  let currentSetter: ((data: any) => void) | null = null;

  // ==============================
  // Attach question listener
  // ==============================
  const handleConnection = (setData: (data: any) => void) => {
    currentSetter = setData;

    socket.on(questionEvent, onQuestion);

    // RETURN CLEANUP to allow caller to unmount properly
  };
  const handleDisconnect = () => {
    socket.off(questionEvent, onQuestion);
    console.log("Disconnected question listener:", questionEvent);
  };

  // ==============================
  // Emit quiz event
  // ==============================
  const handleEvent = () => {
    socket.emit("question", socketId);
  };

  // ==============================
  // Score listener
  // ==============================
  // const handleScore = (questionsList: { number: number; answer: string }[]) => {
  //   socket.on(answerEvent, onAnswer);

  //   socket.emit("score", [...questionsList, { id: socketId }]);

  //   // Cleanup
  //   return () => {
  //     socket.off(answerEvent, onAnswer);
  //     console.log("Disconnected score listener:", answerEvent);
  //   };
  // };

  return {
    handleConnection,
    handleDisconnect,
    handleEvent,
    // handleScore,
    isId,
    questions,
  };
};

export default useQuestion;
