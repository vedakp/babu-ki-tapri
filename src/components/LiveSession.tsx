import { Radio } from 'lucide-react';

export function LiveSession() {
  return (
    <div className="relative z-30">
      <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/40 backdrop-blur-xl border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.5)] rounded-full select-none">
        {/* Live Red Pulsing Dot */}
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-500 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </div>

        {/* Live Badge Label */}
        <span className="text-[10px] sm:text-xs font-extrabold tracking-widest text-red-400 uppercase flex items-center gap-1.5">
          LIVE
        </span>
      </div>
    </div>
  );
}
