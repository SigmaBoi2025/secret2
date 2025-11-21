import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import capibaraGame1 from "../assets/capybara/capybara_game1.png";

export default function HeartCatchGame({ onClose, onWin }) {
  const [objects, setObjects] = useState([]); // 🎂 + 💣 chung 1 list
  const [basketX, setBasketX] = useState(50);
  const [lives, setLives] = useState(3); // ❤️❤️❤️
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const gameRef = useRef();

  // 🖼️ Preload
  useEffect(() => {
    const img = new Image();
    img.src = capibaraGame1;
  }, []);

  // 🎂 + 💣 spawn
  useEffect(() => {
    if (gameOver) return;

    const spawn = setInterval(() => {
      const isCake = Math.random() < 0.75;
      setObjects((prev) => [
        ...prev,
        {
          id: Math.random(),
          x: Math.random() * 90,
          y: 0,
          type: isCake ? "cake" : "bomb",
        },
      ]);
    }, 1500);

    return () => clearInterval(spawn);
  }, [gameOver]);

  // Fall
  useEffect(() => {
    if (gameOver) return;

    const fall = setInterval(() => {
      setObjects((prev) =>
        prev
          .map((o) => ({ ...o, y: o.y + 2 }))
          .filter((o) => o.y < 100)
      );
    }, 100);

    return () => clearInterval(fall);
  }, [gameOver]);

  // Collision
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setObjects((prev) => {
        let newList = [];
        let newLives = lives;
        let newScore = score;

        for (let o of prev) {
          const newY = o.y + 2;
          const catchable =
            Math.abs(newY - 85) < 5 && Math.abs(o.x - basketX) < 8;

          if (catchable) {
            if (o.type === "cake") {
              newScore += 1;
            } else {
              newLives -= 1;
            }
          } else {
            if (newY < 100) {
              newList.push({ ...o, y: newY });
            }
          }
        }

        // Điểm
        if (newScore !== score) {
          setScore(newScore);
          if (newScore >= 5) {
            confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
              onWin();
              onClose();
            }, 800);
          }
        }

        // Mạng
        if (newLives !== lives) {
          setLives(newLives);
          setShake(true);
          setTimeout(() => setShake(false), 400);

          if (newLives <= 0) {
            setGameOver(true);
          }
        }

        return newList;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [basketX, lives, score, gameOver]);

  // Điều khiển
  const handleMove = (e) => {
    if (gameOver) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x =
      ((e.touches?.[0]?.clientX || e.clientX) - rect.left) / rect.width;
    setBasketX(Math.max(5, Math.min(95, x * 100)));
  };

  // Khoá scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Reset game
  const handleRetry = () => {
    setLives(3);
    setScore(0);
    setObjects([]);
    setGameOver(false);
  };

  return (
    <Overlay onClick={(e) => e.stopPropagation()}>
      <GameArea
        ref={gameRef}
        className={shake ? "shake" : ""}
        onMouseMove={handleMove}
        onTouchMove={handleMove}
      >
        <CloseButton onClick={onClose}>✖</CloseButton>

        {/* ❤️ Mạng */}
        <Lives>
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i}>❤️</span>
          ))}
        </Lives>

        {/* 🎂 + 💣 */}
        {objects.map((o) => (
          <FallingObj
            key={o.id}
            style={{ left: `${o.x}%`, top: `${o.y}%` }}
          >
            {o.type === "cake" ? "🎂" : "💣"}
          </FallingObj>
        ))}

        <Basket style={{ left: `${basketX}%` }}>
          <Capi src={capibaraGame1} alt="capybara" />
        </Basket>

        <Score>🎂 {score} / 5</Score>

        {/* 🔄 Nút chơi lại */}
        {gameOver && (
          <RetryButton onClick={handleRetry}>
            Chơi lại 🔄
          </RetryButton>
        )}
      </GameArea>
    </Overlay>
  );
}



/* 🌸 Giữ nguyên toàn bộ CSS gốc */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 180, 205, 0.4);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const GameArea = styled(motion.div)`
  position: relative;
  width: 80vw;
  height: 80vh;
  max-width: 520px;
  max-height: 750px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 28px;
  padding: 20px;
  overflow: hidden;

  &.shake {
    animation: shakeAnim 0.4s ease;
  }

  @keyframes shakeAnim {
    0% { transform: translateX(0); }
    20% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    60% { transform: translateX(-10px); }
    80% { transform: translateX(10px); }
    100% { transform: translateX(0); }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 18px;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 32px;
  cursor: pointer;
`;

const FallingObj = styled(motion.div)`
  position: absolute;
  font-size: 34px;
  pointer-events: none;
`;

const Basket = styled.div`
  position: absolute;
  bottom: 3%;
  transform: translateX(-50%);
`;

const Capi = styled.img`
  width: 95px;
  filter: drop-shadow(0 5px 10px rgba(255,105,180,0.35));
`;

const Score = styled.div`
  position: absolute;
  top: 12px;
  left: 18px;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
`;

const Lives = styled.div`
  position: absolute;
  top: 48px;
  left: 18px;
  font-size: 26px;
  display: flex;
  gap: 6px;
`;

const RetryButton = styled.button`
  position: absolute;
  bottom: 40%;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 26px;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #ff8fb2, #ff5fa3);
  border: none;
  border-radius: 24px;
  box-shadow: 0 6px 14px rgba(255, 100, 150, 0.35);
  cursor: pointer;

  &:hover {
    transform: translateX(-50%) scale(1.05);
  }
`;
