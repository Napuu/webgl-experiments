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
}`;function E(n,i,a){const e=n.createBuffer();return n.bindBuffer(n.ARRAY_BUFFER,e),n.bufferData(n.ARRAY_BUFFER,i,a),e}function U(n,i,a,e){const t=n.createProgram(),o=G(n,n.VERTEX_SHADER,i),s=G(n,n.FRAGMENT_SHADER,a);if(!t||!o||!s){console.error("Program creation failed");return}if(n.attachShader(t,o),n.attachShader(t,s),e&&n.transformFeedbackVaryings(t,e,n.SEPARATE_ATTRIBS),n.linkProgram(t),!n.getProgramParameter(t,n.LINK_STATUS))throw new Error(n.getProgramParameter(t,0));return t}function G(n,i,a){const e=n.createShader(i);if(!e){console.error("Creating shader failed",i);return}if(n.shaderSource(e,a),n.compileShader(e),!n.getShaderParameter(e,n.COMPILE_STATUS))throw new Error(n.getShaderInfoLog(e)||"");return e}const de=(n,i,a,e,t,o)=>new Float32Array([2/(i-n),0,0,0,0,2/(e-a),0,0,0,0,2/(t-o),0,(n+i)/(n-i),(a+e)/(a-e),(t+o)/(t-o),1]);function V(n,i){const a=n.createVertexArray();n.bindVertexArray(a);for(const[e,t]of i)n.bindBuffer(n.ARRAY_BUFFER,e),n.enableVertexAttribArray(t),n.vertexAttribPointer(t,2,n.FLOAT,!1,0,0);return a}var fe=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},j={exports:{}};(function(n,i){(function(a,e){n.exports=e()})(fe,function(){var a=function(){function e(d){return s.appendChild(d.dom),d}function t(d){for(var u=0;u<s.children.length;u++)s.children[u].style.display=u===d?"block":"none";o=d}var o=0,s=document.createElement("div");s.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",s.addEventListener("click",function(d){d.preventDefault(),t(++o%s.children.length)},!1);var m=(performance||Date).now(),f=m,r=0,y=e(new a.Panel("FPS","#0ff","#002")),x=e(new a.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var A=e(new a.Panel("MB","#f08","#201"));return t(0),{REVISION:16,dom:s,addPanel:e,showPanel:t,begin:function(){m=(performance||Date).now()},end:function(){r++;var d=(performance||Date).now();if(x.update(d-m,200),d>f+1e3&&(y.update(1e3*r/(d-f),100),f=d,r=0,A)){var u=performance.memory;A.update(u.usedJSHeapSize/1048576,u.jsHeapSizeLimit/1048576)}return d},update:function(){m=this.end()},domElement:s,setMode:t}};return a.Panel=function(e,t,o){var s=1/0,m=0,f=Math.round,r=f(window.devicePixelRatio||1),y=80*r,x=48*r,A=3*r,d=2*r,u=3*r,v=15*r,p=74*r,h=30*r,g=document.createElement("canvas");g.width=y,g.height=x,g.style.cssText="width:80px;height:48px";var l=g.getContext("2d");return l.font="bold "+9*r+"px Helvetica,Arial,sans-serif",l.textBaseline="top",l.fillStyle=o,l.fillRect(0,0,y,x),l.fillStyle=t,l.fillText(e,A,d),l.fillRect(u,v,p,h),l.fillStyle=o,l.globalAlpha=.9,l.fillRect(u,v,p,h),{dom:g,update:function(M,B){s=Math.min(s,M),m=Math.max(m,M),l.fillStyle=o,l.globalAlpha=1,l.fillRect(0,0,y,v),l.fillStyle=t,l.fillText(f(M)+" "+e+" ("+f(s)+"-"+f(m)+")",A,d),l.drawImage(g,u+r,v,p-r,h,u,v,p-r,h),l.fillRect(u+p-r,v,r,h),l.fillStyle=o,l.globalAlpha=.9,l.fillRect(u+p-r,v,r,f((1-M/B)*h))}}},a})})(j);const ue=j.exports;function S(){let n=1-Math.random(),i=Math.random();return Math.sqrt(-2*Math.log(n))*Math.cos(2*Math.PI*i)}const T=n=>{console.warn(n)},$=n=>{console.log(1),n.width=window.innerWidth*1,n.height=window.innerHeight*1,console.log(document.body.clientHeight)},me=(n,i)=>(i===void 0&&(i=n,n=0),Math.random()*(i-n)+n),L=new ue,ve=new URLSearchParams(document.location.search);ve.get("stats")&&(L.showPanel(0),document.body.appendChild(L.dom));let z=!1,D=[0,0],F=0;const he=1;function ye(){const n=document.querySelector("canvas");if(!n){T("Canvas not found");return}window.addEventListener("resize",()=>$(n)),$(n);const i=c=>{c.type==="mousemove"&&!z||(D=[c.layerX,n.height-c.layerY],F=1)},a=(c,P)=>{z=P,i(c)};n.addEventListener("mousedown",c=>a(c,!0)),n.addEventListener("mouseup",c=>a(c,!1)),n.addEventListener("mousemove",i),n.addEventListener("touchstart",c=>a(c,!0)),n.addEventListener("touchmove",i),n.addEventListener("touchend",c=>a(c,!1));const e=n.getContext("webgl2");if(!e){T("WebGL2 context not found");return}const t=U(e,ie,ae,["newPosition"]),o=U(e,re,se,["newVelocity"]),s=U(e,ce,le);if(!t||!s||!o){T("Program compilation failed");return}const m={oldPosition:e.getAttribLocation(t,"oldPosition"),oldVelocity:e.getAttribLocation(t,"oldVelocity"),canvasDimensions:e.getUniformLocation(t,"canvasDimensions"),deltaTime:e.getUniformLocation(t,"deltaTime")},f={oldPosition:e.getAttribLocation(o,"oldPosition"),oldVelocity:e.getAttribLocation(o,"oldVelocity"),gravityPosition:e.getUniformLocation(o,"gravityPosition"),reset:e.getUniformLocation(o,"reset"),canvasDimensions:e.getUniformLocation(o,"canvasDimensions"),deltaTime:e.getUniformLocation(o,"deltaTime")},r={position:e.getAttribLocation(s,"position"),velocity:e.getAttribLocation(s,"velocity"),matrix:e.getUniformLocation(s,"matrix")},y=Math.min(Math.floor(e.canvas.width*e.canvas.height*.1),1e6),x=(c,P)=>new Array(c).fill(0).map(()=>P.map(w=>me(...w))).flat(),A=new Float32Array(x(y,[[-n.width,n.width],[-n.height,n.height]])),d=50,u=new Float32Array(x(y,[[-d,d],[-d,d]])),v=E(e,A,e.DYNAMIC_DRAW),p=E(e,A,e.DYNAMIC_DRAW),h=E(e,u,e.DYNAMIC_DRAW),g=E(e,u,e.DYNAMIC_DRAW);if(!v||!p||!h||!g){T("Something wrong with buffers");return}const l=V(e,[[v,m.oldPosition],[h,m.oldVelocity]]),M=V(e,[[p,m.oldPosition],[h,m.oldVelocity]]),B=V(e,[[v,f.oldPosition],[h,f.oldVelocity]]),X=V(e,[[v,f.oldPosition],[g,f.oldVelocity]]),Z=V(e,[[v,r.position],[h,r.velocity]]),J=V(e,[[p,r.position],[g,r.velocity]]);function _(c,P){const w=c.createTransformFeedback();return c.bindTransformFeedback(c.TRANSFORM_FEEDBACK,w),c.bindBufferBase(c.TRANSFORM_FEEDBACK_BUFFER,0,P),w}const Q=_(e,v),ee=_(e,p),ne=_(e,h),te=_(e,g);e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.TRANSFORM_FEEDBACK_BUFFER,null);let b={updatePositionVA:l,updateVelocityVA:B,tfPosition:ee,tfVelocity:te,drawVA:J},K={updatePositionVA:M,updateVelocityVA:X,tfPosition:Q,tfVelocity:ne,drawVA:Z},Y=0;function H(c){if(L.begin(),!e){T("WebGL2 context lost during rendering?");return}F>0&&(F+=1,F>he&&(F=0)),c*=.001;const P=c-Y;Y=c,e.clear(e.COLOR_BUFFER_BIT),e.useProgram(t),e.bindVertexArray(b.updatePositionVA),e.uniform2f(m.canvasDimensions,e.canvas.width,e.canvas.height),e.uniform1f(m.deltaTime,P),e.enable(e.RASTERIZER_DISCARD),e.bindTransformFeedback(e.TRANSFORM_FEEDBACK,b.tfPosition),e.beginTransformFeedback(e.POINTS),e.drawArrays(e.POINTS,0,y),e.endTransformFeedback(),e.bindTransformFeedback(e.TRANSFORM_FEEDBACK,null);const[w,C]=D,R=100,W=40,q=50,N=Math.max(e.canvas.width/W,q),I=Math.max(e.canvas.height/W,q);let O=w+S()*N,k=C+S()*I;w<R?O=R+S()*N:w>e.canvas.width-R&&(O=e.canvas.width-R+S()*N),C<R?k=R+S()*I:C>e.canvas.height-R&&(k=e.canvas.height-R+S()*I),z||(D=[O,k]),e.useProgram(o),e.bindVertexArray(b.updateVelocityVA),e.uniform2f(f.gravityPosition,...D),e.uniform1i(f.reset,F),e.uniform2f(f.canvasDimensions,e.canvas.width,e.canvas.height),e.uniform1f(f.deltaTime,P),e.bindTransformFeedback(e.TRANSFORM_FEEDBACK,b.tfVelocity),e.beginTransformFeedback(e.POINTS),e.drawArrays(e.POINTS,0,y),e.endTransformFeedback(),e.bindTransformFeedback(e.TRANSFORM_FEEDBACK,null),e.disable(e.RASTERIZER_DISCARD),e.useProgram(s),e.bindVertexArray(b.drawVA),e.viewport(0,0,e.canvas.width,e.canvas.height),e.uniformMatrix4fv(r.matrix,!1,de(0,e.canvas.width,0,e.canvas.height,-1,1)),e.drawArrays(e.POINTS,0,y);{const oe=b;b=K,K=oe}L.end(),requestAnimationFrame(H)}requestAnimationFrame(H)}ye();
