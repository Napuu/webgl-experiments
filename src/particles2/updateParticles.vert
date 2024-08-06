#version 300 es
in vec2 oldPosition;
in vec2 oldVelocity;

uniform float deltaTime;
uniform vec2 canvasDimensions;

out vec2 newPosition;

vec2 euclideanModulo(vec2 n, vec2 m) {
  return mod(mod(n, m) + m, m);
}

void main() {
  newPosition = euclideanModulo(
      oldPosition + oldVelocity * deltaTime,
     canvasDimensions);
  // newPosition = oldPosition + oldVelocity * deltaTime;
  // newVelocity = -oldVelocity;
}