import { getRotationTransform, getPointDistance, clamp } from './math';

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

export function distanceToPoint(element: HTMLElement, x: number, y: number) {
  const elementRect = getOffset(element);
  const width = element.offsetWidth;
  const height = element.offsetHeight;

  const x1 = elementRect.left;
  const y1 = elementRect.top;

  const x2 = x1 + width;
  const y2 = y1 + height;

  const from = {
    x,
    y,
  };

  const to = {
    x: clamp(x1, x2, x),
    y: clamp(y1, y2, y),
  };

  return getPointDistance(from, to);
}
