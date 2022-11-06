#version 300 es
in vec2 oldPosition;
in vec2 oldVelocity;

uniform float deltaTime;
uniform vec2 canvasDimensions;
uniform vec2 gravityPosition;
uniform int reset;

out vec2 newVelocity;


void main() {
  float threshold = 0.01;
  
  float maxDist = float(max(canvasDimensions.x, canvasDimensions.y)) * 1.5;

  vec2 grav_vector = gravityPosition - oldPosition;
  vec2 normalized_grav_vector = normalize(grav_vector);
  float grav_dist = length(grav_vector);

  float maxNewVelocity = 200.;
  if (false && grav_dist < .5) {
    newVelocity = vec2(0, 0);
  } else {
    float grav_dist_scaled = grav_dist * 0.05;
    newVelocity = oldVelocity + 10.* (normalized_grav_vector / (grav_dist_scaled * grav_dist_scaled));
    if (length(newVelocity) > maxNewVelocity) {
      if (reset > 0 && grav_dist < 100.) {
        newVelocity = vec2(0, 0);
      } else {
        newVelocity = normalize(newVelocity) * maxNewVelocity;
      }
    }
  }
  if (grav_dist > maxDist) {
    newVelocity = newVelocity + normalized_grav_vector * pow(grav_dist - maxDist, 2.);    
  }
}