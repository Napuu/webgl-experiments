// NOTE - most of this is from the awesome tutorial simply converted to ts.
// from https://webgl2fundamentals.org/webgl/lessons/webgl-gpgpu.html
export function makeBuffer(
  gl: WebGL2RenderingContext,
  sizeOrData: number | Float32Array,
  usage: number
) {
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, sizeOrData as any, usage);
  return buf;
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
    console.error("Program creation failed");
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
export function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  src: string
) {
  const shader = gl.createShader(type);
  if (!shader) {
    console.error("Creating shader failed", type);
    return;
  }
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "");
  }
  return shader;
}

// js-version from https://webgl2fundamentals.org/webgl/lessons/webgl-gpgpu.html
// prettier-ignore
export const orthographic = (
  left: number,
  right: number,
  bottom: number,
  top: number,
  near: number,
  far: number
) =>
  new Float32Array([
    2 / (right - left), 0, 0, 0,
    0, 2 / (top - bottom), 0, 0,
    0, 0, 2 / (near - far), 0,
    (left + right) / (left - right), (bottom + top) / (bottom - top), (near + far) / (near - far), 1,
  ]);

export function makeVertexArray(
  gl: WebGL2RenderingContext,
  bufLocPairs: [WebGLBuffer, number][]
) {
  const va = gl.createVertexArray();
  gl.bindVertexArray(va);
  for (const [buffer, loc] of bufLocPairs) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(
      loc, // attribute location
      2, // number of elements
      gl.FLOAT, // type of data
      false, // normalize
      0, // stride (0 = auto)
      0 // offset
    );
  }
  return va;
}
