import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Home from "@/pages/Home";
import Letter from "@/pages/Letter";

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const starter = () => {
      if (!playing && audioRef.current) {
        audioRef.current
          .play()
          .then(() => setPlaying(true))
          .catch(() => {});
      }
      window.removeEventListener("click", starter);
      window.removeEventListener("touchstart", starter);
      window.removeEventListener("keydown", starter);
      window.removeEventListener("wheel", starter);
    };
    window.addEventListener("click", starter, { once: false });
    window.addEventListener("touchstart", starter, { once: false });
    window.addEventListener("keydown", starter, { once: false });
    window.addEventListener("wheel", starter, { once: false });
    return () => {
      window.removeEventListener("click", starter);
      window.removeEventListener("touchstart", starter);
      window.removeEventListener("keydown", starter);
      window.removeEventListener("wheel", starter);
    };
  }, [playing]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/letter" element={<Letter />} />
        </Routes>
      </Router>

      <audio
        ref={audioRef}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/viper.mp3"
        preload="auto"
        loop
        crossOrigin="anonymous"
      />

      <div className="fixed top-4 right-4 z-50">
        <button
          aria-label={playing ? "暂停背景音乐" : "播放背景音乐"}
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full border border-pink-200 bg-white/70 backdrop-blur shadow flex items-center justify-center text-pink-600 hover:bg-white transition-colors ${
            playing ? "animate-pulse" : ""
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            {playing ? (
              <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
            ) : (
              <path d="M8 5v14l11-7-11-7z" />
            )}
          </svg>
        </button>
      </div>
    </>
  );
}
