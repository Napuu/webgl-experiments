import updatePositionVS from "./updateParticles.vert"
import updatePositionFS from "./updateParticles.frag"
import updateVelocityVS from "./updateVelocities.vert"
import updateVelocityFS from "./updateVelocities.frag"
import drawParticlesVS from "./drawParticles.vert"

import drawParticlesFS from "./drawParticles.frag"
import { createProgram, orthographic } from "../boilerplate"
import Stats from 'stats.js'


const resize = (canvas: HTMLCanvasElement) => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  console.log(document.body.clientHeight)
}

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

let mousedown = false;

let gravityPosition: [number, number] = [0, 0];
let reset = 0;

const resetCycles = 1;

const err = (msg: unknown) => {
  console.warn(msg);
}
function main() {
  const canvas = document.querySelector("canvas");
  if (!canvas) {
    err("Canvas not found");
    return;
  }
  resize(canvas);
  const tap = (ev: any) => {
    if (ev.type === 'mousemove' && !mousedown) return;
    gravityPosition = [ev.layerX, canvas.height - ev.layerY]
    reset = 1;
  }

  canvas.addEventListener("mousedown", (ev) => {
    mousedown = true;
    tap(ev);
  });
  canvas.addEventListener("mouseup", (ev) => {
    mousedown = false;
    tap(ev);
  });
  canvas.addEventListener("mousemove", tap);
  canvas.addEventListener("touchstart", tap);
  canvas.addEventListener("touchmove", tap);
  canvas.addEventListener("touchend", tap);
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    err("WebGL2 context not found")
    return;
  }

  const updatePositionProgram = createProgram(
    gl, updatePositionVS, updatePositionFS, ['newPosition']) as WebGLProgram;
  const updateVelocityProgram = createProgram(
    gl, updateVelocityVS, updateVelocityFS, ['newVelocity']) as WebGLProgram;
  const drawParticlesProgram = createProgram(
    gl, drawParticlesVS, drawParticlesFS) as WebGLProgram;
  if (!updatePositionProgram || !drawParticlesProgram || !updateVelocityProgram) {
    err("Program compilation failed")
    return
  }

  const updatePositionPrgLocs = {
    oldPosition: gl.getAttribLocation(updatePositionProgram, 'oldPosition'),
    oldVelocity: gl.getAttribLocation(updatePositionProgram, 'oldVelocity'),
    canvasDimensions: gl.getUniformLocation(updatePositionProgram, 'canvasDimensions'),
    deltaTime: gl.getUniformLocation(updatePositionProgram, 'deltaTime'),
  };
  const updateVelocityPrgLocs = {
    oldPosition: gl.getAttribLocation(updateVelocityProgram, 'oldPosition'),
    oldVelocity: gl.getAttribLocation(updateVelocityProgram, 'oldVelocity'),
    gravityPosition: gl.getUniformLocation(updateVelocityProgram, 'gravityPosition'),
    reset: gl.getUniformLocation(updateVelocityProgram, 'reset'),
    canvasDimensions: gl.getUniformLocation(updateVelocityProgram, 'canvasDimensions'),
    deltaTime: gl.getUniformLocation(updateVelocityProgram, 'deltaTime'),
  };

  const drawParticlesProgLocs = {
    position: gl.getAttribLocation(drawParticlesProgram, 'position'),
    matrix: gl.getUniformLocation(drawParticlesProgram, 'matrix'),
  };

  // create random positions and velocities.
  const rand = (min: number, max: number) => {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return Math.random() * (max - min) + min;
  };
  const numParticles = 500000;
  const createPoints = (num: number, ranges: number[][]) =>
    new Array(num).fill(0).map(_ => ranges.map(range => rand(...(range as [number, number])))).flat();
  const positions = new Float32Array(createPoints(numParticles, [[canvas.width], [canvas.height]]));
  const dV = 50;
  const velocities = new Float32Array(createPoints(numParticles, [[-dV, dV], [-dV, dV]]));

  function makeBuffer(gl: WebGL2RenderingContext, sizeOrData: number | Float32Array, usage: number) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, sizeOrData as any, usage);
    return buf;
  }

  const position1Buffer = makeBuffer(gl, positions, gl.DYNAMIC_DRAW);
  const position2Buffer = makeBuffer(gl, positions, gl.DYNAMIC_DRAW);
  const velocity1Buffer = makeBuffer(gl, velocities, gl.DYNAMIC_DRAW);
  const velocity2Buffer = makeBuffer(gl, velocities, gl.DYNAMIC_DRAW);
  if (!position1Buffer || !position2Buffer || !velocity1Buffer || !velocity2Buffer) {
    err("Something wrong with buffers")
    return
  }

  function makeVertexArray(gl: WebGL2RenderingContext, bufLocPairs: [WebGLBuffer, number][]) {
    const va = gl.createVertexArray();
    gl.bindVertexArray(va);
    for (const [buffer, loc] of bufLocPairs) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(
        loc,      // attribute location
        2,        // number of elements
        gl.FLOAT, // type of data
        false,    // normalize
        0,        // stride (0 = auto)
        0,        // offset
      );
    }
    return va;
  }

  const updatePositionVA1 = makeVertexArray(gl, [
    [position1Buffer, updatePositionPrgLocs.oldPosition],
    [velocity1Buffer, updatePositionPrgLocs.oldVelocity],
  ]);
  const updatePositionVA2 = makeVertexArray(gl, [
    [position2Buffer, updatePositionPrgLocs.oldPosition],
    [velocity1Buffer, updatePositionPrgLocs.oldVelocity],
  ]);
  const updateVelocityVA1 = makeVertexArray(gl, [
    [position1Buffer, updateVelocityPrgLocs.oldPosition],
    [velocity1Buffer, updateVelocityPrgLocs.oldVelocity],
  ]);
  const updateVelocityVA2 = makeVertexArray(gl, [
    [position1Buffer, updateVelocityPrgLocs.oldPosition],
    [velocity2Buffer, updateVelocityPrgLocs.oldVelocity],
  ]);

  const drawVA1 = makeVertexArray(
    gl, [[position1Buffer, drawParticlesProgLocs.position]]);
  const drawVA2 = makeVertexArray(
    gl, [[position2Buffer, drawParticlesProgLocs.position]]);

  function makeTransformFeedback(gl: WebGL2RenderingContext, buffer: WebGLBuffer) {
    const tf = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffer);
    return tf;
  }

  const tf1 = makeTransformFeedback(gl, position1Buffer);
  const tf2 = makeTransformFeedback(gl, position2Buffer);
  const tf3 = makeTransformFeedback(gl, velocity1Buffer);
  const tf4 = makeTransformFeedback(gl, velocity2Buffer);

  // unbind leftover stuff
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

  let current = {
    updatePositionVA: updatePositionVA1,  // read from position1
    updateVelocityVA: updateVelocityVA1,  // read from position1
    tfPosition: tf2,                      // write to position2
    tfVelocity: tf4,                      // write to velocity2 
    drawVA: drawVA2,              // draw with position2
  };
  let next = {
    updatePositionVA: updatePositionVA2,  // read from position2
    updateVelocityVA: updateVelocityVA2,  // read from position1
    tfPosition: tf1,                      // write to position1
    tfVelocity: tf3,                      // write to velocity1
    drawVA: drawVA1,              // draw with position1
  };

  let then = 0;
  function render(time: number) {
    stats.begin();
    if (!gl) {
      err("WebGL2 context lost during rendering?")
      return
    }
    if (reset > 0) {
      reset += 1;
      if (reset > resetCycles) reset = 0;
    }
    // convert to seconds
    time *= 0.001;
    // Subtract the previous time from the current time
    const deltaTime = time - then;
    // Remember the current time for the next frame.
    then = time;

    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.clear(gl.COLOR_BUFFER_BIT);

    // compute the new positions
    gl.useProgram(updatePositionProgram);
    gl.bindVertexArray(current.updatePositionVA);
    gl.uniform2f(updatePositionPrgLocs.canvasDimensions, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(updatePositionPrgLocs.deltaTime, deltaTime);

    gl.enable(gl.RASTERIZER_DISCARD);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, current.tfPosition);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, numParticles);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);


    // compute the new velocities
    gl.useProgram(updateVelocityProgram);
    gl.bindVertexArray(current.updateVelocityVA);
    gl.uniform2f(updateVelocityPrgLocs.gravityPosition, ...gravityPosition)
    gl.uniform1i(updateVelocityPrgLocs.reset, reset);
    gl.uniform2f(updateVelocityPrgLocs.canvasDimensions, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(updateVelocityPrgLocs.deltaTime, deltaTime);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, current.tfVelocity);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, numParticles);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    // turn on using fragment shaders again
    gl.disable(gl.RASTERIZER_DISCARD);

    // now draw the particles.
    gl.useProgram(drawParticlesProgram);
    gl.bindVertexArray(current.drawVA);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.uniformMatrix4fv(
      drawParticlesProgLocs.matrix,
      false,
      orthographic(0, gl.canvas.width, 0, gl.canvas.height, -1, 1));
    gl.drawArrays(gl.POINTS, 0, numParticles);

    // swap which buffer we will read from
    // and which one we will write to
    {
      const temp = current;
      current = next;
      next = temp;
    }

    stats.end();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
