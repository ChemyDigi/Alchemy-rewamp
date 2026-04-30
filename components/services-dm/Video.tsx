"use client";

import { useRef, useState } from "react";

export default function VideoBlock() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <div className="w-full max-w-[1300px] mx-auto px-4 pt-20">
      
      <div className="relative rounded-2xl overflow-hidden group">
        
        {/* VIDEO */}
        <video
          ref={videoRef}
          className="w-full h-auto object-cover"
          src="/showreel.mp4" // 👉 replace with your video
          controls={playing}
        />

        {/* PLAY BUTTON OVERLAY */}
        {!playing && (
          <button
            onClick={handlePlay}
            className="
              absolute inset-0 flex items-center justify-center
              bg-black/20 hover:bg-black/30 transition
            "
          >
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              ▶
            </div>
          </button>
        )}

      </div>

    </div>
  );
}