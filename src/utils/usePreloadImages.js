import { useEffect, useState } from "react";

export default function usePreloadImages() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const modules = import.meta.glob(
      "../assets/**/*.{png,jpg,jpeg,webp,mp3}",
      { eager: true }
    );

    const urls = Object.values(modules).map(m => m.default);

    let loadedCount = 0;
    const total = urls.length;

    if (total === 0) {
      setLoaded(true);
      return;
    }

    urls.forEach(url => {
      const img = new Image();
      img.src = url;

      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === total) {
          setLoaded(true);
        }
      };
    });
  }, []);

  return loaded;
}
