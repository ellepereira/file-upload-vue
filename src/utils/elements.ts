import { getRotationTransform } from './math';

export function getOffset(el: HTMLElement) {
  const rect = el.getBoundingClientRect();

  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft,
  };
}

export function getWidth(el: Element) {
  return el.getBoundingClientRect().width;
}

export function getHeight(el: Element) {
  return el.getBoundingClientRect().height;
}

export function getRotationToPoint(elem: HTMLElement, pointX: number, pointY: number) {
  const offset = getOffset(elem);
  const elementCenter = {
    x: offset.left + getWidth(elem) / 2,
    y: offset.top + getHeight(elem) / 2,
  };
  return getRotationTransform(pointX, pointY, elementCenter.x, elementCenter.y);
}

export function calculateDraggedDistance(element: HTMLElement, container: HTMLElement, mX: number, mY: number) {
  const from = {
    x: mX,
    y: mY,
  };
  const vectorA = getOffset(element);
  const vectorB = getOffset(container);

  const nx1 = vectorA.left;
  const ny1 = vectorA.top;
  const nx2 = nx1 + element.offsetWidth;
  const ny2 = ny1 + element.offsetHeight;
  const elemOffset = {
    top: vectorA.top - vectorB.top,
    left: vectorA.left - vectorB.left,
  };
  const maxX1 = Math.max(mX, nx1);
  const minX2 = Math.min(mX, nx2);
  const maxY1 = Math.max(mY, ny1);
  const minY2 = Math.min(mY, ny2);
  const intersectX = minX2 >= maxX1;
  const intersectY = minY2 >= maxY1;
  const to = {
    x: intersectX ? mX : nx2 < mX ? nx2 : nx1,
    y: intersectY ? mY : ny2 < mY ? ny2 : ny1,
  };
  const distX = to.x - from.x;
  const distY = to.y - from.y;
  return Math.sqrt(distX * distX + distY * distY) / elemOffset.left;
}
