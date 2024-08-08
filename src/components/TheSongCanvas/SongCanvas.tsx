'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Song, SongCanvasProps } from '../../../interface/song';
import styles from './page.module.css';
import { kmeans } from 'ml-kmeans';
import { clusterColors, drawClusters } from '../../../lib/drawClusters';
import {
  fabricCanvas,
  fabricCircle,
  fabricGroup,
  fabricLine,
  fabricText,
  fabricTooltip,
} from '../../../lib/fabricFigures';
import { initializePositions } from '../../../lib/changePositions';
import { getSimilarSongs } from '../../../lib/getSimilarSongs';
import RecommendedSongs from '../TheRecommendedSongs/RecommendedSongs';

// Расширяем тип fabric.Canvas для поддержки кастомных свойств
interface CustomCanvas extends fabric.Canvas {
  isDragging?: boolean;
  lastPosX?: number;
  lastPosY?: number;
}

const SongCanvas: React.FC<SongCanvasProps> = ({ songs, matrix }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [clusters, setClusters] = useState<any>(null);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);

  // Функция отрисовки песен
  const drawSongs = (
    canvas: fabric.Canvas,
    positions: { x: number; y: number }[],
    songs: Song[],
    clusters: any,
  ) => {
    canvas.clear();

    // Рисуем связи
    matrix.forEach((row, i) => {
      row.forEach((similarity, j) => {
        if (i !== j && similarity > 0) {
          const line = fabricLine(positions, i, j, similarity);
          canvas.add(line);
        }
      });
    });

    // Рисуем узлы и добавляем подсказки
    songs.forEach((song, i) => {
      const radius = 20;
      const color = clusterColors[clusters.clusters[i]];

      const circle = fabricCircle(positions, i, radius, color);
      canvas.add(circle);

      const text = fabricText(positions, i, song);

      const group = fabricGroup(positions, i, circle, text);
      canvas.add(group);

      // Добавляем подсказку
      group.on('mouseover', () => {
        const tooltip = fabricTooltip(song, group, radius);
        canvas.add(tooltip);
        canvas.renderAll();
        group.on('mouseout', () => {
          canvas.remove(tooltip);
          canvas.renderAll();
        });
      });

      // Добавляем обработчик клика для рекомендации песен
      group.on('mousedown', () => {
        setSelectedSong(song);
        const similarSongs = getSimilarSongs(songs, song, matrix);
        console.log(similarSongs);
        setRecommendedSongs(similarSongs);
      });
    });
  };

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    // Удаление старого экземпляра, если он существует
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }

    // Создание нового экземпляра
    const canvas: CustomCanvas = fabricCanvas(canvasElement);
    fabricCanvasRef.current = canvas;

    const width = canvasElement.width;
    const height = canvasElement.height;

    // Подготовка данных для кластеризации
    const data = songs.map((song) => [song.streams]);

    // Применение алгоритма k-means для кластеризации по стримам
    let clusters;
    try {
      clusters = kmeans(data, 5, {}); // 5 кластеров, можно изменить количество
      setClusters(clusters);
    } catch (error) {
      console.error('Error during k-means clustering:', error);
      return;
    }

    const positions = initializePositions(width, height, songs);
    setPositions(positions);

    // Начальная отрисовка кластеров
    drawClusters(canvas, positions, clusters);

    // Добавление возможности масштабирования и перемещения
    canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint(new fabric.Point(opt.e.offsetX, opt.e.offsetY), zoom);
      setZoomLevel(zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    canvas.on('mouse:down', (opt) => {
      if (opt.e.altKey === true) {
        canvas.isDragging = true;
        canvas.selection = false;

        // Обработка разных типов событий
        const event = opt.e as MouseEvent | TouchEvent;
        if ('clientX' in event && 'clientY' in event) {
          canvas.lastPosX = event.clientX;
          canvas.lastPosY = event.clientY;
        } else if ('touches' in event && event.touches.length > 0) {
          canvas.lastPosX = event.touches[0].clientX;
          canvas.lastPosY = event.touches[0].clientY;
        }
      }
    });

    canvas.on('mouse:move', (opt) => {
      if (canvas.isDragging) {
        const event = opt.e as MouseEvent | TouchEvent;
        if ('clientX' in event && 'clientY' in event) {
          const vpt = canvas.viewportTransform!;
          vpt[4] += event.clientX - (canvas.lastPosX || 0);
          vpt[5] += event.clientY - (canvas.lastPosY || 0);
          canvas.requestRenderAll();
          canvas.lastPosX = event.clientX;
          canvas.lastPosY = event.clientY;
        } else if ('touches' in event && event.touches.length > 0) {
          const vpt = canvas.viewportTransform!;
          vpt[4] += event.touches[0].clientX - (canvas.lastPosX || 0);
          vpt[5] += event.touches[0].clientY - (canvas.lastPosY || 0);
          canvas.requestRenderAll();
          canvas.lastPosX = event.touches[0].clientX;
          canvas.lastPosY = event.touches[0].clientY;
        }
      }
    });

    canvas.on('mouse:up', () => {
      canvas.setCursor('default');
      canvas.isDragging = false;
      canvas.selection = true;
    });

    return () => {
      // Очистка при размонтировании компонента
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [songs, matrix]);

  useEffect(() => {
    if (fabricCanvasRef.current && clusters) {
      const canvas = fabricCanvasRef.current;
      if (zoomLevel > 1) {
        drawSongs(canvas, positions, songs, clusters);
      } else {
        drawClusters(canvas, positions, clusters);
      }
    }
  }, [clusters, songs, matrix, zoomLevel]);

  return (
    <div>
      <canvas className={styles.canvas} ref={canvasRef} width={1000} height={1000} />
      {selectedSong && (
        <RecommendedSongs selectedSong={selectedSong} recommendedSongs={recommendedSongs} />
      )}
    </div>
  );
};

export default SongCanvas;
