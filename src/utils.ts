// https://stackoverflow.com/a/36481059/1550017
// Standard Normal variate using Box-Muller transform.
export function gaussianRandom() {
  let u = 1 - Math.random();
  let v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export const err = (msg: unknown) => {
  console.warn(msg);
};

export const resizeCanvasFullscreen = (canvas: HTMLCanvasElement) => {
  // const pxRatio = Math.max(Math.floor(window.devicePixelRatio) || 1, 2);
  const pxRatio = 1;
  console.log(pxRatio);
  canvas.width = window.innerWidth * pxRatio;
  canvas.height = window.innerHeight * pxRatio;
  console.log(document.body.clientHeight);
};

// create random positions and velocities.
export const randFromRange = (min: number, max: number) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
};
