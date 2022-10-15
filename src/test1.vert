#version 100
attribute vec2 position;

void main() {
  gl_Position = vec4(position[0] * 0.3, position[1] * 0.3, 0.0, 1.0);
  gl_PointSize = 400.0;
}