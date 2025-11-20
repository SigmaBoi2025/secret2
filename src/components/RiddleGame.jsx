import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function RiddleGame({ onClose, onWin }) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (answer.trim() === "6") {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        onWin();
        onClose();
      }, 1000);
    } else {
      setError("Sai mất rồi 💔 Thử lại nhé!");
      setTimeout(() => setError(""), 1500);
    }
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
      <Modal>
        <CloseButton onClick={onClose}>✖</CloseButton>
        <Riddle>
          Capybara nhớ rằng có hai ngày đặc biệt:
          <br />Một ngày có số <strong>0</strong> và <strong>2</strong>,
          một ngày có <strong>2</strong> và <strong>7</strong>,
          <br />Cả hai đều nằm trong tháng <strong>11</strong>.
          <br />Cộng tất cả các con số lại rồi tiếp tục cộng các chữ số của kết quả đó,
          <br />em sẽ ra được con số bí mật 💫
          <br /><br />
          Hãy nhập con số đó nhé:
        </Riddle>
        <Input
          type="text"
          maxLength="2"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="..."
        />
        <SubmitButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
        >
          Trả lời 💖
        </SubmitButton>
        {error && <ErrorText>{error}</ErrorText>}
      </Modal>
    </Overlay>
  );
}

/* 🌸 Styled Components – popup riddlegame đẹp */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 175, 200, 0.4);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  touch-action: none;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: auto;
`;

const Modal = styled(motion.div)`
  width: 80vw;
  height: auto;
  max-width: 520px;
  max-height: 80vh;

  background: rgba(255, 255, 255, 0.25);
  border-radius: 28px;
  padding: 34px 28px;
  text-align: center;

  backdrop-filter: blur(16px);
  border: 2px solid rgba(255, 255, 255, 0.45);
  box-shadow:
    0 10px 32px rgba(255, 100, 170, 0.35),
    inset 0 2px 0 rgba(255, 255, 255, 0.5);

  touch-action: none;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: auto;

  overflow-y: auto; /* 🔥 Quan trọng để text dài không phá layout */
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

const Riddle = styled.div`
  font-size: 24px;
  color: #fff;
  line-height: 1.55;
  text-shadow:
    0 0 12px rgba(255, 170, 200, 0.8),
    0 0 18px rgba(255, 120, 160, 0.5);
`;

const Input = styled.input`
  margin-top: 25px;
  width: 120px;
  height: 48px;
  border-radius: 16px;
  border: 2px solid rgba(255,255,255,0.6);
  background: rgba(255,255,255,0.8);
  box-shadow: inset 0 0 6px rgba(255,120,150,0.3);
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: #ff69a5;
  outline: none;

  &:focus {
    transform: scale(1.03);
    box-shadow: 0 0 14px rgba(255,120,170,0.4);
  }
`;

const SubmitButton = styled(motion.button)`
  margin-top: 24px;
  background: linear-gradient(135deg, #ff8fb2, #ff5fa3);
  padding: 12px 32px;
  border-radius: 40px;
  color: white;
  font-size: 24px;
  font-weight: 700;
  border: none;
  box-shadow: 0 6px 14px rgba(255, 100, 150, 0.4);
  cursor: pointer;

  &:hover {
    transform: scale(1.07);
  }
`;

const ErrorText = styled.div`
  margin-top: 16px;
  color: #ffe4eb;
  font-size: 22px;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(255, 50, 120, 0.6);
`;
