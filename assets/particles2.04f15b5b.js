import{S as rn,e as p,r as $,c as I,m as F,a as g,b as sn,g as h,o as cn}from"./utils.405aee69.js";var ln=`#version 300 es
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
  
  
}`,dn=`#version 300 es
precision highp float;
  void main() {
}`,fn=`#version 300 es
in vec2 oldPosition;
in vec2 oldVelocity;

uniform float deltaTime;
uniform vec2 canvasDimensions;
uniform vec2 gravityPosition;
uniform float gravityMultiplier;
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
    newVelocity = oldVelocity + largeScreenFix * gravityMultiplier * 200.* (normalized_grav_vector / (pow(grav_dist_scaled,3.)));

    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    if (length(newVelocity) > maxNewVelocity) {
      newVelocity = normalize(newVelocity) * maxNewVelocity;
    }
  }
}`,mn=`#version 300 es
precision highp float;
  void main() {
}`,un=`#version 300 es
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
  float angle = atan(velocity.y, velocity.x);

  const float PI = 3.14159265359;
  float normalizedAngle = (angle + PI) / (2.0 * PI);

  color = vec4(
      0.5 * cos(normalizedAngle * 2.0 * PI) +
      0.5 * sin(normalizedAngle * 2.0 * PI),
      0.5 + 0.5 * cos(normalizedAngle * 2.0 * PI),
      0.5 + 0.5 * sin(normalizedAngle * 2.0 * PI),
      1.0
  );
}`,vn=`#version 300 es
precision highp float;
in vec4 color;
out vec4 outColor;
void main() {
  vec2 coord = gl_PointCoord - vec2(1.);
  if (length(coord) > 1.) discard;
  outColor = color;
}`;const b=new rn,gn=new URLSearchParams(document.location.search);gn.get("stats")&&(b.showPanel(0),document.body.appendChild(b.dom));let B=!1,r=[-1,-1],_=.01,d=0;const hn=1;function yn(){const o=document.querySelector("canvas");if(!o){p("Canvas not found");return}window.addEventListener("resize",()=>$(o)),$(o);const N=t=>{if(!(t.type==="mousemove"&&!B)){if(t.type==="touchmove"){const e=t;r=[e.touches[0].clientX,o.height-e.touches[0].clientY]}else{const e=t;r=[e.clientX,o.height-e.clientY]}d=1}},V=t=>{B=t};o.addEventListener("mousedown",()=>V(!0)),o.addEventListener("mouseup",()=>V(!1)),o.addEventListener("mousemove",N),o.addEventListener("touchstart",()=>V(!0)),o.addEventListener("touchmove",N),o.addEventListener("touchend",()=>V(!1));const n=o.getContext("webgl2");if(!n){p("WebGL2 context not found");return}const f=I(n,ln,dn,["newPosition"]),i=I(n,fn,mn,["newVelocity"]),y=I(n,un,vn);if(!f||!y||!i){p("Program compilation failed");return}const m={oldPosition:n.getAttribLocation(f,"oldPosition"),oldVelocity:n.getAttribLocation(f,"oldVelocity"),canvasDimensions:n.getUniformLocation(f,"canvasDimensions"),deltaTime:n.getUniformLocation(f,"deltaTime")},a={oldPosition:n.getAttribLocation(i,"oldPosition"),oldVelocity:n.getAttribLocation(i,"oldVelocity"),gravityPosition:n.getUniformLocation(i,"gravityPosition"),gravityMultiplier:n.getUniformLocation(i,"gravityMultiplier"),reset:n.getUniformLocation(i,"reset"),canvasDimensions:n.getUniformLocation(i,"canvasDimensions"),deltaTime:n.getUniformLocation(i,"deltaTime")},P={position:n.getAttribLocation(y,"position"),velocity:n.getAttribLocation(y,"velocity"),matrix:n.getUniformLocation(y,"matrix")},A=Math.min(Math.floor(n.canvas.width*n.canvas.height*.3),1e6),k=(t,e)=>new Array(t).fill(0).map(()=>e.map(s=>sn(...s))).flat(),O=new Float32Array(k(A,[[-o.width,o.width],[-o.height,o.height]])),w=50,U=new Float32Array(k(A,[[-w,w],[-w,w]])),u=F(n,O,n.DYNAMIC_DRAW),M=F(n,O,n.DYNAMIC_DRAW),v=F(n,U,n.DYNAMIC_DRAW),x=F(n,U,n.DYNAMIC_DRAW);if(!u||!M||!v||!x){p("Something wrong with buffers");return}const G=g(n,[[u,m.oldPosition],[v,m.oldVelocity]]),X=g(n,[[M,m.oldPosition],[v,m.oldVelocity]]),Z=g(n,[[u,a.oldPosition],[v,a.oldVelocity]]),j=g(n,[[u,a.oldPosition],[x,a.oldVelocity]]),H=g(n,[[u,P.position],[v,P.velocity]]),J=g(n,[[M,P.position],[x,P.velocity]]);function R(t,e){const s=t.createTransformFeedback();return t.bindTransformFeedback(t.TRANSFORM_FEEDBACK,s),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,0,e),s}const Q=R(n,u),nn=R(n,M),tn=R(n,v),on=R(n,x);n.bindBuffer(n.ARRAY_BUFFER,null),n.bindBuffer(n.TRANSFORM_FEEDBACK_BUFFER,null);let l={updatePositionVA:G,updateVelocityVA:Z,tfPosition:nn,tfVelocity:on,drawVA:J},z={updatePositionVA:X,updateVelocityVA:j,tfPosition:Q,tfVelocity:tn,drawVA:H},K=0,T=0,en=1e3;function Y(t){if(T+=1,T>en&&(_+=.01),_>10&&(_=.01,T=0,r=[n.canvas.width-r[0],n.canvas.height-r[1]],d=1),b.begin(),!n){p("WebGL2 context lost during rendering?");return}d>0&&(d+=1,d>hn&&(d=0)),t*=.001;const e=t-K;K=t,n.clear(n.COLOR_BUFFER_BIT),n.useProgram(f),n.bindVertexArray(l.updatePositionVA),n.uniform2f(m.canvasDimensions,n.canvas.width,n.canvas.height),n.uniform1f(m.deltaTime,e),n.enable(n.RASTERIZER_DISCARD),n.bindTransformFeedback(n.TRANSFORM_FEEDBACK,l.tfPosition),n.beginTransformFeedback(n.POINTS),n.drawArrays(n.POINTS,0,A),n.endTransformFeedback(),n.bindTransformFeedback(n.TRANSFORM_FEEDBACK,null);const[s,D]=r[0]===-1?[n.canvas.width/2,n.canvas.height/2]:r,c=100,W=200,q=2,E=Math.max(n.canvas.width/W,q),L=Math.max(n.canvas.height/W,q);let S=s+h()*E,C=D+h()*L;s<c?S=c+h()*E:s>n.canvas.width-c&&(S=n.canvas.width-c+h()*E),D<c?C=c+h()*L:D>n.canvas.height-c&&(C=n.canvas.height-c+h()*L),B||(r=[S,C]),n.useProgram(i),n.bindVertexArray(l.updateVelocityVA),n.uniform2f(a.gravityPosition,...r),n.uniform1f(a.gravityMultiplier,_),n.uniform1i(a.reset,d),n.uniform2f(a.canvasDimensions,n.canvas.width,n.canvas.height),n.uniform1f(a.deltaTime,e),n.bindTransformFeedback(n.TRANSFORM_FEEDBACK,l.tfVelocity),n.beginTransformFeedback(n.POINTS),n.drawArrays(n.POINTS,0,A),n.endTransformFeedback(),n.bindTransformFeedback(n.TRANSFORM_FEEDBACK,null),n.disable(n.RASTERIZER_DISCARD),n.useProgram(y),n.bindVertexArray(l.drawVA),n.viewport(0,0,n.canvas.width,n.canvas.height),n.uniformMatrix4fv(P.matrix,!1,cn(0,n.canvas.width,0,n.canvas.height,-1,1)),n.drawArrays(n.POINTS,0,A);{const an=l;l=z,z=an}b.end(),requestAnimationFrame(Y)}requestAnimationFrame(Y)}yn();
