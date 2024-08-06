(function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function s(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(e){if(e.ep)return;e.ep=!0;const o=s(e);fetch(e.href,o)}})();var ae=`#version 300 es
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
  
}`,re=`#version 300 es
precision highp float;
  void main() {
}`,ce=`#version 300 es
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
}`,le=`#version 300 es
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
}`,de=`#version 300 es
precision highp float;
in vec4 color;
out vec4 outColor;
void main() {
  vec2 coord = gl_PointCoord - vec2(1.);
  if (length(coord) > 1.) discard;
  outColor = color;
}`;function _(n,c,s){const t=n.createBuffer();return n.bindBuffer(n.ARRAY_BUFFER,t),n.bufferData(n.ARRAY_BUFFER,c,s),t}function U(n,c,s,t){const e=n.createProgram(),o=q(n,n.VERTEX_SHADER,c),r=q(n,n.FRAGMENT_SHADER,s);if(!e||!o||!r){console.error("Program creation failed");return}if(n.attachShader(e,o),n.attachShader(e,r),t&&n.transformFeedbackVaryings(e,t,n.SEPARATE_ATTRIBS),n.linkProgram(e),!n.getProgramParameter(e,n.LINK_STATUS))throw new Error(n.getProgramParameter(e,0));return e}function q(n,c,s){const t=n.createShader(c);if(!t){console.error("Creating shader failed",c);return}if(n.shaderSource(t,s),n.compileShader(t),!n.getShaderParameter(t,n.COMPILE_STATUS))throw new Error(n.getShaderInfoLog(t)||"");return t}const fe=(n,c,s,t,e,o)=>new Float32Array([2/(c-n),0,0,0,0,2/(t-s),0,0,0,0,2/(e-o),0,(n+c)/(n-c),(s+t)/(s-t),(e+o)/(e-o),1]);function V(n,c){const s=n.createVertexArray();n.bindVertexArray(s);for(const[t,e]of c)n.bindBuffer(n.ARRAY_BUFFER,t),n.enableVertexAttribArray(e),n.vertexAttribPointer(e,2,n.FLOAT,!1,0,0);return s}var ue=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},$={exports:{}};(function(n,c){(function(s,t){n.exports=t()})(ue,function(){var s=function(){function t(d){return r.appendChild(d.dom),d}function e(d){for(var f=0;f<r.children.length;f++)r.children[f].style.display=f===d?"block":"none";o=d}var o=0,r=document.createElement("div");r.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",r.addEventListener("click",function(d){d.preventDefault(),e(++o%r.children.length)},!1);var v=(performance||Date).now(),u=v,a=0,y=t(new s.Panel("FPS","#0ff","#002")),P=t(new s.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var R=t(new s.Panel("MB","#f08","#201"));return e(0),{REVISION:16,dom:r,addPanel:t,showPanel:e,begin:function(){v=(performance||Date).now()},end:function(){a++;var d=(performance||Date).now();if(P.update(d-v,200),d>u+1e3&&(y.update(1e3*a/(d-u),100),u=d,a=0,R)){var f=performance.memory;R.update(f.usedJSHeapSize/1048576,f.jsHeapSizeLimit/1048576)}return d},update:function(){v=this.end()},domElement:r,setMode:e}};return s.Panel=function(t,e,o){var r=1/0,v=0,u=Math.round,a=u(window.devicePixelRatio||1),y=80*a,P=48*a,R=3*a,d=2*a,f=3*a,w=15*a,h=74*a,g=30*a,p=document.createElement("canvas");p.width=y,p.height=P,p.style.cssText="width:80px;height:48px";var l=p.getContext("2d");return l.font="bold "+9*a+"px Helvetica,Arial,sans-serif",l.textBaseline="top",l.fillStyle=o,l.fillRect(0,0,y,P),l.fillStyle=e,l.fillText(t,R,d),l.fillRect(f,w,h,g),l.fillStyle=o,l.globalAlpha=.9,l.fillRect(f,w,h,g),{dom:p,update:function(M,B){r=Math.min(r,M),v=Math.max(v,M),l.fillStyle=o,l.globalAlpha=1,l.fillRect(0,0,y,w),l.fillStyle=e,l.fillText(u(M)+" "+t+" ("+u(r)+"-"+u(v)+")",R,d),l.drawImage(p,f+a,w,h-a,g,f,w,h-a,g),l.fillRect(f+h-a,w,a,g),l.fillStyle=o,l.globalAlpha=.9,l.fillRect(f+h-a,w,a,u((1-M/B)*g))}}},s})})($);const me=$.exports;function S(){let n=1-Math.random(),c=Math.random();return Math.sqrt(-2*Math.log(n))*Math.cos(2*Math.PI*c)}const T=n=>{console.warn(n)},G=n=>{console.log(1),n.width=window.innerWidth*1,n.height=window.innerHeight*1,console.log(document.body.clientHeight)},ve=(n,c)=>(c===void 0&&(c=n,n=0),Math.random()*(c-n)+n),L=new me,he=new URLSearchParams(document.location.search);he.get("stats")&&(L.showPanel(0),document.body.appendChild(L.dom));let X=!1,D=[0,0],F=0;const pe=1;function ye(){const n=document.querySelector("canvas");if(!n){T("Canvas not found");return}window.addEventListener("resize",()=>G(n)),G(n);const c=(i,m)=>{D=[i,n.height-m]},s=i=>{if(i.type==="touchmove"||i.type==="touchstart"){i.preventDefault();const m=i,A=i.type==="touchmove"?m.touches[0]:m.changedTouches[0];c(A.clientX,A.clientY)}else if(i.type==="mousemove"||i.type==="mousedown"){const m=i;c(m.clientX,m.clientY)}F=1},t=(i,m)=>{X=m,s(i)};n.addEventListener("mousedown",i=>t(i,!0)),n.addEventListener("mouseup",i=>t(i,!1)),n.addEventListener("mousemove",s),n.addEventListener("touchstart",i=>t(i,!0)),n.addEventListener("touchmove",s),n.addEventListener("touchend",i=>t(i,!1));const e=n.getContext("webgl2");if(!e){T("WebGL2 context not found");return}const o=U(e,ae,re,["newPosition"]),r=U(e,ce,se,["newVelocity"]),v=U(e,le,de);if(!o||!v||!r){T("Program compilation failed");return}const u={oldPosition:e.getAttribLocation(o,"oldPosition"),oldVelocity:e.getAttribLocation(o,"oldVelocity"),canvasDimensions:e.getUniformLocation(o,"canvasDimensions"),deltaTime:e.getUniformLocation(o,"deltaTime")},a={oldPosition:e.getAttribLocation(r,"oldPosition"),oldVelocity:e.getAttribLocation(r,"oldVelocity"),gravityPosition:e.getUniformLocation(r,"gravityPosition"),reset:e.getUniformLocation(r,"reset"),canvasDimensions:e.getUniformLocation(r,"canvasDimensions"),deltaTime:e.getUniformLocation(r,"deltaTime")},y={position:e.getAttribLocation(v,"position"),velocity:e.getAttribLocation(v,"velocity"),matrix:e.getUniformLocation(v,"matrix")},P=Math.min(Math.floor(e.canvas.width*e.canvas.height*.1),1e6),R=(i,m)=>new Array(i).fill(0).map(()=>m.map(A=>ve(...A))).flat(),d=new Float32Array(R(P,[[-n.width,n.width],[-n.height,n.height]])),f=50,w=new Float32Array(R(P,[[-f,f],[-f,f]])),h=_(e,d,e.DYNAMIC_DRAW),g=_(e,d,e.DYNAMIC_DRAW),p=_(e,w,e.DYNAMIC_DRAW),l=_(e,w,e.DYNAMIC_DRAW);if(!h||!g||!p||!l){T("Something wrong with buffers");return}const M=V(e,[[h,u.oldPosition],[p,u.oldVelocity]]),B=V(e,[[g,u.oldPosition],[p,u.oldVelocity]]),j=V(e,[[h,a.oldPosition],[p,a.oldVelocity]]),Z=V(e,[[h,a.oldPosition],[l,a.oldVelocity]]),J=V(e,[[h,y.position],[p,y.velocity]]),Q=V(e,[[g,y.position],[l,y.velocity]]);function E(i,m){const A=i.createTransformFeedback();return i.bindTransformFeedback(i.TRANSFORM_FEEDBACK,A),i.bindBufferBase(i.TRANSFORM_FEEDBACK_BUFFER,0,m),A}const ee=E(e,h),ne=E(e,g),te=E(e,p),oe=E(e,l);e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.TRANSFORM_FEEDBACK_BUFFER,null);let b={updatePositionVA:M,updateVelocityVA:j,tfPosition:ne,tfVelocity:oe,drawVA:Q},z={updatePositionVA:B,updateVelocityVA:Z,tfPosition:ee,tfVelocity:te,drawVA:J},Y=0;function K(i){if(L.begin(),!e){T("WebGL2 context lost during rendering?");return}F>0&&(F+=1,F>pe&&(F=0)),i*=.001;const m=i-Y;Y=i,e.clear(e.COLOR_BUFFER_BIT),e.useProgram(o),e.bindVertexArray(b.updatePositionVA),e.uniform2f(u.canvasDimensions,e.canvas.width,e.canvas.height),e.uniform1f(u.deltaTime,m),e.enable(e.RASTERIZER_DISCARD),e.bindTransformFeedback(e.TRANSFORM_FEEDBACK,b.tfPosition),e.beginTransformFeedback(e.POINTS),e.drawArrays(e.POINTS,0,P),e.endTransformFeedback(),e.bindTransformFeedback(e.TRANSFORM_FEEDBACK,null);const[A,C]=D,x=100,H=40,W=50,N=Math.max(e.canvas.width/H,W),I=Math.max(e.canvas.height/H,W);let O=A+S()*N,k=C+S()*I;A<x?O=x+S()*N:A>e.canvas.width-x&&(O=e.canvas.width-x+S()*N),C<x?k=x+S()*I:C>e.canvas.height-x&&(k=e.canvas.height-x+S()*I),X||(D=[O,k]),e.useProgram(r),e.bindVertexArray(b.updateVelocityVA),e.uniform2f(a.gravityPosition,...D),e.uniform1i(a.reset,F),e.uniform2f(a.canvasDimensions,e.canvas.width,e.canvas.height),e.uniform1f(a.deltaTime,m),e.bindTransformFeedback(e.TRANSFORM_FEEDBACK,b.tfVelocity),e.beginTransformFeedback(e.POINTS),e.drawArrays(e.POINTS,0,P),e.endTransformFeedback(),e.bindTransformFeedback(e.TRANSFORM_FEEDBACK,null),e.disable(e.RASTERIZER_DISCARD),e.useProgram(v),e.bindVertexArray(b.drawVA),e.viewport(0,0,e.canvas.width,e.canvas.height),e.uniformMatrix4fv(y.matrix,!1,fe(0,e.canvas.width,0,e.canvas.height,-1,1)),e.drawArrays(e.POINTS,0,P);{const ie=b;b=z,z=ie}L.end(),requestAnimationFrame(K)}requestAnimationFrame(K)}ye();
