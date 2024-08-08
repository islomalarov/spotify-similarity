import { createSimilarityMatrix } from '../../lib/similarity';
import SongCanvas from '../components/TheSongCanvas/SongCanvas';
import fetchSongs from '../../lib/fetchSongs';
import styles from './page.module.css';

export default async function HomePage() {
  const data = await fetchSongs();
  const songs = data.slice(0, 500);

  const similarityMatrix = createSimilarityMatrix(songs);
  return (
    <div className={styles.container}>
      <h1 className={styles.text}>Карта сходства песен</h1>
      {songs.length > 0 && similarityMatrix.length > 0 ? (
        <div className={styles.canvasBlock}>
          <SongCanvas songs={songs} matrix={similarityMatrix} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
