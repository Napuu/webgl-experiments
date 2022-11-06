attribute vec2 position;
varying vec2 vPos;
void main() {
  gl_Position = vec4(position[0] * 0.3, position[1] * 0.3, (position[0] + position[1]) * 0.5, 1.0);
  gl_PointSize = 400.0;
  vPos = position;
}