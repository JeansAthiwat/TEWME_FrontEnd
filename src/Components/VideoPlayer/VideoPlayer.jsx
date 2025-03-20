import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';

const VideoPlayer = ({ src, title, className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  const handleProgress = (state) => {
    setProgress(state.played * 100);
    setCurrentTime(state.playedSeconds);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    playerRef.current.seekTo(pos);
    setProgress(pos * 100);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setShowPauseIcon(true);
      setTimeout(() => setShowPauseIcon(false), 500);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative video-player-container rounded-lg overflow-hidden shadow-lg ${className}`}
      onClick={handlePlayPause}
      onDoubleClick={toggleFullscreen}
    >
      <ReactPlayer
        ref={playerRef}
        url={src}
        playing={isPlaying}
        controls={false}
        width="100%"
        height="100%"
        onProgress={handleProgress}
        onDuration={setDuration}
        onEnded={() => setIsPlaying(false)}
        volume={isMuted ? 0 : volume}
        playbackRate={playbackRate}
      />
      {showPauseIcon && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <FaPause size={50} className="text-white opacity-80" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent video-controls">
        <div className="video-progress h-1 bg-gray-600 cursor-pointer rounded" onClick={handleSeek}>
          <div className="h-1 bg-red-500 rounded" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex items-center justify-between text-white mt-2">
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
              {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
            </button>
            <button onClick={() => setIsMuted(!isMuted)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
              {isMuted || volume === 0 ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-2 mx-2 bg-gray-800 rounded-lg cursor-pointer"
            />
          </div>
          <div className="text-sm font-medium">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="bg-gray-700 text-white p-1 rounded-md text-sm cursor-pointer"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
            <button onClick={toggleFullscreen} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
              {isFullscreen ? <FaCompress size={18} /> : <FaExpand size={18} />}
            </button>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <h2 className="text-white font-semibold text-lg">{title}</h2>
      </div>
    </div>
  );
};

export default VideoPlayer;