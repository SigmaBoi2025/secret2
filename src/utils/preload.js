// utils/preload.js
export function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = resolve;
  });
}

export function preloadAudio(src) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = src;
    audio.oncanplaythrough = resolve;
    audio.onerror = resolve;
  });
}

export function preloadAssets(assets = []) {
  const tasks = assets.map((item) => {
    if (!item) return Promise.resolve();

    if (typeof item === "string") {
      if (item.endsWith(".png") || item.endsWith(".jpg") || item.endsWith(".jpeg") || item.endsWith(".webp"))
        return preloadImage(item);

      if (item.endsWith(".mp3"))
        return preloadAudio(item);
    }

    // glob imports (object of modules)
    if (typeof item === "object") {
      const arr = Object.values(item).map((m) => preloadImage(m.default));
      return Promise.all(arr);
    }

    return Promise.resolve();
  });

  return Promise.all(tasks);
}
