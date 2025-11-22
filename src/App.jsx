import { useRef } from "react";
import styled from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Intro from "./pages/Intro";
import MiniGameUnlock from "./pages/MiniGameUnlock";

import bgm_intro from "./assets/sounds/bgm_intro.mp3";
import bgm_happy from "./assets/sounds/bgm_happy.mp3";
import GalleryHeart from "./pages/GalleryHeart";
import Letter from "./pages/Letter";

export default function App() {
  const audioRef = useRef(null);

  /* ------------ Music Control ------------- */

  const playMusic = (src, loop = true) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = 0.5;

    audioRef.current = audio;
    audio.play().catch(() => { });
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  /* ------------ Scene handlers ------------- */

  const handleIntroNext = (navigate) => {
    playMusic(bgm_intro);
    navigate("/unlock");
  };

  const handleUnlockNext = (navigate) => {
    stopMusic();
    playMusic(bgm_happy);
    navigate("/gallery");
  };

  return (
    <BrowserRouter>
      <AppContainer>
        <Routes>
          <Route path="/" element={
            <Intro onNext={handleIntroNext} />
          } />

          <Route path="/unlock" element={
            <MiniGameUnlock
              onNext={handleUnlockNext}
              playMusic={playMusic}
              stopMusic={stopMusic}
              showCapi={true}
            />
          } />
          <Route path="/gallery" element={<GalleryHeart />} />
          <Route path="/letter" element={<Letter />} />
        </Routes>

      </AppContainer>
    </BrowserRouter>
  );
}

/* 🎨 Container */
const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;
