import{S as en,e as P,r as W,c as C,m as M,a as u,b as an,g as v,o as sn}from"./utils.405aee69.js";var rn=`#version 300 es
in vec2 oldPosition;
in vec2 oldVelocity;

uniform float deltaTime;
uniform vec2 canvasDimensions;

out vec2 newPosition;

vec2 euclideanModulo(vec2 n, vec2 m) {
  return mod(mod(n, m) + m, m);
}

void main() {
  
  
  
  newPosition = oldPosition + oldVelocity * deltaTime;
  
}`,cn=`#version 300 es
precision highp float;
  void main() {
}`,ln=`#version 300 es
in vec2 oldPosition;
in vec2 oldVelocity;

uniform float deltaTime;
uniform vec2 canvasDimensions;
uniform vec2 gravityPosition;
uniform int reset;

out vec2 newVelocity;

float scale(float x, float inMin, float inMax, float outMin, float outMax) {
  float outRange = outMax - outMin;
  float inRange  = inMax - inMin;
  return (x - inMin) * outRange / inRange + outMin;
}

void main() {

  vec2 grav_vector = gravityPosition - oldPosition;
  vec2 normalized_grav_vector = normalize(grav_vector);
  float grav_dist = length(grav_vector);
  
  
  
  
  float maxDim = float(max(canvasDimensions.x, canvasDimensions.y));
  float largeScreenFix = 1.;
  if (maxDim > 700.) {
    largeScreenFix = scale(maxDim - 700., 700., 2000., 1.0, 2.0);
  }

  float maxNewVelocity = 100.;
  if (grav_dist < 1.5) {
    newVelocity = vec2(0, 0);
  } else {
    float grav_dist_scaled = grav_dist * 0.05;
    newVelocity = oldVelocity + largeScreenFix * 200.* (normalized_grav_vector / (grav_dist_scaled * grav_dist_scaled));
    if (length(newVelocity) > maxNewVelocity) {
      newVelocity = normalize(newVelocity) * maxNewVelocity;
    }
  }
}`,dn=`#version 300 es
precision highp float;
  void main() {
}`,fn=`#version 300 es
in vec4 position;
in vec4 velocity;
uniform mat4 matrix;
out vec4 color;

float scale(float x, float inMin, float inMax, float outMin, float outMax) {
  float outRange = outMax - outMin;
  float inRange  = inMax - inMin;
  return (x - inMin) * outRange / inRange + outMin;
}

void main() {
  
  float inMin = -100.;
  float inMax = 100.;
  gl_Position = matrix * position;
  gl_PointSize = 2.0;
  color = vec4(
    1.,
    scale(velocity.x, inMin, inMax, 0.0, 0.9),
    scale(velocity.y, inMin, inMax, 0.0, 0.9),
    1.0
  );
}`,mn=`#version 300 es
precision highp float;
in vec4 color;
out vec4 outColor;
void main() {
  vec2 coord = gl_PointCoord - vec2(1.);
  if (length(coord) > 1.) discard;
  outColor = color;
}`;const F=new en,un=new URLSearchParams(document.location.search);un.get("stats")&&(F.showPanel(0),document.body.appendChild(F.dom));let q=!1,_=[0,0],g=0;const vn=1;function gn(){const e=document.querySelector("canvas");if(!e){P("Canvas not found");return}window.addEventListener("resize",()=>W(e)),W(e);const B=(t,o)=>{_=[t,e.height-o]},b=t=>{if(t.type==="touchmove"||t.type==="touchstart"){t.preventDefault();const o=t,i=t.type==="touchmove"?o.touches[0]:o.changedTouches[0];B(i.clientX,i.clientY)}else if(t.type==="mousemove"||t.type==="mousedown"){const o=t;B(o.clientX,o.clientY)}g=1},p=(t,o)=>{q=o,b(t)};e.addEventListener("mousedown",t=>p(t,!0)),e.addEventListener("mouseup",t=>p(t,!1)),e.addEventListener("mousemove",b),e.addEventListener("touchstart",t=>p(t,!0)),e.addEventListener("touchmove",b),e.addEventListener("touchend",t=>p(t,!1));const n=e.getContext("webgl2");if(!n){P("WebGL2 context not found");return}const l=C(n,rn,cn,["newPosition"]),a=C(n,ln,dn,["newVelocity"]),y=C(n,fn,mn);if(!l||!y||!a){P("Program compilation failed");return}const d={oldPosition:n.getAttribLocation(l,"oldPosition"),oldVelocity:n.getAttribLocation(l,"oldVelocity"),canvasDimensions:n.getUniformLocation(l,"canvasDimensions"),deltaTime:n.getUniformLocation(l,"deltaTime")},s={oldPosition:n.getAttribLocation(a,"oldPosition"),oldVelocity:n.getAttribLocation(a,"oldVelocity"),gravityPosition:n.getUniformLocation(a,"gravityPosition"),reset:n.getUniformLocation(a,"reset"),canvasDimensions:n.getUniformLocation(a,"canvasDimensions"),deltaTime:n.getUniformLocation(a,"deltaTime")},h={position:n.getAttribLocation(y,"position"),velocity:n.getAttribLocation(y,"velocity"),matrix:n.getUniformLocation(y,"matrix")},A=Math.min(Math.floor(n.canvas.width*n.canvas.height*.1),1e6),N=(t,o)=>new Array(t).fill(0).map(()=>o.map(i=>an(...i))).flat(),k=new Float32Array(N(A,[[-e.width,e.width],[-e.height,e.height]])),V=50,I=new Float32Array(N(A,[[-V,V],[-V,V]])),f=M(n,k,n.DYNAMIC_DRAW),w=M(n,k,n.DYNAMIC_DRAW),m=M(n,I,n.DYNAMIC_DRAW),x=M(n,I,n.DYNAMIC_DRAW);if(!f||!w||!m||!x){P("Something wrong with buffers");return}const G=u(n,[[f,d.oldPosition],[m,d.oldVelocity]]),$=u(n,[[w,d.oldPosition],[m,d.oldVelocity]]),X=u(n,[[f,s.oldPosition],[m,s.oldVelocity]]),Z=u(n,[[f,s.oldPosition],[x,s.oldVelocity]]),j=u(n,[[f,h.position],[m,h.velocity]]),H=u(n,[[w,h.position],[x,h.velocity]]);function R(t,o){const i=t.createTransformFeedback();return t.bindTransformFeedback(t.TRANSFORM_FEEDBACK,i),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,0,o),i}const J=R(n,f),Q=R(n,w),nn=R(n,m),tn=R(n,x);n.bindBuffer(n.ARRAY_BUFFER,null),n.bindBuffer(n.TRANSFORM_FEEDBACK_BUFFER,null);let c={updatePositionVA:G,updateVelocityVA:X,tfPosition:Q,tfVelocity:tn,drawVA:H},O={updatePositionVA:$,updateVelocityVA:Z,tfPosition:J,tfVelocity:nn,drawVA:j},U=0;function z(t){if(F.begin(),!n){P("WebGL2 context lost during rendering?");return}g>0&&(g+=1,g>vn&&(g=0)),t*=.001;const o=t-U;U=t,n.clear(n.COLOR_BUFFER_BIT),n.useProgram(l),n.bindVertexArray(c.updatePositionVA),n.uniform2f(d.canvasDimensions,n.canvas.width,n.canvas.height),n.uniform1f(d.deltaTime,o),n.enable(n.RASTERIZER_DISCARD),n.bindTransformFeedback(n.TRANSFORM_FEEDBACK,c.tfPosition),n.beginTransformFeedback(n.POINTS),n.drawArrays(n.POINTS,0,A),n.endTransformFeedback(),n.bindTransformFeedback(n.TRANSFORM_FEEDBACK,null);const[i,T]=_,r=100,K=40,Y=50,D=Math.max(n.canvas.width/K,Y),E=Math.max(n.canvas.height/K,Y);let L=i+v()*D,S=T+v()*E;i<r?L=r+v()*D:i>n.canvas.width-r&&(L=n.canvas.width-r+v()*D),T<r?S=r+v()*E:T>n.canvas.height-r&&(S=n.canvas.height-r+v()*E),q||(_=[L,S]),n.useProgram(a),n.bindVertexArray(c.updateVelocityVA),n.uniform2f(s.gravityPosition,..._),n.uniform1i(s.reset,g),n.uniform2f(s.canvasDimensions,n.canvas.width,n.canvas.height),n.uniform1f(s.deltaTime,o),n.bindTransformFeedback(n.TRANSFORM_FEEDBACK,c.tfVelocity),n.beginTransformFeedback(n.POINTS),n.drawArrays(n.POINTS,0,A),n.endTransformFeedback(),n.bindTransformFeedback(n.TRANSFORM_FEEDBACK,null),n.disable(n.RASTERIZER_DISCARD),n.useProgram(y),n.bindVertexArray(c.drawVA),n.viewport(0,0,n.canvas.width,n.canvas.height),n.uniformMatrix4fv(h.matrix,!1,sn(0,n.canvas.width,0,n.canvas.height,-1,1)),n.drawArrays(n.POINTS,0,A);{const on=c;c=O,O=on}F.end(),requestAnimationFrame(z)}requestAnimationFrame(z)}gn();
