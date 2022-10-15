// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Boilerplate_1
export function getRenderingContext() {
  const canvas = document.querySelector("canvas");
  if (!canvas) return null
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const _gl = canvas.getContext("webgl")
    || canvas.getContext("experimental-webgl");
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

export function verifyGL(gl: WebGL2RenderingContext | null) {
  if (!gl) {
    throw("WebGL rendering context lost?")
  }
}