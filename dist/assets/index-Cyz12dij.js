(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const xa="175",Di={ROTATE:0,DOLLY:1,PAN:2},Ci={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},od=0,ja=1,sd=2,Oc=1,Fc=2,mn=3,zn=0,Rt=1,Jt=2,yn=0,Li=1,_s=2,Za=3,$a=4,ad=5,ei=100,ld=101,cd=102,ud=103,dd=104,hd=200,fd=201,pd=202,_d=203,ms=204,gs=205,md=206,gd=207,vd=208,xd=209,Sd=210,yd=211,bd=212,Ed=213,Md=214,vs=0,xs=1,Ss=2,Oi=3,ys=4,bs=5,Es=6,Ms=7,kc=0,Td=1,wd=2,kn=0,Ad=1,Bc=2,Cd=3,Rd=4,Pd=5,Dd=6,Ld=7,zc=300,Fi=301,ki=302,Ts=303,ws=304,po=306,As=1e3,ni=1001,Cs=1002,tn=1003,Id=1004,vr=1005,ln=1006,To=1007,ii=1008,Mn=1009,Gc=1010,Hc=1011,sr=1012,Sa=1013,oi=1014,xn=1015,bn=1016,ya=1017,ba=1018,ar=1020,Vc=35902,Wc=1021,Xc=1022,en=1023,qc=1024,Yc=1025,lr=1026,cr=1027,Kc=1028,Ea=1029,jc=1030,Ma=1031,Ta=1033,Kr=33776,jr=33777,Zr=33778,$r=33779,Rs=35840,Ps=35841,Ds=35842,Ls=35843,Is=36196,Ns=37492,Us=37496,Os=37808,Fs=37809,ks=37810,Bs=37811,zs=37812,Gs=37813,Hs=37814,Vs=37815,Ws=37816,Xs=37817,qs=37818,Ys=37819,Ks=37820,js=37821,Jr=36492,Zs=36494,$s=36495,Zc=36283,Js=36284,Qs=36285,ea=36286,Nd=3200,Ud=3201,Od=0,Fd=1,Nn="",qt="srgb",Bi="srgb-linear",ro="linear",$e="srgb",di=7680,Ja=519,kd=512,Bd=513,zd=514,$c=515,Gd=516,Hd=517,Vd=518,Wd=519,Qa=35044,ta="300 es",Sn=2e3,oo=2001;class li{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const o=r.indexOf(t);o!==-1&&r.splice(o,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let o=0,s=r.length;o<s;o++)r[o].call(this,e);e.target=null}}}const Tt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Qr=Math.PI/180,na=180/Math.PI;function hr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Tt[n&255]+Tt[n>>8&255]+Tt[n>>16&255]+Tt[n>>24&255]+"-"+Tt[e&255]+Tt[e>>8&255]+"-"+Tt[e>>16&15|64]+Tt[e>>24&255]+"-"+Tt[t&63|128]+Tt[t>>8&255]+"-"+Tt[t>>16&255]+Tt[t>>24&255]+Tt[i&255]+Tt[i>>8&255]+Tt[i>>16&255]+Tt[i>>24&255]).toLowerCase()}function Fe(n,e,t){return Math.max(e,Math.min(t,n))}function Xd(n,e){return(n%e+e)%e}function wo(n,e,t){return(1-t)*n+t*e}function qi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Lt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const qd={DEG2RAD:Qr};class xe{constructor(e=0,t=0){xe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Fe(this.x,e.x,t.x),this.y=Fe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Fe(this.x,e,t),this.y=Fe(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Fe(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Fe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),o=this.x-e.x,s=this.y-e.y;return this.x=o*i-s*r+e.x,this.y=o*r+s*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ne{constructor(e,t,i,r,o,s,a,l,c){Ne.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,o,s,a,l,c)}set(e,t,i,r,o,s,a,l,c){const d=this.elements;return d[0]=e,d[1]=r,d[2]=a,d[3]=t,d[4]=o,d[5]=l,d[6]=i,d[7]=s,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,o=this.elements,s=i[0],a=i[3],l=i[6],c=i[1],d=i[4],u=i[7],f=i[2],_=i[5],v=i[8],x=r[0],m=r[3],h=r[6],A=r[1],g=r[4],E=r[7],I=r[2],R=r[5],P=r[8];return o[0]=s*x+a*A+l*I,o[3]=s*m+a*g+l*R,o[6]=s*h+a*E+l*P,o[1]=c*x+d*A+u*I,o[4]=c*m+d*g+u*R,o[7]=c*h+d*E+u*P,o[2]=f*x+_*A+v*I,o[5]=f*m+_*g+v*R,o[8]=f*h+_*E+v*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],o=e[3],s=e[4],a=e[5],l=e[6],c=e[7],d=e[8];return t*s*d-t*a*c-i*o*d+i*a*l+r*o*c-r*s*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],o=e[3],s=e[4],a=e[5],l=e[6],c=e[7],d=e[8],u=d*s-a*c,f=a*l-d*o,_=c*o-s*l,v=t*u+i*f+r*_;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/v;return e[0]=u*x,e[1]=(r*c-d*i)*x,e[2]=(a*i-r*s)*x,e[3]=f*x,e[4]=(d*t-r*l)*x,e[5]=(r*o-a*t)*x,e[6]=_*x,e[7]=(i*l-c*t)*x,e[8]=(s*t-i*o)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,o,s,a){const l=Math.cos(o),c=Math.sin(o);return this.set(i*l,i*c,-i*(l*s+c*a)+s+e,-r*c,r*l,-r*(-c*s+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ao.makeScale(e,t)),this}rotate(e){return this.premultiply(Ao.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ao.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ao=new Ne;function Jc(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function so(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Yd(){const n=so("canvas");return n.style.display="block",n}const el={};function eo(n){n in el||(el[n]=!0,console.warn(n))}function Kd(n,e,t){return new Promise(function(i,r){function o(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(o,t);break;default:i()}}setTimeout(o,t)})}function jd(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Zd(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const tl=new Ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),nl=new Ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function $d(){const n={enabled:!0,workingColorSpace:Bi,spaces:{},convert:function(r,o,s){return this.enabled===!1||o===s||!o||!s||(this.spaces[o].transfer===$e&&(r.r=En(r.r),r.g=En(r.g),r.b=En(r.b)),this.spaces[o].primaries!==this.spaces[s].primaries&&(r.applyMatrix3(this.spaces[o].toXYZ),r.applyMatrix3(this.spaces[s].fromXYZ)),this.spaces[s].transfer===$e&&(r.r=Ii(r.r),r.g=Ii(r.g),r.b=Ii(r.b))),r},fromWorkingColorSpace:function(r,o){return this.convert(r,this.workingColorSpace,o)},toWorkingColorSpace:function(r,o){return this.convert(r,o,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Nn?ro:this.spaces[r].transfer},getLuminanceCoefficients:function(r,o=this.workingColorSpace){return r.fromArray(this.spaces[o].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,o,s){return r.copy(this.spaces[o].toXYZ).multiply(this.spaces[s].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Bi]:{primaries:e,whitePoint:i,transfer:ro,toXYZ:tl,fromXYZ:nl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:qt},outputColorSpaceConfig:{drawingBufferColorSpace:qt}},[qt]:{primaries:e,whitePoint:i,transfer:$e,toXYZ:tl,fromXYZ:nl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:qt}}}),n}const qe=$d();function En(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ii(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let hi;class Jd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{hi===void 0&&(hi=so("canvas")),hi.width=e.width,hi.height=e.height;const r=hi.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=hi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=so("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),o=r.data;for(let s=0;s<o.length;s++)o[s]=En(o[s]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(En(t[i]/255)*255):t[i]=En(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Qd=0;class wa{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Qd++}),this.uuid=hr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let o;if(Array.isArray(r)){o=[];for(let s=0,a=r.length;s<a;s++)r[s].isDataTexture?o.push(Co(r[s].image)):o.push(Co(r[s]))}else o=Co(r);i.url=o}return t||(e.images[this.uuid]=i),i}}function Co(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Jd.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let eh=0;class Ut extends li{constructor(e=Ut.DEFAULT_IMAGE,t=Ut.DEFAULT_MAPPING,i=ni,r=ni,o=ln,s=ii,a=en,l=Mn,c=Ut.DEFAULT_ANISOTROPY,d=Nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:eh++}),this.uuid=hr(),this.name="",this.source=new wa(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=o,this.minFilter=s,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new xe(0,0),this.repeat=new xe(1,1),this.center=new xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==zc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case As:e.x=e.x-Math.floor(e.x);break;case ni:e.x=e.x<0?0:1;break;case Cs:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case As:e.y=e.y-Math.floor(e.y);break;case ni:e.y=e.y<0?0:1;break;case Cs:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ut.DEFAULT_IMAGE=null;Ut.DEFAULT_MAPPING=zc;Ut.DEFAULT_ANISOTROPY=1;class Qe{constructor(e=0,t=0,i=0,r=1){Qe.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,o=this.w,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r+s[12]*o,this.y=s[1]*t+s[5]*i+s[9]*r+s[13]*o,this.z=s[2]*t+s[6]*i+s[10]*r+s[14]*o,this.w=s[3]*t+s[7]*i+s[11]*r+s[15]*o,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,o;const l=e.elements,c=l[0],d=l[4],u=l[8],f=l[1],_=l[5],v=l[9],x=l[2],m=l[6],h=l[10];if(Math.abs(d-f)<.01&&Math.abs(u-x)<.01&&Math.abs(v-m)<.01){if(Math.abs(d+f)<.1&&Math.abs(u+x)<.1&&Math.abs(v+m)<.1&&Math.abs(c+_+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const g=(c+1)/2,E=(_+1)/2,I=(h+1)/2,R=(d+f)/4,P=(u+x)/4,p=(v+m)/4;return g>E&&g>I?g<.01?(i=0,r=.707106781,o=.707106781):(i=Math.sqrt(g),r=R/i,o=P/i):E>I?E<.01?(i=.707106781,r=0,o=.707106781):(r=Math.sqrt(E),i=R/r,o=p/r):I<.01?(i=.707106781,r=.707106781,o=0):(o=Math.sqrt(I),i=P/o,r=p/o),this.set(i,r,o,t),this}let A=Math.sqrt((m-v)*(m-v)+(u-x)*(u-x)+(f-d)*(f-d));return Math.abs(A)<.001&&(A=1),this.x=(m-v)/A,this.y=(u-x)/A,this.z=(f-d)/A,this.w=Math.acos((c+_+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Fe(this.x,e.x,t.x),this.y=Fe(this.y,e.y,t.y),this.z=Fe(this.z,e.z,t.z),this.w=Fe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Fe(this.x,e,t),this.y=Fe(this.y,e,t),this.z=Fe(this.z,e,t),this.w=Fe(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Fe(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class th extends li{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Qe(0,0,e,t),this.scissorTest=!1,this.viewport=new Qe(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ln,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const o=new Ut(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);o.flipY=!1,o.generateMipmaps=i.generateMipmaps,o.internalFormat=i.internalFormat,this.textures=[];const s=i.count;for(let a=0;a<s;a++)this.textures[a]=o.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,o=this.textures.length;r<o;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new wa(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zt extends th{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Qc extends Ut{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=tn,this.minFilter=tn,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class nh extends Ut{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=tn,this.minFilter=tn,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class si{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,o,s,a){let l=i[r+0],c=i[r+1],d=i[r+2],u=i[r+3];const f=o[s+0],_=o[s+1],v=o[s+2],x=o[s+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=_,e[t+2]=v,e[t+3]=x;return}if(u!==x||l!==f||c!==_||d!==v){let m=1-a;const h=l*f+c*_+d*v+u*x,A=h>=0?1:-1,g=1-h*h;if(g>Number.EPSILON){const I=Math.sqrt(g),R=Math.atan2(I,h*A);m=Math.sin(m*R)/I,a=Math.sin(a*R)/I}const E=a*A;if(l=l*m+f*E,c=c*m+_*E,d=d*m+v*E,u=u*m+x*E,m===1-a){const I=1/Math.sqrt(l*l+c*c+d*d+u*u);l*=I,c*=I,d*=I,u*=I}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,r,o,s){const a=i[r],l=i[r+1],c=i[r+2],d=i[r+3],u=o[s],f=o[s+1],_=o[s+2],v=o[s+3];return e[t]=a*v+d*u+l*_-c*f,e[t+1]=l*v+d*f+c*u-a*_,e[t+2]=c*v+d*_+a*f-l*u,e[t+3]=d*v-a*u-l*f-c*_,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,o=e._z,s=e._order,a=Math.cos,l=Math.sin,c=a(i/2),d=a(r/2),u=a(o/2),f=l(i/2),_=l(r/2),v=l(o/2);switch(s){case"XYZ":this._x=f*d*u+c*_*v,this._y=c*_*u-f*d*v,this._z=c*d*v+f*_*u,this._w=c*d*u-f*_*v;break;case"YXZ":this._x=f*d*u+c*_*v,this._y=c*_*u-f*d*v,this._z=c*d*v-f*_*u,this._w=c*d*u+f*_*v;break;case"ZXY":this._x=f*d*u-c*_*v,this._y=c*_*u+f*d*v,this._z=c*d*v+f*_*u,this._w=c*d*u-f*_*v;break;case"ZYX":this._x=f*d*u-c*_*v,this._y=c*_*u+f*d*v,this._z=c*d*v-f*_*u,this._w=c*d*u+f*_*v;break;case"YZX":this._x=f*d*u+c*_*v,this._y=c*_*u+f*d*v,this._z=c*d*v-f*_*u,this._w=c*d*u-f*_*v;break;case"XZY":this._x=f*d*u-c*_*v,this._y=c*_*u-f*d*v,this._z=c*d*v+f*_*u,this._w=c*d*u+f*_*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],o=t[8],s=t[1],a=t[5],l=t[9],c=t[2],d=t[6],u=t[10],f=i+a+u;if(f>0){const _=.5/Math.sqrt(f+1);this._w=.25/_,this._x=(d-l)*_,this._y=(o-c)*_,this._z=(s-r)*_}else if(i>a&&i>u){const _=2*Math.sqrt(1+i-a-u);this._w=(d-l)/_,this._x=.25*_,this._y=(r+s)/_,this._z=(o+c)/_}else if(a>u){const _=2*Math.sqrt(1+a-i-u);this._w=(o-c)/_,this._x=(r+s)/_,this._y=.25*_,this._z=(l+d)/_}else{const _=2*Math.sqrt(1+u-i-a);this._w=(s-r)/_,this._x=(o+c)/_,this._y=(l+d)/_,this._z=.25*_}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Fe(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,o=e._z,s=e._w,a=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+s*a+r*c-o*l,this._y=r*d+s*l+o*a-i*c,this._z=o*d+s*c+i*l-r*a,this._w=s*d-i*a-r*l-o*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,o=this._z,s=this._w;let a=s*e._w+i*e._x+r*e._y+o*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=s,this._x=i,this._y=r,this._z=o,this;const l=1-a*a;if(l<=Number.EPSILON){const _=1-t;return this._w=_*s+t*this._w,this._x=_*i+t*this._x,this._y=_*r+t*this._y,this._z=_*o+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,a),u=Math.sin((1-t)*d)/c,f=Math.sin(t*d)/c;return this._w=s*u+this._w*f,this._x=i*u+this._x*f,this._y=r*u+this._y*f,this._z=o*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),o=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),o*Math.sin(t),o*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(il.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(il.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,o=e.elements;return this.x=o[0]*t+o[3]*i+o[6]*r,this.y=o[1]*t+o[4]*i+o[7]*r,this.z=o[2]*t+o[5]*i+o[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,o=e.elements,s=1/(o[3]*t+o[7]*i+o[11]*r+o[15]);return this.x=(o[0]*t+o[4]*i+o[8]*r+o[12])*s,this.y=(o[1]*t+o[5]*i+o[9]*r+o[13])*s,this.z=(o[2]*t+o[6]*i+o[10]*r+o[14])*s,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,o=e.x,s=e.y,a=e.z,l=e.w,c=2*(s*r-a*i),d=2*(a*t-o*r),u=2*(o*i-s*t);return this.x=t+l*c+s*u-a*d,this.y=i+l*d+a*c-o*u,this.z=r+l*u+o*d-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r,this.y=o[1]*t+o[5]*i+o[9]*r,this.z=o[2]*t+o[6]*i+o[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Fe(this.x,e.x,t.x),this.y=Fe(this.y,e.y,t.y),this.z=Fe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Fe(this.x,e,t),this.y=Fe(this.y,e,t),this.z=Fe(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Fe(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,o=e.z,s=t.x,a=t.y,l=t.z;return this.x=r*l-o*a,this.y=o*s-i*l,this.z=i*a-r*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ro.copy(this).projectOnVector(e),this.sub(Ro)}reflect(e){return this.sub(Ro.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Fe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ro=new D,il=new si;class fr{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(jt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(jt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=jt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const o=i.getAttribute("position");if(t===!0&&o!==void 0&&e.isInstancedMesh!==!0)for(let s=0,a=o.count;s<a;s++)e.isMesh===!0?e.getVertexPosition(s,jt):jt.fromBufferAttribute(o,s),jt.applyMatrix4(e.matrixWorld),this.expandByPoint(jt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),xr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),xr.copy(i.boundingBox)),xr.applyMatrix4(e.matrixWorld),this.union(xr)}const r=e.children;for(let o=0,s=r.length;o<s;o++)this.expandByObject(r[o],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,jt),jt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Yi),Sr.subVectors(this.max,Yi),fi.subVectors(e.a,Yi),pi.subVectors(e.b,Yi),_i.subVectors(e.c,Yi),An.subVectors(pi,fi),Cn.subVectors(_i,pi),qn.subVectors(fi,_i);let t=[0,-An.z,An.y,0,-Cn.z,Cn.y,0,-qn.z,qn.y,An.z,0,-An.x,Cn.z,0,-Cn.x,qn.z,0,-qn.x,-An.y,An.x,0,-Cn.y,Cn.x,0,-qn.y,qn.x,0];return!Po(t,fi,pi,_i,Sr)||(t=[1,0,0,0,1,0,0,0,1],!Po(t,fi,pi,_i,Sr))?!1:(yr.crossVectors(An,Cn),t=[yr.x,yr.y,yr.z],Po(t,fi,pi,_i,Sr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,jt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(jt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(dn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const dn=[new D,new D,new D,new D,new D,new D,new D,new D],jt=new D,xr=new fr,fi=new D,pi=new D,_i=new D,An=new D,Cn=new D,qn=new D,Yi=new D,Sr=new D,yr=new D,Yn=new D;function Po(n,e,t,i,r){for(let o=0,s=n.length-3;o<=s;o+=3){Yn.fromArray(n,o);const a=r.x*Math.abs(Yn.x)+r.y*Math.abs(Yn.y)+r.z*Math.abs(Yn.z),l=e.dot(Yn),c=t.dot(Yn),d=i.dot(Yn);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>a)return!1}return!0}const ih=new fr,Ki=new D,Do=new D;class _o{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):ih.setFromPoints(e).getCenter(i);let r=0;for(let o=0,s=e.length;o<s;o++)r=Math.max(r,i.distanceToSquared(e[o]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ki.subVectors(e,this.center);const t=Ki.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Ki,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Do.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ki.copy(e.center).add(Do)),this.expandByPoint(Ki.copy(e.center).sub(Do))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const hn=new D,Lo=new D,br=new D,Rn=new D,Io=new D,Er=new D,No=new D;class mo{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=hn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(hn.copy(this.origin).addScaledVector(this.direction,t),hn.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Lo.copy(e).add(t).multiplyScalar(.5),br.copy(t).sub(e).normalize(),Rn.copy(this.origin).sub(Lo);const o=e.distanceTo(t)*.5,s=-this.direction.dot(br),a=Rn.dot(this.direction),l=-Rn.dot(br),c=Rn.lengthSq(),d=Math.abs(1-s*s);let u,f,_,v;if(d>0)if(u=s*l-a,f=s*a-l,v=o*d,u>=0)if(f>=-v)if(f<=v){const x=1/d;u*=x,f*=x,_=u*(u+s*f+2*a)+f*(s*u+f+2*l)+c}else f=o,u=Math.max(0,-(s*f+a)),_=-u*u+f*(f+2*l)+c;else f=-o,u=Math.max(0,-(s*f+a)),_=-u*u+f*(f+2*l)+c;else f<=-v?(u=Math.max(0,-(-s*o+a)),f=u>0?-o:Math.min(Math.max(-o,-l),o),_=-u*u+f*(f+2*l)+c):f<=v?(u=0,f=Math.min(Math.max(-o,-l),o),_=f*(f+2*l)+c):(u=Math.max(0,-(s*o+a)),f=u>0?o:Math.min(Math.max(-o,-l),o),_=-u*u+f*(f+2*l)+c);else f=s>0?-o:o,u=Math.max(0,-(s*f+a)),_=-u*u+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Lo).addScaledVector(br,f),_}intersectSphere(e,t){hn.subVectors(e.center,this.origin);const i=hn.dot(this.direction),r=hn.dot(hn)-i*i,o=e.radius*e.radius;if(r>o)return null;const s=Math.sqrt(o-r),a=i-s,l=i+s;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,o,s,a,l;const c=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),d>=0?(o=(e.min.y-f.y)*d,s=(e.max.y-f.y)*d):(o=(e.max.y-f.y)*d,s=(e.min.y-f.y)*d),i>s||o>r||((o>i||isNaN(i))&&(i=o),(s<r||isNaN(r))&&(r=s),u>=0?(a=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,hn)!==null}intersectTriangle(e,t,i,r,o){Io.subVectors(t,e),Er.subVectors(i,e),No.crossVectors(Io,Er);let s=this.direction.dot(No),a;if(s>0){if(r)return null;a=1}else if(s<0)a=-1,s=-s;else return null;Rn.subVectors(this.origin,e);const l=a*this.direction.dot(Er.crossVectors(Rn,Er));if(l<0)return null;const c=a*this.direction.dot(Io.cross(Rn));if(c<0||l+c>s)return null;const d=-a*Rn.dot(No);return d<0?null:this.at(d/s,o)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class it{constructor(e,t,i,r,o,s,a,l,c,d,u,f,_,v,x,m){it.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,o,s,a,l,c,d,u,f,_,v,x,m)}set(e,t,i,r,o,s,a,l,c,d,u,f,_,v,x,m){const h=this.elements;return h[0]=e,h[4]=t,h[8]=i,h[12]=r,h[1]=o,h[5]=s,h[9]=a,h[13]=l,h[2]=c,h[6]=d,h[10]=u,h[14]=f,h[3]=_,h[7]=v,h[11]=x,h[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new it().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/mi.setFromMatrixColumn(e,0).length(),o=1/mi.setFromMatrixColumn(e,1).length(),s=1/mi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*o,t[5]=i[5]*o,t[6]=i[6]*o,t[7]=0,t[8]=i[8]*s,t[9]=i[9]*s,t[10]=i[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,o=e.z,s=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),d=Math.cos(o),u=Math.sin(o);if(e.order==="XYZ"){const f=s*d,_=s*u,v=a*d,x=a*u;t[0]=l*d,t[4]=-l*u,t[8]=c,t[1]=_+v*c,t[5]=f-x*c,t[9]=-a*l,t[2]=x-f*c,t[6]=v+_*c,t[10]=s*l}else if(e.order==="YXZ"){const f=l*d,_=l*u,v=c*d,x=c*u;t[0]=f+x*a,t[4]=v*a-_,t[8]=s*c,t[1]=s*u,t[5]=s*d,t[9]=-a,t[2]=_*a-v,t[6]=x+f*a,t[10]=s*l}else if(e.order==="ZXY"){const f=l*d,_=l*u,v=c*d,x=c*u;t[0]=f-x*a,t[4]=-s*u,t[8]=v+_*a,t[1]=_+v*a,t[5]=s*d,t[9]=x-f*a,t[2]=-s*c,t[6]=a,t[10]=s*l}else if(e.order==="ZYX"){const f=s*d,_=s*u,v=a*d,x=a*u;t[0]=l*d,t[4]=v*c-_,t[8]=f*c+x,t[1]=l*u,t[5]=x*c+f,t[9]=_*c-v,t[2]=-c,t[6]=a*l,t[10]=s*l}else if(e.order==="YZX"){const f=s*l,_=s*c,v=a*l,x=a*c;t[0]=l*d,t[4]=x-f*u,t[8]=v*u+_,t[1]=u,t[5]=s*d,t[9]=-a*d,t[2]=-c*d,t[6]=_*u+v,t[10]=f-x*u}else if(e.order==="XZY"){const f=s*l,_=s*c,v=a*l,x=a*c;t[0]=l*d,t[4]=-u,t[8]=c*d,t[1]=f*u+x,t[5]=s*d,t[9]=_*u-v,t[2]=v*u-_,t[6]=a*d,t[10]=x*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(rh,e,oh)}lookAt(e,t,i){const r=this.elements;return Ft.subVectors(e,t),Ft.lengthSq()===0&&(Ft.z=1),Ft.normalize(),Pn.crossVectors(i,Ft),Pn.lengthSq()===0&&(Math.abs(i.z)===1?Ft.x+=1e-4:Ft.z+=1e-4,Ft.normalize(),Pn.crossVectors(i,Ft)),Pn.normalize(),Mr.crossVectors(Ft,Pn),r[0]=Pn.x,r[4]=Mr.x,r[8]=Ft.x,r[1]=Pn.y,r[5]=Mr.y,r[9]=Ft.y,r[2]=Pn.z,r[6]=Mr.z,r[10]=Ft.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,o=this.elements,s=i[0],a=i[4],l=i[8],c=i[12],d=i[1],u=i[5],f=i[9],_=i[13],v=i[2],x=i[6],m=i[10],h=i[14],A=i[3],g=i[7],E=i[11],I=i[15],R=r[0],P=r[4],p=r[8],T=r[12],b=r[1],L=r[5],V=r[9],G=r[13],Z=r[2],$=r[6],W=r[10],J=r[14],M=r[3],ie=r[7],he=r[11],ye=r[15];return o[0]=s*R+a*b+l*Z+c*M,o[4]=s*P+a*L+l*$+c*ie,o[8]=s*p+a*V+l*W+c*he,o[12]=s*T+a*G+l*J+c*ye,o[1]=d*R+u*b+f*Z+_*M,o[5]=d*P+u*L+f*$+_*ie,o[9]=d*p+u*V+f*W+_*he,o[13]=d*T+u*G+f*J+_*ye,o[2]=v*R+x*b+m*Z+h*M,o[6]=v*P+x*L+m*$+h*ie,o[10]=v*p+x*V+m*W+h*he,o[14]=v*T+x*G+m*J+h*ye,o[3]=A*R+g*b+E*Z+I*M,o[7]=A*P+g*L+E*$+I*ie,o[11]=A*p+g*V+E*W+I*he,o[15]=A*T+g*G+E*J+I*ye,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],o=e[12],s=e[1],a=e[5],l=e[9],c=e[13],d=e[2],u=e[6],f=e[10],_=e[14],v=e[3],x=e[7],m=e[11],h=e[15];return v*(+o*l*u-r*c*u-o*a*f+i*c*f+r*a*_-i*l*_)+x*(+t*l*_-t*c*f+o*s*f-r*s*_+r*c*d-o*l*d)+m*(+t*c*u-t*a*_-o*s*u+i*s*_+o*a*d-i*c*d)+h*(-r*a*d-t*l*u+t*a*f+r*s*u-i*s*f+i*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],o=e[3],s=e[4],a=e[5],l=e[6],c=e[7],d=e[8],u=e[9],f=e[10],_=e[11],v=e[12],x=e[13],m=e[14],h=e[15],A=u*m*c-x*f*c+x*l*_-a*m*_-u*l*h+a*f*h,g=v*f*c-d*m*c-v*l*_+s*m*_+d*l*h-s*f*h,E=d*x*c-v*u*c+v*a*_-s*x*_-d*a*h+s*u*h,I=v*u*l-d*x*l-v*a*f+s*x*f+d*a*m-s*u*m,R=t*A+i*g+r*E+o*I;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/R;return e[0]=A*P,e[1]=(x*f*o-u*m*o-x*r*_+i*m*_+u*r*h-i*f*h)*P,e[2]=(a*m*o-x*l*o+x*r*c-i*m*c-a*r*h+i*l*h)*P,e[3]=(u*l*o-a*f*o-u*r*c+i*f*c+a*r*_-i*l*_)*P,e[4]=g*P,e[5]=(d*m*o-v*f*o+v*r*_-t*m*_-d*r*h+t*f*h)*P,e[6]=(v*l*o-s*m*o-v*r*c+t*m*c+s*r*h-t*l*h)*P,e[7]=(s*f*o-d*l*o+d*r*c-t*f*c-s*r*_+t*l*_)*P,e[8]=E*P,e[9]=(v*u*o-d*x*o-v*i*_+t*x*_+d*i*h-t*u*h)*P,e[10]=(s*x*o-v*a*o+v*i*c-t*x*c-s*i*h+t*a*h)*P,e[11]=(d*a*o-s*u*o-d*i*c+t*u*c+s*i*_-t*a*_)*P,e[12]=I*P,e[13]=(d*x*r-v*u*r+v*i*f-t*x*f-d*i*m+t*u*m)*P,e[14]=(v*a*r-s*x*r-v*i*l+t*x*l+s*i*m-t*a*m)*P,e[15]=(s*u*r-d*a*r+d*i*l-t*u*l-s*i*f+t*a*f)*P,this}scale(e){const t=this.elements,i=e.x,r=e.y,o=e.z;return t[0]*=i,t[4]*=r,t[8]*=o,t[1]*=i,t[5]*=r,t[9]*=o,t[2]*=i,t[6]*=r,t[10]*=o,t[3]*=i,t[7]*=r,t[11]*=o,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),o=1-i,s=e.x,a=e.y,l=e.z,c=o*s,d=o*a;return this.set(c*s+i,c*a-r*l,c*l+r*a,0,c*a+r*l,d*a+i,d*l-r*s,0,c*l-r*a,d*l+r*s,o*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,o,s){return this.set(1,i,o,0,e,1,s,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,o=t._x,s=t._y,a=t._z,l=t._w,c=o+o,d=s+s,u=a+a,f=o*c,_=o*d,v=o*u,x=s*d,m=s*u,h=a*u,A=l*c,g=l*d,E=l*u,I=i.x,R=i.y,P=i.z;return r[0]=(1-(x+h))*I,r[1]=(_+E)*I,r[2]=(v-g)*I,r[3]=0,r[4]=(_-E)*R,r[5]=(1-(f+h))*R,r[6]=(m+A)*R,r[7]=0,r[8]=(v+g)*P,r[9]=(m-A)*P,r[10]=(1-(f+x))*P,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let o=mi.set(r[0],r[1],r[2]).length();const s=mi.set(r[4],r[5],r[6]).length(),a=mi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(o=-o),e.x=r[12],e.y=r[13],e.z=r[14],Zt.copy(this);const c=1/o,d=1/s,u=1/a;return Zt.elements[0]*=c,Zt.elements[1]*=c,Zt.elements[2]*=c,Zt.elements[4]*=d,Zt.elements[5]*=d,Zt.elements[6]*=d,Zt.elements[8]*=u,Zt.elements[9]*=u,Zt.elements[10]*=u,t.setFromRotationMatrix(Zt),i.x=o,i.y=s,i.z=a,this}makePerspective(e,t,i,r,o,s,a=Sn){const l=this.elements,c=2*o/(t-e),d=2*o/(i-r),u=(t+e)/(t-e),f=(i+r)/(i-r);let _,v;if(a===Sn)_=-(s+o)/(s-o),v=-2*s*o/(s-o);else if(a===oo)_=-s/(s-o),v=-s*o/(s-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=_,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,o,s,a=Sn){const l=this.elements,c=1/(t-e),d=1/(i-r),u=1/(s-o),f=(t+e)*c,_=(i+r)*d;let v,x;if(a===Sn)v=(s+o)*u,x=-2*u;else if(a===oo)v=o*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-_,l[2]=0,l[6]=0,l[10]=x,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const mi=new D,Zt=new it,rh=new D(0,0,0),oh=new D(1,1,1),Pn=new D,Mr=new D,Ft=new D,rl=new it,ol=new si;class Tn{constructor(e=0,t=0,i=0,r=Tn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,o=r[0],s=r[4],a=r[8],l=r[1],c=r[5],d=r[9],u=r[2],f=r[6],_=r[10];switch(t){case"XYZ":this._y=Math.asin(Fe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-d,_),this._z=Math.atan2(-s,o)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Fe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(a,_),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(Fe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,_),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,o));break;case"ZYX":this._y=Math.asin(-Fe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,_),this._z=Math.atan2(l,o)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(Fe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(a,_));break;case"XZY":this._z=Math.asin(-Fe(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,o)):(this._x=Math.atan2(-d,_),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return rl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(rl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ol.setFromEuler(this),this.setFromQuaternion(ol,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Tn.DEFAULT_ORDER="XYZ";class Aa{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let sh=0;const sl=new D,gi=new si,fn=new it,Tr=new D,ji=new D,ah=new D,lh=new si,al=new D(1,0,0),ll=new D(0,1,0),cl=new D(0,0,1),ul={type:"added"},ch={type:"removed"},vi={type:"childadded",child:null},Uo={type:"childremoved",child:null};class Et extends li{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sh++}),this.uuid=hr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Et.DEFAULT_UP.clone();const e=new D,t=new Tn,i=new si,r=new D(1,1,1);function o(){i.setFromEuler(t,!1)}function s(){t.setFromQuaternion(i,void 0,!1)}t._onChange(o),i._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new it},normalMatrix:{value:new Ne}}),this.matrix=new it,this.matrixWorld=new it,this.matrixAutoUpdate=Et.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Aa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return gi.setFromAxisAngle(e,t),this.quaternion.multiply(gi),this}rotateOnWorldAxis(e,t){return gi.setFromAxisAngle(e,t),this.quaternion.premultiply(gi),this}rotateX(e){return this.rotateOnAxis(al,e)}rotateY(e){return this.rotateOnAxis(ll,e)}rotateZ(e){return this.rotateOnAxis(cl,e)}translateOnAxis(e,t){return sl.copy(e).applyQuaternion(this.quaternion),this.position.add(sl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(al,e)}translateY(e){return this.translateOnAxis(ll,e)}translateZ(e){return this.translateOnAxis(cl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Tr.copy(e):Tr.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ji.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fn.lookAt(ji,Tr,this.up):fn.lookAt(Tr,ji,this.up),this.quaternion.setFromRotationMatrix(fn),r&&(fn.extractRotation(r.matrixWorld),gi.setFromRotationMatrix(fn),this.quaternion.premultiply(gi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ul),vi.child=e,this.dispatchEvent(vi),vi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ch),Uo.child=e,this.dispatchEvent(Uo),Uo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fn.multiply(e.parent.matrixWorld)),e.applyMatrix4(fn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ul),vi.child=e,this.dispatchEvent(vi),vi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const s=this.children[i].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let o=0,s=r.length;o<s;o++)r[o].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ji,e,ah),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ji,lh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let o=0,s=r.length;o<s;o++)r[o].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function o(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=o(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const u=l[c];o(e.shapes,u)}else o(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(o(e.materials,this.material[l]));r.material=a}else r.material=o(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(o(e.animations,l))}}if(t){const a=s(e.geometries),l=s(e.materials),c=s(e.textures),d=s(e.images),u=s(e.shapes),f=s(e.skeletons),_=s(e.animations),v=s(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),_.length>0&&(i.animations=_),v.length>0&&(i.nodes=v)}return i.object=r,i;function s(a){const l=[];for(const c in a){const d=a[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Et.DEFAULT_UP=new D(0,1,0);Et.DEFAULT_MATRIX_AUTO_UPDATE=!0;Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const $t=new D,pn=new D,Oo=new D,_n=new D,xi=new D,Si=new D,dl=new D,Fo=new D,ko=new D,Bo=new D,zo=new Qe,Go=new Qe,Ho=new Qe;class Qt{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),$t.subVectors(e,t),r.cross($t);const o=r.lengthSq();return o>0?r.multiplyScalar(1/Math.sqrt(o)):r.set(0,0,0)}static getBarycoord(e,t,i,r,o){$t.subVectors(r,t),pn.subVectors(i,t),Oo.subVectors(e,t);const s=$t.dot($t),a=$t.dot(pn),l=$t.dot(Oo),c=pn.dot(pn),d=pn.dot(Oo),u=s*c-a*a;if(u===0)return o.set(0,0,0),null;const f=1/u,_=(c*l-a*d)*f,v=(s*d-a*l)*f;return o.set(1-_-v,v,_)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,_n)===null?!1:_n.x>=0&&_n.y>=0&&_n.x+_n.y<=1}static getInterpolation(e,t,i,r,o,s,a,l){return this.getBarycoord(e,t,i,r,_n)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(o,_n.x),l.addScaledVector(s,_n.y),l.addScaledVector(a,_n.z),l)}static getInterpolatedAttribute(e,t,i,r,o,s){return zo.setScalar(0),Go.setScalar(0),Ho.setScalar(0),zo.fromBufferAttribute(e,t),Go.fromBufferAttribute(e,i),Ho.fromBufferAttribute(e,r),s.setScalar(0),s.addScaledVector(zo,o.x),s.addScaledVector(Go,o.y),s.addScaledVector(Ho,o.z),s}static isFrontFacing(e,t,i,r){return $t.subVectors(i,t),pn.subVectors(e,t),$t.cross(pn).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return $t.subVectors(this.c,this.b),pn.subVectors(this.a,this.b),$t.cross(pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Qt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Qt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,o){return Qt.getInterpolation(e,this.a,this.b,this.c,t,i,r,o)}containsPoint(e){return Qt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Qt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,o=this.c;let s,a;xi.subVectors(r,i),Si.subVectors(o,i),Fo.subVectors(e,i);const l=xi.dot(Fo),c=Si.dot(Fo);if(l<=0&&c<=0)return t.copy(i);ko.subVectors(e,r);const d=xi.dot(ko),u=Si.dot(ko);if(d>=0&&u<=d)return t.copy(r);const f=l*u-d*c;if(f<=0&&l>=0&&d<=0)return s=l/(l-d),t.copy(i).addScaledVector(xi,s);Bo.subVectors(e,o);const _=xi.dot(Bo),v=Si.dot(Bo);if(v>=0&&_<=v)return t.copy(o);const x=_*c-l*v;if(x<=0&&c>=0&&v<=0)return a=c/(c-v),t.copy(i).addScaledVector(Si,a);const m=d*v-_*u;if(m<=0&&u-d>=0&&_-v>=0)return dl.subVectors(o,r),a=(u-d)/(u-d+(_-v)),t.copy(r).addScaledVector(dl,a);const h=1/(m+x+f);return s=x*h,a=f*h,t.copy(i).addScaledVector(xi,s).addScaledVector(Si,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const eu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Dn={h:0,s:0,l:0},wr={h:0,s:0,l:0};function Vo(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}let fe=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=qt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,qe.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=qe.workingColorSpace){return this.r=e,this.g=t,this.b=i,qe.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=qe.workingColorSpace){if(e=Xd(e,1),t=Fe(t,0,1),i=Fe(i,0,1),t===0)this.r=this.g=this.b=i;else{const o=i<=.5?i*(1+t):i+t-i*t,s=2*i-o;this.r=Vo(s,o,e+1/3),this.g=Vo(s,o,e),this.b=Vo(s,o,e-1/3)}return qe.toWorkingColorSpace(this,r),this}setStyle(e,t=qt){function i(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let o;const s=r[1],a=r[2];switch(s){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,t);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,t);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const o=r[1],s=o.length;if(s===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(o,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=qt){const i=eu[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=En(e.r),this.g=En(e.g),this.b=En(e.b),this}copyLinearToSRGB(e){return this.r=Ii(e.r),this.g=Ii(e.g),this.b=Ii(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=qt){return qe.fromWorkingColorSpace(wt.copy(this),e),Math.round(Fe(wt.r*255,0,255))*65536+Math.round(Fe(wt.g*255,0,255))*256+Math.round(Fe(wt.b*255,0,255))}getHexString(e=qt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=qe.workingColorSpace){qe.fromWorkingColorSpace(wt.copy(this),t);const i=wt.r,r=wt.g,o=wt.b,s=Math.max(i,r,o),a=Math.min(i,r,o);let l,c;const d=(a+s)/2;if(a===s)l=0,c=0;else{const u=s-a;switch(c=d<=.5?u/(s+a):u/(2-s-a),s){case i:l=(r-o)/u+(r<o?6:0);break;case r:l=(o-i)/u+2;break;case o:l=(i-r)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=qe.workingColorSpace){return qe.fromWorkingColorSpace(wt.copy(this),t),e.r=wt.r,e.g=wt.g,e.b=wt.b,e}getStyle(e=qt){qe.fromWorkingColorSpace(wt.copy(this),e);const t=wt.r,i=wt.g,r=wt.b;return e!==qt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Dn),this.setHSL(Dn.h+e,Dn.s+t,Dn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Dn),e.getHSL(wr);const i=wo(Dn.h,wr.h,t),r=wo(Dn.s,wr.s,t),o=wo(Dn.l,wr.l,t);return this.setHSL(i,r,o),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,o=e.elements;return this.r=o[0]*t+o[3]*i+o[6]*r,this.g=o[1]*t+o[4]*i+o[7]*r,this.b=o[2]*t+o[5]*i+o[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}};const wt=new fe;fe.NAMES=eu;let uh=0;class pr extends li{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:uh++}),this.uuid=hr(),this.name="",this.type="Material",this.blending=Li,this.side=zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ms,this.blendDst=gs,this.blendEquation=ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new fe(0,0,0),this.blendAlpha=0,this.depthFunc=Oi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ja,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=di,this.stencilZFail=di,this.stencilZPass=di,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Li&&(i.blending=this.blending),this.side!==zn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ms&&(i.blendSrc=this.blendSrc),this.blendDst!==gs&&(i.blendDst=this.blendDst),this.blendEquation!==ei&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Oi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ja&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==di&&(i.stencilFail=this.stencilFail),this.stencilZFail!==di&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==di&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(o){const s=[];for(const a in o){const l=o[a];delete l.metadata,s.push(l)}return s}if(t){const o=r(e.textures),s=r(e.images);o.length>0&&(i.textures=o),s.length>0&&(i.images=s)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let o=0;o!==r;++o)i[o]=t[o].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class go extends pr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=kc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const mt=new D,Ar=new xe;let dh=0;class dt{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:dh++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Qa,this.updateRanges=[],this.gpuType=xn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,o=this.itemSize;r<o;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ar.fromBufferAttribute(this,t),Ar.applyMatrix3(e),this.setXY(t,Ar.x,Ar.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix3(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix4(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)mt.fromBufferAttribute(this,t),mt.applyNormalMatrix(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)mt.fromBufferAttribute(this,t),mt.transformDirection(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=qi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Lt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=qi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=qi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=qi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=qi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),i=Lt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),i=Lt(i,this.array),r=Lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,o){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),i=Lt(i,this.array),r=Lt(r,this.array),o=Lt(o,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=o,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Qa&&(e.usage=this.usage),e}}class tu extends dt{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class nu extends dt{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Pt extends dt{constructor(e,t,i){super(new Float32Array(e),t,i)}}let hh=0;const Xt=new it,Wo=new Et,yi=new D,kt=new fr,Zi=new fr,St=new D;class Gt extends li{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hh++}),this.uuid=hr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Jc(e)?nu:tu)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const o=new Ne().getNormalMatrix(e);i.applyNormalMatrix(o),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Xt.makeRotationFromQuaternion(e),this.applyMatrix4(Xt),this}rotateX(e){return Xt.makeRotationX(e),this.applyMatrix4(Xt),this}rotateY(e){return Xt.makeRotationY(e),this.applyMatrix4(Xt),this}rotateZ(e){return Xt.makeRotationZ(e),this.applyMatrix4(Xt),this}translate(e,t,i){return Xt.makeTranslation(e,t,i),this.applyMatrix4(Xt),this}scale(e,t,i){return Xt.makeScale(e,t,i),this.applyMatrix4(Xt),this}lookAt(e){return Wo.lookAt(e),Wo.updateMatrix(),this.applyMatrix4(Wo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(yi).negate(),this.translate(yi.x,yi.y,yi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,o=e.length;r<o;r++){const s=e[r];i.push(s.x,s.y,s.z||0)}this.setAttribute("position",new Pt(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const o=e[r];t.setXYZ(r,o.x,o.y,o.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const o=t[i];kt.setFromBufferAttribute(o),this.morphTargetsRelative?(St.addVectors(this.boundingBox.min,kt.min),this.boundingBox.expandByPoint(St),St.addVectors(this.boundingBox.max,kt.max),this.boundingBox.expandByPoint(St)):(this.boundingBox.expandByPoint(kt.min),this.boundingBox.expandByPoint(kt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _o);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(kt.setFromBufferAttribute(e),t)for(let o=0,s=t.length;o<s;o++){const a=t[o];Zi.setFromBufferAttribute(a),this.morphTargetsRelative?(St.addVectors(kt.min,Zi.min),kt.expandByPoint(St),St.addVectors(kt.max,Zi.max),kt.expandByPoint(St)):(kt.expandByPoint(Zi.min),kt.expandByPoint(Zi.max))}kt.getCenter(i);let r=0;for(let o=0,s=e.count;o<s;o++)St.fromBufferAttribute(e,o),r=Math.max(r,i.distanceToSquared(St));if(t)for(let o=0,s=t.length;o<s;o++){const a=t[o],l=this.morphTargetsRelative;for(let c=0,d=a.count;c<d;c++)St.fromBufferAttribute(a,c),l&&(yi.fromBufferAttribute(e,c),St.add(yi)),r=Math.max(r,i.distanceToSquared(St))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,o=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new dt(new Float32Array(4*i.count),4));const s=this.getAttribute("tangent"),a=[],l=[];for(let p=0;p<i.count;p++)a[p]=new D,l[p]=new D;const c=new D,d=new D,u=new D,f=new xe,_=new xe,v=new xe,x=new D,m=new D;function h(p,T,b){c.fromBufferAttribute(i,p),d.fromBufferAttribute(i,T),u.fromBufferAttribute(i,b),f.fromBufferAttribute(o,p),_.fromBufferAttribute(o,T),v.fromBufferAttribute(o,b),d.sub(c),u.sub(c),_.sub(f),v.sub(f);const L=1/(_.x*v.y-v.x*_.y);isFinite(L)&&(x.copy(d).multiplyScalar(v.y).addScaledVector(u,-_.y).multiplyScalar(L),m.copy(u).multiplyScalar(_.x).addScaledVector(d,-v.x).multiplyScalar(L),a[p].add(x),a[T].add(x),a[b].add(x),l[p].add(m),l[T].add(m),l[b].add(m))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let p=0,T=A.length;p<T;++p){const b=A[p],L=b.start,V=b.count;for(let G=L,Z=L+V;G<Z;G+=3)h(e.getX(G+0),e.getX(G+1),e.getX(G+2))}const g=new D,E=new D,I=new D,R=new D;function P(p){I.fromBufferAttribute(r,p),R.copy(I);const T=a[p];g.copy(T),g.sub(I.multiplyScalar(I.dot(T))).normalize(),E.crossVectors(R,T);const L=E.dot(l[p])<0?-1:1;s.setXYZW(p,g.x,g.y,g.z,L)}for(let p=0,T=A.length;p<T;++p){const b=A[p],L=b.start,V=b.count;for(let G=L,Z=L+V;G<Z;G+=3)P(e.getX(G+0)),P(e.getX(G+1)),P(e.getX(G+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new dt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,_=i.count;f<_;f++)i.setXYZ(f,0,0,0);const r=new D,o=new D,s=new D,a=new D,l=new D,c=new D,d=new D,u=new D;if(e)for(let f=0,_=e.count;f<_;f+=3){const v=e.getX(f+0),x=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(t,v),o.fromBufferAttribute(t,x),s.fromBufferAttribute(t,m),d.subVectors(s,o),u.subVectors(r,o),d.cross(u),a.fromBufferAttribute(i,v),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),a.add(d),l.add(d),c.add(d),i.setXYZ(v,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,_=t.count;f<_;f+=3)r.fromBufferAttribute(t,f+0),o.fromBufferAttribute(t,f+1),s.fromBufferAttribute(t,f+2),d.subVectors(s,o),u.subVectors(r,o),d.cross(u),i.setXYZ(f+0,d.x,d.y,d.z),i.setXYZ(f+1,d.x,d.y,d.z),i.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)St.fromBufferAttribute(e,t),St.normalize(),e.setXYZ(t,St.x,St.y,St.z)}toNonIndexed(){function e(a,l){const c=a.array,d=a.itemSize,u=a.normalized,f=new c.constructor(l.length*d);let _=0,v=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?_=l[x]*a.data.stride+a.offset:_=l[x]*d;for(let h=0;h<d;h++)f[v++]=c[_++]}return new dt(f,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Gt,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const o=this.morphAttributes;for(const a in o){const l=[],c=o[a];for(let d=0,u=c.length;d<u;d++){const f=c[d],_=e(f,i);l.push(_)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let a=0,l=s.length;a<l;a++){const c=s[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let o=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let u=0,f=c.length;u<f;u++){const _=c[u];d.push(_.toJSON(e.data))}d.length>0&&(r[l]=d,o=!0)}o&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const d=r[c];this.setAttribute(c,d.clone(t))}const o=e.morphAttributes;for(const c in o){const d=[],u=o[c];for(let f=0,_=u.length;f<_;f++)d.push(u[f].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,d=s.length;c<d;c++){const u=s[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const hl=new it,Kn=new mo,Cr=new _o,fl=new D,Rr=new D,Pr=new D,Dr=new D,Xo=new D,Lr=new D,pl=new D,Ir=new D;class Nt extends Et{constructor(e=new Gt,t=new go){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,s=r.length;o<s;o++){const a=r[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,o=i.morphAttributes.position,s=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(o&&a){Lr.set(0,0,0);for(let l=0,c=o.length;l<c;l++){const d=a[l],u=o[l];d!==0&&(Xo.fromBufferAttribute(u,e),s?Lr.addScaledVector(Xo,d):Lr.addScaledVector(Xo.sub(t),d))}t.add(Lr)}return t}raycast(e,t){const i=this.geometry,r=this.material,o=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Cr.copy(i.boundingSphere),Cr.applyMatrix4(o),Kn.copy(e.ray).recast(e.near),!(Cr.containsPoint(Kn.origin)===!1&&(Kn.intersectSphere(Cr,fl)===null||Kn.origin.distanceToSquared(fl)>(e.far-e.near)**2))&&(hl.copy(o).invert(),Kn.copy(e.ray).applyMatrix4(hl),!(i.boundingBox!==null&&Kn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Kn)))}_computeIntersections(e,t,i){let r;const o=this.geometry,s=this.material,a=o.index,l=o.attributes.position,c=o.attributes.uv,d=o.attributes.uv1,u=o.attributes.normal,f=o.groups,_=o.drawRange;if(a!==null)if(Array.isArray(s))for(let v=0,x=f.length;v<x;v++){const m=f[v],h=s[m.materialIndex],A=Math.max(m.start,_.start),g=Math.min(a.count,Math.min(m.start+m.count,_.start+_.count));for(let E=A,I=g;E<I;E+=3){const R=a.getX(E),P=a.getX(E+1),p=a.getX(E+2);r=Nr(this,h,e,i,c,d,u,R,P,p),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const v=Math.max(0,_.start),x=Math.min(a.count,_.start+_.count);for(let m=v,h=x;m<h;m+=3){const A=a.getX(m),g=a.getX(m+1),E=a.getX(m+2);r=Nr(this,s,e,i,c,d,u,A,g,E),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(s))for(let v=0,x=f.length;v<x;v++){const m=f[v],h=s[m.materialIndex],A=Math.max(m.start,_.start),g=Math.min(l.count,Math.min(m.start+m.count,_.start+_.count));for(let E=A,I=g;E<I;E+=3){const R=E,P=E+1,p=E+2;r=Nr(this,h,e,i,c,d,u,R,P,p),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const v=Math.max(0,_.start),x=Math.min(l.count,_.start+_.count);for(let m=v,h=x;m<h;m+=3){const A=m,g=m+1,E=m+2;r=Nr(this,s,e,i,c,d,u,A,g,E),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function fh(n,e,t,i,r,o,s,a){let l;if(e.side===Rt?l=i.intersectTriangle(s,o,r,!0,a):l=i.intersectTriangle(r,o,s,e.side===zn,a),l===null)return null;Ir.copy(a),Ir.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Ir);return c<t.near||c>t.far?null:{distance:c,point:Ir.clone(),object:n}}function Nr(n,e,t,i,r,o,s,a,l,c){n.getVertexPosition(a,Rr),n.getVertexPosition(l,Pr),n.getVertexPosition(c,Dr);const d=fh(n,e,t,i,Rr,Pr,Dr,pl);if(d){const u=new D;Qt.getBarycoord(pl,Rr,Pr,Dr,u),r&&(d.uv=Qt.getInterpolatedAttribute(r,a,l,c,u,new xe)),o&&(d.uv1=Qt.getInterpolatedAttribute(o,a,l,c,u,new xe)),s&&(d.normal=Qt.getInterpolatedAttribute(s,a,l,c,u,new D),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new D,materialIndex:0};Qt.getNormal(Rr,Pr,Dr,f.normal),d.face=f,d.barycoord=u}return d}class Hi extends Gt{constructor(e=1,t=1,i=1,r=1,o=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:o,depthSegments:s};const a=this;r=Math.floor(r),o=Math.floor(o),s=Math.floor(s);const l=[],c=[],d=[],u=[];let f=0,_=0;v("z","y","x",-1,-1,i,t,e,s,o,0),v("z","y","x",1,-1,i,t,-e,s,o,1),v("x","z","y",1,1,e,i,t,r,s,2),v("x","z","y",1,-1,e,i,-t,r,s,3),v("x","y","z",1,-1,e,t,i,r,o,4),v("x","y","z",-1,-1,e,t,-i,r,o,5),this.setIndex(l),this.setAttribute("position",new Pt(c,3)),this.setAttribute("normal",new Pt(d,3)),this.setAttribute("uv",new Pt(u,2));function v(x,m,h,A,g,E,I,R,P,p,T){const b=E/P,L=I/p,V=E/2,G=I/2,Z=R/2,$=P+1,W=p+1;let J=0,M=0;const ie=new D;for(let he=0;he<W;he++){const ye=he*L-G;for(let ke=0;ke<$;ke++){const et=ke*b-V;ie[x]=et*A,ie[m]=ye*g,ie[h]=Z,c.push(ie.x,ie.y,ie.z),ie[x]=0,ie[m]=0,ie[h]=R>0?1:-1,d.push(ie.x,ie.y,ie.z),u.push(ke/P),u.push(1-he/p),J+=1}}for(let he=0;he<p;he++)for(let ye=0;ye<P;ye++){const ke=f+ye+$*he,et=f+ye+$*(he+1),q=f+(ye+1)+$*(he+1),ne=f+(ye+1)+$*he;l.push(ke,et,ne),l.push(et,q,ne),M+=6}a.addGroup(_,M,T),_+=M,f+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function zi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Ct(n){const e={};for(let t=0;t<n.length;t++){const i=zi(n[t]);for(const r in i)e[r]=i[r]}return e}function ph(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function iu(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:qe.workingColorSpace}const ao={clone:zi,merge:Ct};var _h=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,mh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class at extends pr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_h,this.fragmentShader=mh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=zi(e.uniforms),this.uniformsGroups=ph(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const s=this.uniforms[r].value;s&&s.isTexture?t.uniforms[r]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[r]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[r]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[r]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[r]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[r]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[r]={type:"m4",value:s.toArray()}:t.uniforms[r]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class ru extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new it,this.projectionMatrix=new it,this.projectionMatrixInverse=new it,this.coordinateSystem=Sn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ln=new D,_l=new xe,ml=new xe;class Bt extends ru{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=na*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Qr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return na*2*Math.atan(Math.tan(Qr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Ln.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ln.x,Ln.y).multiplyScalar(-e/Ln.z),Ln.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ln.x,Ln.y).multiplyScalar(-e/Ln.z)}getViewSize(e,t){return this.getViewBounds(e,_l,ml),t.subVectors(ml,_l)}setViewOffset(e,t,i,r,o,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=o,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Qr*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,o=-.5*r;const s=this.view;if(this.view!==null&&this.view.enabled){const l=s.fullWidth,c=s.fullHeight;o+=s.offsetX*r/l,t-=s.offsetY*i/c,r*=s.width/l,i*=s.height/c}const a=this.filmOffset;a!==0&&(o+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const bi=-90,Ei=1;class gh extends Et{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Bt(bi,Ei,e,t);r.layers=this.layers,this.add(r);const o=new Bt(bi,Ei,e,t);o.layers=this.layers,this.add(o);const s=new Bt(bi,Ei,e,t);s.layers=this.layers,this.add(s);const a=new Bt(bi,Ei,e,t);a.layers=this.layers,this.add(a);const l=new Bt(bi,Ei,e,t);l.layers=this.layers,this.add(l);const c=new Bt(bi,Ei,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,o,s,a,l]=t;for(const c of t)this.remove(c);if(e===Sn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===oo)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[o,s,a,l,c,d]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),_=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,o),e.setRenderTarget(i,1,r),e.render(t,s),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),e.render(t,d),e.setRenderTarget(u,f,_),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class ou extends Ut{constructor(e=[],t=Fi,i,r,o,s,a,l,c,d){super(e,t,i,r,o,s,a,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class vh extends zt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new ou(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:ln}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Hi(5,5,5),o=new at({name:"CubemapFromEquirect",uniforms:zi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Rt,blending:yn});o.uniforms.tEquirect.value=t;const s=new Nt(r,o),a=t.minFilter;return t.minFilter===ii&&(t.minFilter=ln),new gh(1,10,this).update(e,s),t.minFilter=a,s.geometry.dispose(),s.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const o=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,i,r);e.setRenderTarget(o)}}class Ur extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}}const xh={type:"move"};class qo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ur,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ur,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ur,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,o=null,s=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,i),h=this._getHandJoint(c,x);m!==null&&(h.matrix.fromArray(m.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=m.radius),h.visible=m!==null}const d=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=d.position.distanceTo(u.position),_=.02,v=.005;c.inputState.pinching&&f>_+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=_-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(o=t.getPose(e.gripSpace,i),o!==null&&(l.matrix.fromArray(o.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,o.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(o.linearVelocity)):l.hasLinearVelocity=!1,o.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(o.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&o!==null&&(r=o),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(xh)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=o!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Ur;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Sh extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Tn,this.environmentIntensity=1,this.environmentRotation=new Tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Yo=new D,yh=new D,bh=new Ne;class In{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Yo.subVectors(i,t).cross(yh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Yo),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/r;return o<0||o>1?null:t.copy(e.start).addScaledVector(i,o)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||bh.getNormalMatrix(e),r=this.coplanarPoint(Yo).applyMatrix4(e),o=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(o),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const jn=new _o,Or=new D;class Ca{constructor(e=new In,t=new In,i=new In,r=new In,o=new In,s=new In){this.planes=[e,t,i,r,o,s]}set(e,t,i,r,o,s){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(o),a[5].copy(s),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Sn){const i=this.planes,r=e.elements,o=r[0],s=r[1],a=r[2],l=r[3],c=r[4],d=r[5],u=r[6],f=r[7],_=r[8],v=r[9],x=r[10],m=r[11],h=r[12],A=r[13],g=r[14],E=r[15];if(i[0].setComponents(l-o,f-c,m-_,E-h).normalize(),i[1].setComponents(l+o,f+c,m+_,E+h).normalize(),i[2].setComponents(l+s,f+d,m+v,E+A).normalize(),i[3].setComponents(l-s,f-d,m-v,E-A).normalize(),i[4].setComponents(l-a,f-u,m-x,E-g).normalize(),t===Sn)i[5].setComponents(l+a,f+u,m+x,E+g).normalize();else if(t===oo)i[5].setComponents(a,u,x,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),jn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),jn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(jn)}intersectsSprite(e){return jn.center.set(0,0,0),jn.radius=.7071067811865476,jn.applyMatrix4(e.matrixWorld),this.intersectsSphere(jn)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let o=0;o<6;o++)if(t[o].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Or.x=r.normal.x>0?e.max.x:e.min.x,Or.y=r.normal.y>0?e.max.y:e.min.y,Or.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Or)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Eh extends pr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new fe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const gl=new it,ia=new mo,Fr=new _o,kr=new D;class su extends Et{constructor(e=new Gt,t=new Eh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,o=e.params.Points.threshold,s=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Fr.copy(i.boundingSphere),Fr.applyMatrix4(r),Fr.radius+=o,e.ray.intersectsSphere(Fr)===!1)return;gl.copy(r).invert(),ia.copy(e.ray).applyMatrix4(gl);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,u=i.attributes.position;if(c!==null){const f=Math.max(0,s.start),_=Math.min(c.count,s.start+s.count);for(let v=f,x=_;v<x;v++){const m=c.getX(v);kr.fromBufferAttribute(u,m),vl(kr,m,l,r,e,t,this)}}else{const f=Math.max(0,s.start),_=Math.min(u.count,s.start+s.count);for(let v=f,x=_;v<x;v++)kr.fromBufferAttribute(u,v),vl(kr,v,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,s=r.length;o<s;o++){const a=r[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function vl(n,e,t,i,r,o,s){const a=ia.distanceSqToPoint(n);if(a<t){const l=new D;ia.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;o.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:s})}}class Ra extends Ut{constructor(e,t,i=oi,r,o,s,a=tn,l=tn,c,d=lr){if(d!==lr&&d!==cr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");super(null,r,o,s,a,l,d,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new wa(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Pa extends Gt{constructor(e=[new xe(0,-.5),new xe(.5,0),new xe(0,.5)],t=12,i=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:r},t=Math.floor(t),r=Fe(r,0,Math.PI*2);const o=[],s=[],a=[],l=[],c=[],d=1/t,u=new D,f=new xe,_=new D,v=new D,x=new D;let m=0,h=0;for(let A=0;A<=e.length-1;A++)switch(A){case 0:m=e[A+1].x-e[A].x,h=e[A+1].y-e[A].y,_.x=h*1,_.y=-m,_.z=h*0,x.copy(_),_.normalize(),l.push(_.x,_.y,_.z);break;case e.length-1:l.push(x.x,x.y,x.z);break;default:m=e[A+1].x-e[A].x,h=e[A+1].y-e[A].y,_.x=h*1,_.y=-m,_.z=h*0,v.copy(_),_.x+=x.x,_.y+=x.y,_.z+=x.z,_.normalize(),l.push(_.x,_.y,_.z),x.copy(v)}for(let A=0;A<=t;A++){const g=i+A*d*r,E=Math.sin(g),I=Math.cos(g);for(let R=0;R<=e.length-1;R++){u.x=e[R].x*E,u.y=e[R].y,u.z=e[R].x*I,s.push(u.x,u.y,u.z),f.x=A/t,f.y=R/(e.length-1),a.push(f.x,f.y);const P=l[3*R+0]*E,p=l[3*R+1],T=l[3*R+0]*I;c.push(P,p,T)}}for(let A=0;A<t;A++)for(let g=0;g<e.length-1;g++){const E=g+A*e.length,I=E,R=E+e.length,P=E+e.length+1,p=E+1;o.push(I,R,p),o.push(P,p,R)}this.setIndex(o),this.setAttribute("position",new Pt(s,3)),this.setAttribute("uv",new Pt(a,2)),this.setAttribute("normal",new Pt(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pa(e.points,e.segments,e.phiStart,e.phiLength)}}class _r extends Gt{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const o=e/2,s=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,d=l+1,u=e/a,f=t/l,_=[],v=[],x=[],m=[];for(let h=0;h<d;h++){const A=h*f-s;for(let g=0;g<c;g++){const E=g*u-o;v.push(E,-A,0),x.push(0,0,1),m.push(g/a),m.push(1-h/l)}}for(let h=0;h<l;h++)for(let A=0;A<a;A++){const g=A+c*h,E=A+c*(h+1),I=A+1+c*(h+1),R=A+1+c*h;_.push(g,E,R),_.push(E,I,R)}this.setIndex(_),this.setAttribute("position",new Pt(v,3)),this.setAttribute("normal",new Pt(x,3)),this.setAttribute("uv",new Pt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _r(e.width,e.height,e.widthSegments,e.heightSegments)}}class Da extends Gt{constructor(e=1,t=32,i=16,r=0,o=Math.PI*2,s=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:o,thetaStart:s,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(s+a,Math.PI);let c=0;const d=[],u=new D,f=new D,_=[],v=[],x=[],m=[];for(let h=0;h<=i;h++){const A=[],g=h/i;let E=0;h===0&&s===0?E=.5/t:h===i&&l===Math.PI&&(E=-.5/t);for(let I=0;I<=t;I++){const R=I/t;u.x=-e*Math.cos(r+R*o)*Math.sin(s+g*a),u.y=e*Math.cos(s+g*a),u.z=e*Math.sin(r+R*o)*Math.sin(s+g*a),v.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),m.push(R+E,1-g),A.push(c++)}d.push(A)}for(let h=0;h<i;h++)for(let A=0;A<t;A++){const g=d[h][A+1],E=d[h][A],I=d[h+1][A],R=d[h+1][A+1];(h!==0||s>0)&&_.push(g,E,R),(h!==i-1||l<Math.PI)&&_.push(E,I,R)}this.setIndex(_),this.setAttribute("position",new Pt(v,3)),this.setAttribute("normal",new Pt(x,3)),this.setAttribute("uv",new Pt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Da(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Mh extends pr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Nd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Th extends pr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class La extends Et{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new fe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const Ko=new it,xl=new D,Sl=new D;class au{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xe(512,512),this.map=null,this.mapPass=null,this.matrix=new it,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ca,this._frameExtents=new xe(1,1),this._viewportCount=1,this._viewports=[new Qe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;xl.setFromMatrixPosition(e.matrixWorld),t.position.copy(xl),Sl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Sl),t.updateMatrixWorld(),Ko.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ko),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ko)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const yl=new it,$i=new D,jo=new D;class wh extends au{constructor(){super(new Bt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new xe(4,2),this._viewportCount=6,this._viewports=[new Qe(2,1,1,1),new Qe(0,1,1,1),new Qe(3,1,1,1),new Qe(1,1,1,1),new Qe(3,0,1,1),new Qe(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,r=this.matrix,o=e.distance||i.far;o!==i.far&&(i.far=o,i.updateProjectionMatrix()),$i.setFromMatrixPosition(e.matrixWorld),i.position.copy($i),jo.copy(i.position),jo.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(jo),i.updateMatrixWorld(),r.makeTranslation(-$i.x,-$i.y,-$i.z),yl.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yl)}}class Ah extends La{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new wh}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Ia extends ru{constructor(e=-1,t=1,i=1,r=-1,o=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=o,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,o,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=o,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let o=i-e,s=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=c*this.view.offsetX,s=o+c*this.view.width,a-=d*this.view.offsetY,l=a-d*this.view.height}this.projectionMatrix.makeOrthographic(o,s,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Ch extends au{constructor(){super(new Ia(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Rh extends La{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new Ch}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Ph extends La{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Dh extends Bt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e,this.index=0}}class lu{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=bl(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=bl();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function bl(){return performance.now()}const El=new it;class Lh{constructor(e,t,i=0,r=1/0){this.ray=new mo(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new Aa,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return El.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(El),this}intersectObject(e,t=!0,i=[]){return ra(e,this,i,t),i.sort(Ml),i}intersectObjects(e,t=!0,i=[]){for(let r=0,o=e.length;r<o;r++)ra(e[r],this,i,t);return i.sort(Ml),i}}function Ml(n,e){return n.distance-e.distance}function ra(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const o=n.children;for(let s=0,a=o.length;s<a;s++)ra(o[s],e,t,!0)}}class Tl{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Fe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Fe(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Ih extends li{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function wl(n,e,t,i){const r=Nh(i);switch(t){case Wc:return n*e;case qc:return n*e;case Yc:return n*e*2;case Kc:return n*e/r.components*r.byteLength;case Ea:return n*e/r.components*r.byteLength;case jc:return n*e*2/r.components*r.byteLength;case Ma:return n*e*2/r.components*r.byteLength;case Xc:return n*e*3/r.components*r.byteLength;case en:return n*e*4/r.components*r.byteLength;case Ta:return n*e*4/r.components*r.byteLength;case Kr:case jr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Zr:case $r:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ps:case Ls:return Math.max(n,16)*Math.max(e,8)/4;case Rs:case Ds:return Math.max(n,8)*Math.max(e,8)/2;case Is:case Ns:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Us:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Os:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Fs:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case ks:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Bs:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case zs:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Gs:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Hs:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Vs:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Ws:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Xs:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case qs:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Ys:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Ks:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case js:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Jr:case Zs:case $s:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Zc:case Js:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Qs:case ea:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Nh(n){switch(n){case Mn:case Gc:return{byteLength:1,components:1};case sr:case Hc:case bn:return{byteLength:2,components:1};case ya:case ba:return{byteLength:2,components:4};case oi:case Sa:case xn:return{byteLength:4,components:1};case Vc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:xa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=xa);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function cu(){let n=null,e=!1,t=null,i=null;function r(o,s){t(o,s),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(o){t=o},setContext:function(o){n=o}}}function Uh(n){const e=new WeakMap;function t(a,l){const c=a.array,d=a.usage,u=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,d),a.onUploadCallback();let _;if(c instanceof Float32Array)_=n.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?_=n.HALF_FLOAT:_=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)_=n.SHORT;else if(c instanceof Uint32Array)_=n.UNSIGNED_INT;else if(c instanceof Int32Array)_=n.INT;else if(c instanceof Int8Array)_=n.BYTE;else if(c instanceof Uint8Array)_=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)_=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:_,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,l,c){const d=l.array,u=l.updateRanges;if(n.bindBuffer(c,a),u.length===0)n.bufferSubData(c,0,d);else{u.sort((_,v)=>_.start-v.start);let f=0;for(let _=1;_<u.length;_++){const v=u[f],x=u[_];x.start<=v.start+v.count+1?v.count=Math.max(v.count,x.start+x.count-v.start):(++f,u[f]=x)}u.length=f+1;for(let _=0,v=u.length;_<v;_++){const x=u[_];n.bufferSubData(c,x.start*d.BYTES_PER_ELEMENT,d,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function o(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function s(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const d=e.get(a);(!d||d.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:o,update:s}}var Oh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Fh=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,kh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Bh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Gh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Hh=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Vh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Wh=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Xh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,qh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Yh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Kh=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,jh=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Zh=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,$h=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Jh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Qh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ef=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,tf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,nf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,rf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,of=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,sf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,af=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,lf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,cf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,uf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,df=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,hf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ff="gl_FragColor = linearToOutputTexel( gl_FragColor );",pf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,_f=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,mf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,gf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,vf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Sf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,yf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ef=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Mf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Tf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,wf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Af=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Cf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Rf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Pf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Df=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Lf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,If=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Nf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Uf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Of=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ff=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,kf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Bf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Vf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,qf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Yf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Kf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,jf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Zf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,$f=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Qf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ep=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,tp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,np=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ip=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,op=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,sp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ap=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,lp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,cp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,up=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,dp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,hp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,fp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,pp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_p=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,mp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,gp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,vp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,xp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Sp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,yp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,bp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ep=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Mp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Tp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,wp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ap=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Cp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Rp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Pp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Dp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Lp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ip=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Np=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Up=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Op=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Fp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Bp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Vp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Wp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Xp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,qp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Yp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Zp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,$p=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,t_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,n_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,i_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,r_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,o_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,a_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,l_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,c_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,d_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,h_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,f_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,p_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,__=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Oe={alphahash_fragment:Oh,alphahash_pars_fragment:Fh,alphamap_fragment:kh,alphamap_pars_fragment:Bh,alphatest_fragment:zh,alphatest_pars_fragment:Gh,aomap_fragment:Hh,aomap_pars_fragment:Vh,batching_pars_vertex:Wh,batching_vertex:Xh,begin_vertex:qh,beginnormal_vertex:Yh,bsdfs:Kh,iridescence_fragment:jh,bumpmap_pars_fragment:Zh,clipping_planes_fragment:$h,clipping_planes_pars_fragment:Jh,clipping_planes_pars_vertex:Qh,clipping_planes_vertex:ef,color_fragment:tf,color_pars_fragment:nf,color_pars_vertex:rf,color_vertex:of,common:sf,cube_uv_reflection_fragment:af,defaultnormal_vertex:lf,displacementmap_pars_vertex:cf,displacementmap_vertex:uf,emissivemap_fragment:df,emissivemap_pars_fragment:hf,colorspace_fragment:ff,colorspace_pars_fragment:pf,envmap_fragment:_f,envmap_common_pars_fragment:mf,envmap_pars_fragment:gf,envmap_pars_vertex:vf,envmap_physical_pars_fragment:Rf,envmap_vertex:xf,fog_vertex:Sf,fog_pars_vertex:yf,fog_fragment:bf,fog_pars_fragment:Ef,gradientmap_pars_fragment:Mf,lightmap_pars_fragment:Tf,lights_lambert_fragment:wf,lights_lambert_pars_fragment:Af,lights_pars_begin:Cf,lights_toon_fragment:Pf,lights_toon_pars_fragment:Df,lights_phong_fragment:Lf,lights_phong_pars_fragment:If,lights_physical_fragment:Nf,lights_physical_pars_fragment:Uf,lights_fragment_begin:Of,lights_fragment_maps:Ff,lights_fragment_end:kf,logdepthbuf_fragment:Bf,logdepthbuf_pars_fragment:zf,logdepthbuf_pars_vertex:Gf,logdepthbuf_vertex:Hf,map_fragment:Vf,map_pars_fragment:Wf,map_particle_fragment:Xf,map_particle_pars_fragment:qf,metalnessmap_fragment:Yf,metalnessmap_pars_fragment:Kf,morphinstance_vertex:jf,morphcolor_vertex:Zf,morphnormal_vertex:$f,morphtarget_pars_vertex:Jf,morphtarget_vertex:Qf,normal_fragment_begin:ep,normal_fragment_maps:tp,normal_pars_fragment:np,normal_pars_vertex:ip,normal_vertex:rp,normalmap_pars_fragment:op,clearcoat_normal_fragment_begin:sp,clearcoat_normal_fragment_maps:ap,clearcoat_pars_fragment:lp,iridescence_pars_fragment:cp,opaque_fragment:up,packing:dp,premultiplied_alpha_fragment:hp,project_vertex:fp,dithering_fragment:pp,dithering_pars_fragment:_p,roughnessmap_fragment:mp,roughnessmap_pars_fragment:gp,shadowmap_pars_fragment:vp,shadowmap_pars_vertex:xp,shadowmap_vertex:Sp,shadowmask_pars_fragment:yp,skinbase_vertex:bp,skinning_pars_vertex:Ep,skinning_vertex:Mp,skinnormal_vertex:Tp,specularmap_fragment:wp,specularmap_pars_fragment:Ap,tonemapping_fragment:Cp,tonemapping_pars_fragment:Rp,transmission_fragment:Pp,transmission_pars_fragment:Dp,uv_pars_fragment:Lp,uv_pars_vertex:Ip,uv_vertex:Np,worldpos_vertex:Up,background_vert:Op,background_frag:Fp,backgroundCube_vert:kp,backgroundCube_frag:Bp,cube_vert:zp,cube_frag:Gp,depth_vert:Hp,depth_frag:Vp,distanceRGBA_vert:Wp,distanceRGBA_frag:Xp,equirect_vert:qp,equirect_frag:Yp,linedashed_vert:Kp,linedashed_frag:jp,meshbasic_vert:Zp,meshbasic_frag:$p,meshlambert_vert:Jp,meshlambert_frag:Qp,meshmatcap_vert:e_,meshmatcap_frag:t_,meshnormal_vert:n_,meshnormal_frag:i_,meshphong_vert:r_,meshphong_frag:o_,meshphysical_vert:s_,meshphysical_frag:a_,meshtoon_vert:l_,meshtoon_frag:c_,points_vert:u_,points_frag:d_,shadow_vert:h_,shadow_frag:f_,sprite_vert:p_,sprite_frag:__},re={common:{diffuse:{value:new fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new fe(16777215)},opacity:{value:1},center:{value:new xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},sn={basic:{uniforms:Ct([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:Ct([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.fog,re.lights,{emissive:{value:new fe(0)}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:Ct([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.fog,re.lights,{emissive:{value:new fe(0)},specular:{value:new fe(1118481)},shininess:{value:30}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:Ct([re.common,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.roughnessmap,re.metalnessmap,re.fog,re.lights,{emissive:{value:new fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:Ct([re.common,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.gradientmap,re.fog,re.lights,{emissive:{value:new fe(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:Ct([re.common,re.bumpmap,re.normalmap,re.displacementmap,re.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:Ct([re.points,re.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:Ct([re.common,re.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:Ct([re.common,re.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:Ct([re.common,re.bumpmap,re.normalmap,re.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:Ct([re.sprite,re.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distanceRGBA:{uniforms:Ct([re.common,re.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distanceRGBA_vert,fragmentShader:Oe.distanceRGBA_frag},shadow:{uniforms:Ct([re.lights,re.fog,{color:{value:new fe(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};sn.physical={uniforms:Ct([sn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new fe(0)},specularColor:{value:new fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};const Br={r:0,b:0,g:0},Zn=new Tn,m_=new it;function g_(n,e,t,i,r,o,s){const a=new fe(0);let l=o===!0?0:1,c,d,u=null,f=0,_=null;function v(g){let E=g.isScene===!0?g.background:null;return E&&E.isTexture&&(E=(g.backgroundBlurriness>0?t:e).get(E)),E}function x(g){let E=!1;const I=v(g);I===null?h(a,l):I&&I.isColor&&(h(I,1),E=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,s):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,s),(n.autoClear||E)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(g,E){const I=v(E);I&&(I.isCubeTexture||I.mapping===po)?(d===void 0&&(d=new Nt(new Hi(1,1,1),new at({name:"BackgroundCubeMaterial",uniforms:zi(sn.backgroundCube.uniforms),vertexShader:sn.backgroundCube.vertexShader,fragmentShader:sn.backgroundCube.fragmentShader,side:Rt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(R,P,p){this.matrixWorld.copyPosition(p.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),Zn.copy(E.backgroundRotation),Zn.x*=-1,Zn.y*=-1,Zn.z*=-1,I.isCubeTexture&&I.isRenderTargetTexture===!1&&(Zn.y*=-1,Zn.z*=-1),d.material.uniforms.envMap.value=I,d.material.uniforms.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(m_.makeRotationFromEuler(Zn)),d.material.toneMapped=qe.getTransfer(I.colorSpace)!==$e,(u!==I||f!==I.version||_!==n.toneMapping)&&(d.material.needsUpdate=!0,u=I,f=I.version,_=n.toneMapping),d.layers.enableAll(),g.unshift(d,d.geometry,d.material,0,0,null)):I&&I.isTexture&&(c===void 0&&(c=new Nt(new _r(2,2),new at({name:"BackgroundMaterial",uniforms:zi(sn.background.uniforms),vertexShader:sn.background.vertexShader,fragmentShader:sn.background.fragmentShader,side:zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=I,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=qe.getTransfer(I.colorSpace)!==$e,I.matrixAutoUpdate===!0&&I.updateMatrix(),c.material.uniforms.uvTransform.value.copy(I.matrix),(u!==I||f!==I.version||_!==n.toneMapping)&&(c.material.needsUpdate=!0,u=I,f=I.version,_=n.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null))}function h(g,E){g.getRGB(Br,iu(n)),i.buffers.color.setClear(Br.r,Br.g,Br.b,E,s)}function A(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(g,E=1){a.set(g),l=E,h(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,h(a,l)},render:x,addToRenderList:m,dispose:A}}function v_(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null);let o=r,s=!1;function a(b,L,V,G,Z){let $=!1;const W=u(G,V,L);o!==W&&(o=W,c(o.object)),$=_(b,G,V,Z),$&&v(b,G,V,Z),Z!==null&&e.update(Z,n.ELEMENT_ARRAY_BUFFER),($||s)&&(s=!1,E(b,L,V,G),Z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(Z).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function d(b){return n.deleteVertexArray(b)}function u(b,L,V){const G=V.wireframe===!0;let Z=i[b.id];Z===void 0&&(Z={},i[b.id]=Z);let $=Z[L.id];$===void 0&&($={},Z[L.id]=$);let W=$[G];return W===void 0&&(W=f(l()),$[G]=W),W}function f(b){const L=[],V=[],G=[];for(let Z=0;Z<t;Z++)L[Z]=0,V[Z]=0,G[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:V,attributeDivisors:G,object:b,attributes:{},index:null}}function _(b,L,V,G){const Z=o.attributes,$=L.attributes;let W=0;const J=V.getAttributes();for(const M in J)if(J[M].location>=0){const he=Z[M];let ye=$[M];if(ye===void 0&&(M==="instanceMatrix"&&b.instanceMatrix&&(ye=b.instanceMatrix),M==="instanceColor"&&b.instanceColor&&(ye=b.instanceColor)),he===void 0||he.attribute!==ye||ye&&he.data!==ye.data)return!0;W++}return o.attributesNum!==W||o.index!==G}function v(b,L,V,G){const Z={},$=L.attributes;let W=0;const J=V.getAttributes();for(const M in J)if(J[M].location>=0){let he=$[M];he===void 0&&(M==="instanceMatrix"&&b.instanceMatrix&&(he=b.instanceMatrix),M==="instanceColor"&&b.instanceColor&&(he=b.instanceColor));const ye={};ye.attribute=he,he&&he.data&&(ye.data=he.data),Z[M]=ye,W++}o.attributes=Z,o.attributesNum=W,o.index=G}function x(){const b=o.newAttributes;for(let L=0,V=b.length;L<V;L++)b[L]=0}function m(b){h(b,0)}function h(b,L){const V=o.newAttributes,G=o.enabledAttributes,Z=o.attributeDivisors;V[b]=1,G[b]===0&&(n.enableVertexAttribArray(b),G[b]=1),Z[b]!==L&&(n.vertexAttribDivisor(b,L),Z[b]=L)}function A(){const b=o.newAttributes,L=o.enabledAttributes;for(let V=0,G=L.length;V<G;V++)L[V]!==b[V]&&(n.disableVertexAttribArray(V),L[V]=0)}function g(b,L,V,G,Z,$,W){W===!0?n.vertexAttribIPointer(b,L,V,Z,$):n.vertexAttribPointer(b,L,V,G,Z,$)}function E(b,L,V,G){x();const Z=G.attributes,$=V.getAttributes(),W=L.defaultAttributeValues;for(const J in $){const M=$[J];if(M.location>=0){let ie=Z[J];if(ie===void 0&&(J==="instanceMatrix"&&b.instanceMatrix&&(ie=b.instanceMatrix),J==="instanceColor"&&b.instanceColor&&(ie=b.instanceColor)),ie!==void 0){const he=ie.normalized,ye=ie.itemSize,ke=e.get(ie);if(ke===void 0)continue;const et=ke.buffer,q=ke.type,ne=ke.bytesPerElement,Se=q===n.INT||q===n.UNSIGNED_INT||ie.gpuType===Sa;if(ie.isInterleavedBufferAttribute){const se=ie.data,Ae=se.stride,Ye=ie.offset;if(se.isInstancedInterleavedBuffer){for(let Re=0;Re<M.locationSize;Re++)h(M.location+Re,se.meshPerAttribute);b.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let Re=0;Re<M.locationSize;Re++)m(M.location+Re);n.bindBuffer(n.ARRAY_BUFFER,et);for(let Re=0;Re<M.locationSize;Re++)g(M.location+Re,ye/M.locationSize,q,he,Ae*ne,(Ye+ye/M.locationSize*Re)*ne,Se)}else{if(ie.isInstancedBufferAttribute){for(let se=0;se<M.locationSize;se++)h(M.location+se,ie.meshPerAttribute);b.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let se=0;se<M.locationSize;se++)m(M.location+se);n.bindBuffer(n.ARRAY_BUFFER,et);for(let se=0;se<M.locationSize;se++)g(M.location+se,ye/M.locationSize,q,he,ye*ne,ye/M.locationSize*se*ne,Se)}}else if(W!==void 0){const he=W[J];if(he!==void 0)switch(he.length){case 2:n.vertexAttrib2fv(M.location,he);break;case 3:n.vertexAttrib3fv(M.location,he);break;case 4:n.vertexAttrib4fv(M.location,he);break;default:n.vertexAttrib1fv(M.location,he)}}}}A()}function I(){p();for(const b in i){const L=i[b];for(const V in L){const G=L[V];for(const Z in G)d(G[Z].object),delete G[Z];delete L[V]}delete i[b]}}function R(b){if(i[b.id]===void 0)return;const L=i[b.id];for(const V in L){const G=L[V];for(const Z in G)d(G[Z].object),delete G[Z];delete L[V]}delete i[b.id]}function P(b){for(const L in i){const V=i[L];if(V[b.id]===void 0)continue;const G=V[b.id];for(const Z in G)d(G[Z].object),delete G[Z];delete V[b.id]}}function p(){T(),s=!0,o!==r&&(o=r,c(o.object))}function T(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:p,resetDefaultState:T,dispose:I,releaseStatesOfGeometry:R,releaseStatesOfProgram:P,initAttributes:x,enableAttribute:m,disableUnusedAttributes:A}}function x_(n,e,t){let i;function r(c){i=c}function o(c,d){n.drawArrays(i,c,d),t.update(d,i,1)}function s(c,d,u){u!==0&&(n.drawArraysInstanced(i,c,d,u),t.update(d,i,u))}function a(c,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,u);let _=0;for(let v=0;v<u;v++)_+=d[v];t.update(_,i,1)}function l(c,d,u,f){if(u===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let v=0;v<c.length;v++)s(c[v],d[v],f[v]);else{_.multiDrawArraysInstancedWEBGL(i,c,0,d,0,f,0,u);let v=0;for(let x=0;x<u;x++)v+=d[x]*f[x];t.update(v,i,1)}}this.setMode=r,this.render=o,this.renderInstances=s,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function S_(n,e,t,i){let r;function o(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function s(P){return!(P!==en&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(P){const p=P===bn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==Mn&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==xn&&!p)}function l(P){if(P==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const u=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),_=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),h=n.getParameter(n.MAX_VERTEX_ATTRIBS),A=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),g=n.getParameter(n.MAX_VARYING_VECTORS),E=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),I=v>0,R=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:_,maxVertexTextures:v,maxTextureSize:x,maxCubemapSize:m,maxAttributes:h,maxVertexUniforms:A,maxVaryings:g,maxFragmentUniforms:E,vertexTextures:I,maxSamples:R}}function y_(n){const e=this;let t=null,i=0,r=!1,o=!1;const s=new In,a=new Ne,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const _=u.length!==0||f||i!==0||r;return r=f,i=u.length,_},this.beginShadows=function(){o=!0,d(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,f){t=d(u,f,0)},this.setState=function(u,f,_){const v=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,h=n.get(u);if(!r||v===null||v.length===0||o&&!m)o?d(null):c();else{const A=o?0:i,g=A*4;let E=h.clippingState||null;l.value=E,E=d(v,f,g,_);for(let I=0;I!==g;++I)E[I]=t[I];h.clippingState=E,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(u,f,_,v){const x=u!==null?u.length:0;let m=null;if(x!==0){if(m=l.value,v!==!0||m===null){const h=_+x*4,A=f.matrixWorldInverse;a.getNormalMatrix(A),(m===null||m.length<h)&&(m=new Float32Array(h));for(let g=0,E=_;g!==x;++g,E+=4)s.copy(u[g]).applyMatrix4(A,a),s.normal.toArray(m,E),m[E+3]=s.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function b_(n){let e=new WeakMap;function t(s,a){return a===Ts?s.mapping=Fi:a===ws&&(s.mapping=ki),s}function i(s){if(s&&s.isTexture){const a=s.mapping;if(a===Ts||a===ws)if(e.has(s)){const l=e.get(s).texture;return t(l,s.mapping)}else{const l=s.image;if(l&&l.height>0){const c=new vh(l.height);return c.fromEquirectangularTexture(n,s),e.set(s,c),s.addEventListener("dispose",r),t(c.texture,s.mapping)}else return null}}return s}function r(s){const a=s.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function o(){e=new WeakMap}return{get:i,dispose:o}}const Ri=4,Al=[.125,.215,.35,.446,.526,.582],ti=20,Zo=new Ia,Cl=new fe;let $o=null,Jo=0,Qo=0,es=!1;const Jn=(1+Math.sqrt(5))/2,Mi=1/Jn,Rl=[new D(-Jn,Mi,0),new D(Jn,Mi,0),new D(-Mi,0,Jn),new D(Mi,0,Jn),new D(0,Jn,-Mi),new D(0,Jn,Mi),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],E_=new D;class Pl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100,o={}){const{size:s=256,position:a=E_}=o;$o=this._renderer.getRenderTarget(),Jo=this._renderer.getActiveCubeFace(),Qo=this._renderer.getActiveMipmapLevel(),es=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(s);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Il(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ll(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget($o,Jo,Qo),this._renderer.xr.enabled=es,e.scissorTest=!1,zr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Fi||e.mapping===ki?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),$o=this._renderer.getRenderTarget(),Jo=this._renderer.getActiveCubeFace(),Qo=this._renderer.getActiveMipmapLevel(),es=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ln,minFilter:ln,generateMipmaps:!1,type:bn,format:en,colorSpace:Bi,depthBuffer:!1},r=Dl(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Dl(e,t,i);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=M_(o)),this._blurMaterial=T_(o,e,t)}return r}_compileMaterial(e){const t=new Nt(this._lodPlanes[0],e);this._renderer.compile(t,Zo)}_sceneToCubeUV(e,t,i,r,o){const l=new Bt(90,1,t,i),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,_=u.toneMapping;u.getClearColor(Cl),u.toneMapping=kn,u.autoClear=!1;const v=new go({name:"PMREM.Background",side:Rt,depthWrite:!1,depthTest:!1}),x=new Nt(new Hi,v);let m=!1;const h=e.background;h?h.isColor&&(v.color.copy(h),e.background=null,m=!0):(v.color.copy(Cl),m=!0);for(let A=0;A<6;A++){const g=A%3;g===0?(l.up.set(0,c[A],0),l.position.set(o.x,o.y,o.z),l.lookAt(o.x+d[A],o.y,o.z)):g===1?(l.up.set(0,0,c[A]),l.position.set(o.x,o.y,o.z),l.lookAt(o.x,o.y+d[A],o.z)):(l.up.set(0,c[A],0),l.position.set(o.x,o.y,o.z),l.lookAt(o.x,o.y,o.z+d[A]));const E=this._cubeSize;zr(r,g*E,A>2?E:0,E,E),u.setRenderTarget(r),m&&u.render(x,l),u.render(e,l)}x.geometry.dispose(),x.material.dispose(),u.toneMapping=_,u.autoClear=f,e.background=h}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Fi||e.mapping===ki;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Il()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ll());const o=r?this._cubemapMaterial:this._equirectMaterial,s=new Nt(this._lodPlanes[0],o),a=o.uniforms;a.envMap.value=e;const l=this._cubeSize;zr(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(s,Zo)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let o=1;o<r;o++){const s=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),a=Rl[(r-o-1)%Rl.length];this._blur(e,o-1,o,s,a)}t.autoClear=i}_blur(e,t,i,r,o){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,i,r,"latitudinal",o),this._halfBlur(s,e,i,i,r,"longitudinal",o)}_halfBlur(e,t,i,r,o,s,a){const l=this._renderer,c=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new Nt(this._lodPlanes[r],c),f=c.uniforms,_=this._sizeLods[i]-1,v=isFinite(o)?Math.PI/(2*_):2*Math.PI/(2*ti-1),x=o/v,m=isFinite(o)?1+Math.floor(d*x):ti;m>ti&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ti}`);const h=[];let A=0;for(let P=0;P<ti;++P){const p=P/x,T=Math.exp(-p*p/2);h.push(T),P===0?A+=T:P<m&&(A+=2*T)}for(let P=0;P<h.length;P++)h[P]=h[P]/A;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=h,f.latitudinal.value=s==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:g}=this;f.dTheta.value=v,f.mipInt.value=g-i;const E=this._sizeLods[r],I=3*E*(r>g-Ri?r-g+Ri:0),R=4*(this._cubeSize-E);zr(t,I,R,3*E,2*E),l.setRenderTarget(t),l.render(u,Zo)}}function M_(n){const e=[],t=[],i=[];let r=n;const o=n-Ri+1+Al.length;for(let s=0;s<o;s++){const a=Math.pow(2,r);t.push(a);let l=1/a;s>n-Ri?l=Al[s-n+Ri-1]:s===0&&(l=0),i.push(l);const c=1/(a-2),d=-c,u=1+c,f=[d,d,u,d,u,u,d,d,u,u,d,u],_=6,v=6,x=3,m=2,h=1,A=new Float32Array(x*v*_),g=new Float32Array(m*v*_),E=new Float32Array(h*v*_);for(let R=0;R<_;R++){const P=R%3*2/3-1,p=R>2?0:-1,T=[P,p,0,P+2/3,p,0,P+2/3,p+1,0,P,p,0,P+2/3,p+1,0,P,p+1,0];A.set(T,x*v*R),g.set(f,m*v*R);const b=[R,R,R,R,R,R];E.set(b,h*v*R)}const I=new Gt;I.setAttribute("position",new dt(A,x)),I.setAttribute("uv",new dt(g,m)),I.setAttribute("faceIndex",new dt(E,h)),e.push(I),r>Ri&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Dl(n,e,t){const i=new zt(n,e,t);return i.texture.mapping=po,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function zr(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function T_(n,e,t){const i=new Float32Array(ti),r=new D(0,1,0);return new at({name:"SphericalGaussianBlur",defines:{n:ti,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Na(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function Ll(){return new at({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Na(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function Il(){return new at({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Na(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function Na(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function w_(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===Ts||l===ws,d=l===Fi||l===ki;if(c||d){let u=e.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new Pl(n)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{const _=a.image;return c&&_&&_.height>0||d&&_&&r(_)?(t===null&&(t=new Pl(n)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",o),u.texture):null}}}return a}function r(a){let l=0;const c=6;for(let d=0;d<c;d++)a[d]!==void 0&&l++;return l===c}function o(a){const l=a.target;l.removeEventListener("dispose",o);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:s}}function A_(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&eo("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function C_(n,e,t,i){const r={},o=new WeakMap;function s(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const v in f.attributes)e.remove(f.attributes[v]);f.removeEventListener("dispose",s),delete r[f.id];const _=o.get(f);_&&(e.remove(_),o.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return r[f.id]===!0||(f.addEventListener("dispose",s),r[f.id]=!0,t.memory.geometries++),f}function l(u){const f=u.attributes;for(const _ in f)e.update(f[_],n.ARRAY_BUFFER)}function c(u){const f=[],_=u.index,v=u.attributes.position;let x=0;if(_!==null){const A=_.array;x=_.version;for(let g=0,E=A.length;g<E;g+=3){const I=A[g+0],R=A[g+1],P=A[g+2];f.push(I,R,R,P,P,I)}}else if(v!==void 0){const A=v.array;x=v.version;for(let g=0,E=A.length/3-1;g<E;g+=3){const I=g+0,R=g+1,P=g+2;f.push(I,R,R,P,P,I)}}else return;const m=new(Jc(f)?nu:tu)(f,1);m.version=x;const h=o.get(u);h&&e.remove(h),o.set(u,m)}function d(u){const f=o.get(u);if(f){const _=u.index;_!==null&&f.version<_.version&&c(u)}else c(u);return o.get(u)}return{get:a,update:l,getWireframeAttribute:d}}function R_(n,e,t){let i;function r(f){i=f}let o,s;function a(f){o=f.type,s=f.bytesPerElement}function l(f,_){n.drawElements(i,_,o,f*s),t.update(_,i,1)}function c(f,_,v){v!==0&&(n.drawElementsInstanced(i,_,o,f*s,v),t.update(_,i,v))}function d(f,_,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,_,0,o,f,0,v);let m=0;for(let h=0;h<v;h++)m+=_[h];t.update(m,i,1)}function u(f,_,v,x){if(v===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let h=0;h<f.length;h++)c(f[h]/s,_[h],x[h]);else{m.multiDrawElementsInstancedWEBGL(i,_,0,o,f,0,x,0,v);let h=0;for(let A=0;A<v;A++)h+=_[A]*x[A];t.update(h,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function P_(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,s,a){switch(t.calls++,s){case n.TRIANGLES:t.triangles+=a*(o/3);break;case n.LINES:t.lines+=a*(o/2);break;case n.LINE_STRIP:t.lines+=a*(o-1);break;case n.LINE_LOOP:t.lines+=a*o;break;case n.POINTS:t.points+=a*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function D_(n,e,t){const i=new WeakMap,r=new Qe;function o(s,a,l){const c=s.morphTargetInfluences,d=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=d!==void 0?d.length:0;let f=i.get(a);if(f===void 0||f.count!==u){let b=function(){p.dispose(),i.delete(a),a.removeEventListener("dispose",b)};var _=b;f!==void 0&&f.texture.dispose();const v=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,h=a.morphAttributes.position||[],A=a.morphAttributes.normal||[],g=a.morphAttributes.color||[];let E=0;v===!0&&(E=1),x===!0&&(E=2),m===!0&&(E=3);let I=a.attributes.position.count*E,R=1;I>e.maxTextureSize&&(R=Math.ceil(I/e.maxTextureSize),I=e.maxTextureSize);const P=new Float32Array(I*R*4*u),p=new Qc(P,I,R,u);p.type=xn,p.needsUpdate=!0;const T=E*4;for(let L=0;L<u;L++){const V=h[L],G=A[L],Z=g[L],$=I*R*4*L;for(let W=0;W<V.count;W++){const J=W*T;v===!0&&(r.fromBufferAttribute(V,W),P[$+J+0]=r.x,P[$+J+1]=r.y,P[$+J+2]=r.z,P[$+J+3]=0),x===!0&&(r.fromBufferAttribute(G,W),P[$+J+4]=r.x,P[$+J+5]=r.y,P[$+J+6]=r.z,P[$+J+7]=0),m===!0&&(r.fromBufferAttribute(Z,W),P[$+J+8]=r.x,P[$+J+9]=r.y,P[$+J+10]=r.z,P[$+J+11]=Z.itemSize===4?r.w:1)}}f={count:u,texture:p,size:new xe(I,R)},i.set(a,f),a.addEventListener("dispose",b)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",s.morphTexture,t);else{let v=0;for(let m=0;m<c.length;m++)v+=c[m];const x=a.morphTargetsRelative?1:1-v;l.getUniforms().setValue(n,"morphTargetBaseInfluence",x),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:o}}function L_(n,e,t,i){let r=new WeakMap;function o(l){const c=i.render.frame,d=l.geometry,u=e.get(l,d);if(r.get(u)!==c&&(e.update(u),r.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return u}function s(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:o,dispose:s}}const uu=new Ut,Nl=new Ra(1,1),du=new Qc,hu=new nh,fu=new ou,Ul=[],Ol=[],Fl=new Float32Array(16),kl=new Float32Array(9),Bl=new Float32Array(4);function Vi(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let o=Ul[r];if(o===void 0&&(o=new Float32Array(r),Ul[r]=o),e!==0){i.toArray(o,0);for(let s=1,a=0;s!==e;++s)a+=t,n[s].toArray(o,a)}return o}function vt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function xt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function vo(n,e){let t=Ol[e];t===void 0&&(t=new Int32Array(e),Ol[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function I_(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function N_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;n.uniform2fv(this.addr,e),xt(t,e)}}function U_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(vt(t,e))return;n.uniform3fv(this.addr,e),xt(t,e)}}function O_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;n.uniform4fv(this.addr,e),xt(t,e)}}function F_(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),xt(t,e)}else{if(vt(t,i))return;Bl.set(i),n.uniformMatrix2fv(this.addr,!1,Bl),xt(t,i)}}function k_(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),xt(t,e)}else{if(vt(t,i))return;kl.set(i),n.uniformMatrix3fv(this.addr,!1,kl),xt(t,i)}}function B_(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),xt(t,e)}else{if(vt(t,i))return;Fl.set(i),n.uniformMatrix4fv(this.addr,!1,Fl),xt(t,i)}}function z_(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function G_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;n.uniform2iv(this.addr,e),xt(t,e)}}function H_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vt(t,e))return;n.uniform3iv(this.addr,e),xt(t,e)}}function V_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;n.uniform4iv(this.addr,e),xt(t,e)}}function W_(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function X_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;n.uniform2uiv(this.addr,e),xt(t,e)}}function q_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vt(t,e))return;n.uniform3uiv(this.addr,e),xt(t,e)}}function Y_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;n.uniform4uiv(this.addr,e),xt(t,e)}}function K_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let o;this.type===n.SAMPLER_2D_SHADOW?(Nl.compareFunction=$c,o=Nl):o=uu,t.setTexture2D(e||o,r)}function j_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||hu,r)}function Z_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||fu,r)}function $_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||du,r)}function J_(n){switch(n){case 5126:return I_;case 35664:return N_;case 35665:return U_;case 35666:return O_;case 35674:return F_;case 35675:return k_;case 35676:return B_;case 5124:case 35670:return z_;case 35667:case 35671:return G_;case 35668:case 35672:return H_;case 35669:case 35673:return V_;case 5125:return W_;case 36294:return X_;case 36295:return q_;case 36296:return Y_;case 35678:case 36198:case 36298:case 36306:case 35682:return K_;case 35679:case 36299:case 36307:return j_;case 35680:case 36300:case 36308:case 36293:return Z_;case 36289:case 36303:case 36311:case 36292:return $_}}function Q_(n,e){n.uniform1fv(this.addr,e)}function em(n,e){const t=Vi(e,this.size,2);n.uniform2fv(this.addr,t)}function tm(n,e){const t=Vi(e,this.size,3);n.uniform3fv(this.addr,t)}function nm(n,e){const t=Vi(e,this.size,4);n.uniform4fv(this.addr,t)}function im(n,e){const t=Vi(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function rm(n,e){const t=Vi(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function om(n,e){const t=Vi(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function sm(n,e){n.uniform1iv(this.addr,e)}function am(n,e){n.uniform2iv(this.addr,e)}function lm(n,e){n.uniform3iv(this.addr,e)}function cm(n,e){n.uniform4iv(this.addr,e)}function um(n,e){n.uniform1uiv(this.addr,e)}function dm(n,e){n.uniform2uiv(this.addr,e)}function hm(n,e){n.uniform3uiv(this.addr,e)}function fm(n,e){n.uniform4uiv(this.addr,e)}function pm(n,e,t){const i=this.cache,r=e.length,o=vo(t,r);vt(i,o)||(n.uniform1iv(this.addr,o),xt(i,o));for(let s=0;s!==r;++s)t.setTexture2D(e[s]||uu,o[s])}function _m(n,e,t){const i=this.cache,r=e.length,o=vo(t,r);vt(i,o)||(n.uniform1iv(this.addr,o),xt(i,o));for(let s=0;s!==r;++s)t.setTexture3D(e[s]||hu,o[s])}function mm(n,e,t){const i=this.cache,r=e.length,o=vo(t,r);vt(i,o)||(n.uniform1iv(this.addr,o),xt(i,o));for(let s=0;s!==r;++s)t.setTextureCube(e[s]||fu,o[s])}function gm(n,e,t){const i=this.cache,r=e.length,o=vo(t,r);vt(i,o)||(n.uniform1iv(this.addr,o),xt(i,o));for(let s=0;s!==r;++s)t.setTexture2DArray(e[s]||du,o[s])}function vm(n){switch(n){case 5126:return Q_;case 35664:return em;case 35665:return tm;case 35666:return nm;case 35674:return im;case 35675:return rm;case 35676:return om;case 5124:case 35670:return sm;case 35667:case 35671:return am;case 35668:case 35672:return lm;case 35669:case 35673:return cm;case 5125:return um;case 36294:return dm;case 36295:return hm;case 36296:return fm;case 35678:case 36198:case 36298:case 36306:case 35682:return pm;case 35679:case 36299:case 36307:return _m;case 35680:case 36300:case 36308:case 36293:return mm;case 36289:case 36303:case 36311:case 36292:return gm}}class xm{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=J_(t.type)}}class Sm{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=vm(t.type)}}class ym{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let o=0,s=r.length;o!==s;++o){const a=r[o];a.setValue(e,t[a.id],i)}}}const ts=/(\w+)(\])?(\[|\.)?/g;function zl(n,e){n.seq.push(e),n.map[e.id]=e}function bm(n,e,t){const i=n.name,r=i.length;for(ts.lastIndex=0;;){const o=ts.exec(i),s=ts.lastIndex;let a=o[1];const l=o[2]==="]",c=o[3];if(l&&(a=a|0),c===void 0||c==="["&&s+2===r){zl(t,c===void 0?new xm(a,n,e):new Sm(a,n,e));break}else{let u=t.map[a];u===void 0&&(u=new ym(a),zl(t,u)),t=u}}}class to{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const o=e.getActiveUniform(t,r),s=e.getUniformLocation(t,o.name);bm(o,s,this)}}setValue(e,t,i,r){const o=this.map[t];o!==void 0&&o.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let o=0,s=t.length;o!==s;++o){const a=t[o],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,o=e.length;r!==o;++r){const s=e[r];s.id in t&&i.push(s)}return i}}function Gl(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Em=37297;let Mm=0;function Tm(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),o=Math.min(e+6,t.length);for(let s=r;s<o;s++){const a=s+1;i.push(`${a===e?">":" "} ${a}: ${t[s]}`)}return i.join(`
`)}const Hl=new Ne;function wm(n){qe._getMatrix(Hl,qe.workingColorSpace,n);const e=`mat3( ${Hl.elements.map(t=>t.toFixed(4))} )`;switch(qe.getTransfer(n)){case ro:return[e,"LinearTransferOETF"];case $e:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Vl(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const s=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Tm(n.getShaderSource(e),s)}else return r}function Am(n,e){const t=wm(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Cm(n,e){let t;switch(e){case Ad:t="Linear";break;case Bc:t="Reinhard";break;case Cd:t="Cineon";break;case Rd:t="ACESFilmic";break;case Dd:t="AgX";break;case Ld:t="Neutral";break;case Pd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Gr=new D;function Rm(){qe.getLuminanceCoefficients(Gr);const n=Gr.x.toFixed(4),e=Gr.y.toFixed(4),t=Gr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Pm(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(tr).join(`
`)}function Dm(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Lm(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const o=n.getActiveAttrib(e,r),s=o.name;let a=1;o.type===n.FLOAT_MAT2&&(a=2),o.type===n.FLOAT_MAT3&&(a=3),o.type===n.FLOAT_MAT4&&(a=4),t[s]={type:o.type,location:n.getAttribLocation(e,s),locationSize:a}}return t}function tr(n){return n!==""}function Wl(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Xl(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Im=/^[ \t]*#include +<([\w\d./]+)>/gm;function oa(n){return n.replace(Im,Um)}const Nm=new Map;function Um(n,e){let t=Oe[e];if(t===void 0){const i=Nm.get(e);if(i!==void 0)t=Oe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return oa(t)}const Om=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ql(n){return n.replace(Om,Fm)}function Fm(n,e,t,i){let r="";for(let o=parseInt(e);o<parseInt(t);o++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return r}function Yl(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function km(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Oc?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Fc?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===mn&&(e="SHADOWMAP_TYPE_VSM"),e}function Bm(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Fi:case ki:e="ENVMAP_TYPE_CUBE";break;case po:e="ENVMAP_TYPE_CUBE_UV";break}return e}function zm(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ki:e="ENVMAP_MODE_REFRACTION";break}return e}function Gm(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case kc:e="ENVMAP_BLENDING_MULTIPLY";break;case Td:e="ENVMAP_BLENDING_MIX";break;case wd:e="ENVMAP_BLENDING_ADD";break}return e}function Hm(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Vm(n,e,t,i){const r=n.getContext(),o=t.defines;let s=t.vertexShader,a=t.fragmentShader;const l=km(t),c=Bm(t),d=zm(t),u=Gm(t),f=Hm(t),_=Pm(t),v=Dm(o),x=r.createProgram();let m,h,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(tr).join(`
`),m.length>0&&(m+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(tr).join(`
`),h.length>0&&(h+=`
`)):(m=[Yl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(tr).join(`
`),h=[Yl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==kn?"#define TONE_MAPPING":"",t.toneMapping!==kn?Oe.tonemapping_pars_fragment:"",t.toneMapping!==kn?Cm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,Am("linearToOutputTexel",t.outputColorSpace),Rm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(tr).join(`
`)),s=oa(s),s=Wl(s,t),s=Xl(s,t),a=oa(a),a=Wl(a,t),a=Xl(a,t),s=ql(s),a=ql(a),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,m=[_,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,h=["#define varying in",t.glslVersion===ta?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ta?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const g=A+m+s,E=A+h+a,I=Gl(r,r.VERTEX_SHADER,g),R=Gl(r,r.FRAGMENT_SHADER,E);r.attachShader(x,I),r.attachShader(x,R),t.index0AttributeName!==void 0?r.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function P(L){if(n.debug.checkShaderErrors){const V=r.getProgramInfoLog(x).trim(),G=r.getShaderInfoLog(I).trim(),Z=r.getShaderInfoLog(R).trim();let $=!0,W=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,x,I,R);else{const J=Vl(r,I,"vertex"),M=Vl(r,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+V+`
`+J+`
`+M)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(G===""||Z==="")&&(W=!1);W&&(L.diagnostics={runnable:$,programLog:V,vertexShader:{log:G,prefix:m},fragmentShader:{log:Z,prefix:h}})}r.deleteShader(I),r.deleteShader(R),p=new to(r,x),T=Lm(r,x)}let p;this.getUniforms=function(){return p===void 0&&P(this),p};let T;this.getAttributes=function(){return T===void 0&&P(this),T};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=r.getProgramParameter(x,Em)),b},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Mm++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=I,this.fragmentShader=R,this}let Wm=0;class Xm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),o=this._getShaderStage(i),s=this._getShaderCacheForMaterial(e);return s.has(r)===!1&&(s.add(r),r.usedTimes++),s.has(o)===!1&&(s.add(o),o.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new qm(e),t.set(e,i)),i}}class qm{constructor(e){this.id=Wm++,this.code=e,this.usedTimes=0}}function Ym(n,e,t,i,r,o,s){const a=new Aa,l=new Xm,c=new Set,d=[],u=r.logarithmicDepthBuffer,f=r.vertexTextures;let _=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(T){return c.add(T),T===0?"uv":`uv${T}`}function m(T,b,L,V,G){const Z=V.fog,$=G.geometry,W=T.isMeshStandardMaterial?V.environment:null,J=(T.isMeshStandardMaterial?t:e).get(T.envMap||W),M=J&&J.mapping===po?J.image.height:null,ie=v[T.type];T.precision!==null&&(_=r.getMaxPrecision(T.precision),_!==T.precision&&console.warn("THREE.WebGLProgram.getParameters:",T.precision,"not supported, using",_,"instead."));const he=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,ye=he!==void 0?he.length:0;let ke=0;$.morphAttributes.position!==void 0&&(ke=1),$.morphAttributes.normal!==void 0&&(ke=2),$.morphAttributes.color!==void 0&&(ke=3);let et,q,ne,Se;if(ie){const Ze=sn[ie];et=Ze.vertexShader,q=Ze.fragmentShader}else et=T.vertexShader,q=T.fragmentShader,l.update(T),ne=l.getVertexShaderID(T),Se=l.getFragmentShaderID(T);const se=n.getRenderTarget(),Ae=n.state.buffers.depth.getReversed(),Ye=G.isInstancedMesh===!0,Re=G.isBatchedMesh===!0,ht=!!T.map,st=!!T.matcap,Be=!!J,C=!!T.aoMap,Ht=!!T.lightMap,He=!!T.bumpMap,ze=!!T.normalMap,Me=!!T.displacementMap,rt=!!T.emissiveMap,Ee=!!T.metalnessMap,w=!!T.roughnessMap,S=T.anisotropy>0,F=T.clearcoat>0,K=T.dispersion>0,Q=T.iridescence>0,X=T.sheen>0,be=T.transmission>0,ae=S&&!!T.anisotropyMap,_e=F&&!!T.clearcoatMap,Ve=F&&!!T.clearcoatNormalMap,te=F&&!!T.clearcoatRoughnessMap,me=Q&&!!T.iridescenceMap,Ce=Q&&!!T.iridescenceThicknessMap,De=X&&!!T.sheenColorMap,ge=X&&!!T.sheenRoughnessMap,Ge=!!T.specularMap,Ue=!!T.specularColorMap,tt=!!T.specularIntensityMap,N=be&&!!T.transmissionMap,le=be&&!!T.thicknessMap,H=!!T.gradientMap,j=!!T.alphaMap,ue=T.alphaTest>0,ce=!!T.alphaHash,Ie=!!T.extensions;let lt=kn;T.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(lt=n.toneMapping);const Mt={shaderID:ie,shaderType:T.type,shaderName:T.name,vertexShader:et,fragmentShader:q,defines:T.defines,customVertexShaderID:ne,customFragmentShaderID:Se,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:_,batching:Re,batchingColor:Re&&G._colorsTexture!==null,instancing:Ye,instancingColor:Ye&&G.instanceColor!==null,instancingMorph:Ye&&G.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:se===null?n.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:Bi,alphaToCoverage:!!T.alphaToCoverage,map:ht,matcap:st,envMap:Be,envMapMode:Be&&J.mapping,envMapCubeUVHeight:M,aoMap:C,lightMap:Ht,bumpMap:He,normalMap:ze,displacementMap:f&&Me,emissiveMap:rt,normalMapObjectSpace:ze&&T.normalMapType===Fd,normalMapTangentSpace:ze&&T.normalMapType===Od,metalnessMap:Ee,roughnessMap:w,anisotropy:S,anisotropyMap:ae,clearcoat:F,clearcoatMap:_e,clearcoatNormalMap:Ve,clearcoatRoughnessMap:te,dispersion:K,iridescence:Q,iridescenceMap:me,iridescenceThicknessMap:Ce,sheen:X,sheenColorMap:De,sheenRoughnessMap:ge,specularMap:Ge,specularColorMap:Ue,specularIntensityMap:tt,transmission:be,transmissionMap:N,thicknessMap:le,gradientMap:H,opaque:T.transparent===!1&&T.blending===Li&&T.alphaToCoverage===!1,alphaMap:j,alphaTest:ue,alphaHash:ce,combine:T.combine,mapUv:ht&&x(T.map.channel),aoMapUv:C&&x(T.aoMap.channel),lightMapUv:Ht&&x(T.lightMap.channel),bumpMapUv:He&&x(T.bumpMap.channel),normalMapUv:ze&&x(T.normalMap.channel),displacementMapUv:Me&&x(T.displacementMap.channel),emissiveMapUv:rt&&x(T.emissiveMap.channel),metalnessMapUv:Ee&&x(T.metalnessMap.channel),roughnessMapUv:w&&x(T.roughnessMap.channel),anisotropyMapUv:ae&&x(T.anisotropyMap.channel),clearcoatMapUv:_e&&x(T.clearcoatMap.channel),clearcoatNormalMapUv:Ve&&x(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:te&&x(T.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&x(T.iridescenceMap.channel),iridescenceThicknessMapUv:Ce&&x(T.iridescenceThicknessMap.channel),sheenColorMapUv:De&&x(T.sheenColorMap.channel),sheenRoughnessMapUv:ge&&x(T.sheenRoughnessMap.channel),specularMapUv:Ge&&x(T.specularMap.channel),specularColorMapUv:Ue&&x(T.specularColorMap.channel),specularIntensityMapUv:tt&&x(T.specularIntensityMap.channel),transmissionMapUv:N&&x(T.transmissionMap.channel),thicknessMapUv:le&&x(T.thicknessMap.channel),alphaMapUv:j&&x(T.alphaMap.channel),vertexTangents:!!$.attributes.tangent&&(ze||S),vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!$.attributes.uv&&(ht||j),fog:!!Z,useFog:T.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:T.flatShading===!0,sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Ae,skinning:G.isSkinnedMesh===!0,morphTargets:$.morphAttributes.position!==void 0,morphNormals:$.morphAttributes.normal!==void 0,morphColors:$.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:ke,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:T.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:lt,decodeVideoTexture:ht&&T.map.isVideoTexture===!0&&qe.getTransfer(T.map.colorSpace)===$e,decodeVideoTextureEmissive:rt&&T.emissiveMap.isVideoTexture===!0&&qe.getTransfer(T.emissiveMap.colorSpace)===$e,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===Jt,flipSided:T.side===Rt,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:Ie&&T.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ie&&T.extensions.multiDraw===!0||Re)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return Mt.vertexUv1s=c.has(1),Mt.vertexUv2s=c.has(2),Mt.vertexUv3s=c.has(3),c.clear(),Mt}function h(T){const b=[];if(T.shaderID?b.push(T.shaderID):(b.push(T.customVertexShaderID),b.push(T.customFragmentShaderID)),T.defines!==void 0)for(const L in T.defines)b.push(L),b.push(T.defines[L]);return T.isRawShaderMaterial===!1&&(A(b,T),g(b,T),b.push(n.outputColorSpace)),b.push(T.customProgramCacheKey),b.join()}function A(T,b){T.push(b.precision),T.push(b.outputColorSpace),T.push(b.envMapMode),T.push(b.envMapCubeUVHeight),T.push(b.mapUv),T.push(b.alphaMapUv),T.push(b.lightMapUv),T.push(b.aoMapUv),T.push(b.bumpMapUv),T.push(b.normalMapUv),T.push(b.displacementMapUv),T.push(b.emissiveMapUv),T.push(b.metalnessMapUv),T.push(b.roughnessMapUv),T.push(b.anisotropyMapUv),T.push(b.clearcoatMapUv),T.push(b.clearcoatNormalMapUv),T.push(b.clearcoatRoughnessMapUv),T.push(b.iridescenceMapUv),T.push(b.iridescenceThicknessMapUv),T.push(b.sheenColorMapUv),T.push(b.sheenRoughnessMapUv),T.push(b.specularMapUv),T.push(b.specularColorMapUv),T.push(b.specularIntensityMapUv),T.push(b.transmissionMapUv),T.push(b.thicknessMapUv),T.push(b.combine),T.push(b.fogExp2),T.push(b.sizeAttenuation),T.push(b.morphTargetsCount),T.push(b.morphAttributeCount),T.push(b.numDirLights),T.push(b.numPointLights),T.push(b.numSpotLights),T.push(b.numSpotLightMaps),T.push(b.numHemiLights),T.push(b.numRectAreaLights),T.push(b.numDirLightShadows),T.push(b.numPointLightShadows),T.push(b.numSpotLightShadows),T.push(b.numSpotLightShadowsWithMaps),T.push(b.numLightProbes),T.push(b.shadowMapType),T.push(b.toneMapping),T.push(b.numClippingPlanes),T.push(b.numClipIntersection),T.push(b.depthPacking)}function g(T,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),T.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reverseDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),T.push(a.mask)}function E(T){const b=v[T.type];let L;if(b){const V=sn[b];L=ao.clone(V.uniforms)}else L=T.uniforms;return L}function I(T,b){let L;for(let V=0,G=d.length;V<G;V++){const Z=d[V];if(Z.cacheKey===b){L=Z,++L.usedTimes;break}}return L===void 0&&(L=new Vm(n,b,T,o),d.push(L)),L}function R(T){if(--T.usedTimes===0){const b=d.indexOf(T);d[b]=d[d.length-1],d.pop(),T.destroy()}}function P(T){l.remove(T)}function p(){l.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:E,acquireProgram:I,releaseProgram:R,releaseShaderCache:P,programs:d,dispose:p}}function Km(){let n=new WeakMap;function e(s){return n.has(s)}function t(s){let a=n.get(s);return a===void 0&&(a={},n.set(s,a)),a}function i(s){n.delete(s)}function r(s,a,l){n.get(s)[a]=l}function o(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:o}}function jm(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Kl(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function jl(){const n=[];let e=0;const t=[],i=[],r=[];function o(){e=0,t.length=0,i.length=0,r.length=0}function s(u,f,_,v,x,m){let h=n[e];return h===void 0?(h={id:u.id,object:u,geometry:f,material:_,groupOrder:v,renderOrder:u.renderOrder,z:x,group:m},n[e]=h):(h.id=u.id,h.object=u,h.geometry=f,h.material=_,h.groupOrder=v,h.renderOrder=u.renderOrder,h.z=x,h.group=m),e++,h}function a(u,f,_,v,x,m){const h=s(u,f,_,v,x,m);_.transmission>0?i.push(h):_.transparent===!0?r.push(h):t.push(h)}function l(u,f,_,v,x,m){const h=s(u,f,_,v,x,m);_.transmission>0?i.unshift(h):_.transparent===!0?r.unshift(h):t.unshift(h)}function c(u,f){t.length>1&&t.sort(u||jm),i.length>1&&i.sort(f||Kl),r.length>1&&r.sort(f||Kl)}function d(){for(let u=e,f=n.length;u<f;u++){const _=n[u];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:t,transmissive:i,transparent:r,init:o,push:a,unshift:l,finish:d,sort:c}}function Zm(){let n=new WeakMap;function e(i,r){const o=n.get(i);let s;return o===void 0?(s=new jl,n.set(i,[s])):r>=o.length?(s=new jl,o.push(s)):s=o[r],s}function t(){n=new WeakMap}return{get:e,dispose:t}}function $m(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new fe};break;case"SpotLight":t={position:new D,direction:new D,color:new fe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new fe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new fe,groundColor:new fe};break;case"RectAreaLight":t={color:new fe,position:new D,halfWidth:new D,halfHeight:new D};break}return n[e.id]=t,t}}}function Jm(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Qm=0;function eg(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function tg(n){const e=new $m,t=Jm(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new D);const r=new D,o=new it,s=new it;function a(c){let d=0,u=0,f=0;for(let T=0;T<9;T++)i.probe[T].set(0,0,0);let _=0,v=0,x=0,m=0,h=0,A=0,g=0,E=0,I=0,R=0,P=0;c.sort(eg);for(let T=0,b=c.length;T<b;T++){const L=c[T],V=L.color,G=L.intensity,Z=L.distance,$=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=V.r*G,u+=V.g*G,f+=V.b*G;else if(L.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(L.sh.coefficients[W],G);P++}else if(L.isDirectionalLight){const W=e.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const J=L.shadow,M=t.get(L);M.shadowIntensity=J.intensity,M.shadowBias=J.bias,M.shadowNormalBias=J.normalBias,M.shadowRadius=J.radius,M.shadowMapSize=J.mapSize,i.directionalShadow[_]=M,i.directionalShadowMap[_]=$,i.directionalShadowMatrix[_]=L.shadow.matrix,A++}i.directional[_]=W,_++}else if(L.isSpotLight){const W=e.get(L);W.position.setFromMatrixPosition(L.matrixWorld),W.color.copy(V).multiplyScalar(G),W.distance=Z,W.coneCos=Math.cos(L.angle),W.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),W.decay=L.decay,i.spot[x]=W;const J=L.shadow;if(L.map&&(i.spotLightMap[I]=L.map,I++,J.updateMatrices(L),L.castShadow&&R++),i.spotLightMatrix[x]=J.matrix,L.castShadow){const M=t.get(L);M.shadowIntensity=J.intensity,M.shadowBias=J.bias,M.shadowNormalBias=J.normalBias,M.shadowRadius=J.radius,M.shadowMapSize=J.mapSize,i.spotShadow[x]=M,i.spotShadowMap[x]=$,E++}x++}else if(L.isRectAreaLight){const W=e.get(L);W.color.copy(V).multiplyScalar(G),W.halfWidth.set(L.width*.5,0,0),W.halfHeight.set(0,L.height*.5,0),i.rectArea[m]=W,m++}else if(L.isPointLight){const W=e.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),W.distance=L.distance,W.decay=L.decay,L.castShadow){const J=L.shadow,M=t.get(L);M.shadowIntensity=J.intensity,M.shadowBias=J.bias,M.shadowNormalBias=J.normalBias,M.shadowRadius=J.radius,M.shadowMapSize=J.mapSize,M.shadowCameraNear=J.camera.near,M.shadowCameraFar=J.camera.far,i.pointShadow[v]=M,i.pointShadowMap[v]=$,i.pointShadowMatrix[v]=L.shadow.matrix,g++}i.point[v]=W,v++}else if(L.isHemisphereLight){const W=e.get(L);W.skyColor.copy(L.color).multiplyScalar(G),W.groundColor.copy(L.groundColor).multiplyScalar(G),i.hemi[h]=W,h++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=re.LTC_FLOAT_1,i.rectAreaLTC2=re.LTC_FLOAT_2):(i.rectAreaLTC1=re.LTC_HALF_1,i.rectAreaLTC2=re.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=f;const p=i.hash;(p.directionalLength!==_||p.pointLength!==v||p.spotLength!==x||p.rectAreaLength!==m||p.hemiLength!==h||p.numDirectionalShadows!==A||p.numPointShadows!==g||p.numSpotShadows!==E||p.numSpotMaps!==I||p.numLightProbes!==P)&&(i.directional.length=_,i.spot.length=x,i.rectArea.length=m,i.point.length=v,i.hemi.length=h,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.pointShadow.length=g,i.pointShadowMap.length=g,i.spotShadow.length=E,i.spotShadowMap.length=E,i.directionalShadowMatrix.length=A,i.pointShadowMatrix.length=g,i.spotLightMatrix.length=E+I-R,i.spotLightMap.length=I,i.numSpotLightShadowsWithMaps=R,i.numLightProbes=P,p.directionalLength=_,p.pointLength=v,p.spotLength=x,p.rectAreaLength=m,p.hemiLength=h,p.numDirectionalShadows=A,p.numPointShadows=g,p.numSpotShadows=E,p.numSpotMaps=I,p.numLightProbes=P,i.version=Qm++)}function l(c,d){let u=0,f=0,_=0,v=0,x=0;const m=d.matrixWorldInverse;for(let h=0,A=c.length;h<A;h++){const g=c[h];if(g.isDirectionalLight){const E=i.directional[u];E.direction.setFromMatrixPosition(g.matrixWorld),r.setFromMatrixPosition(g.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(m),u++}else if(g.isSpotLight){const E=i.spot[_];E.position.setFromMatrixPosition(g.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(g.matrixWorld),r.setFromMatrixPosition(g.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(m),_++}else if(g.isRectAreaLight){const E=i.rectArea[v];E.position.setFromMatrixPosition(g.matrixWorld),E.position.applyMatrix4(m),s.identity(),o.copy(g.matrixWorld),o.premultiply(m),s.extractRotation(o),E.halfWidth.set(g.width*.5,0,0),E.halfHeight.set(0,g.height*.5,0),E.halfWidth.applyMatrix4(s),E.halfHeight.applyMatrix4(s),v++}else if(g.isPointLight){const E=i.point[f];E.position.setFromMatrixPosition(g.matrixWorld),E.position.applyMatrix4(m),f++}else if(g.isHemisphereLight){const E=i.hemi[x];E.direction.setFromMatrixPosition(g.matrixWorld),E.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:i}}function Zl(n){const e=new tg(n),t=[],i=[];function r(d){c.camera=d,t.length=0,i.length=0}function o(d){t.push(d)}function s(d){i.push(d)}function a(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:o,pushShadow:s}}function ng(n){let e=new WeakMap;function t(r,o=0){const s=e.get(r);let a;return s===void 0?(a=new Zl(n),e.set(r,[a])):o>=s.length?(a=new Zl(n),s.push(a)):a=s[o],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const ig=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,rg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function og(n,e,t){let i=new Ca;const r=new xe,o=new xe,s=new Qe,a=new Mh({depthPacking:Ud}),l=new Th,c={},d=t.maxTextureSize,u={[zn]:Rt,[Rt]:zn,[Jt]:Jt},f=new at({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xe},radius:{value:4}},vertexShader:ig,fragmentShader:rg}),_=f.clone();_.defines.HORIZONTAL_PASS=1;const v=new Gt;v.setAttribute("position",new dt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Nt(v,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Oc;let h=this.type;this.render=function(R,P,p){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;const T=n.getRenderTarget(),b=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),V=n.state;V.setBlending(yn),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const G=h!==mn&&this.type===mn,Z=h===mn&&this.type!==mn;for(let $=0,W=R.length;$<W;$++){const J=R[$],M=J.shadow;if(M===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(M.autoUpdate===!1&&M.needsUpdate===!1)continue;r.copy(M.mapSize);const ie=M.getFrameExtents();if(r.multiply(ie),o.copy(M.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(o.x=Math.floor(d/ie.x),r.x=o.x*ie.x,M.mapSize.x=o.x),r.y>d&&(o.y=Math.floor(d/ie.y),r.y=o.y*ie.y,M.mapSize.y=o.y)),M.map===null||G===!0||Z===!0){const ye=this.type!==mn?{minFilter:tn,magFilter:tn}:{};M.map!==null&&M.map.dispose(),M.map=new zt(r.x,r.y,ye),M.map.texture.name=J.name+".shadowMap",M.camera.updateProjectionMatrix()}n.setRenderTarget(M.map),n.clear();const he=M.getViewportCount();for(let ye=0;ye<he;ye++){const ke=M.getViewport(ye);s.set(o.x*ke.x,o.y*ke.y,o.x*ke.z,o.y*ke.w),V.viewport(s),M.updateMatrices(J,ye),i=M.getFrustum(),E(P,p,M.camera,J,this.type)}M.isPointLightShadow!==!0&&this.type===mn&&A(M,p),M.needsUpdate=!1}h=this.type,m.needsUpdate=!1,n.setRenderTarget(T,b,L)};function A(R,P){const p=e.update(x);f.defines.VSM_SAMPLES!==R.blurSamples&&(f.defines.VSM_SAMPLES=R.blurSamples,_.defines.VSM_SAMPLES=R.blurSamples,f.needsUpdate=!0,_.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new zt(r.x,r.y)),f.uniforms.shadow_pass.value=R.map.texture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,n.setRenderTarget(R.mapPass),n.clear(),n.renderBufferDirect(P,null,p,f,x,null),_.uniforms.shadow_pass.value=R.mapPass.texture,_.uniforms.resolution.value=R.mapSize,_.uniforms.radius.value=R.radius,n.setRenderTarget(R.map),n.clear(),n.renderBufferDirect(P,null,p,_,x,null)}function g(R,P,p,T){let b=null;const L=p.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(L!==void 0)b=L;else if(b=p.isPointLight===!0?l:a,n.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0){const V=b.uuid,G=P.uuid;let Z=c[V];Z===void 0&&(Z={},c[V]=Z);let $=Z[G];$===void 0&&($=b.clone(),Z[G]=$,P.addEventListener("dispose",I)),b=$}if(b.visible=P.visible,b.wireframe=P.wireframe,T===mn?b.side=P.shadowSide!==null?P.shadowSide:P.side:b.side=P.shadowSide!==null?P.shadowSide:u[P.side],b.alphaMap=P.alphaMap,b.alphaTest=P.alphaTest,b.map=P.map,b.clipShadows=P.clipShadows,b.clippingPlanes=P.clippingPlanes,b.clipIntersection=P.clipIntersection,b.displacementMap=P.displacementMap,b.displacementScale=P.displacementScale,b.displacementBias=P.displacementBias,b.wireframeLinewidth=P.wireframeLinewidth,b.linewidth=P.linewidth,p.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const V=n.properties.get(b);V.light=p}return b}function E(R,P,p,T,b){if(R.visible===!1)return;if(R.layers.test(P.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&b===mn)&&(!R.frustumCulled||i.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(p.matrixWorldInverse,R.matrixWorld);const G=e.update(R),Z=R.material;if(Array.isArray(Z)){const $=G.groups;for(let W=0,J=$.length;W<J;W++){const M=$[W],ie=Z[M.materialIndex];if(ie&&ie.visible){const he=g(R,ie,T,b);R.onBeforeShadow(n,R,P,p,G,he,M),n.renderBufferDirect(p,null,G,he,R,M),R.onAfterShadow(n,R,P,p,G,he,M)}}}else if(Z.visible){const $=g(R,Z,T,b);R.onBeforeShadow(n,R,P,p,G,$,null),n.renderBufferDirect(p,null,G,$,R,null),R.onAfterShadow(n,R,P,p,G,$,null)}}const V=R.children;for(let G=0,Z=V.length;G<Z;G++)E(V[G],P,p,T,b)}function I(R){R.target.removeEventListener("dispose",I);for(const p in c){const T=c[p],b=R.target.uuid;b in T&&(T[b].dispose(),delete T[b])}}}const sg={[vs]:xs,[Ss]:Es,[ys]:Ms,[Oi]:bs,[xs]:vs,[Es]:Ss,[Ms]:ys,[bs]:Oi};function ag(n,e){function t(){let N=!1;const le=new Qe;let H=null;const j=new Qe(0,0,0,0);return{setMask:function(ue){H!==ue&&!N&&(n.colorMask(ue,ue,ue,ue),H=ue)},setLocked:function(ue){N=ue},setClear:function(ue,ce,Ie,lt,Mt){Mt===!0&&(ue*=lt,ce*=lt,Ie*=lt),le.set(ue,ce,Ie,lt),j.equals(le)===!1&&(n.clearColor(ue,ce,Ie,lt),j.copy(le))},reset:function(){N=!1,H=null,j.set(-1,0,0,0)}}}function i(){let N=!1,le=!1,H=null,j=null,ue=null;return{setReversed:function(ce){if(le!==ce){const Ie=e.get("EXT_clip_control");ce?Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.ZERO_TO_ONE_EXT):Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.NEGATIVE_ONE_TO_ONE_EXT),le=ce;const lt=ue;ue=null,this.setClear(lt)}},getReversed:function(){return le},setTest:function(ce){ce?se(n.DEPTH_TEST):Ae(n.DEPTH_TEST)},setMask:function(ce){H!==ce&&!N&&(n.depthMask(ce),H=ce)},setFunc:function(ce){if(le&&(ce=sg[ce]),j!==ce){switch(ce){case vs:n.depthFunc(n.NEVER);break;case xs:n.depthFunc(n.ALWAYS);break;case Ss:n.depthFunc(n.LESS);break;case Oi:n.depthFunc(n.LEQUAL);break;case ys:n.depthFunc(n.EQUAL);break;case bs:n.depthFunc(n.GEQUAL);break;case Es:n.depthFunc(n.GREATER);break;case Ms:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}j=ce}},setLocked:function(ce){N=ce},setClear:function(ce){ue!==ce&&(le&&(ce=1-ce),n.clearDepth(ce),ue=ce)},reset:function(){N=!1,H=null,j=null,ue=null,le=!1}}}function r(){let N=!1,le=null,H=null,j=null,ue=null,ce=null,Ie=null,lt=null,Mt=null;return{setTest:function(Ze){N||(Ze?se(n.STENCIL_TEST):Ae(n.STENCIL_TEST))},setMask:function(Ze){le!==Ze&&!N&&(n.stencilMask(Ze),le=Ze)},setFunc:function(Ze,Yt,un){(H!==Ze||j!==Yt||ue!==un)&&(n.stencilFunc(Ze,Yt,un),H=Ze,j=Yt,ue=un)},setOp:function(Ze,Yt,un){(ce!==Ze||Ie!==Yt||lt!==un)&&(n.stencilOp(Ze,Yt,un),ce=Ze,Ie=Yt,lt=un)},setLocked:function(Ze){N=Ze},setClear:function(Ze){Mt!==Ze&&(n.clearStencil(Ze),Mt=Ze)},reset:function(){N=!1,le=null,H=null,j=null,ue=null,ce=null,Ie=null,lt=null,Mt=null}}}const o=new t,s=new i,a=new r,l=new WeakMap,c=new WeakMap;let d={},u={},f=new WeakMap,_=[],v=null,x=!1,m=null,h=null,A=null,g=null,E=null,I=null,R=null,P=new fe(0,0,0),p=0,T=!1,b=null,L=null,V=null,G=null,Z=null;const $=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,J=0;const M=n.getParameter(n.VERSION);M.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(M)[1]),W=J>=1):M.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(M)[1]),W=J>=2);let ie=null,he={};const ye=n.getParameter(n.SCISSOR_BOX),ke=n.getParameter(n.VIEWPORT),et=new Qe().fromArray(ye),q=new Qe().fromArray(ke);function ne(N,le,H,j){const ue=new Uint8Array(4),ce=n.createTexture();n.bindTexture(N,ce),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ie=0;Ie<H;Ie++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(le,0,n.RGBA,1,1,j,0,n.RGBA,n.UNSIGNED_BYTE,ue):n.texImage2D(le+Ie,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ue);return ce}const Se={};Se[n.TEXTURE_2D]=ne(n.TEXTURE_2D,n.TEXTURE_2D,1),Se[n.TEXTURE_CUBE_MAP]=ne(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Se[n.TEXTURE_2D_ARRAY]=ne(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Se[n.TEXTURE_3D]=ne(n.TEXTURE_3D,n.TEXTURE_3D,1,1),o.setClear(0,0,0,1),s.setClear(1),a.setClear(0),se(n.DEPTH_TEST),s.setFunc(Oi),He(!1),ze(ja),se(n.CULL_FACE),C(yn);function se(N){d[N]!==!0&&(n.enable(N),d[N]=!0)}function Ae(N){d[N]!==!1&&(n.disable(N),d[N]=!1)}function Ye(N,le){return u[N]!==le?(n.bindFramebuffer(N,le),u[N]=le,N===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=le),N===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=le),!0):!1}function Re(N,le){let H=_,j=!1;if(N){H=f.get(le),H===void 0&&(H=[],f.set(le,H));const ue=N.textures;if(H.length!==ue.length||H[0]!==n.COLOR_ATTACHMENT0){for(let ce=0,Ie=ue.length;ce<Ie;ce++)H[ce]=n.COLOR_ATTACHMENT0+ce;H.length=ue.length,j=!0}}else H[0]!==n.BACK&&(H[0]=n.BACK,j=!0);j&&n.drawBuffers(H)}function ht(N){return v!==N?(n.useProgram(N),v=N,!0):!1}const st={[ei]:n.FUNC_ADD,[ld]:n.FUNC_SUBTRACT,[cd]:n.FUNC_REVERSE_SUBTRACT};st[ud]=n.MIN,st[dd]=n.MAX;const Be={[hd]:n.ZERO,[fd]:n.ONE,[pd]:n.SRC_COLOR,[ms]:n.SRC_ALPHA,[Sd]:n.SRC_ALPHA_SATURATE,[vd]:n.DST_COLOR,[md]:n.DST_ALPHA,[_d]:n.ONE_MINUS_SRC_COLOR,[gs]:n.ONE_MINUS_SRC_ALPHA,[xd]:n.ONE_MINUS_DST_COLOR,[gd]:n.ONE_MINUS_DST_ALPHA,[yd]:n.CONSTANT_COLOR,[bd]:n.ONE_MINUS_CONSTANT_COLOR,[Ed]:n.CONSTANT_ALPHA,[Md]:n.ONE_MINUS_CONSTANT_ALPHA};function C(N,le,H,j,ue,ce,Ie,lt,Mt,Ze){if(N===yn){x===!0&&(Ae(n.BLEND),x=!1);return}if(x===!1&&(se(n.BLEND),x=!0),N!==ad){if(N!==m||Ze!==T){if((h!==ei||E!==ei)&&(n.blendEquation(n.FUNC_ADD),h=ei,E=ei),Ze)switch(N){case Li:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case _s:n.blendFunc(n.ONE,n.ONE);break;case Za:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case $a:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Li:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case _s:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Za:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case $a:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}A=null,g=null,I=null,R=null,P.set(0,0,0),p=0,m=N,T=Ze}return}ue=ue||le,ce=ce||H,Ie=Ie||j,(le!==h||ue!==E)&&(n.blendEquationSeparate(st[le],st[ue]),h=le,E=ue),(H!==A||j!==g||ce!==I||Ie!==R)&&(n.blendFuncSeparate(Be[H],Be[j],Be[ce],Be[Ie]),A=H,g=j,I=ce,R=Ie),(lt.equals(P)===!1||Mt!==p)&&(n.blendColor(lt.r,lt.g,lt.b,Mt),P.copy(lt),p=Mt),m=N,T=!1}function Ht(N,le){N.side===Jt?Ae(n.CULL_FACE):se(n.CULL_FACE);let H=N.side===Rt;le&&(H=!H),He(H),N.blending===Li&&N.transparent===!1?C(yn):C(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),s.setFunc(N.depthFunc),s.setTest(N.depthTest),s.setMask(N.depthWrite),o.setMask(N.colorWrite);const j=N.stencilWrite;a.setTest(j),j&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),rt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?se(n.SAMPLE_ALPHA_TO_COVERAGE):Ae(n.SAMPLE_ALPHA_TO_COVERAGE)}function He(N){b!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),b=N)}function ze(N){N!==od?(se(n.CULL_FACE),N!==L&&(N===ja?n.cullFace(n.BACK):N===sd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ae(n.CULL_FACE),L=N}function Me(N){N!==V&&(W&&n.lineWidth(N),V=N)}function rt(N,le,H){N?(se(n.POLYGON_OFFSET_FILL),(G!==le||Z!==H)&&(n.polygonOffset(le,H),G=le,Z=H)):Ae(n.POLYGON_OFFSET_FILL)}function Ee(N){N?se(n.SCISSOR_TEST):Ae(n.SCISSOR_TEST)}function w(N){N===void 0&&(N=n.TEXTURE0+$-1),ie!==N&&(n.activeTexture(N),ie=N)}function S(N,le,H){H===void 0&&(ie===null?H=n.TEXTURE0+$-1:H=ie);let j=he[H];j===void 0&&(j={type:void 0,texture:void 0},he[H]=j),(j.type!==N||j.texture!==le)&&(ie!==H&&(n.activeTexture(H),ie=H),n.bindTexture(N,le||Se[N]),j.type=N,j.texture=le)}function F(){const N=he[ie];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function K(){try{n.compressedTexImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Q(){try{n.compressedTexImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function X(){try{n.texSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function be(){try{n.texSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ae(){try{n.compressedTexSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function _e(){try{n.compressedTexSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ve(){try{n.texStorage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function te(){try{n.texStorage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function me(){try{n.texImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ce(){try{n.texImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function De(N){et.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),et.copy(N))}function ge(N){q.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),q.copy(N))}function Ge(N,le){let H=c.get(le);H===void 0&&(H=new WeakMap,c.set(le,H));let j=H.get(N);j===void 0&&(j=n.getUniformBlockIndex(le,N.name),H.set(N,j))}function Ue(N,le){const j=c.get(le).get(N);l.get(le)!==j&&(n.uniformBlockBinding(le,j,N.__bindingPointIndex),l.set(le,j))}function tt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),s.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},ie=null,he={},u={},f=new WeakMap,_=[],v=null,x=!1,m=null,h=null,A=null,g=null,E=null,I=null,R=null,P=new fe(0,0,0),p=0,T=!1,b=null,L=null,V=null,G=null,Z=null,et.set(0,0,n.canvas.width,n.canvas.height),q.set(0,0,n.canvas.width,n.canvas.height),o.reset(),s.reset(),a.reset()}return{buffers:{color:o,depth:s,stencil:a},enable:se,disable:Ae,bindFramebuffer:Ye,drawBuffers:Re,useProgram:ht,setBlending:C,setMaterial:Ht,setFlipSided:He,setCullFace:ze,setLineWidth:Me,setPolygonOffset:rt,setScissorTest:Ee,activeTexture:w,bindTexture:S,unbindTexture:F,compressedTexImage2D:K,compressedTexImage3D:Q,texImage2D:me,texImage3D:Ce,updateUBOMapping:Ge,uniformBlockBinding:Ue,texStorage2D:Ve,texStorage3D:te,texSubImage2D:X,texSubImage3D:be,compressedTexSubImage2D:ae,compressedTexSubImage3D:_e,scissor:De,viewport:ge,reset:tt}}function lg(n,e,t,i,r,o,s){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new xe,d=new WeakMap;let u;const f=new WeakMap;let _=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(w,S){return _?new OffscreenCanvas(w,S):so("canvas")}function x(w,S,F){let K=1;const Q=Ee(w);if((Q.width>F||Q.height>F)&&(K=F/Math.max(Q.width,Q.height)),K<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const X=Math.floor(K*Q.width),be=Math.floor(K*Q.height);u===void 0&&(u=v(X,be));const ae=S?v(X,be):u;return ae.width=X,ae.height=be,ae.getContext("2d").drawImage(w,0,0,X,be),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+X+"x"+be+")."),ae}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),w;return w}function m(w){return w.generateMipmaps}function h(w){n.generateMipmap(w)}function A(w){return w.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?n.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function g(w,S,F,K,Q=!1){if(w!==null){if(n[w]!==void 0)return n[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let X=S;if(S===n.RED&&(F===n.FLOAT&&(X=n.R32F),F===n.HALF_FLOAT&&(X=n.R16F),F===n.UNSIGNED_BYTE&&(X=n.R8)),S===n.RED_INTEGER&&(F===n.UNSIGNED_BYTE&&(X=n.R8UI),F===n.UNSIGNED_SHORT&&(X=n.R16UI),F===n.UNSIGNED_INT&&(X=n.R32UI),F===n.BYTE&&(X=n.R8I),F===n.SHORT&&(X=n.R16I),F===n.INT&&(X=n.R32I)),S===n.RG&&(F===n.FLOAT&&(X=n.RG32F),F===n.HALF_FLOAT&&(X=n.RG16F),F===n.UNSIGNED_BYTE&&(X=n.RG8)),S===n.RG_INTEGER&&(F===n.UNSIGNED_BYTE&&(X=n.RG8UI),F===n.UNSIGNED_SHORT&&(X=n.RG16UI),F===n.UNSIGNED_INT&&(X=n.RG32UI),F===n.BYTE&&(X=n.RG8I),F===n.SHORT&&(X=n.RG16I),F===n.INT&&(X=n.RG32I)),S===n.RGB_INTEGER&&(F===n.UNSIGNED_BYTE&&(X=n.RGB8UI),F===n.UNSIGNED_SHORT&&(X=n.RGB16UI),F===n.UNSIGNED_INT&&(X=n.RGB32UI),F===n.BYTE&&(X=n.RGB8I),F===n.SHORT&&(X=n.RGB16I),F===n.INT&&(X=n.RGB32I)),S===n.RGBA_INTEGER&&(F===n.UNSIGNED_BYTE&&(X=n.RGBA8UI),F===n.UNSIGNED_SHORT&&(X=n.RGBA16UI),F===n.UNSIGNED_INT&&(X=n.RGBA32UI),F===n.BYTE&&(X=n.RGBA8I),F===n.SHORT&&(X=n.RGBA16I),F===n.INT&&(X=n.RGBA32I)),S===n.RGB&&F===n.UNSIGNED_INT_5_9_9_9_REV&&(X=n.RGB9_E5),S===n.RGBA){const be=Q?ro:qe.getTransfer(K);F===n.FLOAT&&(X=n.RGBA32F),F===n.HALF_FLOAT&&(X=n.RGBA16F),F===n.UNSIGNED_BYTE&&(X=be===$e?n.SRGB8_ALPHA8:n.RGBA8),F===n.UNSIGNED_SHORT_4_4_4_4&&(X=n.RGBA4),F===n.UNSIGNED_SHORT_5_5_5_1&&(X=n.RGB5_A1)}return(X===n.R16F||X===n.R32F||X===n.RG16F||X===n.RG32F||X===n.RGBA16F||X===n.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function E(w,S){let F;return w?S===null||S===oi||S===ar?F=n.DEPTH24_STENCIL8:S===xn?F=n.DEPTH32F_STENCIL8:S===sr&&(F=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===oi||S===ar?F=n.DEPTH_COMPONENT24:S===xn?F=n.DEPTH_COMPONENT32F:S===sr&&(F=n.DEPTH_COMPONENT16),F}function I(w,S){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==tn&&w.minFilter!==ln?Math.log2(Math.max(S.width,S.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?S.mipmaps.length:1}function R(w){const S=w.target;S.removeEventListener("dispose",R),p(S),S.isVideoTexture&&d.delete(S)}function P(w){const S=w.target;S.removeEventListener("dispose",P),b(S)}function p(w){const S=i.get(w);if(S.__webglInit===void 0)return;const F=w.source,K=f.get(F);if(K){const Q=K[S.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&T(w),Object.keys(K).length===0&&f.delete(F)}i.remove(w)}function T(w){const S=i.get(w);n.deleteTexture(S.__webglTexture);const F=w.source,K=f.get(F);delete K[S.__cacheKey],s.memory.textures--}function b(w){const S=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(S.__webglFramebuffer[K]))for(let Q=0;Q<S.__webglFramebuffer[K].length;Q++)n.deleteFramebuffer(S.__webglFramebuffer[K][Q]);else n.deleteFramebuffer(S.__webglFramebuffer[K]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[K])}else{if(Array.isArray(S.__webglFramebuffer))for(let K=0;K<S.__webglFramebuffer.length;K++)n.deleteFramebuffer(S.__webglFramebuffer[K]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let K=0;K<S.__webglColorRenderbuffer.length;K++)S.__webglColorRenderbuffer[K]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[K]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const F=w.textures;for(let K=0,Q=F.length;K<Q;K++){const X=i.get(F[K]);X.__webglTexture&&(n.deleteTexture(X.__webglTexture),s.memory.textures--),i.remove(F[K])}i.remove(w)}let L=0;function V(){L=0}function G(){const w=L;return w>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+r.maxTextures),L+=1,w}function Z(w){const S=[];return S.push(w.wrapS),S.push(w.wrapT),S.push(w.wrapR||0),S.push(w.magFilter),S.push(w.minFilter),S.push(w.anisotropy),S.push(w.internalFormat),S.push(w.format),S.push(w.type),S.push(w.generateMipmaps),S.push(w.premultiplyAlpha),S.push(w.flipY),S.push(w.unpackAlignment),S.push(w.colorSpace),S.join()}function $(w,S){const F=i.get(w);if(w.isVideoTexture&&Me(w),w.isRenderTargetTexture===!1&&w.version>0&&F.__version!==w.version){const K=w.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(F,w,S);return}}t.bindTexture(n.TEXTURE_2D,F.__webglTexture,n.TEXTURE0+S)}function W(w,S){const F=i.get(w);if(w.version>0&&F.__version!==w.version){q(F,w,S);return}t.bindTexture(n.TEXTURE_2D_ARRAY,F.__webglTexture,n.TEXTURE0+S)}function J(w,S){const F=i.get(w);if(w.version>0&&F.__version!==w.version){q(F,w,S);return}t.bindTexture(n.TEXTURE_3D,F.__webglTexture,n.TEXTURE0+S)}function M(w,S){const F=i.get(w);if(w.version>0&&F.__version!==w.version){ne(F,w,S);return}t.bindTexture(n.TEXTURE_CUBE_MAP,F.__webglTexture,n.TEXTURE0+S)}const ie={[As]:n.REPEAT,[ni]:n.CLAMP_TO_EDGE,[Cs]:n.MIRRORED_REPEAT},he={[tn]:n.NEAREST,[Id]:n.NEAREST_MIPMAP_NEAREST,[vr]:n.NEAREST_MIPMAP_LINEAR,[ln]:n.LINEAR,[To]:n.LINEAR_MIPMAP_NEAREST,[ii]:n.LINEAR_MIPMAP_LINEAR},ye={[kd]:n.NEVER,[Wd]:n.ALWAYS,[Bd]:n.LESS,[$c]:n.LEQUAL,[zd]:n.EQUAL,[Vd]:n.GEQUAL,[Gd]:n.GREATER,[Hd]:n.NOTEQUAL};function ke(w,S){if(S.type===xn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===ln||S.magFilter===To||S.magFilter===vr||S.magFilter===ii||S.minFilter===ln||S.minFilter===To||S.minFilter===vr||S.minFilter===ii)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(w,n.TEXTURE_WRAP_S,ie[S.wrapS]),n.texParameteri(w,n.TEXTURE_WRAP_T,ie[S.wrapT]),(w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY)&&n.texParameteri(w,n.TEXTURE_WRAP_R,ie[S.wrapR]),n.texParameteri(w,n.TEXTURE_MAG_FILTER,he[S.magFilter]),n.texParameteri(w,n.TEXTURE_MIN_FILTER,he[S.minFilter]),S.compareFunction&&(n.texParameteri(w,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(w,n.TEXTURE_COMPARE_FUNC,ye[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===tn||S.minFilter!==vr&&S.minFilter!==ii||S.type===xn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");n.texParameterf(w,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,r.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function et(w,S){let F=!1;w.__webglInit===void 0&&(w.__webglInit=!0,S.addEventListener("dispose",R));const K=S.source;let Q=f.get(K);Q===void 0&&(Q={},f.set(K,Q));const X=Z(S);if(X!==w.__cacheKey){Q[X]===void 0&&(Q[X]={texture:n.createTexture(),usedTimes:0},s.memory.textures++,F=!0),Q[X].usedTimes++;const be=Q[w.__cacheKey];be!==void 0&&(Q[w.__cacheKey].usedTimes--,be.usedTimes===0&&T(S)),w.__cacheKey=X,w.__webglTexture=Q[X].texture}return F}function q(w,S,F){let K=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(K=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(K=n.TEXTURE_3D);const Q=et(w,S),X=S.source;t.bindTexture(K,w.__webglTexture,n.TEXTURE0+F);const be=i.get(X);if(X.version!==be.__version||Q===!0){t.activeTexture(n.TEXTURE0+F);const ae=qe.getPrimaries(qe.workingColorSpace),_e=S.colorSpace===Nn?null:qe.getPrimaries(S.colorSpace),Ve=S.colorSpace===Nn||ae===_e?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ve);let te=x(S.image,!1,r.maxTextureSize);te=rt(S,te);const me=o.convert(S.format,S.colorSpace),Ce=o.convert(S.type);let De=g(S.internalFormat,me,Ce,S.colorSpace,S.isVideoTexture);ke(K,S);let ge;const Ge=S.mipmaps,Ue=S.isVideoTexture!==!0,tt=be.__version===void 0||Q===!0,N=X.dataReady,le=I(S,te);if(S.isDepthTexture)De=E(S.format===cr,S.type),tt&&(Ue?t.texStorage2D(n.TEXTURE_2D,1,De,te.width,te.height):t.texImage2D(n.TEXTURE_2D,0,De,te.width,te.height,0,me,Ce,null));else if(S.isDataTexture)if(Ge.length>0){Ue&&tt&&t.texStorage2D(n.TEXTURE_2D,le,De,Ge[0].width,Ge[0].height);for(let H=0,j=Ge.length;H<j;H++)ge=Ge[H],Ue?N&&t.texSubImage2D(n.TEXTURE_2D,H,0,0,ge.width,ge.height,me,Ce,ge.data):t.texImage2D(n.TEXTURE_2D,H,De,ge.width,ge.height,0,me,Ce,ge.data);S.generateMipmaps=!1}else Ue?(tt&&t.texStorage2D(n.TEXTURE_2D,le,De,te.width,te.height),N&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,te.width,te.height,me,Ce,te.data)):t.texImage2D(n.TEXTURE_2D,0,De,te.width,te.height,0,me,Ce,te.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ue&&tt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,le,De,Ge[0].width,Ge[0].height,te.depth);for(let H=0,j=Ge.length;H<j;H++)if(ge=Ge[H],S.format!==en)if(me!==null)if(Ue){if(N)if(S.layerUpdates.size>0){const ue=wl(ge.width,ge.height,S.format,S.type);for(const ce of S.layerUpdates){const Ie=ge.data.subarray(ce*ue/ge.data.BYTES_PER_ELEMENT,(ce+1)*ue/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,H,0,0,ce,ge.width,ge.height,1,me,Ie)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,H,0,0,0,ge.width,ge.height,te.depth,me,ge.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,H,De,ge.width,ge.height,te.depth,0,ge.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ue?N&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,H,0,0,0,ge.width,ge.height,te.depth,me,Ce,ge.data):t.texImage3D(n.TEXTURE_2D_ARRAY,H,De,ge.width,ge.height,te.depth,0,me,Ce,ge.data)}else{Ue&&tt&&t.texStorage2D(n.TEXTURE_2D,le,De,Ge[0].width,Ge[0].height);for(let H=0,j=Ge.length;H<j;H++)ge=Ge[H],S.format!==en?me!==null?Ue?N&&t.compressedTexSubImage2D(n.TEXTURE_2D,H,0,0,ge.width,ge.height,me,ge.data):t.compressedTexImage2D(n.TEXTURE_2D,H,De,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ue?N&&t.texSubImage2D(n.TEXTURE_2D,H,0,0,ge.width,ge.height,me,Ce,ge.data):t.texImage2D(n.TEXTURE_2D,H,De,ge.width,ge.height,0,me,Ce,ge.data)}else if(S.isDataArrayTexture)if(Ue){if(tt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,le,De,te.width,te.height,te.depth),N)if(S.layerUpdates.size>0){const H=wl(te.width,te.height,S.format,S.type);for(const j of S.layerUpdates){const ue=te.data.subarray(j*H/te.data.BYTES_PER_ELEMENT,(j+1)*H/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,j,te.width,te.height,1,me,Ce,ue)}S.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,me,Ce,te.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,De,te.width,te.height,te.depth,0,me,Ce,te.data);else if(S.isData3DTexture)Ue?(tt&&t.texStorage3D(n.TEXTURE_3D,le,De,te.width,te.height,te.depth),N&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,me,Ce,te.data)):t.texImage3D(n.TEXTURE_3D,0,De,te.width,te.height,te.depth,0,me,Ce,te.data);else if(S.isFramebufferTexture){if(tt)if(Ue)t.texStorage2D(n.TEXTURE_2D,le,De,te.width,te.height);else{let H=te.width,j=te.height;for(let ue=0;ue<le;ue++)t.texImage2D(n.TEXTURE_2D,ue,De,H,j,0,me,Ce,null),H>>=1,j>>=1}}else if(Ge.length>0){if(Ue&&tt){const H=Ee(Ge[0]);t.texStorage2D(n.TEXTURE_2D,le,De,H.width,H.height)}for(let H=0,j=Ge.length;H<j;H++)ge=Ge[H],Ue?N&&t.texSubImage2D(n.TEXTURE_2D,H,0,0,me,Ce,ge):t.texImage2D(n.TEXTURE_2D,H,De,me,Ce,ge);S.generateMipmaps=!1}else if(Ue){if(tt){const H=Ee(te);t.texStorage2D(n.TEXTURE_2D,le,De,H.width,H.height)}N&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,me,Ce,te)}else t.texImage2D(n.TEXTURE_2D,0,De,me,Ce,te);m(S)&&h(K),be.__version=X.version,S.onUpdate&&S.onUpdate(S)}w.__version=S.version}function ne(w,S,F){if(S.image.length!==6)return;const K=et(w,S),Q=S.source;t.bindTexture(n.TEXTURE_CUBE_MAP,w.__webglTexture,n.TEXTURE0+F);const X=i.get(Q);if(Q.version!==X.__version||K===!0){t.activeTexture(n.TEXTURE0+F);const be=qe.getPrimaries(qe.workingColorSpace),ae=S.colorSpace===Nn?null:qe.getPrimaries(S.colorSpace),_e=S.colorSpace===Nn||be===ae?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);const Ve=S.isCompressedTexture||S.image[0].isCompressedTexture,te=S.image[0]&&S.image[0].isDataTexture,me=[];for(let j=0;j<6;j++)!Ve&&!te?me[j]=x(S.image[j],!0,r.maxCubemapSize):me[j]=te?S.image[j].image:S.image[j],me[j]=rt(S,me[j]);const Ce=me[0],De=o.convert(S.format,S.colorSpace),ge=o.convert(S.type),Ge=g(S.internalFormat,De,ge,S.colorSpace),Ue=S.isVideoTexture!==!0,tt=X.__version===void 0||K===!0,N=Q.dataReady;let le=I(S,Ce);ke(n.TEXTURE_CUBE_MAP,S);let H;if(Ve){Ue&&tt&&t.texStorage2D(n.TEXTURE_CUBE_MAP,le,Ge,Ce.width,Ce.height);for(let j=0;j<6;j++){H=me[j].mipmaps;for(let ue=0;ue<H.length;ue++){const ce=H[ue];S.format!==en?De!==null?Ue?N&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,ue,0,0,ce.width,ce.height,De,ce.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,ue,Ge,ce.width,ce.height,0,ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ue?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,ue,0,0,ce.width,ce.height,De,ge,ce.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,ue,Ge,ce.width,ce.height,0,De,ge,ce.data)}}}else{if(H=S.mipmaps,Ue&&tt){H.length>0&&le++;const j=Ee(me[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,le,Ge,j.width,j.height)}for(let j=0;j<6;j++)if(te){Ue?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,me[j].width,me[j].height,De,ge,me[j].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ge,me[j].width,me[j].height,0,De,ge,me[j].data);for(let ue=0;ue<H.length;ue++){const Ie=H[ue].image[j].image;Ue?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,ue+1,0,0,Ie.width,Ie.height,De,ge,Ie.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,ue+1,Ge,Ie.width,Ie.height,0,De,ge,Ie.data)}}else{Ue?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,De,ge,me[j]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ge,De,ge,me[j]);for(let ue=0;ue<H.length;ue++){const ce=H[ue];Ue?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,ue+1,0,0,De,ge,ce.image[j]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,ue+1,Ge,De,ge,ce.image[j])}}}m(S)&&h(n.TEXTURE_CUBE_MAP),X.__version=Q.version,S.onUpdate&&S.onUpdate(S)}w.__version=S.version}function Se(w,S,F,K,Q,X){const be=o.convert(F.format,F.colorSpace),ae=o.convert(F.type),_e=g(F.internalFormat,be,ae,F.colorSpace),Ve=i.get(S),te=i.get(F);if(te.__renderTarget=S,!Ve.__hasExternalTextures){const me=Math.max(1,S.width>>X),Ce=Math.max(1,S.height>>X);Q===n.TEXTURE_3D||Q===n.TEXTURE_2D_ARRAY?t.texImage3D(Q,X,_e,me,Ce,S.depth,0,be,ae,null):t.texImage2D(Q,X,_e,me,Ce,0,be,ae,null)}t.bindFramebuffer(n.FRAMEBUFFER,w),ze(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,K,Q,te.__webglTexture,0,He(S)):(Q===n.TEXTURE_2D||Q>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,K,Q,te.__webglTexture,X),t.bindFramebuffer(n.FRAMEBUFFER,null)}function se(w,S,F){if(n.bindRenderbuffer(n.RENDERBUFFER,w),S.depthBuffer){const K=S.depthTexture,Q=K&&K.isDepthTexture?K.type:null,X=E(S.stencilBuffer,Q),be=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=He(S);ze(S)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ae,X,S.width,S.height):F?n.renderbufferStorageMultisample(n.RENDERBUFFER,ae,X,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,X,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,be,n.RENDERBUFFER,w)}else{const K=S.textures;for(let Q=0;Q<K.length;Q++){const X=K[Q],be=o.convert(X.format,X.colorSpace),ae=o.convert(X.type),_e=g(X.internalFormat,be,ae,X.colorSpace),Ve=He(S);F&&ze(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ve,_e,S.width,S.height):ze(S)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ve,_e,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,_e,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ae(w,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,w),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=i.get(S.depthTexture);K.__renderTarget=S,(!K.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),$(S.depthTexture,0);const Q=K.__webglTexture,X=He(S);if(S.depthTexture.format===lr)ze(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0,X):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0);else if(S.depthTexture.format===cr)ze(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0,X):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Ye(w){const S=i.get(w),F=w.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==w.depthTexture){const K=w.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),K){const Q=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,K.removeEventListener("dispose",Q)};K.addEventListener("dispose",Q),S.__depthDisposeCallback=Q}S.__boundDepthTexture=K}if(w.depthTexture&&!S.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");Ae(S.__webglFramebuffer,w)}else if(F){S.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[K]),S.__webglDepthbuffer[K]===void 0)S.__webglDepthbuffer[K]=n.createRenderbuffer(),se(S.__webglDepthbuffer[K],w,!1);else{const Q=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,X=S.__webglDepthbuffer[K];n.bindRenderbuffer(n.RENDERBUFFER,X),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,X)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),se(S.__webglDepthbuffer,w,!1);else{const K=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Q=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,Q),n.framebufferRenderbuffer(n.FRAMEBUFFER,K,n.RENDERBUFFER,Q)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Re(w,S,F){const K=i.get(w);S!==void 0&&Se(K.__webglFramebuffer,w,w.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),F!==void 0&&Ye(w)}function ht(w){const S=w.texture,F=i.get(w),K=i.get(S);w.addEventListener("dispose",P);const Q=w.textures,X=w.isWebGLCubeRenderTarget===!0,be=Q.length>1;if(be||(K.__webglTexture===void 0&&(K.__webglTexture=n.createTexture()),K.__version=S.version,s.memory.textures++),X){F.__webglFramebuffer=[];for(let ae=0;ae<6;ae++)if(S.mipmaps&&S.mipmaps.length>0){F.__webglFramebuffer[ae]=[];for(let _e=0;_e<S.mipmaps.length;_e++)F.__webglFramebuffer[ae][_e]=n.createFramebuffer()}else F.__webglFramebuffer[ae]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){F.__webglFramebuffer=[];for(let ae=0;ae<S.mipmaps.length;ae++)F.__webglFramebuffer[ae]=n.createFramebuffer()}else F.__webglFramebuffer=n.createFramebuffer();if(be)for(let ae=0,_e=Q.length;ae<_e;ae++){const Ve=i.get(Q[ae]);Ve.__webglTexture===void 0&&(Ve.__webglTexture=n.createTexture(),s.memory.textures++)}if(w.samples>0&&ze(w)===!1){F.__webglMultisampledFramebuffer=n.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let ae=0;ae<Q.length;ae++){const _e=Q[ae];F.__webglColorRenderbuffer[ae]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,F.__webglColorRenderbuffer[ae]);const Ve=o.convert(_e.format,_e.colorSpace),te=o.convert(_e.type),me=g(_e.internalFormat,Ve,te,_e.colorSpace,w.isXRRenderTarget===!0),Ce=He(w);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ce,me,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ae,n.RENDERBUFFER,F.__webglColorRenderbuffer[ae])}n.bindRenderbuffer(n.RENDERBUFFER,null),w.depthBuffer&&(F.__webglDepthRenderbuffer=n.createRenderbuffer(),se(F.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(X){t.bindTexture(n.TEXTURE_CUBE_MAP,K.__webglTexture),ke(n.TEXTURE_CUBE_MAP,S);for(let ae=0;ae<6;ae++)if(S.mipmaps&&S.mipmaps.length>0)for(let _e=0;_e<S.mipmaps.length;_e++)Se(F.__webglFramebuffer[ae][_e],w,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,_e);else Se(F.__webglFramebuffer[ae],w,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0);m(S)&&h(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(be){for(let ae=0,_e=Q.length;ae<_e;ae++){const Ve=Q[ae],te=i.get(Ve);t.bindTexture(n.TEXTURE_2D,te.__webglTexture),ke(n.TEXTURE_2D,Ve),Se(F.__webglFramebuffer,w,Ve,n.COLOR_ATTACHMENT0+ae,n.TEXTURE_2D,0),m(Ve)&&h(n.TEXTURE_2D)}t.unbindTexture()}else{let ae=n.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ae=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ae,K.__webglTexture),ke(ae,S),S.mipmaps&&S.mipmaps.length>0)for(let _e=0;_e<S.mipmaps.length;_e++)Se(F.__webglFramebuffer[_e],w,S,n.COLOR_ATTACHMENT0,ae,_e);else Se(F.__webglFramebuffer,w,S,n.COLOR_ATTACHMENT0,ae,0);m(S)&&h(ae),t.unbindTexture()}w.depthBuffer&&Ye(w)}function st(w){const S=w.textures;for(let F=0,K=S.length;F<K;F++){const Q=S[F];if(m(Q)){const X=A(w),be=i.get(Q).__webglTexture;t.bindTexture(X,be),h(X),t.unbindTexture()}}}const Be=[],C=[];function Ht(w){if(w.samples>0){if(ze(w)===!1){const S=w.textures,F=w.width,K=w.height;let Q=n.COLOR_BUFFER_BIT;const X=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,be=i.get(w),ae=S.length>1;if(ae)for(let _e=0;_e<S.length;_e++)t.bindFramebuffer(n.FRAMEBUFFER,be.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,be.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,be.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,be.__webglFramebuffer);for(let _e=0;_e<S.length;_e++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(Q|=n.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(Q|=n.STENCIL_BUFFER_BIT)),ae){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,be.__webglColorRenderbuffer[_e]);const Ve=i.get(S[_e]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ve,0)}n.blitFramebuffer(0,0,F,K,0,0,F,K,Q,n.NEAREST),l===!0&&(Be.length=0,C.length=0,Be.push(n.COLOR_ATTACHMENT0+_e),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Be.push(X),C.push(X),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,C)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Be))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ae)for(let _e=0;_e<S.length;_e++){t.bindFramebuffer(n.FRAMEBUFFER,be.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,be.__webglColorRenderbuffer[_e]);const Ve=i.get(S[_e]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,be.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,Ve,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,be.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const S=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function He(w){return Math.min(r.maxSamples,w.samples)}function ze(w){const S=i.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Me(w){const S=s.render.frame;d.get(w)!==S&&(d.set(w,S),w.update())}function rt(w,S){const F=w.colorSpace,K=w.format,Q=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||F!==Bi&&F!==Nn&&(qe.getTransfer(F)===$e?(K!==en||Q!==Mn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),S}function Ee(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=V,this.setTexture2D=$,this.setTexture2DArray=W,this.setTexture3D=J,this.setTextureCube=M,this.rebindTextures=Re,this.setupRenderTarget=ht,this.updateRenderTargetMipmap=st,this.updateMultisampleRenderTarget=Ht,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=ze}function cg(n,e){function t(i,r=Nn){let o;const s=qe.getTransfer(r);if(i===Mn)return n.UNSIGNED_BYTE;if(i===ya)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ba)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Vc)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Gc)return n.BYTE;if(i===Hc)return n.SHORT;if(i===sr)return n.UNSIGNED_SHORT;if(i===Sa)return n.INT;if(i===oi)return n.UNSIGNED_INT;if(i===xn)return n.FLOAT;if(i===bn)return n.HALF_FLOAT;if(i===Wc)return n.ALPHA;if(i===Xc)return n.RGB;if(i===en)return n.RGBA;if(i===qc)return n.LUMINANCE;if(i===Yc)return n.LUMINANCE_ALPHA;if(i===lr)return n.DEPTH_COMPONENT;if(i===cr)return n.DEPTH_STENCIL;if(i===Kc)return n.RED;if(i===Ea)return n.RED_INTEGER;if(i===jc)return n.RG;if(i===Ma)return n.RG_INTEGER;if(i===Ta)return n.RGBA_INTEGER;if(i===Kr||i===jr||i===Zr||i===$r)if(s===$e)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(i===Kr)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===jr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Zr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===$r)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(i===Kr)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===jr)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Zr)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===$r)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Rs||i===Ps||i===Ds||i===Ls)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(i===Rs)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ps)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ds)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ls)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Is||i===Ns||i===Us)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(i===Is||i===Ns)return s===$e?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(i===Us)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Os||i===Fs||i===ks||i===Bs||i===zs||i===Gs||i===Hs||i===Vs||i===Ws||i===Xs||i===qs||i===Ys||i===Ks||i===js)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(i===Os)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Fs)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ks)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Bs)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===zs)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Gs)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Hs)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Vs)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ws)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Xs)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===qs)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ys)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ks)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===js)return s===$e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Jr||i===Zs||i===$s)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(i===Jr)return s===$e?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Zs)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===$s)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Zc||i===Js||i===Qs||i===ea)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(i===Jr)return o.COMPRESSED_RED_RGTC1_EXT;if(i===Js)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Qs)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ea)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ar?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const ug=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,dg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class hg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new Ut,o=e.properties.get(r);o.__webglTexture=t.texture,(t.depthNear!==i.depthNear||t.depthFar!==i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new at({vertexShader:ug,fragmentShader:dg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Nt(new _r(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class fg extends li{constructor(e,t){super();const i=this;let r=null,o=1,s=null,a="local-floor",l=1,c=null,d=null,u=null,f=null,_=null,v=null;const x=new hg,m=t.getContextAttributes();let h=null,A=null;const g=[],E=[],I=new xe;let R=null;const P=new Bt;P.viewport=new Qe;const p=new Bt;p.viewport=new Qe;const T=[P,p],b=new Dh;let L=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let ne=g[q];return ne===void 0&&(ne=new qo,g[q]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(q){let ne=g[q];return ne===void 0&&(ne=new qo,g[q]=ne),ne.getGripSpace()},this.getHand=function(q){let ne=g[q];return ne===void 0&&(ne=new qo,g[q]=ne),ne.getHandSpace()};function G(q){const ne=E.indexOf(q.inputSource);if(ne===-1)return;const Se=g[ne];Se!==void 0&&(Se.update(q.inputSource,q.frame,c||s),Se.dispatchEvent({type:q.type,data:q.inputSource}))}function Z(){r.removeEventListener("select",G),r.removeEventListener("selectstart",G),r.removeEventListener("selectend",G),r.removeEventListener("squeeze",G),r.removeEventListener("squeezestart",G),r.removeEventListener("squeezeend",G),r.removeEventListener("end",Z),r.removeEventListener("inputsourceschange",$);for(let q=0;q<g.length;q++){const ne=E[q];ne!==null&&(E[q]=null,g[q].disconnect(ne))}L=null,V=null,x.reset(),e.setRenderTarget(h),_=null,f=null,u=null,r=null,A=null,et.stop(),i.isPresenting=!1,e.setPixelRatio(R),e.setSize(I.width,I.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){o=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||s},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return f!==null?f:_},this.getBinding=function(){return u},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(q){if(r=q,r!==null){if(h=e.getRenderTarget(),r.addEventListener("select",G),r.addEventListener("selectstart",G),r.addEventListener("selectend",G),r.addEventListener("squeeze",G),r.addEventListener("squeezestart",G),r.addEventListener("squeezeend",G),r.addEventListener("end",Z),r.addEventListener("inputsourceschange",$),m.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(I),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,se=null,Ae=null;m.depth&&(Ae=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=m.stencil?cr:lr,se=m.stencil?ar:oi);const Ye={colorFormat:t.RGBA8,depthFormat:Ae,scaleFactor:o};u=new XRWebGLBinding(r,t),f=u.createProjectionLayer(Ye),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),A=new zt(f.textureWidth,f.textureHeight,{format:en,type:Mn,depthTexture:new Ra(f.textureWidth,f.textureHeight,se,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const Se={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:o};_=new XRWebGLLayer(r,t,Se),r.updateRenderState({baseLayer:_}),e.setPixelRatio(1),e.setSize(_.framebufferWidth,_.framebufferHeight,!1),A=new zt(_.framebufferWidth,_.framebufferHeight,{format:en,type:Mn,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil,resolveDepthBuffer:_.ignoreDepthValues===!1,resolveStencilBuffer:_.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(l),c=null,s=await r.requestReferenceSpace(a),et.setContext(r),et.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function $(q){for(let ne=0;ne<q.removed.length;ne++){const Se=q.removed[ne],se=E.indexOf(Se);se>=0&&(E[se]=null,g[se].disconnect(Se))}for(let ne=0;ne<q.added.length;ne++){const Se=q.added[ne];let se=E.indexOf(Se);if(se===-1){for(let Ye=0;Ye<g.length;Ye++)if(Ye>=E.length){E.push(Se),se=Ye;break}else if(E[Ye]===null){E[Ye]=Se,se=Ye;break}if(se===-1)break}const Ae=g[se];Ae&&Ae.connect(Se)}}const W=new D,J=new D;function M(q,ne,Se){W.setFromMatrixPosition(ne.matrixWorld),J.setFromMatrixPosition(Se.matrixWorld);const se=W.distanceTo(J),Ae=ne.projectionMatrix.elements,Ye=Se.projectionMatrix.elements,Re=Ae[14]/(Ae[10]-1),ht=Ae[14]/(Ae[10]+1),st=(Ae[9]+1)/Ae[5],Be=(Ae[9]-1)/Ae[5],C=(Ae[8]-1)/Ae[0],Ht=(Ye[8]+1)/Ye[0],He=Re*C,ze=Re*Ht,Me=se/(-C+Ht),rt=Me*-C;if(ne.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(rt),q.translateZ(Me),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Ae[10]===-1)q.projectionMatrix.copy(ne.projectionMatrix),q.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{const Ee=Re+Me,w=ht+Me,S=He-rt,F=ze+(se-rt),K=st*ht/w*Ee,Q=Be*ht/w*Ee;q.projectionMatrix.makePerspective(S,F,K,Q,Ee,w),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function ie(q,ne){ne===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(ne.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(r===null)return;let ne=q.near,Se=q.far;x.texture!==null&&(x.depthNear>0&&(ne=x.depthNear),x.depthFar>0&&(Se=x.depthFar)),b.near=p.near=P.near=ne,b.far=p.far=P.far=Se,(L!==b.near||V!==b.far)&&(r.updateRenderState({depthNear:b.near,depthFar:b.far}),L=b.near,V=b.far),P.layers.mask=q.layers.mask|2,p.layers.mask=q.layers.mask|4,b.layers.mask=P.layers.mask|p.layers.mask;const se=q.parent,Ae=b.cameras;ie(b,se);for(let Ye=0;Ye<Ae.length;Ye++)ie(Ae[Ye],se);Ae.length===2?M(b,P,p):b.projectionMatrix.copy(P.projectionMatrix),he(q,b,se)};function he(q,ne,Se){Se===null?q.matrix.copy(ne.matrixWorld):(q.matrix.copy(Se.matrixWorld),q.matrix.invert(),q.matrix.multiply(ne.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(ne.projectionMatrix),q.projectionMatrixInverse.copy(ne.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=na*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(f===null&&_===null))return l},this.setFoveation=function(q){l=q,f!==null&&(f.fixedFoveation=q),_!==null&&_.fixedFoveation!==void 0&&(_.fixedFoveation=q)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(b)};let ye=null;function ke(q,ne){if(d=ne.getViewerPose(c||s),v=ne,d!==null){const Se=d.views;_!==null&&(e.setRenderTargetFramebuffer(A,_.framebuffer),e.setRenderTarget(A));let se=!1;Se.length!==b.cameras.length&&(b.cameras.length=0,se=!0);for(let Re=0;Re<Se.length;Re++){const ht=Se[Re];let st=null;if(_!==null)st=_.getViewport(ht);else{const C=u.getViewSubImage(f,ht);st=C.viewport,Re===0&&(e.setRenderTargetTextures(A,C.colorTexture,C.depthStencilTexture),e.setRenderTarget(A))}let Be=T[Re];Be===void 0&&(Be=new Bt,Be.layers.enable(Re),Be.viewport=new Qe,T[Re]=Be),Be.matrix.fromArray(ht.transform.matrix),Be.matrix.decompose(Be.position,Be.quaternion,Be.scale),Be.projectionMatrix.fromArray(ht.projectionMatrix),Be.projectionMatrixInverse.copy(Be.projectionMatrix).invert(),Be.viewport.set(st.x,st.y,st.width,st.height),Re===0&&(b.matrix.copy(Be.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),se===!0&&b.cameras.push(Be)}const Ae=r.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&u){const Re=u.getDepthInformation(Se[0]);Re&&Re.isValid&&Re.texture&&x.init(e,Re,r.renderState)}}for(let Se=0;Se<g.length;Se++){const se=E[Se],Ae=g[Se];se!==null&&Ae!==void 0&&Ae.update(se,ne,c||s)}ye&&ye(q,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),v=null}const et=new cu;et.setAnimationLoop(ke),this.setAnimationLoop=function(q){ye=q},this.dispose=function(){}}}const $n=new Tn,pg=new it;function _g(n,e){function t(m,h){m.matrixAutoUpdate===!0&&m.updateMatrix(),h.value.copy(m.matrix)}function i(m,h){h.color.getRGB(m.fogColor.value,iu(n)),h.isFog?(m.fogNear.value=h.near,m.fogFar.value=h.far):h.isFogExp2&&(m.fogDensity.value=h.density)}function r(m,h,A,g,E){h.isMeshBasicMaterial||h.isMeshLambertMaterial?o(m,h):h.isMeshToonMaterial?(o(m,h),u(m,h)):h.isMeshPhongMaterial?(o(m,h),d(m,h)):h.isMeshStandardMaterial?(o(m,h),f(m,h),h.isMeshPhysicalMaterial&&_(m,h,E)):h.isMeshMatcapMaterial?(o(m,h),v(m,h)):h.isMeshDepthMaterial?o(m,h):h.isMeshDistanceMaterial?(o(m,h),x(m,h)):h.isMeshNormalMaterial?o(m,h):h.isLineBasicMaterial?(s(m,h),h.isLineDashedMaterial&&a(m,h)):h.isPointsMaterial?l(m,h,A,g):h.isSpriteMaterial?c(m,h):h.isShadowMaterial?(m.color.value.copy(h.color),m.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function o(m,h){m.opacity.value=h.opacity,h.color&&m.diffuse.value.copy(h.color),h.emissive&&m.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(m.map.value=h.map,t(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.bumpMap&&(m.bumpMap.value=h.bumpMap,t(h.bumpMap,m.bumpMapTransform),m.bumpScale.value=h.bumpScale,h.side===Rt&&(m.bumpScale.value*=-1)),h.normalMap&&(m.normalMap.value=h.normalMap,t(h.normalMap,m.normalMapTransform),m.normalScale.value.copy(h.normalScale),h.side===Rt&&m.normalScale.value.negate()),h.displacementMap&&(m.displacementMap.value=h.displacementMap,t(h.displacementMap,m.displacementMapTransform),m.displacementScale.value=h.displacementScale,m.displacementBias.value=h.displacementBias),h.emissiveMap&&(m.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,m.emissiveMapTransform)),h.specularMap&&(m.specularMap.value=h.specularMap,t(h.specularMap,m.specularMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest);const A=e.get(h),g=A.envMap,E=A.envMapRotation;g&&(m.envMap.value=g,$n.copy(E),$n.x*=-1,$n.y*=-1,$n.z*=-1,g.isCubeTexture&&g.isRenderTargetTexture===!1&&($n.y*=-1,$n.z*=-1),m.envMapRotation.value.setFromMatrix4(pg.makeRotationFromEuler($n)),m.flipEnvMap.value=g.isCubeTexture&&g.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=h.reflectivity,m.ior.value=h.ior,m.refractionRatio.value=h.refractionRatio),h.lightMap&&(m.lightMap.value=h.lightMap,m.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,m.lightMapTransform)),h.aoMap&&(m.aoMap.value=h.aoMap,m.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,m.aoMapTransform))}function s(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,h.map&&(m.map.value=h.map,t(h.map,m.mapTransform))}function a(m,h){m.dashSize.value=h.dashSize,m.totalSize.value=h.dashSize+h.gapSize,m.scale.value=h.scale}function l(m,h,A,g){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.size.value=h.size*A,m.scale.value=g*.5,h.map&&(m.map.value=h.map,t(h.map,m.uvTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function c(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.rotation.value=h.rotation,h.map&&(m.map.value=h.map,t(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function d(m,h){m.specular.value.copy(h.specular),m.shininess.value=Math.max(h.shininess,1e-4)}function u(m,h){h.gradientMap&&(m.gradientMap.value=h.gradientMap)}function f(m,h){m.metalness.value=h.metalness,h.metalnessMap&&(m.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,m.metalnessMapTransform)),m.roughness.value=h.roughness,h.roughnessMap&&(m.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,m.roughnessMapTransform)),h.envMap&&(m.envMapIntensity.value=h.envMapIntensity)}function _(m,h,A){m.ior.value=h.ior,h.sheen>0&&(m.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),m.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(m.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,m.sheenColorMapTransform)),h.sheenRoughnessMap&&(m.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,m.sheenRoughnessMapTransform))),h.clearcoat>0&&(m.clearcoat.value=h.clearcoat,m.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(m.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,m.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(m.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Rt&&m.clearcoatNormalScale.value.negate())),h.dispersion>0&&(m.dispersion.value=h.dispersion),h.iridescence>0&&(m.iridescence.value=h.iridescence,m.iridescenceIOR.value=h.iridescenceIOR,m.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(m.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,m.iridescenceMapTransform)),h.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),h.transmission>0&&(m.transmission.value=h.transmission,m.transmissionSamplerMap.value=A.texture,m.transmissionSamplerSize.value.set(A.width,A.height),h.transmissionMap&&(m.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,m.transmissionMapTransform)),m.thickness.value=h.thickness,h.thicknessMap&&(m.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=h.attenuationDistance,m.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(m.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(m.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=h.specularIntensity,m.specularColor.value.copy(h.specularColor),h.specularColorMap&&(m.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,m.specularColorMapTransform)),h.specularIntensityMap&&(m.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,h){h.matcap&&(m.matcap.value=h.matcap)}function x(m,h){const A=e.get(h).light;m.referencePosition.value.setFromMatrixPosition(A.matrixWorld),m.nearDistance.value=A.shadow.camera.near,m.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function mg(n,e,t,i){let r={},o={},s=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(A,g){const E=g.program;i.uniformBlockBinding(A,E)}function c(A,g){let E=r[A.id];E===void 0&&(v(A),E=d(A),r[A.id]=E,A.addEventListener("dispose",m));const I=g.program;i.updateUBOMapping(A,I);const R=e.render.frame;o[A.id]!==R&&(f(A),o[A.id]=R)}function d(A){const g=u();A.__bindingPointIndex=g;const E=n.createBuffer(),I=A.__size,R=A.usage;return n.bindBuffer(n.UNIFORM_BUFFER,E),n.bufferData(n.UNIFORM_BUFFER,I,R),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,g,E),E}function u(){for(let A=0;A<a;A++)if(s.indexOf(A)===-1)return s.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(A){const g=r[A.id],E=A.uniforms,I=A.__cache;n.bindBuffer(n.UNIFORM_BUFFER,g);for(let R=0,P=E.length;R<P;R++){const p=Array.isArray(E[R])?E[R]:[E[R]];for(let T=0,b=p.length;T<b;T++){const L=p[T];if(_(L,R,T,I)===!0){const V=L.__offset,G=Array.isArray(L.value)?L.value:[L.value];let Z=0;for(let $=0;$<G.length;$++){const W=G[$],J=x(W);typeof W=="number"||typeof W=="boolean"?(L.__data[0]=W,n.bufferSubData(n.UNIFORM_BUFFER,V+Z,L.__data)):W.isMatrix3?(L.__data[0]=W.elements[0],L.__data[1]=W.elements[1],L.__data[2]=W.elements[2],L.__data[3]=0,L.__data[4]=W.elements[3],L.__data[5]=W.elements[4],L.__data[6]=W.elements[5],L.__data[7]=0,L.__data[8]=W.elements[6],L.__data[9]=W.elements[7],L.__data[10]=W.elements[8],L.__data[11]=0):(W.toArray(L.__data,Z),Z+=J.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,V,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function _(A,g,E,I){const R=A.value,P=g+"_"+E;if(I[P]===void 0)return typeof R=="number"||typeof R=="boolean"?I[P]=R:I[P]=R.clone(),!0;{const p=I[P];if(typeof R=="number"||typeof R=="boolean"){if(p!==R)return I[P]=R,!0}else if(p.equals(R)===!1)return p.copy(R),!0}return!1}function v(A){const g=A.uniforms;let E=0;const I=16;for(let P=0,p=g.length;P<p;P++){const T=Array.isArray(g[P])?g[P]:[g[P]];for(let b=0,L=T.length;b<L;b++){const V=T[b],G=Array.isArray(V.value)?V.value:[V.value];for(let Z=0,$=G.length;Z<$;Z++){const W=G[Z],J=x(W),M=E%I,ie=M%J.boundary,he=M+ie;E+=ie,he!==0&&I-he<J.storage&&(E+=I-he),V.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=E,E+=J.storage}}}const R=E%I;return R>0&&(E+=I-R),A.__size=E,A.__cache={},this}function x(A){const g={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(g.boundary=4,g.storage=4):A.isVector2?(g.boundary=8,g.storage=8):A.isVector3||A.isColor?(g.boundary=16,g.storage=12):A.isVector4?(g.boundary=16,g.storage=16):A.isMatrix3?(g.boundary=48,g.storage=48):A.isMatrix4?(g.boundary=64,g.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),g}function m(A){const g=A.target;g.removeEventListener("dispose",m);const E=s.indexOf(g.__bindingPointIndex);s.splice(E,1),n.deleteBuffer(r[g.id]),delete r[g.id],delete o[g.id]}function h(){for(const A in r)n.deleteBuffer(r[A]);s=[],r={},o={}}return{bind:l,update:c,dispose:h}}class gg{constructor(e={}){const{canvas:t=Yd(),context:i=null,depth:r=!0,stencil:o=!1,alpha:s=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let _;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=i.getContextAttributes().alpha}else _=s;const v=new Uint32Array(4),x=new Int32Array(4);let m=null,h=null;const A=[],g=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=kn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const E=this;let I=!1;this._outputColorSpace=qt;let R=0,P=0,p=null,T=-1,b=null;const L=new Qe,V=new Qe;let G=null;const Z=new fe(0);let $=0,W=t.width,J=t.height,M=1,ie=null,he=null;const ye=new Qe(0,0,W,J),ke=new Qe(0,0,W,J);let et=!1;const q=new Ca;let ne=!1,Se=!1;const se=new it,Ae=new it,Ye=new D,Re=new Qe,ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let st=!1;function Be(){return p===null?M:1}let C=i;function Ht(y,U){return t.getContext(y,U)}try{const y={alpha:!0,depth:r,stencil:o,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${xa}`),t.addEventListener("webglcontextlost",j,!1),t.addEventListener("webglcontextrestored",ue,!1),t.addEventListener("webglcontextcreationerror",ce,!1),C===null){const U="webgl2";if(C=Ht(U,y),C===null)throw Ht(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let He,ze,Me,rt,Ee,w,S,F,K,Q,X,be,ae,_e,Ve,te,me,Ce,De,ge,Ge,Ue,tt,N;function le(){He=new A_(C),He.init(),Ue=new cg(C,He),ze=new S_(C,He,e,Ue),Me=new ag(C,He),ze.reverseDepthBuffer&&f&&Me.buffers.depth.setReversed(!0),rt=new P_(C),Ee=new Km,w=new lg(C,He,Me,Ee,ze,Ue,rt),S=new b_(E),F=new w_(E),K=new Uh(C),tt=new v_(C,K),Q=new C_(C,K,rt,tt),X=new L_(C,Q,K,rt),De=new D_(C,ze,w),te=new y_(Ee),be=new Ym(E,S,F,He,ze,tt,te),ae=new _g(E,Ee),_e=new Zm,Ve=new ng(He),Ce=new g_(E,S,F,Me,X,_,l),me=new og(E,X,ze),N=new mg(C,rt,ze,Me),ge=new x_(C,He,rt),Ge=new R_(C,He,rt),rt.programs=be.programs,E.capabilities=ze,E.extensions=He,E.properties=Ee,E.renderLists=_e,E.shadowMap=me,E.state=Me,E.info=rt}le();const H=new fg(E,C);this.xr=H,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const y=He.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=He.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return M},this.setPixelRatio=function(y){y!==void 0&&(M=y,this.setSize(W,J,!1))},this.getSize=function(y){return y.set(W,J)},this.setSize=function(y,U,B=!0){if(H.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=y,J=U,t.width=Math.floor(y*M),t.height=Math.floor(U*M),B===!0&&(t.style.width=y+"px",t.style.height=U+"px"),this.setViewport(0,0,y,U)},this.getDrawingBufferSize=function(y){return y.set(W*M,J*M).floor()},this.setDrawingBufferSize=function(y,U,B){W=y,J=U,M=B,t.width=Math.floor(y*B),t.height=Math.floor(U*B),this.setViewport(0,0,y,U)},this.getCurrentViewport=function(y){return y.copy(L)},this.getViewport=function(y){return y.copy(ye)},this.setViewport=function(y,U,B,z){y.isVector4?ye.set(y.x,y.y,y.z,y.w):ye.set(y,U,B,z),Me.viewport(L.copy(ye).multiplyScalar(M).round())},this.getScissor=function(y){return y.copy(ke)},this.setScissor=function(y,U,B,z){y.isVector4?ke.set(y.x,y.y,y.z,y.w):ke.set(y,U,B,z),Me.scissor(V.copy(ke).multiplyScalar(M).round())},this.getScissorTest=function(){return et},this.setScissorTest=function(y){Me.setScissorTest(et=y)},this.setOpaqueSort=function(y){ie=y},this.setTransparentSort=function(y){he=y},this.getClearColor=function(y){return y.copy(Ce.getClearColor())},this.setClearColor=function(){Ce.setClearColor(...arguments)},this.getClearAlpha=function(){return Ce.getClearAlpha()},this.setClearAlpha=function(){Ce.setClearAlpha(...arguments)},this.clear=function(y=!0,U=!0,B=!0){let z=0;if(y){let O=!1;if(p!==null){const ee=p.texture.format;O=ee===Ta||ee===Ma||ee===Ea}if(O){const ee=p.texture.type,oe=ee===Mn||ee===oi||ee===sr||ee===ar||ee===ya||ee===ba,pe=Ce.getClearColor(),ve=Ce.getClearAlpha(),Le=pe.r,Pe=pe.g,Te=pe.b;oe?(v[0]=Le,v[1]=Pe,v[2]=Te,v[3]=ve,C.clearBufferuiv(C.COLOR,0,v)):(x[0]=Le,x[1]=Pe,x[2]=Te,x[3]=ve,C.clearBufferiv(C.COLOR,0,x))}else z|=C.COLOR_BUFFER_BIT}U&&(z|=C.DEPTH_BUFFER_BIT),B&&(z|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",j,!1),t.removeEventListener("webglcontextrestored",ue,!1),t.removeEventListener("webglcontextcreationerror",ce,!1),Ce.dispose(),_e.dispose(),Ve.dispose(),Ee.dispose(),S.dispose(),F.dispose(),X.dispose(),tt.dispose(),N.dispose(),be.dispose(),H.dispose(),H.removeEventListener("sessionstart",Ha),H.removeEventListener("sessionend",Va),Wn.stop()};function j(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function ue(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;const y=rt.autoReset,U=me.enabled,B=me.autoUpdate,z=me.needsUpdate,O=me.type;le(),rt.autoReset=y,me.enabled=U,me.autoUpdate=B,me.needsUpdate=z,me.type=O}function ce(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Ie(y){const U=y.target;U.removeEventListener("dispose",Ie),lt(U)}function lt(y){Mt(y),Ee.remove(y)}function Mt(y){const U=Ee.get(y).programs;U!==void 0&&(U.forEach(function(B){be.releaseProgram(B)}),y.isShaderMaterial&&be.releaseShaderCache(y))}this.renderBufferDirect=function(y,U,B,z,O,ee){U===null&&(U=ht);const oe=O.isMesh&&O.matrixWorld.determinant()<0,pe=Qu(y,U,B,z,O);Me.setMaterial(z,oe);let ve=B.index,Le=1;if(z.wireframe===!0){if(ve=Q.getWireframeAttribute(B),ve===void 0)return;Le=2}const Pe=B.drawRange,Te=B.attributes.position;let We=Pe.start*Le,Ke=(Pe.start+Pe.count)*Le;ee!==null&&(We=Math.max(We,ee.start*Le),Ke=Math.min(Ke,(ee.start+ee.count)*Le)),ve!==null?(We=Math.max(We,0),Ke=Math.min(Ke,ve.count)):Te!=null&&(We=Math.max(We,0),Ke=Math.min(Ke,Te.count));const _t=Ke-We;if(_t<0||_t===1/0)return;tt.setup(O,z,pe,B,ve);let ct,Xe=ge;if(ve!==null&&(ct=K.get(ve),Xe=Ge,Xe.setIndex(ct)),O.isMesh)z.wireframe===!0?(Me.setLineWidth(z.wireframeLinewidth*Be()),Xe.setMode(C.LINES)):Xe.setMode(C.TRIANGLES);else if(O.isLine){let we=z.linewidth;we===void 0&&(we=1),Me.setLineWidth(we*Be()),O.isLineSegments?Xe.setMode(C.LINES):O.isLineLoop?Xe.setMode(C.LINE_LOOP):Xe.setMode(C.LINE_STRIP)}else O.isPoints?Xe.setMode(C.POINTS):O.isSprite&&Xe.setMode(C.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)eo("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Xe.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(He.get("WEBGL_multi_draw"))Xe.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const we=O._multiDrawStarts,bt=O._multiDrawCounts,je=O._multiDrawCount,Kt=ve?K.get(ve).bytesPerElement:1,ui=Ee.get(z).currentProgram.getUniforms();for(let Ot=0;Ot<je;Ot++)ui.setValue(C,"_gl_DrawID",Ot),Xe.render(we[Ot]/Kt,bt[Ot])}else if(O.isInstancedMesh)Xe.renderInstances(We,_t,O.count);else if(B.isInstancedBufferGeometry){const we=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,bt=Math.min(B.instanceCount,we);Xe.renderInstances(We,_t,bt)}else Xe.render(We,_t)};function Ze(y,U,B){y.transparent===!0&&y.side===Jt&&y.forceSinglePass===!1?(y.side=Rt,y.needsUpdate=!0,gr(y,U,B),y.side=zn,y.needsUpdate=!0,gr(y,U,B),y.side=Jt):gr(y,U,B)}this.compile=function(y,U,B=null){B===null&&(B=y),h=Ve.get(B),h.init(U),g.push(h),B.traverseVisible(function(O){O.isLight&&O.layers.test(U.layers)&&(h.pushLight(O),O.castShadow&&h.pushShadow(O))}),y!==B&&y.traverseVisible(function(O){O.isLight&&O.layers.test(U.layers)&&(h.pushLight(O),O.castShadow&&h.pushShadow(O))}),h.setupLights();const z=new Set;return y.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const ee=O.material;if(ee)if(Array.isArray(ee))for(let oe=0;oe<ee.length;oe++){const pe=ee[oe];Ze(pe,B,O),z.add(pe)}else Ze(ee,B,O),z.add(ee)}),h=g.pop(),z},this.compileAsync=function(y,U,B=null){const z=this.compile(y,U,B);return new Promise(O=>{function ee(){if(z.forEach(function(oe){Ee.get(oe).currentProgram.isReady()&&z.delete(oe)}),z.size===0){O(y);return}setTimeout(ee,10)}He.get("KHR_parallel_shader_compile")!==null?ee():setTimeout(ee,10)})};let Yt=null;function un(y){Yt&&Yt(y)}function Ha(){Wn.stop()}function Va(){Wn.start()}const Wn=new cu;Wn.setAnimationLoop(un),typeof self<"u"&&Wn.setContext(self),this.setAnimationLoop=function(y){Yt=y,H.setAnimationLoop(y),y===null?Wn.stop():Wn.start()},H.addEventListener("sessionstart",Ha),H.addEventListener("sessionend",Va),this.render=function(y,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),H.enabled===!0&&H.isPresenting===!0&&(H.cameraAutoUpdate===!0&&H.updateCamera(U),U=H.getCamera()),y.isScene===!0&&y.onBeforeRender(E,y,U,p),h=Ve.get(y,g.length),h.init(U),g.push(h),Ae.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),q.setFromProjectionMatrix(Ae),Se=this.localClippingEnabled,ne=te.init(this.clippingPlanes,Se),m=_e.get(y,A.length),m.init(),A.push(m),H.enabled===!0&&H.isPresenting===!0){const ee=E.xr.getDepthSensingMesh();ee!==null&&Eo(ee,U,-1/0,E.sortObjects)}Eo(y,U,0,E.sortObjects),m.finish(),E.sortObjects===!0&&m.sort(ie,he),st=H.enabled===!1||H.isPresenting===!1||H.hasDepthSensing()===!1,st&&Ce.addToRenderList(m,y),this.info.render.frame++,ne===!0&&te.beginShadows();const B=h.state.shadowsArray;me.render(B,y,U),ne===!0&&te.endShadows(),this.info.autoReset===!0&&this.info.reset();const z=m.opaque,O=m.transmissive;if(h.setupLights(),U.isArrayCamera){const ee=U.cameras;if(O.length>0)for(let oe=0,pe=ee.length;oe<pe;oe++){const ve=ee[oe];Xa(z,O,y,ve)}st&&Ce.render(y);for(let oe=0,pe=ee.length;oe<pe;oe++){const ve=ee[oe];Wa(m,y,ve,ve.viewport)}}else O.length>0&&Xa(z,O,y,U),st&&Ce.render(y),Wa(m,y,U);p!==null&&P===0&&(w.updateMultisampleRenderTarget(p),w.updateRenderTargetMipmap(p)),y.isScene===!0&&y.onAfterRender(E,y,U),tt.resetDefaultState(),T=-1,b=null,g.pop(),g.length>0?(h=g[g.length-1],ne===!0&&te.setGlobalState(E.clippingPlanes,h.state.camera)):h=null,A.pop(),A.length>0?m=A[A.length-1]:m=null};function Eo(y,U,B,z){if(y.visible===!1)return;if(y.layers.test(U.layers)){if(y.isGroup)B=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(U);else if(y.isLight)h.pushLight(y),y.castShadow&&h.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||q.intersectsSprite(y)){z&&Re.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Ae);const oe=X.update(y),pe=y.material;pe.visible&&m.push(y,oe,pe,B,Re.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||q.intersectsObject(y))){const oe=X.update(y),pe=y.material;if(z&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Re.copy(y.boundingSphere.center)):(oe.boundingSphere===null&&oe.computeBoundingSphere(),Re.copy(oe.boundingSphere.center)),Re.applyMatrix4(y.matrixWorld).applyMatrix4(Ae)),Array.isArray(pe)){const ve=oe.groups;for(let Le=0,Pe=ve.length;Le<Pe;Le++){const Te=ve[Le],We=pe[Te.materialIndex];We&&We.visible&&m.push(y,oe,We,B,Re.z,Te)}}else pe.visible&&m.push(y,oe,pe,B,Re.z,null)}}const ee=y.children;for(let oe=0,pe=ee.length;oe<pe;oe++)Eo(ee[oe],U,B,z)}function Wa(y,U,B,z){const O=y.opaque,ee=y.transmissive,oe=y.transparent;h.setupLightsView(B),ne===!0&&te.setGlobalState(E.clippingPlanes,B),z&&Me.viewport(L.copy(z)),O.length>0&&mr(O,U,B),ee.length>0&&mr(ee,U,B),oe.length>0&&mr(oe,U,B),Me.buffers.depth.setTest(!0),Me.buffers.depth.setMask(!0),Me.buffers.color.setMask(!0),Me.setPolygonOffset(!1)}function Xa(y,U,B,z){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;h.state.transmissionRenderTarget[z.id]===void 0&&(h.state.transmissionRenderTarget[z.id]=new zt(1,1,{generateMipmaps:!0,type:He.has("EXT_color_buffer_half_float")||He.has("EXT_color_buffer_float")?bn:Mn,minFilter:ii,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:qe.workingColorSpace}));const ee=h.state.transmissionRenderTarget[z.id],oe=z.viewport||L;ee.setSize(oe.z*E.transmissionResolutionScale,oe.w*E.transmissionResolutionScale);const pe=E.getRenderTarget();E.setRenderTarget(ee),E.getClearColor(Z),$=E.getClearAlpha(),$<1&&E.setClearColor(16777215,.5),E.clear(),st&&Ce.render(B);const ve=E.toneMapping;E.toneMapping=kn;const Le=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),h.setupLightsView(z),ne===!0&&te.setGlobalState(E.clippingPlanes,z),mr(y,B,z),w.updateMultisampleRenderTarget(ee),w.updateRenderTargetMipmap(ee),He.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let Te=0,We=U.length;Te<We;Te++){const Ke=U[Te],_t=Ke.object,ct=Ke.geometry,Xe=Ke.material,we=Ke.group;if(Xe.side===Jt&&_t.layers.test(z.layers)){const bt=Xe.side;Xe.side=Rt,Xe.needsUpdate=!0,qa(_t,B,z,ct,Xe,we),Xe.side=bt,Xe.needsUpdate=!0,Pe=!0}}Pe===!0&&(w.updateMultisampleRenderTarget(ee),w.updateRenderTargetMipmap(ee))}E.setRenderTarget(pe),E.setClearColor(Z,$),Le!==void 0&&(z.viewport=Le),E.toneMapping=ve}function mr(y,U,B){const z=U.isScene===!0?U.overrideMaterial:null;for(let O=0,ee=y.length;O<ee;O++){const oe=y[O],pe=oe.object,ve=oe.geometry,Le=oe.group;let Pe=oe.material;Pe.allowOverride===!0&&z!==null&&(Pe=z),pe.layers.test(B.layers)&&qa(pe,U,B,ve,Pe,Le)}}function qa(y,U,B,z,O,ee){y.onBeforeRender(E,U,B,z,O,ee),y.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),O.onBeforeRender(E,U,B,z,y,ee),O.transparent===!0&&O.side===Jt&&O.forceSinglePass===!1?(O.side=Rt,O.needsUpdate=!0,E.renderBufferDirect(B,U,z,O,y,ee),O.side=zn,O.needsUpdate=!0,E.renderBufferDirect(B,U,z,O,y,ee),O.side=Jt):E.renderBufferDirect(B,U,z,O,y,ee),y.onAfterRender(E,U,B,z,O,ee)}function gr(y,U,B){U.isScene!==!0&&(U=ht);const z=Ee.get(y),O=h.state.lights,ee=h.state.shadowsArray,oe=O.state.version,pe=be.getParameters(y,O.state,ee,U,B),ve=be.getProgramCacheKey(pe);let Le=z.programs;z.environment=y.isMeshStandardMaterial?U.environment:null,z.fog=U.fog,z.envMap=(y.isMeshStandardMaterial?F:S).get(y.envMap||z.environment),z.envMapRotation=z.environment!==null&&y.envMap===null?U.environmentRotation:y.envMapRotation,Le===void 0&&(y.addEventListener("dispose",Ie),Le=new Map,z.programs=Le);let Pe=Le.get(ve);if(Pe!==void 0){if(z.currentProgram===Pe&&z.lightsStateVersion===oe)return Ka(y,pe),Pe}else pe.uniforms=be.getUniforms(y),y.onBeforeCompile(pe,E),Pe=be.acquireProgram(pe,ve),Le.set(ve,Pe),z.uniforms=pe.uniforms;const Te=z.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Te.clippingPlanes=te.uniform),Ka(y,pe),z.needsLights=td(y),z.lightsStateVersion=oe,z.needsLights&&(Te.ambientLightColor.value=O.state.ambient,Te.lightProbe.value=O.state.probe,Te.directionalLights.value=O.state.directional,Te.directionalLightShadows.value=O.state.directionalShadow,Te.spotLights.value=O.state.spot,Te.spotLightShadows.value=O.state.spotShadow,Te.rectAreaLights.value=O.state.rectArea,Te.ltc_1.value=O.state.rectAreaLTC1,Te.ltc_2.value=O.state.rectAreaLTC2,Te.pointLights.value=O.state.point,Te.pointLightShadows.value=O.state.pointShadow,Te.hemisphereLights.value=O.state.hemi,Te.directionalShadowMap.value=O.state.directionalShadowMap,Te.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Te.spotShadowMap.value=O.state.spotShadowMap,Te.spotLightMatrix.value=O.state.spotLightMatrix,Te.spotLightMap.value=O.state.spotLightMap,Te.pointShadowMap.value=O.state.pointShadowMap,Te.pointShadowMatrix.value=O.state.pointShadowMatrix),z.currentProgram=Pe,z.uniformsList=null,Pe}function Ya(y){if(y.uniformsList===null){const U=y.currentProgram.getUniforms();y.uniformsList=to.seqWithValue(U.seq,y.uniforms)}return y.uniformsList}function Ka(y,U){const B=Ee.get(y);B.outputColorSpace=U.outputColorSpace,B.batching=U.batching,B.batchingColor=U.batchingColor,B.instancing=U.instancing,B.instancingColor=U.instancingColor,B.instancingMorph=U.instancingMorph,B.skinning=U.skinning,B.morphTargets=U.morphTargets,B.morphNormals=U.morphNormals,B.morphColors=U.morphColors,B.morphTargetsCount=U.morphTargetsCount,B.numClippingPlanes=U.numClippingPlanes,B.numIntersection=U.numClipIntersection,B.vertexAlphas=U.vertexAlphas,B.vertexTangents=U.vertexTangents,B.toneMapping=U.toneMapping}function Qu(y,U,B,z,O){U.isScene!==!0&&(U=ht),w.resetTextureUnits();const ee=U.fog,oe=z.isMeshStandardMaterial?U.environment:null,pe=p===null?E.outputColorSpace:p.isXRRenderTarget===!0?p.texture.colorSpace:Bi,ve=(z.isMeshStandardMaterial?F:S).get(z.envMap||oe),Le=z.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Pe=!!B.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Te=!!B.morphAttributes.position,We=!!B.morphAttributes.normal,Ke=!!B.morphAttributes.color;let _t=kn;z.toneMapped&&(p===null||p.isXRRenderTarget===!0)&&(_t=E.toneMapping);const ct=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Xe=ct!==void 0?ct.length:0,we=Ee.get(z),bt=h.state.lights;if(ne===!0&&(Se===!0||y!==b)){const At=y===b&&z.id===T;te.setState(z,y,At)}let je=!1;z.version===we.__version?(we.needsLights&&we.lightsStateVersion!==bt.state.version||we.outputColorSpace!==pe||O.isBatchedMesh&&we.batching===!1||!O.isBatchedMesh&&we.batching===!0||O.isBatchedMesh&&we.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&we.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&we.instancing===!1||!O.isInstancedMesh&&we.instancing===!0||O.isSkinnedMesh&&we.skinning===!1||!O.isSkinnedMesh&&we.skinning===!0||O.isInstancedMesh&&we.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&we.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&we.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&we.instancingMorph===!1&&O.morphTexture!==null||we.envMap!==ve||z.fog===!0&&we.fog!==ee||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==te.numPlanes||we.numIntersection!==te.numIntersection)||we.vertexAlphas!==Le||we.vertexTangents!==Pe||we.morphTargets!==Te||we.morphNormals!==We||we.morphColors!==Ke||we.toneMapping!==_t||we.morphTargetsCount!==Xe)&&(je=!0):(je=!0,we.__version=z.version);let Kt=we.currentProgram;je===!0&&(Kt=gr(z,U,O));let ui=!1,Ot=!1,Xi=!1;const ot=Kt.getUniforms(),Vt=we.uniforms;if(Me.useProgram(Kt.program)&&(ui=!0,Ot=!0,Xi=!0),z.id!==T&&(T=z.id,Ot=!0),ui||b!==y){Me.buffers.depth.getReversed()?(se.copy(y.projectionMatrix),jd(se),Zd(se),ot.setValue(C,"projectionMatrix",se)):ot.setValue(C,"projectionMatrix",y.projectionMatrix),ot.setValue(C,"viewMatrix",y.matrixWorldInverse);const Dt=ot.map.cameraPosition;Dt!==void 0&&Dt.setValue(C,Ye.setFromMatrixPosition(y.matrixWorld)),ze.logarithmicDepthBuffer&&ot.setValue(C,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&ot.setValue(C,"isOrthographic",y.isOrthographicCamera===!0),b!==y&&(b=y,Ot=!0,Xi=!0)}if(O.isSkinnedMesh){ot.setOptional(C,O,"bindMatrix"),ot.setOptional(C,O,"bindMatrixInverse");const At=O.skeleton;At&&(At.boneTexture===null&&At.computeBoneTexture(),ot.setValue(C,"boneTexture",At.boneTexture,w))}O.isBatchedMesh&&(ot.setOptional(C,O,"batchingTexture"),ot.setValue(C,"batchingTexture",O._matricesTexture,w),ot.setOptional(C,O,"batchingIdTexture"),ot.setValue(C,"batchingIdTexture",O._indirectTexture,w),ot.setOptional(C,O,"batchingColorTexture"),O._colorsTexture!==null&&ot.setValue(C,"batchingColorTexture",O._colorsTexture,w));const Wt=B.morphAttributes;if((Wt.position!==void 0||Wt.normal!==void 0||Wt.color!==void 0)&&De.update(O,B,Kt),(Ot||we.receiveShadow!==O.receiveShadow)&&(we.receiveShadow=O.receiveShadow,ot.setValue(C,"receiveShadow",O.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(Vt.envMap.value=ve,Vt.flipEnvMap.value=ve.isCubeTexture&&ve.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&U.environment!==null&&(Vt.envMapIntensity.value=U.environmentIntensity),Ot&&(ot.setValue(C,"toneMappingExposure",E.toneMappingExposure),we.needsLights&&ed(Vt,Xi),ee&&z.fog===!0&&ae.refreshFogUniforms(Vt,ee),ae.refreshMaterialUniforms(Vt,z,M,J,h.state.transmissionRenderTarget[y.id]),to.upload(C,Ya(we),Vt,w)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(to.upload(C,Ya(we),Vt,w),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&ot.setValue(C,"center",O.center),ot.setValue(C,"modelViewMatrix",O.modelViewMatrix),ot.setValue(C,"normalMatrix",O.normalMatrix),ot.setValue(C,"modelMatrix",O.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){const At=z.uniformsGroups;for(let Dt=0,Mo=At.length;Dt<Mo;Dt++){const Xn=At[Dt];N.update(Xn,Kt),N.bind(Xn,Kt)}}return Kt}function ed(y,U){y.ambientLightColor.needsUpdate=U,y.lightProbe.needsUpdate=U,y.directionalLights.needsUpdate=U,y.directionalLightShadows.needsUpdate=U,y.pointLights.needsUpdate=U,y.pointLightShadows.needsUpdate=U,y.spotLights.needsUpdate=U,y.spotLightShadows.needsUpdate=U,y.rectAreaLights.needsUpdate=U,y.hemisphereLights.needsUpdate=U}function td(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return p},this.setRenderTargetTextures=function(y,U,B){const z=Ee.get(y);z.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),Ee.get(y.texture).__webglTexture=U,Ee.get(y.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:B,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,U){const B=Ee.get(y);B.__webglFramebuffer=U,B.__useDefaultFramebuffer=U===void 0};const nd=C.createFramebuffer();this.setRenderTarget=function(y,U=0,B=0){p=y,R=U,P=B;let z=!0,O=null,ee=!1,oe=!1;if(y){const ve=Ee.get(y);if(ve.__useDefaultFramebuffer!==void 0)Me.bindFramebuffer(C.FRAMEBUFFER,null),z=!1;else if(ve.__webglFramebuffer===void 0)w.setupRenderTarget(y);else if(ve.__hasExternalTextures)w.rebindTextures(y,Ee.get(y.texture).__webglTexture,Ee.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Te=y.depthTexture;if(ve.__boundDepthTexture!==Te){if(Te!==null&&Ee.has(Te)&&(y.width!==Te.image.width||y.height!==Te.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(y)}}const Le=y.texture;(Le.isData3DTexture||Le.isDataArrayTexture||Le.isCompressedArrayTexture)&&(oe=!0);const Pe=Ee.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Pe[U])?O=Pe[U][B]:O=Pe[U],ee=!0):y.samples>0&&w.useMultisampledRTT(y)===!1?O=Ee.get(y).__webglMultisampledFramebuffer:Array.isArray(Pe)?O=Pe[B]:O=Pe,L.copy(y.viewport),V.copy(y.scissor),G=y.scissorTest}else L.copy(ye).multiplyScalar(M).floor(),V.copy(ke).multiplyScalar(M).floor(),G=et;if(B!==0&&(O=nd),Me.bindFramebuffer(C.FRAMEBUFFER,O)&&z&&Me.drawBuffers(y,O),Me.viewport(L),Me.scissor(V),Me.setScissorTest(G),ee){const ve=Ee.get(y.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+U,ve.__webglTexture,B)}else if(oe){const ve=Ee.get(y.texture),Le=U;C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,ve.__webglTexture,B,Le)}else if(y!==null&&B!==0){const ve=Ee.get(y.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,ve.__webglTexture,B)}T=-1},this.readRenderTargetPixels=function(y,U,B,z,O,ee,oe){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let pe=Ee.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&oe!==void 0&&(pe=pe[oe]),pe){Me.bindFramebuffer(C.FRAMEBUFFER,pe);try{const ve=y.texture,Le=ve.format,Pe=ve.type;if(!ze.textureFormatReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ze.textureTypeReadable(Pe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=y.width-z&&B>=0&&B<=y.height-O&&C.readPixels(U,B,z,O,Ue.convert(Le),Ue.convert(Pe),ee)}finally{const ve=p!==null?Ee.get(p).__webglFramebuffer:null;Me.bindFramebuffer(C.FRAMEBUFFER,ve)}}},this.readRenderTargetPixelsAsync=async function(y,U,B,z,O,ee,oe){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let pe=Ee.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&oe!==void 0&&(pe=pe[oe]),pe)if(U>=0&&U<=y.width-z&&B>=0&&B<=y.height-O){Me.bindFramebuffer(C.FRAMEBUFFER,pe);const ve=y.texture,Le=ve.format,Pe=ve.type;if(!ze.textureFormatReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ze.textureTypeReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Te=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,Te),C.bufferData(C.PIXEL_PACK_BUFFER,ee.byteLength,C.STREAM_READ),C.readPixels(U,B,z,O,Ue.convert(Le),Ue.convert(Pe),0);const We=p!==null?Ee.get(p).__webglFramebuffer:null;Me.bindFramebuffer(C.FRAMEBUFFER,We);const Ke=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await Kd(C,Ke,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,Te),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,ee),C.deleteBuffer(Te),C.deleteSync(Ke),ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,U=null,B=0){const z=Math.pow(2,-B),O=Math.floor(y.image.width*z),ee=Math.floor(y.image.height*z),oe=U!==null?U.x:0,pe=U!==null?U.y:0;w.setTexture2D(y,0),C.copyTexSubImage2D(C.TEXTURE_2D,B,0,0,oe,pe,O,ee),Me.unbindTexture()};const id=C.createFramebuffer(),rd=C.createFramebuffer();this.copyTextureToTexture=function(y,U,B=null,z=null,O=0,ee=null){ee===null&&(O!==0?(eo("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ee=O,O=0):ee=0);let oe,pe,ve,Le,Pe,Te,We,Ke,_t;const ct=y.isCompressedTexture?y.mipmaps[ee]:y.image;if(B!==null)oe=B.max.x-B.min.x,pe=B.max.y-B.min.y,ve=B.isBox3?B.max.z-B.min.z:1,Le=B.min.x,Pe=B.min.y,Te=B.isBox3?B.min.z:0;else{const Wt=Math.pow(2,-O);oe=Math.floor(ct.width*Wt),pe=Math.floor(ct.height*Wt),y.isDataArrayTexture?ve=ct.depth:y.isData3DTexture?ve=Math.floor(ct.depth*Wt):ve=1,Le=0,Pe=0,Te=0}z!==null?(We=z.x,Ke=z.y,_t=z.z):(We=0,Ke=0,_t=0);const Xe=Ue.convert(U.format),we=Ue.convert(U.type);let bt;U.isData3DTexture?(w.setTexture3D(U,0),bt=C.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(w.setTexture2DArray(U,0),bt=C.TEXTURE_2D_ARRAY):(w.setTexture2D(U,0),bt=C.TEXTURE_2D),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,U.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,U.unpackAlignment);const je=C.getParameter(C.UNPACK_ROW_LENGTH),Kt=C.getParameter(C.UNPACK_IMAGE_HEIGHT),ui=C.getParameter(C.UNPACK_SKIP_PIXELS),Ot=C.getParameter(C.UNPACK_SKIP_ROWS),Xi=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,ct.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,ct.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Le),C.pixelStorei(C.UNPACK_SKIP_ROWS,Pe),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Te);const ot=y.isDataArrayTexture||y.isData3DTexture,Vt=U.isDataArrayTexture||U.isData3DTexture;if(y.isDepthTexture){const Wt=Ee.get(y),At=Ee.get(U),Dt=Ee.get(Wt.__renderTarget),Mo=Ee.get(At.__renderTarget);Me.bindFramebuffer(C.READ_FRAMEBUFFER,Dt.__webglFramebuffer),Me.bindFramebuffer(C.DRAW_FRAMEBUFFER,Mo.__webglFramebuffer);for(let Xn=0;Xn<ve;Xn++)ot&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Ee.get(y).__webglTexture,O,Te+Xn),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Ee.get(U).__webglTexture,ee,_t+Xn)),C.blitFramebuffer(Le,Pe,oe,pe,We,Ke,oe,pe,C.DEPTH_BUFFER_BIT,C.NEAREST);Me.bindFramebuffer(C.READ_FRAMEBUFFER,null),Me.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(O!==0||y.isRenderTargetTexture||Ee.has(y)){const Wt=Ee.get(y),At=Ee.get(U);Me.bindFramebuffer(C.READ_FRAMEBUFFER,id),Me.bindFramebuffer(C.DRAW_FRAMEBUFFER,rd);for(let Dt=0;Dt<ve;Dt++)ot?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Wt.__webglTexture,O,Te+Dt):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Wt.__webglTexture,O),Vt?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,At.__webglTexture,ee,_t+Dt):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,At.__webglTexture,ee),O!==0?C.blitFramebuffer(Le,Pe,oe,pe,We,Ke,oe,pe,C.COLOR_BUFFER_BIT,C.NEAREST):Vt?C.copyTexSubImage3D(bt,ee,We,Ke,_t+Dt,Le,Pe,oe,pe):C.copyTexSubImage2D(bt,ee,We,Ke,Le,Pe,oe,pe);Me.bindFramebuffer(C.READ_FRAMEBUFFER,null),Me.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else Vt?y.isDataTexture||y.isData3DTexture?C.texSubImage3D(bt,ee,We,Ke,_t,oe,pe,ve,Xe,we,ct.data):U.isCompressedArrayTexture?C.compressedTexSubImage3D(bt,ee,We,Ke,_t,oe,pe,ve,Xe,ct.data):C.texSubImage3D(bt,ee,We,Ke,_t,oe,pe,ve,Xe,we,ct):y.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,ee,We,Ke,oe,pe,Xe,we,ct.data):y.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,ee,We,Ke,ct.width,ct.height,Xe,ct.data):C.texSubImage2D(C.TEXTURE_2D,ee,We,Ke,oe,pe,Xe,we,ct);C.pixelStorei(C.UNPACK_ROW_LENGTH,je),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Kt),C.pixelStorei(C.UNPACK_SKIP_PIXELS,ui),C.pixelStorei(C.UNPACK_SKIP_ROWS,Ot),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Xi),ee===0&&U.generateMipmaps&&C.generateMipmap(bt),Me.unbindTexture()},this.copyTextureToTexture3D=function(y,U,B=null,z=null,O=0){return eo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(y,U,B,z,O)},this.initRenderTarget=function(y){Ee.get(y).__webglFramebuffer===void 0&&w.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?w.setTextureCube(y,0):y.isData3DTexture?w.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?w.setTexture2DArray(y,0):w.setTexture2D(y,0),Me.unbindTexture()},this.resetState=function(){R=0,P=0,p=null,Me.reset(),tt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Sn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=qe._getUnpackColorSpace()}}const wn=`vec3 modulo289Vec3(vec3 value) {\r
    return value - floor(value * (1.0 / 289.0)) * 289.0;\r
}\r
\r
vec4 modulo289Vec4(vec4 value) {\r
    return value - floor(value * (1.0 / 289.0)) * 289.0;\r
}\r
\r
vec4 permute(vec4 value) {\r
    return modulo289Vec4(((value * 34.0) + 10.0) * value);\r
}\r
\r
vec4 taylorInverseSqrt(vec4 value) {\r
    return 1.79284291400159 - 0.85373472095314 * value;\r
}\r
\r
float simplexNoise(vec3 position) {\r
    const vec2 SKEW_CONSTANTS  = vec2(1.0 / 6.0, 1.0 / 3.0);\r
    const vec4 HELPER_CONSTANTS = vec4(0.0, 0.5, 1.0, 2.0);\r
\r
    vec3 lattice_point = floor(position + dot(position, SKEW_CONSTANTS.yyy));\r
    vec3 offset_0 = position - lattice_point + dot(lattice_point, SKEW_CONSTANTS.xxx);\r
\r
    vec3 greater_mask = step(offset_0.yzx, offset_0.xyz);\r
    vec3 lesser_mask = 1.0 - greater_mask;\r
    vec3 corner_offset_1 = min(greater_mask.xyz, lesser_mask.zxy);\r
    vec3 corner_offset_2 = max(greater_mask.xyz, lesser_mask.zxy);\r
\r
    vec3 offset_1 = offset_0 - corner_offset_1 + SKEW_CONSTANTS.xxx;\r
    vec3 offset_2 = offset_0 - corner_offset_2 + SKEW_CONSTANTS.yyy;\r
    vec3 offset_3 = offset_0 - HELPER_CONSTANTS.yyy;\r
\r
    lattice_point = modulo289Vec3(lattice_point);\r
    vec4 permutation = permute(permute(permute(\r
        lattice_point.z + vec4(0.0, corner_offset_1.z, corner_offset_2.z, 1.0)) +\r
        lattice_point.y + vec4(0.0, corner_offset_1.y, corner_offset_2.y, 1.0)) +\r
        lattice_point.x + vec4(0.0, corner_offset_1.x, corner_offset_2.x, 1.0));\r
\r
    float one_seventh = 0.142857142857;\r
    vec3  gradient_scale = one_seventh * HELPER_CONSTANTS.wyz - HELPER_CONSTANTS.xzx;\r
\r
    vec4 gradient_index = permutation - 49.0 * floor(permutation * gradient_scale.z * gradient_scale.z);\r
    vec4 floor_x = floor(gradient_index * gradient_scale.z);\r
    vec4 floor_y = floor(gradient_index - 7.0 * floor_x);\r
\r
    vec4 gradient_x = floor_x * gradient_scale.x + gradient_scale.yyyy;\r
    vec4 gradient_y = floor_y * gradient_scale.x + gradient_scale.yyyy;\r
    vec4 gradient_z = 1.0 - abs(gradient_x) - abs(gradient_y);\r
\r
    vec4 base_gradient_0 = vec4(gradient_x.xy, gradient_y.xy);\r
    vec4 base_gradient_1 = vec4(gradient_x.zw, gradient_y.zw);\r
\r
    vec4 sign_correction_0 = floor(base_gradient_0) * 2.0 + 1.0;\r
    vec4 sign_correction_1 = floor(base_gradient_1) * 2.0 + 1.0;\r
    vec4 height_sign = -step(gradient_z, vec4(0.0));\r
\r
    vec4 adjusted_gradient_0 = base_gradient_0.xzyw + sign_correction_0.xzyw * height_sign.xxyy;\r
    vec4 adjusted_gradient_1 = base_gradient_1.xzyw + sign_correction_1.xzyw * height_sign.zzww;\r
\r
    vec3 corner_gradient_0 = vec3(adjusted_gradient_0.xy, gradient_z.x);\r
    vec3 corner_gradient_1 = vec3(adjusted_gradient_0.zw, gradient_z.y);\r
    vec3 corner_gradient_2 = vec3(adjusted_gradient_1.xy, gradient_z.z);\r
    vec3 corner_gradient_3 = vec3(adjusted_gradient_1.zw, gradient_z.w);\r
\r
    vec4 normalization = taylorInverseSqrt(vec4(\r
        dot(corner_gradient_0, corner_gradient_0),\r
        dot(corner_gradient_1, corner_gradient_1),\r
        dot(corner_gradient_2, corner_gradient_2),\r
        dot(corner_gradient_3, corner_gradient_3)));\r
    corner_gradient_0 *= normalization.x;\r
    corner_gradient_1 *= normalization.y;\r
    corner_gradient_2 *= normalization.z;\r
    corner_gradient_3 *= normalization.w;\r
\r
    vec4 falloff = max(0.6 - vec4(\r
        dot(offset_0, offset_0),\r
        dot(offset_1, offset_1),\r
        dot(offset_2, offset_2),\r
        dot(offset_3, offset_3)), 0.0);\r
    falloff = falloff * falloff;\r
    return 42.0 * dot(falloff * falloff, vec4(\r
        dot(corner_gradient_0, offset_0),\r
        dot(corner_gradient_1, offset_1),\r
        dot(corner_gradient_2, offset_2),\r
        dot(corner_gradient_3, offset_3)));\r
}\r
\r
float fractalBrownianMotion(vec3 position) {\r
    float value = 0.0;\r
    float amplitude = 0.5;\r
    for (int octave = 0; octave < 4; octave++) {\r
        value += amplitude * simplexNoise(position);\r
        position  *= 2.1;\r
        amplitude *= 0.5;\r
    }\r
    return value;\r
}\r
\r
// Remaps fractalBrownianMotion()'s [-1, 1] output to [0, 1] for mix/smoothstep use.\r
float normalizedFractalBrownianMotion(vec3 position) {\r
    return fractalBrownianMotion(position) * 0.5 + 0.5;\r
}\r
\r
// Extra simplex-displaced fbm pass, for churning turbulence instead of one smooth layer.\r
// Shared by the lava crust and the sun's plasma surface.\r
float warpedFractalBrownianMotion(vec3 position, float warp_strength) {\r
    vec3 warped = position + warp_strength * vec3(\r
        simplexNoise(position + vec3(1.7, 9.2, 0.0)),\r
        simplexNoise(position + vec3(8.3, 2.8, 0.0)),\r
        simplexNoise(position + vec3(0.0, 5.1, 3.4))\r
    );\r
    return normalizedFractalBrownianMotion(warped);\r
}\r
\r
// Displaces \`position\` (already scaled by \`frequency\`) so crack patterns read as jagged veins\r
// instead of straight lines. Shared by the ground/metaball/volcano crack layers.\r
vec3 crackWarpOffset(vec3 position, float frequency) {\r
    return vec3(\r
        simplexNoise(position * frequency * 0.6 + vec3(1.7, 9.2, 0.0)),\r
        simplexNoise(position * frequency * 0.6 + vec3(8.3, 2.8, 0.0)),\r
        simplexNoise(position * frequency * 0.6 + vec3(3.1, 0.0, 5.4))\r
    );\r
}\r
\r
// One-sided crack-vein displacement driving the volcano's jagged rock geometry. Also blended\r
// into the ground near the volcano's foot so the terrain shape matches at the seam.\r
float crackDisplacementLayer(vec3 position, float frequency) {\r
    vec3 warp = crackWarpOffset(position, frequency);\r
    float noise_value = abs(simplexNoise((position + warp * 1.2) * frequency));\r
    return pow(noise_value, 0.18);\r
}\r
\r
float crackDisplacementNoise(vec3 position, float frequency) {\r
    float accumulated_noise = 0.0, amplitude = 1.0, weight_total = 0.0;\r
    for (int i = 0; i < 3; i++) {\r
        accumulated_noise += crackDisplacementLayer(position, frequency) * amplitude;\r
        weight_total += amplitude;\r
        position  *= 2.1;\r
        amplitude *= 0.45;\r
    }\r
    return accumulated_noise / weight_total;\r
}\r
\r
// \`crack_width\` is solid around the noise's zero-crossing, blending to rock only in its outer 15%.\r
// \`frequency\` is modulated by a slow noise field so crack size varies across the terrain.\r
float crackPattern(vec3 position, float frequency, float crack_width) {\r
    const float FREQUENCY_MODULATION_BASE  = 0.6;\r
    const float FREQUENCY_MODULATION_RANGE = 0.8;\r
    const float CRACK_EDGE_RATIO = 0.15;\r
\r
    float scale_variation = simplexNoise(position * 0.05) * 0.5 + 0.5;\r
    float local_frequency = frequency * (FREQUENCY_MODULATION_BASE + FREQUENCY_MODULATION_RANGE * scale_variation);\r
    vec3 warp = crackWarpOffset(position, local_frequency);\r
    float distance_from_crack = abs(simplexNoise((position + warp * 1.2) * local_frequency));\r
    float edge = crack_width * CRACK_EDGE_RATIO;\r
    return smoothstep(crack_width - edge, crack_width + edge, distance_from_crack);\r
}\r
\r
// Blends three crack colors via two independent noise fields at different frequencies/offsets;\r
// crack_color_3 uses squared noise so it appears as isolated accent patches, not a linear slide.\r
vec3 blendCrackColors(vec3 crack_color, vec3 crack_color_2, vec3 crack_color_3, vec3 world_position) {\r
    float base_blend = normalizedFractalBrownianMotion(world_position * 0.6);\r
    vec3 base_color = mix(crack_color, crack_color_2, base_blend);\r
\r
    float accent_blend = normalizedFractalBrownianMotion(world_position * 1.1 + vec3(52.1, 14.7, 8.3));\r
    return mix(base_color, crack_color_3, accent_blend * accent_blend);\r
}\r
\r
// Like blendCrackColors, but at the terrain's own displacement frequency (so patches line up with\r
// hills). Narrow smoothstep bands (instead of a plain linear mix) keep most of each patch a pure\r
// color, so the four rock types read as distinct instead of mostly-blended.\r
vec3 blendTerrainColors(vec3 rock_color, vec3 rock_color_2, vec3 rock_color_3, vec3 rock_color_4, vec3 world_position, float frequency) {\r
    float base_blend = normalizedFractalBrownianMotion(world_position * frequency);\r
    vec3 color = mix(rock_color, rock_color_2, smoothstep(0.4, 0.6, base_blend));\r
\r
    float accent_blend = normalizedFractalBrownianMotion(world_position * frequency * 1.8 + vec3(52.1, 14.7, 8.3));\r
    color = mix(color, rock_color_3, smoothstep(0.4, 0.6, accent_blend));\r
\r
    // higher threshold than the other two, so rock_color_4 covers less area\r
    float fourth_blend = normalizedFractalBrownianMotion(world_position * frequency * 1.4 + vec3(-33.7, 21.3, 9.6));\r
    return mix(color, rock_color_4, smoothstep(0.72, 0.82, fourth_blend));\r
}\r
\r
// Mask for the ground's sun-focus boost zone: a trapezoid from the volcano out to one fixed side\r
// (not tied to the sun's real position, so it stays put as the sun orbits), narrow at the volcano\r
// and widening out to \`radius\`.\r
float sunFocusTrapezoidMask(vec3 world_position, vec3 volcano_position, float radius) {\r
    vec2 trapezoid_forward = vec2(1.0, 0.0);\r
    vec2 trapezoid_right = vec2(-trapezoid_forward.y, trapezoid_forward.x);\r
    vec2 volcano_relative_position = world_position.xz - volcano_position.xz;\r
    float trapezoid_forward_distance = dot(volcano_relative_position, trapezoid_forward);\r
    float trapezoid_lateral_distance = abs(dot(volcano_relative_position, trapezoid_right));\r
    float trapezoid_edge_softness = max(radius * 0.15, 0.3);\r
    float trapezoid_length_mask = smoothstep(-trapezoid_edge_softness, trapezoid_edge_softness, trapezoid_forward_distance)\r
        * (1.0 - smoothstep(radius - trapezoid_edge_softness, radius + trapezoid_edge_softness, trapezoid_forward_distance));\r
    float trapezoid_progress = clamp(trapezoid_forward_distance / radius, 0.0, 1.0);\r
    float trapezoid_half_width = mix(radius * 0.25, radius, trapezoid_progress);\r
    float trapezoid_width_mask = 1.0 - smoothstep(trapezoid_half_width - trapezoid_edge_softness, trapezoid_half_width + trapezoid_edge_softness, trapezoid_lateral_distance);\r
    return trapezoid_length_mask * trapezoid_width_mask;\r
}\r
\r
// Sun-facing wash plus a fresnel rim highlight at the silhouette. Shared by the ground and volcano.\r
float sunDiffuseTerm(vec3 normal, vec3 view_direction, vec3 sun_direction, float sun_focus) {\r
    float sun_facing = max(dot(normal, sun_direction), 0.0);\r
    float sun_wash = pow(sun_facing, sun_focus) * 0.2;\r
    // capped like sun_wash, or this blows out at any grazing view angle (pow(1.0, x) == 1.0)\r
    float sun_rim = pow(1.0 - max(dot(normal, view_direction), 0.0), sun_focus) * sun_facing * 0.2;\r
    return sun_wash + sun_rim;\r
}\r
\r
// \`height\` is roughly [-1, 1]; smoothstep since the noise driving it clusters near 0.\r
float heightAmbientOcclusion(float height) {\r
    const float MIN_OCCLUSION = 0.6;\r
    const float CONTRAST_BAND = 0.35;\r
    return mix(MIN_OCCLUSION, 1.0, smoothstep(-CONTRAST_BAND, CONTRAST_BAND, height));\r
}\r
\r
// Independent simplex sample per axis, for a shading-normal perturbation. Shared by the ground\r
// and lava crust bump mapping.\r
vec3 bumpOffset(vec3 world_position, float scale) {\r
    vec3 coordinate = world_position * scale;\r
    return vec3(\r
        simplexNoise(coordinate + vec3(0.0, 0.0, 1.7)),\r
        simplexNoise(coordinate + vec3(1.3, 0.0, 0.0)),\r
        simplexNoise(coordinate + vec3(0.0, 2.1, 0.0))\r
    );\r
}\r
`,vg=`#include <common>\r
#include <shadowmap_pars_vertex>\r
\r
uniform float u_displacement_scale;\r
uniform float u_displacement_frequency;\r
uniform vec3  u_volcano_position;\r
uniform float u_proximity_radius;\r
uniform float u_volcano_crack_scale;\r
uniform float u_volcano_crack_frequency;\r
\r
varying vec3 v_world_position;\r
varying vec3 v_view_position;\r
varying vec3 v_normal;\r
varying float v_bump;\r
\r
void main() {\r
    vec3 flat_world_position = (modelMatrix * vec4(position, 1.0)).xyz;\r
    float volcano_distance = length(flat_world_position.xz - u_volcano_position.xz);\r
    float proximity = 1.0 - smoothstep(0.0, u_proximity_radius, volcano_distance);\r
\r
    // symmetric around zero (unlike the volcano's one-sided crack dents), so the average height stays put\r
    float bump = warpedFractalBrownianMotion(position * u_displacement_frequency, 0.6) * 2.0 - 1.0;\r
\r
    // re-centered the same way as \`bump\`, so blending it in changes character, not average height\r
    float volcano_style_bump = crackDisplacementNoise(flat_world_position, u_volcano_crack_frequency) * 2.0 - 1.0;\r
    bump = mix(bump, volcano_style_bump, proximity);\r
\r
    vec3 displaced = position + normal * bump * mix(u_displacement_scale, u_volcano_crack_scale, proximity);\r
    v_bump = bump;\r
\r
    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);\r
    v_world_position = worldPosition.xyz;\r
    vec4 view_position = modelViewMatrix * vec4(displaced, 1.0);\r
    v_view_position = view_position.xyz;\r
    v_normal = normalMatrix * normal;\r
\r
    // Names must match THREE's shadowmap_vertex chunk exactly.\r
    vec3 transformedNormal = v_normal;\r
    #include <shadowmap_vertex>\r
\r
    gl_Position = projectionMatrix * view_position;\r
}\r
`,xg=`uniform bool receiveShadow;\r
\r
#include <common>\r
#include <packing>\r
#include <shadowmap_pars_fragment>\r
#include <shadowmask_pars_fragment>\r
\r
uniform float u_time;\r
uniform vec3  u_light_position;\r
uniform vec3  u_sun_position;\r
uniform vec3  u_sun_color;\r
uniform float u_sun_enabled;\r
uniform float u_sun_strength;\r
uniform float u_sun_focus;\r
uniform float u_crack_frequency;\r
uniform float u_crack_softness;\r
uniform float u_displacement_frequency;\r
uniform vec3  u_rock_color;\r
uniform vec3  u_rock_color_2;\r
uniform vec3  u_rock_color_3;\r
uniform vec3  u_rock_color_4;\r
uniform vec3  u_crack_color;\r
uniform vec3  u_crack_color_2;\r
uniform vec3  u_crack_color_3;\r
uniform vec3  u_crack_color_4;\r
uniform vec3  u_volcano_position;\r
uniform vec3  u_proximity_color;\r
uniform vec3  u_proximity_noise_color;\r
uniform float u_proximity_radius;\r
uniform float u_sun_focus_radius;\r
uniform float u_rock_variance_radius;\r
\r
varying vec3 v_world_position;\r
varying vec3 v_view_position;\r
varying vec3 v_normal;\r
varying float v_bump;\r
\r
void main() {\r
    vec3 normal = normalize(v_normal);\r
    if (!gl_FrontFacing) normal = -normal;\r
\r
    // normal perturbation, so bumps show under lighting\r
    normal = normalize(normal + bumpOffset(v_world_position, 3.0) * 0.1);\r
\r
    float shadow_mask = getShadowMask();\r
\r
    vec3 view_direction = normalize(-v_view_position);\r
    vec3 sun_direction  = normalize(u_sun_position - v_view_position);\r
    float diffuse = max(dot(normal, normalize(u_light_position - v_view_position)), 0.0) * shadow_mask;\r
\r
    float volcano_distance = length(v_world_position.xz - u_volcano_position.xz);\r
    float proximity = 1.0 - smoothstep(0.0, u_proximity_radius, volcano_distance);\r
\r
    float sun_focus_proximity = sunFocusTrapezoidMask(v_world_position, u_volcano_position, u_sun_focus_radius);\r
    float sun_focus_near_volcano = mix(u_sun_focus, u_sun_focus * 1.8, sun_focus_proximity);\r
    float sun_diffuse = sunDiffuseTerm(normal, view_direction, sun_direction, sun_focus_near_volcano) * mix(1.0, 1.6, sun_focus_proximity);\r
\r
    // each hill-sized patch gets its own rock tone; faded out near the volcano over its own radius\r
    // so the scorched ground close to it stays a plain, uniform u_rock_color\r
    float rock_variance_strength = smoothstep(0.0, u_rock_variance_radius, volcano_distance);\r
    vec3 rock_base_color = blendTerrainColors(u_rock_color, u_rock_color_2, u_rock_color_3, u_rock_color_4, v_world_position, u_displacement_frequency);\r
    rock_base_color = mix(u_rock_color, rock_base_color, rock_variance_strength);\r
    float color_variation = normalizedFractalBrownianMotion(v_world_position * 1.5);\r
    vec3 varied_color = mix(rock_base_color * 0.6, rock_base_color, color_variation);\r
\r
    float crack_mask = crackPattern(v_world_position, u_crack_frequency, u_crack_softness);\r
    vec3 crack_color = blendCrackColors(u_crack_color, u_crack_color_2, u_crack_color_3, v_world_position);\r
    // partial amplitude keeps per-crack variety visible instead of washing to one color at the peak\r
    float crack_time_pulse = 0.5 + 0.5 * sin(u_time * 0.9);\r
    crack_color = mix(crack_color, u_crack_color_3, crack_time_pulse * 0.5);\r
    // mismatched frequencies only align into a peak occasionally (beat period), not every cycle\r
    float flare_a = sin(u_time * 0.37);\r
    float flare_b = sin(u_time * 0.53 + 1.7);\r
    float red_flare = pow(max(flare_a * flare_b, 0.0), 8.0);\r
    // narrow threshold + high frequency -> isolated dots; time offset varies which ones light up\r
    float sparkle_noise = simplexNoise(v_world_position * 18.0 + vec3(0.0, u_time * 0.15, 0.0));\r
    float sparkle_mask = smoothstep(0.93, 0.97, sparkle_noise) * (1.0 - crack_mask);\r
    crack_color = mix(crack_color, u_crack_color_4, red_flare * sparkle_mask);\r
    // applied last so it isn't diluted by the mixes above; anisotropic + warp for hair-like strands\r
    vec3 hair_warp = vec3(simplexNoise(v_world_position * 4.0 + vec3(6.1, 0.0, 2.4)), 0.0, 0.0) * 4.0;\r
    vec3 hair_coordinate = (v_world_position + hair_warp) * vec3(3.0, 12.0, 30.0) + vec3(3.7, 1.2, 5.5);\r
    float crack_detail_noise = normalizedFractalBrownianMotion(hair_coordinate);\r
    crack_color *= mix(0.3, 1.8, crack_detail_noise);\r
    vec3 color = mix(crack_color, varied_color, crack_mask);\r
\r
    // tiny: ground, not polished rock\r
    vec3 halfway_direction = normalize(normalize(u_light_position - v_view_position) + view_direction);\r
    float specular = pow(max(dot(halfway_direction, normal), 0.0), 24.0) * 0.002 * shadow_mask;\r
\r
    // matches the scene's AmbientLight (main.js)\r
    color = color * (1.8 + diffuse * 0.55) + vec3(specular);\r
\r
    // capped below 1.0 so the rock's own color/hill variance still shows through at the volcano's foot\r
    color = mix(color, u_proximity_color, proximity * 0.6);\r
\r
    // crack_mask keeps this off the lava crack veins\r
    float proximity_noise = clamp(normalizedFractalBrownianMotion(v_world_position * 2.5) * 1.8, 0.0, 1.0) * proximity * crack_mask;\r
    color = mix(color, u_proximity_noise_color, proximity_noise);\r
\r
    color += u_sun_color * sun_diffuse * u_sun_strength * u_sun_enabled;\r
\r
    color *= heightAmbientOcclusion(v_bump);\r
\r
    // self-illumination so cracks push past the bloom threshold; strength drifts over position/time\r
    float glow_variation = normalizedFractalBrownianMotion(v_world_position * 5.0 + vec3(0.0, u_time * 0.3, 0.0));\r
    float crack_glow_strength = mix(0.4, 1.2, glow_variation);\r
    color += crack_color * (1.0 - crack_mask) * crack_glow_strength;\r
\r
    gl_FragColor = vec4(color, 1.0);\r
}\r
`,Sg=42,yg=75,bg=.1,Eg=1e3,ns={x:0,y:1.7,z:7.5},Mg=16,Tg=36,wg=1,Ag=Math.PI/2-.1,sa=80,$l=160,Cg=.06,lo=30,Rg=30,is={x:6,y:8,z:6},Ni=300,Pg=128,Dg=48,Lg=.01,pu=1,_u=.4,mu=1,gu=0,vu=-.4,xu=0,Ig=500,Ng=7.2,Su=.5,aa=.45,yu=.5,Ug=.288,Og=3.5,Fg=36,bu=6,Jl=3,ri=64,Ql=26,kg=.5,Bg=2,zg=.05,Gg=.2,Hg=.3,Vg=.3,Wg=.5,Xg=6,Eu=.5,qg=.2,Yg=.5,Kg=3,jg=.55,Zg=.1,$g=.3,Jg=.5,Qg=1,ev=3,tv=.1,nv=.05,iv=.7,rv=.2,ov=4,sv=.5,av=4,lv=2.5,cv=.3,uv=.6,an=6,ec=40,Mu=1.2,dv=1.2,hv=.6,fv=1.2,pv=60,_v="#a39a8f",mv="#221e1a",gv=.15,vv=[{x:14,y:0},{x:2.5,y:5},{x:1,y:4.2}],xv=48,Sv=240,Ui={x:5,y:8,z:5},Bn={x:12,y:10,z:-30},xo=16715808,yv=16724753,bv=13378048,Tu=14487808,Ev=4,Mv=60,Tv=2.5,tc=Math.sqrt(Bn.x**2+Bn.z**2),wv=Bn.y,Av=Math.atan2(Bn.z,Bn.x),Cv=4e3,Rv=2*Math.PI/Cv,Pv=1400,Dv=4.6,Lv=10,Iv=5,wu=12,Nv=.15,Uv=.4,Au=.3,Cu=1.3,Ov=.6,Ru=.8,Pu=.5,Du=1.5,Lu=6,Iu=.4,Nu=1.8,nc=.35,Fv=.3,kv=22,Bv=-3,zv=14,Gv=.35,Hv=16742195,Vv=1.3,Wv=5570560,Xv=.9,ic=2048,qv=10,Hr=sa/2+qv,Yv=1,Kv=100,jv=-.0015,rc=.5,Zv=60,rs={x:1,y:.45,z:.05},$v=!1,Jv=1,Qv=!1,e0=!0,t0=100,n0=50,i0=1.25,r0=1,o0=3e-5,s0=.25,a0=.34,l0=.96,c0=10.1,u0="#a01500",d0="#7c3027",h0=!0,f0="#ff3f00",p0=!0,_0="#7c3027",m0="#ea6927",g0=!0,v0=!0,x0=5e-5,S0=!0,y0="#110f0f",b0="#1c0c01",E0="#160000",M0="#0c0404",T0="#e03008",w0="#872412",A0="#db9e49",C0="#dd0000",R0=.015,P0="#000000",D0="#2d2424",L0=30,I0=20,N0=45,U0=1.26,O0=.1,F0=-6,k0=!0,B0=2.5,z0=.5,G0="#9b9696",H0=!0,V0=.125,W0=5.8,X0=!0,q0=816,Y0=2,K0=.025,j0="#000000",Z0="#515150",$0="#ff5b00",J0=36,Q0=280,ex=0,tx=0,nx=0,ix=!0,rx=.8,ox=.5,sx=.3,ax="#510000",lx=.24,cx=.64,ux=.898,dx=1.2,hx="#ff0000",de={paused:$v,timeScale:Jv,interactionMode:Qv,interactionSmokeVisible:e0,metaballCount:t0,metaballIsolation:n0,metaballRadius:i0,metaballSpread:r0,metaballSpeed:o0,metaballSinkSpeed:s0,metaballDisappearY:a0,metaballHeight:l0,flowRadius:c0,colorHot:u0,colorCool:d0,glowEnabled:h0,glowColor:f0,noiseEnabled:p0,noiseColor1:_0,noiseColor2:m0,bumpEnabled:g0,displacementEnabled:v0,displacementStrength:x0,groundVisible:S0,groundColor:y0,groundColor2:b0,groundColor3:E0,groundColor4:M0,groundCrackColor:T0,groundCrackColor2:w0,groundCrackColor3:A0,groundCrackColor4:C0,groundCrackSoftness:R0,groundProximityColor:P0,groundProximityNoiseColor:D0,groundProximityRadius:L0,groundSunFocusRadius:I0,groundRockVarianceRadius:N0,groundDisplacementScale:U0,groundDisplacementFrequency:O0,groundHeight:F0,volcanoVisible:k0,volcanoDisplacementScale:B0,volcanoDisplacementFrequency:z0,volcanoRockColor:G0,sunVisible:H0,sunStrength:V0,sunFocus:W0,smokeVisible:X0,smokeCount:q0,smokeSpread:Y0,smokeRiseSpeed:K0,smokeColor1:j0,smokeColor2:Z0,smokeColor3:$0,smokeParticleSize:J0,smokeEmberCoolingTime:Q0,offsetX:ex,offsetY:tx,offsetZ:nx,bloomEnabled:ix,bloomStrength:rx,bloomRadius:ox,bloomThreshold:sx,skyColor:ax,godRaysWeight:lx,godRaysExposure:cx,godRaysDecay:ux,godRaysDensity:dx,godRaysTintColor:hx};function la(n,e,t){return t.copy(e).applyMatrix4(n.matrixWorldInverse)}const fx=new D(Ui.x,Ui.y,Ui.z),oc=new D,sc=new D;function Uu(n,e,t){la(e,fx,oc),n.uniforms.u_light_position.value.copy(oc),la(e,t,sc),n.uniforms.u_sun_position.value.copy(sc)}function px(){return new at({vertexShader:wn+vg,fragmentShader:wn+xg,uniforms:{u_time:{value:0},u_light_position:{value:new D},u_sun_position:{value:new D},u_sun_color:{value:new fe(xo)},u_sun_enabled:{value:1},u_sun_strength:{value:de.sunStrength},u_sun_focus:{value:de.sunFocus},u_displacement_scale:{value:de.groundDisplacementScale},u_displacement_frequency:{value:de.groundDisplacementFrequency},u_crack_frequency:{value:Cg},u_crack_softness:{value:de.groundCrackSoftness},u_rock_color:{value:new fe(de.groundColor)},u_rock_color_2:{value:new fe(de.groundColor2)},u_rock_color_3:{value:new fe(de.groundColor3)},u_rock_color_4:{value:new fe(de.groundColor4)},u_crack_color:{value:new fe(de.groundCrackColor)},u_crack_color_2:{value:new fe(de.groundCrackColor2)},u_crack_color_3:{value:new fe(de.groundCrackColor3)},u_crack_color_4:{value:new fe(de.groundCrackColor4)},u_volcano_position:{value:new D},u_proximity_color:{value:new fe(de.groundProximityColor)},u_proximity_noise_color:{value:new fe(de.groundProximityNoiseColor)},u_proximity_radius:{value:de.groundProximityRadius},u_sun_focus_radius:{value:de.groundSunFocusRadius},u_rock_variance_radius:{value:de.groundRockVarianceRadius},u_volcano_crack_scale:{value:de.volcanoDisplacementScale},u_volcano_crack_frequency:{value:de.volcanoDisplacementFrequency}},side:Jt,precision:"highp"})}function _x(n,e,t,i,r){Uu(n,e,i),n.uniforms.u_volcano_position.value.copy(t),n.uniforms.u_time.value=r}function pt(n){return"#"+n.getHexString()}function So(n){return{getSunEnabled:()=>n.uniforms.u_sun_enabled.value===1,setSunEnabled:e=>{n.uniforms.u_sun_enabled.value=e?1:0},getSunStrength:()=>n.uniforms.u_sun_strength.value,setSunStrength:e=>{n.uniforms.u_sun_strength.value=e}}}function Ou(n){return{getDisplacementScale:()=>n.uniforms.u_displacement_scale.value,setDisplacementScale:e=>{n.uniforms.u_displacement_scale.value=e},getDisplacementFrequency:()=>n.uniforms.u_displacement_frequency.value,setDisplacementFrequency:e=>{n.uniforms.u_displacement_frequency.value=e}}}function mx(n){return{getCrackColor:()=>pt(n.uniforms.u_crack_color.value),setCrackColor:e=>n.uniforms.u_crack_color.value.set(e),getCrackColor2:()=>pt(n.uniforms.u_crack_color_2.value),setCrackColor2:e=>n.uniforms.u_crack_color_2.value.set(e),getCrackColor3:()=>pt(n.uniforms.u_crack_color_3.value),setCrackColor3:e=>n.uniforms.u_crack_color_3.value.set(e),getCrackColor4:()=>pt(n.uniforms.u_crack_color_4.value),setCrackColor4:e=>n.uniforms.u_crack_color_4.value.set(e)}}function Fu(n){return{getSunFocus:()=>n.uniforms.u_sun_focus.value,setSunFocus:e=>{n.uniforms.u_sun_focus.value=e}}}function gx(n){const e=px(),t=new Nt(new _r(sa,sa,$l,$l),e);return t.rotation.x=-Math.PI/2,t.position.y=-6,t.receiveShadow=!0,n.add(t),{mesh:t,update(i,r,o,s){_x(e,i,r,o,s)},getVisible:()=>t.visible,setVisible:i=>{t.visible=i},getColor:()=>pt(e.uniforms.u_rock_color.value),setColor:i=>e.uniforms.u_rock_color.value.set(i),getColor2:()=>pt(e.uniforms.u_rock_color_2.value),setColor2:i=>e.uniforms.u_rock_color_2.value.set(i),getColor3:()=>pt(e.uniforms.u_rock_color_3.value),setColor3:i=>e.uniforms.u_rock_color_3.value.set(i),getColor4:()=>pt(e.uniforms.u_rock_color_4.value),setColor4:i=>e.uniforms.u_rock_color_4.value.set(i),getCrackSoftness:()=>e.uniforms.u_crack_softness.value,setCrackSoftness:i=>{e.uniforms.u_crack_softness.value=i},getProximityColor:()=>pt(e.uniforms.u_proximity_color.value),setProximityColor:i=>e.uniforms.u_proximity_color.value.set(i),getProximityNoiseColor:()=>pt(e.uniforms.u_proximity_noise_color.value),setProximityNoiseColor:i=>e.uniforms.u_proximity_noise_color.value.set(i),getProximityRadius:()=>e.uniforms.u_proximity_radius.value,setProximityRadius:i=>{e.uniforms.u_proximity_radius.value=i},getSunFocusRadius:()=>e.uniforms.u_sun_focus_radius.value,setSunFocusRadius:i=>{e.uniforms.u_sun_focus_radius.value=i},getRockVarianceRadius:()=>e.uniforms.u_rock_variance_radius.value,setRockVarianceRadius:i=>{e.uniforms.u_rock_variance_radius.value=i},...mx(e),...Ou(e),...So(e),...Fu(e)}}function vx(n,e){const t=[];for(let r=0;r<n.length-1;r++){const o=n[r],s=n[r+1];for(let a=0;a<e;a++){const l=a/e;t.push(new xe(o.x+(s.x-o.x)*l,o.y+(s.y-o.y)*l))}}const i=n[n.length-1];return t.push(new xe(i.x,i.y)),t}function xx(n,e){const t=vx(vv,xv),i=new Pa(t,Sv),r=new Nt(i,e);return r.position.set(0,0,0),n.add(r),r}const Sx=`uniform float u_displacement_scale;\r
uniform float u_displacement_frequency;\r
uniform vec3  u_interaction_positions[INTERACTION_MAX_POINTS];\r
uniform float u_interaction_strengths[INTERACTION_MAX_POINTS];\r
uniform float u_interaction_radii[INTERACTION_MAX_POINTS];\r
uniform float u_interaction_decay[INTERACTION_MAX_POINTS];\r
uniform float u_interaction_plateau_fraction;\r
uniform float u_interaction_wipe_band_fraction;\r
uniform float u_interaction_wipe_noise_strength;\r
uniform float u_interaction_wipe_noise_frequency;\r
\r
varying vec3 v_world_position;\r
varying vec3 v_view_position;\r
varying vec3 v_normal;\r
\r
void main() {\r
    vec3 world_position = (modelMatrix * vec4(position, 1.0)).xyz;\r
\r
    float displacement = -max(0.0, 0.85 - crackDisplacementNoise(world_position, u_displacement_frequency));\r
    vec3 displaced = position + normal * displacement * u_displacement_scale;\r
    vec3 crack_world_position = (modelMatrix * vec4(displaced, 1.0)).xyz;\r
\r
    // The volcano's own local origin, in world space, sits exactly on its central (Lathe) axis.\r
    vec3 volcano_center = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;\r
\r
    // Flat plateau, then falls off - a stamped-circle look rather than a soft dome.\r
    float push_amount = 0.0;\r
    for (int i = 0; i < INTERACTION_MAX_POINTS; i++) {\r
        float point_distance = length(crack_world_position - u_interaction_positions[i]);\r
        float radius = u_interaction_radii[i];\r
        float plateau_edge = radius * u_interaction_plateau_fraction;\r
        float falloff = 1.0 - smoothstep(plateau_edge, radius, point_distance);\r
\r
        // Wipes starting from whichever part of the bump sits closest to the volcano's own central\r
        // axis, spreading outward toward the base as the touch decays - instead of shrinking the\r
        // radius evenly in every direction. The noise term breaks up the front so it eats away\r
        // raggedly rather than as one perfectly even ring.\r
        float vertex_axis_distance = length(crack_world_position.xz - volcano_center.xz);\r
        float touch_axis_distance = length(u_interaction_positions[i].xz - volcano_center.xz);\r
        float wipe_noise = simplexNoise(crack_world_position * u_interaction_wipe_noise_frequency) * radius * u_interaction_wipe_noise_strength;\r
        float axis_offset = vertex_axis_distance - touch_axis_distance + wipe_noise; // negative = nearer the axis than the touch itself\r
\r
        float wipe_band = radius * u_interaction_wipe_band_fraction;\r
        float wipe_threshold = mix(-radius - wipe_band, radius + wipe_band, u_interaction_decay[i]);\r
        float wipe_mask = smoothstep(wipe_threshold - wipe_band, wipe_threshold + wipe_band, axis_offset);\r
\r
        push_amount = max(push_amount, u_interaction_strengths[i] * falloff * wipe_mask);\r
    }\r
    vec3 push_direction = normalize(cameraPosition - crack_world_position);\r
    vec3 final_world_position = crack_world_position + push_direction * push_amount;\r
\r
    v_world_position = final_world_position;\r
    vec4 view_position = viewMatrix * vec4(final_world_position, 1.0);\r
    v_view_position = view_position.xyz;\r
    v_normal = normalMatrix * normal;\r
    gl_Position = projectionMatrix * view_position;\r
}\r
`,yx=`uniform vec3  u_light_position;\r
uniform vec3  u_sun_position;\r
uniform vec3  u_sun_color;\r
uniform float u_sun_enabled;\r
uniform float u_sun_strength;\r
uniform float u_sun_focus;\r
uniform vec3  u_rock_color;\r
\r
varying vec3 v_world_position;\r
varying vec3 v_view_position;\r
varying vec3 v_normal;\r
\r
void main() {\r
    vec3 normal = normalize(v_normal);\r
    if (!gl_FrontFacing) normal = -normal;\r
\r
    vec3 view_direction = normalize(-v_view_position);\r
    vec3 sun_direction  = normalize(u_sun_position - v_view_position);\r
\r
    float diffuse = max(dot(normal, normalize(u_light_position - v_view_position)), 0.0);\r
\r
    float sun_diffuse = sunDiffuseTerm(normal, view_direction, sun_direction, u_sun_focus);\r
\r
    float ash_variation = normalizedFractalBrownianMotion(v_world_position * 2.5);\r
    vec3 color = mix(vec3(0.0), u_rock_color, ash_variation * 0.15);\r
\r
    vec3 halfway_direction = normalize(normalize(u_light_position - v_view_position) + view_direction);\r
    float specular   = pow(max(dot(halfway_direction, normal), 0.0), 32.0) * 0.01;\r
\r
    color = color * (0.005 + diffuse * 0.50) + vec3(specular);\r
    color += u_sun_color * sun_diffuse * u_sun_strength * u_sun_enabled;\r
\r
    gl_FragColor = vec4(color, 1.0);\r
}\r
`,bx=Sx.replaceAll("INTERACTION_MAX_POINTS",ri);function Ex(){return new at({vertexShader:wn+bx,fragmentShader:wn+yx,uniforms:{u_light_position:{value:new D},u_sun_position:{value:new D},u_sun_color:{value:new fe(xo)},u_sun_enabled:{value:1},u_sun_strength:{value:de.sunStrength},u_sun_focus:{value:de.sunFocus},u_displacement_scale:{value:de.volcanoDisplacementScale},u_displacement_frequency:{value:de.volcanoDisplacementFrequency},u_rock_color:{value:new fe(de.volcanoRockColor)},u_interaction_positions:{value:Array.from({length:ri},()=>new D)},u_interaction_strengths:{value:new Float32Array(ri)},u_interaction_radii:{value:new Float32Array(ri)},u_interaction_decay:{value:new Float32Array(ri)},u_interaction_plateau_fraction:{value:Hg},u_interaction_wipe_band_fraction:{value:Vg},u_interaction_wipe_noise_strength:{value:Wg},u_interaction_wipe_noise_frequency:{value:Xg}},side:Jt,precision:"highp"})}function Mx(n,e,t){Uu(n,e,t)}function Tx(n,e){const t=n.uniforms.u_interaction_positions.value,i=n.uniforms.u_interaction_strengths.value,r=n.uniforms.u_interaction_radii.value,o=n.uniforms.u_interaction_decay.value;for(let s=0;s<ri;s++){const a=e[s];a?(t[s].set(a.x,a.y,a.z),i[s]=a.strength,r[s]=a.radius,o[s]=a.decay_progress):i[s]=0}}function wx(n){const e=Ex(),t=xx(n,e);return t.castShadow=!0,{mesh:t,update(i,r,o=[]){Mx(e,i,r),Tx(e,o)},getVisible:()=>t.visible,setVisible:i=>{t.visible=i},getRockColor:()=>pt(e.uniforms.u_rock_color.value),setRockColor:i=>e.uniforms.u_rock_color.value.set(i),...Ou(e),...So(e),...Fu(e)}}function Ax(n,e){const t=new Hi(2*pu,2*_u,2*mu);t.translate(gu,vu,xu);const i=new Nt(t,e);return i.isolation=de.metaballIsolation,i.radius_scale=de.metaballRadius,i.scale.set(lo,lo,Rg),n.add(i),i}function Ji(n,e){const t=n.material.uniforms,i=t.u_ball_center.value,r=t.u_ball_strength.value,o=t.u_ball_subtract.value,s=n.radius_scale*n.radius_scale;for(let a=0;a<Ni;a++){const l=e[a];l?(i[a].set(2*l.x-1,2*l.y-1,2*l.z-1),r[a]=l.strength*s,o[a]=l.subtract):r[a]=0}t.u_isolation.value=n.isolation,t.u_effect_position.value.copy(n.position),t.u_effect_scale.value=n.scale.x}function ac(n,e){return{x:e.position.x+e.scale.x*(2*n.x-1),y:e.position.y+e.scale.y*(2*n.y-1),z:e.position.z+e.scale.z*(2*n.z-1)}}function Cx(n,e){const t=Math.sqrt(n.strength/(e.isolation+n.subtract));return 2*e.scale.x*t*e.radius_scale}const Rx=`out vec3 v_local_position;\r
\r
void main() {\r
    v_local_position = position;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
}\r
`,Px=`uniform vec3  u_light_position;\r
uniform vec3  u_color_hot;\r
uniform vec3  u_color_cool;\r
uniform float u_time;\r
uniform float u_glow_enabled;\r
uniform vec3  u_glow_color;\r
uniform float u_noise_enabled;\r
uniform vec3  u_noise_color_1;\r
uniform vec3  u_noise_color_2;\r
uniform float u_bump_enabled;\r
uniform float u_displacement;\r
\r
uniform vec3  u_ball_center[METABALL_GPU_MAX_BALLS];\r
uniform float u_ball_strength[METABALL_GPU_MAX_BALLS];\r
uniform float u_ball_subtract[METABALL_GPU_MAX_BALLS];\r
uniform float u_isolation;\r
uniform vec3  u_effect_position;\r
uniform float u_effect_scale;\r
uniform vec3  u_box_half_extent;\r
uniform vec3  u_box_center;\r
uniform int   u_raymarch_steps;\r
uniform float u_normal_epsilon;\r
uniform mat4  u_projection_matrix; // projectionMatrix isn't declared in fragment shaders - synced from the camera in updateMetaballLight\r
\r
in vec3 v_local_position;\r
\r
out vec4 out_color;\r
\r
// Must match isOnLava()'s formula (interaction_animation.js) - local (2*field-1) space, where\r
// each ball's contribution is 4*strength/dist^2 - subtract.\r
float metaballField(vec3 local_position) {\r
    float field = 0.0;\r
    for (int i = 0; i < METABALL_GPU_MAX_BALLS; i++) {\r
        vec3 offset = local_position - u_ball_center[i];\r
        float dist_sq = max(dot(offset, offset), 0.0001);\r
        field += max(0.0, 4.0 * u_ball_strength[i] / dist_sq - u_ball_subtract[i]);\r
    }\r
    return field;\r
}\r
\r
// Distance to the nearest ball's isosurface (see ballToWorldRadius) is always a safe march stride.\r
float safeStepDistance(vec3 p) {\r
    float nearest = 1.0e6;\r
    for (int i = 0; i < METABALL_GPU_MAX_BALLS; i++) {\r
        if (u_ball_strength[i] <= 0.0) continue;\r
        float local_radius = 2.0 * sqrt(u_ball_strength[i] / (u_isolation + u_ball_subtract[i]));\r
        nearest = min(nearest, length(p - u_ball_center[i]) - local_radius);\r
    }\r
    return nearest;\r
}\r
\r
void main() {\r
    vec3 local_camera = (cameraPosition - u_effect_position) / u_effect_scale;\r
    vec3 ray_direction = normalize(v_local_position - local_camera);\r
\r
    // Slab ray-AABB test against the proxy box, in the same local space as the field above.\r
    vec3 box_min = u_box_center - u_box_half_extent;\r
    vec3 box_max = u_box_center + u_box_half_extent;\r
    vec3 inverse_direction = 1.0 / ray_direction;\r
    vec3 t_lower = (box_min - local_camera) * inverse_direction;\r
    vec3 t_upper = (box_max - local_camera) * inverse_direction;\r
    vec3 t_min = min(t_lower, t_upper);\r
    vec3 t_max = max(t_lower, t_upper);\r
    float t_enter = max(max(max(t_min.x, t_min.y), t_min.z), 0.0);\r
    float t_exit = min(min(t_max.x, t_max.y), t_max.z);\r
    if (t_exit < t_enter) discard;\r
\r
    const float SURFACE_EPSILON = 0.0005;\r
    const float STEP_SAFETY = 0.8; // shrinks each stride so overlapping balls can't be stepped over\r
    const float MIN_STEP = 0.001; // floor stride so tracing still advances where the field is nearly flat\r
\r
    float t = t_enter;\r
    bool did_hit = false;\r
\r
    for (int i = 0; i < METABALL_RAYMARCH_MAX_STEPS; i++) {\r
        if (i >= u_raymarch_steps || t > t_exit) break;\r
        vec3 p = local_camera + ray_direction * t;\r
        float distance_to_surface = safeStepDistance(p);\r
        if (distance_to_surface < SURFACE_EPSILON) {\r
            did_hit = true;\r
            break;\r
        }\r
        t += max(distance_to_surface * STEP_SAFETY, MIN_STEP);\r
    }\r
\r
    if (!did_hit) discard;\r
\r
    vec3 hit_local = local_camera + ray_direction * t;\r
\r
    // The field decreases outward, so its negative gradient is the surface normal.\r
    vec3 gradient = vec3(\r
        metaballField(hit_local + vec3(u_normal_epsilon, 0.0, 0.0)) - metaballField(hit_local - vec3(u_normal_epsilon, 0.0, 0.0)),\r
        metaballField(hit_local + vec3(0.0, u_normal_epsilon, 0.0)) - metaballField(hit_local - vec3(0.0, u_normal_epsilon, 0.0)),\r
        metaballField(hit_local + vec3(0.0, 0.0, u_normal_epsilon)) - metaballField(hit_local - vec3(0.0, 0.0, u_normal_epsilon))\r
    );\r
    vec3 local_normal = normalize(-gradient);\r
\r
    vec3 world_position = u_effect_position + u_effect_scale * hit_local;\r
\r
    // Displaces the hit point along its normal once, rather than per march step, to avoid the cost\r
    // of a displaced isosurface search.\r
    if (u_displacement > 0.0) {\r
        vec3 noise_coordinate = world_position * 1.1 + vec3(0.0, -u_time * 0.12, u_time * 0.05);\r
        float base_noise = normalizedFractalBrownianMotion(noise_coordinate);\r
        float warped_noise = warpedFractalBrownianMotion(noise_coordinate, 0.7);\r
        float crust_mask = 1.0 - smoothstep(0.15, 0.65, mix(base_noise, warped_noise, 0.5));\r
\r
        vec3 displacement_coordinate = world_position * 0.7 + vec3(u_time * 0.006, -u_time * 0.009, u_time * 0.004);\r
        float displacement = normalizedFractalBrownianMotion(displacement_coordinate);\r
\r
        hit_local += local_normal * displacement * u_displacement * crust_mask;\r
        world_position = u_effect_position + u_effect_scale * hit_local;\r
    }\r
\r
    vec3 view_position = (viewMatrix * vec4(world_position, 1.0)).xyz;\r
    // normalMatrix isn't declared in fragment shaders; with no rotation and uniform scale here,\r
    // mat3(viewMatrix) differs from it only by a positive scalar that normalize() below removes.\r
    vec3 normal = normalize(mat3(viewMatrix) * local_normal);\r
\r
    if (u_bump_enabled > 0.5) {\r
        vec3 bump = bumpOffset(world_position, 3.5);\r
        vec3 bump_coordinate_2 = world_position * 8.5;\r
        vec3 bump2 = vec3(\r
            simplexNoise(bump_coordinate_2 + vec3(0.0, 0.0, 2.3)),\r
            simplexNoise(bump_coordinate_2 + vec3(2.1, 0.0, 0.0)),\r
            simplexNoise(bump_coordinate_2 + vec3(0.0, 3.7, 0.0))\r
        );\r
        normal = normalize(normal + bump * 0.20 + bump2 * 0.10);\r
    }\r
\r
    vec3 light_direction = normalize(u_light_position - view_position);\r
    vec3 view_direction = normalize(-view_position);\r
    vec3 halfway_direction = normalize(light_direction + view_direction);\r
\r
    float diffuse  = max(dot(normal, light_direction), 0.0);\r
    float specular = pow(max(dot(normal, halfway_direction), 0.0), 8.0);\r
\r
    float fast_pulse = 0.5 + 0.5 * sin(u_time * 1.0);\r
    float slow_pulse = 0.5 + 0.5 * sin(u_time * 0.3 + 1.3);\r
    vec3  glow_color = mix(u_glow_color * 0.7, u_glow_color, fast_pulse);\r
\r
    float heat;\r
    if (u_noise_enabled > 0.5) {\r
        vec3 heat_coordinate = world_position * 0.7 + vec3(0.0, -u_time * 0.012, u_time * 0.005);\r
        float heat_base_noise = normalizedFractalBrownianMotion(heat_coordinate);\r
        float heat_warped_noise = warpedFractalBrownianMotion(heat_coordinate, 0.4);\r
        heat = smoothstep(0.15, 0.65, mix(heat_base_noise, heat_warped_noise, 0.5));\r
    } else {\r
        heat = clamp(diffuse * 0.85 + 0.25, 0.0, 1.0);\r
    }\r
\r
    vec3 base_dark = (u_noise_enabled > 0.5) ? mix(u_color_cool, u_noise_color_1, 0.6) : u_color_cool;\r
    vec3 color = mix(base_dark, u_color_hot, heat);\r
\r
    if (u_noise_enabled > 0.5) {\r
        vec3 orange_coordinate = world_position * 1.2 + vec3(u_time * 0.007, -u_time * 0.018, 0.0);\r
        float orange_noise = normalizedFractalBrownianMotion(orange_coordinate);\r
        float orange_mask = smoothstep(0.6, 0.85, orange_noise);\r
        color = mix(color, u_noise_color_2, orange_mask * 0.40);\r
    }\r
\r
    float self_illumination = pow(heat, 1.5) * 0.90;\r
    color += u_color_hot * self_illumination;\r
\r
    float molten_core = pow(heat, 3.5) * 0.70;\r
    color += vec3(1.0, 0.75, 0.25) * molten_core;\r
\r
    color += vec3(0.08, 0.04, 0.03) * specular;\r
    float rim_wide = pow(1.0 - max(dot(view_direction, normal), 0.0), 4.5);\r
    color += glow_color * rim_wide * (0.65 + 0.70 * slow_pulse) * u_glow_enabled;\r
\r
    vec4 clip_position = u_projection_matrix * viewMatrix * vec4(world_position, 1.0);\r
    gl_FragDepth = clip_position.z / clip_position.w * 0.5 + 0.5;\r
    out_color = vec4(color, 1.0);\r
}\r
`,Dx=new D(is.x,is.y,is.z),lc=new D,Lx=Px.replaceAll("METABALL_GPU_MAX_BALLS",Ni).replaceAll("METABALL_RAYMARCH_MAX_STEPS",Pg);function Ix(){return new at({vertexShader:wn+Rx,fragmentShader:wn+Lx,glslVersion:ta,uniforms:{u_light_position:{value:new D},u_time:{value:0},u_glow_enabled:{value:de.glowEnabled?1:0},u_glow_color:{value:new fe(de.glowColor)},u_color_hot:{value:new fe(de.colorHot)},u_color_cool:{value:new fe(de.colorCool)},u_noise_enabled:{value:de.noiseEnabled?1:0},u_noise_color_1:{value:new fe(de.noiseColor1)},u_noise_color_2:{value:new fe(de.noiseColor2)},u_bump_enabled:{value:de.bumpEnabled?1:0},u_displacement:{value:de.displacementStrength},u_ball_center:{value:Array.from({length:Ni},()=>new D)},u_ball_strength:{value:new Float32Array(Ni)},u_ball_subtract:{value:new Float32Array(Ni)},u_isolation:{value:de.metaballIsolation},u_effect_position:{value:new D},u_effect_scale:{value:1},u_box_half_extent:{value:new D(pu,_u,mu)},u_box_center:{value:new D(gu,vu,xu)},u_raymarch_steps:{value:Dg},u_normal_epsilon:{value:Lg},u_projection_matrix:{value:new it}},side:Rt,precision:"highp"})}function Nx(n,e,t){la(e,Dx,lc),n.uniforms.u_light_position.value.copy(lc),n.uniforms.u_time.value=t,n.uniforms.u_projection_matrix.value.copy(e.projectionMatrix)}function Ux(n){let e=n>>>0;return()=>(e=Math.imul(1664525,e)+1013904223>>>0,e/4294967296)}const ca=Ux(Sg);function ft(n,e){return n+ca()*(e-n)}function nr(n,e){const t=ca()+1e-10,i=ca(),r=Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*i);return n+r*e}function Un(n,e,t){return Math.min(Math.max(n,e),t)}function co(n,e,t){const i=Un((t-n)/(e-n),0,1);return i*i*(3-2*i)}const On=Ig,Ox=(Ng/lo)**2,ut={count:de.metaballCount,spread:de.metaballSpread,speed_factor:de.metaballSpeed,sink_speed:de.metaballSinkSpeed,disappear_y:de.metaballDisappearY,paused:de.paused,max_count:On,flow_z_radius:de.flowRadius},cc=Math.PI*2/bu,vn=Array.from({length:On},(n,e)=>{const t=Ox*ft(.7,1.25);return{x:Su,y:aa,z:yu,strength:t,base_strength:t,shrink_fraction:0,subtract:ft(25,45),speed_mult:ft(.6,1.4),angle:nr(e%bu*cc,cc*.4),active:!1}}),uc=new Float64Array(On).fill(1/0);let dc=0,Vr=0,os=-1/0,no=!1,ua=-1/0,uo=-1/0;const ss=[];function Qn(){ss.length=0;for(let n=0;n<On;n++)vn[n].active&&ss.push(vn[n]);return ss}function Fx(n){if(!no)return 1;const e=1-co(ua,ua+Jl,n),t=co(uo-Jl,uo,n);return Math.max(e,t)}function kx(n){if(ut.paused)return null;if(no)n>=uo&&(no=!1,Vr=0,os=-1/0);else if(Vr<ut.count&&n-os>=Fg){let e=-1;for(let t=0;t<On;t++){const i=(dc+t)%On;if(!vn[i].active){e=i;break}}e!==-1&&(uc[e]=n,vn[e].active=!0,vn[e].strength=vn[e].base_strength,vn[e].shrink_fraction=0,Vr++,dc=(e+1)%On,os=n)}else Vr>=ut.count&&(no=!0,ua=n,uo=n+ft(10,18));for(let e=0;e<On;e++){if(!vn[e].active)continue;const t=vn[e],i=(n-uc[e])*ut.speed_factor*t.speed_mult/Og,s=1-(1-Math.min(i,1))**16,a=Math.max(i-1,0)*ut.sink_speed,l=ut.flow_z_radius/lo*s;t.y=aa+(Ug-aa)*s-a,t.x=Su+l*Math.cos(t.angle),t.z=yu+l*Math.sin(t.angle),t.y<=ut.disappear_y&&(t.active=!1)}return Qn()}function Bx(n){const e=Ix(),t=Ax(n,e);Ji(t,Qn());let i=de.displacementEnabled,r=e.uniforms.u_displacement.value;return{effect:t,update(o,s){const a=kx(o);a&&Ji(t,a),Nx(e,s,o)},isPaused:()=>ut.paused,setPaused:o=>{ut.paused=o},getEruptionIntensity:o=>Fx(o),getActiveWorldPositions:()=>Qn().map(o=>({...ac(o,t),radius:Cx(o,t),subtract:o.subtract,isolation:t.isolation})),squeezeNearestBall:({x:o,y:s,z:a,shrink_increment:l})=>{let c=null,d=1/0;for(const f of Qn()){const _=ac(f,t),v=_.x-o,x=_.y-s,m=_.z-a,h=Math.sqrt(v*v+x*x+m*m);h<d&&(d=h,c=f)}if(!c)return;c.shrink_fraction=Math.min(1,c.shrink_fraction+l);const u=Math.max(1-c.shrink_fraction,0);c.strength=c.base_strength*u*u,u<=0&&(c.active=!1)},getCount:()=>ut.count,setCount:o=>{ut.count=o,Ji(t,Qn())},getMaxCount:()=>Math.min(ut.max_count,Ni),getIsolation:()=>t.isolation,setIsolation:o=>{t.isolation=o,Ji(t,Qn())},getRadius:()=>t.radius_scale,setRadius:o=>{t.radius_scale=o,Ji(t,Qn())},getSpread:()=>ut.spread,setSpread:o=>{ut.spread=o},getSpeed:()=>ut.speed_factor,setSpeed:o=>{ut.speed_factor=o},getSinkSpeed:()=>ut.sink_speed,setSinkSpeed:o=>{ut.sink_speed=o},getDisappearY:()=>ut.disappear_y,setDisappearY:o=>{ut.disappear_y=o},getFlowRadius:()=>ut.flow_z_radius,setFlowRadius:o=>{ut.flow_z_radius=o},getColorHot:()=>pt(e.uniforms.u_color_hot.value),setColorHot:o=>e.uniforms.u_color_hot.value.set(o),getColorCool:()=>pt(e.uniforms.u_color_cool.value),setColorCool:o=>e.uniforms.u_color_cool.value.set(o),getGlowEnabled:()=>e.uniforms.u_glow_enabled.value===1,setGlowEnabled:o=>{e.uniforms.u_glow_enabled.value=o?1:0},getGlowColor:()=>pt(e.uniforms.u_glow_color.value),setGlowColor:o=>e.uniforms.u_glow_color.value.set(o),getNoiseEnabled:()=>e.uniforms.u_noise_enabled.value===1,setNoiseEnabled:o=>{e.uniforms.u_noise_enabled.value=o?1:0},getNoiseColor1:()=>pt(e.uniforms.u_noise_color_1.value),setNoiseColor1:o=>e.uniforms.u_noise_color_1.value.set(o),getNoiseColor2:()=>pt(e.uniforms.u_noise_color_2.value),setNoiseColor2:o=>e.uniforms.u_noise_color_2.value.set(o),getBumpEnabled:()=>e.uniforms.u_bump_enabled.value===1,setBumpEnabled:o=>{e.uniforms.u_bump_enabled.value=o?1:0},getDisplacementEnabled:()=>i,setDisplacementEnabled:o=>{i=o,o?e.uniforms.u_displacement.value=r:(r=e.uniforms.u_displacement.value,e.uniforms.u_displacement.value=0)},getDisplacementStrength:()=>e.uniforms.u_displacement.value,setDisplacementStrength:o=>{e.uniforms.u_displacement.value=o}}}function zx(n,e,t){const i=t.is_ambient.length,r=new Gt;r.setAttribute("position",new dt(new Float32Array(i*3),3)),r.setAttribute("a_is_ambient",new dt(t.is_ambient,1)),r.setAttribute("a_motion_seed",new dt(t.motion_seed,4)),r.setAttribute("a_timing_seed",new dt(t.timing_seed,2)),r.setAttribute("a_appearance",new dt(t.appearance,3)),r.setAttribute("a_accent_base",new dt(t.accent_base,1)),r.setAttribute("a_ember_cooling_mult",new dt(t.ember_cooling_mult,1)),r.setAttribute("a_ambient_seed",new dt(t.ambient_seed,4));const o=new su(r,e);return o.position.set(0,0,0),o.frustumCulled=!1,n.add(o),o}function hc(n,e){n.geometry.setDrawRange(0,e)}const Gx=`attribute float a_is_ambient;\r
attribute vec4  a_motion_seed;  // base_angle, base_radius, drift_angle, lifetime_mult\r
attribute vec2  a_timing_seed;  // phase_offset, color_seed\r
attribute vec3  a_appearance;   // size_mult, glow_mult, shape_seed\r
attribute float a_accent_base;\r
attribute float a_ember_cooling_mult;\r
attribute vec4  a_ambient_seed; // ambient_angle, ambient_radius_seed, ambient_height_seed, ambient_opacity_seed\r
\r
uniform float u_time;\r
uniform float u_size;\r
uniform float u_spread;\r
uniform float u_rise_speed;\r
uniform float u_plume_opacity_factor;\r
uniform float u_lifetime;\r
uniform float u_core_spread;\r
uniform float u_rise_height;\r
uniform float u_fade_in_end;\r
uniform float u_fade_out_start;\r
uniform float u_ambient_radius;\r
uniform float u_ambient_height_min;\r
uniform float u_ambient_height_max;\r
uniform float u_ambient_opacity;\r
uniform float u_ember_cooling_time;\r
\r
varying float v_opacity;\r
varying float v_color_mix;\r
varying float v_accent_mix;\r
varying float v_glow_mult;\r
varying float v_shape_seed;\r
\r
void main() {\r
    float base_angle = a_motion_seed.x;\r
    float base_radius = a_motion_seed.y;\r
    float drift_angle = a_motion_seed.z;\r
    float lifetime_mult = a_motion_seed.w;\r
    float phase_offset = a_timing_seed.x;\r
    float color_seed = a_timing_seed.y;\r
    float size_mult = a_appearance.x;\r
    float glow_mult = a_appearance.y;\r
    float shape_seed = a_appearance.z;\r
\r
    float lifetime = (u_lifetime * lifetime_mult) / u_rise_speed;\r
    float age_seconds = mod(u_time + phase_offset, lifetime);\r
    float age_fraction = age_seconds / lifetime;\r
\r
    // age dominates the mix (young stays close to u_color_1); color_seed adds mottling\r
    float color_mix = clamp(age_fraction * 0.65 + color_seed * 0.35, 0.0, 1.0);\r
\r
    // smoothstep's zero slope at the edges lets particles drift into invisibility instead of cutting off\r
    float fade_in = smoothstep(0.0, u_fade_in_end, age_fraction);\r
    float fade_out = 1.0 - smoothstep(u_fade_out_start, 1.0, age_fraction);\r
    float life_envelope = fade_in * fade_out;\r
\r
    vec3 local_position;\r
    float opacity;\r
    float accent_mix;\r
\r
    if (a_is_ambient > 0.5) {\r
        float ambient_angle = a_ambient_seed.x;\r
        float ambient_radius_seed = a_ambient_seed.y;\r
        float ambient_height_seed = a_ambient_seed.z;\r
        float ambient_opacity_seed = a_ambient_seed.w;\r
\r
        float ambient_radius = ambient_radius_seed * u_ambient_radius;\r
        float ambient_height_range = u_ambient_height_max - u_ambient_height_min;\r
\r
        local_position = vec3(\r
            ambient_radius * cos(ambient_angle),\r
            u_ambient_height_min + ambient_height_seed * ambient_height_range,\r
            ambient_radius * sin(ambient_angle)\r
        );\r
        opacity = life_envelope * u_ambient_opacity * ambient_opacity_seed;\r
        accent_mix = 0.0;\r
    } else {\r
        float rise_shape = 0.2 + 0.8 * age_fraction;\r
\r
        // core_radius ignores u_spread so the center stays dense; extra_reach (cubed base_radius)\r
        // only pushes particles already far out\r
        float core_radius = base_radius * u_core_spread * rise_shape;\r
        float extra_reach = u_spread * pow(base_radius, 3.0) * rise_shape;\r
        float radius = core_radius + extra_reach;\r
        float angle = base_angle + drift_angle * age_fraction;\r
\r
        // normalized by u_core_spread so widening the core doesn't crush opacity towards zero\r
        float normalized_radius = radius / u_core_spread;\r
        float distance_falloff = 1.0 / (1.0 + normalized_radius * normalized_radius);\r
\r
        local_position = vec3(radius * cos(angle), age_fraction * u_rise_height, radius * sin(angle));\r
        opacity = life_envelope * distance_falloff * u_plume_opacity_factor;\r
\r
        float cooling_time = u_ember_cooling_time * a_ember_cooling_mult;\r
        float ember_cooling = 1.0 - smoothstep(0.0, cooling_time, age_seconds);\r
        accent_mix = a_accent_base * ember_cooling;\r
    }\r
\r
    v_opacity = opacity;\r
    v_color_mix = color_mix;\r
    v_accent_mix = accent_mix;\r
    v_glow_mult = glow_mult;\r
    v_shape_seed = shape_seed;\r
\r
    vec4 view_position = modelViewMatrix * vec4(local_position, 1.0);\r
\r
    const float REFERENCE_DISTANCE = 10.0;\r
    float attenuation = REFERENCE_DISTANCE / max(-view_position.z, 0.001);\r
    gl_PointSize = clamp(u_size * size_mult * attenuation, 1.0, 150.0);\r
    gl_Position = projectionMatrix * view_position;\r
}\r
`,ku=`uniform vec3 u_color_1;\r
uniform vec3 u_color_2;\r
uniform vec3 u_color_3;\r
uniform float u_ember_glow_strength;\r
uniform vec3 u_sun_color;\r
uniform float u_sun_enabled;\r
uniform float u_sun_strength;\r
\r
varying float v_opacity;\r
varying float v_color_mix;\r
varying float v_accent_mix;\r
varying float v_glow_mult;\r
varying float v_shape_seed;\r
\r
void main() {\r
    vec2 centered = gl_PointCoord - vec2(0.5);\r
    float distance_from_center = length(centered);\r
\r
    float shape_noise = simplexNoise(vec3(centered * 3.0, v_shape_seed * 13.0));\r
    float warped_radius = distance_from_center + shape_noise * 0.05;\r
\r
    float mask = smoothstep(0.5, 0.05, warped_radius);\r
    vec3 color = mix(u_color_1, u_color_2, v_color_mix);\r
    color = mix(color, u_color_3, v_accent_mix);\r
    color += u_color_3 * u_ember_glow_strength * v_glow_mult * v_accent_mix;\r
    color += u_sun_color * u_sun_strength * u_sun_enabled;\r
    gl_FragColor = vec4(color, v_opacity * mask);\r
}\r
`;function Hx(){return new at({vertexShader:Gx,fragmentShader:wn+ku,uniforms:{u_color_1:{value:new fe(de.smokeColor1)},u_color_2:{value:new fe(de.smokeColor2)},u_color_3:{value:new fe(de.smokeColor3)},u_size:{value:de.smokeParticleSize},u_ember_glow_strength:{value:Lu},u_sun_color:{value:new fe(Tu)},u_sun_enabled:{value:1},u_sun_strength:{value:de.sunStrength},u_time:{value:0},u_plume_opacity_factor:{value:1},u_spread:{value:de.smokeSpread},u_rise_speed:{value:de.smokeRiseSpeed},u_lifetime:{value:wu},u_core_spread:{value:Iv},u_rise_height:{value:Lv},u_fade_in_end:{value:Nv},u_fade_out_start:{value:Uv},u_ambient_radius:{value:kv},u_ambient_height_min:{value:Bv},u_ambient_height_max:{value:zv},u_ambient_opacity:{value:Gv},u_ember_cooling_time:{value:de.smokeEmberCoolingTime}},transparent:!0,depthWrite:!1,precision:"highp"})}function Vx(n,e,t){n.uniforms.u_time.value=e,n.uniforms.u_plume_opacity_factor.value=t}const gn=Pv,Wr={count:de.smokeCount,max_count:gn};function Ua(n,e){return{mean:(n+e)/2,std_dev:(e-n)/4}}const fc=Ua(Au,Cu),pc=Ua(Iu,Nu),_c=Ua(Pu,Du),Wx=1-Ru;function Xx(){const n=new Float32Array(gn),e=new Float32Array(gn*4),t=new Float32Array(gn*2),i=new Float32Array(gn*3),r=new Float32Array(gn),o=new Float32Array(gn),s=new Float32Array(gn*4);for(let a=0;a<gn;a++){const l=ft(0,1)<Fv;n[a]=l?1:0,e.set([ft(0,Math.PI*2),Math.abs(nr(0,1)),ft(-Math.PI*.5,Math.PI*.5),ft(.75,1.35)],a*4),t.set([ft(0,wu),ft(0,1)],a*2);const c=nr(0,1),d=nr(0,1);i.set([Un(fc.mean+c*fc.std_dev,Au,Cu),Un(pc.mean+d*pc.std_dev,Iu,Nu),ft(0,1)],a*3);const u=ft(0,1);r[a]=l?0:Un((u-Ru)/Wx,0,1)*Ov;const f=nr(0,1);o[a]=Un(_c.mean+f*_c.std_dev,Pu,Du),s.set([ft(0,Math.PI*2),Math.sqrt(ft(0,1)),ft(0,1),ft(.3,1)],a*4)}return{is_ambient:n,motion_seed:e,timing_seed:t,appearance:i,accent_base:r,ember_cooling_mult:o,ambient_seed:s}}const qx=Xx();function Yx(n=1){return nc+(1-nc)*Un(n,0,1)}function Kx(n){const e=Hx(),t=zx(n,e,qx);return hc(t,Wr.count),{effect:t,update(i,r=1){Vx(e,i,Yx(r))},getVisible:()=>t.visible,setVisible:i=>{t.visible=i},getCount:()=>Wr.count,setCount:i=>{Wr.count=i,hc(t,i)},getMaxCount:()=>Wr.max_count,getSpread:()=>e.uniforms.u_spread.value,setSpread:i=>{e.uniforms.u_spread.value=i},getRiseSpeed:()=>e.uniforms.u_rise_speed.value,setRiseSpeed:i=>{e.uniforms.u_rise_speed.value=i},getColor1:()=>pt(e.uniforms.u_color_1.value),setColor1:i=>e.uniforms.u_color_1.value.set(i),getColor2:()=>pt(e.uniforms.u_color_2.value),setColor2:i=>e.uniforms.u_color_2.value.set(i),getColor3:()=>pt(e.uniforms.u_color_3.value),setColor3:i=>e.uniforms.u_color_3.value.set(i),getParticleSize:()=>e.uniforms.u_size.value,setParticleSize:i=>{e.uniforms.u_size.value=i},getEmberCoolingTime:()=>e.uniforms.u_ember_cooling_time.value,setEmberCoolingTime:i=>{e.uniforms.u_ember_cooling_time.value=i},...So(e)}}const jx=`varying vec3 v_normal;\r
varying vec3 v_view_position;\r
varying vec3 v_world_position;\r
\r
void main() {\r
    v_world_position = (modelMatrix * vec4(position, 1.0)).xyz;\r
    vec4 view_position = modelViewMatrix * vec4(position, 1.0);\r
    v_view_position = view_position.xyz;\r
    v_normal = normalMatrix * normal;\r
    gl_Position = projectionMatrix * view_position;\r
}\r
`,Zx=`uniform vec3  u_color_core;\r
uniform vec3  u_color_edge;\r
uniform vec3  u_color_blood_orange;\r
uniform float u_time;\r
\r
varying vec3 v_normal;\r
varying vec3 v_view_position;\r
varying vec3 v_world_position;\r
\r
void main() {\r
    vec3 normal = normalize(v_normal);\r
    vec3 view_direction = normalize(-v_view_position);\r
\r
    // layered, animated turbulence (same recipe as the lava crust), so the disc reads as churning plasma\r
    vec3 noise_coordinate = v_world_position * 0.4 + vec3(u_time * 0.05, -u_time * 0.08, u_time * 0.03);\r
    float base_noise = normalizedFractalBrownianMotion(noise_coordinate);\r
    float warped_noise = warpedFractalBrownianMotion(noise_coordinate, 0.7);\r
    float turbulence = smoothstep(0.3, 0.7, mix(base_noise, warped_noise, 0.5));\r
\r
    vec3 color = mix(u_color_edge, u_color_core, turbulence);\r
\r
    // second, independently-animated noise layer for extra blood-orange patches over the base blend\r
    vec3 orange_coordinate = v_world_position * 0.7 + vec3(-u_time * 0.06, u_time * 0.09, u_time * 0.04);\r
    float orange_noise = normalizedFractalBrownianMotion(orange_coordinate);\r
    float orange_mask = smoothstep(0.55, 0.85, orange_noise);\r
    color = mix(color, u_color_blood_orange, orange_mask * 0.5);\r
\r
    // pulsing corona: brightens the grazing edge for a glowing rim instead of a hard silhouette.\r
    // Slow frequency so it stays a gentle breathing glow instead of aliasing into a flicker when\r
    // the global time scale is cranked up (u_time then advances much faster than real time).\r
    float pulse = 0.5 + 0.5 * sin(u_time * 0.07);\r
    float rim = pow(1.0 - max(dot(view_direction, normal), 0.0), 2.5);\r
    color += u_color_core * rim * (0.5 + 0.5 * pulse);\r
\r
    gl_FragColor = vec4(color, 1.0);\r
}\r
`;function $x(){return new at({vertexShader:jx,fragmentShader:wn+Zx,uniforms:{u_color_core:{value:new fe(yv)},u_color_edge:{value:new fe(xo)},u_color_blood_orange:{value:new fe(bv)},u_time:{value:0}},precision:"highp"})}function Jx(n,e){n.uniforms.u_time.value=e}function Qx(n){const e=new Ah(xo,Ev,Mv);e.position.set(Bn.x,Bn.y,Bn.z);const t=$x(),i=new Nt(new Da(Tv,32,32),t);return i.position.copy(e.position),n.add(e,i),{light:e,mesh:i,update(r){const o=Av+r*Rv;e.position.set(tc*Math.cos(o),wv,tc*Math.sin(o)),i.position.copy(e.position),Jx(t,r)},getVisible:()=>e.visible,setVisible:r=>{e.visible=r,i.visible=r}}}function eS(n){return{getColor:()=>pt(n.background),setColor:e=>n.background.set(e)}}const Oa=ri,as={enabled:de.interactionMode};function ai(n,e){const t=n.x-e.x,i=n.y-e.y,r=n.z-e.z;return Math.sqrt(t*t+i*i+r*r)}function tS(n,e,t){const i=e.x-n.x,r=e.y-n.y,o=e.z-n.z,s=Math.sqrt(i**2+r**2+o**2),a=i/s,l=r/s,c=o/s,d=t.x-n.x,u=t.y-n.y,f=t.z-n.z,_=d*a+u*l+f*c,v={x:n.x+a*_,y:n.y+l*_,z:n.z+c*_};return ai(t,v)}function Bu(n,e){let t=null,i=1/0;for(const r of n){if(!r.active)continue;const o=ai(e,r);o<i&&(i=o,t=r)}return{record:t,distance:i}}const da=Array.from({length:Oa},()=>({x:0,y:0,z:0,height_cap:0,last_touched_time:-1/0,active:!1}));let ls=0;function zu(n,e){let t=0;for(const i of e){const r=Math.max(ai(n,i)**2,1e-4),o=i.radius*i.radius*(i.isolation+i.subtract)/r-i.subtract;o>0&&(t+=o)}return e.length>0&&t>=e[0].isolation*qg}let Ti=null;function nS(n,e){if(!e)return Ti=null,null;const i=Ti&&ai(Ti,e)<=Eu?n-Ti.last_press_time:0;Ti={x:e.x,y:e.y,z:e.z,last_press_time:n};const r=i*(jg/Kg);return{x:e.x,y:e.y,z:e.z,shrink_increment:r}}function iS(){Ti=null}const ha=Array.from({length:an},()=>({x:0,y:0,z:0,first_active_time:-1/0,last_active_time:-1/0,ember_start_time:-1/0,ember_strength:1,active:!1}));let cs=0;function rS(n,e){const{record:t,distance:i}=Bu(ha,e);if(t&&i<=Eu){ai(t,e)>nv&&(t.ember_start_time=n,t.ember_strength=Math.max(rv,t.ember_strength*iv)),t.x=e.x,t.y=e.y,t.z=e.z,t.last_active_time=n;return}const r=ha[cs];r.x=e.x,r.y=e.y,r.z=e.z,r.first_active_time=n,r.last_active_time=n,r.ember_strength=1,r.ember_start_time=n,r.active=!0,cs=(cs+1)%an}function oS(n,e,t){const i=e.x-n.x,r=e.y-n.y,o=e.z-n.z,s=Math.sqrt(i**2+r**2+o**2);return{x:n.x+i/s*t,y:n.y+r/s*t,z:n.z+o/s*t}}function sS(n){return{x:n.x,y:n.y+Zg,z:n.z}}function mc(n,e,t,i){const r=oS(e,t,i*$g);rS(n,sS(r))}function aS(n,e,t,i){let r=null,o=1/0,s=null,a=1/0;for(const _ of t){const v=tS(i,e,_);v<o&&(o=v,r=_);const x=Math.max(0,ai(e,_)-_.radius);x<a&&(a=x,s=_)}const l=nS(n,o<=Yg?r:null),c=zu(e,t)||l!==null,{record:d,distance:u}=Bu(da,e);if(d&&u<=gv){if(c){const _=Un(n-d.last_touched_time,0,Gg);d.height_cap+=_*zg,d.last_touched_time=n,mc(n,e,i,d.height_cap)}return l}if(!c)return l;const f=da[ls];return f.x=e.x,f.y=e.y,f.z=e.z,f.height_cap=ai(e,s)*Bg,f.last_touched_time=n,f.active=!0,ls=(ls+1)%Oa,mc(n,e,i,f.height_cap),l}const us=[];function lS(n){us.length=0;for(let e=0;e<Oa;e++){const t=da[e];if(!t.active)continue;const i=n-t.last_touched_time;if(i>=Ql){t.active=!1;continue}const r=co(0,Ql,i);us.push({x:t.x,y:t.y,z:t.z,strength:t.height_cap,radius:kg,decay_progress:r})}return us}const ds=[];function cS(n){ds.length=0;for(const e of ha){if(!e.active)continue;const t=e.last_active_time-e.first_active_time,i=Un(t*Jg,Qg,ev),r=n-e.last_active_time;if(r>=i){e.active=!1;continue}const o=n-e.first_active_time,s=Math.min((n-e.ember_start_time)/tv,1),a=1-r/i;ds.push({x:e.x,y:e.y,z:e.z,bloom:s,fade:a,elapsed:o,ember_strength:e.ember_strength})}return ds}function uS(n,e){const t=new Lh,i=new xe;let r=!1;function o(s){const a=n.domElement.getBoundingClientRect();i.x=(s.clientX-a.left)/a.width*2-1,i.y=-((s.clientY-a.top)/a.height)*2+1}return n.domElement.addEventListener("mousedown",s=>{s.button===0&&(r=!0,iS(),o(s))}),n.domElement.addEventListener("mousemove",o),window.addEventListener("mouseup",()=>{r=!1}),{step(s,a,l,c){if(as.enabled){t.setFromCamera(i,a);const d=t.intersectObject(e,!1),u=d.length>0?l():null;if(n.domElement.style.cursor=u&&zu(d[0].point,u)?"pointer":"",r&&d.length>0){const f=aS(s,d[0].point,u,a.position);f&&c(f)}}else n.domElement.style.cursor="";return{touch_points:lS(s),smoke_bursts:cS(s)}},getEnabled:()=>as.enabled,setEnabled:s=>{as.enabled=s,s||(n.domElement.style.cursor="")}}}function dS(n,e){const t=an*ec,i=new Float32Array(t),r=new Float32Array(t*4),o=new Float32Array(t);for(let l=0;l<t;l++)i[l]=Math.floor(l/ec),r.set([ft(0,Math.PI*2),ft(.3,1),ft(.3,1),ft(0,1)],l*4),o[l]=ft(0,Mu);const s=new Gt;s.setAttribute("position",new dt(new Float32Array(t*3),3)),s.setAttribute("a_burst_index",new dt(i,1)),s.setAttribute("a_seed",new dt(r,4)),s.setAttribute("a_phase_offset",new dt(o,1));const a=new su(s,e);return a.position.set(0,0,0),a.frustumCulled=!1,n.add(a),a}const hS=`attribute float a_burst_index;\r
attribute vec4  a_seed; // angle, radius_seed, rise_seed, shape_seed\r
attribute float a_phase_offset;\r
\r
uniform float u_size;\r
uniform float u_spread_radius;\r
uniform float u_initial_spread_fraction;\r
uniform float u_rise_speed;\r
uniform float u_particle_lifetime;\r
uniform float u_haze_growth_duration;\r
uniform float u_haze_max_opacity;\r
uniform float u_rise_boost_duration;\r
uniform float u_max_rise_boost;\r
uniform float u_ember_radius_fraction;\r
uniform float u_grey_variance_min;\r
uniform vec3  u_burst_positions[INTERACTION_SMOKE_MAX_BURSTS];\r
uniform float u_burst_bloom[INTERACTION_SMOKE_MAX_BURSTS];\r
uniform float u_burst_fade[INTERACTION_SMOKE_MAX_BURSTS];\r
uniform float u_burst_elapsed[INTERACTION_SMOKE_MAX_BURSTS];\r
uniform float u_burst_ember_strength[INTERACTION_SMOKE_MAX_BURSTS];\r
\r
varying float v_opacity;\r
varying float v_color_mix;\r
varying float v_accent_mix;\r
varying float v_glow_mult;\r
varying float v_shape_seed;\r
\r
void main() {\r
    int burst_index = int(a_burst_index);\r
    vec3 origin = u_burst_positions[burst_index];\r
    float bloom = u_burst_bloom[burst_index];\r
    float fade = u_burst_fade[burst_index];\r
    float elapsed = u_burst_elapsed[burst_index];\r
    float ember_strength = u_burst_ember_strength[burst_index];\r
\r
    // Each particle repeats its own short rise-and-fade cycle from the origin for as long as the\r
    // burst lives, so staying longer adds more overlapping puffs instead of one ever-growing mass.\r
    // Wrapping elapsed forward by the phase offset (rather than gating until elapsed catches up to\r
    // it) puts every particle somewhere in its own cycle from the very first frame, so a fresh touch\r
    // reads as an immediate, already-going puff of smoke instead of slowly fading in.\r
    float cycle_time = mod(elapsed + a_phase_offset, u_particle_lifetime);\r
    float local_progress = cycle_time / u_particle_lifetime;\r
\r
    float angle = a_seed.x + cycle_time * 0.8;\r
    // Already spread out sideways at the very start of the cycle instead of converging to a point -\r
    // same particle count and opacity (density unchanged), just wider from the first frame onward.\r
    float radius = a_seed.y * u_spread_radius * mix(u_initial_spread_fraction, 1.0, local_progress);\r
    // The longer this spot has been continuously pressed, the higher each puff cycle rises - on top\r
    // of (not instead of) its own per-cycle rise, so a long-held touch reaches noticeably further up.\r
    float rise_boost = mix(1.0, u_max_rise_boost, clamp(elapsed / u_rise_boost_duration, 0.0, 1.0));\r
    float rise = a_seed.z * u_rise_speed * cycle_time * rise_boost;\r
    vec3 world_position = origin + vec3(radius * cos(angle), rise, radius * sin(angle));\r
\r
    float puff_opacity = smoothstep(0.0, 0.15, local_progress) * (1.0 - smoothstep(0.6, 1.0, local_progress));\r
\r
    // shape_seed (a_seed.w) drives the edge-shape noise phase and a bit of glow-intensity variance\r
    // below; base color instead depends on radius/progress - the ember is confined to a small radius\r
    // near the origin (early in each puff's own cycle), while the rest of the (larger) radius is\r
    // already grey smoke, regardless of how long the burst has bloomed. That keeps grey smoke present\r
    // - and gently rising - right from the first frame, alongside the small orange core.\r
    float shape_seed = a_seed.w;\r
    float radial_color = smoothstep(0.0, u_ember_radius_fraction, local_progress);\r
    float base_color_mix = clamp(max(bloom, radial_color), 0.0, 1.0);\r
    // Once fully grey, each particle settles at its own fixed shade (between u_grey_variance_min and\r
    // 1.0) instead of every grey particle converging on the exact same near-black COLOR_2 tone.\r
    float grey_ceiling = mix(u_grey_variance_min, 1.0, shape_seed);\r
    v_color_mix = min(base_color_mix, grey_ceiling);\r
    v_accent_mix = (1.0 - v_color_mix) * mix(1.0, 0.4, shape_seed) * ember_strength;\r
    v_glow_mult = 1.0;\r
    v_shape_seed = shape_seed;\r
\r
    // The longer this spot keeps being pressed, the more grey haze lingers in the background: only\r
    // the already grey-leaning particles build up a growing opacity floor, so they stop fully fading\r
    // out between their own rise-cycles instead of every puff getting brighter.\r
    float haze_growth = clamp(elapsed / u_haze_growth_duration, 0.0, 1.0);\r
    float is_grey_leaning = smoothstep(0.4, 0.6, v_color_mix);\r
    float haze_opacity = haze_growth * u_haze_max_opacity * is_grey_leaning;\r
    v_opacity = max(puff_opacity, haze_opacity) * fade;\r
\r
    vec4 view_position = modelViewMatrix * vec4(world_position, 1.0);\r
    const float REFERENCE_DISTANCE = 10.0;\r
    float attenuation = REFERENCE_DISTANCE / max(-view_position.z, 0.001);\r
    gl_PointSize = clamp(u_size * attenuation, 1.0, 150.0);\r
    gl_Position = projectionMatrix * view_position;\r
}\r
`,fS=hS.replaceAll("INTERACTION_SMOKE_MAX_BURSTS",an);function pS(){return new at({vertexShader:fS,fragmentShader:wn+ku,uniforms:{u_size:{value:pv},u_spread_radius:{value:dv},u_initial_spread_fraction:{value:hv},u_rise_speed:{value:fv},u_particle_lifetime:{value:Mu},u_haze_growth_duration:{value:ov},u_haze_max_opacity:{value:sv},u_rise_boost_duration:{value:av},u_max_rise_boost:{value:lv},u_ember_radius_fraction:{value:cv},u_grey_variance_min:{value:uv},u_burst_positions:{value:Array.from({length:an},()=>new D)},u_burst_bloom:{value:new Float32Array(an)},u_burst_fade:{value:new Float32Array(an)},u_burst_elapsed:{value:new Float32Array(an)},u_burst_ember_strength:{value:new Float32Array(an).fill(1)},u_color_1:{value:new fe(_v)},u_color_2:{value:new fe(mv)},u_color_3:{value:new fe(de.smokeColor3)},u_ember_glow_strength:{value:Lu},u_sun_color:{value:new fe(Tu)},u_sun_enabled:{value:1},u_sun_strength:{value:de.sunStrength}},transparent:!0,depthWrite:!1,depthTest:!1,precision:"highp"})}function _S(n,e){const t=n.uniforms.u_burst_positions.value,i=n.uniforms.u_burst_bloom.value,r=n.uniforms.u_burst_fade.value,o=n.uniforms.u_burst_elapsed.value,s=n.uniforms.u_burst_ember_strength.value;for(let a=0;a<an;a++){const l=e[a];l?(t[a].set(l.x,l.y,l.z),i[a]=l.bloom,r[a]=l.fade,o[a]=l.elapsed,s[a]=l.ember_strength):r[a]=0}}function mS(n){const e=pS(),t=dS(n,e);return{mesh:t,update(i){_S(e,i)},getVisible:()=>t.visible,setVisible:i=>{t.visible=i},...So(e)}}function gS({scene:n,camera:e,renderer:t,bloom_pass:i,god_rays_pass:r,setControlsEnabled:o}){const s=gx(n),a=wx(n),l=Bx(n),c=Kx(n),d=Qx(n),u=eS(n),f=uS(t,a.mesh),_=mS(n);l.effect.position.y=.36,a.mesh.position.y=s.mesh.position.y;const v=l.effect.position.y-a.mesh.position.y,x={x:0,y:0,z:0};let m=de.metaballHeight,h=de.timeScale;function A(p){s.mesh.position.y=p,a.mesh.position.y=p+x.y,l.effect.position.y=p+x.y+v+m,c.effect.position.y=p+x.y+Dv}const g={update(p){d.update(p),s.update(e,a.mesh.position,d.light.position,p),l.update(p,e);const{touch_points:T,smoke_bursts:b}=f.step(p,e,()=>l.getActiveWorldPositions(),L=>l.squeezeNearestBall(L));a.update(e,d.light.position,T),_.update(b),c.update(p,l.getEruptionIntensity(p))},isPaused:()=>l.isPaused(),setPaused:p=>l.setPaused(p),getTimeScale:()=>h,setTimeScale:p=>{h=p},getInteractionMode:()=>f.getEnabled(),setInteractionMode:p=>{f.setEnabled(p),o(!p)},getInteractionSmokeVisible:()=>_.getVisible(),setInteractionSmokeVisible:p=>_.setVisible(p),getMetaballCount:()=>l.getCount(),setMetaballCount:p=>l.setCount(p),getMaxMetaballCount:()=>l.getMaxCount(),getMetaballIsolation:()=>l.getIsolation(),setMetaballIsolation:p=>l.setIsolation(p),getMetaballRadius:()=>l.getRadius(),setMetaballRadius:p=>l.setRadius(p),getMetaballSpread:()=>l.getSpread(),setMetaballSpread:p=>l.setSpread(p),getMetaballSpeed:()=>l.getSpeed(),setMetaballSpeed:p=>l.setSpeed(p),getMetaballSinkSpeed:()=>l.getSinkSpeed(),setMetaballSinkSpeed:p=>l.setSinkSpeed(p),getMetaballDisappearY:()=>l.getDisappearY(),setMetaballDisappearY:p=>l.setDisappearY(p),getMetaballHeight:()=>m,setMetaballHeight:p=>{m=p,A(s.mesh.position.y)},getFlowRadius:()=>l.getFlowRadius(),setFlowRadius:p=>l.setFlowRadius(p),getColorHot:()=>l.getColorHot(),setColorHot:p=>l.setColorHot(p),getColorCool:()=>l.getColorCool(),setColorCool:p=>l.setColorCool(p),getGlowEnabled:()=>l.getGlowEnabled(),setGlowEnabled:p=>l.setGlowEnabled(p),getGlowColor:()=>l.getGlowColor(),setGlowColor:p=>l.setGlowColor(p),getNoiseEnabled:()=>l.getNoiseEnabled(),setNoiseEnabled:p=>l.setNoiseEnabled(p),getNoiseColor1:()=>l.getNoiseColor1(),setNoiseColor1:p=>l.setNoiseColor1(p),getNoiseColor2:()=>l.getNoiseColor2(),setNoiseColor2:p=>l.setNoiseColor2(p),getBumpEnabled:()=>l.getBumpEnabled(),setBumpEnabled:p=>l.setBumpEnabled(p),getDisplacementEnabled:()=>l.getDisplacementEnabled(),setDisplacementEnabled:p=>l.setDisplacementEnabled(p),getDisplacementStrength:()=>l.getDisplacementStrength(),setDisplacementStrength:p=>l.setDisplacementStrength(p),getGroundVisible:()=>s.getVisible(),setGroundVisible:p=>s.setVisible(p),getGroundColor:()=>s.getColor(),setGroundColor:p=>s.setColor(p),getGroundColor2:()=>s.getColor2(),setGroundColor2:p=>s.setColor2(p),getGroundColor3:()=>s.getColor3(),setGroundColor3:p=>s.setColor3(p),getGroundColor4:()=>s.getColor4(),setGroundColor4:p=>s.setColor4(p),getGroundCrackColor:()=>s.getCrackColor(),setGroundCrackColor:p=>s.setCrackColor(p),getGroundCrackColor2:()=>s.getCrackColor2(),setGroundCrackColor2:p=>s.setCrackColor2(p),getGroundCrackColor3:()=>s.getCrackColor3(),setGroundCrackColor3:p=>s.setCrackColor3(p),getGroundCrackColor4:()=>s.getCrackColor4(),setGroundCrackColor4:p=>s.setCrackColor4(p),getGroundCrackSoftness:()=>s.getCrackSoftness(),setGroundCrackSoftness:p=>s.setCrackSoftness(p),getGroundProximityColor:()=>s.getProximityColor(),setGroundProximityColor:p=>s.setProximityColor(p),getGroundProximityNoiseColor:()=>s.getProximityNoiseColor(),setGroundProximityNoiseColor:p=>s.setProximityNoiseColor(p),getGroundProximityRadius:()=>s.getProximityRadius(),setGroundProximityRadius:p=>s.setProximityRadius(p),getGroundSunFocusRadius:()=>s.getSunFocusRadius(),setGroundSunFocusRadius:p=>s.setSunFocusRadius(p),getGroundRockVarianceRadius:()=>s.getRockVarianceRadius(),setGroundRockVarianceRadius:p=>s.setRockVarianceRadius(p),getGroundDisplacementScale:()=>s.getDisplacementScale(),setGroundDisplacementScale:p=>s.setDisplacementScale(p),getGroundDisplacementFrequency:()=>s.getDisplacementFrequency(),setGroundDisplacementFrequency:p=>s.setDisplacementFrequency(p),getGroundHeight:()=>s.mesh.position.y,setGroundHeight:p=>A(p),getGroundMesh:()=>s.mesh,getVolcanoPosition:()=>a.mesh.position,getVolcanoMesh:()=>a.mesh,getSunMesh:()=>d.mesh,getVolcanoVisible:()=>a.getVisible(),setVolcanoVisible:p=>a.setVisible(p),getVolcanoRockColor:()=>a.getRockColor(),setVolcanoRockColor:p=>a.setRockColor(p),getVolcanoDisplacementScale:()=>a.getDisplacementScale(),setVolcanoDisplacementScale:p=>a.setDisplacementScale(p),getVolcanoDisplacementFrequency:()=>a.getDisplacementFrequency(),setVolcanoDisplacementFrequency:p=>a.setDisplacementFrequency(p),getSunVisible:()=>d.getVisible(),setSunVisible:p=>{d.setVisible(p),s.setSunEnabled(p),a.setSunEnabled(p),c.setSunEnabled(p),_.setSunEnabled(p)},getSunStrength:()=>a.getSunStrength(),setSunStrength:p=>{s.setSunStrength(p),a.setSunStrength(p),c.setSunStrength(p),_.setSunStrength(p)},getSunFocus:()=>a.getSunFocus(),setSunFocus:p=>{s.setSunFocus(p),a.setSunFocus(p)},getSmokeVisible:()=>c.getVisible(),setSmokeVisible:p=>c.setVisible(p),getSmokeCount:()=>c.getCount(),setSmokeCount:p=>c.setCount(p),getMaxSmokeCount:()=>c.getMaxCount(),getSmokeSpread:()=>c.getSpread(),setSmokeSpread:p=>c.setSpread(p),getSmokeRiseSpeed:()=>c.getRiseSpeed(),setSmokeRiseSpeed:p=>c.setRiseSpeed(p),getSmokeColor1:()=>c.getColor1(),setSmokeColor1:p=>c.setColor1(p),getSmokeColor2:()=>c.getColor2(),setSmokeColor2:p=>c.setColor2(p),getSmokeColor3:()=>c.getColor3(),setSmokeColor3:p=>c.setColor3(p),getSmokeParticleSize:()=>c.getParticleSize(),setSmokeParticleSize:p=>c.setParticleSize(p),getSmokeEmberCoolingTime:()=>c.getEmberCoolingTime(),setSmokeEmberCoolingTime:p=>c.setEmberCoolingTime(p),getOffsetX:()=>x.x,setOffsetX:p=>{x.x=p,a.mesh.position.x=p,l.effect.position.x=p,c.effect.position.x=p},getOffsetY:()=>x.y,setOffsetY:p=>{x.y=p,A(s.mesh.position.y)},getOffsetZ:()=>x.z,setOffsetZ:p=>{x.z=p,a.mesh.position.z=p,l.effect.position.z=p,c.effect.position.z=p},getBloomEnabled:()=>i.enabled,setBloomEnabled:p=>{i.enabled=p},getBloomStrength:()=>i.strength,setBloomStrength:p=>{i.strength=p},getBloomRadius:()=>i.radius,setBloomRadius:p=>{i.radius=p},getBloomThreshold:()=>i.threshold,setBloomThreshold:p=>{i.threshold=p},getSkyColor:()=>u.getColor(),setSkyColor:p=>u.setColor(p),getGodRaysWeight:()=>r.getWeight(),setGodRaysWeight:p=>r.setWeight(p),getGodRaysExposure:()=>r.getExposure(),setGodRaysExposure:p=>r.setExposure(p),getGodRaysDecay:()=>r.getDecay(),setGodRaysDecay:p=>r.setDecay(p),getGodRaysDensity:()=>r.getDensity(),setGodRaysDensity:p=>r.setDensity(p),getGodRaysTintColor:()=>r.getTintColor(),setGodRaysTintColor:p=>r.setTintColor(p),getSnapshot:R,applySnapshot:P,resetToDefaults:()=>P(de)},E=[{key:"paused",get:()=>g.isPaused(),set:p=>g.setPaused(p)},{key:"timeScale",get:()=>g.getTimeScale(),set:p=>g.setTimeScale(p)},{key:"interactionMode",get:()=>g.getInteractionMode(),set:p=>g.setInteractionMode(p)},{key:"interactionSmokeVisible",get:()=>g.getInteractionSmokeVisible(),set:p=>g.setInteractionSmokeVisible(p)},{key:"metaballCount",get:()=>g.getMetaballCount(),set:p=>g.setMetaballCount(p)},{key:"metaballIsolation",get:()=>g.getMetaballIsolation(),set:p=>g.setMetaballIsolation(p)},{key:"metaballRadius",get:()=>g.getMetaballRadius(),set:p=>g.setMetaballRadius(p)},{key:"metaballSpread",get:()=>g.getMetaballSpread(),set:p=>g.setMetaballSpread(p)},{key:"metaballSpeed",get:()=>g.getMetaballSpeed(),set:p=>g.setMetaballSpeed(p)},{key:"metaballSinkSpeed",get:()=>g.getMetaballSinkSpeed(),set:p=>g.setMetaballSinkSpeed(p)},{key:"metaballDisappearY",get:()=>g.getMetaballDisappearY(),set:p=>g.setMetaballDisappearY(p)},{key:"metaballHeight",get:()=>g.getMetaballHeight(),set:p=>g.setMetaballHeight(p)},{key:"flowRadius",get:()=>g.getFlowRadius(),set:p=>g.setFlowRadius(p)},{key:"colorHot",get:()=>g.getColorHot(),set:p=>g.setColorHot(p)},{key:"colorCool",get:()=>g.getColorCool(),set:p=>g.setColorCool(p)},{key:"glowEnabled",get:()=>g.getGlowEnabled(),set:p=>g.setGlowEnabled(p)},{key:"glowColor",get:()=>g.getGlowColor(),set:p=>g.setGlowColor(p)},{key:"noiseEnabled",get:()=>g.getNoiseEnabled(),set:p=>g.setNoiseEnabled(p)},{key:"noiseColor1",get:()=>g.getNoiseColor1(),set:p=>g.setNoiseColor1(p)},{key:"noiseColor2",get:()=>g.getNoiseColor2(),set:p=>g.setNoiseColor2(p)},{key:"bumpEnabled",get:()=>g.getBumpEnabled(),set:p=>g.setBumpEnabled(p)},{key:"displacementEnabled",get:()=>g.getDisplacementEnabled(),set:p=>g.setDisplacementEnabled(p)},{key:"displacementStrength",get:()=>g.getDisplacementStrength(),set:p=>g.setDisplacementStrength(p)},{key:"groundVisible",get:()=>g.getGroundVisible(),set:p=>g.setGroundVisible(p)},{key:"groundColor",get:()=>g.getGroundColor(),set:p=>g.setGroundColor(p)},{key:"groundColor2",get:()=>g.getGroundColor2(),set:p=>g.setGroundColor2(p)},{key:"groundColor3",get:()=>g.getGroundColor3(),set:p=>g.setGroundColor3(p)},{key:"groundColor4",get:()=>g.getGroundColor4(),set:p=>g.setGroundColor4(p)},{key:"groundCrackColor",get:()=>g.getGroundCrackColor(),set:p=>g.setGroundCrackColor(p)},{key:"groundCrackColor2",get:()=>g.getGroundCrackColor2(),set:p=>g.setGroundCrackColor2(p)},{key:"groundCrackColor3",get:()=>g.getGroundCrackColor3(),set:p=>g.setGroundCrackColor3(p)},{key:"groundCrackColor4",get:()=>g.getGroundCrackColor4(),set:p=>g.setGroundCrackColor4(p)},{key:"groundCrackSoftness",get:()=>g.getGroundCrackSoftness(),set:p=>g.setGroundCrackSoftness(p)},{key:"groundProximityColor",get:()=>g.getGroundProximityColor(),set:p=>g.setGroundProximityColor(p)},{key:"groundProximityNoiseColor",get:()=>g.getGroundProximityNoiseColor(),set:p=>g.setGroundProximityNoiseColor(p)},{key:"groundProximityRadius",get:()=>g.getGroundProximityRadius(),set:p=>g.setGroundProximityRadius(p)},{key:"groundSunFocusRadius",get:()=>g.getGroundSunFocusRadius(),set:p=>g.setGroundSunFocusRadius(p)},{key:"groundRockVarianceRadius",get:()=>g.getGroundRockVarianceRadius(),set:p=>g.setGroundRockVarianceRadius(p)},{key:"groundDisplacementScale",get:()=>g.getGroundDisplacementScale(),set:p=>g.setGroundDisplacementScale(p)},{key:"groundDisplacementFrequency",get:()=>g.getGroundDisplacementFrequency(),set:p=>g.setGroundDisplacementFrequency(p)},{key:"groundHeight",get:()=>g.getGroundHeight(),set:p=>g.setGroundHeight(p)},{key:"volcanoVisible",get:()=>g.getVolcanoVisible(),set:p=>g.setVolcanoVisible(p)},{key:"volcanoDisplacementScale",get:()=>g.getVolcanoDisplacementScale(),set:p=>g.setVolcanoDisplacementScale(p)},{key:"volcanoDisplacementFrequency",get:()=>g.getVolcanoDisplacementFrequency(),set:p=>g.setVolcanoDisplacementFrequency(p)},{key:"volcanoRockColor",get:()=>g.getVolcanoRockColor(),set:p=>g.setVolcanoRockColor(p)},{key:"sunVisible",get:()=>g.getSunVisible(),set:p=>g.setSunVisible(p)},{key:"sunStrength",get:()=>g.getSunStrength(),set:p=>g.setSunStrength(p)},{key:"sunFocus",get:()=>g.getSunFocus(),set:p=>g.setSunFocus(p)},{key:"smokeVisible",get:()=>g.getSmokeVisible(),set:p=>g.setSmokeVisible(p)},{key:"smokeCount",get:()=>g.getSmokeCount(),set:p=>g.setSmokeCount(p)},{key:"smokeSpread",get:()=>g.getSmokeSpread(),set:p=>g.setSmokeSpread(p)},{key:"smokeRiseSpeed",get:()=>g.getSmokeRiseSpeed(),set:p=>g.setSmokeRiseSpeed(p)},{key:"smokeColor1",get:()=>g.getSmokeColor1(),set:p=>g.setSmokeColor1(p)},{key:"smokeColor2",get:()=>g.getSmokeColor2(),set:p=>g.setSmokeColor2(p)},{key:"smokeColor3",get:()=>g.getSmokeColor3(),set:p=>g.setSmokeColor3(p)},{key:"smokeParticleSize",get:()=>g.getSmokeParticleSize(),set:p=>g.setSmokeParticleSize(p)},{key:"smokeEmberCoolingTime",get:()=>g.getSmokeEmberCoolingTime(),set:p=>g.setSmokeEmberCoolingTime(p)},{key:"offsetX",get:()=>g.getOffsetX(),set:p=>g.setOffsetX(p)},{key:"offsetY",get:()=>g.getOffsetY(),set:p=>g.setOffsetY(p)},{key:"offsetZ",get:()=>g.getOffsetZ(),set:p=>g.setOffsetZ(p)},{key:"bloomEnabled",get:()=>g.getBloomEnabled(),set:p=>g.setBloomEnabled(p)},{key:"bloomStrength",get:()=>g.getBloomStrength(),set:p=>g.setBloomStrength(p)},{key:"bloomRadius",get:()=>g.getBloomRadius(),set:p=>g.setBloomRadius(p)},{key:"bloomThreshold",get:()=>g.getBloomThreshold(),set:p=>g.setBloomThreshold(p)},{key:"skyColor",get:()=>g.getSkyColor(),set:p=>g.setSkyColor(p)},{key:"godRaysWeight",get:()=>g.getGodRaysWeight(),set:p=>g.setGodRaysWeight(p)},{key:"godRaysExposure",get:()=>g.getGodRaysExposure(),set:p=>g.setGodRaysExposure(p)},{key:"godRaysDecay",get:()=>g.getGodRaysDecay(),set:p=>g.setGodRaysDecay(p)},{key:"godRaysDensity",get:()=>g.getGodRaysDensity(),set:p=>g.setGodRaysDensity(p)},{key:"godRaysTintColor",get:()=>g.getGodRaysTintColor(),set:p=>g.setGodRaysTintColor(p)}],I=Object.fromEntries(E.map(({key:p,set:T})=>[p,T]));function R(){const p={};for(const{key:T,get:b}of E)p[T]=b();return p}function P(p){for(const[T,b]of Object.entries(p))I[T]&&I[T](b)}return A(s.mesh.position.y),g}const gc={type:"change"},Fa={type:"start"},Gu={type:"end"},Xr=new mo,vc=new In,vS=Math.cos(70*qd.DEG2RAD),gt=new D,It=2*Math.PI,Je={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},hs=1e-6;class xS extends Ih{constructor(e,t=null){super(e,t),this.state=Je.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Di.ROTATE,MIDDLE:Di.DOLLY,RIGHT:Di.PAN},this.touches={ONE:Ci.ROTATE,TWO:Ci.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new si,this._lastTargetPosition=new D,this._quat=new si().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Tl,this._sphericalDelta=new Tl,this._scale=1,this._panOffset=new D,this._rotateStart=new xe,this._rotateEnd=new xe,this._rotateDelta=new xe,this._panStart=new xe,this._panEnd=new xe,this._panDelta=new xe,this._dollyStart=new xe,this._dollyEnd=new xe,this._dollyDelta=new xe,this._dollyDirection=new D,this._mouse=new xe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=yS.bind(this),this._onPointerDown=SS.bind(this),this._onPointerUp=bS.bind(this),this._onContextMenu=RS.bind(this),this._onMouseWheel=TS.bind(this),this._onKeyDown=wS.bind(this),this._onTouchStart=AS.bind(this),this._onTouchMove=CS.bind(this),this._onMouseDown=ES.bind(this),this._onMouseMove=MS.bind(this),this._interceptControlDown=PS.bind(this),this._interceptControlUp=DS.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(gc),this.update(),this.state=Je.NONE}update(e=null){const t=this.object.position;gt.copy(t).sub(this.target),gt.applyQuaternion(this._quat),this._spherical.setFromVector3(gt),this.autoRotate&&this.state===Je.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=It:i>Math.PI&&(i-=It),r<-Math.PI?r+=It:r>Math.PI&&(r-=It),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let o=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const s=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),o=s!=this._spherical.radius}if(gt.setFromSpherical(this._spherical),gt.applyQuaternion(this._quatInverse),t.copy(this.target).add(gt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let s=null;if(this.object.isPerspectiveCamera){const a=gt.length();s=this._clampDistance(a*this._scale);const l=a-s;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),o=!!l}else if(this.object.isOrthographicCamera){const a=new D(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),o=l!==this.object.zoom;const c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),s=gt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;s!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(s).add(this.object.position):(Xr.origin.copy(this.object.position),Xr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Xr.direction))<vS?this.object.lookAt(this.target):(vc.setFromNormalAndCoplanarPoint(this.object.up,this.target),Xr.intersectPlane(vc,this.target))))}else if(this.object.isOrthographicCamera){const s=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),s!==this.object.zoom&&(this.object.updateProjectionMatrix(),o=!0)}return this._scale=1,this._performCursorZoom=!1,o||this._lastPosition.distanceToSquared(this.object.position)>hs||8*(1-this._lastQuaternion.dot(this.object.quaternion))>hs||this._lastTargetPosition.distanceToSquared(this.target)>hs?(this.dispatchEvent(gc),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?It/60*this.autoRotateSpeed*e:It/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){gt.setFromMatrixColumn(t,0),gt.multiplyScalar(-e),this._panOffset.add(gt)}_panUp(e,t){this.screenSpacePanning===!0?gt.setFromMatrixColumn(t,1):(gt.setFromMatrixColumn(t,0),gt.crossVectors(this.object.up,gt)),gt.multiplyScalar(e),this._panOffset.add(gt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;gt.copy(r).sub(this.target);let o=gt.length();o*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*o/i.clientHeight,this.object.matrix),this._panUp(2*t*o/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,o=t-i.top,s=i.width,a=i.height;this._mouse.x=r/s*2-1,this._mouse.y=-(o/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(It*this._rotateDelta.x/t.clientHeight),this._rotateUp(It*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(It*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-It*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(It*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-It*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,o=Math.sqrt(i*i+r*r);this._dollyStart.set(0,o)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),o=.5*(e.pageY+i.y);this._rotateEnd.set(r,o)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(It*this._rotateDelta.x/t.clientHeight),this._rotateUp(It*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,o=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,o),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const s=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(s,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new xe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function SS(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function yS(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function bS(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Gu),this.state=Je.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function ES(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Di.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=Je.DOLLY;break;case Di.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Je.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Je.ROTATE}break;case Di.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Je.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Je.PAN}break;default:this.state=Je.NONE}this.state!==Je.NONE&&this.dispatchEvent(Fa)}function MS(n){switch(this.state){case Je.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case Je.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case Je.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function TS(n){this.enabled===!1||this.enableZoom===!1||this.state!==Je.NONE||(n.preventDefault(),this.dispatchEvent(Fa),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Gu))}function wS(n){this.enabled!==!1&&this._handleKeyDown(n)}function AS(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Ci.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=Je.TOUCH_ROTATE;break;case Ci.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=Je.TOUCH_PAN;break;default:this.state=Je.NONE}break;case 2:switch(this.touches.TWO){case Ci.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=Je.TOUCH_DOLLY_PAN;break;case Ci.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=Je.TOUCH_DOLLY_ROTATE;break;default:this.state=Je.NONE}break;default:this.state=Je.NONE}this.state!==Je.NONE&&this.dispatchEvent(Fa)}function CS(n){switch(this._trackPointer(n),this.state){case Je.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case Je.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case Je.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case Je.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=Je.NONE}}function RS(n){this.enabled!==!1&&n.preventDefault()}function PS(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function DS(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function LS(n){const e=new Bt(yg,window.innerWidth/window.innerHeight,bg,Eg);e.position.set(ns.x,ns.y,ns.z);const t=new xS(e,n.domElement);return t.enableDamping=!0,t.minDistance=Mg,t.maxDistance=Tg,t.minPolarAngle=wg,t.maxPolarAngle=Ag,{camera:e,update(i){t.target.copy(i),t.update()},resize(i,r){e.aspect=i/r,e.updateProjectionMatrix()},setControlsEnabled(i){t.enabled=i}}}function IS(n){const e=new Ph(Wv,Xv),t=new Rh(Hv,Vv);return t.position.set(Ui.x,Ui.y,Ui.z),t.castShadow=!0,t.shadow.mapSize.set(ic,ic),t.shadow.camera.near=Yv,t.shadow.camera.far=Kv,t.shadow.camera.left=-Hr,t.shadow.camera.right=Hr,t.shadow.camera.top=Hr,t.shadow.camera.bottom=-Hr,t.shadow.bias=jv,n.add(e,t),{ambient_light:e,key_light:t}}const io={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Wi{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const NS=new Ia(-1,1,1,-1,0,1);class US extends Gt{constructor(){super(),this.setAttribute("position",new Pt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Pt([0,2,0,0,2,0],2))}}const OS=new US;class ka{constructor(e){this._mesh=new Nt(OS,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,NS)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class FS extends Wi{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof at?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ao.clone(e.uniforms),this.material=new at({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new ka(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class xc extends Wi{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const r=e.getContext(),o=e.state;o.buffers.color.setMask(!1),o.buffers.depth.setMask(!1),o.buffers.color.setLocked(!0),o.buffers.depth.setLocked(!0);let s,a;this.inverse?(s=0,a=1):(s=1,a=0),o.buffers.stencil.setTest(!0),o.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),o.buffers.stencil.setFunc(r.ALWAYS,s,4294967295),o.buffers.stencil.setClear(a),o.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),o.buffers.color.setLocked(!1),o.buffers.depth.setLocked(!1),o.buffers.color.setMask(!0),o.buffers.depth.setMask(!0),o.buffers.stencil.setLocked(!1),o.buffers.stencil.setFunc(r.EQUAL,1,4294967295),o.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),o.buffers.stencil.setLocked(!0)}}class kS extends Wi{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class BS{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new xe);this._width=i.width,this._height=i.height,t=new zt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:bn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new FS(io),this.copyPass.material.blending=yn,this.clock=new lu}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let r=0,o=this.passes.length;r<o;r++){const s=this.passes[r];if(s.enabled!==!1){if(s.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),s.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),s.needsSwap){if(i){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}xc!==void 0&&(s instanceof xc?i=!0:s instanceof kS&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new xe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(i,r),this.renderTarget2.setSize(i,r);for(let o=0;o<this.passes.length;o++)this.passes[o].setSize(i,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class zS extends Wi{constructor(e,t,i=null,r=null,o=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=r,this.clearAlpha=o,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new fe}render(e,t,i){const r=e.autoClear;e.autoClear=!1;let o,s;this.overrideMaterial!==null&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(o=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(o),this.overrideMaterial!==null&&(this.scene.overrideMaterial=s),e.autoClear=r}}const GS={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new fe(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Gi extends Wi{constructor(e,t=1,i,r){super(),this.strength=t,this.radius=i,this.threshold=r,this.resolution=e!==void 0?new xe(e.x,e.y):new xe(256,256),this.clearColor=new fe(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let o=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);this.renderTargetBright=new zt(o,s,{type:bn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new zt(o,s,{type:bn});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const f=new zt(o,s,{type:bn});f.texture.name="UnrealBloomPass.v"+d,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),o=Math.round(o/2),s=Math.round(s/2)}const a=GS;this.highPassUniforms=ao.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new at({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];o=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new xe(1/o,1/s),o=Math.round(o/2),s=Math.round(s/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ao.clone(io.uniforms),this.blendMaterial=new at({uniforms:this.copyUniforms,vertexShader:io.vertexShader,fragmentShader:io.fragmentShader,blending:_s,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new fe,this._oldClearAlpha=1,this._basic=new go,this._fsQuad=new ka(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(i,r);for(let o=0;o<this.nMips;o++)this.renderTargetsHorizontal[o].setSize(i,r),this.renderTargetsVertical[o].setSize(i,r),this.separableBlurMaterials[o].uniforms.invSize.value=new xe(1/i,1/r),i=Math.round(i/2),r=Math.round(r/2)}render(e,t,i,r,o){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const s=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),o&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=Gi.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Gi.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,o&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=s}_getSeparableBlurMaterial(e){const t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new at({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new xe(.5,.5)},direction:{value:new xe(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(e){return new at({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Gi.BlurDirectionX=new xe(1,0);Gi.BlurDirectionY=new xe(0,1);const Hu=`varying vec2 v_uv;\r
void main() {\r
    v_uv = uv;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
}\r
`,HS=`uniform sampler2D u_occlusion;\r
uniform vec2 u_light_uv;\r
uniform float u_exposure;\r
uniform float u_decay;\r
uniform float u_density;\r
uniform float u_weight;\r
uniform float u_visibility;\r
uniform float u_aspect;\r
varying vec2 v_uv;\r
\r
void main() {\r
    vec2 delta_uv = (v_uv - u_light_uv) * (u_density / float(NUM_SAMPLES));\r
    vec2 sample_position = v_uv;\r
    float illumination_decay = 1.0;\r
    vec3 color = vec3(0.0);\r
\r
    for (int i = 0; i < NUM_SAMPLES; i++) {\r
        sample_position -= delta_uv;\r
        color += texture2D(u_occlusion, sample_position).rgb * illumination_decay * u_weight;\r
        illumination_decay *= u_decay;\r
    }\r
\r
    // corrects for the viewport's aspect ratio, or the streaks/gap below render as an ellipse\r
    vec2 to_fragment = v_uv - u_light_uv;\r
    to_fragment.x *= u_aspect;\r
\r
    // fixed angular pattern fakes irregular partial occlusion, so this reads as rays, not a flat gradient\r
    float angle = atan(to_fragment.y, to_fragment.x);\r
    float streaks = 0.5 + 0.5 * sin(angle * 22.0 + sin(angle * 6.0) * 2.5);\r
    streaks = mix(0.35, 1.0, streaks);\r
\r
    // gap before the glow ramps in, so this doesn't read as a second blob next to the sun's own disc\r
    float near_light_fade = smoothstep(0.05, 0.11, length(to_fragment));\r
    gl_FragColor = vec4(color * u_exposure * u_visibility * near_light_fade * streaks, 1.0);\r
}\r
`,VS=`varying vec3 v_normal;\r
void main() {\r
    v_normal = normalize(normalMatrix * normal);\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
}\r
`,WS=`varying vec3 v_normal;\r
\r
// fades instead of a hard edge, or radial resampling produces a visible ring\r
void main() {\r
    float intensity = pow(clamp(v_normal.z, 0.0, 1.0), 1.5);\r
    gl_FragColor = vec4(vec3(intensity), 1.0);\r
}\r
`,XS=`uniform sampler2D u_base;\r
uniform sampler2D u_god_rays;\r
uniform sampler2D u_depth;\r
uniform vec3 u_tint;\r
varying vec2 v_uv;\r
\r
// depth == 1.0 means open air in the occlusion pass; otherwise the glow would shine through solid ground\r
void main() {\r
    float depth = texture2D(u_depth, v_uv).r;\r
    float open_air = step(0.9999, depth);\r
    vec3 god_rays = texture2D(u_god_rays, v_uv).rgb * u_tint * open_air;\r
    gl_FragColor = vec4(texture2D(u_base, v_uv).rgb + god_rays, 1.0);\r
}\r
`,qS=HS.replaceAll("NUM_SAMPLES",Zv);function YS(){return new go({color:0})}function KS(){return new at({vertexShader:VS,fragmentShader:WS,depthWrite:!1})}function jS(){return new at({uniforms:{u_occlusion:{value:null},u_light_uv:{value:new xe(.5,.5)},u_exposure:{value:de.godRaysExposure},u_decay:{value:de.godRaysDecay},u_density:{value:de.godRaysDensity},u_weight:{value:de.godRaysWeight},u_visibility:{value:1},u_aspect:{value:1}},vertexShader:Hu,fragmentShader:qS})}function ZS(){return new at({uniforms:{u_base:{value:null},u_god_rays:{value:null},u_depth:{value:null},u_tint:{value:new fe(de.godRaysTintColor)}},vertexShader:Hu,fragmentShader:XS})}const fs=new D,Sc=new D,yc=new D,bc=new fe;class $S extends Wi{constructor({scene:e,camera:t}){super(),this.scene=e,this.camera=t,this.sun_mesh=null,this.occluder_meshes=[],this.occlusion_material=YS(),this.sun_disc_material=KS(),this.generate_material=jS(),this.combine_material=ZS(),this.occlusion_target=new zt(1,1,{depthTexture:new Ra(1,1)}),this.god_rays_target=new zt(1,1),this._quad=new ka(this.generate_material)}setTargets({sun_mesh:e,occluder_meshes:t}){this.sun_mesh=e,this.occluder_meshes=t}getWeight(){return this.generate_material.uniforms.u_weight.value}setWeight(e){this.generate_material.uniforms.u_weight.value=e}getExposure(){return this.generate_material.uniforms.u_exposure.value}setExposure(e){this.generate_material.uniforms.u_exposure.value=e}getDecay(){return this.generate_material.uniforms.u_decay.value}setDecay(e){this.generate_material.uniforms.u_decay.value=e}getDensity(){return this.generate_material.uniforms.u_density.value}setDensity(e){this.generate_material.uniforms.u_density.value=e}getTintColor(){return pt(this.combine_material.uniforms.u_tint.value)}setTintColor(e){this.combine_material.uniforms.u_tint.value.set(e)}setSize(e,t){const i=Math.max(1,Math.floor(e*rc)),r=Math.max(1,Math.floor(t*rc));this.occlusion_target.setSize(i,r),this.god_rays_target.setSize(i,r),this.generate_material.uniforms.u_aspect.value=e/t}render(e,t,i){this.camera.getWorldDirection(Sc),yc.subVectors(this.sun_mesh.position,this.camera.position).normalize();const r=Sc.dot(yc),o=co(-.1,.3,r);this.generate_material.uniforms.u_visibility.value=o,fs.copy(this.sun_mesh.position).project(this.camera),this.generate_material.uniforms.u_light_uv.value.set(fs.x*.5+.5,fs.y*.5+.5);const s=e.autoClear,a=e.getRenderTarget();e.getClearColor(bc);const l=e.getClearAlpha();e.autoClear=!1;const c=this.scene.children.map(_=>_.visible);this.scene.children.forEach(_=>{_.visible=this.occluder_meshes.includes(_)});const d=this.scene.background;this.scene.background=null,this.scene.overrideMaterial=this.occlusion_material,e.setRenderTarget(this.occlusion_target),e.setClearColor(0,1),e.clear(!0,!0,!0),e.render(this.scene,this.camera),this.scene.overrideMaterial=null,this.scene.background=d;const u=this.sun_mesh.material,f=this.sun_mesh.visible;this.sun_mesh.material=this.sun_disc_material,this.sun_mesh.visible=!0,e.setRenderTarget(this.occlusion_target),e.render(this.sun_mesh,this.camera),this.sun_mesh.material=u,this.sun_mesh.visible=f,this.scene.children.forEach((_,v)=>{_.visible=c[v]}),this.generate_material.uniforms.u_occlusion.value=this.occlusion_target.texture,e.setRenderTarget(this.god_rays_target),e.clear(),this._quad.material=this.generate_material,this._quad.render(e),this.combine_material.uniforms.u_base.value=i.texture,this.combine_material.uniforms.u_god_rays.value=this.god_rays_target.texture,this.combine_material.uniforms.u_depth.value=this.occlusion_target.depthTexture,e.setRenderTarget(this.renderToScreen?null:t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._quad.material=this.combine_material,this._quad.render(e),e.setClearColor(bc,l),e.setRenderTarget(a),e.autoClear=s}dispose(){this.occlusion_target.dispose(),this.god_rays_target.dispose(),this.occlusion_material.dispose(),this.sun_disc_material.dispose(),this.generate_material.dispose(),this.combine_material.dispose(),this._quad.dispose()}}function JS(n){return new $S(n)}function QS({renderer:n,scene:e,camera:t}){const i=new Gi(new xe(window.innerWidth,window.innerHeight),de.bloomStrength,de.bloomRadius,de.bloomThreshold);i.bloomTintColors.fill(new D(rs.x,rs.y,rs.z));const r=JS({scene:e,camera:t}),o=new BS(n);return o.addPass(new zS(e,t)),o.addPass(r),o.addPass(i),{composer:o,bloom_pass:i,god_rays_pass:r,setOccluders:({sun_mesh:s,occluder_meshes:a})=>r.setTargets({sun_mesh:s,occluder_meshes:a}),resize:(s,a)=>o.setSize(s,a),render:()=>o.render()}}function ey(n){if(!(typeof window>"u")){var e=document.createElement("style");return e.setAttribute("type","text/css"),e.innerHTML=n,document.head.appendChild(e),n}}function Pi(n,e){var t=n.__state.conversionName.toString(),i=Math.round(n.r),r=Math.round(n.g),o=Math.round(n.b),s=n.a,a=Math.round(n.h),l=n.s.toFixed(1),c=n.v.toFixed(1);if(e||t==="THREE_CHAR_HEX"||t==="SIX_CHAR_HEX"){for(var d=n.hex.toString(16);d.length<6;)d="0"+d;return"#"+d}else{if(t==="CSS_RGB")return"rgb("+i+","+r+","+o+")";if(t==="CSS_RGBA")return"rgba("+i+","+r+","+o+","+s+")";if(t==="HEX")return"0x"+n.hex.toString(16);if(t==="RGB_ARRAY")return"["+i+","+r+","+o+"]";if(t==="RGBA_ARRAY")return"["+i+","+r+","+o+","+s+"]";if(t==="RGB_OBJ")return"{r:"+i+",g:"+r+",b:"+o+"}";if(t==="RGBA_OBJ")return"{r:"+i+",g:"+r+",b:"+o+",a:"+s+"}";if(t==="HSV_OBJ")return"{h:"+a+",s:"+l+",v:"+c+"}";if(t==="HSVA_OBJ")return"{h:"+a+",s:"+l+",v:"+c+",a:"+s+"}"}return"unknown format"}var Ec=Array.prototype.forEach,Qi=Array.prototype.slice,Y={BREAK:{},extend:function(e){return this.each(Qi.call(arguments,1),function(t){var i=this.isObject(t)?Object.keys(t):[];i.forEach((function(r){this.isUndefined(t[r])||(e[r]=t[r])}).bind(this))},this),e},defaults:function(e){return this.each(Qi.call(arguments,1),function(t){var i=this.isObject(t)?Object.keys(t):[];i.forEach((function(r){this.isUndefined(e[r])&&(e[r]=t[r])}).bind(this))},this),e},compose:function(){var e=Qi.call(arguments);return function(){for(var t=Qi.call(arguments),i=e.length-1;i>=0;i--)t=[e[i].apply(this,t)];return t[0]}},each:function(e,t,i){if(e){if(Ec&&e.forEach&&e.forEach===Ec)e.forEach(t,i);else if(e.length===e.length+0){var r=void 0,o=void 0;for(r=0,o=e.length;r<o;r++)if(r in e&&t.call(i,e[r],r)===this.BREAK)return}else for(var s in e)if(t.call(i,e[s],s)===this.BREAK)return}},defer:function(e){setTimeout(e,0)},debounce:function(e,t,i){var r=void 0;return function(){var o=this,s=arguments;function a(){r=null,i||e.apply(o,s)}var l=i||!r;clearTimeout(r),r=setTimeout(a,t),l&&e.apply(o,s)}},toArray:function(e){return e.toArray?e.toArray():Qi.call(e)},isUndefined:function(e){return e===void 0},isNull:function(e){return e===null},isNaN:(function(n){function e(t){return n.apply(this,arguments)}return e.toString=function(){return n.toString()},e})(function(n){return isNaN(n)}),isArray:Array.isArray||function(n){return n.constructor===Array},isObject:function(e){return e===Object(e)},isNumber:function(e){return e===e+0},isString:function(e){return e===e+""},isBoolean:function(e){return e===!1||e===!0},isFunction:function(e){return e instanceof Function}},ty=[{litmus:Y.isString,conversions:{THREE_CHAR_HEX:{read:function(e){var t=e.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);return t===null?!1:{space:"HEX",hex:parseInt("0x"+t[1].toString()+t[1].toString()+t[2].toString()+t[2].toString()+t[3].toString()+t[3].toString(),0)}},write:Pi},SIX_CHAR_HEX:{read:function(e){var t=e.match(/^#([A-F0-9]{6})$/i);return t===null?!1:{space:"HEX",hex:parseInt("0x"+t[1].toString(),0)}},write:Pi},CSS_RGB:{read:function(e){var t=e.match(/^rgb\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);return t===null?!1:{space:"RGB",r:parseFloat(t[1]),g:parseFloat(t[2]),b:parseFloat(t[3])}},write:Pi},CSS_RGBA:{read:function(e){var t=e.match(/^rgba\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);return t===null?!1:{space:"RGB",r:parseFloat(t[1]),g:parseFloat(t[2]),b:parseFloat(t[3]),a:parseFloat(t[4])}},write:Pi}}},{litmus:Y.isNumber,conversions:{HEX:{read:function(e){return{space:"HEX",hex:e,conversionName:"HEX"}},write:function(e){return e.hex}}}},{litmus:Y.isArray,conversions:{RGB_ARRAY:{read:function(e){return e.length!==3?!1:{space:"RGB",r:e[0],g:e[1],b:e[2]}},write:function(e){return[e.r,e.g,e.b]}},RGBA_ARRAY:{read:function(e){return e.length!==4?!1:{space:"RGB",r:e[0],g:e[1],b:e[2],a:e[3]}},write:function(e){return[e.r,e.g,e.b,e.a]}}}},{litmus:Y.isObject,conversions:{RGBA_OBJ:{read:function(e){return Y.isNumber(e.r)&&Y.isNumber(e.g)&&Y.isNumber(e.b)&&Y.isNumber(e.a)?{space:"RGB",r:e.r,g:e.g,b:e.b,a:e.a}:!1},write:function(e){return{r:e.r,g:e.g,b:e.b,a:e.a}}},RGB_OBJ:{read:function(e){return Y.isNumber(e.r)&&Y.isNumber(e.g)&&Y.isNumber(e.b)?{space:"RGB",r:e.r,g:e.g,b:e.b}:!1},write:function(e){return{r:e.r,g:e.g,b:e.b}}},HSVA_OBJ:{read:function(e){return Y.isNumber(e.h)&&Y.isNumber(e.s)&&Y.isNumber(e.v)&&Y.isNumber(e.a)?{space:"HSV",h:e.h,s:e.s,v:e.v,a:e.a}:!1},write:function(e){return{h:e.h,s:e.s,v:e.v,a:e.a}}},HSV_OBJ:{read:function(e){return Y.isNumber(e.h)&&Y.isNumber(e.s)&&Y.isNumber(e.v)?{space:"HSV",h:e.h,s:e.s,v:e.v}:!1},write:function(e){return{h:e.h,s:e.s,v:e.v}}}}}],er=void 0,qr=void 0,fa=function(){qr=!1;var e=arguments.length>1?Y.toArray(arguments):arguments[0];return Y.each(ty,function(t){if(t.litmus(e))return Y.each(t.conversions,function(i,r){if(er=i.read(e),qr===!1&&er!==!1)return qr=er,er.conversionName=r,er.conversion=i,Y.BREAK}),Y.BREAK}),qr},Mc=void 0,ho={hsv_to_rgb:function(e,t,i){var r=Math.floor(e/60)%6,o=e/60-Math.floor(e/60),s=i*(1-t),a=i*(1-o*t),l=i*(1-(1-o)*t),c=[[i,l,s],[a,i,s],[s,i,l],[s,a,i],[l,s,i],[i,s,a]][r];return{r:c[0]*255,g:c[1]*255,b:c[2]*255}},rgb_to_hsv:function(e,t,i){var r=Math.min(e,t,i),o=Math.max(e,t,i),s=o-r,a=void 0,l=void 0;if(o!==0)l=s/o;else return{h:NaN,s:0,v:0};return e===o?a=(t-i)/s:t===o?a=2+(i-e)/s:a=4+(e-t)/s,a/=6,a<0&&(a+=1),{h:a*360,s:l,v:o/255}},rgb_to_hex:function(e,t,i){var r=this.hex_with_component(0,2,e);return r=this.hex_with_component(r,1,t),r=this.hex_with_component(r,0,i),r},component_from_hex:function(e,t){return e>>t*8&255},hex_with_component:function(e,t,i){return i<<(Mc=t*8)|e&~(255<<Mc)}},ny=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},nn=function(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")},rn=(function(){function n(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,i){return t&&n(e.prototype,t),i&&n(e,i),e}})(),Gn=function n(e,t,i){e===null&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,t);if(r===void 0){var o=Object.getPrototypeOf(e);return o===null?void 0:n(o,t,i)}else{if("value"in r)return r.value;var s=r.get;return s===void 0?void 0:s.call(i)}},Hn=function(n,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);n.prototype=Object.create(e&&e.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(n,e):n.__proto__=e)},Vn=function(n,e){if(!n)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:n},yt=(function(){function n(){if(nn(this,n),this.__state=fa.apply(this,arguments),this.__state===!1)throw new Error("Failed to interpret color arguments");this.__state.a=this.__state.a||1}return rn(n,[{key:"toString",value:function(){return Pi(this)}},{key:"toHexString",value:function(){return Pi(this,!0)}},{key:"toOriginal",value:function(){return this.__state.conversion.write(this)}}]),n})();function Ba(n,e,t){Object.defineProperty(n,e,{get:function(){return this.__state.space==="RGB"?this.__state[e]:(yt.recalculateRGB(this,e,t),this.__state[e])},set:function(r){this.__state.space!=="RGB"&&(yt.recalculateRGB(this,e,t),this.__state.space="RGB"),this.__state[e]=r}})}function za(n,e){Object.defineProperty(n,e,{get:function(){return this.__state.space==="HSV"?this.__state[e]:(yt.recalculateHSV(this),this.__state[e])},set:function(i){this.__state.space!=="HSV"&&(yt.recalculateHSV(this),this.__state.space="HSV"),this.__state[e]=i}})}yt.recalculateRGB=function(n,e,t){if(n.__state.space==="HEX")n.__state[e]=ho.component_from_hex(n.__state.hex,t);else if(n.__state.space==="HSV")Y.extend(n.__state,ho.hsv_to_rgb(n.__state.h,n.__state.s,n.__state.v));else throw new Error("Corrupted color state")};yt.recalculateHSV=function(n){var e=ho.rgb_to_hsv(n.r,n.g,n.b);Y.extend(n.__state,{s:e.s,v:e.v}),Y.isNaN(e.h)?Y.isUndefined(n.__state.h)&&(n.__state.h=0):n.__state.h=e.h};yt.COMPONENTS=["r","g","b","h","s","v","hex","a"];Ba(yt.prototype,"r",2);Ba(yt.prototype,"g",1);Ba(yt.prototype,"b",0);za(yt.prototype,"h");za(yt.prototype,"s");za(yt.prototype,"v");Object.defineProperty(yt.prototype,"a",{get:function(){return this.__state.a},set:function(e){this.__state.a=e}});Object.defineProperty(yt.prototype,"hex",{get:function(){return this.__state.space!=="HEX"&&(this.__state.hex=ho.rgb_to_hex(this.r,this.g,this.b),this.__state.space="HEX"),this.__state.hex},set:function(e){this.__state.space="HEX",this.__state.hex=e}});var ci=(function(){function n(e,t){nn(this,n),this.initialValue=e[t],this.domElement=document.createElement("div"),this.object=e,this.property=t,this.__onChange=void 0,this.__onFinishChange=void 0}return rn(n,[{key:"onChange",value:function(t){return this.__onChange=t,this}},{key:"onFinishChange",value:function(t){return this.__onFinishChange=t,this}},{key:"setValue",value:function(t){return this.object[this.property]=t,this.__onChange&&this.__onChange.call(this,t),this.updateDisplay(),this}},{key:"getValue",value:function(){return this.object[this.property]}},{key:"updateDisplay",value:function(){return this}},{key:"isModified",value:function(){return this.initialValue!==this.getValue()}}]),n})(),iy={HTMLEvents:["change"],MouseEvents:["click","mousemove","mousedown","mouseup","mouseover"],KeyboardEvents:["keydown"]},Vu={};Y.each(iy,function(n,e){Y.each(n,function(t){Vu[t]=e})});var ry=/(\d+(\.\d+)?)px/;function on(n){if(n==="0"||Y.isUndefined(n))return 0;var e=n.match(ry);return Y.isNull(e)?0:parseFloat(e[1])}var k={makeSelectable:function(e,t){e===void 0||e.style===void 0||(e.onselectstart=t?function(){return!1}:function(){},e.style.MozUserSelect=t?"auto":"none",e.style.KhtmlUserSelect=t?"auto":"none",e.unselectable=t?"on":"off")},makeFullscreen:function(e,t,i){var r=i,o=t;Y.isUndefined(o)&&(o=!0),Y.isUndefined(r)&&(r=!0),e.style.position="absolute",o&&(e.style.left=0,e.style.right=0),r&&(e.style.top=0,e.style.bottom=0)},fakeEvent:function(e,t,i,r){var o=i||{},s=Vu[t];if(!s)throw new Error("Event type "+t+" not supported.");var a=document.createEvent(s);switch(s){case"MouseEvents":{var l=o.x||o.clientX||0,c=o.y||o.clientY||0;a.initMouseEvent(t,o.bubbles||!1,o.cancelable||!0,window,o.clickCount||1,0,0,l,c,!1,!1,!1,!1,0,null);break}case"KeyboardEvents":{var d=a.initKeyboardEvent||a.initKeyEvent;Y.defaults(o,{cancelable:!0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,keyCode:void 0,charCode:void 0}),d(t,o.bubbles||!1,o.cancelable,window,o.ctrlKey,o.altKey,o.shiftKey,o.metaKey,o.keyCode,o.charCode);break}default:{a.initEvent(t,o.bubbles||!1,o.cancelable||!0);break}}Y.defaults(a,r),e.dispatchEvent(a)},bind:function(e,t,i,r){var o=r||!1;return e.addEventListener?e.addEventListener(t,i,o):e.attachEvent&&e.attachEvent("on"+t,i),k},unbind:function(e,t,i,r){var o=r||!1;return e.removeEventListener?e.removeEventListener(t,i,o):e.detachEvent&&e.detachEvent("on"+t,i),k},addClass:function(e,t){if(e.className===void 0)e.className=t;else if(e.className!==t){var i=e.className.split(/ +/);i.indexOf(t)===-1&&(i.push(t),e.className=i.join(" ").replace(/^\s+/,"").replace(/\s+$/,""))}return k},removeClass:function(e,t){if(t)if(e.className===t)e.removeAttribute("class");else{var i=e.className.split(/ +/),r=i.indexOf(t);r!==-1&&(i.splice(r,1),e.className=i.join(" "))}else e.className=void 0;return k},hasClass:function(e,t){return new RegExp("(?:^|\\s+)"+t+"(?:\\s+|$)").test(e.className)||!1},getWidth:function(e){var t=getComputedStyle(e);return on(t["border-left-width"])+on(t["border-right-width"])+on(t["padding-left"])+on(t["padding-right"])+on(t.width)},getHeight:function(e){var t=getComputedStyle(e);return on(t["border-top-width"])+on(t["border-bottom-width"])+on(t["padding-top"])+on(t["padding-bottom"])+on(t.height)},getOffset:function(e){var t=e,i={left:0,top:0};if(t.offsetParent)do i.left+=t.offsetLeft,i.top+=t.offsetTop,t=t.offsetParent;while(t);return i},isActive:function(e){return e===document.activeElement&&(e.type||e.href)}},Wu=(function(n){Hn(e,n);function e(t,i){nn(this,e);var r=Vn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i)),o=r;r.__prev=r.getValue(),r.__checkbox=document.createElement("input"),r.__checkbox.setAttribute("type","checkbox");function s(){o.setValue(!o.__prev)}return k.bind(r.__checkbox,"change",s,!1),r.domElement.appendChild(r.__checkbox),r.updateDisplay(),r}return rn(e,[{key:"setValue",value:function(i){var r=Gn(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"setValue",this).call(this,i);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),this.__prev=this.getValue(),r}},{key:"updateDisplay",value:function(){return this.getValue()===!0?(this.__checkbox.setAttribute("checked","checked"),this.__checkbox.checked=!0,this.__prev=!0):(this.__checkbox.checked=!1,this.__prev=!1),Gn(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e})(ci),oy=(function(n){Hn(e,n);function e(t,i,r){nn(this,e);var o=Vn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i)),s=r,a=o;if(o.__select=document.createElement("select"),Y.isArray(s)){var l={};Y.each(s,function(c){l[c]=c}),s=l}return Y.each(s,function(c,d){var u=document.createElement("option");u.innerHTML=d,u.setAttribute("value",c),a.__select.appendChild(u)}),o.updateDisplay(),k.bind(o.__select,"change",function(){var c=this.options[this.selectedIndex].value;a.setValue(c)}),o.domElement.appendChild(o.__select),o}return rn(e,[{key:"setValue",value:function(i){var r=Gn(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"setValue",this).call(this,i);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),r}},{key:"updateDisplay",value:function(){return k.isActive(this.__select)?this:(this.__select.value=this.getValue(),Gn(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this))}}]),e})(ci),sy=(function(n){Hn(e,n);function e(t,i){nn(this,e);var r=Vn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i)),o=r;function s(){o.setValue(o.__input.value)}function a(){o.__onFinishChange&&o.__onFinishChange.call(o,o.getValue())}return r.__input=document.createElement("input"),r.__input.setAttribute("type","text"),k.bind(r.__input,"keyup",s),k.bind(r.__input,"change",s),k.bind(r.__input,"blur",a),k.bind(r.__input,"keydown",function(l){l.keyCode===13&&this.blur()}),r.updateDisplay(),r.domElement.appendChild(r.__input),r}return rn(e,[{key:"updateDisplay",value:function(){return k.isActive(this.__input)||(this.__input.value=this.getValue()),Gn(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e})(ci);function Tc(n){var e=n.toString();return e.indexOf(".")>-1?e.length-e.indexOf(".")-1:0}var Xu=(function(n){Hn(e,n);function e(t,i,r){nn(this,e);var o=Vn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i)),s=r||{};return o.__min=s.min,o.__max=s.max,o.__step=s.step,Y.isUndefined(o.__step)?o.initialValue===0?o.__impliedStep=1:o.__impliedStep=Math.pow(10,Math.floor(Math.log(Math.abs(o.initialValue))/Math.LN10))/10:o.__impliedStep=o.__step,o.__precision=Tc(o.__impliedStep),o}return rn(e,[{key:"setValue",value:function(i){var r=i;return this.__min!==void 0&&r<this.__min?r=this.__min:this.__max!==void 0&&r>this.__max&&(r=this.__max),this.__step!==void 0&&r%this.__step!==0&&(r=Math.round(r/this.__step)*this.__step),Gn(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"setValue",this).call(this,r)}},{key:"min",value:function(i){return this.__min=i,this}},{key:"max",value:function(i){return this.__max=i,this}},{key:"step",value:function(i){return this.__step=i,this.__impliedStep=i,this.__precision=Tc(i),this}}]),e})(ci);function ay(n,e){var t=Math.pow(10,e);return Math.round(n*t)/t}var fo=(function(n){Hn(e,n);function e(t,i,r){nn(this,e);var o=Vn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i,r));o.__truncationSuspended=!1;var s=o,a=void 0;function l(){var v=parseFloat(s.__input.value);Y.isNaN(v)||s.setValue(v)}function c(){s.__onFinishChange&&s.__onFinishChange.call(s,s.getValue())}function d(){c()}function u(v){var x=a-v.clientY;s.setValue(s.getValue()+x*s.__impliedStep),a=v.clientY}function f(){k.unbind(window,"mousemove",u),k.unbind(window,"mouseup",f),c()}function _(v){k.bind(window,"mousemove",u),k.bind(window,"mouseup",f),a=v.clientY}return o.__input=document.createElement("input"),o.__input.setAttribute("type","text"),k.bind(o.__input,"change",l),k.bind(o.__input,"blur",d),k.bind(o.__input,"mousedown",_),k.bind(o.__input,"keydown",function(v){v.keyCode===13&&(s.__truncationSuspended=!0,this.blur(),s.__truncationSuspended=!1,c())}),o.updateDisplay(),o.domElement.appendChild(o.__input),o}return rn(e,[{key:"updateDisplay",value:function(){return this.__input.value=this.__truncationSuspended?this.getValue():ay(this.getValue(),this.__precision),Gn(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e})(Xu);function wc(n,e,t,i,r){return i+(r-i)*((n-e)/(t-e))}var pa=(function(n){Hn(e,n);function e(t,i,r,o,s){nn(this,e);var a=Vn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i,{min:r,max:o,step:s})),l=a;a.__background=document.createElement("div"),a.__foreground=document.createElement("div"),k.bind(a.__background,"mousedown",c),k.bind(a.__background,"touchstart",f),k.addClass(a.__background,"slider"),k.addClass(a.__foreground,"slider-fg");function c(x){document.activeElement.blur(),k.bind(window,"mousemove",d),k.bind(window,"mouseup",u),d(x)}function d(x){x.preventDefault();var m=l.__background.getBoundingClientRect();return l.setValue(wc(x.clientX,m.left,m.right,l.__min,l.__max)),!1}function u(){k.unbind(window,"mousemove",d),k.unbind(window,"mouseup",u),l.__onFinishChange&&l.__onFinishChange.call(l,l.getValue())}function f(x){x.touches.length===1&&(k.bind(window,"touchmove",_),k.bind(window,"touchend",v),_(x))}function _(x){var m=x.touches[0].clientX,h=l.__background.getBoundingClientRect();l.setValue(wc(m,h.left,h.right,l.__min,l.__max))}function v(){k.unbind(window,"touchmove",_),k.unbind(window,"touchend",v),l.__onFinishChange&&l.__onFinishChange.call(l,l.getValue())}return a.updateDisplay(),a.__background.appendChild(a.__foreground),a.domElement.appendChild(a.__background),a}return rn(e,[{key:"updateDisplay",value:function(){var i=(this.getValue()-this.__min)/(this.__max-this.__min);return this.__foreground.style.width=i*100+"%",Gn(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e})(Xu),qu=(function(n){Hn(e,n);function e(t,i,r){nn(this,e);var o=Vn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i)),s=o;return o.__button=document.createElement("div"),o.__button.innerHTML=r===void 0?"Fire":r,k.bind(o.__button,"click",function(a){return a.preventDefault(),s.fire(),!1}),k.addClass(o.__button,"button"),o.domElement.appendChild(o.__button),o}return rn(e,[{key:"fire",value:function(){this.__onChange&&this.__onChange.call(this),this.getValue().call(this.object),this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue())}}]),e})(ci),_a=(function(n){Hn(e,n);function e(t,i){nn(this,e);var r=Vn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i));r.__color=new yt(r.getValue()),r.__temp=new yt(0);var o=r;r.domElement=document.createElement("div"),k.makeSelectable(r.domElement,!1),r.__selector=document.createElement("div"),r.__selector.className="selector",r.__saturation_field=document.createElement("div"),r.__saturation_field.className="saturation-field",r.__field_knob=document.createElement("div"),r.__field_knob.className="field-knob",r.__field_knob_border="2px solid ",r.__hue_knob=document.createElement("div"),r.__hue_knob.className="hue-knob",r.__hue_field=document.createElement("div"),r.__hue_field.className="hue-field",r.__input=document.createElement("input"),r.__input.type="text",r.__input_textShadow="0 1px 1px ",k.bind(r.__input,"keydown",function(x){x.keyCode===13&&u.call(this)}),k.bind(r.__input,"blur",u),k.bind(r.__selector,"mousedown",function(){k.addClass(this,"drag").bind(window,"mouseup",function(){k.removeClass(o.__selector,"drag")})}),k.bind(r.__selector,"touchstart",function(){k.addClass(this,"drag").bind(window,"touchend",function(){k.removeClass(o.__selector,"drag")})});var s=document.createElement("div");Y.extend(r.__selector.style,{width:"122px",height:"102px",padding:"3px",backgroundColor:"#222",boxShadow:"0px 1px 3px rgba(0,0,0,0.3)"}),Y.extend(r.__field_knob.style,{position:"absolute",width:"12px",height:"12px",border:r.__field_knob_border+(r.__color.v<.5?"#fff":"#000"),boxShadow:"0px 1px 3px rgba(0,0,0,0.5)",borderRadius:"12px",zIndex:1}),Y.extend(r.__hue_knob.style,{position:"absolute",width:"15px",height:"2px",borderRight:"4px solid #fff",zIndex:1}),Y.extend(r.__saturation_field.style,{width:"100px",height:"100px",border:"1px solid #555",marginRight:"3px",display:"inline-block",cursor:"pointer"}),Y.extend(s.style,{width:"100%",height:"100%",background:"none"}),Ac(s,"top","rgba(0,0,0,0)","#000"),Y.extend(r.__hue_field.style,{width:"15px",height:"100px",border:"1px solid #555",cursor:"ns-resize",position:"absolute",top:"3px",right:"3px"}),cy(r.__hue_field),Y.extend(r.__input.style,{outline:"none",textAlign:"center",color:"#fff",border:0,fontWeight:"bold",textShadow:r.__input_textShadow+"rgba(0,0,0,0.7)"}),k.bind(r.__saturation_field,"mousedown",a),k.bind(r.__saturation_field,"touchstart",a),k.bind(r.__field_knob,"mousedown",a),k.bind(r.__field_knob,"touchstart",a),k.bind(r.__hue_field,"mousedown",l),k.bind(r.__hue_field,"touchstart",l);function a(x){_(x),k.bind(window,"mousemove",_),k.bind(window,"touchmove",_),k.bind(window,"mouseup",c),k.bind(window,"touchend",c)}function l(x){v(x),k.bind(window,"mousemove",v),k.bind(window,"touchmove",v),k.bind(window,"mouseup",d),k.bind(window,"touchend",d)}function c(){k.unbind(window,"mousemove",_),k.unbind(window,"touchmove",_),k.unbind(window,"mouseup",c),k.unbind(window,"touchend",c),f()}function d(){k.unbind(window,"mousemove",v),k.unbind(window,"touchmove",v),k.unbind(window,"mouseup",d),k.unbind(window,"touchend",d),f()}function u(){var x=fa(this.value);x!==!1?(o.__color.__state=x,o.setValue(o.__color.toOriginal())):this.value=o.__color.toString()}function f(){o.__onFinishChange&&o.__onFinishChange.call(o,o.__color.toOriginal())}r.__saturation_field.appendChild(s),r.__selector.appendChild(r.__field_knob),r.__selector.appendChild(r.__saturation_field),r.__selector.appendChild(r.__hue_field),r.__hue_field.appendChild(r.__hue_knob),r.domElement.appendChild(r.__input),r.domElement.appendChild(r.__selector),r.updateDisplay();function _(x){x.type.indexOf("touch")===-1&&x.preventDefault();var m=o.__saturation_field.getBoundingClientRect(),h=x.touches&&x.touches[0]||x,A=h.clientX,g=h.clientY,E=(A-m.left)/(m.right-m.left),I=1-(g-m.top)/(m.bottom-m.top);return I>1?I=1:I<0&&(I=0),E>1?E=1:E<0&&(E=0),o.__color.v=I,o.__color.s=E,o.setValue(o.__color.toOriginal()),!1}function v(x){x.type.indexOf("touch")===-1&&x.preventDefault();var m=o.__hue_field.getBoundingClientRect(),h=x.touches&&x.touches[0]||x,A=h.clientY,g=1-(A-m.top)/(m.bottom-m.top);return g>1?g=1:g<0&&(g=0),o.__color.h=g*360,o.setValue(o.__color.toOriginal()),!1}return r}return rn(e,[{key:"updateDisplay",value:function(){var i=fa(this.getValue());if(i!==!1){var r=!1;Y.each(yt.COMPONENTS,function(a){if(!Y.isUndefined(i[a])&&!Y.isUndefined(this.__color.__state[a])&&i[a]!==this.__color.__state[a])return r=!0,{}},this),r&&Y.extend(this.__color.__state,i)}Y.extend(this.__temp.__state,this.__color.__state),this.__temp.a=1;var o=this.__color.v<.5||this.__color.s>.5?255:0,s=255-o;Y.extend(this.__field_knob.style,{marginLeft:100*this.__color.s-7+"px",marginTop:100*(1-this.__color.v)-7+"px",backgroundColor:this.__temp.toHexString(),border:this.__field_knob_border+"rgb("+o+","+o+","+o+")"}),this.__hue_knob.style.marginTop=(1-this.__color.h/360)*100+"px",this.__temp.s=1,this.__temp.v=1,Ac(this.__saturation_field,"left","#fff",this.__temp.toHexString()),this.__input.value=this.__color.toString(),Y.extend(this.__input.style,{backgroundColor:this.__color.toHexString(),color:"rgb("+o+","+o+","+o+")",textShadow:this.__input_textShadow+"rgba("+s+","+s+","+s+",.7)"})}}]),e})(ci),ly=["-moz-","-o-","-webkit-","-ms-",""];function Ac(n,e,t,i){n.style.background="",Y.each(ly,function(r){n.style.cssText+="background: "+r+"linear-gradient("+e+", "+t+" 0%, "+i+" 100%); "})}function cy(n){n.style.background="",n.style.cssText+="background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);",n.style.cssText+="background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",n.style.cssText+="background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",n.style.cssText+="background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",n.style.cssText+="background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"}var uy={load:function(e,t){var i=t||document,r=i.createElement("link");r.type="text/css",r.rel="stylesheet",r.href=e,i.getElementsByTagName("head")[0].appendChild(r)},inject:function(e,t){var i=t||document,r=document.createElement("style");r.type="text/css",r.innerHTML=e;var o=i.getElementsByTagName("head")[0];try{o.appendChild(r)}catch{}}},dy=`<div id="dg-save" class="dg dialogue">

  Here's the new load parameter for your <code>GUI</code>'s constructor:

  <textarea id="dg-new-constructor"></textarea>

  <div id="dg-save-locally">

    <input id="dg-local-storage" type="checkbox"/> Automatically save
    values to <code>localStorage</code> on exit.

    <div id="dg-local-explain">The values saved to <code>localStorage</code> will
      override those passed to <code>dat.GUI</code>'s constructor. This makes it
      easier to work incrementally, but <code>localStorage</code> is fragile,
      and your friends may not see the same values you do.

    </div>

  </div>

</div>`,hy=function(e,t){var i=e[t];return Y.isArray(arguments[2])||Y.isObject(arguments[2])?new oy(e,t,arguments[2]):Y.isNumber(i)?Y.isNumber(arguments[2])&&Y.isNumber(arguments[3])?Y.isNumber(arguments[4])?new pa(e,t,arguments[2],arguments[3],arguments[4]):new pa(e,t,arguments[2],arguments[3]):Y.isNumber(arguments[4])?new fo(e,t,{min:arguments[2],max:arguments[3],step:arguments[4]}):new fo(e,t,{min:arguments[2],max:arguments[3]}):Y.isString(i)?new sy(e,t):Y.isFunction(i)?new qu(e,t,""):Y.isBoolean(i)?new Wu(e,t):null};function fy(n){setTimeout(n,1e3/60)}var py=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||fy,_y=(function(){function n(){nn(this,n),this.backgroundElement=document.createElement("div"),Y.extend(this.backgroundElement.style,{backgroundColor:"rgba(0,0,0,0.8)",top:0,left:0,display:"none",zIndex:"1000",opacity:0,WebkitTransition:"opacity 0.2s linear",transition:"opacity 0.2s linear"}),k.makeFullscreen(this.backgroundElement),this.backgroundElement.style.position="fixed",this.domElement=document.createElement("div"),Y.extend(this.domElement.style,{position:"fixed",display:"none",zIndex:"1001",opacity:0,WebkitTransition:"-webkit-transform 0.2s ease-out, opacity 0.2s linear",transition:"transform 0.2s ease-out, opacity 0.2s linear"}),document.body.appendChild(this.backgroundElement),document.body.appendChild(this.domElement);var e=this;k.bind(this.backgroundElement,"click",function(){e.hide()})}return rn(n,[{key:"show",value:function(){var t=this;this.backgroundElement.style.display="block",this.domElement.style.display="block",this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)",this.layout(),Y.defer(function(){t.backgroundElement.style.opacity=1,t.domElement.style.opacity=1,t.domElement.style.webkitTransform="scale(1)"})}},{key:"hide",value:function(){var t=this,i=function r(){t.domElement.style.display="none",t.backgroundElement.style.display="none",k.unbind(t.domElement,"webkitTransitionEnd",r),k.unbind(t.domElement,"transitionend",r),k.unbind(t.domElement,"oTransitionEnd",r)};k.bind(this.domElement,"webkitTransitionEnd",i),k.bind(this.domElement,"transitionend",i),k.bind(this.domElement,"oTransitionEnd",i),this.backgroundElement.style.opacity=0,this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)"}},{key:"layout",value:function(){this.domElement.style.left=window.innerWidth/2-k.getWidth(this.domElement)/2+"px",this.domElement.style.top=window.innerHeight/2-k.getHeight(this.domElement)/2+"px"}}]),n})(),my=ey(`.dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .cr.function .property-name{width:100%}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}
`);uy.inject(my);var Cc="dg",Rc=72,Pc=20,ur="Default",ir=(function(){try{return!!window.localStorage}catch{return!1}})(),rr=void 0,Dc=!0,wi=void 0,ps=!1,Yu=[],nt=function n(e){var t=this,i=e||{};this.domElement=document.createElement("div"),this.__ul=document.createElement("ul"),this.domElement.appendChild(this.__ul),k.addClass(this.domElement,Cc),this.__folders={},this.__controllers=[],this.__rememberedObjects=[],this.__rememberedObjectIndecesToControllers=[],this.__listening=[],i=Y.defaults(i,{closeOnTop:!1,autoPlace:!0,width:n.DEFAULT_WIDTH}),i=Y.defaults(i,{resizable:i.autoPlace,hideable:i.autoPlace}),Y.isUndefined(i.load)?i.load={preset:ur}:i.preset&&(i.load.preset=i.preset),Y.isUndefined(i.parent)&&i.hideable&&Yu.push(this),i.resizable=Y.isUndefined(i.parent)&&i.resizable,i.autoPlace&&Y.isUndefined(i.scrollable)&&(i.scrollable=!0);var r=ir&&localStorage.getItem(Ai(this,"isLocal"))==="true",o=void 0,s=void 0;if(Object.defineProperties(this,{parent:{get:function(){return i.parent}},scrollable:{get:function(){return i.scrollable}},autoPlace:{get:function(){return i.autoPlace}},closeOnTop:{get:function(){return i.closeOnTop}},preset:{get:function(){return t.parent?t.getRoot().preset:i.load.preset},set:function(f){t.parent?t.getRoot().preset=f:i.load.preset=f,Sy(this),t.revert()}},width:{get:function(){return i.width},set:function(f){i.width=f,va(t,f)}},name:{get:function(){return i.name},set:function(f){i.name=f,s&&(s.innerHTML=i.name)}},closed:{get:function(){return i.closed},set:function(f){i.closed=f,i.closed?k.addClass(t.__ul,n.CLASS_CLOSED):k.removeClass(t.__ul,n.CLASS_CLOSED),this.onResize(),t.__closeButton&&(t.__closeButton.innerHTML=f?n.TEXT_OPEN:n.TEXT_CLOSED)}},load:{get:function(){return i.load}},useLocalStorage:{get:function(){return r},set:function(f){ir&&(r=f,f?k.bind(window,"unload",o):k.unbind(window,"unload",o),localStorage.setItem(Ai(t,"isLocal"),f))}}}),Y.isUndefined(i.parent)){if(this.closed=i.closed||!1,k.addClass(this.domElement,n.CLASS_MAIN),k.makeSelectable(this.domElement,!1),ir&&r){t.useLocalStorage=!0;var a=localStorage.getItem(Ai(this,"gui"));a&&(i.load=JSON.parse(a))}this.__closeButton=document.createElement("div"),this.__closeButton.innerHTML=n.TEXT_CLOSED,k.addClass(this.__closeButton,n.CLASS_CLOSE_BUTTON),i.closeOnTop?(k.addClass(this.__closeButton,n.CLASS_CLOSE_TOP),this.domElement.insertBefore(this.__closeButton,this.domElement.childNodes[0])):(k.addClass(this.__closeButton,n.CLASS_CLOSE_BOTTOM),this.domElement.appendChild(this.__closeButton)),k.bind(this.__closeButton,"click",function(){t.closed=!t.closed})}else{i.closed===void 0&&(i.closed=!0);var l=document.createTextNode(i.name);k.addClass(l,"controller-name"),s=Ga(t,l);var c=function(f){return f.preventDefault(),t.closed=!t.closed,!1};k.addClass(this.__ul,n.CLASS_CLOSED),k.addClass(s,"title"),k.bind(s,"click",c),i.closed||(this.closed=!1)}i.autoPlace&&(Y.isUndefined(i.parent)&&(Dc&&(wi=document.createElement("div"),k.addClass(wi,Cc),k.addClass(wi,n.CLASS_AUTO_PLACE_CONTAINER),document.body.appendChild(wi),Dc=!1),wi.appendChild(this.domElement),k.addClass(this.domElement,n.CLASS_AUTO_PLACE)),this.parent||va(t,i.width)),this.__resizeHandler=function(){t.onResizeDebounced()},k.bind(window,"resize",this.__resizeHandler),k.bind(this.__ul,"webkitTransitionEnd",this.__resizeHandler),k.bind(this.__ul,"transitionend",this.__resizeHandler),k.bind(this.__ul,"oTransitionEnd",this.__resizeHandler),this.onResize(),i.resizable&&xy(this),o=function(){ir&&localStorage.getItem(Ai(t,"isLocal"))==="true"&&localStorage.setItem(Ai(t,"gui"),JSON.stringify(t.getSaveObject()))},this.saveToLocalStorageIfPossible=o;function d(){var u=t.getRoot();u.width+=1,Y.defer(function(){u.width-=1})}i.parent||d()};nt.toggleHide=function(){ps=!ps,Y.each(Yu,function(n){n.domElement.style.display=ps?"none":""})};nt.CLASS_AUTO_PLACE="a";nt.CLASS_AUTO_PLACE_CONTAINER="ac";nt.CLASS_MAIN="main";nt.CLASS_CONTROLLER_ROW="cr";nt.CLASS_TOO_TALL="taller-than-window";nt.CLASS_CLOSED="closed";nt.CLASS_CLOSE_BUTTON="close-button";nt.CLASS_CLOSE_TOP="close-top";nt.CLASS_CLOSE_BOTTOM="close-bottom";nt.CLASS_DRAG="drag";nt.DEFAULT_WIDTH=245;nt.TEXT_CLOSED="Close Controls";nt.TEXT_OPEN="Open Controls";nt._keydownHandler=function(n){document.activeElement.type!=="text"&&(n.which===Rc||n.keyCode===Rc)&&nt.toggleHide()};k.bind(window,"keydown",nt._keydownHandler,!1);Y.extend(nt.prototype,{add:function(e,t){return or(this,e,t,{factoryArgs:Array.prototype.slice.call(arguments,2)})},addColor:function(e,t){return or(this,e,t,{color:!0})},remove:function(e){this.__ul.removeChild(e.__li),this.__controllers.splice(this.__controllers.indexOf(e),1);var t=this;Y.defer(function(){t.onResize()})},destroy:function(){if(this.parent)throw new Error("Only the root GUI should be removed with .destroy(). For subfolders, use gui.removeFolder(folder) instead.");this.autoPlace&&wi.removeChild(this.domElement);var e=this;Y.each(this.__folders,function(t){e.removeFolder(t)}),k.unbind(window,"keydown",nt._keydownHandler,!1),Lc(this)},addFolder:function(e){if(this.__folders[e]!==void 0)throw new Error('You already have a folder in this GUI by the name "'+e+'"');var t={name:e,parent:this};t.autoPlace=this.autoPlace,this.load&&this.load.folders&&this.load.folders[e]&&(t.closed=this.load.folders[e].closed,t.load=this.load.folders[e]);var i=new nt(t);this.__folders[e]=i;var r=Ga(this,i.domElement);return k.addClass(r,"folder"),i},removeFolder:function(e){this.__ul.removeChild(e.domElement.parentElement),delete this.__folders[e.name],this.load&&this.load.folders&&this.load.folders[e.name]&&delete this.load.folders[e.name],Lc(e);var t=this;Y.each(e.__folders,function(i){e.removeFolder(i)}),Y.defer(function(){t.onResize()})},open:function(){this.closed=!1},close:function(){this.closed=!0},hide:function(){this.domElement.style.display="none"},show:function(){this.domElement.style.display=""},onResize:function(){var e=this.getRoot();if(e.scrollable){var t=k.getOffset(e.__ul).top,i=0;Y.each(e.__ul.childNodes,function(r){e.autoPlace&&r===e.__save_row||(i+=k.getHeight(r))}),window.innerHeight-t-Pc<i?(k.addClass(e.domElement,nt.CLASS_TOO_TALL),e.__ul.style.height=window.innerHeight-t-Pc+"px"):(k.removeClass(e.domElement,nt.CLASS_TOO_TALL),e.__ul.style.height="auto")}e.__resize_handle&&Y.defer(function(){e.__resize_handle.style.height=e.__ul.offsetHeight+"px"}),e.__closeButton&&(e.__closeButton.style.width=e.width+"px")},onResizeDebounced:Y.debounce(function(){this.onResize()},50),remember:function(){if(Y.isUndefined(rr)&&(rr=new _y,rr.domElement.innerHTML=dy),this.parent)throw new Error("You can only call remember on a top level GUI.");var e=this;Y.each(Array.prototype.slice.call(arguments),function(t){e.__rememberedObjects.length===0&&vy(e),e.__rememberedObjects.indexOf(t)===-1&&e.__rememberedObjects.push(t)}),this.autoPlace&&va(this,this.width)},getRoot:function(){for(var e=this;e.parent;)e=e.parent;return e},getSaveObject:function(){var e=this.load;return e.closed=this.closed,this.__rememberedObjects.length>0&&(e.preset=this.preset,e.remembered||(e.remembered={}),e.remembered[this.preset]=Yr(this)),e.folders={},Y.each(this.__folders,function(t,i){e.folders[i]=t.getSaveObject()}),e},save:function(){this.load.remembered||(this.load.remembered={}),this.load.remembered[this.preset]=Yr(this),ma(this,!1),this.saveToLocalStorageIfPossible()},saveAs:function(e){this.load.remembered||(this.load.remembered={},this.load.remembered[ur]=Yr(this,!0)),this.load.remembered[e]=Yr(this),this.preset=e,ga(this,e,!0),this.saveToLocalStorageIfPossible()},revert:function(e){Y.each(this.__controllers,function(t){this.getRoot().load.remembered?Ku(e||this.getRoot(),t):t.setValue(t.initialValue),t.__onFinishChange&&t.__onFinishChange.call(t,t.getValue())},this),Y.each(this.__folders,function(t){t.revert(t)}),e||ma(this.getRoot(),!1)},listen:function(e){var t=this.__listening.length===0;this.__listening.push(e),t&&ju(this.__listening)},updateDisplay:function(){Y.each(this.__controllers,function(e){e.updateDisplay()}),Y.each(this.__folders,function(e){e.updateDisplay()})}});function Ga(n,e,t){var i=document.createElement("li");return e&&i.appendChild(e),t?n.__ul.insertBefore(i,t):n.__ul.appendChild(i),n.onResize(),i}function Lc(n){k.unbind(window,"resize",n.__resizeHandler),n.saveToLocalStorageIfPossible&&k.unbind(window,"unload",n.saveToLocalStorageIfPossible)}function ma(n,e){var t=n.__preset_select[n.__preset_select.selectedIndex];e?t.innerHTML=t.value+"*":t.innerHTML=t.value}function gy(n,e,t){if(t.__li=e,t.__gui=n,Y.extend(t,{options:function(s){if(arguments.length>1){var a=t.__li.nextElementSibling;return t.remove(),or(n,t.object,t.property,{before:a,factoryArgs:[Y.toArray(arguments)]})}if(Y.isArray(s)||Y.isObject(s)){var l=t.__li.nextElementSibling;return t.remove(),or(n,t.object,t.property,{before:l,factoryArgs:[s]})}},name:function(s){return t.__li.firstElementChild.firstElementChild.innerHTML=s,t},listen:function(){return t.__gui.listen(t),t},remove:function(){return t.__gui.remove(t),t}}),t instanceof pa){var i=new fo(t.object,t.property,{min:t.__min,max:t.__max,step:t.__step});Y.each(["updateDisplay","onChange","onFinishChange","step","min","max"],function(o){var s=t[o],a=i[o];t[o]=i[o]=function(){var l=Array.prototype.slice.call(arguments);return a.apply(i,l),s.apply(t,l)}}),k.addClass(e,"has-slider"),t.domElement.insertBefore(i.domElement,t.domElement.firstElementChild)}else if(t instanceof fo){var r=function(s){if(Y.isNumber(t.__min)&&Y.isNumber(t.__max)){var a=t.__li.firstElementChild.firstElementChild.innerHTML,l=t.__gui.__listening.indexOf(t)>-1;t.remove();var c=or(n,t.object,t.property,{before:t.__li.nextElementSibling,factoryArgs:[t.__min,t.__max,t.__step]});return c.name(a),l&&c.listen(),c}return s};t.min=Y.compose(r,t.min),t.max=Y.compose(r,t.max)}else t instanceof Wu?(k.bind(e,"click",function(){k.fakeEvent(t.__checkbox,"click")}),k.bind(t.__checkbox,"click",function(o){o.stopPropagation()})):t instanceof qu?(k.bind(e,"click",function(){k.fakeEvent(t.__button,"click")}),k.bind(e,"mouseover",function(){k.addClass(t.__button,"hover")}),k.bind(e,"mouseout",function(){k.removeClass(t.__button,"hover")})):t instanceof _a&&(k.addClass(e,"color"),t.updateDisplay=Y.compose(function(o){return e.style.borderLeftColor=t.__color.toString(),o},t.updateDisplay),t.updateDisplay());t.setValue=Y.compose(function(o){return n.getRoot().__preset_select&&t.isModified()&&ma(n.getRoot(),!0),o},t.setValue)}function Ku(n,e){var t=n.getRoot(),i=t.__rememberedObjects.indexOf(e.object);if(i!==-1){var r=t.__rememberedObjectIndecesToControllers[i];if(r===void 0&&(r={},t.__rememberedObjectIndecesToControllers[i]=r),r[e.property]=e,t.load&&t.load.remembered){var o=t.load.remembered,s=void 0;if(o[n.preset])s=o[n.preset];else if(o[ur])s=o[ur];else return;if(s[i]&&s[i][e.property]!==void 0){var a=s[i][e.property];e.initialValue=a,e.setValue(a)}}}}function or(n,e,t,i){if(e[t]===void 0)throw new Error('Object "'+e+'" has no property "'+t+'"');var r=void 0;if(i.color)r=new _a(e,t);else{var o=[e,t].concat(i.factoryArgs);r=hy.apply(n,o)}i.before instanceof ci&&(i.before=i.before.__li),Ku(n,r),k.addClass(r.domElement,"c");var s=document.createElement("span");k.addClass(s,"property-name"),s.innerHTML=r.property;var a=document.createElement("div");a.appendChild(s),a.appendChild(r.domElement);var l=Ga(n,a,i.before);return k.addClass(l,nt.CLASS_CONTROLLER_ROW),r instanceof _a?k.addClass(l,"color"):k.addClass(l,ny(r.getValue())),gy(n,l,r),n.__controllers.push(r),r}function Ai(n,e){return document.location.href+"."+e}function ga(n,e,t){var i=document.createElement("option");i.innerHTML=e,i.value=e,n.__preset_select.appendChild(i),t&&(n.__preset_select.selectedIndex=n.__preset_select.length-1)}function Ic(n,e){e.style.display=n.useLocalStorage?"block":"none"}function vy(n){var e=n.__save_row=document.createElement("li");k.addClass(n.domElement,"has-save"),n.__ul.insertBefore(e,n.__ul.firstChild),k.addClass(e,"save-row");var t=document.createElement("span");t.innerHTML="&nbsp;",k.addClass(t,"button gears");var i=document.createElement("span");i.innerHTML="Save",k.addClass(i,"button"),k.addClass(i,"save");var r=document.createElement("span");r.innerHTML="New",k.addClass(r,"button"),k.addClass(r,"save-as");var o=document.createElement("span");o.innerHTML="Revert",k.addClass(o,"button"),k.addClass(o,"revert");var s=n.__preset_select=document.createElement("select");if(n.load&&n.load.remembered?Y.each(n.load.remembered,function(u,f){ga(n,f,f===n.preset)}):ga(n,ur,!1),k.bind(s,"change",function(){for(var u=0;u<n.__preset_select.length;u++)n.__preset_select[u].innerHTML=n.__preset_select[u].value;n.preset=this.value}),e.appendChild(s),e.appendChild(t),e.appendChild(i),e.appendChild(r),e.appendChild(o),ir){var a=document.getElementById("dg-local-explain"),l=document.getElementById("dg-local-storage"),c=document.getElementById("dg-save-locally");c.style.display="block",localStorage.getItem(Ai(n,"isLocal"))==="true"&&l.setAttribute("checked","checked"),Ic(n,a),k.bind(l,"change",function(){n.useLocalStorage=!n.useLocalStorage,Ic(n,a)})}var d=document.getElementById("dg-new-constructor");k.bind(d,"keydown",function(u){u.metaKey&&(u.which===67||u.keyCode===67)&&rr.hide()}),k.bind(t,"click",function(){d.innerHTML=JSON.stringify(n.getSaveObject(),void 0,2),rr.show(),d.focus(),d.select()}),k.bind(i,"click",function(){n.save()}),k.bind(r,"click",function(){var u=prompt("Enter a new preset name.");u&&n.saveAs(u)}),k.bind(o,"click",function(){n.revert()})}function xy(n){var e=void 0;n.__resize_handle=document.createElement("div"),Y.extend(n.__resize_handle.style,{width:"6px",marginLeft:"-3px",height:"200px",cursor:"ew-resize",position:"absolute"});function t(o){return o.preventDefault(),n.width+=e-o.clientX,n.onResize(),e=o.clientX,!1}function i(){k.removeClass(n.__closeButton,nt.CLASS_DRAG),k.unbind(window,"mousemove",t),k.unbind(window,"mouseup",i)}function r(o){return o.preventDefault(),e=o.clientX,k.addClass(n.__closeButton,nt.CLASS_DRAG),k.bind(window,"mousemove",t),k.bind(window,"mouseup",i),!1}k.bind(n.__resize_handle,"mousedown",r),k.bind(n.__closeButton,"mousedown",r),n.domElement.insertBefore(n.__resize_handle,n.domElement.firstElementChild)}function va(n,e){n.domElement.style.width=e+"px",n.__save_row&&n.autoPlace&&(n.__save_row.style.width=e+"px"),n.__closeButton&&(n.__closeButton.style.width=e+"px")}function Yr(n,e){var t={};return Y.each(n.__rememberedObjects,function(i,r){var o={},s=n.__rememberedObjectIndecesToControllers[r];Y.each(s,function(a,l){o[l]=e?a.initialValue:a.getValue()}),t[r]=o}),t}function Sy(n){for(var e=0;e<n.__preset_select.length;e++)n.__preset_select[e].value===n.preset&&(n.__preset_select.selectedIndex=e)}function ju(n){n.length!==0&&py.call(window,function(){ju(n)}),Y.each(n,function(e){e.updateDisplay()})}var yy=nt;const Zu="lavalandschaft_settings";function Nc(n){localStorage.setItem(Zu,JSON.stringify(n))}function by(){const n=localStorage.getItem(Zu);if(!n)return null;try{return JSON.parse(n)}catch(e){return console.error("Saved settings are corrupted:",e),null}}function Ey(n,e="lavalandschaft-settings.json"){const t=new Blob([JSON.stringify(n,null,2)],{type:"application/json"}),i=URL.createObjectURL(t),r=document.createElement("a");r.href=i,r.download=e,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(i)}function My(n){const e=document.createElement("input");e.type="file",e.accept="application/json",e.onchange=()=>{const t=e.files[0];if(!t)return;const i=new FileReader;i.onload=()=>{try{n(JSON.parse(i.result))}catch(r){console.error("Invalid JSON file:",r)}},i.readAsText(t)},e.click()}function Ty(n){const e=new yy,t=[],i=[];function r(M){return t.push(M),M}function o(M){const ie={};for(const[he,ye]of Object.entries(M))ie[he]=ye(),i.push(()=>{ie[he]=ye()});return ie}const s=o({paused:n.isPaused,time_scale:n.getTimeScale,interaction_mode:n.getInteractionMode,interaction_smoke_visible:n.getInteractionSmokeVisible});r(e.add(s,"paused")).name("⏸ Pausiert").onChange(M=>n.setPaused(M)),r(e.add(s,"time_scale",.1,100,.1)).name("Zeitgeschwindigkeit").onChange(M=>n.setTimeScale(M)),r(e.add(s,"interaction_mode")).name("Interaktionsmodus").onChange(M=>n.setInteractionMode(M)),r(e.add(s,"interaction_smoke_visible")).name("Rauch bei Berührung").onChange(M=>n.setInteractionSmokeVisible(M));const a=e.addFolder("Metaballs"),l=o({count:n.getMetaballCount,isolation:n.getMetaballIsolation,radius:n.getMetaballRadius,spread:n.getMetaballSpread,speed_factor:n.getMetaballSpeed,sink_speed:n.getMetaballSinkSpeed,disappear_y:n.getMetaballDisappearY,height:n.getMetaballHeight,flow_z_radius:n.getFlowRadius});r(a.add(l,"count",1,n.getMaxMetaballCount(),1)).name("Limit").onChange(M=>n.setMetaballCount(M)),r(a.add(l,"isolation",1,100,1)).name("Schwellenwert").onChange(M=>n.setMetaballIsolation(M)),r(a.add(l,"radius",.2,3,.05)).name("Radius").onChange(M=>n.setMetaballRadius(M)),r(a.add(l,"spread",.1,2,.01)).name("Verteilung").onChange(M=>n.setMetaballSpread(M)),r(a.add(l,"speed_factor",0,.01,1e-4)).name("Geschwindigkeit").onChange(M=>n.setMetaballSpeed(M)),r(a.add(l,"sink_speed",.05,2,.01)).name("Versinken").onChange(M=>n.setMetaballSinkSpeed(M)),r(a.add(l,"disappear_y",.15,.4,.005)).name("Verschwindehöhe").onChange(M=>n.setMetaballDisappearY(M)),r(a.add(l,"height",0,5,.05)).name("Höhe").onChange(M=>n.setMetaballHeight(M)),r(a.add(l,"flow_z_radius",0,20,.1)).name("Steigung").onChange(M=>n.setFlowRadius(M));const c=e.addFolder("Lavafarbe"),d=o({color_hot:n.getColorHot,color_cool:n.getColorCool,glow_enabled:n.getGlowEnabled,glow_color:n.getGlowColor});r(c.addColor(d,"color_hot")).name("Hell (beleuchtet)").onChange(M=>n.setColorHot(M)),r(c.addColor(d,"color_cool")).name("Dunkel (Schatten)").onChange(M=>n.setColorCool(M)),r(c.add(d,"glow_enabled")).name("Glühen").onChange(M=>n.setGlowEnabled(M)),r(c.addColor(d,"glow_color")).name("Glühfarbe").onChange(M=>n.setGlowColor(M));const u=e.addFolder("Noise"),f=o({noise:n.getNoiseEnabled,noise_color_1:n.getNoiseColor1,noise_color_2:n.getNoiseColor2,bumping:n.getBumpEnabled});r(u.add(f,"noise")).name("Aktiviert").onChange(M=>n.setNoiseEnabled(M)),r(u.addColor(f,"noise_color_1")).name("primäre Farbe").onChange(M=>n.setNoiseColor1(M)),r(u.addColor(f,"noise_color_2")).name("sekundäre Farbe").onChange(M=>n.setNoiseColor2(M)),r(u.add(f,"bumping")).name("Bumping").onChange(M=>n.setBumpEnabled(M));const _=o({displacement:n.getDisplacementEnabled,strength:n.getDisplacementStrength});r(u.add(_,"displacement")).name("Displacement").onChange(M=>n.setDisplacementEnabled(M)),r(u.add(_,"strength",0,.004,1e-4)).name("Displacement Stärke").onChange(M=>n.setDisplacementStrength(M));const v=e.addFolder("Boden"),x=o({visible:n.getGroundVisible,color:n.getGroundColor,color_2:n.getGroundColor2,color_3:n.getGroundColor3,color_4:n.getGroundColor4,crack_color:n.getGroundCrackColor,crack_color_2:n.getGroundCrackColor2,crack_color_3:n.getGroundCrackColor3,crack_color_4:n.getGroundCrackColor4,crack_softness:n.getGroundCrackSoftness,proximity_color:n.getGroundProximityColor,proximity_noise_color:n.getGroundProximityNoiseColor,proximity_radius:n.getGroundProximityRadius,sun_focus_radius:n.getGroundSunFocusRadius,rock_variance_radius:n.getGroundRockVarianceRadius,displacement_scale:n.getGroundDisplacementScale,displacement_frequency:n.getGroundDisplacementFrequency,height:n.getGroundHeight});r(v.add(x,"visible")).name("Sichtbar").onChange(M=>n.setGroundVisible(M)),r(v.addColor(x,"color")).name("Farbe").onChange(M=>n.setGroundColor(M)),r(v.addColor(x,"color_2")).name("Farbe 2 (Gesteinsart)").onChange(M=>n.setGroundColor2(M)),r(v.addColor(x,"color_3")).name("Farbe 3 (Gesteinsart)").onChange(M=>n.setGroundColor3(M)),r(v.addColor(x,"color_4")).name("Farbe 4 (Gesteinsart)").onChange(M=>n.setGroundColor4(M)),r(v.addColor(x,"crack_color")).name("Rissfarbe").onChange(M=>n.setGroundCrackColor(M)),r(v.addColor(x,"crack_color_2")).name("Rissfarbe 2").onChange(M=>n.setGroundCrackColor2(M)),r(v.addColor(x,"crack_color_3")).name("Rissfarbe 3").onChange(M=>n.setGroundCrackColor3(M)),r(v.addColor(x,"crack_color_4")).name("Rissfarbe 4 (Rotblitz)").onChange(M=>n.setGroundCrackColor4(M)),r(v.add(x,"crack_softness",.001,1,.001)).name("Rissweichheit").onChange(M=>n.setGroundCrackSoftness(M)),r(v.addColor(x,"proximity_color")).name("Farbe nahe Vulkan").onChange(M=>n.setGroundProximityColor(M)),r(v.addColor(x,"proximity_noise_color")).name("Farbrauschen nahe Vulkan").onChange(M=>n.setGroundProximityNoiseColor(M)),r(v.add(x,"proximity_radius",0,40,.5)).name("Reichweite (Vulkannähe)").onChange(M=>n.setGroundProximityRadius(M)),r(v.add(x,"sun_focus_radius",0,40,.1)).name("Sonnenfokus-Nähe (Vulkan)").onChange(M=>n.setGroundSunFocusRadius(M)),r(v.add(x,"rock_variance_radius",0,80,.5)).name("Reichweite bis Gesteinsvarianz").onChange(M=>n.setGroundRockVarianceRadius(M)),r(v.add(x,"displacement_scale",0,3,.05)).name("Unebenheit").onChange(M=>n.setGroundDisplacementScale(M)),r(v.add(x,"displacement_frequency",.01,.5,.01)).name("Struktur-Frequenz").onChange(M=>n.setGroundDisplacementFrequency(M)),r(v.add(x,"height",-10,0,.01)).name("Höhe").onChange(M=>n.setGroundHeight(M));const m=e.addFolder("Vulkan"),h=o({visible:n.getVolcanoVisible,displacement_scale:n.getVolcanoDisplacementScale,displacement_frequency:n.getVolcanoDisplacementFrequency,rock_color:n.getVolcanoRockColor});r(m.add(h,"visible")).name("Sichtbar").onChange(M=>n.setVolcanoVisible(M)),r(m.add(h,"displacement_scale",0,6,.05)).name("Risstiefe").onChange(M=>n.setVolcanoDisplacementScale(M)),r(m.add(h,"displacement_frequency",.1,2,.05)).name("Rissfrequenz").onChange(M=>n.setVolcanoDisplacementFrequency(M)),r(m.addColor(h,"rock_color")).name("Felsfarbe").onChange(M=>n.setVolcanoRockColor(M));const A=e.addFolder("Sonne"),g=o({visible:n.getSunVisible,strength:n.getSunStrength,focus:n.getSunFocus});r(A.add(g,"visible")).name("Sichtbar").onChange(M=>n.setSunVisible(M)),r(A.add(g,"strength",0,.3,.005)).name("Sonneneinstrahlung").onChange(M=>n.setSunStrength(M)),r(A.add(g,"focus",1,25,.1)).name("Sonnenfokus").onChange(M=>n.setSunFocus(M));const E=e.addFolder("Rauch & Asche"),I=o({visible:n.getSmokeVisible,count:n.getSmokeCount,spread:n.getSmokeSpread,rise_speed:n.getSmokeRiseSpeed,color_1:n.getSmokeColor1,color_2:n.getSmokeColor2,color_3:n.getSmokeColor3,particle_size:n.getSmokeParticleSize,ember_cooling_time:n.getSmokeEmberCoolingTime});r(E.add(I,"visible")).name("Sichtbar").onChange(M=>n.setSmokeVisible(M)),r(E.add(I,"count",1,n.getMaxSmokeCount(),1)).name("Anzahl").onChange(M=>n.setSmokeCount(M)),r(E.add(I,"spread",0,8,.1)).name("Streuung").onChange(M=>n.setSmokeSpread(M)),r(E.add(I,"rise_speed",.1,3,.05)).name("Aufstiegsgeschwindigkeit").onChange(M=>n.setSmokeRiseSpeed(M)),r(E.addColor(I,"color_1")).name("Farbe (Asche, dunkel)").onChange(M=>n.setSmokeColor1(M)),r(E.addColor(I,"color_2")).name("Farbe (Rauch, hell)").onChange(M=>n.setSmokeColor2(M)),r(E.addColor(I,"color_3")).name("Farbe (Glut, Akzent)").onChange(M=>n.setSmokeColor3(M)),r(E.add(I,"particle_size",.1,200,.1)).name("Partikelgröße").onChange(M=>n.setSmokeParticleSize(M)),r(E.add(I,"ember_cooling_time",.1,30,.1)).name("Abkühlzeit (Glut)").onChange(M=>n.setSmokeEmberCoolingTime(M));const R=e.addFolder("Position (Vulkan + Lava)"),P=o({x:n.getOffsetX,y:n.getOffsetY,z:n.getOffsetZ});r(R.add(P,"x",-10,10,.1)).name("X").onChange(M=>n.setOffsetX(M)),r(R.add(P,"y",-6,6,.1)).name("Y-Versatz").onChange(M=>n.setOffsetY(M)),r(R.add(P,"z",-10,10,.1)).name("Z").onChange(M=>n.setOffsetZ(M));const p=e.addFolder("Bloom"),T=o({enabled:n.getBloomEnabled,strength:n.getBloomStrength,radius:n.getBloomRadius,threshold:n.getBloomThreshold});r(p.add(T,"enabled")).name("Aktiviert").onChange(M=>n.setBloomEnabled(M)),r(p.add(T,"strength",0,4,.05)).name("Stärke").onChange(M=>n.setBloomStrength(M)),r(p.add(T,"radius",0,1.5,.01)).name("Radius").onChange(M=>n.setBloomRadius(M)),r(p.add(T,"threshold",0,1,.01)).name("Schwellenwert").onChange(M=>n.setBloomThreshold(M));const b=e.addFolder("Himmel"),L=o({color:n.getSkyColor});r(b.addColor(L,"color")).name("Farbe").onChange(M=>n.setSkyColor(M));const V=e.addFolder("Lichtstrahlen"),G=o({weight:n.getGodRaysWeight,exposure:n.getGodRaysExposure,decay:n.getGodRaysDecay,density:n.getGodRaysDensity,tint_color:n.getGodRaysTintColor});r(V.add(G,"weight",0,1,.01)).name("Stärke").onChange(M=>n.setGodRaysWeight(M)),r(V.add(G,"exposure",0,1.5,.01)).name("Belichtung").onChange(M=>n.setGodRaysExposure(M)),r(V.add(G,"decay",.8,.99,.001)).name("Abklingrate").onChange(M=>n.setGodRaysDecay(M)),r(V.add(G,"density",.5,1.2,.01)).name("Dichte").onChange(M=>n.setGodRaysDensity(M)),r(V.addColor(G,"tint_color")).name("Farbe").onChange(M=>n.setGodRaysTintColor(M));function Z(){i.forEach(M=>M()),t.forEach(M=>M.updateDisplay())}const $={save:()=>{const M=n.getSnapshot();Nc(M),Ey(M)},load:()=>My(M=>{n.applySnapshot(M),Z()}),reset:()=>{n.resetToDefaults(),Z()}},W=e.addFolder("Speichern / Laden");W.add($,"save").name("💾 Speichern"),W.add($,"load").name("📂 Laden"),W.add($,"reset").name("🔄 Standard");const J=by();return J&&(n.applySnapshot(J),Z()),window.addEventListener("beforeunload",()=>Nc(n.getSnapshot())),e}const yo=new Sh;yo.background=new fe(de.skyColor);IS(yo);const cn=new gg({antialias:!0});cn.setSize(window.innerWidth,window.innerHeight);cn.setPixelRatio(window.devicePixelRatio);cn.toneMapping=Bc;cn.shadowMap.enabled=!0;cn.shadowMap.type=Fc;document.body.appendChild(cn.domElement);const bo=LS(cn),$u=bo.camera,dr=QS({renderer:cn,scene:yo,camera:$u}),wy=new lu,Fn=gS({scene:yo,camera:$u,renderer:cn,bloom_pass:dr.bloom_pass,god_rays_pass:dr.god_rays_pass,setControlsEnabled:bo.setControlsEnabled});dr.setOccluders({sun_mesh:Fn.getSunMesh(),occluder_meshes:[Fn.getGroundMesh(),Fn.getVolcanoMesh()]});Ty(Fn);window.addEventListener("resize",()=>{bo.resize(window.innerWidth,window.innerHeight),cn.setSize(window.innerWidth,window.innerHeight),dr.resize(window.innerWidth,window.innerHeight)});let Uc=0;const Ju=()=>{requestAnimationFrame(Ju);const n=wy.getDelta();Fn.isPaused()||(Uc+=n*Fn.getTimeScale()),bo.update(Fn.getVolcanoPosition()),Fn.update(Uc),dr.render()};Ju();
