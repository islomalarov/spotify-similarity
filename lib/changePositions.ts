import { Song } from '../interface/song';

// Простая функция отталкивания
export const repel = (positions: { x: number; y: number }[]) => {
  const minDistance = 1; // минимальное расстояние в пикселях между узлами
  const iterations = 100; // количество итераций

  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[j].x - positions[i].x;
        const dy = positions[j].y - positions[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          const angle = Math.atan2(dy, dx);
          const moveDistance = (minDistance - distance) / 2;
          positions[i].x -= moveDistance * Math.cos(angle);
          positions[i].y -= moveDistance * Math.sin(angle);
          positions[j].x += moveDistance * Math.cos(angle);
          positions[j].y += moveDistance * Math.sin(angle);
        }
      }
    }
  }
};

export const initializePositions = (width: number, height: number, songs: Song[]) => {
  const positions = songs.map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
  }));
  repel(positions);
  return positions;
};
