'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
}

export default function AudioPlayer({ audioUrl, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const setAudioDuration = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // RTL: calculate from right
    const clickX = rect.right - e.clientX;
    const percentage = (clickX / rect.width) * 100;
    const newTime = (percentage / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(percentage);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`stone-card rounded-xl p-4 mb-8 transition-all duration-500 ${isPlaying ? 'glow-blue border-milky-blue/30' : ''}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying
              ? 'bg-milky-blue/20 text-milky-blue hover:bg-milky-blue/30'
              : 'bg-magma/20 text-magma hover:bg-magma/30'
          }`}
          aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ms-0.5" />}
        </button>

        {/* Info & Progress */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-silver-ash/80 font-medium">
              {title || 'موسيقى ملحمية بحتة خالية من الغناء'}
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-light">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            className="h-1.5 bg-stone-dark rounded-full cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                isPlaying ? 'bg-milky-blue' : 'bg-magma'
              }`}
              style={{ width: `${progress}%`, float: 'right' }}
            />
          </div>
        </div>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="p-2 text-stone-light hover:text-silver-ash transition-colors"
          aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
