#version 300 es
in vec2 oldPosition;
in vec2 oldVelocity;

uniform float deltaTime;
uniform vec2 canvasDimensions;

out vec2 newVelocity;


void main() {
  vec2 gravity_pos = canvasDimensions / 2.;
  float threshold = 0.01;
  // newVelocity = oldVelocity  * 0.99;
  // newVelocity = oldVelocity;
  if (newVelocity.x < threshold || newVelocity.y < threshold) {
    // newVelocity = vec2(500, 1000);
  }
  
  vec2 grav_vector = oldPosition - gravity_pos;
  vec2 normalized_grav_vector = normalize(grav_vector);
  /*
  vec2 grav_dist = length(grav_vector);
  */

  newVelocity = oldVelocity - ((normalized_grav_vector));
}