import { IoMdLock } from "react-icons/io";

export const FallbackQuizCard = ({ slotIndex }: { slotIndex: number }) => {
  return (
    <div className="h-90 basis-70 shrink-0 bg-neutral-900/40 border border-dashed border-white/10 p-4 rounded-lg flex flex-col justify-between relative overflow-hidden group select-none">
      <div>
        <span className="text-neutral-500 font-medium text-sm">
          Slot TBD
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm tracking-wider font-mono text-neutral-600 uppercase">
          [ Slot Empty #{slotIndex} ]
        </p>
        <h3 className="text-neutral-500 font-semibold text-sm">
          Content Unassigned
        </h3>
        <p className="text-sm text-neutral-600">
          Check back later for updated scheduling.
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <div>
          <p className="text-[14px] text-neutral-600 uppercase tracking-tight">
            Prize Allocation
          </p>
          <p className="text-sm font-bold text-neutral-500">-- --</p>
        </div>
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-600 border border-neutral-700">
          <IoMdLock size={16} />
        </div>
      </div>
    </div>
  );
};
