import "./style.css"

import { getRenderingContext, verifyGL } from "./boilerplate";
import testVert from "./test1.vert"
import testFrag from "./test1.frag"

window.addEventListener("load", setupWebGL, false);
let gl: WebGL2RenderingContext | null;
let program: WebGLProgram | null;

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

  /*
  document.querySelector("canvas")!.addEventListener("click", (evt) => {
    const clickXRelativeToCanvas = evt.pageX - evt.target.offsetLeft;
    const clickXinWebGLCoords = 2.0 * (clickXRelativeToCanvas - gl.drawingBufferWidth / 2) / gl.drawingBufferWidth;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([clickXinWebGLCoords, 1]),
      gl.STATIC_DRAW,
    );
    gl.drawArrays(gl.POINTS, 0, 1);
  }, false);
  */
  tick()
}

let t = 0
function tick() {
  if (!gl) throw("WebGL rendering context lost?")
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([Math.cos(t), Math.sin(t)]),
    gl.STREAM_DRAW,
  );
  gl.drawArrays(gl.POINTS, 0, 1);
  t += 0.01
  window.requestAnimationFrame(tick)
}

let buffer: WebGLBuffer | null;
function initializeAttributes() {
  if (!gl) throw("WebGL rendering context lost?")
  gl.enableVertexAttribArray(0);
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0]), gl.STREAM_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
}

window.addEventListener("beforeunload", cleanup, true);
function cleanup() {
  if (!gl) throw("WebGL rendering context lost?")
  gl.useProgram(null);
  if (buffer) {
    gl.deleteBuffer(buffer);
  }
  if (program) {
    gl.deleteProgram(program);
  }
}
