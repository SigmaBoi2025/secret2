import styled from "styled-components";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Letter() {
  const fullText = `
Chúc mừng sinh nhật em yêu của anh 💖

Cảm ơn em vì đã đến bên anh, vì tất cả những khoảnh khắc ngọt ngào mình đã đi qua cùng nhau.
Anh luôn cảm thấy may mắn vì giữa hàng triệu người, anh lại tìm thấy đúng em – người anh muốn nắm tay thật lâu, thật lâu.

Anh mong rằng sinh nhật năm nay sẽ mang đến cho em thật nhiều niềm vui, nhiều yêu thương, và nhiều điều đẹp đẽ mà em xứng đáng có được.

Cảm ơn em vì đã khiến thế giới của anh trở nên ấm áp và dịu dàng hơn từng ngày.
Anh thương em nhiều lắm.

Chúc em tuổi mới thật hạnh phúc, thật xinh đẹp, và luôn luôn ở bên anh nữa nhé 💗
`;

  const [text, setText] = useState("");

  // typing effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <Screen>
      <FloatingHearts />

      <LetterPaper
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <TypingText>
          {text.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </TypingText>
      </LetterPaper>

      <SwipeHint
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Vuốt xuống để tiếp tục ↓
      </SwipeHint>
    </Screen>
  );
}

/* ---------------- STYLES ---------------- */

const Screen = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #ff9eb5, #ffb6c1, #ffc0cb);
  overflow: hidden;
  position: relative;
  font-family: "Dancing Script", cursive;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const LetterPaper = styled(motion.div)`
  width: 80%;
  height: 75vh;

  padding: 28px 24px;
  overflow-y: auto;
  
  background: rgba(255, 255, 255, 0.35);
  border-radius: 26px;
  backdrop-filter: blur(14px);
  box-shadow: 0 6px 20px rgba(255, 100, 150, 0.35);

  /* Đảm bảo KHÔNG bao giờ lệch */
  position: relative;
`;

const TypingText = styled.div`
  white-space: pre-wrap;
  color: #ffffffdd;  /* dễ đọc hơn trắng tuyệt đối */
  font-size: 22px;
  line-height: 1.6;
  text-shadow: 0 2px 8px rgba(255, 20, 147, 0.45);

  /* mobile-friendly */
  @media(max-width: 480px){
    font-size: 18px;
  }
`;

const SwipeHint = styled(motion.div)`
  position: absolute;
  bottom: 3%;
  width: 100%;
  text-align: center;
  font-size: 20px;
  color: rgba(255,255,255,0.85);
  text-shadow: 0 2px 6px rgba(255,20,147,0.5);
`;


const FloatingHearts = () => (
  <>
    {Array.from({ length: 20 }).map((_, i) => (
      <FloatingHeart
        key={i}
        animate={{
          y: ["110vh", "-10vh"],
          opacity: [0, 0.8, 0],
          x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
        }}
        transition={{
          duration: 6 + Math.random() * 3,
          delay: Math.random() * 2,
          repeat: Infinity,
        }}
      >
        💕
      </FloatingHeart>
    ))}
  </>
);

const FloatingHeart = styled(motion.div)`
  position: absolute;
  color: #ff77aa;
  font-size: ${() => 12 + Math.random() * 20}px;
  filter: drop-shadow(0 0 4px rgba(255,105,180,0.6));
`;
