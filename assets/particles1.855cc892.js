(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&e(s)}).observe(document,{childList:!0,subtree:!0});function a(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerpolicy&&(o.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?o.credentials="include":t.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function e(t){if(t.ep)return;t.ep=!0;const o=a(t);fetch(t.href,o)}})();var ie=`#version 300 es
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
  
}`,ae=`#version 300 es
precision highp float;
  void main() {
}`,re=`#version 300 es
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
}`,se=`#version 300 es
precision highp float;
  void main() {
}`,ce=`#version 300 es
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
}`,le=`#version 300 es
precision highp float;
in vec4 color;
out vec4 outColor;
void main() {
  vec2 coord = gl_PointCoord - vec2(1.);
  if (length(coord) > 1.) discard;
  outColor = color;
}`;function D(n,i,a){const e=n.createBuffer();return n.bindBuffer(n.ARRAY_BUFFER,e),n.bufferData(n.ARRAY_BUFFER,i,a),e}function U(n,i,a,e){const t=n.createProgram(),o=G(n,n.VERTEX_SHADER,i),s=G(n,n.FRAGMENT_SHADER,a);if(!t||!o||!s){console.error("Program creation failed");return}if(n.attachShader(t,o),n.attachShader(t,s),e&&n.transformFeedbackVaryings(t,e,n.SEPARATE_ATTRIBS),n.linkProgram(t),!n.getProgramParameter(t,n.LINK_STATUS))throw new Error(n.getProgramParameter(t,0));return t}function G(n,i,a){const e=n.createShader(i);if(!e){console.error("Creating shader failed",i);return}if(n.shaderSource(e,a),n.compileShader(e),!n.getShaderParameter(e,n.COMPILE_STATUS))throw new Error(n.getShaderInfoLog(e)||"");return e}const de=(n,i,a,e,t,o)=>new Float32Array([2/(i-n),0,0,0,0,2/(e-a),0,0,0,0,2/(t-o),0,(n+i)/(n-i),(a+e)/(a-e),(t+o)/(t-o),1]);function V(n,i){const a=n.createVertexArray();n.bindVertexArray(a);for(const[e,t]of i)n.bindBuffer(n.ARRAY_BUFFER,e),n.enableVertexAttribArray(t),n.vertexAttribPointer(t,2,n.FLOAT,!1,0,0);return a}var fe=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},$={exports:{}};(function(n,i){(function(a,e){n.exports=e()})(fe,function(){var a=function(){function e(l){return s.appendChild(l.dom),l}function t(l){for(var u=0;u<s.children.length;u++)s.children[u].style.display=u===l?"block":"none";o=l}var o=0,s=document.createElement("div");s.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",s.addEventListener("click",function(l){l.preventDefault(),t(++o%s.children.length)},!1);var m=(performance||Date).now(),d=m,r=0,p=e(new a.Panel("FPS","#0ff","#002")),x=e(new a.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var P=e(new a.Panel("MB","#f08","#201"));return t(0),{REVISION:16,dom:s,addPanel:e,showPanel:t,begin:function(){m=(performance||Date).now()},end:function(){r++;var l=(performance||Date).now();if(x.update(l-m,200),l>d+1e3&&(p.update(1e3*r/(l-d),100),d=l,r=0,P)){var u=performance.memory;P.update(u.usedJSHeapSize/1048576,u.jsHeapSizeLimit/1048576)}return l},update:function(){m=this.end()},domElement:s,setMode:t}};return a.Panel=function(e,t,o){var s=1/0,m=0,d=Math.round,r=d(window.devicePixelRatio||1),p=80*r,x=48*r,P=3*r,l=2*r,u=3*r,v=15*r,y=74*r,h=30*r,A=document.createElement("canvas");A.width=p,A.height=x,A.style.cssText="width:80px;height:48px";var c=A.getContext("2d");return c.font="bold "+9*r+"px Helvetica,Arial,sans-serif",c.textBaseline="top",c.fillStyle=o,c.fillRect(0,0,p,x),c.fillStyle=t,c.fillText(e,P,l),c.fillRect(u,v,y,h),c.fillStyle=o,c.globalAlpha=.9,c.fillRect(u,v,y,h),{dom:A,update:function(M,B){s=Math.min(s,M),m=Math.max(m,M),c.fillStyle=o,c.globalAlpha=1,c.fillRect(0,0,p,v),c.fillStyle=t,c.fillText(d(M)+" "+e+" ("+d(s)+"-"+d(m)+")",P,l),c.drawImage(A,u+r,v,y-r,h,u,v,y-r,h),c.fillRect(u+y-r,v,r,h),c.fillStyle=o,c.globalAlpha=.9,c.fillRect(u+y-r,v,r,d((1-M/B)*h))}}},a})})($);const ue=$.exports;function S(){let n=1-Math.random(),i=Math.random();return Math.sqrt(-2*Math.log(n))*Math.cos(2*Math.PI*i)}const E=n=>{console.warn(n)},X=n=>{console.log(1),n.width=window.innerWidth*1,n.height=window.innerHeight*1,console.log(document.body.clientHeight)},me=(n,i)=>(i===void 0&&(i=n,n=0),Math.random()*(i-n)+n),L=new ue,ve=new URLSearchParams(document.location.search);ve.get("stats")&&(L.showPanel(0),document.body.appendChild(L.dom));let z=!1,T=[0,0],F=0;const he=1;function ge(){const n=document.querySelector("canvas");if(!n){E("Canvas not found");return}window.addEventListener("resize",()=>X(n)),X(n);const i=f=>{if(!(f.type==="mousemove"&&!z)){if(f.type==="touchmove"){const g=f;T=[g.touches[0].clientX,n.height-g.touches[0].clientY]}else{const g=f;T=[g.clientX,n.height-g.clientY]}F=1}},a=f=>{z=f};n.addEventListener("mousedown",()=>a(!0)),n.addEventListener("mouseup",()=>a(!1)),n.addEventListener("mousemove",i),n.addEventListener("touchstart",()=>a(!0)),n.addEventListener("touchmove",i),n.addEventListener("touchend",()=>a(!1));const e=n.getContext("webgl2");if(!e){E("WebGL2 context not found");return}const t=U(e,ie,ae,["newPosition"]),o=U(e,re,se,["newVelocity"]),s=U(e,ce,le);if(!t||!s||!o){E("Program compilation failed");return}const m={oldPosition:e.getAttribLocation(t,"oldPosition"),oldVelocity:e.getAttribLocation(t,"oldVelocity"),canvasDimensions:e.getUniformLocation(t,"canvasDimensions"),deltaTime:e.getUniformLocation(t,"deltaTime")},d={oldPosition:e.getAttribLocation(o,"oldPosition"),oldVelocity:e.getAttribLocation(o,"oldVelocity"),gravityPosition:e.getUniformLocation(o,"gravityPosition"),reset:e.getUniformLocation(o,"reset"),canvasDimensions:e.getUniformLocation(o,"canvasDimensions"),deltaTime:e.getUniformLocation(o,"deltaTime")},r={position:e.getAttribLocation(s,"position"),velocity:e.getAttribLocation(s,"velocity"),matrix:e.getUniformLocation(s,"matrix")},p=Math.min(Math.floor(e.canvas.width*e.canvas.height*.1),1e6),x=(f,g)=>new Array(f).fill(0).map(()=>g.map(w=>me(...w))).flat(),P=new Float32Array(x(p,[[-n.width,n.width],[-n.height,n.height]])),l=50,u=new Float32Array(x(p,[[-l,l],[-l,l]])),v=D(e,P,e.DYNAMIC_DRAW),y=D(e,P,e.DYNAMIC_DRAW),h=D(e,u,e.DYNAMIC_DRAW),A=D(e,u,e.DYNAMIC_DRAW);if(!v||!y||!h||!A){E("Something wrong with buffers");return}const c=V(e,[[v,m.oldPosition],[h,m.oldVelocity]]),M=V(e,[[y,m.oldPosition],[h,m.oldVelocity]]),B=V(e,[[v,d.oldPosition],[h,d.oldVelocity]]),j=V(e,[[v,d.oldPosition],[A,d.oldVelocity]]),Z=V(e,[[v,r.position],[h,r.velocity]]),J=V(e,[[y,r.position],[A,r.velocity]]);function _(f,g){const w=f.createTransformFeedback();return f.bindTransformFeedback(f.TRANSFORM_FEEDBACK,w),f.bindBufferBase(f.TRANSFORM_FEEDBACK_BUFFER,0,g),w}const Q=_(e,v),ee=_(e,y),ne=_(e,h),te=_(e,A);e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.TRANSFORM_FEEDBACK_BUFFER,null);let b={updatePositionVA:c,updateVelocityVA:B,tfPosition:ee,tfVelocity:te,drawVA:J},Y={updatePositionVA:M,updateVelocityVA:j,tfPosition:Q,tfVelocity:ne,drawVA:Z},K=0;function H(f){if(L.begin(),!e){E("WebGL2 context lost during rendering?");return}F>0&&(F+=1,F>he&&(F=0)),f*=.001;const g=f-K;K=f,e.clear(e.COLOR_BUFFER_BIT),e.useProgram(t),e.bindVertexArray(b.updatePositionVA),e.uniform2f(m.canvasDimensions,e.canvas.width,e.canvas.height),e.uniform1f(m.deltaTime,g),e.enable(e.RASTERIZER_DISCARD),e.bindTransformFeedback(e.TRANSFORM_FEEDBACK,b.tfPosition),e.beginTransformFeedback(e.POINTS),e.drawArrays(e.POINTS,0,p),e.endTransformFeedback(),e.bindTransformFeedback(e.TRANSFORM_FEEDBACK,null);const[w,C]=T,R=100,W=40,q=50,I=Math.max(e.canvas.width/W,q),N=Math.max(e.canvas.height/W,q);let O=w+S()*I,k=C+S()*N;w<R?O=R+S()*I:w>e.canvas.width-R&&(O=e.canvas.width-R+S()*I),C<R?k=R+S()*N:C>e.canvas.height-R&&(k=e.canvas.height-R+S()*N),z||(T=[O,k]),e.useProgram(o),e.bindVertexArray(b.updateVelocityVA),e.uniform2f(d.gravityPosition,...T),e.uniform1i(d.reset,F),e.uniform2f(d.canvasDimensions,e.canvas.width,e.canvas.height),e.uniform1f(d.deltaTime,g),e.bindTransformFeedback(e.TRANSFORM_FEEDBACK,b.tfVelocity),e.beginTransformFeedback(e.POINTS),e.drawArrays(e.POINTS,0,p),e.endTransformFeedback(),e.bindTransformFeedback(e.TRANSFORM_FEEDBACK,null),e.disable(e.RASTERIZER_DISCARD),e.useProgram(s),e.bindVertexArray(b.drawVA),e.viewport(0,0,e.canvas.width,e.canvas.height),e.uniformMatrix4fv(r.matrix,!1,de(0,e.canvas.width,0,e.canvas.height,-1,1)),e.drawArrays(e.POINTS,0,p);{const oe=b;b=Y,Y=oe}L.end(),requestAnimationFrame(H)}requestAnimationFrame(H)}ge();
