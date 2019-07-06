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
