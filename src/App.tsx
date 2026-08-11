import { Clock } from './components/Clock';
import { PlayerWidget } from './components/PlayerWidget';
import { InteractiveTable } from './components/InteractiveTable';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import './types';

// Atmospheric rainy night / lofi background
const BG_URL = "/chai-tapri.jpg?v=1"; // Add cache buster

export default function App() {
  const playlistId = 'PLIxqOJRaPIBc'; 
  const playerState = useYouTubePlayer(playlistId);

  const { currentItem, isReady } = playerState;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050505] text-white font-sans select-none selection:bg-white/20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100 pointer-events-none transition-transform duration-[120s] ease-linear"
        style={{ backgroundImage: `url(${BG_URL})` }}
      />

      {/* Atmosphere over background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,#1a1a2e_0%,transparent_50%),radial-gradient(circle_at_20%_80%,#16213e_0%,transparent_60%),radial-gradient(circle_at_50%_50%,#0f3460_0%,transparent_100%)] blur-[80px] opacity-30 pointer-events-none" />


      {/* Center Top Hindi Title - Ad/Promotion style */}
      <div className="absolute top-24 md:top-16 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10 opacity-90 drop-shadow-2xl text-center w-full">
        <div className="text-white/90 text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold px-4 md:px-6 py-1 md:py-1.5 border border-white/30 rounded backdrop-blur-sm bg-black/40 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          Famous Since 1995
        </div>
        <h1 className="font-devanagari mt-3 md:mt-5 text-center text-6xl leading-[1.15] text-cream drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)] md:text-8xl md:leading-[1.15]">
          <span className="block">बाबू की</span>
          <span className="block">टपरी</span>
        </h1>
      </div>


      {/* Hidden YouTube Player IFrame Target container */}
      <div id="youtube-player-container" className="absolute top-0 left-0 opacity-0 pointer-events-none">
        <div id="youtube-player" />
      </div>

      {/* Top UI Layer */}
      <header className="absolute top-8 left-10 right-10 flex justify-between items-start z-10">
        <Clock />
        
        <div className="hidden md:block">
          <div className="flex items-center gap-3 px-4 py-1.5 bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <div className="text-[10px] font-bold tracking-[0.3em] text-white/80 uppercase">LIVE</div>
          </div>
        </div>

      </header>

      {/* Bottom UI - Player Widget */}
      <main className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-full md:max-w-[520px] z-20">
        {!isReady || !currentItem ? (
          <div className="bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-3xl p-6 h-32 flex items-center justify-center animate-pulse">
             <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <PlayerWidget item={currentItem} playerState={playerState} />
        )}
      </main>

      {/* Interactive Desktop Elements */}
      <InteractiveTable />

    </div>
  );
}
