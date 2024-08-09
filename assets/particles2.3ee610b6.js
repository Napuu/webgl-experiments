import{S as tn,e as V,r as W,c as S,m as F,a as u,b as en,g as v,o as an}from"./utils.405aee69.js";var sn=`#version 300 es
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
  
  
}`,rn=`#version 300 es
precision highp float;
  void main() {
}`,cn=`#version 300 es
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
  vec2 normalized_grav_vector = -normalize(grav_vector);
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
    newVelocity = oldVelocity + largeScreenFix * 200.* (normalized_grav_vector / (pow(grav_dist_scaled,3.)));

    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    if (length(newVelocity) > maxNewVelocity) {
      newVelocity = normalize(newVelocity) * maxNewVelocity;
    }
  }
}`,ln=`#version 300 es
precision highp float;
  void main() {
}`,dn=`#version 300 es
in vec4 position;
in vec4 velocity;
uniform mat4 matrix;
out vec4 color;

float scale(float x, float inMin, float inMax, float outMin, float outMax) {
  float outRange = outMax - outMin;
  float inRange  = inMax - inMin;
  return clamp((x - inMin) * outRange / inRange + outMin, outMin, outMax);
  
}

void main() {
  
  float inMin = -10.;
  float inMax = 20.;
  gl_Position = matrix * position;
  gl_PointSize = 2.0;
  color = vec4(
    scale(velocity.x, inMax, inMax, 0., 1.),
    scale(velocity.y, inMax, inMax, 0., 1.),
    
    1.,
    1.0
    
  );
  
  
  
  
  
  
  
  
}`,fn=`#version 300 es
precision highp float;
in vec4 color;
out vec4 outColor;
void main() {
  vec2 coord = gl_PointCoord - vec2(1.);
  if (length(coord) > 1.) discard;
  outColor = color;
}`;const _=new tn,mn=new URLSearchParams(document.location.search);mn.get("stats")&&(_.showPanel(0),document.body.appendChild(_.dom));let C=!1,g=[-1,-1],h=0;const un=1;function vn(){const t=document.querySelector("canvas");if(!t){V("Canvas not found");return}window.addEventListener("resize",()=>W(t)),W(t);const B=o=>{if(!(o.type==="mousemove"&&!C)){if(o.type==="touchmove"){const e=o;g=[e.touches[0].clientX,t.height-e.touches[0].clientY]}else{const e=o;g=[e.clientX,t.height-e.clientY]}h=1}},w=o=>{C=o};t.addEventListener("mousedown",()=>w(!0)),t.addEventListener("mouseup",()=>w(!1)),t.addEventListener("mousemove",B),t.addEventListener("touchstart",()=>w(!0)),t.addEventListener("touchmove",B),t.addEventListener("touchend",()=>w(!1));const n=t.getContext("webgl2");if(!n){V("WebGL2 context not found");return}const l=S(n,sn,rn,["newPosition"]),i=S(n,cn,ln,["newVelocity"]),y=S(n,dn,fn);if(!l||!y||!i){V("Program compilation failed");return}const d={oldPosition:n.getAttribLocation(l,"oldPosition"),oldVelocity:n.getAttribLocation(l,"oldVelocity"),canvasDimensions:n.getUniformLocation(l,"canvasDimensions"),deltaTime:n.getUniformLocation(l,"deltaTime")},a={oldPosition:n.getAttribLocation(i,"oldPosition"),oldVelocity:n.getAttribLocation(i,"oldVelocity"),gravityPosition:n.getUniformLocation(i,"gravityPosition"),reset:n.getUniformLocation(i,"reset"),canvasDimensions:n.getUniformLocation(i,"canvasDimensions"),deltaTime:n.getUniformLocation(i,"deltaTime")},A={position:n.getAttribLocation(y,"position"),velocity:n.getAttribLocation(y,"velocity"),matrix:n.getUniformLocation(y,"matrix")},P=Math.min(Math.floor(n.canvas.width*n.canvas.height*.3),1e6),N=(o,e)=>new Array(o).fill(0).map(()=>e.map(s=>en(...s))).flat(),I=new Float32Array(N(P,[[-t.width,t.width],[-t.height,t.height]])),p=50,k=new Float32Array(N(P,[[-p,p],[-p,p]])),f=F(n,I,n.DYNAMIC_DRAW),x=F(n,I,n.DYNAMIC_DRAW),m=F(n,k,n.DYNAMIC_DRAW),M=F(n,k,n.DYNAMIC_DRAW);if(!f||!x||!m||!M){V("Something wrong with buffers");return}const q=u(n,[[f,d.oldPosition],[m,d.oldVelocity]]),$=u(n,[[x,d.oldPosition],[m,d.oldVelocity]]),G=u(n,[[f,a.oldPosition],[m,a.oldVelocity]]),X=u(n,[[f,a.oldPosition],[M,a.oldVelocity]]),Z=u(n,[[f,A.position],[m,A.velocity]]),j=u(n,[[x,A.position],[M,A.velocity]]);function R(o,e){const s=o.createTransformFeedback();return o.bindTransformFeedback(o.TRANSFORM_FEEDBACK,s),o.bindBufferBase(o.TRANSFORM_FEEDBACK_BUFFER,0,e),s}const H=R(n,f),J=R(n,x),Q=R(n,m),nn=R(n,M);n.bindBuffer(n.ARRAY_BUFFER,null),n.bindBuffer(n.TRANSFORM_FEEDBACK_BUFFER,null);let c={updatePositionVA:q,updateVelocityVA:G,tfPosition:J,tfVelocity:nn,drawVA:j},O={updatePositionVA:$,updateVelocityVA:X,tfPosition:H,tfVelocity:Q,drawVA:Z},U=0;function z(o){if(_.begin(),!n){V("WebGL2 context lost during rendering?");return}h>0&&(h+=1,h>un&&(h=0)),o*=.001;const e=o-U;U=o,n.clear(n.COLOR_BUFFER_BIT),n.useProgram(l),n.bindVertexArray(c.updatePositionVA),n.uniform2f(d.canvasDimensions,n.canvas.width,n.canvas.height),n.uniform1f(d.deltaTime,e),n.enable(n.RASTERIZER_DISCARD),n.bindTransformFeedback(n.TRANSFORM_FEEDBACK,c.tfPosition),n.beginTransformFeedback(n.POINTS),n.drawArrays(n.POINTS,0,P),n.endTransformFeedback(),n.bindTransformFeedback(n.TRANSFORM_FEEDBACK,null);const[s,b]=g[0]===-1?[n.canvas.width/2,n.canvas.height/2]:g,r=100,K=200,Y=2,T=Math.max(n.canvas.width/K,Y),D=Math.max(n.canvas.height/K,Y);let E=s+v()*T,L=b+v()*D;s<r?E=r+v()*T:s>n.canvas.width-r&&(E=n.canvas.width-r+v()*T),b<r?L=r+v()*D:b>n.canvas.height-r&&(L=n.canvas.height-r+v()*D),C||(g=[E,L]),n.useProgram(i),n.bindVertexArray(c.updateVelocityVA),n.uniform2f(a.gravityPosition,...g),n.uniform1i(a.reset,h),n.uniform2f(a.canvasDimensions,n.canvas.width,n.canvas.height),n.uniform1f(a.deltaTime,e),n.bindTransformFeedback(n.TRANSFORM_FEEDBACK,c.tfVelocity),n.beginTransformFeedback(n.POINTS),n.drawArrays(n.POINTS,0,P),n.endTransformFeedback(),n.bindTransformFeedback(n.TRANSFORM_FEEDBACK,null),n.disable(n.RASTERIZER_DISCARD),n.useProgram(y),n.bindVertexArray(c.drawVA),n.viewport(0,0,n.canvas.width,n.canvas.height),n.uniformMatrix4fv(A.matrix,!1,an(0,n.canvas.width,0,n.canvas.height,-1,1)),n.drawArrays(n.POINTS,0,P);{const on=c;c=O,O=on}_.end(),requestAnimationFrame(z)}requestAnimationFrame(z)}vn();
