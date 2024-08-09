#version 300 es
in vec4 position;
in vec4 velocity;
uniform mat4 matrix;
out vec4 color;

float scale(float x, float inMin, float inMax, float outMin, float outMax) {
  float outRange = outMax - outMin;
  float inRange  = inMax - inMin;
  return clamp((x - inMin) * outRange / inRange + outMin, outMin, outMax);
  // return (x - inMin) * outRange / inRange + outMin;
}

void main() {
  // do the common matrix math
  float inMin = -10.;
  float inMax = 20.;
  gl_Position = matrix * position;
  gl_PointSize = 2.0;
  color = vec4(
    scale(velocity.x, inMax, inMax, 0., 1.),
    scale(velocity.y, inMax, inMax, 0., 1.),
    // scale(length(velocity), 0., 250., 0., 1.),
    1.,
    1.0
    // scale(length(velocity), 0., inMax, 0.0, 0.9)
  );
  // color = vec4(
  //   1.-scale(velocity.x, inMin, inMax, 0.1, 0.9),
  //   // 0.,
  //   scale(length(velocity), 0., inMax, 0.0, 0.9),
  //   scale(velocity.y, inMin, inMax, 0.0, 0.9),
  //   // 1.0
  //   scale(length(velocity), 0., inMax, 0.0, 0.9)
  // );
}