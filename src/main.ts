import "./style.css"

import { createProgram, getRenderingContext, makeBuffer, makeBufferAndSetAttribute } from "./boilerplate";
import testVert from "./shaders/test1.vert"
import testFrag from "./shaders/test1.frag"
import updatePositionVert from "./shaders/updatePosition.vert"
import updatePositionFrag from "./shaders/updatePosition.frag"


function log(...args) {
  const elem = document.createElement('pre');
  elem.textContent = args.join(' ');
  document.body.appendChild(elem);
}

window.addEventListener("load", setupWebGL, false);
let gl: WebGL2RenderingContext | null;
let program: WebGLProgram | null;
let updateProgram: WebGLProgram | null;
function setupWebGL() {
  // window.removeEventListener(evt.type, setupWebGL, false);
  if (!(gl = getRenderingContext())) return;

  const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
  gl.shaderSource(vertexShader, testVert);
  gl.compileShader(vertexShader);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
  gl.shaderSource(fragmentShader, testFrag);
  gl.compileShader(fragmentShader);
  program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const linkErrLog = gl.getProgramInfoLog(program);
    cleanup();
    console.error(`Shader program did not link successfully. Error log: ${linkErrLog}`);
    return;
  }

  initializeAttributes();
  gl.useProgram(program);
  gl.drawArrays(gl.POINTS, 0, 1);


  const updateProgram = createProgram(gl, updatePositionVert, updatePositionFrag, ["newPosition"])
  // gl.useProgram(program)
  if (!updateProgram) {
    console.error("??");
    return
  }

  gl.useProgram(updateProgram)
  const aLoc = gl.getAttribLocation(updateProgram, 'oldPosition');
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // input buffer
  console.log(aLoc)
  const oldPositionBuffer = [0.1, 0.1]
  const aBuffer = makeBufferAndSetAttribute(gl, new Float32Array(oldPositionBuffer), aLoc);

  // Create and fill out a transform feedback
  const tf = gl.createTransformFeedback();
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);

  // make buffers for output
  const newPositionBuffer = makeBuffer(gl, oldPositionBuffer.length * 4);

  // bind the buffers to the transform feedback
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, newPositionBuffer);

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

  // buffer's we are writing to can not be bound else where
  gl.bindBuffer(gl.ARRAY_BUFFER, null);  // productBuffer was still bound to ARRAY_BUFFER so unbind it

  // setup done

  // "render" starts
//
//
  gl.useProgram(updateProgram)
  // bind our input attribute state for the a and b buffers
  gl.bindVertexArray(vao);

  // no need to call the fragment shader
  gl.enable(gl.RASTERIZER_DISCARD);

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, oldPositionBuffer.length);
  gl.endTransformFeedback();
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

  // turn on using fragment shaders again
  gl.disable(gl.RASTERIZER_DISCARD);

  const results = new Float32Array(oldPositionBuffer.length);
  gl.bindBuffer(gl.ARRAY_BUFFER, newPositionBuffer);
  // expensive, used only for debugging
  gl.getBufferSubData(
      gl.ARRAY_BUFFER,
      0,    // byte offset into GPU buffer,
      results,
  );
  console.log(results)
  


  // tick(0)
}

let t = 0
let prevTime = 0
function tick(time: number) {
  if (prevTime === 0) prevTime = time
  if (!gl) throw ("WebGL rendering context lost?")
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([Math.cos(t), Math.sin(t), Math.cos(t + Math.PI), Math.sin(t + Math.PI)]),
    gl.STREAM_DRAW,
  );
  gl.drawArrays(gl.POINTS, 0, 2);
  t += (time - prevTime) * 0.001
  prevTime = time
  window.requestAnimationFrame(tick)
}

let buffer: WebGLBuffer | null;
function initializeAttributes() {
  if (!gl) throw ("WebGL rendering context lost?")
  gl.enableVertexAttribArray(0);
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0]), gl.STREAM_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
}

window.addEventListener("beforeunload", cleanup, true);
function cleanup() {
  if (!gl) throw ("WebGL rendering context lost?")
  gl.useProgram(null);
  if (buffer) {
    gl.deleteBuffer(buffer);
  }
  if (program) {
    gl.deleteProgram(program);
  }
}
