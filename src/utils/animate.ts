export function animate(from: number, to: number, duration: number, drawFn: any) {
  return new Promise((resolve) => {
    let stop = false;
    const dur = duration || 200;
    let start: number = 0;
    let end: number = 0;

    function startAnim(timeStamp: number) {
      start = timeStamp;
      end = start + dur;
      draw(timeStamp);
    }

    const draw = (now: number) => {
      if (stop) {
        resolve();
        return;
      }

      if (now - start >= dur) {
        stop = true;
      }

      const p = (now - start) / dur;
      const x = from + (to - from) * p;
      drawFn(x);
      requestAnimationFrame(draw);
    };

    requestAnimationFrame(startAnim);
  });
}
