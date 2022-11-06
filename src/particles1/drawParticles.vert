#version 300 es
in vec4 position;
uniform mat4 matrix;

void main() {
  // do the common matrix math
  gl_Position = matrix * position;
  gl_PointSize = 1.0;
}