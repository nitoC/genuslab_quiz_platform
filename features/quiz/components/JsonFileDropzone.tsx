"use client";

import React, { useRef, useState } from "react";
import { HiOutlineCloudUpload } from "react-icons/hi";
import toast from "react-hot-toast";

interface JsonFileDropzoneProps {
  onFileText: (text: string) => void;
  hint?: string;
}

// Primary, beginner-friendly way to load a JSON payload — drag a file onto
// this box or click it to browse. Pasting into the textarea below still
// works as a fallback for anyone who already has the JSON on their
// clipboard, but this is the first thing a new admin should notice.
export default function JsonFileDropzone({
  onFileText,
  hint = "Accepts a .json file",
}: JsonFileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const readFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".json")) {
      toast.error("Please upload a .json file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        onFileText(result);
        setFileName(file.name);
        toast.success(`Loaded ${file.name}`);
      }
    };
    reader.onerror = () => toast.error("Could not read that file");
    reader.readAsText(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) readFile(file);
      }}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      role="button"
      tabIndex={0}
      aria-label="Upload a JSON file"
      className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition-colors ${
        dragOver
          ? "border-blue-500 bg-blue-50"
          : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/60"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) readFile(file);
          e.target.value = "";
        }}
      />
      <HiOutlineCloudUpload className="text-2xl text-blue-500" />
      <p className="text-sm font-semibold text-slate-700">
        Drag & drop a .json file here, or click to browse
      </p>
      <p className="text-xs text-slate-400">
        {fileName ? `Loaded: ${fileName}` : hint}
      </p>
    </div>
  );
}
