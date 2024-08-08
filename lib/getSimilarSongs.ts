import { Song } from '../interface/song';

export const getSimilarSongs = (songs: Song[], song: Song, matrix: number[][]) => {
  const songIndex = songs.findIndex((s) => s.id === song.id);
  if (songIndex === -1) return [];
  const similarities = matrix[songIndex];
  const similarSongIndexes = similarities
    .map((similarity, index) => ({ index, similarity }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5) // Количество рекомендуемых песен
    .map((item) => item.index);
  return similarSongIndexes.map((index) => songs[index]);
};
