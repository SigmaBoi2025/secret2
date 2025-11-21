import { useEffect, useState } from "react";
import styled from "styled-components";
import confetti from "canvas-confetti";
import img1 from "../assets/photos/game4_1.jpg";
import img2 from "../assets/photos/game4_2.jpg";
import img3 from "../assets/photos/game4_3.jpg";
import img4 from "../assets/photos/game4_4.jpg";
import img5 from "../assets/photos/game4_5.jpg";
import img6 from "../assets/photos/game4_6.jpg";

const images = [img1, img2, img3, img4, img5, img6];

export default function MemoryFlipGame({ onClose, onWin }) {
  // tạo 2 bản của mỗi ảnh để làm cặp
  const [cards, setCards] = useState(() =>
    [...images, ...images]
      .map((img, index) => ({ id: index, img, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5)
  );

  const [flipped, setFlipped] = useState([]); // lưu 2 thẻ đang lật

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;

      // dùng setTimeout để tránh setState trong cùng vòng render
      setTimeout(() => {
        if (cards[first].img === cards[second].img) {
          setCards((prev) =>
            prev.map((c, i) =>
              i === first || i === second ? { ...c, matched: true } : c
            )
          );
        } else {
          setCards((prev) =>
            prev.map((c, i) =>
              i === first || i === second ? { ...c, flipped: false } : c
            )
          );
        }

        setFlipped([]); // reset lại mảng flipped
      }, 500); // delay nhẹ để nhìn thấy animation lật
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (cards.every((c) => c.matched)) {
      setTimeout(() => {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setTimeout(() => {
          onWin();
          onClose();
        }, 1000);
      }, 300);
    }
  }, [cards]);

  const handleFlip = (index) => {
    if (flipped.length === 2) return;
    if (cards[index].flipped || cards[index].matched) return;

    setCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, flipped: true } : c))
    );
    setFlipped((prev) => [...prev, index]);
  };

  return (
    <Overlay>
      <Modal>
        <CloseButton onClick={onClose}>✖</CloseButton>
        <Board>
          {cards.map((card, index) => (
            <Card key={card.id} onClick={() => handleFlip(index)}>
              {card.flipped || card.matched ? (
                <CardFront style={{ backgroundImage: `url(${card.img})` }} />
              ) : (
                <CardBack>💖</CardBack>
              )}
            </Card>
          ))}
        </Board>
      </Modal>
    </Overlay>
  );
}

/* 🌸 Styled Components */
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

const Modal = styled.div`
  position: relative;
  width: 80vw;
  height: 80vh;
  max-width: 520px;
  max-height: 750px;

  background: rgba(255, 255, 255, 0.25);
  border-radius: 28px;
  padding: 34px 28px;
  text-align: center;

  backdrop-filter: blur(16px);
  border: 2px solid rgba(255, 255, 255, 0.45);
  box-shadow:
    0 10px 32px rgba(255, 100, 170, 0.35),
    inset 0 2px 0 rgba(255, 255, 255, 0.5);

  display: flex;
  flex-direction: column;
  align-items: center;
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


const Board = styled.div`
  margin-top: 80px;
  display: grid;
  grid-template-columns: repeat(4, 70px);
  grid-template-rows: repeat(3, 90px);
  gap: 12px;
  justify-content: center;
`;

const Card = styled.div`
  width: 70px;
  height: 90px;
  perspective: 1000px;
  cursor: pointer;
`;

const CardFront = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(255, 150, 200, 0.5);
  transition: transform 0.4s ease;
`;

const CardBack = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ff9eb5, #ff6fa8);
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(255, 150, 200, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;
`;
