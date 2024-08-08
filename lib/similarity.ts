import { Song } from '../interface/song';

// Пример метрики сходства, используя количество общих артистов
export function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

export function createSimilarityMatrix(songs: Song[]): number[][] {
  const matrix: number[][] = [];

  for (let i = 0; i < songs.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < songs.length; j++) {
      if (i === j) {
        row.push(0);
      } else {
        const similarity = jaccardSimilarity(new Set(songs[i].artist), new Set(songs[j].artist));
        row.push(similarity);
      }
    }
    matrix.push(row);
  }

  return matrix;
}
