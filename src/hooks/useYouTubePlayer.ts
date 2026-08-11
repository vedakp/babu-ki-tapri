import { useEffect, useState, useRef } from 'react';

export interface PlaylistItem {
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
}

export function useYouTubePlayer(playlistId: string) {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [currentItem, setCurrentItem] = useState<PlaylistItem | null>(null);
  
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const initPlayer = () => {
      // Clear out the previous iframe if any
      const container = document.getElementById('youtube-player-container');
      if (container) {
          container.innerHTML = '<div id="youtube-player"></div>';
      }

      new window.YT.Player('youtube-player', {
        height: '1',
        width: '1',
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          listType: 'playlist',
          list: playlistId,
        },
        events: {
          onReady: (event: any) => {
            playerRef.current = event.target;
            setPlayer(event.target);
            setIsReady(true);
            updateCurrentItem(event.target);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setDuration(event.target.getDuration());
            } else {
              setIsPlaying(false);
            }
            // Update item info on states like PLAYING, CUED, UNSTARTED
            if ([window.YT.PlayerState.PLAYING, window.YT.PlayerState.CUED, window.YT.PlayerState.UNSTARTED].includes(event.data)) {
               updateCurrentItem(event.target);
            }
          }
        }
      });
    };

    const updateCurrentItem = (target: any) => {
        try {
            const videoData = target.getVideoData();
            if (videoData && videoData.video_id) {
              setCurrentItem({
                videoId: videoData.video_id,
                title: videoData.title || 'Unknown Title',
                artist: videoData.author || 'YouTube',
                thumbnail: `https://img.youtube.com/vi/${videoData.video_id}/maxresdefault.jpg`
              });
              return true;
            }
        } catch(e) {}
        return false;
    }

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, [playlistId]);

  // Poll for video data if missing
  useEffect(() => {
    let interval: number;
    if (isReady && !currentItem && playerRef.current) {
        interval = window.setInterval(() => {
            if (playerRef.current.getVideoData) {
               const videoData = playerRef.current.getVideoData();
               if (videoData && videoData.video_id) {
                   setCurrentItem({
                     videoId: videoData.video_id,
                     title: videoData.title || 'Unknown Title',
                     artist: videoData.author || 'YouTube',
                     thumbnail: `https://img.youtube.com/vi/${videoData.video_id}/maxresdefault.jpg`
                   });
               }
            }
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReady, currentItem]);

  // Update progress every second
  useEffect(() => {
    let interval: number;
    if (isPlaying && playerRef.current) {
      interval = window.setInterval(() => {
        setProgress(playerRef.current.getCurrentTime() || 0);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const nextTrack = () => {
      if (playerRef.current) playerRef.current.nextVideo();
  }
  const prevTrack = () => {
      if (playerRef.current) playerRef.current.previousVideo();
  }
  const seekTo = (time: number) => {
      if (playerRef.current) {
          playerRef.current.seekTo(time, true);
          setProgress(time);
      }
  };

  return {
    isReady,
    isPlaying,
    currentItem,
    progress,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo
  };
}
