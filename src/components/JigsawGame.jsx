import { useState, useEffect } from "react";
import styled from "styled-components";
import confetti from "canvas-confetti";
import game3 from "../assets/photos/game3.jpg";

export default function JigsawGame({ onClose, onWin }) {
  const gridSize = 3;
  const totalPieces = gridSize * gridSize;
  const pieces = Array.from({ length: totalPieces }, (_, i) => i);

  const [slots, setSlots] = useState(Array(totalPieces).fill(null));
  const [shuffled, setShuffled] = useState(() =>
    pieces.sort(() => Math.random() - 0.5)
  );
  const [selectedPiece, setSelectedPiece] = useState(null);

  /* 🎉 Kiểm tra thắng */
  useEffect(() => {
    if (slots.every((s) => s !== null)) {
      const isComplete = slots.every((s, i) => s === i);
      if (isComplete) {
        setTimeout(() => {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          setTimeout(() => {
            onWin();
            onClose();
          }, 1000);
        }, 300);
      }
    }
  }, [slots]);

  const getBgPosition = (id) => {
    const row = Math.floor(id / gridSize);
    const col = id % gridSize;
    return `${(col * 100) / (gridSize - 1)}% ${(row * 100) / (gridSize - 1)}%`;
  };

  const handleSelectPiece = (id) => {
    setSelectedPiece(id);
  };

  const handlePlacePiece = (index) => {
    if (selectedPiece === null) return;

    if (slots[index] !== null) {
      const currentPiece = slots[index];
      setSlots((prev) => {
        const newSlots = [...prev];
        newSlots[index] = selectedPiece;
        return newSlots;
      });
      setShuffled((prev) => {
        const newSet = [...prev];
        const idx = newSet.indexOf(selectedPiece);
        if (idx !== -1) newSet[idx] = currentPiece;
        return newSet;
      });
    } else {
      setSlots((prev) => {
        const newSlots = [...prev];
        newSlots[index] = selectedPiece;
        return newSlots;
      });
      setShuffled((prev) => prev.filter((p) => p !== selectedPiece));
    }
    setSelectedPiece(null);
  };

  const handleRemovePiece = (index) => {
    const piece = slots[index];
    if (piece === null) return;
    setSlots((prev) => {
      const newSlots = [...prev];
      newSlots[index] = null;
      return newSlots;
    });
    setShuffled((prev) => [...prev, piece]);
  };

  return (
    <Overlay onClick={(e) => e.stopPropagation()}>
      <Modal>
        <CloseButton onClick={onClose}>✖</CloseButton>
        <Board>
          {slots.map((slot, i) => (
            <DropZone
              key={i}
              onClick={() =>
                slot !== null ? handleRemovePiece(i) : handlePlacePiece(i)
              }
            >
              {slot !== null && (
                <Piece style={{ backgroundPosition: getBgPosition(slot) }} />
              )}
            </DropZone>
          ))}
        </Board>

        <PiecesArea>
          {shuffled.map((id) => (
            <Piece
              key={id}
              style={{
                backgroundPosition: getBgPosition(id),
                opacity: selectedPiece && selectedPiece !== id ? 0.4 : 1,
                border:
                  selectedPiece === id
                    ? "3px solid #fff"
                    : "1px solid rgba(255,255,255,0.3)",
              }}
              onClick={() => handleSelectPiece(id)}
            />
          ))}
        </PiecesArea>
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

// const Modal = styled.div`
//   position: relative;
//   width: 80vw;
//   height: 80vh;
//   max-width: 520px;
//   max-height: 750px;

//   background: rgba(255, 255, 255, 0.25);
//   border-radius: 28px;
//   padding: 34px 28px;
//   text-align: center;

//   backdrop-filter: blur(16px);
//   border: 2px solid rgba(255, 255, 255, 0.45);
//   box-shadow:
//     0 10px 32px rgba(255, 100, 170, 0.35),
//     inset 0 2px 0 rgba(255, 255, 255, 0.5);

//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: flex-start;
// `;

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
  justify-content: flex-start;

  animation: popup 0.45s ease;

  @keyframes popup {
    0% { transform: scale(0.7) translateY(30px); opacity: 0; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
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
  margin-top: 60px;
  display: grid;
  grid-template-columns: repeat(3, 90px);
  grid-template-rows: repeat(3, 90px);
  gap: 6px;
  margin-bottom: 30px;
`;

const DropZone = styled.div`
  width: 90px;
  height: 90px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  border: 1px dashed rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Piece = styled.div`
  width: 90px;
  height: 90px;
  background-image: url(${game3});
  background-size: 300% 300%;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(255, 150, 200, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
`;

const PiecesArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;
