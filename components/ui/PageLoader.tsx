import { cn } from "@/lib/utils/cn";

interface PageLoaderProps {
  label?: string;
  theme?: "light" | "dark";
  // Fills the full viewport (route/auth gates) vs. sitting inline within an
  // already-rendered layout (a Suspense boundary around one section/tab).
  fullScreen?: boolean;
  className?: string;
}

// Spinner + label for loading states.
const PageLoader = ({
  label = "Loading...",
  theme = "dark",
  fullScreen = true,
  className,
}: PageLoaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 p-8",
        fullScreen && "min-h-screen",
        theme === "dark"
          ? "bg-(--background-dark-primary) text-grey"
          : "bg-white text-slate-500",
        className,
      )}
    >
      <span
        className={cn(
          "h-8 w-8 rounded-full border-2 border-t-transparent animate-spin",
          theme === "dark" ? "border-blue" : "border-blue-600",
        )}
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export default PageLoader;
