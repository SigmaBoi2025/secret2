import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Intro from "./pages/Intro";
import MiniGameUnlock from "./pages/MiniGameUnlock";
import bgm from "./assets/sounds/bgm_intro.mp3";

export default function App() {
  const [capyExit, setCapyExit] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [miniCapiReady, setMiniCapiReady] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(bgm);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
  }, []);

  const handleIntroNext = () => {
    if (!musicStarted && audioRef.current) {
      audioRef.current.play();
      setMusicStarted(true);
    }

    setCapyExit(true);

    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }, 2500);

    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });

      //  🔥 0.8s sau scroll thì báo MiniGameUnlock bật Capi lên
      setTimeout(() => setMiniCapiReady(true), 800);

    }, 2500);
  };



  return (
    <AppContainer>
      <Section>
        <Intro onNext={handleIntroNext} capyExit={capyExit} />
      </Section>

      <Section>
        <MiniGameUnlock onNext={() => alert("🎉 Sang màn tiếp theo!")} showCapi={miniCapiReady} />
      </Section>
    </AppContainer>
  );
}

/* 🎨 Styled Components */
const AppContainer = styled.div`
  height: 200vh;
  width: 100vw;
  overflow-y: hidden;
  scroll-behavior: smooth;
`;

const Section = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
`;