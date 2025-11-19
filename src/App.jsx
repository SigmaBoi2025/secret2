import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import Intro from "./pages/Intro";
import MiniGameUnlock from "./pages/MiniGameUnlock";

export default function App() {
  const [capyExit, setCapyExit] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Chuẩn bị nhạc nền
    audioRef.current = new Audio("/src/assets/sounds/bgm_intro.mp3");
    audioRef.current.volume = 0.5;
    audioRef.current.loop = true;
  }, []);

  const handleNext = () => {
    // Bật nhạc khi nhấn YES
    if (!musicStarted) {
      audioRef.current.play();
      setMusicStarted(true);
    }

    // Capybara rời màn hình
    setCapyExit(true);

    // Sau 2.5s thì cuộn xuống mini game
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }, 2500);
  };

  return (
    <AppContainer>
      {/* Màn 1: Intro */}
      <Section>
        <Intro onNext={handleNext} capyExit={capyExit} />
      </Section>

      {/* Màn 2: Mini Game Unlock */}
      <Section>
        <MiniGameUnlock onNext={() => alert("🎉 Sang màn tiếp theo!")} />
      </Section>
    </AppContainer>
  );
}

/* ✅ Styled Components */
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
