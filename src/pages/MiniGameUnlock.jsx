import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

/* 🩷 Trang Mini Game Unlock */
export default function MiniGameUnlock({ onNext }) {
  const [gameResults, setGameResults] = useState([false, false, false, false]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const correctCode = "1608";

  const handleMiniGameClick = (index) => {
    // ⚙️ Tạm thời cho “thắng game” luôn để demo
    const newResults = [...gameResults];
    newResults[index] = true;
    setGameResults(newResults);
  };

  const handleContinue = () => {
    if (password === correctCode) {
      onNext();
    } else {
      setError("Mật khẩu sai rồi 😝");
      setTimeout(() => setError(""), 2000);
    }
  };

  return (
    <Screen>
      <Title>Giải mã bí mật của Capybara 💌</Title>

      <GameGrid>
        {gameResults.map((won, i) => (
          <CardButton
            key={i}
            onClick={() => handleMiniGameClick(i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {won ? (
              <GameNumber>{["1", "6", "0", "8"][i]}</GameNumber>
            ) : (
              <QuestionMark>?</QuestionMark>
            )}
          </CardButton>
        ))}
      </GameGrid>

      <PasswordSection>
        <PasswordInput
          type="text"
          maxLength="4"
          placeholder="Nhập mật khẩu..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ContinueButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
        >
          Tiếp tục 💖
        </ContinueButton>
        {error && <ErrorText>{error}</ErrorText>}
      </PasswordSection>
    </Screen>
  );
}

/* 🎨 Styled Components */
const Screen = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(180deg, #ffb6c1 0%, #ff8fa3 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Dancing Script", cursive;
  overflow: hidden;
`;

const Title = styled.h1`
  color: white;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 40px;
  text-shadow: 0 0 12px rgba(255, 200, 220, 0.9);
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 120px);
  grid-gap: 30px;
  margin-bottom: 60px;
`;

const CardButton = styled(motion.div)`
  width: 120px;
  height: 100px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 10px rgba(255, 100, 150, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  backdrop-filter: blur(6px);
  color: white;
  font-size: 36px;
  font-weight: 600;
`;

const GameNumber = styled.span`
  font-size: 48px;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 180, 220, 0.9);
`;

const QuestionMark = styled.span`
  font-size: 40px;
  opacity: 0.6;
`;

const PasswordSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PasswordInput = styled.input`
  width: 220px;
  height: 45px;
  border-radius: 10px;
  border: none;
  text-align: center;
  font-size: 22px;
  margin-bottom: 16px;
  outline: none;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  font-weight: 600;
  letter-spacing: 4px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);

  ::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const ContinueButton = styled(motion.button)`
  background: linear-gradient(135deg, #ff8fb2, #ff5fa3);
  border: none;
  border-radius: 40px;
  padding: 10px 28px;
  font-size: 22px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(255, 100, 150, 0.5);
`;

const ErrorText = styled.div`
  color: #ffeaea;
  margin-top: 10px;
  font-size: 20px;
`;

