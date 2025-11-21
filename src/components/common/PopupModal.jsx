import styled from "styled-components";
import { motion } from "framer-motion";

export default function PopupModal({ children, onClose }) {
  return (
    <Overlay onClick={onClose}>
      <Modal
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <CloseButton onClick={onClose}>✖</CloseButton>
        {children}
      </Modal>
    </Overlay>
  );
}

/* 🩷 Overlay tái sử dụng */
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

/* 🩷 Modal tái sử dụng */
const Modal = styled(motion.div)`
  position: relative;
  width: 80vw;
  height: 80vh;
  max-width: 520px;
  max-height: 750px;

  background: rgba(255, 255, 255, 0.25);
  border-radius: 28px;
  padding: 20px;
  overflow: hidden;

  border: 2px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(16px);
  box-shadow:
    0 10px 32px rgba(255, 100, 170, 0.35),
    inset 0 2px 0 rgba(255, 255, 255, 0.5);
`;

/* 🩷 Button đóng */
const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 18px;
  background: none;
  border: none;
  color: #fff;
  font-size: 32px;
  cursor: pointer;
`;
