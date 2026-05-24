import{Renderer as D,Program as W,Triangle as q,Mesh as P}from"https://cdn.jsdelivr.net/npm/ogl@1.0.11/src/index.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function o(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(t){if(t.ep)return;t.ep=!0;const i=o(t);fetch(t.href,i)}})();const y=8,A=u=>{const e=u.replace("#","").padEnd(6,"0"),o=parseInt(e.slice(0,2),16)/255,r=parseInt(e.slice(2,4),16)/255,t=parseInt(e.slice(4,6),16)/255;return[o,r,t]},L=u=>{const e=(u&&u.length?u:["#FF9FFC","#5227FF"]).slice(0,y);for(e.length===1&&e.push(e[0]);e.length<y;)e.push(e[e.length-1]);const o=[];for(let t=0;t<y;t++)o.push(A(e[t]));const r=Math.max(2,Math.min(y,(u==null?void 0:u.length)??2));return{arr:o,count:r}};class E{constructor(e,o={}){this.container=e;const{dpr:r=window.devicePixelRatio||1,paused:t=!1,gradientColors:i=["#FF9FFC","#5227FF"],angle:n=0,noise:f=.3,blindCount:m=16,blindMinWidth:M=60,mouseDampening:x=.15,mirrorGradient:p=!1,spotlightRadius:g=.5,spotlightSoftness:w=1,spotlightOpacity:S=1,distortAmount:R=0,shineDirection:F="right",mixBlendMode:b="lighten"}=o;this.mouseDampening=x,this.paused=t,this.blindMinWidth=M,this.blindCount=m,b&&(this.container.style.mixBlendMode=b),this.container.style.position="relative",this.container.style.overflow="hidden",this.renderer=new D({dpr:r,alpha:!0,antialias:!0});const l=this.renderer.gl;this.canvas=l.canvas,this.canvas.style.width="100%",this.canvas.style.height="100%",this.canvas.style.display="block",this.container.appendChild(this.canvas);const B=`
        attribute vec2 position;
        attribute vec2 uv;
        varying vec2 vUv;

        void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
        }
        `,T=`
        #ifdef GL_ES
        precision mediump float;
        #endif

        uniform vec3  iResolution;
        uniform vec2  iMouse;
        uniform float iTime;

        uniform float uAngle;
        uniform float uNoise;
        uniform float uBlindCount;
        uniform float uSpotlightRadius;
        uniform float uSpotlightSoftness;
        uniform float uSpotlightOpacity;
        uniform float uMirror;
        uniform float uDistort;
        uniform float uShineFlip;
        uniform vec3  uColor0;
        uniform vec3  uColor1;
        uniform vec3  uColor2;
        uniform vec3  uColor3;
        uniform vec3  uColor4;
        uniform vec3  uColor5;
        uniform vec3  uColor6;
        uniform vec3  uColor7;
        uniform int   uColorCount;

        varying vec2 vUv;

        float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
        }

        vec2 rotate2D(vec2 p, float a){
        float c = cos(a);
        float s = sin(a);
        return mat2(c, -s, s, c) * p;
        }

        vec3 getGradientColor(float t){
        float tt = clamp(t, 0.0, 1.0);
        int count = uColorCount;
        if (count < 2) count = 2;
        float scaled = tt * float(count - 1);
        float seg = floor(scaled);
        float f = fract(scaled);

        if (seg < 1.0) return mix(uColor0, uColor1, f);
        if (seg < 2.0 && count > 2) return mix(uColor1, uColor2, f);
        if (seg < 3.0 && count > 3) return mix(uColor2, uColor3, f);
        if (seg < 4.0 && count > 4) return mix(uColor3, uColor4, f);
        if (seg < 5.0 && count > 5) return mix(uColor4, uColor5, f);
        if (seg < 6.0 && count > 6) return mix(uColor5, uColor6, f);
        if (seg < 7.0 && count > 7) return mix(uColor6, uColor7, f);
        if (count > 7) return uColor7;
        if (count > 6) return uColor6;
        if (count > 5) return uColor5;
        if (count > 4) return uColor4;
        if (count > 3) return uColor3;
        if (count > 2) return uColor2;
        return uColor1;
        }

        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
            vec2 uv0 = fragCoord.xy / iResolution.xy;

            float aspect = iResolution.x / iResolution.y;
            vec2 p = uv0 * 2.0 - 1.0;
            p.x *= aspect;
            vec2 pr = rotate2D(p, uAngle);
            pr.x /= aspect;
            vec2 uv = pr * 0.5 + 0.5;

            vec2 uvMod = uv;
            if (uDistort > 0.0) {
            float a = uvMod.y * 6.0;
            float b = uvMod.x * 6.0;
            float w = 0.01 * uDistort;
            uvMod.x += sin(a) * w;
            uvMod.y += cos(b) * w;
            }
            float t = uvMod.x;
            if (uMirror > 0.5) {
            t = 1.0 - abs(1.0 - 2.0 * fract(t));
            }
            vec3 base = getGradientColor(t);

            vec2 offset = vec2(iMouse.x/iResolution.x, iMouse.y/iResolution.y);
            float d = length(uv0 - offset);
            float r = max(uSpotlightRadius, 1e-4);
            float dn = d / r;
            float spot = (1.0 - 2.0 * pow(dn, uSpotlightSoftness)) * uSpotlightOpacity;
            vec3 cir = vec3(spot);
            float stripe = fract(uvMod.x * max(uBlindCount, 1.0));
            if (uShineFlip > 0.5) stripe = 1.0 - stripe;
            vec3 ran = vec3(stripe);

            vec3 col = cir + base - ran;
            col += (rand(gl_FragCoord.xy + iTime) - 0.5) * uNoise;

            fragColor = vec4(col, 1.0);
        }

        void main() {
            vec4 color;
            mainImage(color, vUv * iResolution.xy);
            gl_FragColor = color;
        }
        `,{arr:h,count:O}=L(i);this.uniforms={iResolution:{value:[l.drawingBufferWidth,l.drawingBufferHeight,1]},iMouse:{value:[0,0]},iTime:{value:0},uAngle:{value:n*Math.PI/180},uNoise:{value:f},uBlindCount:{value:Math.max(1,m)},uSpotlightRadius:{value:g},uSpotlightSoftness:{value:w},uSpotlightOpacity:{value:S},uMirror:{value:p?1:0},uDistort:{value:R},uShineFlip:{value:F==="right"?1:0},uColor0:{value:h[0]},uColor1:{value:h[1]},uColor2:{value:h[2]},uColor3:{value:h[3]},uColor4:{value:h[4]},uColor5:{value:h[5]},uColor6:{value:h[6]},uColor7:{value:h[7]},uColorCount:{value:O}},this.program=new W(l,{vertex:B,fragment:T,uniforms:this.uniforms}),this.geometry=new q(l),this.mesh=new P(l,{geometry:this.geometry,program:this.program}),this.firstResize=!0,this.mouseTarget=[0,0],this.lastTime=0,this.resize=()=>{const a=this.container.getBoundingClientRect();if(this.renderer.setSize(a.width,a.height),this.uniforms.iResolution.value=[l.drawingBufferWidth,l.drawingBufferHeight,1],this.blindMinWidth&&this.blindMinWidth>0){const s=Math.max(1,Math.floor(a.width/this.blindMinWidth)),c=this.blindCount?Math.min(this.blindCount,s):s;this.uniforms.uBlindCount.value=Math.max(1,c)}else this.uniforms.uBlindCount.value=Math.max(1,this.blindCount);if(this.firstResize){this.firstResize=!1;const s=l.drawingBufferWidth/2,c=l.drawingBufferHeight/2;this.uniforms.iMouse.value=[s,c],this.mouseTarget=[s,c]}},this.resize(),this.ro=new ResizeObserver(this.resize),this.ro.observe(this.container),this.onPointerMove=a=>{const s=this.canvas.getBoundingClientRect(),c=this.renderer.dpr||1,d=(a.clientX-s.left)*c,v=(s.height-(a.clientY-s.top))*c;this.mouseTarget=[d,v],this.mouseDampening<=0&&(this.uniforms.iMouse.value=[d,v])},this.canvas.addEventListener("pointermove",this.onPointerMove),this.loop=a=>{if(this.raf=requestAnimationFrame(this.loop),this.uniforms.iTime.value=a*.001,this.mouseDampening>0){this.lastTime||(this.lastTime=a);const s=(a-this.lastTime)/1e3;this.lastTime=a;const c=Math.max(1e-4,this.mouseDampening);let d=1-Math.exp(-s/c);d>1&&(d=1);const v=this.mouseTarget,C=this.uniforms.iMouse.value;C[0]+=(v[0]-C[0])*d,C[1]+=(v[1]-C[1])*d}else this.lastTime=a;if(!this.paused&&this.program&&this.mesh)try{this.renderer.render({scene:this.mesh})}catch(s){console.error(s)}},this.raf=requestAnimationFrame(this.loop)}destroy(){this.raf&&cancelAnimationFrame(this.raf),this.canvas.removeEventListener("pointermove",this.onPointerMove),this.ro.disconnect(),this.canvas.parentElement===this.container&&this.container.removeChild(this.canvas);const e=(o,r)=>{o&&typeof o[r]=="function"&&o[r].call(o)};e(this.program,"remove"),e(this.geometry,"remove"),e(this.mesh,"remove"),e(this.renderer,"destroy")}}document.addEventListener("DOMContentLoaded",()=>{const u=document.getElementById("gradient-blinds-wrapper"),e=document.querySelector(".marquee-wrap"),o=document.querySelector(".marquee-track");if(new E(u,{gradientColors:["#141414","#141414"],angle:0,noise:0,blindCount:44,blindMinWidth:10,mouseDampening:.3,mirrorGradient:!1,spotlightRadius:.5,spotlightSoftness:1.5,spotlightOpacity:.4,distortAmount:0,shineDirection:"none"}),e&&o){const r=Array.from(o.children).map(n=>n.cloneNode(!0)),t=()=>{const n=document.createElement("div");return n.className="marquee-segment",r.forEach(f=>{n.appendChild(f.cloneNode(!0))}),n},i=()=>{if(r.length===0)return;o.innerHTML="";const n=t();o.appendChild(n);const f=n.scrollWidth,m=e.clientWidth;if(!f||!m)return;const M=Math.max(2,Math.ceil(m*2/f)+1);for(let p=1;p<M;p+=1){const g=t();g.setAttribute("aria-hidden","true"),o.appendChild(g)}const x=90;o.style.setProperty("--marquee-distance",`${f}px`),o.style.setProperty("--marquee-duration",`${f/x}s`)};i(),new ResizeObserver(i).observe(e)}});
