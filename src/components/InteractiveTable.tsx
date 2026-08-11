import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const playSound = (type: 'chai' | 'match' | 'news') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'chai') {
      const noize = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noize.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(3000, ctx.currentTime + 1); // Frequency sweep up for steam
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.2); // surge
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5); // fade out
      
      noize.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noize.start();
    } else if (type === 'match') {
      const noize = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noize.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 5000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      noize.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noize.start();
    } else if (type === 'news') {
      const noize = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noize.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      noize.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noize.start();
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

export function InteractiveTable() {
  const [steamSurge, setSteamSurge] = useState(false);
  const [matchLit, setMatchLit] = useState(false);
  const [newspaperOpen, setNewspaperOpen] = useState(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  const handleChaiClick = () => {
    setSteamSurge(true);
    playSound('chai');
    setTimeout(() => setSteamSurge(false), 3000);
  };

  const handleMatchClick = () => {
    setMatchLit(true);
    playSound('match');
    setTimeout(() => setMatchLit(false), 2000);
  };

  const handleNewspaperClick = () => {
    setNewspaperOpen(!newspaperOpen);
    playSound('news');
  };

  return (
    <>
    {/* Mobile Toggle Button */}
    <button 
      onClick={() => setIsMobilePanelOpen(true)}
      className={`md:hidden fixed top-1/2 right-0 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 border-r-0 shadow-[0_0_25px_rgba(0,0,0,0.5)] text-white w-12 h-24 rounded-l-2xl flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isMobilePanelOpen ? 'opacity-0 translate-x-full pointer-events-none' : 'opacity-100 translate-x-0 pointer-events-auto'
      }`}
    >
      <ChevronLeft size={32} className="opacity-80 ml-1" />
    </button>

    {/* 3D UI */}
    <div className={`flex fixed md:absolute inset-0 md:inset-auto md:top-1/2 md:right-0 md:-translate-y-1/2 flex-col items-center justify-center gap-14 md:gap-16 z-50 select-none bg-black/40 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-none md:border-transparent transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
      isMobilePanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'
    }`}>
      
      {/* Mobile Close Button inside panel */}
      <button 
        onClick={() => setIsMobilePanelOpen(false)}
        className="md:hidden absolute top-6 right-6 z-50 text-white/60 hover:text-white bg-white/5 hover:bg-white/15 p-2.5 rounded-full transition-colors backdrop-blur-md border border-white/10"
      >
        <X size={24} />
      </button>
      
      {/* Newspaper */}
      <div 
        className="relative cursor-pointer perspective-1000 group scale-[0.65] md:scale-100 z-30" 
        onClick={handleNewspaperClick}
      >
        <div 
          className={`w-32 h-40 rounded-sm shadow-[2px_2px_10px_rgba(0,0,0,0.5)] transition-all duration-700 preserve-3d ${
            newspaperOpen 
              ? 'newspaper-open' 
              : 'newspaper-closed group-hover:shadow-[4px_4px_15px_rgba(0,0,0,0.6)]'
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 p-4 bg-[#e8dcc4] backface-hidden flex flex-col gap-2 border border-[#d1be9a] overflow-hidden shadow-inner">
            <div className="text-center border-b-2 border-black/60 pb-1 mb-1">
              <div className="text-[12px] font-black tracking-widest text-black/80 font-serif">THE DAILY</div>
            </div>
            <div className="h-1 bg-black/40 w-3/4 mx-auto mb-1"></div>
            <div className="flex gap-2 h-full">
              <div className="flex flex-col gap-1 w-1/2">
                <div className="h-1 bg-black/30 w-full"></div>
                <div className="h-1 bg-black/30 w-full"></div>
                <div className="h-1 bg-black/30 w-5/6"></div>
                <div className="h-1 bg-black/30 w-full"></div>
                <div className="h-1 bg-black/30 w-4/5"></div>
                <div className="mt-1 flex-1 bg-black/10 border border-black/20 w-full"></div>
              </div>
              <div className="flex flex-col gap-1 w-1/2">
                <div className="h-12 bg-black/20 w-full mb-1 border border-black/30"></div>
                <div className="h-1 bg-black/30 w-full"></div>
                <div className="h-1 bg-black/30 w-full"></div>
                <div className="h-1 bg-black/30 w-5/6"></div>
              </div>
            </div>
          </div>
          
          {/* Back (Trivia / Crossword) */}
          <div className="absolute inset-0 p-3 bg-[#e8dcc4] backface-hidden [transform:rotateY(180deg)] border border-[#d1be9a] flex flex-col">
            <div className="text-[8px] font-bold text-black/70 font-serif border-b border-black/30 pb-1 mb-2 text-center">
              1990s Nostalgia
            </div>
            <div className="text-[7px] leading-relaxed font-serif text-black/80 italic text-center mb-4">
              "Remember when a cup of chai was 2 rupees, and Sunday mornings meant Malgudi Days?"
            </div>
            {/* Mini Crossword */}
            <div className="mt-auto grid grid-cols-4 gap-[1px] bg-black/80 border border-black/80 p-[1px]">
              <div className="bg-[#e8dcc4] aspect-square flex items-center justify-center text-[5px] text-black font-bold">1</div>
              <div className="bg-black aspect-square"></div>
              <div className="bg-[#e8dcc4] aspect-square flex items-center justify-center text-[5px] text-black font-bold">2</div>
              <div className="bg-[#e8dcc4] aspect-square"></div>
              
              <div className="bg-[#e8dcc4] aspect-square"></div>
              <div className="bg-[#e8dcc4] aspect-square"></div>
              <div className="bg-[#e8dcc4] aspect-square"></div>
              <div className="bg-black aspect-square"></div>
              
              <div className="bg-black aspect-square"></div>
              <div className="bg-[#e8dcc4] aspect-square flex items-center justify-center text-[5px] text-black font-bold">3</div>
              <div className="bg-[#e8dcc4] aspect-square"></div>
              <div className="bg-[#e8dcc4] aspect-square"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Matchbox */}
      <div className="relative group cursor-pointer mb-2 scale-90 md:scale-100" onClick={handleMatchClick}>
        <div className="w-16 h-10 bg-red-800 rounded-sm shadow-[2px_4px_6px_rgba(0,0,0,0.6)] flex items-center justify-center transform rotate-12 transition-transform group-hover:rotate-6 group-hover:scale-105 border-t border-red-700 border-b-2 border-b-red-950 border-r-2 border-r-red-950 z-10 relative">
          <div className="w-12 h-6 bg-yellow-100 rounded-sm border border-yellow-200/50 flex flex-col items-center justify-center">
             <div className="w-5 h-5 rounded-full border border-red-600/50 opacity-50 flex items-center justify-center">
               <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
             </div>
          </div>
          {/* Matches sticking out slightly */}
          <div className="absolute -left-1 top-2 w-2 h-1 bg-yellow-200/80 rounded-l-sm shadow-sm"></div>
          <div className="absolute -left-1.5 top-5 w-2.5 h-1 bg-yellow-200/80 rounded-l-sm shadow-sm flex items-center">
             <div className="w-1.5 h-1.5 bg-red-700 rounded-full -ml-0.5"></div>
          </div>
        </div>
        
        {/* Animated Matchstick */}
        <div 
          className={`absolute z-20 flex items-center transition-all duration-700 ${
            matchLit 
              ? 'opacity-100 -translate-x-16 -translate-y-16 rotate-[-45deg] scale-150' 
              : 'opacity-0 left-4 top-2 scale-50'
          }`}
        >
          <div className="w-10 h-1.5 bg-[#e4cfab] rounded-sm relative shadow-sm">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-2.5 bg-red-800 rounded-sm"></div>
            {matchLit && (
               <div className="absolute -left-5 -top-5 text-3xl animate-[pulse_0.4s_infinite] pointer-events-none drop-shadow-[0_0_25px_rgba(255,100,0,1)]">🔥</div>
            )}
          </div>
        </div>

        {matchLit && (
          <div className="absolute -top-12 -left-6 pointer-events-none z-50">
            <div className="absolute w-12 h-12 rounded-full bg-orange-400 mix-blend-screen blur-md animate-[spark-flare_0.8s_ease-out_forwards]"></div>
            <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-yellow-200 mix-blend-screen blur-sm animate-[spark-flare_0.8s_ease-out_forwards]"></div>
            <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-white animate-[spark-flare_0.8s_ease-out_forwards]"></div>
          </div>
        )}
      </div>

      {/* Chai Glass */}
      <div className="relative group cursor-pointer ml-4 scale-90 md:scale-100" onClick={handleChaiClick}>
        <div className={`w-14 h-20 bg-white/5 backdrop-blur-sm border-x-2 border-b-4 border-white/20 rounded-b-2xl relative overflow-hidden transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:-translate-y-2 group-hover:shadow-[0_15px_25px_rgba(0,0,0,0.6)] ${steamSurge ? 'animate-[ripple-effect_0.8s_ease-out]' : ''} rounded-t-sm`}>
          {/* Tea liquid */}
          <div className="absolute bottom-0 w-full h-[70%] bg-gradient-to-b from-amber-600/90 to-amber-900/95 border-t border-amber-500/50">
             {/* Glass reflection */}
             <div className="absolute top-0 right-1.5 w-2 h-full bg-white/10 rounded-full blur-[1px]"></div>
          </div>
        </div>
        
        {/* Steam */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none z-50">
          <div className={`w-4 h-20 rounded-full transition-all duration-500 ${steamSurge ? 'animate-[steam-surge_1s_ease-out_infinite] bg-white/70 h-28 blur-[4px]' : 'animate-[steam-rise_2.5s_ease-in-out_infinite] bg-white/40 blur-[3px]'}`}></div>
          <div className={`w-5 h-16 rounded-full transition-all duration-500 delay-100 ${steamSurge ? 'animate-[steam-surge_1.2s_ease-out_infinite_0.2s] bg-white/70 h-32 -translate-y-4 blur-[5px]' : 'animate-[steam-rise_3s_ease-in-out_infinite_0.5s] bg-white/40 blur-[4px]'}`}></div>
          <div className={`w-3 h-20 rounded-full transition-all duration-500 delay-200 ${steamSurge ? 'animate-[steam-surge_1.1s_ease-out_infinite_0.4s] bg-white/70 h-24 translate-x-2 blur-[4px]' : 'animate-[steam-rise_2s_ease-in-out_infinite_1s] bg-white/40 blur-[3px]'}`}></div>
        </div>
      </div>

    </div>
    </>
  );
}
