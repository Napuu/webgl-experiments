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
  float angle = atan(velocity.y, velocity.x);

  const float PI = 3.14159265359;
  float normalizedAngle = (angle + PI) / (2.0 * PI);

  color = vec4(
      0.5 + 0.5 * cos(normalizedAngle * 2.0 * PI),
      0.5 + 0.5 * sin(normalizedAngle * 2.0 * PI),
      1.0,
      1.0
  );
}