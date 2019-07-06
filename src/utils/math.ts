interface IRect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface IPoint {
  x: number;
  y: number;
}

export function bytesToSize(bytes: any): any {
  if (bytes === 0) {
    return '0 Byte';
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'];
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

export function getRotationTransform(aX: number, aY: number, bX: number, bY: number) {
  const radians = Math.atan2(aX - bX, aY - bY);
  return (radians * (180 / Math.PI) * -1) + 180;
}

export function clamp(min: number, max: number, value: number) {
  return Math.min(value, max) >= Math.max(value, min) ? value : value > max ? max : min;
}

export function getPointDistance(a: IPoint, b: IPoint): number {
  const distX = b.x - a.x;
  const distY = b.y - a.y;
  return Math.sqrt(distX * distX + distY * distY);
}

export function collides(x: number, y: number, rect: IRect) {
  const maxX1 = Math.max(x, rect.x1);
  const minX2 = Math.min(x, rect.x1 + rect.x2);
  const maxY1 = Math.max(y, rect.y1);
  const minY2 = Math.min(y, rect.y1 + rect.y2);

  return {
    x: minX2 >= maxX1,
    y: minY2 >= maxY1,
  };
}
