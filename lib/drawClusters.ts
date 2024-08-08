import * as fabric from 'fabric';

export const clusterColors = ['red', 'green', 'blue', 'yellow', 'purple'];

// Функция отрисовки кластеров
export const drawClusters = (
  canvas: fabric.Canvas,
  positions: { x: number; y: number }[],
  clusters: any,
) => {
  canvas.clear();
  const clusterCounts = clusters.clusters.reduce((acc: any, clusterIndex: number) => {
    acc[clusterIndex] = (acc[clusterIndex] || 0) + 1;
    return acc;
  }, {} as { [key: number]: number });

  Object.entries(clusterCounts).forEach(([clusterIndex, count]) => {
    const radius = Math.sqrt(Number(count)) * 10;
    const color = clusterColors[Number(clusterIndex)];
    const clusterPosition = positions[clusters.clusters.indexOf(Number(clusterIndex))];

    const circle = new fabric.Circle({
      left: clusterPosition.x - radius,
      top: clusterPosition.y - radius,
      radius: radius,
      fill: color,
      stroke: 'white',
      strokeWidth: 1,
    });
    canvas.add(circle);

    const text = new fabric.Text(`Cluster ${clusterIndex}`, {
      left: clusterPosition.x,
      top: clusterPosition.y,
      fontSize: 20,
      stroke: 'white',
      originX: 'center',
      originY: 'center',
      textAlign: 'center',
      verticalAlign: 'middle',
    });

    const group = new fabric.Group([circle, text], {
      left: clusterPosition.x,
      top: clusterPosition.y,
      originX: 'center',
      originY: 'center',
    });
    canvas.add(group);
  });
};
