// import { useState, useRef } from "react";
// import styled from "styled-components";
// import { motion } from "framer-motion";

// import Intro from "./pages/Intro";
// import MiniGameUnlock from "./pages/MiniGameUnlock";

// import bgm_intro from "./assets/sounds/bgm_intro.mp3";
// import bgm_happy from "./assets/sounds/bgm_happy.mp3";

// export default function App() {
//   const [capyExit, setCapyExit] = useState(false);
//   const [miniCapiReady, setMiniCapiReady] = useState(false);

//   const audioRef = useRef(null);

//   /* ------------------ MUSIC CONTROL CENTER ------------------ */

//   const playMusic = (src, loop = true) => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//     }
//     const audio = new Audio(src);
//     audio.loop = loop;
//     audio.volume = 0.5;
//     audioRef.current = audio;
//     audio.play().catch(() => { });
//   };

//   const stopMusic = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current = null;
//     }
//   };

//   /* ------------------ HANDLE SCENE 1 -> SCENE 2 ------------------ */

//   const handleIntroNext = () => {
//     playMusic(bgm_intro);

//     setCapyExit(true);

//     setTimeout(() => {
//       window.scrollTo({
//         top: window.innerHeight,
//         behavior: "smooth",
//       });

//       setTimeout(() => setMiniCapiReady(true), 800);
//     }, 2500);
//   };

//   /* ------------------ HANDLE SCENE 2 -> NEXT SCREEN ------------------ */

//   const handleContinueNext = () => {
//     stopMusic();           // tắt nhạc intro
//     playMusic(bgm_happy);  // bật nhạc happy
//     alert("🎉 Sang màn tiếp theo!");
//   };

//   return (
//     <AppContainer>
//       <Section>
//         <Intro onNext={handleIntroNext} capyExit={capyExit} />
//       </Section>

//       <Section>
//         <MiniGameUnlock
//           onNext={handleContinueNext}
//           showCapi={miniCapiReady}
//           playMusic={playMusic}
//           stopMusic={stopMusic}
//         />
//       </Section>
//     </AppContainer>
//   );
// }

// /* 🎨 Styled Components */
// const AppContainer = styled.div`
//   height: 200vh;
//   width: 100vw;
//   overflow-y: hidden;
//   scroll-behavior: smooth;
// `;

// const Section = styled(motion.div)`
//   height: 100vh;
//   width: 100vw;
//   position: relative;
//   overflow: hidden;
// `;

import { useRef } from "react";
import styled from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Intro from "./pages/Intro";
import MiniGameUnlock from "./pages/MiniGameUnlock";

import bgm_intro from "./assets/sounds/bgm_intro.mp3";
import bgm_happy from "./assets/sounds/bgm_happy.mp3";

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

  const handleUnlockNext = () => {
    stopMusic();
    playMusic(bgm_happy);
    alert("🎉 Sang màn tiếp theo!");
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
