// kmeans-js.d.ts
declare module 'kmeans-js' {
  class KMeans {
    cluster(
      data: number[][],
      k: number,
      callback: (err: Error | null, result: { clusters: number[] }) => void,
    ): void;
  }

  export default KMeans;
}

declare global {
  namespace fabric {
    interface Canvas {
      isDragging: boolean;
      lastPosX: number;
      lastPosY: number;
    }
  }
}
