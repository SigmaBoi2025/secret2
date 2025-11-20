import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import capibaraGame1 from "../assets/capybara/capybara_game1.png";

export default function HeartCatchGame({ onClose, onWin }) {
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState([]);
  const [basketX, setBasketX] = useState(50); // %
  const gameRef = useRef();

  // 🖼️ Preload Capybara image
  useEffect(() => {
    const img = new Image();
    img.src = capibaraGame1;
  }, []);

  // 💖 Spawn hearts (ít hơn, chậm hơn)
  useEffect(() => {
    const spawn = setInterval(() => {
      setHearts((prev) => [
        ...prev,
        {
          id: Math.random(),
          x: Math.random() * 90,
          y: 0,
        },
      ]);
    }, 1200); // 👈 xuất hiện chậm hơn
    return () => clearInterval(spawn);
  }, []);

  // 💞 Move hearts downward (rơi chậm hơn)
  useEffect(() => {
    const fall = setInterval(() => {
      setHearts((prev) =>
        prev
          .map((h) => ({ ...h, y: h.y + 1.8 })) // 👈 tốc độ rơi chậm hơn
          .filter((h) => h.y < 100)
      );
    }, 100);
    return () => clearInterval(fall);
  }, []);

  // 💗 Detect collision chính xác hơn
  useEffect(() => {
    const fall = setInterval(() => {
      setHearts((prev) => {
        let newHearts = [];
        let newScore = score;
        for (let h of prev) {
          const newY = h.y + 1.8;
          const nearBasket =
            Math.abs(newY - 85) < 5 && Math.abs(h.x - basketX) < 8;

          if (nearBasket) {
            newScore++;
          } else if (newY < 100) {
            newHearts.push({ ...h, y: newY });
          }
        }

        if (newScore !== score) {
          setScore(newScore);
          if (newScore >= 5) {
            confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
              onWin();
              onClose();
            }, 1000);
          }
        }
        return newHearts;
      });
    }, 100);
    return () => clearInterval(fall);
  }, [basketX, score]);

  // 🐹 Điều khiển bằng chuột hoặc cảm ứng
  const handleMove = (e) => {
    const rect = gameRef.current.getBoundingClientRect();
    const x =
      ((e.touches?.[0]?.clientX || e.clientX) - rect.left) / rect.width;
    setBasketX(Math.max(5, Math.min(95, x * 100)));
  };

  useEffect(() => {
    // Khoá scroll toàn màn hình
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      // Mở lại khi đóng game
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, []);

  return (
    <Overlay onClick={(e) => e.stopPropagation()}>
      <GameArea ref={gameRef} onMouseMove={handleMove} onTouchMove={handleMove}>
        <CloseButton onClick={onClose}>✖</CloseButton>
        {hearts.map((h) => (
          <Heart
            key={h.id}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            💖
          </Heart>
        ))}
        <Basket style={{ left: `${basketX}%` }}>
          <Capi src={capibaraGame1} alt="capybara" />
        </Basket>
        <Score>💗 {score} / 5</Score>
      </GameArea>
    </Overlay>
  );
}


/* 🌸 Styled Components – UI mới dạng pop-up đẹp */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 180, 205, 0.4);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  touch-action: none;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: auto;
`;

const GameArea = styled(motion.div)`
  position: relative;
  width: 80vw;
  height: 80vh;
  max-width: 520px;
  max-height: 750px;

  background: rgba(255, 255, 255, 0.25);
  border-radius: 28px;
  backdrop-filter: blur(16px);
  padding: 20px;
  overflow: hidden;
  box-shadow:
    0 8px 32px rgba(255, 105, 180, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.45);
  touch-action: none;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 18px;

  background: none;
  border: none;

  color: #ffffff;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;

  cursor: pointer;

  text-shadow:
    0 0 6px rgba(255, 140, 180, 0.9),
    0 0 10px rgba(255, 120, 160, 0.7);

  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.15);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const Heart = styled(motion.div)`
  position: absolute;
  font-size: 30px;
  pointer-events: none;
  text-shadow: 0 0 8px rgba(255,105,180,0.6);
`;

const Basket = styled.div`
  position: absolute;
  bottom: 3%;
  transform: translateX(-50%);
`;

const Capi = styled.img`
  width: 95px;
  height: auto;
  user-select: none;
  filter: drop-shadow(0 5px 10px rgba(255,105,180,0.35));
`;

const Score = styled.div`
  position: absolute;
  top: 12px;
  left: 18px;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  text-shadow:
    0 0 12px rgba(255,120,150,0.9),
    0 0 22px rgba(255,100,180,0.7);
`;
