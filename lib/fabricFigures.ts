import * as fabric from 'fabric';
import { Song } from '../interface/song';
export function fabricCircle(
  positions: { x: number; y: number }[],
  i: number,
  radius: number,
  color: string,
) {
  return new fabric.Circle({
    left: positions[i].x - radius,
    top: positions[i].y - radius,
    radius: radius,
    fill: color,
    stroke: 'white',
    strokeWidth: 1,
  });
}

export function fabricText(positions: { x: number; y: number }[], i: number, song: Song) {
  return new fabric.Text(song.track, {
    left: positions[i].x,
    top: positions[i].y,
    fontSize: 10,
    stroke: 'white',
    originX: 'center',
    originY: 'center',
    textAlign: 'center',
    verticalAlign: 'middle',
  });
}

export function fabricGroup(
  positions: { x: number; y: number }[],
  i: number,
  circle: fabric.Circle<
    {
      left: number;
      top: number;
      radius: number;
      fill: string;
      stroke: string;
      strokeWidth: number;
    },
    fabric.SerializedCircleProps,
    fabric.ObjectEvents
  >,
  text: fabric.FabricText<
    {
      left: number;
      top: number;
      fontSize: number;
      stroke: string;
      originX: 'center';
      originY: 'center';
      textAlign: string;
      verticalAlign: string;
    },
    fabric.SerializedTextProps,
    fabric.ObjectEvents
  >,
) {
  return new fabric.Group([circle, text], {
    left: positions[i].x,
    top: positions[i].y,
    originX: 'center',
    originY: 'center',
  });
}
export function fabricLine(
  positions: { x: number; y: number }[],
  i: number,
  j: number,
  similarity: number,
) {
  return new fabric.Line([positions[i].x, positions[i].y, positions[j].x, positions[j].y], {
    stroke: `rgba(0, 0, 0, ${similarity})`,
    strokeWidth: similarity * 2,
  });
}

export function fabricTooltip(song: Song, group: fabric.Group, radius: number) {
  return new fabric.Text(
    `Track: ${song.track}\nAlbum: ${song.albumName}\nArtist: ${song.artist.join(', ')}\nStreams: ${
      song.streams
    }`,
    {
      left: group.left! + radius,
      top: group.top! - radius,
      fontSize: 12,
      fill: 'black',
      backgroundColor: 'white',
      opacity: 0.9,
    },
  );
}

export function fabricCanvas(canvasElement: HTMLCanvasElement) {
  return new fabric.Canvas(canvasElement, {
    fireRightClick: true,
    stopContextMenu: true,
  });
}
