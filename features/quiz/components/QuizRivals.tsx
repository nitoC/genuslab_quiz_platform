const Rivals = () => {
  return (
    <div className="bg-[#11192e] border border-white/5 rounded-[32px] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-green text-[14px] font-black uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          Live Rivals
        </h3>
        <span className="text-red text-[14px] font-black uppercase">
          Watch Live
        </span>
      </div>

      <div className="space-y-3">
        {[
          {
            name: "Alex M.",
            xp: "12,450 XP",
            img: "https://i.pravatar.cc/150?u=1",
          },
          {
            name: "Sarah K.",
            xp: "11,820 XP",
            img: "https://i.pravatar.cc/150?u=2",
          },
          {
            name: "Chris W.",
            xp: "10,705 XP",
            img: "https://i.pravatar.cc/150?u=3",
          },
        ].map((rival, i) => (
          <div
            key={i}
            className="flex items-center justify-between group cursor-default"
          >
            <div className="flex items-center gap-3">
              <img
                src={rival.img}
                className="w-8 h-8 rounded-lg grayscale group-hover:grayscale-0 transition-all"
                alt=""
              />
              <span className="text-sm font-bold text-slate-300">
                {rival.name}
              </span>
            </div>
            <span className="text-[14px] font-black text-green/80">
              {rival.xp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Rivals;
