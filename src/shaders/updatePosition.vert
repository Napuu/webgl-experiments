#version 300 es
precision highp float;
in vec2 oldPosition;
out vec2 newPosition;
void main() {
  newPosition = vec2(oldPosition[0] + 0.1, oldPosition[1]);
  // oldPosition[1] + 0.001);
  // newPosition = vec2(1, 0);
}