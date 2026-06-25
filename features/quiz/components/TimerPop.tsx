"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import clsx from "clsx";
import { useEffect } from "react";
import { LuTimer } from "react-icons/lu";

const TimerPop = (pop: boolean) => {

    useEffect(()=>{
        
        return ()=>{}
    })
  return (
    <section
      className={clsx(
        pop ? "opacity-100" : "opacity-0",
        "px-4 duration-100 md:px-8 py-4 sticky bottom-0 z-10",
      )}
    >
      <GlassCard>
        <div className="p-4 md:p-6 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue/20 p-3 rounded-xl">
              <LuTimer size={24} className="text-blue" />
            </div>
            <div className="flex flex-col">
              <span className="text-blue text-[10px] uppercase tracking-wider font-bold">
                Next Event Starts In
              </span>
              <h2 className="text-white text-xl md:text-2xl font-bold">
                {/* 1hrs 58mins 18secs */}
                {countdown}
              </h2>
            </div>
          </div>

          <PrimaryButton type="link" to={`/live-quiz/`} text="Join Quiz" />
          {/* <PrimaryButton
                type="link"
                to={Sid ? `/live-quiz/${Sid}` : "#"}
                text="Join Quiz"
              /> */}
        </div>
      </GlassCard>
    </section>
  );
};

export default TimerPop;
