import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { PlaylistItem } from '../hooks/useYouTubePlayer';

interface PlayerWidgetProps {
  item: PlaylistItem;
  playerState: any; 
}

export function PlayerWidget({ item, playerState }: PlayerWidgetProps) {
  const { isPlaying, togglePlay, nextTrack, prevTrack, progress, duration, seekTo } = playerState;

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-3xl p-6 flex flex-col gap-4 w-full transition-all">
      <div className="flex items-center gap-5">
        {/* Album Art (Vinyl Disk) */}
        <div className="relative w-20 h-20 shrink-0">
          <div className={`w-full h-full rounded-full overflow-hidden shadow-lg border border-white/10 bg-gradient-to-br from-gray-700 to-gray-900 ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : 'animate-[spin_8s_linear_infinite] [animation-play-state:paused]'}`}>
            <img 
              src={item.thumbnail} 
              alt={item.title} 
              className="w-full h-full object-cover" 
            />
            {/* Vinyl record center hole */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-[#050505] rounded-full border border-white/20 shadow-inner" />
            </div>
          </div>
        </div>

        {/* Info & Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-lg font-medium tracking-tight truncate leading-tight text-white">
              {item.title}
            </h2>
            <span className="text-[10px] font-bold text-white/30 mt-1 uppercase tracking-tighter shrink-0 ml-4">YouTube</span>
          </div>
          <h3 className="text-sm text-white/50 mb-3 font-normal truncate">
            {item.artist}
          </h3>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/40 tabular-nums">{formatTime(progress)}</span>
            <div className="flex-1 h-[3px] bg-white/10 rounded-[2px] overflow-hidden cursor-pointer relative group">
              <div 
                className="absolute top-0 left-0 bottom-0 bg-white transition-all duration-300 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
              <input 
                type="range"
                min={0}
                max={duration || 100}
                value={progress}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-[10px] font-mono text-white/40 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
        <div className="flex gap-6 items-center">
          <button onClick={prevTrack} className="opacity-50 hover:opacity-100 transition-opacity">
            <SkipBack className="w-[18px] h-[18px] fill-current" />
          </button>
          <button onClick={togglePlay} className="opacity-100 hover:scale-105 active:scale-95 transition-transform">
            {isPlaying ? (
              <Pause className="w-[18px] h-[18px] fill-current" />
            ) : (
              <Play className="w-[18px] h-[18px] fill-current" />
            )}
          </button>
          <button onClick={nextTrack} className="opacity-50 hover:opacity-100 transition-opacity">
            <SkipForward className="w-[18px] h-[18px] fill-current" />
          </button>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-40 hover:opacity-100 transition-opacity">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
            <div className="w-16 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-white/40" />
            </div>
          </div>
          <button className="text-[10px] font-bold tracking-widest text-white/40 hover:text-white uppercase transition-colors">Playlist</button>
        </div>
      </div>
    </div>
  );
}
