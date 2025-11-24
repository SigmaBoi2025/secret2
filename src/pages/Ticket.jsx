import styled from "styled-components";
import { motion } from "framer-motion";
import { useEffect } from "react";
import ticket from "../assets/capybara/capibara_ticket.png"; // đường dẫn ảnh

export default function Ticket() {

  return (
    <Screen>
      <FloatingHearts />

      <TicketBox
        initial={{ opacity: 0, y: 40, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <TicketImg
          src={ticket}
          alt="ticket"
          draggable={false}
        />

        <TicketText>
          Đưa tấm vé này cho Quang để đổi quà nhé 💝
        </TicketText>
      </TicketBox>
    </Screen>
  );
}

/* ---------------- STYLES ---------------- */

const Screen = styled.div`
  position: fixed;
  inset: 0;
  padding: 20px;

  background: linear-gradient(135deg, #ff9eb5, #ffb6c1, #ffc0cb);
  overflow: hidden;
  z-index: 999;

  display: flex;
  justify-content: center;
  align-items: center;

  font-family: "Dancing Script", cursive;
`;


const TicketBox = styled(motion.div)`
  width: 88%;
  height: 80%;
  max-width: 600px;

  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(14px);
  border-radius: 26px;

  padding: 32px 24px;
  overflow: hidden;

  box-shadow:
    0 8px 26px rgba(255, 100, 150, 0.35),
    inset 0 2px 0 rgba(255,255,255,0.45);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TicketImg = styled.img`
  width: 70%;
  max-width: 320px;
  user-select: none;
  object-fit: contain;

  filter: drop-shadow(0 6px 14px rgba(255, 80, 150, 0.35));
`;

const TicketText = styled.div`
  margin-top: 26px;
  font-size: 26px;
  color: #ffffffee;
  text-align: center;

  line-height: 1.6;
  text-shadow: 0 2px 8px rgba(255, 20, 147, 0.45);

  @media(max-width: 480px){
    font-size: 20px;
  }
`;

/* Floating hearts */
const FloatingHearts = () => (
  <>
    {Array.from({ length: 18 }).map((_, i) => (
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
  font-size: ${() => 12 + Math.random() * 22}px;
  filter: drop-shadow(0 0 4px rgba(255,105,180,0.6));
`;
