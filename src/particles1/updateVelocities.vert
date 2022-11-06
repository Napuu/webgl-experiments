#version 300 es
in vec2 oldPosition;
in vec2 oldVelocity;

uniform float deltaTime;
uniform vec2 canvasDimensions;

out vec2 newVelocity;

void main() {
  float threshold = 0.01;
  newVelocity = oldVelocity  * 0.99;
  if (newVelocity.x < threshold || newVelocity.y < threshold) {

  }
}