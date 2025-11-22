import { useEffect, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* -------------------------------------------
   📌 Load toàn bộ ảnh trong folder (Vite)
-------------------------------------------- */
const modules = import.meta.glob(
  "../assets/photos/screen3/*.{png,jpg,jpeg,webp}",
  { eager: true }
);

const images = Object.values(modules).map(m => m.default);

/* ❤️ Mask trái tim chuẩn (7x7 = 49 ô) */
const heartMask = [
  0, 1, 1, 0, 1, 1, 0,
  1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1,
  0, 1, 1, 1, 1, 1, 0,
  0, 0, 1, 1, 1, 0, 0,
  0, 0, 0, 1, 0, 0, 0,
];

export default function GalleryHeart() {
  const [randomImages, setRandomImages] = useState([]);
  const navigate = useNavigate();


  /* 🧠 React 18 Strict Mode SAFE */
  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      const arr = [];
      for (let i = 0; i < 49; i++) {
        const img = images[Math.floor(Math.random() * images.length)];
        arr.push(img);
      }
      setRandomImages(arr);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.deltaY > 20) navigate("/letter");
    };
    window.addEventListener("wheel", handler);
    return () => window.removeEventListener("wheel", handler);
  }, []);

  return (
    <Screen>
      <FloatingHearts />

      <CenterContainer>
        <HeartWrapper
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <HeartGrid>
            {randomImages.map((img, i) =>
              heartMask[i] ? (
                <HeartImage key={i} src={img} />
              ) : (
                <EmptyCell key={i} />
              )
            )}
          </HeartGrid>
        </HeartWrapper>
      </CenterContainer>

      <Title>Happy Birthday 💖</Title>

      <SwipeHint
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Vuốt xuống để tiếp tục ↓
      </SwipeHint>
    </Screen>
  );
}

/* -------------------------------------------
   Style ↓
-------------------------------------------- */

const Screen = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #ff9eb5, #ffb6c1, #ffc0cb);
  overflow: hidden;
  position: relative;
  font-family: "Dancing Script", cursive;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CenterContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeartWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 55px);
  grid-template-rows: repeat(7, 55px);
  gap: 4px;

  @media(max-width: 500px) {
    grid-template-columns: repeat(7, 42px);
    grid-template-rows: repeat(7, 42px);
    gap: 3px;
  }

  @media(max-width: 380px) {
    grid-template-columns: repeat(7, 36px);
    grid-template-rows: repeat(7, 36px);
    gap: 2px;
  }
`;

const HeartImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 10px rgba(255,105,180,0.4);
`;

const EmptyCell = styled.div``;

const Title = styled(motion.h1)`
  position: absolute;
  bottom: 15%;
  width: 100%;
  text-align: center;
  font-size: 46px;
  color: white;
  text-shadow: 0 4px 14px rgba(255,20,147,0.5);

  @media(max-width: 500px) {
    font-size: 38px;
    bottom: 12%;
  }
`;

const SwipeHint = styled(motion.div)`
  position: absolute;
  bottom: 6%;
  width: 100%;
  text-align: center;
  font-size: 20px;
  color: rgba(255,255,255,0.85);

  @media(max-width: 500px) {
    font-size: 18px;
    bottom: 5%;
  }
`;

const FloatingHearts = () => (
  <>
    {Array.from({ length: 20 }).map((_, i) => (
      <FloatingHeart
        key={i}
        animate={{
          y: ["110vh", "-10vh"],
          opacity: [0, 0.8, 0],
          x: [
            `${Math.random() * 100}vw`,
            `${Math.random() * 100}vw`
          ],
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
  font-size: ${() => 14 + Math.random() * 16}px;
  color: #ff77aa;
  filter: drop-shadow(0 0 4px rgba(255,105,180,0.6));
  pointer-events: none;
`;