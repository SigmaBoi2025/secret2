import styled from "styled-components";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <Wrapper>
      <Spinner
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <Text>Đang tải dữ liệu...</Text>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: calc(var(--vh, 1vh) * 100); /* Bắt buộc */
/* Hoặc thêm song song: */
height: 100dvh;
  width: 100vw;
  background: linear-gradient(135deg, #ff9eb5, #ffb6c1, #ffc0cb);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Dancing Script", cursive;
`;

const Spinner = styled(motion.div)`
  width: 70px;
  height: 70px;
  border: 6px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
`;

const Text = styled.div`
  margin-top: 20px;
  color: white;
  font-size: 22px;
`;
