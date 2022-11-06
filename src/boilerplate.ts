// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Boilerplate_1
export function getRenderingContext() {
  const canvas = document.querySelector("canvas");
  if (!canvas) return null
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const _gl = canvas.getContext("webgl2")
    || canvas.getContext("experimental-webgl2");
  if (!_gl) {
    console.error("gl not found")
    return null;
  }
  const gl = _gl as WebGL2RenderingContext
  gl.viewport(0, 0,
    gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return gl;
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
  transformFeedbackVaryings?: string[]
) {
  const program = gl.createProgram();
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!program || !vertexShader || !fragmentShader) {
    console.error("Program creation failed")
    return;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  if (transformFeedbackVaryings) {
    gl.transformFeedbackVaryings(
      program,
      transformFeedbackVaryings,
      gl.SEPARATE_ATTRIBS
    );
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    // no idea if 0 is correct param
    throw new Error(gl.getProgramParameter(program, 0));
  }
  return program;
}

// js-version from https://webgl2fundamentals.org/webgl/lessons/webgl-gpgpu.html
export function createShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    console.error("Creating shader failed", type)
    return
  }
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "");
  }
  return shader;
}

// js-version from https://webgl2fundamentals.org/webgl/lessons/webgl-gpgpu.html
export function makeBuffer(gl: WebGL2RenderingContext, sizeOrData: number, usage=gl.STATIC_DRAW) {
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
  return buf;
}

// js-version from https://webgl2fundamentals.org/webgl/lessons/webgl-gpgpu.html
export function makeBufferAndSetAttribute(gl: WebGL2RenderingContext, data: any, loc: number) {
  const buf = makeBuffer(gl, data, gl.STATIC_DRAW);
  // setup our attributes to tell WebGL how to pull
  // the data from the buffer above to the attribute
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(
      loc,
      1,         // size (num components)
      gl.FLOAT,  // type of data in buffer
      false,     // normalize
      0,         // stride (0 = auto)
      0,         // offset
  );
}
export function orthographic(left, right, bottom, top, near, far) {
  const dst = new Float32Array(16);

  dst[0] = 2 / (right - left);
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = 0;
  dst[5] = 2 / (top - bottom);
  dst[6] = 0;
  dst[7] = 0;
  dst[8] = 0;
  dst[9] = 0;
  dst[10] = 2 / (near - far);
  dst[11] = 0;
  dst[12] = (left + right) / (left - right);
  dst[13] = (bottom + top) / (bottom - top);
  dst[14] = (near + far) / (near - far);
  dst[15] = 1;

  return dst;
}