export default function StatusPageBackground({
  accent = "blue",
}: {
  accent?: "blue" | "red";
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-(--background-dark-primary)">
      {/* Faint grid for texture — static, no motion */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
