import updatePositionVS from "./updateParticles.vert"
import updatePositionFS from "./updateParticles.frag"
import updateVelocityVS from "./updateVelocities.vert"
import updateVelocityFS from "./updateVelocities.frag"
import drawParticlesVS from "./drawParticles.vert"
import drawParticlesFS from "./drawParticles.frag"
import { createProgram, orthographic } from "../boilerplate"
function main() {

  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector("canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  const updatePositionProgram = createProgram(
      gl, updatePositionVS, updatePositionFS, ['newPosition']);
  const updateVelocityProgram = createProgram(
      gl, updateVelocityVS, updateVelocityFS, ['newVelocity']);
  const drawParticlesProgram = createProgram(
      gl, drawParticlesVS, drawParticlesFS);

  const updatePositionPrgLocs = {
    oldPosition: gl.getAttribLocation(updatePositionProgram, 'oldPosition'),
    oldVelocity: gl.getAttribLocation(updatePositionProgram, 'oldVelocity'),
    canvasDimensions: gl.getUniformLocation(updatePositionProgram, 'canvasDimensions'),
    deltaTime: gl.getUniformLocation(updatePositionProgram, 'deltaTime'),
  };

  const updateVelocityPrgLocs = {
    oldPosition: gl.getAttribLocation(updateVelocityProgram, 'oldPosition'),
    oldVelocity: gl.getAttribLocation(updateVelocityProgram, 'oldVelocity'),
    canvasDimensions: gl.getUniformLocation(updateVelocityProgram, 'canvasDimensions'),
    deltaTime: gl.getUniformLocation(updateVelocityProgram, 'deltaTime'),
  };

  const drawParticlesProgLocs = {
    position: gl.getAttribLocation(drawParticlesProgram, 'position'),
    matrix: gl.getUniformLocation(drawParticlesProgram, 'matrix'),
  };

  // we're going to base the initial positions on the size
  // of the canvas so lets update the size of the canvas
  // to the initial size we want
  // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // create random positions and velocities.
  const rand = (min, max) => {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return Math.random() * (max - min) + min;
  };
  const numParticles = 2;
  const createPoints = (num: number, ranges: number[][]) =>
     new Array(num).fill(0).map(_ => ranges.map(range => rand(...range))).flat();
  const positions = new Float32Array(createPoints(numParticles, [[canvas.width], [canvas.height]]));
  const velocities = new Float32Array(createPoints(numParticles, [[-300, 300], [-300, 300]]));
  console.log(positions, velocities)

  function makeBuffer(gl, sizeOrData, usage) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
    return buf;
  }

  const position1Buffer = makeBuffer(gl, positions, gl.DYNAMIC_DRAW);
  const position2Buffer = makeBuffer(gl, positions, gl.DYNAMIC_DRAW);
  const velocity1Buffer = makeBuffer(gl, velocities, gl.STATIC_DRAW);
  const velocity2Buffer = makeBuffer(gl, velocities, gl.STATIC_DRAW);

  function makeVertexArray(gl, bufLocPairs) {
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
  ]);

  const updateVelocityVA1 = makeVertexArray(gl, [
    [position1Buffer, updateVelocityPrgLocs.oldPosition],
    [velocity1Buffer, updateVelocityPrgLocs.oldVelocity],
  ]);
  const updateVelocityVA2 = makeVertexArray(gl, [
    [velocity2Buffer, updateVelocityPrgLocs.oldVelocity],
  ]);

  const drawVA1 = makeVertexArray(
      gl, [[position1Buffer, drawParticlesProgLocs.position]]);
  const drawVA2 = makeVertexArray(
      gl, [[position2Buffer, drawParticlesProgLocs.position]]);

  function makeTransformFeedback(gl, buffer) {
    const tf = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffer);
    return tf;
  }

  const tf1 = makeTransformFeedback(gl, position1Buffer);
  const tf2 = makeTransformFeedback(gl, position2Buffer);
  const tf3 = makeTransformFeedback(gl, velocity1Buffer);
  const tf4 = makeTransformFeedback(gl, velocity2Buffer);

  // unbind left over stuff
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

  let current = {
    updateVA: updatePositionVA1,  // read from position1
    tf: tf2,                      // write to position2
    tfVelocity: tf4,
    updateVelocityVA: updateVelocityVA1,
    drawVA: drawVA2,              // draw with position2
  };
  let next = {
    updateVA: updatePositionVA2,  // read from position2
    tf: tf1,                      // write to position1
    tfVelocity: tf3,
    updateVelocityVA: updateVelocityVA2,
    drawVA: drawVA1,              // draw with position1
  };

  let then = 0;
  function render(time) {
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
    gl.bindVertexArray(current.updateVA);
    gl.uniform2f(updatePositionPrgLocs.canvasDimensions, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(updatePositionPrgLocs.deltaTime, deltaTime);

    gl.enable(gl.RASTERIZER_DISCARD);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, current.tf);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, numParticles);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    
    // compute the new velocities
    gl.useProgram(updateVelocityProgram);
    gl.bindVertexArray(current.updateVelocityVA);
    gl.uniform2f(updateVelocityProgram.canvasDimensions, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(updateVelocityProgram.deltaTime, deltaTime);

    gl.enable(gl.RASTERIZER_DISCARD);

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

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
