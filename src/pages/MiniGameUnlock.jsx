import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { capybaraIdle } from "../assets";
import HeartCatchGame from "../components/HeartCatchGame";
import RiddleGame from "../components/RiddleGame";
import { saveGameProgress, getGameProgress } from "../utils/localStorage";

/* 🩷 Trang Mini Game Unlock */
export default function MiniGameUnlock({ onNext, showCapi: showCapiProp }) {
  const [gameResults, setGameResults] = useState([false, false, false, false]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hearts, setHearts] = useState([]);
  const [showCapi, setShowCapi] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [displayTitle, setDisplayTitle] = useState("");
  const [startTitle, setStartTitle] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [startSubtitle, setStartSubtitle] = useState(false);
  const [startGrid, setStartGrid] = useState(false);
  const [startPassword, setStartPassword] = useState(false);
  const fullTitle = "Giải mã bí mật của Capybara";

  const [subtitleText, setSubtitleText] = useState("");
  const fullSubtitle = "Nhấn vào các ô để mở khóa!";

  const [showHeartGame, setShowHeartGame] = useState(false);
  const [activeGame, setActiveGame] = useState(null);


  const correctCode = "1608";

  /* 💖 Tạo trái tim bay */
  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 1,
        duration: 5 + Math.random() * 3,
        size: 12 + Math.random() * 15,
      };
      setHearts((prev) => [...prev, newHeart]);

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, (newHeart.duration + newHeart.delay) * 1000);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!startTitle) return;

    let index = 0;
    setTitleVisible(true);

    const interval = setInterval(() => {
      if (index < fullTitle.length) {
        setDisplayTitle(fullTitle.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTypingDone(true);

        // Sau khi gõ xong 250ms → hiện subtitle
        setTimeout(() => setStartSubtitle(true), 250);

        // Sau subtitle 400ms → hiện grid
        setTimeout(() => setStartGrid(true), 650);

        // Sau grid khoảng 700ms → hiện password section
        setTimeout(() => setStartPassword(true), 1300);
      }
    }, 55);

    return () => clearInterval(interval);
  }, [startTitle]);

  useEffect(() => {
    if (!startSubtitle) return;

    let index = 0;

    const interval = setInterval(() => {
      if (index < fullSubtitle.length) {
        setSubtitleText(fullSubtitle.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 35); // typing nhanh hơn tiêu đề cho đẹp

    return () => clearInterval(interval);
  }, [startSubtitle]);

  useEffect(() => {
    if (showCapiProp) {
      // Cho Capi nhô lên trước
      setTimeout(() => {
        setShowCapi(true);

        // Sau khi Capi nhô khoảng 1.4s → bắt đầu typing tiêu đề
        setTimeout(() => setStartTitle(true), 1400);

      }, 200);
    }
  }, [showCapiProp]);

  // const handleMiniGameClick = (index) => {
  //   const newResults = [...gameResults];
  //   newResults[index] = true;
  //   setGameResults(newResults);
  // };

  const handleMiniGameClick = (index) => {
    setActiveGame(index);
  };

  const handleMiniGameWin = (index) => {
    const newResults = [...gameResults];
    newResults[index] = true;
    setGameResults(newResults);
    localStorage.setItem("gameProgress", JSON.stringify(newResults));
  };

  const handleContinue = () => {
    if (password === correctCode) {
      onNext();
    } else {
      setError("Mật khẩu sai rồi 😝");
      setTimeout(() => setError(""), 2000);
    }
  };

  const allUnlocked = gameResults.every((r) => r);



  return (
    <Screen>
      {showCapi && (
        <CapiPeek
          initial={{ y: "105%", opacity: 0, scale: 1.1 }}
          animate={{ y: "50%", opacity: 1, scale: 1.25 }}
          transition={{
            duration: 1.4,
            type: "spring",
            stiffness: 120
          }}
        >
          <img src={capybaraIdle} alt="capi" />
        </CapiPeek>
      )}
      {/* 💖 Trái tim bay nền */}
      {hearts.map((heart) => (
        <FloatingHeart
          key={heart.id}
          initial={{
            y: "110vh",
            x: `${heart.left}vw`,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.6, 0.6, 0.4, 0],
            scale: [0, 1, 1, 1.1, 0.7],
            rotate: [0, 10, -10, 5, -5],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            ease: "easeOut"
          }}
          style={{
            fontSize: `${heart.size}px`
          }}
        >
          💕
        </FloatingHeart>
      ))}

      <Container
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={
            titleVisible
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: -10, scale: 0.9 }
          }
          transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
        >
          🔐 {displayTitle}
          {displayTitle.length < fullTitle.length && <Cursor>|</Cursor>}
        </Title>

        {startSubtitle && (
          <Subtitle
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {subtitleText}
          </Subtitle>
        )}

        <GameGrid>
          {gameResults.map((won, i) => (
            <CardButton
              key={i}
              onClick={() => handleMiniGameClick(i)}
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.92 }}
              $unlocked={won}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={startGrid ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
              transition={{ delay: startGrid ? i * 0.12 : 0, duration: 0.5 }}
            >
              <CardContent>
                {won ? (
                  <GameNumber
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {["1", "6", "0", "8"][i]}
                  </GameNumber>
                ) : (
                  <QuestionMark
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ?
                  </QuestionMark>
                )}
                {won && <Sparkle>✨</Sparkle>}
              </CardContent>
            </CardButton>
          ))}
        </GameGrid>

        <PasswordSection
          // initial={{ opacity: 0, y: 20 }}
          // animate={{
          //   opacity: allUnlocked ? 1 : 0.4,
          //   y: allUnlocked ? 0 : 20
          // }}
          // transition={{ duration: 0.5 }}
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={startPassword ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <PasswordLabel>Nhập mật khẩu 4 chữ số:</PasswordLabel>
          <PasswordInput
            type="text"
            maxLength="4"
            placeholder="••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!allUnlocked}
            $error={!!error}
          />
          <ContinueButton
            whileHover={allUnlocked ? { scale: 1.08 } : {}}
            whileTap={allUnlocked ? { scale: 0.95 } : {}}
            onClick={handleContinue}
            disabled={!allUnlocked || password.length !== 4}
            $disabled={!allUnlocked || password.length !== 4}
          >
            <ButtonShine />
            <span>Tiếp tục 💖</span>
          </ContinueButton>
          {error && (
            <ErrorText
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </ErrorText>
          )}
        </PasswordSection>
      </Container>
      {activeGame === 0 && (
        <HeartCatchGame
          onClose={() => setActiveGame(null)}
          onWin={() => handleMiniGameWin(0)}
        />
      )}

      {activeGame === 1 && (
        <RiddleGame
          onClose={() => setActiveGame(null)}
          onWin={() => handleMiniGameWin(1)}
        />
      )}
    </Screen>
  );
}

/* 🎨 Styled Components */
const Screen = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #ff9eb5 0%, #ffb6c1 50%, #ffc0cb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Dancing Script", cursive;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(255, 182, 193, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 192, 203, 0.3) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const CapiPeek = styled(motion.div)`
  position: absolute;
  bottom: 140px;
  left: 0;
  width: clamp(140px, 22vw, 230px);
  height: auto;
  z-index: 15;
  pointer-events: none;

  img {
    width: 100%;
    height: auto;
    transform: translate(-25px, 15px) scale(1.25);
    filter: drop-shadow(0 6px 12px rgba(0,0,0,0.35));
  }

  @media (max-width: 450px) {
    width: 150px;
    img {
      transform: translate(-18px, 10px) scale(1.15);
    }
  }
`;

const FloatingHeart = styled(motion.div)`
  position: absolute;
  pointer-events: none;
  filter: drop-shadow(0 0 3px rgba(255, 105, 180, 0.4));
  z-index: 1;
`;

const Container = styled(motion.div)`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(motion.h1)`
  color: white;
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  padding: 0 20px;
  
  @media (max-width: 500px) {
    font-size: 32px;
    margin-bottom: 18px;
  }
`;

const Subtitle = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 20px;
  margin-bottom: 40px;
  text-shadow: 0 2px 8px rgba(255, 105, 180, 0.3);
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 140px);
  gap: 20px;
  margin-bottom: 50px;
  
  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 120px);
    gap: 15px;
  }
`;

const CardContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardButton = styled(motion.div)`
  width: 140px;
  height: 120px;
  border-radius: 20px;
  background: ${props => props.$unlocked
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 182, 193, 0.3) 100%)'
    : 'rgba(255, 255, 255, 0.2)'
  };
  backdrop-filter: blur(10px);
  border: 2px solid ${props => props.$unlocked
    ? 'rgba(255, 255, 255, 0.5)'
    : 'rgba(255, 255, 255, 0.3)'
  };
  box-shadow: ${props => props.$unlocked
    ? '0 8px 25px rgba(255, 105, 180, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
    : '0 4px 15px rgba(255, 100, 150, 0.3)'
  };
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
  font-size: 36px;
  font-weight: 600;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: ${props => props.$unlocked
    ? 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
    : 'none'
  };
    animation: ${props => props.$unlocked ? 'glow 2s ease-in-out infinite' : 'none'};
  }

  @keyframes glow {
    0%, 100% { transform: translate(0, 0); opacity: 0; }
    50% { transform: translate(-25%, -25%); opacity: 1; }
  }
  
  @media (max-width: 400px) {
    width: 120px;
    height: 100px;
  }
`;

const GameNumber = styled(motion.span)`
  font-size: 60px;
  font-weight: 700;
  color: #fff;
  text-shadow: 
    0 0 20px rgba(255, 105, 180, 0.8),
    0 0 40px rgba(255, 20, 147, 0.5);
  position: relative;
  z-index: 2;
`;

const QuestionMark = styled(motion.span)`
  font-size: 50px;
  opacity: 0.5;
  font-weight: 600;
`;

const Sparkle = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 20px;
  animation: sparkle 1.5s ease-in-out infinite;
  
  @keyframes sparkle {
    0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
    50% { opacity: 0.5; transform: scale(1.2) rotate(180deg); }
  }
`;

const PasswordSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 30px 40px;
  box-shadow: 0 8px 32px rgba(255, 105, 180, 0.3);
`;

const PasswordLabel = styled.div`
  color: white;
  font-size: 22px;
  margin-bottom: 15px;
  font-weight: 600;
  text-shadow: 0 2px 8px rgba(255, 105, 180, 0.4);
`;

const PasswordInput = styled.input`
  width: 200px;
  height: 55px;
  border-radius: 15px;
  border: 2px solid ${props => props.$error
    ? 'rgba(255, 100, 100, 0.6)'
    : 'rgba(255, 255, 255, 0.4)'
  };
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
  outline: none;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-weight: 700;
  letter-spacing: 8px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  font-family: 'Arial', sans-serif;

  &:focus {
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 0 20px rgba(255, 105, 180, 0.5);
    transform: scale(1.02);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ::placeholder {
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 4px;
  }
`;

const ContinueButton = styled(motion.button)`
  position: relative;
  background: ${props => props.$disabled
    ? 'linear-gradient(135deg, #ccc 0%, #aaa 100%)'
    : 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)'
  };
  border: none;
  border-radius: 50px;
  padding: 14px 40px;
  font-size: 24px;
  color: white;
  font-weight: 700;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  box-shadow: ${props => props.$disabled
    ? '0 4px 10px rgba(0, 0, 0, 0.2)'
    : '0 6px 20px rgba(255, 20, 147, 0.5)'
  };
  font-family: "Dancing Script", cursive;
  overflow: hidden;
  opacity: ${props => props.$disabled ? 0.6 : 1};
  
  span {
    position: relative;
    z-index: 1;
  }
`;

const ButtonShine = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shine 3s infinite;
  
  @keyframes shine {
    0% { left: -100%; }
    50% { left: 100%; }
    100% { left: 100%; }
  }
`;

const ErrorText = styled(motion.div)`
  color: #fff;
  background: rgba(255, 100, 100, 0.3);
  border: 1px solid rgba(255, 100, 100, 0.5);
  padding: 8px 20px;
  border-radius: 20px;
  margin-top: 15px;
  font-size: 18px;
  font-weight: 600;
  backdrop-filter: blur(5px);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

const Cursor = styled.span`
  display: inline-block;
  margin-left: 3px;
  width: 10px;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  animation: ${(p) => (p.$visible ? "blink 0.8s infinite" : "none")};

  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
`;