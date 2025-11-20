// Giúp lưu và lấy tiến trình unlock các mini game
export const saveGameProgress = (index) => {
  const progress = JSON.parse(localStorage.getItem("gameProgress") || "[]");
  progress[index] = true;
  localStorage.setItem("gameProgress", JSON.stringify(progress));
};

export const getGameProgress = () => {
  return JSON.parse(localStorage.getItem("gameProgress") || "[]");
};
