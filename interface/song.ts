export interface Song {
  id: string;
  track: string;
  albumName: string;
  artist: string[];
  streams: number;
}
export interface SongCanvasProps {
  songs: Song[];
  matrix: number[][];
}
export interface RecommendedSongsProps {
  selectedSong: Song;
  recommendedSongs: Song[];
}
