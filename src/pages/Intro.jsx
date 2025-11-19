import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { bgIntro, capybaraIdle } from "../assets";
import bgm from "../assets/sounds/bgm_intro.mp3";

/* ❤️ Floating hearts component */
const FloatingHearts = () => {
  const [hearts] = useState(() =>
    Array.from({ length: 25 }).map(() => ({
      id: Math.random().toString(36).slice(2),
      x: Math.random() * window.innerWidth,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 5, // 👈 Bay chậm hơn
      size: 18 + Math.random() * 20,
      drift: Math.random() * 80 - 40,
      opacity: 0.2 + Math.random() * 0.6, // 👈 Ngẫu nhiên từ 0.2–0.8
    }))
  );

  return (
    <>
      {hearts.map((h) => (
        <Heart
          key={h.id}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{
            y: ["110vh", "-130vh"],
            x: [h.x, h.x + h.drift],
            opacity: [h.opacity, h.opacity + 0.05, h.opacity],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: h.x,
            fontSize: h.size,
            opacity: h.opacity,
          }}
        >
          💖
        </Heart>
      ))}
    </>
  );
};

/* 🎀 Main Intro Component */
export default function Intro({ onNext, capyExit }) {
  const [textVisible, setTextVisible] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const fullText = "Hi Love, Do you want to see a little surprise for you?";

  useEffect(() => {
    const showTextTimer = setTimeout(() => setTextVisible(true), 3000);
    return () => clearTimeout(showTextTimer);
  }, []);

  useEffect(() => {
    if (!textVisible) return;

    let index = -1;
    let timer;
    const startTyping = setTimeout(() => {
      timer = setInterval(() => {
        index++;
        if (index < fullText.length) {
          setDisplayText((prev) => prev + fullText.charAt(index));
        } else {
          clearInterval(timer);
          setTimeout(() => setShowButton(true), 800);
        }
      }, 60);
    }, 100);

    return () => {
      clearTimeout(startTyping);
      clearInterval(timer);
    };
  }, [textVisible]);

  const handleYes = () => {
    const audio = new Audio(bgm);
    audio.volume = 0.5;
    audio.play();
    onNext();
  };

  return (
    <Screen>
      <FloatingHearts />
      <CenterBox>
        <SpeechBubble
          initial={{ opacity: 0 }}
          animate={{ opacity: textVisible ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {displayText}
        </SpeechBubble>

        {/* <CapiWrapper
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ duration: 3, ease: "easeOut" }}
        >
          <Capi
            animate={{
              y: [0, -6, 0, 3, 0],
              rotate: [0, 2, 0, -2, 0],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            src={capybaraIdle}
            alt="capybara"
          />
        </CapiWrapper> */}
        <CapiWrapper
          initial={{ x: "-100vw" }}
          animate={
            capyExit
              ? { x: "-150vw", rotate: -10, opacity: 0 }
              : { x: 0 }
          }
          transition={{ duration: 2.5, ease: "easeInOut" }}
        >
          <Capi
            animate={
              capyExit
                ? {}
                : {
                  y: [0, -6, 0, 3, 0],
                  rotate: [0, 2, 0, -2, 0],
                }
            }
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: capyExit ? 0 : Infinity,
            }}
            src={capybaraIdle}
            alt="capybara"
          />
        </CapiWrapper>
      </CenterBox>

      <YesButton
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showButton ? 1 : 0,
          scale: showButton ? 1 : 0.8,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{
          scale: 1.08,
          boxShadow: "0 0 20px rgba(255,150,180,0.9)",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={handleYes}
        style={{
          pointerEvents: showButton ? "auto" : "none",
        }}
      >
        Em đồng ý
      </YesButton>
    </Screen>
  );
}

/* 🌸 Styled Components */
const Screen = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(180deg, #ffb6c1 0%, #ff94a6 100%), url(${bgIntro});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  font-family: "Dancing Script", cursive;
`;

const CenterBox = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 2;
`;

/* 💬 Speech Bubble with tail */
const SpeechBubble = styled(motion.div)`
  position: relative;
  min-width: 130%;
  min-height: 100px;
  margin-bottom: 25px;
  padding: 18px 32px;
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.6;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(255, 100, 150, 0.4);
  word-wrap: break-word;

  /* 🩷 Tail */
  &::after {
    content: "";
    position: absolute;
    bottom: -18px;
    left: 70%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 14px solid transparent;
    border-right: 14px solid transparent;
    border-top: 18px solid rgba(255, 255, 255, 0.25);
  }
`;

const CapiWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Capi = styled(motion.img)`
  width: 180px;
  height: auto;
  z-index: 2;
  @media (max-width: 400px) {
    width: 140px;
  }
`;

const Heart = styled(motion.span)`
  position: absolute;
  bottom: 0;
  color: #ff82a9;
  z-index: 1;
  pointer-events: none;
  text-shadow: 0 0 6px rgba(255, 120, 150, 0.6);
`;

const YesButton = styled(motion.button)`
  position: absolute;
  bottom: calc(8% + 60px);
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 220px;
  background: linear-gradient(135deg, #ff8fb2, #ff5fa3);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 22px;
  padding: 14px 30px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 6px 15px rgba(255, 130, 170, 0.6);
  text-shadow: 0 2px 6px rgba(255, 100, 150, 0.5);
  transition: all 0.3s ease;
  z-index: 2;
`;
