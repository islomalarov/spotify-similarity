import React from 'react';
import styles from './page.module.css';
import { RecommendedSongsProps, Song } from '../../../interface/song';

const RecommendedSongs: React.FC<RecommendedSongsProps> = ({ selectedSong, recommendedSongs }) => {
  return (
    <div className={styles.recommendations}>
      <h3>Recommended Songs for {selectedSong.track}</h3>
      <ul>
        {recommendedSongs.map((song: Song) => (
          <li key={song.id}>
            {song.track} by {song.artist.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendedSongs;
