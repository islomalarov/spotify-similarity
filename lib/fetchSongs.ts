import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import { Song } from '../interface/song';

export default async function fetchSongs(): Promise<Song[]> {
  const songs: Song[] = [];
  const filePath = path.join(process.cwd(), 'public/datasets/spotify_songs.csv');

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        data['Spotify Streams']
          ? songs.push({
              id: data['ISRC'],
              track: data['Track'],
              albumName: data['Album Name'],
              artist: data['Artist'].split(','),
              streams: parseInt(data['Spotify Streams']),
            })
          : console.error(`Skipping row with missing Spotify Streams: ${JSON.stringify(data)}`); // Отладочная информация для отсутствующих значений streams
      })
      .on('end', () => {
        resolve(songs);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
