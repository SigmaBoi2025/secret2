import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { capybaraIdle } from "../assets";
import bgm from "../assets/sounds/bgm_intro.mp3";

/* 💖 Floating hearts component */
const FloatingHearts = () => {
  const [hearts] = useState(() =>
    Array.from({ length: 25 }).map(() => ({
      id: Math.random(),
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 6 + Math.random() * 4,
      size: 14 + Math.random() * 18,
      drift: (Math.random() - 0.5) * 35,
    }))
  );

  return (
    <>
      {hearts.map((h) => (
        <FloatingHeart
          key={h.id}
          initial={{ y: "110vh", opacity: 0, scale: 0 }}
          animate={{
            y: "-10vh",
            x: [`${h.left}vw`, `${h.left + h.drift}vw`],
            opacity: [0, 0.7, 0.5, 0.3, 0],
            scale: [0, 1, 1, 1.1, 0.8],
            rotate: [0, 12, -12, 8, -8],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{ fontSize: h.size }}
        >
          💕
        </FloatingHeart>
      ))}
    </>
  );
};

/* 🎀 Main Intro Component */
export default function Intro({ onNext, capyExit }) {
  const [textVisible, setTextVisible] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [closingBubble, setClosingBubble] = useState(false);
  const fullText = "Hi Love, Do you want to see a little surprise for you?";

  // Show text after capybara enters
  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Typing effect - optimized
  useEffect(() => {
    if (!textVisible) return;

    let index = 0;
    const typeTimer = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < fullText.length) {
          setDisplayText(fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowButton(true), 700);
        }
      }, 50);
      return () => clearInterval(interval);
    }, 150);

    return () => clearTimeout(typeTimer);
  }, [textVisible, fullText]);

  const handleYes = () => {
    const audio = new Audio(bgm);
    audio.volume = 0.5;
    audio.play().catch(err => console.log("Audio play failed:", err));
    setClosingBubble(true); // bắt đầu đóng bubble

    // đợi bubble đóng xong (0.6–0.7s), rồi mới cho capi chạy
    setTimeout(() => {
      onNext();
    }, 700);
  };

  return (
    <Screen>
      <FloatingHearts />

      <CenterBox>
        <SpeechBubble
          initial={{ opacity: 0, scale: 0.7, y: -25 }}
          animate={
            closingBubble
              ? { opacity: 0, scale: 0.3, y: -20 }     // 🔥 hiệu ứng biến mất
              : textVisible
                ? { opacity: 1, scale: 1, y: 0 }       // trạng thái mở
                : { opacity: 0, scale: 0.7, y: -25 }
          }
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <BubbleContent>
            {displayText}
            <Cursor $visible={displayText.length < fullText.length}>|</Cursor>
          </BubbleContent>
          <BubbleTail />
        </SpeechBubble>

        <CapiWrapper
          initial={{ x: "-100vw" }}
          animate={
            capyExit
              ? { x: "100vw" } // 👉 Khi capyExit=true, chạy ra bên phải
              : { x: 0 } // Mặc định đứng giữa
          }
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <Capi
            animate={{
              y: capyExit ? 0 : [0, -6, 0, 3, 0],
              rotate: capyExit ? 0 : [0, 2, 0, -2, 0],
            }}
            transition={{
              duration: capyExit ? 1 : 2,
              ease: "easeInOut",
              repeat: capyExit ? 0 : Infinity,
            }}
            src={capybaraIdle}
            alt="capybara"
          />
        </CapiWrapper>

      </CenterBox>

      <YesButton
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: showButton ? 1 : 0,
          scale: showButton ? 1 : 0.5,
        }}
        transition={{ duration: 0.8, type: "spring", stiffness: 180 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 30px rgba(255, 20, 147, 0.7), 0 0 0 5px rgba(255, 255, 255, 0.4)",
        }}
        whileTap={{ scale: 0.93 }}
        onClick={handleYes}
        style={{ pointerEvents: showButton ? "auto" : "none" }}
      >
        <ButtonShine />
        <span>Em đồng ý 💖</span>
      </YesButton>
    </Screen>
  );
}

/* 🌸 Styled Components */

const Screen = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #ff9eb5 0%, #ffb6c1 50%, #ffc0cb 100%);
  overflow: hidden;
  font-family: "Dancing Script", cursive;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(255, 182, 193, 0.35) 0%, transparent 60%),
      radial-gradient(circle at 80% 70%, rgba(255, 192, 203, 0.3) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const FloatingHeart = styled(motion.div)`
  position: absolute;
  pointer-events: none;
  color: #ff7ea9;
  filter: drop-shadow(0 0 4px rgba(255, 105, 180, 0.5));
  z-index: 1;
`;

const CenterBox = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpeechBubble = styled(motion.div)`
  position: relative;
  margin-bottom: 28px;
`;

const BubbleContent = styled.div`
  padding: 24px 38px;
  min-height: 100px;
  min-width: 240px;
  font-size: 27px;
  color: #fff;
  font-weight: 700;
  line-height: 1.5;
  text-shadow: 0 2px 10px rgba(255, 20, 147, 0.4);

  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  border-radius: 25px;
  border: 2px solid rgba(255, 255, 255, 0.5);

  box-shadow:
    0 8px 32px rgba(255, 105, 180, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.6);

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media (max-width: 550px) {
    font-size: 23px;
    padding: 20px 30px;
    max-width: 85vw;
  }
`;

const Cursor = styled.span`
  display: inline-block;
  margin-left: 3px;
  opacity: ${props => props.$visible ? 1 : 0};
  animation: ${props => props.$visible ? 'blink 0.8s infinite' : 'none'};

  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
`;

const BubbleTail = styled.div`
  position: absolute;
  bottom: -18px;
  left: 58%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 20px solid rgba(255, 255, 255, 0.25);
  filter: drop-shadow(0 4px 8px rgba(255, 105, 180, 0.2));
`;

const CapiWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Capi = styled(motion.img)`
  width: 190px;
  filter: drop-shadow(0 8px 15px rgba(0, 0, 0, 0.3));

  @media (max-width: 450px) {
    width: 150px;
  }
`;

const YesButton = styled(motion.button)`
  position: absolute;
  /* bottom: 10%;
  left: 50%;
  transform: translateX(-50%); */
  bottom: calc(8% + 60px);
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 250px;
  height: 62px;

  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 26px;
  font-weight: 700;
  cursor: pointer;
  overflow: hidden;
  z-index: 10;
  font-family: "Dancing Script", cursive;

  box-shadow: 
    0 8px 25px rgba(255, 20, 147, 0.5),
    0 0 0 4px rgba(255, 255, 255, 0.3);

  span {
    position: relative;
    z-index: 2;
  }

  @media (max-width: 450px) {
    width: 220px;
    height: 56px;
    font-size: 23px;
  }
`;

const ButtonShine = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.45),
    transparent
  );
  animation: shine 3s infinite;

  @keyframes shine {
    0% { left: -100%; }
    50% { left: 100%; }
    100% { left: 100%; }
  }
`;

