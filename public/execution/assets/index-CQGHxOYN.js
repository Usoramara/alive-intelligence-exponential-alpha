(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();const bs=globalThis,fa=bs.ShadowRoot&&(bs.ShadyCSS===void 0||bs.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ha=Symbol(),Do=new WeakMap;let yl=class{constructor(t,n,s){if(this._$cssResult$=!0,s!==ha)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n}get styleSheet(){let t=this.o;const n=this.t;if(fa&&t===void 0){const s=n!==void 0&&n.length===1;s&&(t=Do.get(n)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Do.set(n,t))}return t}toString(){return this.cssText}};const Id=e=>new yl(typeof e=="string"?e:e+"",void 0,ha),Rd=(e,...t)=>{const n=e.length===1?e[0]:t.reduce((s,i,a)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[a+1],e[0]);return new yl(n,e,ha)},Pd=(e,t)=>{if(fa)e.adoptedStyleSheets=t.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(const n of t){const s=document.createElement("style"),i=bs.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=n.cssText,e.appendChild(s)}},No=fa?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let n="";for(const s of t.cssRules)n+=s.cssText;return Id(n)})(e):e;const{is:Dd,defineProperty:Nd,getOwnPropertyDescriptor:Fd,getOwnPropertyNames:Od,getOwnPropertySymbols:Bd,getPrototypeOf:zd}=Object,js=globalThis,Fo=js.trustedTypes,Ud=Fo?Fo.emptyScript:"",Hd=js.reactiveElementPolyfillSupport,_n=(e,t)=>e,Ss={toAttribute(e,t){switch(t){case Boolean:e=e?Ud:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},va=(e,t)=>!Dd(e,t),Oo={attribute:!0,type:String,converter:Ss,reflect:!1,useDefault:!1,hasChanged:va};Symbol.metadata??=Symbol("metadata"),js.litPropertyMetadata??=new WeakMap;let an=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,n=Oo){if(n.state&&(n.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((n=Object.create(n)).wrapped=!0),this.elementProperties.set(t,n),!n.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,n);i!==void 0&&Nd(this.prototype,t,i)}}static getPropertyDescriptor(t,n,s){const{get:i,set:a}=Fd(this.prototype,t)??{get(){return this[n]},set(o){this[n]=o}};return{get:i,set(o){const r=i?.call(this);a?.call(this,o),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Oo}static _$Ei(){if(this.hasOwnProperty(_n("elementProperties")))return;const t=zd(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_n("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_n("properties"))){const n=this.properties,s=[...Od(n),...Bd(n)];for(const i of s)this.createProperty(i,n[i])}const t=this[Symbol.metadata];if(t!==null){const n=litPropertyMetadata.get(t);if(n!==void 0)for(const[s,i]of n)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[n,s]of this.elementProperties){const i=this._$Eu(n,s);i!==void 0&&this._$Eh.set(i,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const n=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)n.unshift(No(i))}else t!==void 0&&n.push(No(t));return n}static _$Eu(t,n){const s=n.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,n=this.constructor.elementProperties;for(const s of n.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Pd(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,n,s){this._$AK(t,s)}_$ET(t,n){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const a=(s.converter?.toAttribute!==void 0?s.converter:Ss).toAttribute(n,s.type);this._$Em=t,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,n){const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const a=s.getPropertyOptions(i),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Ss;this._$Em=i;const r=o.fromAttribute(n,a.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,n,s,i=!1,a){if(t!==void 0){const o=this.constructor;if(i===!1&&(a=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??va)(a,n)||s.useDefault&&s.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,n,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,n,{useDefault:s,reflect:i,wrapped:a},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??n??this[t]),a!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(n=void 0),this._$AL.set(t,n)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,a]of s){const{wrapped:o}=a,r=this[i];o!==!0||this._$AL.has(i)||r===void 0||this.C(i,void 0,a,r)}}let t=!1;const n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(n)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(n)}willUpdate(t){}_$AE(t){this._$EO?.forEach(n=>n.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(n=>this._$ET(n,this[n])),this._$EM()}updated(t){}firstUpdated(t){}};an.elementStyles=[],an.shadowRootOptions={mode:"open"},an[_n("elementProperties")]=new Map,an[_n("finalized")]=new Map,Hd?.({ReactiveElement:an}),(js.reactiveElementVersions??=[]).push("2.1.2");const ma=globalThis,Bo=e=>e,As=ma.trustedTypes,zo=As?As.createPolicy("lit-html",{createHTML:e=>e}):void 0,xl="$lit$",vt=`lit$${Math.random().toFixed(9).slice(2)}$`,$l="?"+vt,jd=`<${$l}>`,jt=document,On=()=>jt.createComment(""),Bn=e=>e===null||typeof e!="object"&&typeof e!="function",ba=Array.isArray,Kd=e=>ba(e)||typeof e?.[Symbol.iterator]=="function",hi=`[ 	
\f\r]`,vn=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Uo=/-->/g,Ho=/>/g,Tt=RegExp(`>|${hi}(?:([^\\s"'>=/]+)(${hi}*=${hi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),jo=/'/g,Ko=/"/g,wl=/^(?:script|style|textarea|title)$/i,kl=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),l=kl(1),_t=kl(2),xt=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),Wo=new WeakMap,Ut=jt.createTreeWalker(jt,129);function Sl(e,t){if(!ba(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return zo!==void 0?zo.createHTML(t):t}const Wd=(e,t)=>{const n=e.length-1,s=[];let i,a=t===2?"<svg>":t===3?"<math>":"",o=vn;for(let r=0;r<n;r++){const c=e[r];let u,p,g=-1,d=0;for(;d<c.length&&(o.lastIndex=d,p=o.exec(c),p!==null);)d=o.lastIndex,o===vn?p[1]==="!--"?o=Uo:p[1]!==void 0?o=Ho:p[2]!==void 0?(wl.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=Tt):p[3]!==void 0&&(o=Tt):o===Tt?p[0]===">"?(o=i??vn,g=-1):p[1]===void 0?g=-2:(g=o.lastIndex-p[2].length,u=p[1],o=p[3]===void 0?Tt:p[3]==='"'?Ko:jo):o===Ko||o===jo?o=Tt:o===Uo||o===Ho?o=vn:(o=Tt,i=void 0);const h=o===Tt&&e[r+1].startsWith("/>")?" ":"";a+=o===vn?c+jd:g>=0?(s.push(u),c.slice(0,g)+xl+c.slice(g)+vt+h):c+vt+(g===-2?r:h)}return[Sl(e,a+(e[n]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class zn{constructor({strings:t,_$litType$:n},s){let i;this.parts=[];let a=0,o=0;const r=t.length-1,c=this.parts,[u,p]=Wd(t,n);if(this.el=zn.createElement(u,s),Ut.currentNode=this.el.content,n===2||n===3){const g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(i=Ut.nextNode())!==null&&c.length<r;){if(i.nodeType===1){if(i.hasAttributes())for(const g of i.getAttributeNames())if(g.endsWith(xl)){const d=p[o++],h=i.getAttribute(g).split(vt),f=/([.?@])?(.*)/.exec(d);c.push({type:1,index:a,name:f[2],strings:h,ctor:f[1]==="."?qd:f[1]==="?"?Gd:f[1]==="@"?Qd:Ws}),i.removeAttribute(g)}else g.startsWith(vt)&&(c.push({type:6,index:a}),i.removeAttribute(g));if(wl.test(i.tagName)){const g=i.textContent.split(vt),d=g.length-1;if(d>0){i.textContent=As?As.emptyScript:"";for(let h=0;h<d;h++)i.append(g[h],On()),Ut.nextNode(),c.push({type:2,index:++a});i.append(g[d],On())}}}else if(i.nodeType===8)if(i.data===$l)c.push({type:2,index:a});else{let g=-1;for(;(g=i.data.indexOf(vt,g+1))!==-1;)c.push({type:7,index:a}),g+=vt.length-1}a++}}static createElement(t,n){const s=jt.createElement("template");return s.innerHTML=t,s}}function dn(e,t,n=e,s){if(t===xt)return t;let i=s!==void 0?n._$Co?.[s]:n._$Cl;const a=Bn(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,s)),s!==void 0?(n._$Co??=[])[s]=i:n._$Cl=i),i!==void 0&&(t=dn(e,i._$AS(e,t.values),i,s)),t}class Vd{constructor(t,n){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:n},parts:s}=this._$AD,i=(t?.creationScope??jt).importNode(n,!0);Ut.currentNode=i;let a=Ut.nextNode(),o=0,r=0,c=s[0];for(;c!==void 0;){if(o===c.index){let u;c.type===2?u=new Ks(a,a.nextSibling,this,t):c.type===1?u=new c.ctor(a,c.name,c.strings,this,t):c.type===6&&(u=new Yd(a,this,t)),this._$AV.push(u),c=s[++r]}o!==c?.index&&(a=Ut.nextNode(),o++)}return Ut.currentNode=jt,i}p(t){let n=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,n),n+=s.strings.length-2):s._$AI(t[n])),n++}}let Ks=class Al{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,n,s,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=n,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const n=this._$AM;return n!==void 0&&t?.nodeType===11&&(t=n.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,n=this){t=dn(this,t,n),Bn(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==xt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Kd(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==v&&Bn(this._$AH)?this._$AA.nextSibling.data=t:this.T(jt.createTextNode(t)),this._$AH=t}$(t){const{values:n,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=zn.createElement(Sl(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(n);else{const a=new Vd(i,this),o=a.u(this.options);a.p(n),this.T(o),this._$AH=a}}_$AC(t){let n=Wo.get(t.strings);return n===void 0&&Wo.set(t.strings,n=new zn(t)),n}k(t){ba(this._$AH)||(this._$AH=[],this._$AR());const n=this._$AH;let s,i=0;for(const a of t)i===n.length?n.push(s=new Al(this.O(On()),this.O(On()),this,this.options)):s=n[i],s._$AI(a),i++;i<n.length&&(this._$AR(s&&s._$AB.nextSibling,i),n.length=i)}_$AR(t=this._$AA.nextSibling,n){for(this._$AP?.(!1,!0,n);t!==this._$AB;){const s=Bo(t).nextSibling;Bo(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Ws=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,n,s,i,a){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=n,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(t,n=this,s,i){const a=this.strings;let o=!1;if(a===void 0)t=dn(this,t,n,0),o=!Bn(t)||t!==this._$AH&&t!==xt,o&&(this._$AH=t);else{const r=t;let c,u;for(t=a[0],c=0;c<a.length-1;c++)u=dn(this,r[s+c],n,c),u===xt&&(u=this._$AH[c]),o||=!Bn(u)||u!==this._$AH[c],u===v?t=v:t!==v&&(t+=(u??"")+a[c+1]),this._$AH[c]=u}o&&!i&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},qd=class extends Ws{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}},Gd=class extends Ws{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==v)}},Qd=class extends Ws{constructor(t,n,s,i,a){super(t,n,s,i,a),this.type=5}_$AI(t,n=this){if((t=dn(this,t,n,0)??v)===xt)return;const s=this._$AH,i=t===v&&s!==v||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==v&&(s===v||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Yd=class{constructor(t,n,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=n,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){dn(this,t)}};const Zd={I:Ks},Jd=ma.litHtmlPolyfillSupport;Jd?.(zn,Ks),(ma.litHtmlVersions??=[]).push("3.3.2");const Xd=(e,t,n)=>{const s=n?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const a=n?.renderBefore??null;s._$litPart$=i=new Ks(t.insertBefore(On(),a),a,void 0,n??{})}return i._$AI(e),i};const ya=globalThis;let ln=class extends an{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const n=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Xd(n,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return xt}};ln._$litElement$=!0,ln.finalized=!0,ya.litElementHydrateSupport?.({LitElement:ln});const eu=ya.litElementPolyfillSupport;eu?.({LitElement:ln});(ya.litElementVersions??=[]).push("4.2.2");const Cl=e=>(t,n)=>{n!==void 0?n.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};const tu={attribute:!0,type:String,converter:Ss,reflect:!1,hasChanged:va},nu=(e=tu,t,n)=>{const{kind:s,metadata:i}=n;let a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),s==="setter"&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),s==="accessor"){const{name:o}=n;return{set(r){const c=t.get.call(this);t.set.call(this,r),this.requestUpdate(o,c,e,!0,r)},init(r){return r!==void 0&&this.C(o,void 0,e,r),r}}}if(s==="setter"){const{name:o}=n;return function(r){const c=this[o];t.call(this,r),this.requestUpdate(o,c,e,!0,r)}}throw Error("Unsupported decorator location: "+s)};function Vs(e){return(t,n)=>typeof n=="object"?nu(e,t,n):((s,i,a)=>{const o=i.hasOwnProperty(a);return i.constructor.createProperty(a,s),o?Object.getOwnPropertyDescriptor(i,a):void 0})(e,t,n)}function x(e){return Vs({...e,state:!0,attribute:!1})}const su="modulepreload",iu=function(e){return"/execution/"+e},Vo={},cn=function(t,n,s){let i=Promise.resolve();if(n&&n.length>0){let u=function(p){return Promise.all(p.map(g=>Promise.resolve(g).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};var o=u;document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),c=r?.nonce||r?.getAttribute("nonce");i=u(n.map(p=>{if(p=iu(p),p in Vo)return;Vo[p]=!0;const g=p.endsWith(".css"),d=g?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${d}`))return;const h=document.createElement("link");if(h.rel=g?"stylesheet":su,g||(h.as="script"),h.crossOrigin="",h.href=p,c&&h.setAttribute("nonce",c),document.head.appendChild(h),g)return new Promise((f,m)=>{h.addEventListener("load",f),h.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${p}`)))})}))}function a(r){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=r,window.dispatchEvent(c),!c.defaultPrevented)throw r}return i.then(r=>{for(const c of r||[])c.status==="rejected"&&a(c.reason);return t().catch(a)})},au={common:{health:"Health",ok:"OK",offline:"Offline",connect:"Connect",refresh:"Refresh",enabled:"Enabled",disabled:"Disabled",na:"n/a",docs:"Docs",resources:"Resources"},nav:{main:"Main",chat:"Chat",goals:"Goals",control:"Control",agent:"Agent",settings:"Settings",expand:"Expand sidebar",collapse:"Collapse sidebar",showAdvanced:"Show advanced",hideAdvanced:"Hide advanced"},tabs:{goals:"Goals",activity:"Activity",agents:"Agents",overview:"Overview",channels:"Channels",instances:"Instances",sessions:"Sessions",usage:"Usage",cron:"Cron Jobs",skills:"Skills",nodes:"Nodes",chat:"Chat",mind:"Mind",voice:"Voice",config:"Config",debug:"Debug",logs:"Logs"},subtitles:{goals:"Set objectives and track autonomous execution.",activity:"Live feed of agent actions across all channels.",agents:"Manage agent workspaces, tools, and identities.",overview:"Gateway status, entry points, and a fast health read.",channels:"Manage channels and settings.",instances:"Presence beacons from connected clients and nodes.",sessions:"Inspect active sessions and adjust per-session defaults.",usage:"Monitor API usage and costs.",cron:"Schedule wakeups and recurring agent runs.",skills:"Manage skill availability and API key injection.",nodes:"Paired devices, capabilities, and command exposure.",chat:"Direct gateway chat session for quick interventions.",mind:"Cognitive state, emotions, and memory.",voice:"Real-time voice conversation via microphone.",config:"Edit ~/.openclaw/openclaw.json safely.",debug:"Gateway snapshots, events, and manual RPC calls.",logs:"Live tail of the gateway file logs."},overview:{access:{title:"Gateway Access",subtitle:"Where the dashboard connects and how it authenticates.",wsUrl:"WebSocket URL",token:"Gateway Token",password:"Password (not stored)",sessionKey:"Default Session Key",language:"Language",connectHint:"Click Connect to apply connection changes.",trustedProxy:"Authenticated via trusted proxy."},snapshot:{title:"Snapshot",subtitle:"Latest gateway handshake information.",status:"Status",uptime:"Uptime",tickInterval:"Tick Interval",lastChannelsRefresh:"Last Channels Refresh",channelsHint:"Use Channels to link WhatsApp, Telegram, Discord, Signal, or iMessage."},stats:{instances:"Instances",instancesHint:"Presence beacons in the last 5 minutes.",sessions:"Sessions",sessionsHint:"Recent session keys tracked by the gateway.",cron:"Cron",cronNext:"Next wake {time}"},notes:{title:"Notes",subtitle:"Quick reminders for remote control setups.",tailscaleTitle:"Tailscale serve",tailscaleText:"Prefer serve mode to keep the gateway on loopback with tailnet auth.",sessionTitle:"Session hygiene",sessionText:"Use /new or sessions.patch to reset context.",cronTitle:"Cron reminders",cronText:"Use isolated sessions for recurring runs."},auth:{required:"This gateway requires auth. Add a token or password, then click Connect.",failed:"Auth failed. Re-copy a tokenized URL with {command}, or update the token, then click Connect."},insecure:{hint:"This page is HTTP, so the browser blocks device identity. Use HTTPS (Tailscale Serve) or open {url} on the gateway host.",stayHttp:"If you must stay on HTTP, set {config} (token-only)."}},chat:{disconnected:"Disconnected from gateway.",refreshTitle:"Refresh chat data",thinkingToggle:"Toggle assistant thinking/working output",focusToggle:"Toggle focus mode (hide sidebar + page header)",onboardingDisabled:"Disabled during onboarding"},languages:{en:"English",zhCN:"简体中文 (Simplified Chinese)",zhTW:"繁體中文 (Traditional Chinese)",ptBR:"Português (Brazilian Portuguese)"}},ou=["en","zh-CN","zh-TW","pt-BR"];function xa(e){return e!=null&&ou.includes(e)}class ru{constructor(){this.locale="en",this.translations={en:au},this.subscribers=new Set,this.loadLocale()}loadLocale(){const t=localStorage.getItem("openclaw.i18n.locale");if(xa(t))this.locale=t;else{const n=navigator.language;n.startsWith("zh")?this.locale=n==="zh-TW"||n==="zh-HK"?"zh-TW":"zh-CN":n.startsWith("pt")?this.locale="pt-BR":this.locale="en"}}getLocale(){return this.locale}async setLocale(t){if(this.locale!==t){if(!this.translations[t])try{let n;if(t==="zh-CN")n=await cn(()=>import("./zh-CN-C0ymfMAX.js"),[]);else if(t==="zh-TW")n=await cn(()=>import("./zh-TW-C83hQXDP.js"),[]);else if(t==="pt-BR")n=await cn(()=>import("./pt-BR-BKDDw8JE.js"),[]);else return;this.translations[t]=n[t.replace("-","_")]}catch(n){console.error(`Failed to load locale: ${t}`,n);return}this.locale=t,localStorage.setItem("openclaw.i18n.locale",t),this.notify()}}registerTranslation(t,n){this.translations[t]=n}subscribe(t){return this.subscribers.add(t),()=>this.subscribers.delete(t)}notify(){this.subscribers.forEach(t=>t(this.locale))}t(t,n){const s=t.split(".");let i=this.translations[this.locale]||this.translations.en;for(const a of s)if(i&&typeof i=="object")i=i[a];else{i=void 0;break}if(i===void 0&&this.locale!=="en"){i=this.translations.en;for(const a of s)if(i&&typeof i=="object")i=i[a];else{i=void 0;break}}return typeof i!="string"?t:n?i.replace(/\{(\w+)\}/g,(a,o)=>n[o]||`{${o}}`):i}}const Un=new ru,R=(e,t)=>Un.t(e,t);class lu{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){this.unsubscribe=Un.subscribe(()=>{this.host.requestUpdate()})}hostDisconnected(){this.unsubscribe?.()}}async function _e(e,t){if(!(!e.client||!e.connected)&&!e.channelsLoading){e.channelsLoading=!0,e.channelsError=null;try{const n=await e.client.request("channels.status",{probe:t,timeoutMs:8e3});e.channelsSnapshot=n,e.channelsLastSuccess=Date.now()}catch(n){e.channelsError=String(n)}finally{e.channelsLoading=!1}}}async function cu(e,t){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const n=await e.client.request("web.login.start",{force:t,timeoutMs:3e4});e.whatsappLoginMessage=n.message??null,e.whatsappLoginQrDataUrl=n.qrDataUrl??null,e.whatsappLoginConnected=null}catch(n){e.whatsappLoginMessage=String(n),e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function du(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const t=await e.client.request("web.login.wait",{timeoutMs:12e4});e.whatsappLoginMessage=t.message??null,e.whatsappLoginConnected=t.connected??null,t.connected&&(e.whatsappLoginQrDataUrl=null)}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function uu(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{await e.client.request("channels.logout",{channel:"whatsapp"}),e.whatsappLoginMessage="Logged out.",e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}catch(t){e.whatsappLoginMessage=String(t)}finally{e.whatsappBusy=!1}}}function Le(e){if(e)return Array.isArray(e.type)?e.type.filter(n=>n!=="null")[0]??e.type[0]:e.type}function Tl(e){if(!e)return"";if(e.default!==void 0)return e.default;switch(Le(e)){case"object":return{};case"array":return[];case"boolean":return!1;case"number":case"integer":return 0;case"string":return"";default:return""}}function $a(e){return e.filter(t=>typeof t=="string").join(".")}function De(e,t){const n=$a(e),s=t[n];if(s)return s;const i=n.split(".");for(const[a,o]of Object.entries(t)){if(!a.includes("*"))continue;const r=a.split(".");if(r.length!==i.length)continue;let c=!0;for(let u=0;u<i.length;u+=1)if(r[u]!=="*"&&r[u]!==i[u]){c=!1;break}if(c)return o}}function rt(e){return e.replace(/_/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/\s+/g," ").replace(/^./,t=>t.toUpperCase())}function qo(e,t){const n=e.trim();if(n==="")return;const s=Number(n);return!Number.isFinite(s)||t&&!Number.isInteger(s)?e:s}function Go(e){const t=e.trim();return t==="true"?!0:t==="false"?!1:e}function ht(e,t){if(e==null)return e;if(t.allOf&&t.allOf.length>0){let s=e;for(const i of t.allOf)s=ht(s,i);return s}const n=Le(t);if(t.anyOf||t.oneOf){const s=(t.anyOf??t.oneOf??[]).filter(i=>!(i.type==="null"||Array.isArray(i.type)&&i.type.includes("null")));if(s.length===1)return ht(e,s[0]);if(typeof e=="string")for(const i of s){const a=Le(i);if(a==="number"||a==="integer"){const o=qo(e,a==="integer");if(o===void 0||typeof o=="number")return o}if(a==="boolean"){const o=Go(e);if(typeof o=="boolean")return o}}for(const i of s){const a=Le(i);if(a==="object"&&typeof e=="object"&&!Array.isArray(e)||a==="array"&&Array.isArray(e))return ht(e,i)}return e}if(n==="number"||n==="integer"){if(typeof e=="string"){const s=qo(e,n==="integer");if(s===void 0||typeof s=="number")return s}return e}if(n==="boolean"){if(typeof e=="string"){const s=Go(e);if(typeof s=="boolean")return s}return e}if(n==="object"){if(typeof e!="object"||Array.isArray(e))return e;const s=e,i=t.properties??{},a=t.additionalProperties&&typeof t.additionalProperties=="object"?t.additionalProperties:null,o={};for(const[r,c]of Object.entries(s)){const u=i[r]??a,p=u?ht(c,u):c;p!==void 0&&(o[r]=p)}return o}if(n==="array"){if(!Array.isArray(e))return e;if(Array.isArray(t.items)){const i=t.items;return e.map((a,o)=>{const r=o<i.length?i[o]:void 0;return r?ht(a,r):a})}const s=t.items;return s?e.map(i=>ht(i,s)).filter(i=>i!==void 0):e}return e}function Kt(e){return typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e))}function Hn(e){return`${JSON.stringify(e,null,2).trimEnd()}
`}function _l(e,t,n){if(t.length===0)return;let s=e;for(let a=0;a<t.length-1;a+=1){const o=t[a],r=t[a+1];if(typeof o=="number"){if(!Array.isArray(s))return;s[o]==null&&(s[o]=typeof r=="number"?[]:{}),s=s[o]}else{if(typeof s!="object"||s==null)return;const c=s;c[o]==null&&(c[o]=typeof r=="number"?[]:{}),s=c[o]}}const i=t[t.length-1];if(typeof i=="number"){Array.isArray(s)&&(s[i]=n);return}typeof s=="object"&&s!=null&&(s[i]=n)}function El(e,t){if(t.length===0)return;let n=e;for(let i=0;i<t.length-1;i+=1){const a=t[i];if(typeof a=="number"){if(!Array.isArray(n))return;n=n[a]}else{if(typeof n!="object"||n==null)return;n=n[a]}if(n==null)return}const s=t[t.length-1];if(typeof s=="number"){Array.isArray(n)&&n.splice(s,1);return}typeof n=="object"&&n!=null&&delete n[s]}async function ze(e){if(!(!e.client||!e.connected)){e.configLoading=!0,e.lastError=null;try{const t=await e.client.request("config.get",{});pu(e,t)}catch(t){e.lastError=String(t)}finally{e.configLoading=!1}}}async function Ml(e){if(!(!e.client||!e.connected)&&!e.configSchemaLoading){e.configSchemaLoading=!0;try{const t=await e.client.request("config.schema",{});gu(e,t)}catch(t){e.lastError=String(t)}finally{e.configSchemaLoading=!1}}}function gu(e,t){e.configSchema=t.schema??null,e.configUiHints=t.uiHints??{},e.configSchemaVersion=t.version??null}function pu(e,t){e.configSnapshot=t;const n=typeof t.raw=="string"?t.raw:t.config&&typeof t.config=="object"?Hn(t.config):e.configRaw;!e.configFormDirty||e.configFormMode==="raw"?e.configRaw=n:e.configForm?e.configRaw=Hn(e.configForm):e.configRaw=n,e.configValid=typeof t.valid=="boolean"?t.valid:null,e.configIssues=Array.isArray(t.issues)?t.issues:[],e.configFormDirty||(e.configForm=Kt(t.config??{}),e.configFormOriginal=Kt(t.config??{}),e.configRawOriginal=n)}function fu(e){return!e||typeof e!="object"||Array.isArray(e)?null:e}function Ll(e){if(e.configFormMode!=="form"||!e.configForm)return e.configRaw;const t=fu(e.configSchema),n=t?ht(e.configForm,t):e.configForm;return Hn(n)}async function ys(e){if(!(!e.client||!e.connected)){e.configSaving=!0,e.lastError=null;try{const t=Ll(e),n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.set",{raw:t,baseHash:n}),e.configFormDirty=!1,await ze(e)}catch(t){e.lastError=String(t)}finally{e.configSaving=!1}}}async function hu(e){if(!(!e.client||!e.connected)){e.configApplying=!0,e.lastError=null;try{const t=Ll(e),n=e.configSnapshot?.hash;if(!n){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.apply",{raw:t,baseHash:n,sessionKey:e.applySessionKey}),e.configFormDirty=!1,await ze(e)}catch(t){e.lastError=String(t)}finally{e.configApplying=!1}}}async function Qo(e){if(!(!e.client||!e.connected)){e.updateRunning=!0,e.lastError=null;try{await e.client.request("update.run",{sessionKey:e.applySessionKey})}catch(t){e.lastError=String(t)}finally{e.updateRunning=!1}}}function Me(e,t,n){const s=Kt(e.configForm??e.configSnapshot?.config??{});_l(s,t,n),e.configForm=s,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=Hn(s))}function tt(e,t){const n=Kt(e.configForm??e.configSnapshot?.config??{});El(n,t),e.configForm=n,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=Hn(n))}function vu(e){const{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function mu(e){const{state:t,callbacks:n,accountId:s}=e,i=vu(t),a=(r,c,u={})=>{const{type:p="text",placeholder:g,maxLength:d,help:h}=u,f=t.values[r]??"",m=t.fieldErrors[r],w=`nostr-profile-${r}`;return p==="textarea"?l`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${w}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${c}
          </label>
          <textarea
            id="${w}"
            .value=${f}
            placeholder=${g??""}
            maxlength=${d??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;"
            @input=${S=>{const A=S.target;n.onFieldChange(r,A.value)}}
            ?disabled=${t.saving}
          ></textarea>
          ${h?l`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${h}</div>`:v}
          ${m?l`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${m}</div>`:v}
        </div>
      `:l`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${w}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${c}
        </label>
        <input
          id="${w}"
          type=${p}
          .value=${f}
          placeholder=${g??""}
          maxlength=${d??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
          @input=${S=>{const A=S.target;n.onFieldChange(r,A.value)}}
          ?disabled=${t.saving}
        />
        ${h?l`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${h}</div>`:v}
        ${m?l`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${m}</div>`:v}
      </div>
    `},o=()=>{const r=t.values.picture;return r?l`
      <div style="margin-bottom: 12px;">
        <img
          src=${r}
          alt="Profile picture preview"
          style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
          @error=${c=>{const u=c.target;u.style.display="none"}}
          @load=${c=>{const u=c.target;u.style.display="block"}}
        />
      </div>
    `:v};return l`
    <div class="nostr-profile-form" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 16px;">Edit Profile</div>
        <div style="font-size: 12px; color: var(--text-muted);">Account: ${s}</div>
      </div>

      ${t.error?l`<div class="callout danger" style="margin-bottom: 12px;">${t.error}</div>`:v}

      ${t.success?l`<div class="callout success" style="margin-bottom: 12px;">${t.success}</div>`:v}

      ${o()}

      ${a("name","Username",{placeholder:"satoshi",maxLength:256,help:"Short username (e.g., satoshi)"})}

      ${a("displayName","Display Name",{placeholder:"Satoshi Nakamoto",maxLength:256,help:"Your full display name"})}

      ${a("about","Bio",{type:"textarea",placeholder:"Tell people about yourself...",maxLength:2e3,help:"A brief bio or description"})}

      ${a("picture","Avatar URL",{type:"url",placeholder:"https://example.com/avatar.jpg",help:"HTTPS URL to your profile picture"})}

      ${t.showAdvanced?l`
            <div style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
              <div style="font-weight: 500; margin-bottom: 12px; color: var(--text-muted);">Advanced</div>

              ${a("banner","Banner URL",{type:"url",placeholder:"https://example.com/banner.jpg",help:"HTTPS URL to a banner image"})}

              ${a("website","Website",{type:"url",placeholder:"https://example.com",help:"Your personal website"})}

              ${a("nip05","NIP-05 Identifier",{placeholder:"you@example.com",help:"Verifiable identifier (e.g., you@domain.com)"})}

              ${a("lud16","Lightning Address",{placeholder:"you@getalby.com",help:"Lightning address for tips (LUD-16)"})}
            </div>
          `:v}

      <div style="display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;">
        <button
          class="btn primary"
          @click=${n.onSave}
          ?disabled=${t.saving||!i}
        >
          ${t.saving?"Saving...":"Save & Publish"}
        </button>

        <button
          class="btn"
          @click=${n.onImport}
          ?disabled=${t.importing||t.saving}
        >
          ${t.importing?"Importing...":"Import from Relays"}
        </button>

        <button
          class="btn"
          @click=${n.onToggleAdvanced}
        >
          ${t.showAdvanced?"Hide Advanced":"Show Advanced"}
        </button>

        <button
          class="btn"
          @click=${n.onCancel}
          ?disabled=${t.saving}
        >
          Cancel
        </button>
      </div>

      ${i?l`
              <div style="font-size: 12px; color: var(--warning-color); margin-top: 8px">
                You have unsaved changes
              </div>
            `:v}
    </div>
  `}function bu(e){const t={name:e?.name??"",displayName:e?.displayName??"",about:e?.about??"",picture:e?.picture??"",banner:e?.banner??"",website:e?.website??"",nip05:e?.nip05??"",lud16:e?.lud16??""};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}async function yu(e,t){await cu(e,t),await _e(e,!0)}async function xu(e){await du(e),await _e(e,!0)}async function $u(e){await uu(e),await _e(e,!0)}async function wu(e){await ys(e),await ze(e),await _e(e,!0)}async function ku(e){await ze(e),await _e(e,!0)}function Su(e){if(!Array.isArray(e))return{};const t={};for(const n of e){if(typeof n!="string")continue;const[s,...i]=n.split(":");if(!s||i.length===0)continue;const a=s.trim(),o=i.join(":").trim();a&&o&&(t[a]=o)}return t}function Il(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function Rl(e,t=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}function Au(e){const t=e.hello?.auth?.deviceToken?.trim();if(t)return`Bearer ${t}`;const n=e.settings.token.trim();if(n)return`Bearer ${n}`;const s=e.password.trim();return s?`Bearer ${s}`:null}function Pl(e){const t=Au(e);return t?{Authorization:t}:{}}function Cu(e,t,n){e.nostrProfileAccountId=t,e.nostrProfileFormState=bu(n??void 0)}function Tu(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function _u(e,t,n){const s=e.nostrProfileFormState;s&&(e.nostrProfileFormState={...s,values:{...s.values,[t]:n},fieldErrors:{...s.fieldErrors,[t]:""}})}function Eu(e){const t=e.nostrProfileFormState;t&&(e.nostrProfileFormState={...t,showAdvanced:!t.showAdvanced})}async function Mu(e){const t=e.nostrProfileFormState;if(!t||t.saving)return;const n=Il(e);e.nostrProfileFormState={...t,saving:!0,error:null,success:null,fieldErrors:{}};try{const s=await fetch(Rl(n),{method:"PUT",headers:{"Content-Type":"application/json",...Pl(e)},body:JSON.stringify(t.values)}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const a=i?.error??`Profile update failed (${s.status})`;e.nostrProfileFormState={...t,saving:!1,error:a,success:null,fieldErrors:Su(i?.details)};return}if(!i.persisted){e.nostrProfileFormState={...t,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...t,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...t.values}},await _e(e,!0)}catch(s){e.nostrProfileFormState={...t,saving:!1,error:`Profile update failed: ${String(s)}`,success:null}}}async function Lu(e){const t=e.nostrProfileFormState;if(!t||t.importing)return;const n=Il(e);e.nostrProfileFormState={...t,importing:!0,error:null,success:null};try{const s=await fetch(Rl(n,"/import"),{method:"POST",headers:{"Content-Type":"application/json",...Pl(e)},body:JSON.stringify({autoMerge:!0})}),i=await s.json().catch(()=>null);if(!s.ok||i?.ok===!1||!i){const c=i?.error??`Profile import failed (${s.status})`;e.nostrProfileFormState={...t,importing:!1,error:c,success:null};return}const a=i.merged??i.imported??null,o=a?{...t.values,...a}:t.values,r=!!(o.banner||o.website||o.nip05||o.lud16);e.nostrProfileFormState={...t,importing:!1,values:o,error:null,success:i.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:r},i.saved&&await _e(e,!0)}catch(s){e.nostrProfileFormState={...t,importing:!1,error:`Profile import failed: ${String(s)}`,success:null}}}let $e=null,Et=null,En=null,Cs=null,at=null,Wt=null,wa=null,ka=null,Sa=null,Aa=null,it=null;const jn=[];let Mn=null,Kn=!1,qs=!1;const Iu=3;let Ln=0;const Ca=[];function Ru(){return Ln<Iu?(Ln++,Promise.resolve()):new Promise(e=>{Ca.push(()=>{Ln++,e()})})}function Pu(){Ln--;const e=Ca.shift();e&&e()}function Dl(){if(jn.length===0){Kn=!1,qs||(Ts({type:"tts_done"}),Wt?.("LISTENING"));return}Kn=!0;const e=jn.shift();if(!it)return;const t=it.createBufferSource();t.buffer=e,t.connect(it.destination),t.onended=()=>{Mn=null,Dl()},Mn=t,t.start()}function Du(e){jn.push(e),Kn||Dl()}async function Nu(e,t){try{const n=await t.request("tts.synthesize",{text:e,modelId:"eleven_turbo_v2_5"});if(!n?.audio||!it)return null;const s=atob(n.audio),i=new Uint8Array(s.length);for(let a=0;a<s.length;a++)i[a]=s.charCodeAt(a);return await it.decodeAudioData(i.buffer)}catch(n){return console.error("[chat-voice-tts] synthesis failed:",n),null}}function Nl(){$e&&($e.readyState===WebSocket.OPEN||$e.readyState===WebSocket.CONNECTING)||($e=new WebSocket("ws://localhost:8765"),$e.binaryType="arraybuffer",$e.onopen=()=>{console.log("[chat-voice-ws] connected"),at!=null&&(clearTimeout(at),at=null)},$e.onmessage=e=>{typeof e.data=="string"&&Ou(JSON.parse(e.data))},$e.onclose=()=>{console.log("[chat-voice-ws] disconnected"),$e=null,Fu()},$e.onerror=()=>$e?.close())}function Fu(){at==null&&(at=window.setTimeout(()=>{at=null,Nl()},3e3))}function Ts(e){$e?.readyState===WebSocket.OPEN&&$e.send(JSON.stringify(e))}function Ou(e){switch(e.type){case"state":{const t=e.state;t==="LISTENING"?Wt?.("LISTENING"):t==="PROCESSING"&&Wt?.("PROCESSING")}break;case"vad":ka?.(e.speaking);break;case"transcription":wa?.(e.text);break;case"response_delta":Sa?.(e.text);break;case"response_end":Aa?.(e.text);break;case"error":console.error("[chat-voice-server]",e.message);break}}async function Bu(){Et||(Et=new AudioContext({sampleRate:16e3}),await Et.audioWorklet.addModule("/audio-processor.js")),Et.state==="suspended"&&await Et.resume(),Cs=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0}});const e=Et.createMediaStreamSource(Cs);En=new AudioWorkletNode(Et,"audio-capture"),En.port.onmessage=t=>{$e?.readyState===WebSocket.OPEN&&$e.send(t.data)},e.connect(En)}function Fl(){En?.disconnect(),En=null,Cs?.getTracks().forEach(e=>e.stop()),Cs=null}function zu(e){Wt=e.onStateChange,wa=e.onTranscription,ka=e.onVad,Sa=e.onResponseDelta??null,Aa=e.onResponseEnd??null,Nl()}function Uu(){Wt=null,wa=null,ka=null,Sa=null,Aa=null,_s(),Fl(),at!=null&&(clearTimeout(at),at=null)}async function Hu(e){return e?(_s(),Fl(),Ts({type:"stop"}),!1):(it||(it=new AudioContext),it.state==="suspended"&&await it.resume(),await Bu(),Ts({type:"start"}),!0)}async function vi(e,t){if(e.trim()){Wt?.("SPEAKING"),await Ru();try{const n=await Nu(e,t);n&&Du(n)}finally{Pu()}}}function ju(){qs=!1,!Kn&&jn.length===0&&(Ts({type:"tts_done"}),Wt?.("LISTENING"))}function Ku(){qs=!0}function _s(){if(Mn){try{Mn.stop()}catch{}Mn=null}jn.length=0,Kn=!1,qs=!1,Ln=0,Ca.length=0}function Ol(e){const t=(e??"").trim();if(!t)return null;const n=t.split(":").filter(Boolean);if(n.length<3||n[0]!=="agent")return null;const s=n[1]?.trim(),i=n.slice(2).join(":");return!s||!i?null:{agentId:s,rest:i}}const Ui=450;function Qn(e,t=!1,n=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const s=()=>{const i=e.querySelector(".chat-thread");if(i){const a=getComputedStyle(i).overflowY;if(a==="auto"||a==="scroll"||i.scrollHeight-i.clientHeight>1)return i}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;const i=s();if(!i)return;const a=i.scrollHeight-i.scrollTop-i.clientHeight,o=t&&!e.chatHasAutoScrolled;if(!(o||e.chatUserNearBottom||a<Ui)){e.chatNewMessagesBelow=!0;return}o&&(e.chatHasAutoScrolled=!0);const c=n&&(typeof window>"u"||typeof window.matchMedia!="function"||!window.matchMedia("(prefers-reduced-motion: reduce)").matches),u=i.scrollHeight;typeof i.scrollTo=="function"?i.scrollTo({top:u,behavior:c?"smooth":"auto"}):i.scrollTop=u,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1;const p=o?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const g=s();if(!g)return;const d=g.scrollHeight-g.scrollTop-g.clientHeight;(o||e.chatUserNearBottom||d<Ui)&&(g.scrollTop=g.scrollHeight,e.chatUserNearBottom=!0)},p)})})}function Bl(e,t=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const n=e.querySelector(".log-stream");if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;(t||s<80)&&(n.scrollTop=n.scrollHeight)})})}function Wu(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.chatUserNearBottom=s<Ui,e.chatUserNearBottom&&(e.chatNewMessagesBelow=!1)}function Vu(e,t){const n=t.currentTarget;if(!n)return;const s=n.scrollHeight-n.scrollTop-n.clientHeight;e.logsAtBottom=s<80}function Yo(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1}function qu(e,t){if(e.length===0)return;const n=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),s=URL.createObjectURL(n),i=document.createElement("a"),a=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");i.href=s,i.download=`openclaw-logs-${t}-${a}.log`,i.click(),URL.revokeObjectURL(s)}function Gu(e){if(typeof ResizeObserver>"u")return;const t=e.querySelector(".topbar");if(!t)return;const n=()=>{const{height:s}=t.getBoundingClientRect();e.style.setProperty("--topbar-height",`${s}px`)};n(),e.topbarObserver=new ResizeObserver(()=>n()),e.topbarObserver.observe(t)}async function Gs(e){if(!(!e.client||!e.connected)&&!e.debugLoading){e.debugLoading=!0;try{const[t,n,s,i]=await Promise.all([e.client.request("status",{}),e.client.request("health",{}),e.client.request("models.list",{}),e.client.request("last-heartbeat",{})]);e.debugStatus=t,e.debugHealth=n;const a=s;e.debugModels=Array.isArray(a?.models)?a?.models:[],e.debugHeartbeat=i}catch(t){e.debugCallError=String(t)}finally{e.debugLoading=!1}}}async function Qu(e){if(!(!e.client||!e.connected)){e.debugCallError=null,e.debugCallResult=null;try{const t=e.debugCallParams.trim()?JSON.parse(e.debugCallParams):{},n=await e.client.request(e.debugCallMethod.trim(),t);e.debugCallResult=JSON.stringify(n,null,2)}catch(t){e.debugCallError=String(t)}}}const Yu=2e3,Zu=new Set(["trace","debug","info","warn","error","fatal"]);function Ju(e){if(typeof e!="string")return null;const t=e.trim();if(!t.startsWith("{")||!t.endsWith("}"))return null;try{const n=JSON.parse(t);return!n||typeof n!="object"?null:n}catch{return null}}function Xu(e){if(typeof e!="string")return null;const t=e.toLowerCase();return Zu.has(t)?t:null}function eg(e){if(!e.trim())return{raw:e,message:e};try{const t=JSON.parse(e),n=t&&typeof t._meta=="object"&&t._meta!==null?t._meta:null,s=typeof t.time=="string"?t.time:typeof n?.date=="string"?n?.date:null,i=Xu(n?.logLevelName??n?.level),a=typeof t[0]=="string"?t[0]:typeof n?.name=="string"?n?.name:null,o=Ju(a);let r=null;o&&(typeof o.subsystem=="string"?r=o.subsystem:typeof o.module=="string"&&(r=o.module)),!r&&a&&a.length<120&&(r=a);let c=null;return typeof t[1]=="string"?c=t[1]:!o&&typeof t[0]=="string"?c=t[0]:typeof t.message=="string"&&(c=t.message),{raw:e,time:s,level:i,subsystem:r,message:c??e,meta:n??void 0}}catch{return{raw:e,message:e}}}async function Ta(e,t){if(!(!e.client||!e.connected)&&!(e.logsLoading&&!t?.quiet)){t?.quiet||(e.logsLoading=!0),e.logsError=null;try{const s=await e.client.request("logs.tail",{cursor:t?.reset?void 0:e.logsCursor??void 0,limit:e.logsLimit,maxBytes:e.logsMaxBytes}),a=(Array.isArray(s.lines)?s.lines.filter(r=>typeof r=="string"):[]).map(eg),o=!!(t?.reset||s.reset||e.logsCursor==null);e.logsEntries=o?a:[...e.logsEntries,...a].slice(-Yu),typeof s.cursor=="number"&&(e.logsCursor=s.cursor),typeof s.file=="string"&&(e.logsFile=s.file),e.logsTruncated=!!s.truncated,e.logsLastFetchAt=Date.now()}catch(n){e.logsError=String(n)}finally{t?.quiet||(e.logsLoading=!1)}}}async function Qs(e,t){if(!(!e.client||!e.connected)&&!e.nodesLoading){e.nodesLoading=!0,t?.quiet||(e.lastError=null);try{const n=await e.client.request("node.list",{});e.nodes=Array.isArray(n.nodes)?n.nodes:[]}catch(n){t?.quiet||(e.lastError=String(n))}finally{e.nodesLoading=!1}}}function tg(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{Qs(e,{quiet:!0})},5e3))}function ng(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function _a(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&Ta(e,{quiet:!0})},2e3))}function Ea(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function Ma(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&Gs(e)},3e3))}function La(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}async function zl(e,t){if(!(!e.client||!e.connected||e.agentIdentityLoading)&&!e.agentIdentityById[t]){e.agentIdentityLoading=!0,e.agentIdentityError=null;try{const n=await e.client.request("agent.identity.get",{agentId:t});n&&(e.agentIdentityById={...e.agentIdentityById,[t]:n})}catch(n){e.agentIdentityError=String(n)}finally{e.agentIdentityLoading=!1}}}async function Ul(e,t){if(!e.client||!e.connected||e.agentIdentityLoading)return;const n=t.filter(s=>!e.agentIdentityById[s]);if(n.length!==0){e.agentIdentityLoading=!0,e.agentIdentityError=null;try{for(const s of n){const i=await e.client.request("agent.identity.get",{agentId:s});i&&(e.agentIdentityById={...e.agentIdentityById,[s]:i})}}catch(s){e.agentIdentityError=String(s)}finally{e.agentIdentityLoading=!1}}}async function xs(e,t){if(!(!e.client||!e.connected)&&!e.agentSkillsLoading){e.agentSkillsLoading=!0,e.agentSkillsError=null;try{const n=await e.client.request("skills.status",{agentId:t});n&&(e.agentSkillsReport=n,e.agentSkillsAgentId=t)}catch(n){e.agentSkillsError=String(n)}finally{e.agentSkillsLoading=!1}}}async function Ia(e){if(!(!e.client||!e.connected)&&!e.agentsLoading){e.agentsLoading=!0,e.agentsError=null;try{const t=await e.client.request("agents.list",{});if(t){e.agentsList=t;const n=e.agentsSelectedId,s=t.agents.some(i=>i.id===n);(!n||!s)&&(e.agentsSelectedId=t.defaultId??t.agents[0]?.id??null)}}catch(t){e.agentsError=String(t)}finally{e.agentsLoading=!1}}}function Ra(e,t){if(e==null||!Number.isFinite(e)||e<=0)return;if(e<1e3)return`${Math.round(e)}ms`;const n=t?.spaced?" ":"",s=Math.round(e/1e3),i=Math.floor(s/3600),a=Math.floor(s%3600/60),o=s%60;if(i>=24){const r=Math.floor(i/24),c=i%24;return c>0?`${r}d${n}${c}h`:`${r}d`}return i>0?a>0?`${i}h${n}${a}m`:`${i}h`:a>0?o>0?`${a}m${n}${o}s`:`${a}m`:`${o}s`}function Pa(e,t="n/a"){if(e==null||!Number.isFinite(e)||e<0)return t;if(e<1e3)return`${Math.round(e)}ms`;const n=Math.round(e/1e3);if(n<60)return`${n}s`;const s=Math.round(n/60);if(s<60)return`${s}m`;const i=Math.round(s/60);return i<24?`${i}h`:`${Math.round(i/24)}d`}function J(e,t){const n=t?.fallback??"n/a";if(e==null||!Number.isFinite(e))return n;const s=Date.now()-e,i=Math.abs(s),a=s>=0,o=Math.round(i/1e3);if(o<60)return a?"just now":"in <1m";const r=Math.round(o/60);if(r<60)return a?`${r}m ago`:`in ${r}m`;const c=Math.round(r/60);if(c<48)return a?`${c}h ago`:`in ${c}h`;const u=Math.round(c/24);return a?`${u}d ago`:`in ${u}d`}const sg=/<\s*\/?\s*(?:think(?:ing)?|thought|antthinking|final)\b/i,is=/<\s*\/?\s*final\b[^<>]*>/gi,Zo=/<\s*(\/?)\s*(?:think(?:ing)?|thought|antthinking)\b[^<>]*>/gi;function Jo(e){const t=[],n=/(^|\n)(```|~~~)[^\n]*\n[\s\S]*?(?:\n\2(?:\n|$)|$)/g;for(const i of e.matchAll(n)){const a=(i.index??0)+i[1].length;t.push({start:a,end:a+i[0].length-i[1].length})}const s=/`+[^`]+`+/g;for(const i of e.matchAll(s)){const a=i.index??0,o=a+i[0].length;t.some(c=>a>=c.start&&o<=c.end)||t.push({start:a,end:o})}return t.sort((i,a)=>i.start-a.start),t}function Xo(e,t){return t.some(n=>e>=n.start&&e<n.end)}function ig(e,t){return e.trimStart()}function ag(e,t){if(!e||!sg.test(e))return e;let n=e;if(is.test(n)){is.lastIndex=0;const r=[],c=Jo(n);for(const u of n.matchAll(is)){const p=u.index??0;r.push({start:p,length:u[0].length,inCode:Xo(p,c)})}for(let u=r.length-1;u>=0;u--){const p=r[u];p.inCode||(n=n.slice(0,p.start)+n.slice(p.start+p.length))}}else is.lastIndex=0;const s=Jo(n);Zo.lastIndex=0;let i="",a=0,o=!1;for(const r of n.matchAll(Zo)){const c=r.index??0,u=r[1]==="/";Xo(c,s)||(o?u&&(o=!1):(i+=n.slice(a,c),u||(o=!0)),a=c+r[0].length)}return i+=n.slice(a),ig(i)}function Vt(e){return!e&&e!==0?"n/a":new Date(e).toLocaleString()}function Hi(e){return!e||e.length===0?"none":e.filter(t=>!!(t&&t.trim())).join(", ")}function ji(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1))}…`}function Hl(e,t){return e.length<=t?{text:e,truncated:!1,total:e.length}:{text:e.slice(0,Math.max(0,t)),truncated:!0,total:e.length}}function Es(e,t){const n=Number(e);return Number.isFinite(n)?n:t}function mi(e){return ag(e)}function og(e){return e.sessionTarget==="isolated"&&e.payloadKind==="agentTurn"}function jl(e){return e.deliveryMode!=="announce"||og(e)?e:{...e,deliveryMode:"none"}}async function Yn(e){if(!(!e.client||!e.connected))try{const t=await e.client.request("cron.status",{});e.cronStatus=t}catch(t){e.cronError=String(t)}}async function Ys(e){if(!(!e.client||!e.connected)&&!e.cronLoading){e.cronLoading=!0,e.cronError=null;try{const t=await e.client.request("cron.list",{includeDisabled:!0});e.cronJobs=Array.isArray(t.jobs)?t.jobs:[]}catch(t){e.cronError=String(t)}finally{e.cronLoading=!1}}}function rg(e){if(e.scheduleKind==="at"){const n=Date.parse(e.scheduleAt);if(!Number.isFinite(n))throw new Error("Invalid run time.");return{kind:"at",at:new Date(n).toISOString()}}if(e.scheduleKind==="every"){const n=Es(e.everyAmount,0);if(n<=0)throw new Error("Invalid interval amount.");const s=e.everyUnit;return{kind:"every",everyMs:n*(s==="minutes"?6e4:s==="hours"?36e5:864e5)}}const t=e.cronExpr.trim();if(!t)throw new Error("Cron expression required.");return{kind:"cron",expr:t,tz:e.cronTz.trim()||void 0}}function lg(e){if(e.payloadKind==="systemEvent"){const i=e.payloadText.trim();if(!i)throw new Error("System event text required.");return{kind:"systemEvent",text:i}}const t=e.payloadText.trim();if(!t)throw new Error("Agent message required.");const n={kind:"agentTurn",message:t},s=Es(e.timeoutSeconds,0);return s>0&&(n.timeoutSeconds=s),n}async function cg(e){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{const t=jl(e.cronForm);t!==e.cronForm&&(e.cronForm=t);const n=rg(t),s=lg(t),i=t.deliveryMode,a=i&&i!=="none"?{mode:i,channel:i==="announce"?t.deliveryChannel.trim()||"last":void 0,to:t.deliveryTo.trim()||void 0}:void 0,o=t.agentId.trim(),r={name:t.name.trim(),description:t.description.trim()||void 0,agentId:o||void 0,enabled:t.enabled,schedule:n,sessionTarget:t.sessionTarget,wakeMode:t.wakeMode,payload:s,delivery:a};if(!r.name)throw new Error("Name required.");await e.client.request("cron.add",r),e.cronForm={...e.cronForm,name:"",description:"",payloadText:""},await Ys(e),await Yn(e)}catch(t){e.cronError=String(t)}finally{e.cronBusy=!1}}}async function dg(e,t,n){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.update",{id:t.id,patch:{enabled:n}}),await Ys(e),await Yn(e)}catch(s){e.cronError=String(s)}finally{e.cronBusy=!1}}}async function ug(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.run",{id:t.id,mode:"force"}),await Kl(e,t.id)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function gg(e,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.remove",{id:t.id}),e.cronRunsJobId===t.id&&(e.cronRunsJobId=null,e.cronRuns=[]),await Ys(e),await Yn(e)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function Kl(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("cron.runs",{id:t,limit:50});e.cronRunsJobId=t,e.cronRuns=Array.isArray(n.entries)?n.entries:[]}catch(n){e.cronError=String(n)}}function Da(e){return e.trim()}function pg(e){if(!Array.isArray(e))return[];const t=new Set;for(const n of e){const s=n.trim();s&&t.add(s)}return[...t].toSorted()}const Wl="openclaw.device.auth.v1";function Na(){try{const e=window.localStorage.getItem(Wl);if(!e)return null;const t=JSON.parse(e);return!t||t.version!==1||!t.deviceId||typeof t.deviceId!="string"||!t.tokens||typeof t.tokens!="object"?null:t}catch{return null}}function Vl(e){try{window.localStorage.setItem(Wl,JSON.stringify(e))}catch{}}function fg(e){const t=Na();if(!t||t.deviceId!==e.deviceId)return null;const n=Da(e.role),s=t.tokens[n];return!s||typeof s.token!="string"?null:s}function ql(e){const t=Da(e.role),n={version:1,deviceId:e.deviceId,tokens:{}},s=Na();s&&s.deviceId===e.deviceId&&(n.tokens={...s.tokens});const i={token:e.token,role:t,scopes:pg(e.scopes),updatedAtMs:Date.now()};return n.tokens[t]=i,Vl(n),i}function Gl(e){const t=Na();if(!t||t.deviceId!==e.deviceId)return;const n=Da(e.role);if(!t.tokens[n])return;const s={...t,tokens:{...t.tokens}};delete s.tokens[n],Vl(s)}const Ql={p:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,n:0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,h:8n,a:0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,d:0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,Gx:0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,Gy:0x6666666666666666666666666666666666666666666666666666666666666658n},{p:ye,n:$s,Gx:er,Gy:tr,a:bi,d:yi,h:hg}=Ql,qt=32,Fa=64,vg=(...e)=>{"captureStackTrace"in Error&&typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(...e)},pe=(e="")=>{const t=new Error(e);throw vg(t,pe),t},mg=e=>typeof e=="bigint",bg=e=>typeof e=="string",yg=e=>e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array",kt=(e,t,n="")=>{const s=yg(e),i=e?.length,a=t!==void 0;if(!s||a&&i!==t){const o=n&&`"${n}" `,r=a?` of length ${t}`:"",c=s?`length=${i}`:`type=${typeof e}`;pe(o+"expected Uint8Array"+r+", got "+c)}return e},Zs=e=>new Uint8Array(e),Yl=e=>Uint8Array.from(e),Zl=(e,t)=>e.toString(16).padStart(t,"0"),Jl=e=>Array.from(kt(e)).map(t=>Zl(t,2)).join(""),nt={_0:48,_9:57,A:65,F:70,a:97,f:102},nr=e=>{if(e>=nt._0&&e<=nt._9)return e-nt._0;if(e>=nt.A&&e<=nt.F)return e-(nt.A-10);if(e>=nt.a&&e<=nt.f)return e-(nt.a-10)},Xl=e=>{const t="hex invalid";if(!bg(e))return pe(t);const n=e.length,s=n/2;if(n%2)return pe(t);const i=Zs(s);for(let a=0,o=0;a<s;a++,o+=2){const r=nr(e.charCodeAt(o)),c=nr(e.charCodeAt(o+1));if(r===void 0||c===void 0)return pe(t);i[a]=r*16+c}return i},ec=()=>globalThis?.crypto,xg=()=>ec()?.subtle??pe("crypto.subtle must be defined, consider polyfill"),Wn=(...e)=>{const t=Zs(e.reduce((s,i)=>s+kt(i).length,0));let n=0;return e.forEach(s=>{t.set(s,n),n+=s.length}),t},$g=(e=qt)=>ec().getRandomValues(Zs(e)),Ms=BigInt,Dt=(e,t,n,s="bad number: out of range")=>mg(e)&&t<=e&&e<n?e:pe(s),F=(e,t=ye)=>{const n=e%t;return n>=0n?n:t+n},tc=e=>F(e,$s),wg=(e,t)=>{(e===0n||t<=0n)&&pe("no inverse n="+e+" mod="+t);let n=F(e,t),s=t,i=0n,a=1n;for(;n!==0n;){const o=s/n,r=s%n,c=i-a*o;s=n,n=r,i=a,a=c}return s===1n?F(i,t):pe("no inverse")},kg=e=>{const t=ac[e];return typeof t!="function"&&pe("hashes."+e+" not set"),t},xi=e=>e instanceof Re?e:pe("Point expected"),Ki=2n**256n;class Re{static BASE;static ZERO;X;Y;Z;T;constructor(t,n,s,i){const a=Ki;this.X=Dt(t,0n,a),this.Y=Dt(n,0n,a),this.Z=Dt(s,1n,a),this.T=Dt(i,0n,a),Object.freeze(this)}static CURVE(){return Ql}static fromAffine(t){return new Re(t.x,t.y,1n,F(t.x*t.y))}static fromBytes(t,n=!1){const s=yi,i=Yl(kt(t,qt)),a=t[31];i[31]=a&-129;const o=sc(i);Dt(o,0n,n?Ki:ye);const c=F(o*o),u=F(c-1n),p=F(s*c+1n);let{isValid:g,value:d}=Ag(u,p);g||pe("bad point: y not sqrt");const h=(d&1n)===1n,f=(a&128)!==0;return!n&&d===0n&&f&&pe("bad point: x==0, isLastByteOdd"),f!==h&&(d=F(-d)),new Re(d,o,1n,F(d*o))}static fromHex(t,n){return Re.fromBytes(Xl(t),n)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}assertValidity(){const t=bi,n=yi,s=this;if(s.is0())return pe("bad point: ZERO");const{X:i,Y:a,Z:o,T:r}=s,c=F(i*i),u=F(a*a),p=F(o*o),g=F(p*p),d=F(c*t),h=F(p*F(d+u)),f=F(g+F(n*F(c*u)));if(h!==f)return pe("bad point: equation left != right (1)");const m=F(i*a),w=F(o*r);return m!==w?pe("bad point: equation left != right (2)"):this}equals(t){const{X:n,Y:s,Z:i}=this,{X:a,Y:o,Z:r}=xi(t),c=F(n*r),u=F(a*i),p=F(s*r),g=F(o*i);return c===u&&p===g}is0(){return this.equals(rn)}negate(){return new Re(F(-this.X),this.Y,this.Z,F(-this.T))}double(){const{X:t,Y:n,Z:s}=this,i=bi,a=F(t*t),o=F(n*n),r=F(2n*F(s*s)),c=F(i*a),u=t+n,p=F(F(u*u)-a-o),g=c+o,d=g-r,h=c-o,f=F(p*d),m=F(g*h),w=F(p*h),S=F(d*g);return new Re(f,m,S,w)}add(t){const{X:n,Y:s,Z:i,T:a}=this,{X:o,Y:r,Z:c,T:u}=xi(t),p=bi,g=yi,d=F(n*o),h=F(s*r),f=F(a*g*u),m=F(i*c),w=F((n+s)*(o+r)-d-h),S=F(m-f),A=F(m+f),k=F(h-p*d),C=F(w*S),_=F(A*k),T=F(w*k),M=F(S*A);return new Re(C,_,M,T)}subtract(t){return this.add(xi(t).negate())}multiply(t,n=!0){if(!n&&(t===0n||this.is0()))return rn;if(Dt(t,1n,$s),t===1n)return this;if(this.equals(Gt))return Ng(t).p;let s=rn,i=Gt;for(let a=this;t>0n;a=a.double(),t>>=1n)t&1n?s=s.add(a):n&&(i=i.add(a));return s}multiplyUnsafe(t){return this.multiply(t,!1)}toAffine(){const{X:t,Y:n,Z:s}=this;if(this.equals(rn))return{x:0n,y:1n};const i=wg(s,ye);F(s*i)!==1n&&pe("invalid inverse");const a=F(t*i),o=F(n*i);return{x:a,y:o}}toBytes(){const{x:t,y:n}=this.assertValidity().toAffine(),s=nc(n);return s[31]|=t&1n?128:0,s}toHex(){return Jl(this.toBytes())}clearCofactor(){return this.multiply(Ms(hg),!1)}isSmallOrder(){return this.clearCofactor().is0()}isTorsionFree(){let t=this.multiply($s/2n,!1).double();return $s%2n&&(t=t.add(this)),t.is0()}}const Gt=new Re(er,tr,1n,F(er*tr)),rn=new Re(0n,1n,1n,0n);Re.BASE=Gt;Re.ZERO=rn;const nc=e=>Xl(Zl(Dt(e,0n,Ki),Fa)).reverse(),sc=e=>Ms("0x"+Jl(Yl(kt(e)).reverse())),Ke=(e,t)=>{let n=e;for(;t-- >0n;)n*=n,n%=ye;return n},Sg=e=>{const n=e*e%ye*e%ye,s=Ke(n,2n)*n%ye,i=Ke(s,1n)*e%ye,a=Ke(i,5n)*i%ye,o=Ke(a,10n)*a%ye,r=Ke(o,20n)*o%ye,c=Ke(r,40n)*r%ye,u=Ke(c,80n)*c%ye,p=Ke(u,80n)*c%ye,g=Ke(p,10n)*a%ye;return{pow_p_5_8:Ke(g,2n)*e%ye,b2:n}},sr=0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n,Ag=(e,t)=>{const n=F(t*t*t),s=F(n*n*t),i=Sg(e*s).pow_p_5_8;let a=F(e*n*i);const o=F(t*a*a),r=a,c=F(a*sr),u=o===e,p=o===F(-e),g=o===F(-e*sr);return u&&(a=r),(p||g)&&(a=c),(F(a)&1n)===1n&&(a=F(-a)),{isValid:u||p,value:a}},Wi=e=>tc(sc(e)),Oa=(...e)=>ac.sha512Async(Wn(...e)),Cg=(...e)=>kg("sha512")(Wn(...e)),ic=e=>{const t=e.slice(0,qt);t[0]&=248,t[31]&=127,t[31]|=64;const n=e.slice(qt,Fa),s=Wi(t),i=Gt.multiply(s),a=i.toBytes();return{head:t,prefix:n,scalar:s,point:i,pointBytes:a}},Ba=e=>Oa(kt(e,qt)).then(ic),Tg=e=>ic(Cg(kt(e,qt))),_g=e=>Ba(e).then(t=>t.pointBytes),Eg=e=>Oa(e.hashable).then(e.finish),Mg=(e,t,n)=>{const{pointBytes:s,scalar:i}=e,a=Wi(t),o=Gt.multiply(a).toBytes();return{hashable:Wn(o,s,n),finish:u=>{const p=tc(a+Wi(u)*i);return kt(Wn(o,nc(p)),Fa)}}},Lg=async(e,t)=>{const n=kt(e),s=await Ba(t),i=await Oa(s.prefix,n);return Eg(Mg(s,i,n))},ac={sha512Async:async e=>{const t=xg(),n=Wn(e);return Zs(await t.digest("SHA-512",n.buffer))},sha512:void 0},Ig=(e=$g(qt))=>e,Rg={getExtendedPublicKeyAsync:Ba,getExtendedPublicKey:Tg,randomSecretKey:Ig},Ls=8,Pg=256,oc=Math.ceil(Pg/Ls)+1,Vi=2**(Ls-1),Dg=()=>{const e=[];let t=Gt,n=t;for(let s=0;s<oc;s++){n=t,e.push(n);for(let i=1;i<Vi;i++)n=n.add(t),e.push(n);t=n.double()}return e};let ir;const ar=(e,t)=>{const n=t.negate();return e?n:t},Ng=e=>{const t=ir||(ir=Dg());let n=rn,s=Gt;const i=2**Ls,a=i,o=Ms(i-1),r=Ms(Ls);for(let c=0;c<oc;c++){let u=Number(e&o);e>>=r,u>Vi&&(u-=a,e+=1n);const p=c*Vi,g=p,d=p+Math.abs(u)-1,h=c%2!==0,f=u<0;u===0?s=s.add(ar(h,t[g])):n=n.add(ar(f,t[d]))}return e!==0n&&pe("invalid wnaf"),{p:n,f:s}},$i="openclaw-device-identity-v1";function qi(e){let t="";for(const n of e)t+=String.fromCharCode(n);return btoa(t).replaceAll("+","-").replaceAll("/","_").replace(/=+$/g,"")}function rc(e){const t=e.replaceAll("-","+").replaceAll("_","/"),n=t+"=".repeat((4-t.length%4)%4),s=atob(n),i=new Uint8Array(s.length);for(let a=0;a<s.length;a+=1)i[a]=s.charCodeAt(a);return i}function Fg(e){return Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}async function lc(e){const t=await crypto.subtle.digest("SHA-256",e.slice().buffer);return Fg(new Uint8Array(t))}async function Og(){const e=Rg.randomSecretKey(),t=await _g(e);return{deviceId:await lc(t),publicKey:qi(t),privateKey:qi(e)}}async function za(){try{const n=localStorage.getItem($i);if(n){const s=JSON.parse(n);if(s?.version===1&&typeof s.deviceId=="string"&&typeof s.publicKey=="string"&&typeof s.privateKey=="string"){const i=await lc(rc(s.publicKey));if(i!==s.deviceId){const a={...s,deviceId:i};return localStorage.setItem($i,JSON.stringify(a)),{deviceId:i,publicKey:s.publicKey,privateKey:s.privateKey}}return{deviceId:s.deviceId,publicKey:s.publicKey,privateKey:s.privateKey}}}}catch{}const e=await Og(),t={version:1,deviceId:e.deviceId,publicKey:e.publicKey,privateKey:e.privateKey,createdAtMs:Date.now()};return localStorage.setItem($i,JSON.stringify(t)),e}async function Bg(e,t){const n=rc(e),s=new TextEncoder().encode(t),i=await Lg(s,n);return qi(i)}async function St(e,t){if(!(!e.client||!e.connected)&&!e.devicesLoading){e.devicesLoading=!0,t?.quiet||(e.devicesError=null);try{const n=await e.client.request("device.pair.list",{});e.devicesList={pending:Array.isArray(n?.pending)?n.pending:[],paired:Array.isArray(n?.paired)?n.paired:[]}}catch(n){t?.quiet||(e.devicesError=String(n))}finally{e.devicesLoading=!1}}}async function zg(e,t){if(!(!e.client||!e.connected))try{await e.client.request("device.pair.approve",{requestId:t}),await St(e)}catch(n){e.devicesError=String(n)}}async function Ug(e,t){if(!(!e.client||!e.connected||!window.confirm("Reject this device pairing request?")))try{await e.client.request("device.pair.reject",{requestId:t}),await St(e)}catch(s){e.devicesError=String(s)}}async function Hg(e,t){if(!(!e.client||!e.connected))try{const n=await e.client.request("device.token.rotate",t);if(n?.token){const s=await za(),i=n.role??t.role;(n.deviceId===s.deviceId||t.deviceId===s.deviceId)&&ql({deviceId:s.deviceId,role:i,token:n.token,scopes:n.scopes??t.scopes??[]}),window.prompt("New device token (copy and store securely):",n.token)}await St(e)}catch(n){e.devicesError=String(n)}}async function jg(e,t){if(!(!e.client||!e.connected||!window.confirm(`Revoke token for ${t.deviceId} (${t.role})?`)))try{await e.client.request("device.token.revoke",t);const s=await za();t.deviceId===s.deviceId&&Gl({deviceId:s.deviceId,role:t.role}),await St(e)}catch(s){e.devicesError=String(s)}}function Kg(e){if(!e||e.kind==="gateway")return{method:"exec.approvals.get",params:{}};const t=e.nodeId.trim();return t?{method:"exec.approvals.node.get",params:{nodeId:t}}:null}function Wg(e,t){if(!e||e.kind==="gateway")return{method:"exec.approvals.set",params:t};const n=e.nodeId.trim();return n?{method:"exec.approvals.node.set",params:{...t,nodeId:n}}:null}async function Ua(e,t){if(!(!e.client||!e.connected)&&!e.execApprovalsLoading){e.execApprovalsLoading=!0,e.lastError=null;try{const n=Kg(t);if(!n){e.lastError="Select a node before loading exec approvals.";return}const s=await e.client.request(n.method,n.params);Vg(e,s)}catch(n){e.lastError=String(n)}finally{e.execApprovalsLoading=!1}}}function Vg(e,t){e.execApprovalsSnapshot=t,e.execApprovalsDirty||(e.execApprovalsForm=Kt(t.file??{}))}async function qg(e,t){if(!(!e.client||!e.connected)){e.execApprovalsSaving=!0,e.lastError=null;try{const n=e.execApprovalsSnapshot?.hash;if(!n){e.lastError="Exec approvals hash missing; reload and retry.";return}const s=e.execApprovalsForm??e.execApprovalsSnapshot?.file??{},i=Wg(t,{file:s,baseHash:n});if(!i){e.lastError="Select a node before saving exec approvals.";return}await e.client.request(i.method,i.params),e.execApprovalsDirty=!1,await Ua(e,t)}catch(n){e.lastError=String(n)}finally{e.execApprovalsSaving=!1}}}function Gg(e,t,n){const s=Kt(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});_l(s,t,n),e.execApprovalsForm=s,e.execApprovalsDirty=!0}function Qg(e,t){const n=Kt(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});El(n,t),e.execApprovalsForm=n,e.execApprovalsDirty=!0}async function Ha(e){if(!(!e.client||!e.connected)&&!e.presenceLoading){e.presenceLoading=!0,e.presenceError=null,e.presenceStatus=null;try{const t=await e.client.request("system-presence",{});Array.isArray(t)?(e.presenceEntries=t,e.presenceStatus=t.length===0?"No instances yet.":null):(e.presenceEntries=[],e.presenceStatus="No presence payload.")}catch(t){e.presenceError=String(t)}finally{e.presenceLoading=!1}}}async function Yt(e,t){if(!(!e.client||!e.connected)&&!e.sessionsLoading){e.sessionsLoading=!0,e.sessionsError=null;try{const n=t?.includeGlobal??e.sessionsIncludeGlobal,s=t?.includeUnknown??e.sessionsIncludeUnknown,i=t?.activeMinutes??Es(e.sessionsFilterActive,0),a=t?.limit??Es(e.sessionsFilterLimit,0),o={includeGlobal:n,includeUnknown:s};i>0&&(o.activeMinutes=i),a>0&&(o.limit=a);const r=await e.client.request("sessions.list",o);r&&(e.sessionsResult=r)}catch(n){e.sessionsError=String(n)}finally{e.sessionsLoading=!1}}}async function Yg(e,t,n){if(!e.client||!e.connected)return;const s={key:t};"label"in n&&(s.label=n.label),"thinkingLevel"in n&&(s.thinkingLevel=n.thinkingLevel),"verboseLevel"in n&&(s.verboseLevel=n.verboseLevel),"reasoningLevel"in n&&(s.reasoningLevel=n.reasoningLevel);try{await e.client.request("sessions.patch",s),await Yt(e)}catch(i){e.sessionsError=String(i)}}async function Zg(e,t){if(!e.client||!e.connected||e.sessionsLoading||!window.confirm(`Delete session "${t}"?

Deletes the session entry and archives its transcript.`))return!1;e.sessionsLoading=!0,e.sessionsError=null;try{return await e.client.request("sessions.delete",{key:t,deleteTranscript:!0}),!0}catch(s){return e.sessionsError=String(s),!1}finally{e.sessionsLoading=!1}}async function Jg(e,t){return await Zg(e,t)?(await Yt(e),!0):!1}function un(e,t,n){if(!t.trim())return;const s={...e.skillMessages};n?s[t]=n:delete s[t],e.skillMessages=s}function Js(e){return e instanceof Error?e.message:String(e)}async function Zn(e,t){if(t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={}),!(!e.client||!e.connected)&&!e.skillsLoading){e.skillsLoading=!0,e.skillsError=null;try{const n=await e.client.request("skills.status",{});n&&(e.skillsReport=n)}catch(n){e.skillsError=Js(n)}finally{e.skillsLoading=!1}}}function Xg(e,t,n){e.skillEdits={...e.skillEdits,[t]:n}}async function ep(e,t,n){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{await e.client.request("skills.update",{skillKey:t,enabled:n}),await Zn(e),un(e,t,{kind:"success",message:n?"Skill enabled":"Skill disabled"})}catch(s){const i=Js(s);e.skillsError=i,un(e,t,{kind:"error",message:i})}finally{e.skillsBusyKey=null}}}async function tp(e,t){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const n=e.skillEdits[t]??"";await e.client.request("skills.update",{skillKey:t,apiKey:n}),await Zn(e),un(e,t,{kind:"success",message:"API key saved"})}catch(n){const s=Js(n);e.skillsError=s,un(e,t,{kind:"error",message:s})}finally{e.skillsBusyKey=null}}}async function np(e,t,n,s){if(!(!e.client||!e.connected)){e.skillsBusyKey=t,e.skillsError=null;try{const i=await e.client.request("skills.install",{name:n,installId:s,timeoutMs:12e4});await Zn(e),un(e,t,{kind:"success",message:i?.message??"Installed"})}catch(i){const a=Js(i);e.skillsError=a,un(e,t,{kind:"error",message:a})}finally{e.skillsBusyKey=null}}}const cc={tabs:["chat","mind","voice"]},sp=[{label:"goals",tabs:["goals","activity"]},{label:"control",tabs:["overview","channels","instances","sessions","usage","cron"]},{label:"agent",tabs:["agents","skills","nodes"]},{label:"settings",tabs:["config","debug","logs"]}],ip=new Set(cc.tabs);function ap(e){return!ip.has(e)}const dc={goals:"/goals",activity:"/activity",agents:"/agents",overview:"/overview",channels:"/channels",instances:"/instances",sessions:"/sessions",usage:"/usage",cron:"/cron",skills:"/skills",nodes:"/nodes",chat:"/chat",mind:"/mind",voice:"/voice",config:"/config",debug:"/debug",logs:"/logs"},uc=new Map(Object.entries(dc).map(([e,t])=>[t,e]));function Jn(e){if(!e)return"";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t==="/"?"":(t.endsWith("/")&&(t=t.slice(0,-1)),t)}function Vn(e){if(!e)return"/";let t=e.trim();return t.startsWith("/")||(t=`/${t}`),t.length>1&&t.endsWith("/")&&(t=t.slice(0,-1)),t}function Xs(e,t=""){const n=Jn(t),s=dc[e];return n?`${n}${s}`:s}function gc(e,t=""){const n=Jn(t);let s=e||"/";n&&(s===n?s="/":s.startsWith(`${n}/`)&&(s=s.slice(n.length)));let i=Vn(s).toLowerCase();return i.endsWith("/index.html")&&(i="/"),i==="/"?"chat":uc.get(i)??null}function op(e){let t=Vn(e);if(t.endsWith("/index.html")&&(t=Vn(t.slice(0,-11))),t==="/")return"";const n=t.split("/").filter(Boolean);if(n.length===0)return"";for(let s=0;s<n.length;s++){const i=`/${n.slice(s).join("/")}`.toLowerCase();if(uc.has(i)){const a=n.slice(0,s);return a.length?`/${a.join("/")}`:""}}return`/${n.join("/")}`}function rp(e){switch(e){case"goals":return"flag";case"activity":return"activity";case"agents":return"folder";case"chat":return"messageSquare";case"mind":return"brain";case"voice":return"mic";case"overview":return"barChart";case"channels":return"link";case"instances":return"radio";case"sessions":return"fileText";case"usage":return"barChart";case"cron":return"loader";case"skills":return"zap";case"nodes":return"monitor";case"config":return"settings";case"debug":return"bug";case"logs":return"scrollText";default:return"folder"}}function Gi(e){return R(`tabs.${e}`)}function lp(e){return R(`subtitles.${e}`)}const pc="openclaw.control.settings.v1";function cp(){const t={gatewayUrl:"ws://127.0.0.1:18789",token:"75b022a350686cc6b28713fb8713bbd645179bf7c12e053f",sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{}};try{const n=localStorage.getItem(pc);if(!n)return t;const s=JSON.parse(n);return{gatewayUrl:typeof s.gatewayUrl=="string"&&s.gatewayUrl.trim()?s.gatewayUrl.trim():t.gatewayUrl,token:typeof s.token=="string"?s.token:t.token,sessionKey:typeof s.sessionKey=="string"&&s.sessionKey.trim()?s.sessionKey.trim():t.sessionKey,lastActiveSessionKey:typeof s.lastActiveSessionKey=="string"&&s.lastActiveSessionKey.trim()?s.lastActiveSessionKey.trim():typeof s.sessionKey=="string"&&s.sessionKey.trim()||t.lastActiveSessionKey,theme:s.theme==="light"||s.theme==="dark"||s.theme==="system"?s.theme:t.theme,chatFocusMode:typeof s.chatFocusMode=="boolean"?s.chatFocusMode:t.chatFocusMode,chatShowThinking:typeof s.chatShowThinking=="boolean"?s.chatShowThinking:t.chatShowThinking,splitRatio:typeof s.splitRatio=="number"&&s.splitRatio>=.4&&s.splitRatio<=.7?s.splitRatio:t.splitRatio,navCollapsed:typeof s.navCollapsed=="boolean"?s.navCollapsed:t.navCollapsed,navGroupsCollapsed:typeof s.navGroupsCollapsed=="object"&&s.navGroupsCollapsed!==null?s.navGroupsCollapsed:t.navGroupsCollapsed,locale:xa(s.locale)?s.locale:void 0,llmMode:s.llmMode==="local"?"local":void 0,ttsMode:s.ttsMode==="local"?"local":void 0}}catch{return t}}function dp(e){localStorage.setItem(pc,JSON.stringify(e))}const as=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,up=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,os=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},gp=({nextTheme:e,applyTheme:t,context:n,currentTheme:s})=>{if(s===e)return;const i=globalThis.document??null;if(!i){t();return}const a=i.documentElement,o=i,r=up();if(!!o.startViewTransition&&!r){let u=.5,p=.5;if(n?.pointerClientX!==void 0&&n?.pointerClientY!==void 0&&typeof window<"u")u=as(n.pointerClientX/window.innerWidth),p=as(n.pointerClientY/window.innerHeight);else if(n?.element){const g=n.element.getBoundingClientRect();g.width>0&&g.height>0&&typeof window<"u"&&(u=as((g.left+g.width/2)/window.innerWidth),p=as((g.top+g.height/2)/window.innerHeight))}a.style.setProperty("--theme-switch-x",`${u*100}%`),a.style.setProperty("--theme-switch-y",`${p*100}%`),a.classList.add("theme-transition");try{const g=o.startViewTransition?.(()=>{t()});g?.finished?g.finished.finally(()=>os(a)):os(a)}catch{os(a),t()}return}t(),os(a)};function pp(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function ja(e){return e==="system"?pp():e}function $t(e,t){const n={...t,lastActiveSessionKey:t.lastActiveSessionKey?.trim()||t.sessionKey.trim()||"main"};e.settings=n,dp(n),t.theme!==e.theme&&(e.theme=t.theme,ei(e,ja(t.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function fc(e,t){const n=t.trim();n&&e.settings.lastActiveSessionKey!==n&&$t(e,{...e.settings,lastActiveSessionKey:n})}function fp(e){if(!window.location.search&&!window.location.hash)return;const t=new URL(window.location.href),n=new URLSearchParams(t.search),s=new URLSearchParams(t.hash.startsWith("#")?t.hash.slice(1):t.hash),i=n.get("token")??s.get("token"),a=n.get("password")??s.get("password"),o=n.get("session")??s.get("session"),r=n.get("gatewayUrl")??s.get("gatewayUrl");let c=!1;if(i!=null){const p=i.trim();p&&p!==e.settings.token&&$t(e,{...e.settings,token:p}),n.delete("token"),s.delete("token"),c=!0}if(a!=null&&(n.delete("password"),s.delete("password"),c=!0),o!=null){const p=o.trim();p&&(e.sessionKey=p,$t(e,{...e.settings,sessionKey:p,lastActiveSessionKey:p}))}if(r!=null){const p=r.trim();p&&p!==e.settings.gatewayUrl&&(e.pendingGatewayUrl=p),n.delete("gatewayUrl"),s.delete("gatewayUrl"),c=!0}if(!c)return;t.search=n.toString();const u=s.toString();t.hash=u?`#${u}`:"",window.history.replaceState({},"",t.toString())}function hp(e,t){e.tab!==t&&(e.tab=t),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="logs"?_a(e):Ea(e),t==="debug"?Ma(e):La(e),Ka(e),vc(e,t,!1)}function vp(e,t,n){gp({nextTheme:t,applyTheme:()=>{e.theme=t,$t(e,{...e.settings,theme:t}),ei(e,ja(t))},context:n,currentTheme:e.theme})}async function Ka(e){if(e.tab==="overview"&&await mc(e),e.tab==="channels"&&await Sp(e),e.tab==="instances"&&await Ha(e),e.tab==="sessions"&&await Yt(e),e.tab==="cron"&&await Is(e),e.tab==="skills"&&await Zn(e),e.tab==="agents"){await Ia(e),await ze(e);const t=e.agentsList?.agents?.map(s=>s.id)??[];t.length>0&&Ul(e,t);const n=e.agentsSelectedId??e.agentsList?.defaultId??e.agentsList?.agents?.[0]?.id;n&&(zl(e,n),e.agentsPanel==="skills"&&xs(e,n),e.agentsPanel==="channels"&&_e(e,!1),e.agentsPanel==="cron"&&Is(e))}if(e.tab==="nodes"&&(await Qs(e),await St(e),await ze(e),await Ua(e)),e.tab==="mind"){const t=e;cn(async()=>{const{startAliveStream:n}=await import("./app-alive-stream-C8610wcI.js");return{startAliveStream:n}},[]).then(({startAliveStream:n})=>{n(t)})}else{const t=e;cn(async()=>{const{stopAliveStream:n}=await import("./app-alive-stream-C8610wcI.js");return{stopAliveStream:n}},[]).then(({stopAliveStream:n})=>{n(t)})}e.tab==="chat"&&(await Ac(e),Qn(e,!e.chatHasAutoScrolled),e.loadCognition()),e.tab==="config"&&(await Ml(e),await ze(e)),e.tab==="debug"&&(await Gs(e),e.eventLog=e.eventLogBuffer),e.tab==="logs"&&(e.logsAtBottom=!0,await Ta(e,{reset:!0}),Bl(e,!0))}function mp(){if(typeof window>"u")return"";const e=window.__OPENCLAW_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?Jn(e):op(window.location.pathname)}function bp(e){e.theme=e.settings.theme??"system",ei(e,ja(e.theme))}function ei(e,t){if(e.themeResolved=t,typeof document>"u")return;const n=document.documentElement;n.dataset.theme=t,n.style.colorScheme=t}function yp(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=n=>{e.theme==="system"&&ei(e,n.matches?"dark":"light")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function xp(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function $p(e,t){if(typeof window>"u")return;const n=gc(window.location.pathname,e.basePath)??"chat";hc(e,n),vc(e,n,t)}function wp(e){if(typeof window>"u")return;const t=gc(window.location.pathname,e.basePath);if(!t)return;const s=new URL(window.location.href).searchParams.get("session")?.trim();s&&(e.sessionKey=s,$t(e,{...e.settings,sessionKey:s,lastActiveSessionKey:s})),hc(e,t)}function hc(e,t){e.tab!==t&&(e.tab=t),ap(t)&&!e.showAdvanced&&(e.showAdvanced=!0),t==="chat"&&(e.chatHasAutoScrolled=!1),t==="logs"?_a(e):Ea(e),t==="debug"?Ma(e):La(e),e.connected&&Ka(e)}function vc(e,t,n){if(typeof window>"u")return;const s=Vn(Xs(t,e.basePath)),i=Vn(window.location.pathname),a=new URL(window.location.href);t==="chat"&&e.sessionKey?a.searchParams.set("session",e.sessionKey):a.searchParams.delete("session"),i!==s&&(a.pathname=s),n?window.history.replaceState({},"",a.toString()):window.history.pushState({},"",a.toString())}function kp(e,t,n){if(typeof window>"u")return;const s=new URL(window.location.href);s.searchParams.set("session",t),window.history.replaceState({},"",s.toString())}async function mc(e){await Promise.all([_e(e,!1),Ha(e),Yt(e),Yn(e),Gs(e)])}async function Sp(e){await Promise.all([_e(e,!0),Ml(e),ze(e)])}async function Is(e){await Promise.all([_e(e,!1),Yn(e),Ys(e)])}const or=50,Ap=80,Cp=12e4;function Pe(e){if(typeof e!="string")return null;const t=e.trim();return t||null}function sn(e,t){const n=Pe(t);if(!n)return null;const s=Pe(e);if(s){const a=`${s}/`;if(n.toLowerCase().startsWith(a.toLowerCase())){const o=n.slice(a.length).trim();if(o)return`${s}/${o}`}return`${s}/${n}`}const i=n.indexOf("/");if(i>0){const a=n.slice(0,i).trim(),o=n.slice(i+1).trim();if(a&&o)return`${a}/${o}`}return n}function Tp(e){return Array.isArray(e)?e.map(t=>Pe(t)).filter(t=>!!t):[]}function _p(e){if(!Array.isArray(e))return[];const t=[];for(const n of e){if(!n||typeof n!="object")continue;const s=n,i=Pe(s.provider),a=Pe(s.model);if(!i||!a)continue;const o=Pe(s.reason)?.replace(/_/g," ")??Pe(s.code)??(typeof s.status=="number"?`HTTP ${s.status}`:null)??Pe(s.error)??"error";t.push({provider:i,model:a,reason:o})}return t}function Ep(e){if(!e||typeof e!="object")return null;const t=e;if(typeof t.text=="string")return t.text;const n=t.content;if(!Array.isArray(n))return null;const s=n.map(i=>{if(!i||typeof i!="object")return null;const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>!!i);return s.length===0?null:s.join(`
`)}function rr(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const t=Ep(e);let n;if(typeof e=="string")n=e;else if(t)n=t;else try{n=JSON.stringify(e,null,2)}catch{n=String(e)}const s=Hl(n,Cp);return s.truncated?`${s.text}

… truncated (${s.total} chars, showing first ${s.text.length}).`:s.text}function Mp(e){const t=[];return t.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&t.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:t,timestamp:e.startedAt}}function Lp(e){if(e.toolStreamOrder.length<=or)return;const t=e.toolStreamOrder.length-or,n=e.toolStreamOrder.splice(0,t);for(const s of n)e.toolStreamById.delete(s)}function Ip(e){e.chatToolMessages=e.toolStreamOrder.map(t=>e.toolStreamById.get(t)?.message).filter(t=>!!t)}function Qi(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),Ip(e)}function Rp(e,t=!1){if(t){Qi(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>Qi(e),Ap))}function ti(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],Qi(e)}const Pp=5e3,Dp=8e3;function Np(e,t){const n=t.data??{},s=typeof n.phase=="string"?n.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),s==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:s==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},Pp))}function bc(e,t,n){const s=typeof t.sessionKey=="string"?t.sessionKey:void 0;return s&&s!==e.sessionKey?{accepted:!1}:!e.chatRunId&&n?.allowSessionScopedWhenIdle&&s?{accepted:!0,sessionKey:s}:!s&&e.chatRunId&&t.runId!==e.chatRunId?{accepted:!1}:e.chatRunId&&t.runId!==e.chatRunId?{accepted:!1}:e.chatRunId?{accepted:!0,sessionKey:s}:{accepted:!1}}function Fp(e,t){const n=t.data??{},s=t.stream==="fallback"?"fallback":Pe(n.phase);if(t.stream==="lifecycle"&&s!=="fallback"&&s!=="fallback_cleared"||!bc(e,t,{allowSessionScopedWhenIdle:!0}).accepted)return;const a=sn(n.selectedProvider,n.selectedModel)??sn(n.fromProvider,n.fromModel),o=sn(n.activeProvider,n.activeModel)??sn(n.toProvider,n.toModel),r=sn(n.previousActiveProvider,n.previousActiveModel)??Pe(n.previousActiveModel);if(!a||!o||s==="fallback"&&a===o)return;const c=Pe(n.reasonSummary)??Pe(n.reason),u=(()=>{const p=Tp(n.attemptSummaries);return p.length>0?p:_p(n.attempts).map(g=>`${sn(g.provider,g.model)??`${g.provider}/${g.model}`}: ${g.reason}`)})();e.fallbackClearTimer!=null&&(window.clearTimeout(e.fallbackClearTimer),e.fallbackClearTimer=null),e.fallbackStatus={phase:s==="fallback_cleared"?"cleared":"active",selected:a,active:s==="fallback_cleared"?a:o,previous:s==="fallback_cleared"?r??(o!==a?o:void 0):void 0,reason:c??void 0,attempts:u,occurredAt:Date.now()},e.fallbackClearTimer=window.setTimeout(()=>{e.fallbackStatus=null,e.fallbackClearTimer=null},Dp)}function Op(e,t){if(!t)return;if(t.stream==="compaction"){Np(e,t);return}if(t.stream==="lifecycle"||t.stream==="fallback"){Fp(e,t);return}if(t.stream!=="tool")return;const n=bc(e,t);if(!n.accepted)return;const s=n.sessionKey,i=t.data??{},a=typeof i.toolCallId=="string"?i.toolCallId:"";if(!a)return;const o=typeof i.name=="string"?i.name:"tool",r=typeof i.phase=="string"?i.phase:"",c=r==="start"?i.args:void 0,u=r==="update"?rr(i.partialResult):r==="result"?rr(i.result):void 0,p=Date.now();let g=e.toolStreamById.get(a);g?(g.name=o,c!==void 0&&(g.args=c),u!==void 0&&(g.output=u||void 0),g.updatedAt=p):(g={toolCallId:a,runId:t.runId,sessionKey:s,name:o,args:c,output:u||void 0,startedAt:typeof t.ts=="number"?t.ts:p,updatedAt:p,message:{}},e.toolStreamById.set(a,g),e.toolStreamOrder.push(a)),g.message=Mp(g),Lp(e),Rp(e,r==="result")}const Bp=/^\[([^\]]+)\]\s*/,zp=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","Google Chat","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"];function Up(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:zp.some(t=>e.startsWith(`${t} `))}function wi(e){const t=e.match(Bp);if(!t)return e;const n=t[1]??"";return Up(n)?e.slice(t[0].length):e}const ki=new WeakMap,Si=new WeakMap;function Rs(e){const t=e,n=typeof t.role=="string"?t.role:"",s=t.content;if(typeof s=="string")return n==="assistant"?mi(s):wi(s);if(Array.isArray(s)){const i=s.map(a=>{const o=a;return o.type==="text"&&typeof o.text=="string"?o.text:null}).filter(a=>typeof a=="string");if(i.length>0){const a=i.join(`
`);return n==="assistant"?mi(a):wi(a)}}return typeof t.text=="string"?n==="assistant"?mi(t.text):wi(t.text):null}function yc(e){if(!e||typeof e!="object")return Rs(e);const t=e;if(ki.has(t))return ki.get(t)??null;const n=Rs(e);return ki.set(t,n),n}function lr(e){const n=e.content,s=[];if(Array.isArray(n))for(const r of n){const c=r;if(c.type==="thinking"&&typeof c.thinking=="string"){const u=c.thinking.trim();u&&s.push(u)}}if(s.length>0)return s.join(`
`);const i=jp(e);if(!i)return null;const o=[...i.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(r=>(r[1]??"").trim()).filter(Boolean);return o.length>0?o.join(`
`):null}function Hp(e){if(!e||typeof e!="object")return lr(e);const t=e;if(Si.has(t))return Si.get(t)??null;const n=lr(e);return Si.set(t,n),n}function jp(e){const t=e,n=t.content;if(typeof n=="string")return n;if(Array.isArray(n)){const s=n.map(i=>{const a=i;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(i=>typeof i=="string");if(s.length>0)return s.join(`
`)}return typeof t.text=="string"?t.text:null}function Kp(e){const t=e.trim();if(!t)return"";const n=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).map(s=>`_${s}_`);return n.length?["_Reasoning:_",...n].join(`
`):""}let cr=!1;function dr(e){e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t="";for(let n=0;n<e.length;n++)t+=e[n].toString(16).padStart(2,"0");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}function Wp(){const e=new Uint8Array(16),t=Date.now();for(let n=0;n<e.length;n++)e[n]=Math.floor(Math.random()*256);return e[0]^=t&255,e[1]^=t>>>8&255,e[2]^=t>>>16&255,e[3]^=t>>>24&255,e}function Vp(){cr||(cr=!0,console.warn("[uuid] crypto API missing; falling back to weak randomness"))}function Wa(e=globalThis.crypto){if(e&&typeof e.randomUUID=="function")return e.randomUUID();if(e&&typeof e.getRandomValues=="function"){const t=new Uint8Array(16);return e.getRandomValues(t),dr(t)}return Vp(),dr(Wp())}async function qn(e){if(!(!e.client||!e.connected)){e.chatLoading=!0,e.lastError=null;try{const t=await e.client.request("chat.history",{sessionKey:e.sessionKey,limit:200});e.chatMessages=Array.isArray(t.messages)?t.messages:[],e.chatThinkingLevel=t.thinkingLevel??null}catch(t){e.lastError=String(t)}finally{e.chatLoading=!1}}}function qp(e){const t=/^data:([^;]+);base64,(.+)$/.exec(e);return t?{mimeType:t[1],content:t[2]}:null}function Gp(e){if(!e||typeof e!="object")return null;const t=e;return t.role!=="assistant"||!("content"in t)||!Array.isArray(t.content)?null:t}async function Qp(e,t,n){if(!e.client||!e.connected)return null;const s=t.trim(),i=n&&n.length>0;if(!s&&!i)return null;const a=Date.now(),o=[];if(s&&o.push({type:"text",text:s}),i)for(const u of n)o.push({type:"image",source:{type:"base64",media_type:u.mimeType,data:u.dataUrl}});e.chatMessages=[...e.chatMessages,{role:"user",content:o,timestamp:a}],e.chatSending=!0,e.lastError=null;const r=Wa();e.chatRunId=r,e.chatStream="",e.chatStreamStartedAt=a;const c=i?n.map(u=>{const p=qp(u.dataUrl);return p?{type:"image",mimeType:p.mimeType,content:p.content}:null}).filter(u=>u!==null):void 0;try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:s,deliver:!1,idempotencyKey:r,attachments:c}),r}catch(u){const p=String(u);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=p,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+p}],timestamp:Date.now()}],null}finally{e.chatSending=!1}}async function Yp(e){if(!e.client||!e.connected)return!1;const t=e.chatRunId;try{return await e.client.request("chat.abort",t?{sessionKey:e.sessionKey,runId:t}:{sessionKey:e.sessionKey}),!0}catch(n){return e.lastError=String(n),!1}}function Zp(e,t){if(!t||t.sessionKey!==e.sessionKey)return null;if(t.runId&&e.chatRunId&&t.runId!==e.chatRunId)return t.state==="final"?"final":null;if(t.state==="delta"){const n=Rs(t.message);if(typeof n=="string"){const s=e.chatStream??"";(!s||n.length>=s.length)&&(e.chatStream=n)}}else if(t.state==="final")e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null;else if(t.state==="aborted"){const n=Gp(t.message);if(n)e.chatMessages=[...e.chatMessages,n];else{const s=e.chatStream??"";s.trim()&&(e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:s}],timestamp:Date.now()}])}e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null}else t.state==="error"&&(e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,e.lastError=t.errorMessage??"chat error");return t.state}const xc=120;function $c(e){return e.chatSending||!!e.chatRunId}function Jp(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/stop"?!0:n==="stop"||n==="esc"||n==="abort"||n==="wait"||n==="exit"}function Xp(e){const t=e.trim();if(!t)return!1;const n=t.toLowerCase();return n==="/new"||n==="/reset"?!0:n.startsWith("/new ")||n.startsWith("/reset ")}async function wc(e){e.connected&&(e.chatMessage="",await Yp(e))}function ef(e,t,n,s){const i=t.trim(),a=!!(n&&n.length>0);!i&&!a||(e.chatQueue=[...e.chatQueue,{id:Wa(),text:i,createdAt:Date.now(),attachments:a?n?.map(o=>({...o})):void 0,refreshSessions:s}])}async function kc(e,t,n){ti(e);const s=await Qp(e,t,n?.attachments),i=!!s;return!i&&n?.previousDraft!=null&&(e.chatMessage=n.previousDraft),!i&&n?.previousAttachments&&(e.chatAttachments=n.previousAttachments),i&&fc(e,e.sessionKey),i&&n?.restoreDraft&&n.previousDraft?.trim()&&(e.chatMessage=n.previousDraft),i&&n?.restoreAttachments&&n.previousAttachments?.length&&(e.chatAttachments=n.previousAttachments),Qn(e),i&&!e.chatRunId&&Sc(e),i&&n?.refreshSessions&&s&&e.refreshSessionsAfterChat.add(s),i}async function Sc(e){if(!e.connected||$c(e))return;const[t,...n]=e.chatQueue;if(!t)return;e.chatQueue=n,await kc(e,t.text,{attachments:t.attachments,refreshSessions:t.refreshSessions})||(e.chatQueue=[t,...e.chatQueue])}function tf(e,t){e.chatQueue=e.chatQueue.filter(n=>n.id!==t)}async function nf(e,t,n){if(!e.connected)return;const s=e.chatMessage,i=(t??e.chatMessage).trim(),a=e.chatAttachments??[],o=t==null?a:[],r=o.length>0;if(!i&&!r)return;if(Jp(i)){await wc(e);return}const c=Xp(i);if(t==null&&(e.chatMessage="",e.chatAttachments=[]),$c(e)){ef(e,i,o,c);return}await kc(e,i,{previousDraft:t==null?s:void 0,restoreDraft:!!(t&&n?.restoreDraft),attachments:r?o:void 0,previousAttachments:t==null?a:void 0,restoreAttachments:!!(t&&n?.restoreDraft),refreshSessions:c})}async function Ac(e,t){await Promise.all([qn(e),Yt(e,{activeMinutes:xc}),Yi(e)]),t?.scheduleScroll!==!1&&Qn(e)}const sf=Sc;function af(e){const t=Ol(e.sessionKey);return t?.agentId?t.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function of(e,t){const n=Jn(e),s=encodeURIComponent(t);return n?`${n}/avatar/${s}?meta=1`:`/avatar/${s}?meta=1`}async function Yi(e){if(!e.connected){e.chatAvatarUrl=null;return}const t=af(e);if(!t){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const n=of(e.basePath,t);try{const s=await fetch(n,{method:"GET"});if(!s.ok){e.chatAvatarUrl=null;return}const i=await s.json(),a=typeof i.avatarUrl=="string"?i.avatarUrl.trim():"";e.chatAvatarUrl=a||null}catch{e.chatAvatarUrl=null}}const rf={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},lf={name:"",description:"",agentId:"",enabled:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",sessionTarget:"isolated",wakeMode:"now",payloadKind:"agentTurn",payloadText:"",deliveryMode:"announce",deliveryChannel:"last",deliveryTo:"",timeoutSeconds:""},cf="update.available",df=50,uf=200,gf="Assistant";function ur(e,t){if(typeof e!="string")return;const n=e.trim();if(n)return n.length<=t?n:n.slice(0,t)}function Va(e){const t=ur(e?.name,df)??gf,n=ur(e?.avatar??void 0,uf)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n}}async function Cc(e,t){if(!e.client||!e.connected)return;const n=e.sessionKey.trim(),s=n?{sessionKey:n}:{};try{const i=await e.client.request("agent.identity.get",s);if(!i)return;const a=Va(i);e.assistantName=a.name,e.assistantAvatar=a.avatar,e.assistantAgentId=a.agentId??null}catch{}}function Zi(e){return typeof e=="object"&&e!==null}function pf(e){if(!Zi(e))return null;const t=typeof e.id=="string"?e.id.trim():"",n=e.request;if(!t||!Zi(n))return null;const s=typeof n.command=="string"?n.command.trim():"";if(!s)return null;const i=typeof e.createdAtMs=="number"?e.createdAtMs:0,a=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!i||!a?null:{id:t,request:{command:s,cwd:typeof n.cwd=="string"?n.cwd:null,host:typeof n.host=="string"?n.host:null,security:typeof n.security=="string"?n.security:null,ask:typeof n.ask=="string"?n.ask:null,agentId:typeof n.agentId=="string"?n.agentId:null,resolvedPath:typeof n.resolvedPath=="string"?n.resolvedPath:null,sessionKey:typeof n.sessionKey=="string"?n.sessionKey:null},createdAtMs:i,expiresAtMs:a}}function ff(e){if(!Zi(e))return null;const t=typeof e.id=="string"?e.id.trim():"";return t?{id:t,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function Tc(e){const t=Date.now();return e.filter(n=>n.expiresAtMs>t)}function hf(e,t){const n=Tc(e).filter(s=>s.id!==t.id);return n.push(t),n}function gr(e,t){return Tc(e).filter(n=>n.id!==t)}function vf(e){const t=e.version??(e.nonce?"v2":"v1"),n=e.scopes.join(","),s=e.token??"",i=[t,e.deviceId,e.clientId,e.clientMode,e.role,n,String(e.signedAtMs),s];return t==="v2"&&i.push(e.nonce??""),i.join("|")}const _c={WEBCHAT_UI:"webchat-ui",CONTROL_UI:"openclaw-control-ui",WEBCHAT:"webchat",CLI:"cli",GATEWAY_CLIENT:"gateway-client",MACOS_APP:"openclaw-macos",IOS_APP:"openclaw-ios",ANDROID_APP:"openclaw-android",NODE_HOST:"node-host",TEST:"test",FINGERPRINT:"fingerprint",PROBE:"openclaw-probe"},pr=_c,Ji={WEBCHAT:"webchat",CLI:"cli",UI:"ui",BACKEND:"backend",NODE:"node",PROBE:"probe",TEST:"test"};new Set(Object.values(_c));new Set(Object.values(Ji));const mf=4008;class bf{constructor(t){this.opts=t,this.ws=null,this.pending=new Map,this.closed=!1,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectTimer=null,this.backoffMs=800}start(){this.closed=!1,this.connect()}stop(){this.closed=!0,this.ws?.close(),this.ws=null,this.flushPending(new Error("gateway client stopped"))}get connected(){return this.ws?.readyState===WebSocket.OPEN}connect(){this.closed||(this.ws=new WebSocket(this.opts.url),this.ws.addEventListener("open",()=>this.queueConnect()),this.ws.addEventListener("message",t=>this.handleMessage(String(t.data??""))),this.ws.addEventListener("close",t=>{const n=String(t.reason??"");this.ws=null,this.flushPending(new Error(`gateway closed (${t.code}): ${n}`)),this.opts.onClose?.({code:t.code,reason:n}),this.scheduleReconnect()}),this.ws.addEventListener("error",()=>{}))}scheduleReconnect(){if(this.closed)return;const t=this.backoffMs;this.backoffMs=Math.min(this.backoffMs*1.7,15e3),window.setTimeout(()=>this.connect(),t)}flushPending(t){for(const[,n]of this.pending)n.reject(t);this.pending.clear()}async sendConnect(){if(this.connectSent)return;this.connectSent=!0,this.connectTimer!==null&&(window.clearTimeout(this.connectTimer),this.connectTimer=null);const t=typeof crypto<"u"&&!!crypto.subtle,n=["operator.admin","operator.approvals","operator.pairing"],s="operator";let i=null,a=!1,o=this.opts.token;if(t){i=await za();const p=fg({deviceId:i.deviceId,role:s})?.token;o=p??this.opts.token,a=!!(p&&this.opts.token)}const r=o||this.opts.password?{token:o,password:this.opts.password}:void 0;let c;if(t&&i){const p=Date.now(),g=this.connectNonce??void 0,d=vf({deviceId:i.deviceId,clientId:this.opts.clientName??pr.CONTROL_UI,clientMode:this.opts.mode??Ji.WEBCHAT,role:s,scopes:n,signedAtMs:p,token:o??null,nonce:g}),h=await Bg(i.privateKey,d);c={id:i.deviceId,publicKey:i.publicKey,signature:h,signedAt:p,nonce:g}}const u={minProtocol:3,maxProtocol:3,client:{id:this.opts.clientName??pr.CONTROL_UI,version:this.opts.clientVersion??"dev",platform:this.opts.platform??navigator.platform??"web",mode:this.opts.mode??Ji.WEBCHAT,instanceId:this.opts.instanceId},role:s,scopes:n,device:c,caps:[],auth:r,userAgent:navigator.userAgent,locale:navigator.language};this.request("connect",u).then(p=>{p?.auth?.deviceToken&&i&&ql({deviceId:i.deviceId,role:p.auth.role??s,token:p.auth.deviceToken,scopes:p.auth.scopes??[]}),this.backoffMs=800,this.opts.onHello?.(p)}).catch(()=>{a&&i&&Gl({deviceId:i.deviceId,role:s}),this.ws?.close(mf,"connect failed")})}handleMessage(t){let n;try{n=JSON.parse(t)}catch{return}const s=n;if(s.type==="event"){const i=n;if(i.event==="connect.challenge"){const o=i.payload,r=o&&typeof o.nonce=="string"?o.nonce:null;r&&(this.connectNonce=r,this.sendConnect());return}const a=typeof i.seq=="number"?i.seq:null;a!==null&&(this.lastSeq!==null&&a>this.lastSeq+1&&this.opts.onGap?.({expected:this.lastSeq+1,received:a}),this.lastSeq=a);try{this.opts.onEvent?.(i)}catch(o){console.error("[gateway] event handler error:",o)}return}if(s.type==="res"){const i=n,a=this.pending.get(i.id);if(!a)return;this.pending.delete(i.id),i.ok?a.resolve(i.payload):a.reject(new Error(i.error?.message??"request failed"));return}}request(t,n){if(!this.ws||this.ws.readyState!==WebSocket.OPEN)return Promise.reject(new Error("gateway not connected"));const s=Wa(),i={type:"req",id:s,method:t,params:n},a=new Promise((o,r)=>{this.pending.set(s,{resolve:c=>o(c),reject:r})});return this.ws.send(JSON.stringify(i)),a}queueConnect(){this.connectNonce=null,this.connectSent=!1,this.connectTimer!==null&&window.clearTimeout(this.connectTimer),this.connectTimer=window.setTimeout(()=>{this.sendConnect()},750)}}function Ai(e,t){const n=(e??"").trim(),s=t.mainSessionKey?.trim();if(!s)return n;if(!n)return s;const i=t.mainKey?.trim()||"main",a=t.defaultAgentId?.trim();return n==="main"||n===i||a&&(n===`agent:${a}:main`||n===`agent:${a}:${i}`)?s:n}function yf(e,t){if(!t?.mainSessionKey)return;const n=Ai(e.sessionKey,t),s=Ai(e.settings.sessionKey,t),i=Ai(e.settings.lastActiveSessionKey,t),a=n||s||e.sessionKey,o={...e.settings,sessionKey:s||a,lastActiveSessionKey:i||a},r=o.sessionKey!==e.settings.sessionKey||o.lastActiveSessionKey!==e.settings.lastActiveSessionKey;a!==e.sessionKey&&(e.sessionKey=a),r&&$t(e,o)}function Ec(e){e.lastError=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null;const t=e.client,n=new bf({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"openclaw-control-ui",mode:"webchat",onHello:s=>{e.client===n&&(e.connected=!0,e.lastError=null,e.hello=s,wf(e,s),e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,ti(e),Cc(e),Ia(e),Qs(e,{quiet:!0}),St(e,{quiet:!0}),Ka(e))},onClose:({code:s,reason:i})=>{e.client===n&&(e.connected=!1,s!==1012&&(e.lastError=`disconnected (${s}): ${i||"no reason"}`))},onEvent:s=>{e.client===n&&xf(e,s)},onGap:({expected:s,received:i})=>{e.client===n&&(e.lastError=`event gap detected (expected seq ${s}, got ${i}); refresh recommended`)}});e.client=n,t?.stop(),n.start()}function xf(e,t){try{$f(e,t)}catch(n){console.error("[gateway] handleGatewayEvent error:",t.event,n)}}function $f(e,t){if(e.eventLogBuffer=[{ts:Date.now(),event:t.event,payload:t.payload},...e.eventLogBuffer].slice(0,250),e.tab==="debug"&&(e.eventLog=e.eventLogBuffer),t.event==="agent"){if(e.onboarding)return;Op(e,t.payload);return}if(t.event==="chat"){const n=t.payload;n?.sessionKey&&fc(e,n.sessionKey);const s=Zp(e,n);if(s==="final"||s==="error"||s==="aborted"){ti(e),sf(e);const i=n?.runId;i&&e.refreshSessionsAfterChat.has(i)&&(e.refreshSessionsAfterChat.delete(i),s==="final"&&Yt(e,{activeMinutes:xc}))}s==="final"&&qn(e);return}if(t.event==="presence"){const n=t.payload;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence,e.presenceError=null,e.presenceStatus=null);return}if(t.event==="cron"&&e.tab==="cron"&&Is(e),(t.event==="device.pair.requested"||t.event==="device.pair.resolved")&&St(e,{quiet:!0}),t.event==="exec.approval.requested"){const n=pf(t.payload);if(n){e.execApprovalQueue=hf(e.execApprovalQueue,n),e.execApprovalError=null;const s=Math.max(0,n.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=gr(e.execApprovalQueue,n.id)},s)}return}if(t.event==="exec.approval.resolved"){const n=ff(t.payload);n&&(e.execApprovalQueue=gr(e.execApprovalQueue,n.id));return}if(t.event===cf){const n=t.payload;e.updateAvailable=n?.updateAvailable??null}}function wf(e,t){const n=t.snapshot;n?.presence&&Array.isArray(n.presence)&&(e.presenceEntries=n.presence),n?.health&&(e.debugHealth=n.health),n?.sessionDefaults&&yf(e,n.sessionDefaults),e.updateAvailable=n?.updateAvailable??null}const fr="/__openclaw/control-ui-config.json";async function kf(e){if(typeof window>"u"||typeof fetch!="function")return;const t=Jn(e.basePath??""),n=t?`${t}${fr}`:fr;try{const s=await fetch(n,{method:"GET",headers:{Accept:"application/json"},credentials:"same-origin"});if(!s.ok)return;const i=await s.json(),a=Va({agentId:i.assistantAgentId??null,name:i.assistantName,avatar:i.assistantAvatar??null});e.assistantName=a.name,e.assistantAvatar=a.avatar,e.assistantAgentId=a.agentId??null}catch{}}function Sf(e){e.basePath=mp(),kf(e),fp(e),$p(e,!0),bp(e),yp(e),window.addEventListener("popstate",e.popStateHandler),Ec(e),tg(e),e.tab==="logs"&&_a(e),e.tab==="debug"&&Ma(e)}function Af(e){Gu(e)}function Cf(e){window.removeEventListener("popstate",e.popStateHandler),ng(e),Ea(e),La(e),xp(e),cn(async()=>{const{stopAliveStream:t}=await import("./app-alive-stream-C8610wcI.js");return{stopAliveStream:t}},[]).then(({stopAliveStream:t})=>{t(e)}),e.topbarObserver?.disconnect(),e.topbarObserver=null}function Tf(e,t){if(!(e.tab==="chat"&&e.chatManualRefreshInFlight)){if(e.tab==="chat"&&(t.has("chatMessages")||t.has("chatToolMessages")||t.has("chatStream")||t.has("chatLoading")||t.has("tab"))){const n=t.has("tab"),s=t.has("chatLoading")&&t.get("chatLoading")===!0&&!e.chatLoading;Qn(e,n||s||!e.chatHasAutoScrolled)}e.tab==="logs"&&(t.has("logsEntries")||t.has("logsAutoFollow")||t.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&Bl(e,t.has("tab")||t.has("logsAutoFollow"))}}async function Mc(e,t){if(!(!e.client||!e.connected)&&!e.usageLoading){e.usageLoading=!0,e.usageError=null;try{const n=t?.startDate??e.usageStartDate,s=t?.endDate??e.usageEndDate,[i,a]=await Promise.all([e.client.request("sessions.usage",{startDate:n,endDate:s,limit:1e3,includeContextWeight:!0}),e.client.request("usage.cost",{startDate:n,endDate:s})]);i&&(e.usageResult=i),a&&(e.usageCostSummary=a)}catch(n){e.usageError=String(n)}finally{e.usageLoading=!1}}}async function _f(e,t){if(!(!e.client||!e.connected)&&!e.usageTimeSeriesLoading){e.usageTimeSeriesLoading=!0,e.usageTimeSeries=null;try{const n=await e.client.request("sessions.usage.timeseries",{key:t});n&&(e.usageTimeSeries=n)}catch{e.usageTimeSeries=null}finally{e.usageTimeSeriesLoading=!1}}}async function Ef(e,t){if(!(!e.client||!e.connected)&&!e.usageSessionLogsLoading){e.usageSessionLogsLoading=!0,e.usageSessionLogs=null;try{const n=await e.client.request("sessions.usage.logs",{key:t,limit:1e3});n&&Array.isArray(n.logs)&&(e.usageSessionLogs=n.logs)}catch{e.usageSessionLogs=null}finally{e.usageSessionLogsLoading=!1}}}const Mf=new Set(["agent","channel","chat","provider","model","tool","label","key","session","id","has","mintokens","maxtokens","mincost","maxcost","minmessages","maxmessages"]),Ps=e=>e.trim().toLowerCase(),Lf=e=>{const t=e.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".");return new RegExp(`^${t}$`,"i")},Nt=e=>{let t=e.trim().toLowerCase();if(!t)return null;t.startsWith("$")&&(t=t.slice(1));let n=1;t.endsWith("k")?(n=1e3,t=t.slice(0,-1)):t.endsWith("m")&&(n=1e6,t=t.slice(0,-1));const s=Number(t);return Number.isFinite(s)?s*n:null},qa=e=>(e.match(/"[^"]+"|\S+/g)??[]).map(n=>{const s=n.replace(/^"|"$/g,""),i=s.indexOf(":");if(i>0){const a=s.slice(0,i),o=s.slice(i+1);return{key:a,value:o,raw:s}}return{value:s,raw:s}}),If=e=>[e.label,e.key,e.sessionId].filter(n=>!!n).map(n=>n.toLowerCase()),hr=e=>{const t=new Set;e.modelProvider&&t.add(e.modelProvider.toLowerCase()),e.providerOverride&&t.add(e.providerOverride.toLowerCase()),e.origin?.provider&&t.add(e.origin.provider.toLowerCase());for(const n of e.usage?.modelUsage??[])n.provider&&t.add(n.provider.toLowerCase());return Array.from(t)},vr=e=>{const t=new Set;e.model&&t.add(e.model.toLowerCase());for(const n of e.usage?.modelUsage??[])n.model&&t.add(n.model.toLowerCase());return Array.from(t)},Rf=e=>(e.usage?.toolUsage?.tools??[]).map(t=>t.name.toLowerCase()),Pf=(e,t)=>{const n=Ps(t.value??"");if(!n)return!0;if(!t.key)return If(e).some(i=>i.includes(n));switch(Ps(t.key)){case"agent":return e.agentId?.toLowerCase().includes(n)??!1;case"channel":return e.channel?.toLowerCase().includes(n)??!1;case"chat":return e.chatType?.toLowerCase().includes(n)??!1;case"provider":return hr(e).some(i=>i.includes(n));case"model":return vr(e).some(i=>i.includes(n));case"tool":return Rf(e).some(i=>i.includes(n));case"label":return e.label?.toLowerCase().includes(n)??!1;case"key":case"session":case"id":if(n.includes("*")||n.includes("?")){const i=Lf(n);return i.test(e.key)||(e.sessionId?i.test(e.sessionId):!1)}return e.key.toLowerCase().includes(n)||(e.sessionId?.toLowerCase().includes(n)??!1);case"has":switch(n){case"tools":return(e.usage?.toolUsage?.totalCalls??0)>0;case"errors":return(e.usage?.messageCounts?.errors??0)>0;case"context":return!!e.contextWeight;case"usage":return!!e.usage;case"model":return vr(e).length>0;case"provider":return hr(e).length>0;default:return!0}case"mintokens":{const i=Nt(n);return i===null?!0:(e.usage?.totalTokens??0)>=i}case"maxtokens":{const i=Nt(n);return i===null?!0:(e.usage?.totalTokens??0)<=i}case"mincost":{const i=Nt(n);return i===null?!0:(e.usage?.totalCost??0)>=i}case"maxcost":{const i=Nt(n);return i===null?!0:(e.usage?.totalCost??0)<=i}case"minmessages":{const i=Nt(n);return i===null?!0:(e.usage?.messageCounts?.total??0)>=i}case"maxmessages":{const i=Nt(n);return i===null?!0:(e.usage?.messageCounts?.total??0)<=i}default:return!0}},Df=(e,t)=>{const n=qa(t);if(n.length===0)return{sessions:e,warnings:[]};const s=[];for(const a of n){if(!a.key)continue;const o=Ps(a.key);if(!Mf.has(o)){s.push(`Unknown filter: ${a.key}`);continue}if(a.value===""&&s.push(`Missing value for ${a.key}`),o==="has"){const r=new Set(["tools","errors","context","usage","model","provider"]);a.value&&!r.has(Ps(a.value))&&s.push(`Unknown has:${a.value}`)}["mintokens","maxtokens","mincost","maxcost","minmessages","maxmessages"].includes(o)&&a.value&&Nt(a.value)===null&&s.push(`Invalid number for ${a.key}`)}return{sessions:e.filter(a=>n.every(o=>Pf(a,o))),warnings:s}};function Lc(e){const t=e.split(`
`),n=new Map,s=[];for(const r of t){const c=/^\[Tool:\s*([^\]]+)\]/.exec(r.trim());if(c){const u=c[1];n.set(u,(n.get(u)??0)+1);continue}r.trim().startsWith("[Tool Result]")||s.push(r)}const i=Array.from(n.entries()).toSorted((r,c)=>c[1]-r[1]),a=i.reduce((r,[,c])=>r+c,0),o=i.length>0?`Tools: ${i.map(([r,c])=>`${r}×${c}`).join(", ")} (${a} calls)`:"";return{tools:i,summary:o,cleanContent:s.join(`
`).trim()}}function Nf(e){return{byChannel:Array.from(e.byChannelMap.entries()).map(([t,n])=>({channel:t,totals:n})).toSorted((t,n)=>n.totals.totalCost-t.totals.totalCost),latency:e.latencyTotals.count>0?{count:e.latencyTotals.count,avgMs:e.latencyTotals.sum/e.latencyTotals.count,minMs:e.latencyTotals.min===Number.POSITIVE_INFINITY?0:e.latencyTotals.min,maxMs:e.latencyTotals.max,p95Ms:e.latencyTotals.p95Max}:void 0,dailyLatency:Array.from(e.dailyLatencyMap.values()).map(t=>({date:t.date,count:t.count,avgMs:t.count?t.sum/t.count:0,minMs:t.min===Number.POSITIVE_INFINITY?0:t.min,maxMs:t.max,p95Ms:t.p95Max})).toSorted((t,n)=>t.date.localeCompare(n.date)),modelDaily:Array.from(e.modelDailyMap.values()).toSorted((t,n)=>t.date.localeCompare(n.date)||n.cost-t.cost),daily:Array.from(e.dailyMap.values()).toSorted((t,n)=>t.date.localeCompare(n.date))}}const Ff=4;function Mt(e){return Math.round(e/Ff)}function B(e){return e>=1e6?`${(e/1e6).toFixed(1)}M`:e>=1e3?`${(e/1e3).toFixed(1)}K`:String(e)}function Of(e){const t=new Date;return t.setHours(e,0,0,0),t.toLocaleTimeString(void 0,{hour:"numeric"})}function Bf(e,t){const n=Array.from({length:24},()=>0),s=Array.from({length:24},()=>0);for(const i of e){const a=i.usage;if(!a?.messageCounts||a.messageCounts.total===0)continue;const o=a.firstActivity??i.updatedAt,r=a.lastActivity??i.updatedAt;if(!o||!r)continue;const c=Math.min(o,r),u=Math.max(o,r),g=Math.max(u-c,1)/6e4;let d=c;for(;d<u;){const h=new Date(d),f=Ga(h,t),m=Qa(h,t),w=Math.min(m.getTime(),u),A=Math.max((w-d)/6e4,0)/g;n[f]+=a.messageCounts.errors*A,s[f]+=a.messageCounts.total*A,d=w+1}}return s.map((i,a)=>{const o=n[a],r=i>0?o/i:0;return{hour:a,rate:r,errors:o,msgs:i}}).filter(i=>i.msgs>0&&i.errors>0).toSorted((i,a)=>a.rate-i.rate).slice(0,5).map(i=>({label:Of(i.hour),value:`${(i.rate*100).toFixed(2)}%`,sub:`${Math.round(i.errors)} errors · ${Math.round(i.msgs)} msgs`}))}const zf=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Ga(e,t){return t==="utc"?e.getUTCHours():e.getHours()}function Uf(e,t){return t==="utc"?e.getUTCDay():e.getDay()}function Qa(e,t){const n=new Date(e);return t==="utc"?n.setUTCMinutes(59,59,999):n.setMinutes(59,59,999),n}function Hf(e,t){const n=Array.from({length:24},()=>0),s=Array.from({length:7},()=>0);let i=0,a=!1;for(const r of e){const c=r.usage;if(!c||!c.totalTokens||c.totalTokens<=0)continue;i+=c.totalTokens;const u=c.firstActivity??r.updatedAt,p=c.lastActivity??r.updatedAt;if(!u||!p)continue;a=!0;const g=Math.min(u,p),d=Math.max(u,p),f=Math.max(d-g,1)/6e4;let m=g;for(;m<d;){const w=new Date(m),S=Ga(w,t),A=Uf(w,t),k=Qa(w,t),C=Math.min(k.getTime(),d),T=Math.max((C-m)/6e4,0)/f;n[S]+=c.totalTokens*T,s[A]+=c.totalTokens*T,m=C+1}}const o=zf.map((r,c)=>({label:r,tokens:s[c]}));return{hasData:a,totalTokens:i,hourTotals:n,weekdayTotals:o}}function jf(e,t,n,s){const i=Hf(e,t);if(!i.hasData)return l`
      <div class="card usage-mosaic">
        <div class="usage-mosaic-header">
          <div>
            <div class="usage-mosaic-title">Activity by Time</div>
            <div class="usage-mosaic-sub">Estimates require session timestamps.</div>
          </div>
          <div class="usage-mosaic-total">${B(0)} tokens</div>
        </div>
        <div class="muted" style="padding: 12px; text-align: center;">No timeline data yet.</div>
      </div>
    `;const a=Math.max(...i.hourTotals,1),o=Math.max(...i.weekdayTotals.map(r=>r.tokens),1);return l`
    <div class="card usage-mosaic">
      <div class="usage-mosaic-header">
        <div>
          <div class="usage-mosaic-title">Activity by Time</div>
          <div class="usage-mosaic-sub">
            Estimated from session spans (first/last activity). Time zone: ${t==="utc"?"UTC":"Local"}.
          </div>
        </div>
        <div class="usage-mosaic-total">${B(i.totalTokens)} tokens</div>
      </div>
      <div class="usage-mosaic-grid">
        <div class="usage-mosaic-section">
          <div class="usage-mosaic-section-title">Day of Week</div>
          <div class="usage-daypart-grid">
            ${i.weekdayTotals.map(r=>{const c=Math.min(r.tokens/o,1),u=r.tokens>0?`rgba(255, 77, 77, ${.12+c*.6})`:"transparent";return l`
                <div class="usage-daypart-cell" style="background: ${u};">
                  <div class="usage-daypart-label">${r.label}</div>
                  <div class="usage-daypart-value">${B(r.tokens)}</div>
                </div>
              `})}
          </div>
        </div>
        <div class="usage-mosaic-section">
          <div class="usage-mosaic-section-title">
            <span>Hours</span>
            <span class="usage-mosaic-sub">0 → 23</span>
          </div>
          <div class="usage-hour-grid">
            ${i.hourTotals.map((r,c)=>{const u=Math.min(r/a,1),p=r>0?`rgba(255, 77, 77, ${.08+u*.7})`:"transparent",g=`${c}:00 · ${B(r)} tokens`,d=u>.7?"rgba(255, 77, 77, 0.6)":"rgba(255, 77, 77, 0.2)",h=n.includes(c);return l`
                <div
                  class="usage-hour-cell ${h?"selected":""}"
                  style="background: ${p}; border-color: ${d};"
                  title="${g}"
                  @click=${f=>s(c,f.shiftKey)}
                ></div>
              `})}
          </div>
          <div class="usage-hour-labels">
            <span>Midnight</span>
            <span>4am</span>
            <span>8am</span>
            <span>Noon</span>
            <span>4pm</span>
            <span>8pm</span>
          </div>
          <div class="usage-hour-legend">
            <span></span>
            Low → High token density
          </div>
        </div>
      </div>
    </div>
  `}function ee(e,t=2){return`$${e.toFixed(t)}`}function Ci(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}function Ic(e){const t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;const[,n,s,i]=t,a=new Date(Date.UTC(Number(n),Number(s)-1,Number(i)));return Number.isNaN(a.valueOf())?null:a}function Rc(e){const t=Ic(e);return t?t.toLocaleDateString(void 0,{month:"short",day:"numeric"}):e}function Kf(e){const t=Ic(e);return t?t.toLocaleDateString(void 0,{month:"long",day:"numeric",year:"numeric"}):e}const rs=()=>({input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}),ls=(e,t)=>{e.input+=t.input??0,e.output+=t.output??0,e.cacheRead+=t.cacheRead??0,e.cacheWrite+=t.cacheWrite??0,e.totalTokens+=t.totalTokens??0,e.totalCost+=t.totalCost??0,e.inputCost+=t.inputCost??0,e.outputCost+=t.outputCost??0,e.cacheReadCost+=t.cacheReadCost??0,e.cacheWriteCost+=t.cacheWriteCost??0,e.missingCostEntries+=t.missingCostEntries??0},Wf=(e,t)=>{if(e.length===0)return t??{messages:{total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},tools:{totalCalls:0,uniqueTools:0,tools:[]},byModel:[],byProvider:[],byAgent:[],byChannel:[],daily:[]};const n={total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},s=new Map,i=new Map,a=new Map,o=new Map,r=new Map,c=new Map,u=new Map,p=new Map,g={count:0,sum:0,min:Number.POSITIVE_INFINITY,max:0,p95Max:0};for(const h of e){const f=h.usage;if(f){if(f.messageCounts&&(n.total+=f.messageCounts.total,n.user+=f.messageCounts.user,n.assistant+=f.messageCounts.assistant,n.toolCalls+=f.messageCounts.toolCalls,n.toolResults+=f.messageCounts.toolResults,n.errors+=f.messageCounts.errors),f.toolUsage)for(const m of f.toolUsage.tools)s.set(m.name,(s.get(m.name)??0)+m.count);if(f.modelUsage)for(const m of f.modelUsage){const w=`${m.provider??"unknown"}::${m.model??"unknown"}`,S=i.get(w)??{provider:m.provider,model:m.model,count:0,totals:rs()};S.count+=m.count,ls(S.totals,m.totals),i.set(w,S);const A=m.provider??"unknown",k=a.get(A)??{provider:m.provider,model:void 0,count:0,totals:rs()};k.count+=m.count,ls(k.totals,m.totals),a.set(A,k)}if(f.latency){const{count:m,avgMs:w,minMs:S,maxMs:A,p95Ms:k}=f.latency;m>0&&(g.count+=m,g.sum+=w*m,g.min=Math.min(g.min,S),g.max=Math.max(g.max,A),g.p95Max=Math.max(g.p95Max,k))}if(h.agentId){const m=o.get(h.agentId)??rs();ls(m,f),o.set(h.agentId,m)}if(h.channel){const m=r.get(h.channel)??rs();ls(m,f),r.set(h.channel,m)}for(const m of f.dailyBreakdown??[]){const w=c.get(m.date)??{date:m.date,tokens:0,cost:0,messages:0,toolCalls:0,errors:0};w.tokens+=m.tokens,w.cost+=m.cost,c.set(m.date,w)}for(const m of f.dailyMessageCounts??[]){const w=c.get(m.date)??{date:m.date,tokens:0,cost:0,messages:0,toolCalls:0,errors:0};w.messages+=m.total,w.toolCalls+=m.toolCalls,w.errors+=m.errors,c.set(m.date,w)}for(const m of f.dailyLatency??[]){const w=u.get(m.date)??{date:m.date,count:0,sum:0,min:Number.POSITIVE_INFINITY,max:0,p95Max:0};w.count+=m.count,w.sum+=m.avgMs*m.count,w.min=Math.min(w.min,m.minMs),w.max=Math.max(w.max,m.maxMs),w.p95Max=Math.max(w.p95Max,m.p95Ms),u.set(m.date,w)}for(const m of f.dailyModelUsage??[]){const w=`${m.date}::${m.provider??"unknown"}::${m.model??"unknown"}`,S=p.get(w)??{date:m.date,provider:m.provider,model:m.model,tokens:0,cost:0,count:0};S.tokens+=m.tokens,S.cost+=m.cost,S.count+=m.count,p.set(w,S)}}}const d=Nf({byChannelMap:r,latencyTotals:g,dailyLatencyMap:u,modelDailyMap:p,dailyMap:c});return{messages:n,tools:{totalCalls:Array.from(s.values()).reduce((h,f)=>h+f,0),uniqueTools:s.size,tools:Array.from(s.entries()).map(([h,f])=>({name:h,count:f})).toSorted((h,f)=>f.count-h.count)},byModel:Array.from(i.values()).toSorted((h,f)=>f.totals.totalCost-h.totals.totalCost),byProvider:Array.from(a.values()).toSorted((h,f)=>f.totals.totalCost-h.totals.totalCost),byAgent:Array.from(o.entries()).map(([h,f])=>({agentId:h,totals:f})).toSorted((h,f)=>f.totals.totalCost-h.totals.totalCost),...d}},Vf=(e,t,n)=>{let s=0,i=0;for(const p of e){const g=p.usage?.durationMs??0;g>0&&(s+=g,i+=1)}const a=i?s/i:0,o=t&&s>0?t.totalTokens/(s/6e4):void 0,r=t&&s>0?t.totalCost/(s/6e4):void 0,c=n.messages.total?n.messages.errors/n.messages.total:0,u=n.daily.filter(p=>p.messages>0&&p.errors>0).map(p=>({date:p.date,errors:p.errors,messages:p.messages,rate:p.errors/p.messages})).toSorted((p,g)=>g.rate-p.rate||g.errors-p.errors)[0];return{durationSumMs:s,durationCount:i,avgDurationMs:a,throughputTokensPerMin:o,throughputCostPerMin:r,errorRate:c,peakErrorDay:u}};function Ti(e,t,n="text/plain"){const s=new Blob([t],{type:`${n};charset=utf-8`}),i=URL.createObjectURL(s),a=document.createElement("a");a.href=i,a.download=e,a.click(),URL.revokeObjectURL(i)}function qf(e){return/[",\n]/.test(e)?`"${e.replaceAll('"','""')}"`:e}function Ds(e){return e.map(t=>t==null?"":qf(String(t))).join(",")}const Gf=e=>{const t=[Ds(["key","label","agentId","channel","provider","model","updatedAt","durationMs","messages","errors","toolCalls","inputTokens","outputTokens","cacheReadTokens","cacheWriteTokens","totalTokens","totalCost"])];for(const n of e){const s=n.usage;t.push(Ds([n.key,n.label??"",n.agentId??"",n.channel??"",n.modelProvider??n.providerOverride??"",n.model??n.modelOverride??"",n.updatedAt?new Date(n.updatedAt).toISOString():"",s?.durationMs??"",s?.messageCounts?.total??"",s?.messageCounts?.errors??"",s?.messageCounts?.toolCalls??"",s?.input??"",s?.output??"",s?.cacheRead??"",s?.cacheWrite??"",s?.totalTokens??"",s?.totalCost??""]))}return t.join(`
`)},Qf=e=>{const t=[Ds(["date","inputTokens","outputTokens","cacheReadTokens","cacheWriteTokens","totalTokens","inputCost","outputCost","cacheReadCost","cacheWriteCost","totalCost"])];for(const n of e)t.push(Ds([n.date,n.input,n.output,n.cacheRead,n.cacheWrite,n.totalTokens,n.inputCost??"",n.outputCost??"",n.cacheReadCost??"",n.cacheWriteCost??"",n.totalCost]));return t.join(`
`)},Yf=(e,t,n)=>{const s=e.trim();if(!s)return[];const i=s.length?s.split(/\s+/):[],a=i.length?i[i.length-1]:"",[o,r]=a.includes(":")?[a.slice(0,a.indexOf(":")),a.slice(a.indexOf(":")+1)]:["",""],c=o.toLowerCase(),u=r.toLowerCase(),p=A=>{const k=new Set;for(const C of A)C&&k.add(C);return Array.from(k)},g=p(t.map(A=>A.agentId)).slice(0,6),d=p(t.map(A=>A.channel)).slice(0,6),h=p([...t.map(A=>A.modelProvider),...t.map(A=>A.providerOverride),...n?.byProvider.map(A=>A.provider)??[]]).slice(0,6),f=p([...t.map(A=>A.model),...n?.byModel.map(A=>A.model)??[]]).slice(0,6),m=p(n?.tools.tools.map(A=>A.name)??[]).slice(0,6);if(!c)return[{label:"agent:",value:"agent:"},{label:"channel:",value:"channel:"},{label:"provider:",value:"provider:"},{label:"model:",value:"model:"},{label:"tool:",value:"tool:"},{label:"has:errors",value:"has:errors"},{label:"has:tools",value:"has:tools"},{label:"minTokens:",value:"minTokens:"},{label:"maxCost:",value:"maxCost:"}];const w=[],S=(A,k)=>{for(const C of k)(!u||C.toLowerCase().includes(u))&&w.push({label:`${A}:${C}`,value:`${A}:${C}`})};switch(c){case"agent":S("agent",g);break;case"channel":S("channel",d);break;case"provider":S("provider",h);break;case"model":S("model",f);break;case"tool":S("tool",m);break;case"has":["errors","tools","context","usage","model","provider"].forEach(A=>{(!u||A.includes(u))&&w.push({label:`has:${A}`,value:`has:${A}`})});break}return w},Zf=(e,t)=>{const n=e.trim();if(!n)return`${t} `;const s=n.split(/\s+/);return s[s.length-1]=t,`${s.join(" ")} `},Ot=e=>e.trim().toLowerCase(),Jf=(e,t)=>{const n=e.trim();if(!n)return`${t} `;const s=n.split(/\s+/),i=s[s.length-1]??"",a=t.includes(":")?t.split(":")[0]:null,o=i.includes(":")?i.split(":")[0]:null;return i.endsWith(":")&&a&&o===a?(s[s.length-1]=t,`${s.join(" ")} `):s.includes(t)?`${s.join(" ")} `:`${s.join(" ")} ${t} `},mr=(e,t)=>{const s=e.trim().split(/\s+/).filter(Boolean).filter(i=>i!==t);return s.length?`${s.join(" ")} `:""},br=(e,t,n)=>{const s=Ot(t),a=[...qa(e).filter(o=>Ot(o.key??"")!==s).map(o=>o.raw),...n.map(o=>`${t}:${o}`)];return a.length?`${a.join(" ")} `:""};function mt(e,t){return t===0?0:e/t*100}function Xf(e){const t=e.totalCost||0;return{input:{tokens:e.input,cost:e.inputCost||0,pct:mt(e.inputCost||0,t)},output:{tokens:e.output,cost:e.outputCost||0,pct:mt(e.outputCost||0,t)},cacheRead:{tokens:e.cacheRead,cost:e.cacheReadCost||0,pct:mt(e.cacheReadCost||0,t)},cacheWrite:{tokens:e.cacheWrite,cost:e.cacheWriteCost||0,pct:mt(e.cacheWriteCost||0,t)},totalCost:t}}function eh(e,t,n,s,i,a,o,r){if(!(e.length>0||t.length>0||n.length>0))return v;const u=n.length===1?s.find(f=>f.key===n[0]):null,p=u?(u.label||u.key).slice(0,20)+((u.label||u.key).length>20?"…":""):n.length===1?n[0].slice(0,8)+"…":`${n.length} sessions`,g=u?u.label||u.key:n.length===1?n[0]:n.join(", "),d=e.length===1?e[0]:`${e.length} days`,h=t.length===1?`${t[0]}:00`:`${t.length} hours`;return l`
    <div class="active-filters">
      ${e.length>0?l`
            <div class="filter-chip">
              <span class="filter-chip-label">Days: ${d}</span>
              <button class="filter-chip-remove" @click=${i} title="Remove filter">×</button>
            </div>
          `:v}
      ${t.length>0?l`
            <div class="filter-chip">
              <span class="filter-chip-label">Hours: ${h}</span>
              <button class="filter-chip-remove" @click=${a} title="Remove filter">×</button>
            </div>
          `:v}
      ${n.length>0?l`
            <div class="filter-chip" title="${g}">
              <span class="filter-chip-label">Session: ${p}</span>
              <button class="filter-chip-remove" @click=${o} title="Remove filter">×</button>
            </div>
          `:v}
      ${(e.length>0||t.length>0)&&n.length>0?l`
            <button class="btn btn-sm filter-clear-btn" @click=${r}>
              Clear All
            </button>
          `:v}
    </div>
  `}function th(e,t,n,s,i,a){if(!e.length)return l`
      <div class="daily-chart-compact">
        <div class="sessions-panel-title">Daily Usage</div>
        <div class="muted" style="padding: 20px; text-align: center">No data</div>
      </div>
    `;const o=n==="tokens",r=e.map(g=>o?g.totalTokens:g.totalCost),c=Math.max(...r,o?1:1e-4),u=e.length>30?12:e.length>20?18:e.length>14?24:32,p=e.length<=14;return l`
    <div class="daily-chart-compact">
      <div class="daily-chart-header">
        <div class="chart-toggle small sessions-toggle">
          <button
            class="toggle-btn ${s==="total"?"active":""}"
            @click=${()=>i("total")}
          >
            Total
          </button>
          <button
            class="toggle-btn ${s==="by-type"?"active":""}"
            @click=${()=>i("by-type")}
          >
            By Type
          </button>
        </div>
        <div class="card-title">Daily ${o?"Token":"Cost"} Usage</div>
      </div>
      <div class="daily-chart">
        <div class="daily-chart-bars" style="--bar-max-width: ${u}px">
          ${e.map((g,d)=>{const f=r[d]/c*100,m=t.includes(g.date),w=Rc(g.date),S=e.length>20?String(parseInt(g.date.slice(8),10)):w,A=e.length>20?"font-size: 8px":"",k=s==="by-type"?o?[{value:g.output,class:"output"},{value:g.input,class:"input"},{value:g.cacheWrite,class:"cache-write"},{value:g.cacheRead,class:"cache-read"}]:[{value:g.outputCost??0,class:"output"},{value:g.inputCost??0,class:"input"},{value:g.cacheWriteCost??0,class:"cache-write"},{value:g.cacheReadCost??0,class:"cache-read"}]:[],C=s==="by-type"?o?[`Output ${B(g.output)}`,`Input ${B(g.input)}`,`Cache write ${B(g.cacheWrite)}`,`Cache read ${B(g.cacheRead)}`]:[`Output ${ee(g.outputCost??0)}`,`Input ${ee(g.inputCost??0)}`,`Cache write ${ee(g.cacheWriteCost??0)}`,`Cache read ${ee(g.cacheReadCost??0)}`]:[],_=o?B(g.totalTokens):ee(g.totalCost);return l`
              <div
                class="daily-bar-wrapper ${m?"selected":""}"
                @click=${T=>a(g.date,T.shiftKey)}
              >
                ${s==="by-type"?l`
                        <div
                          class="daily-bar"
                          style="height: ${f.toFixed(1)}%; display: flex; flex-direction: column;"
                        >
                          ${(()=>{const T=k.reduce((M,Y)=>M+Y.value,0)||1;return k.map(M=>l`
                                <div
                                  class="cost-segment ${M.class}"
                                  style="height: ${M.value/T*100}%"
                                ></div>
                              `)})()}
                        </div>
                      `:l`
                        <div class="daily-bar" style="height: ${f.toFixed(1)}%"></div>
                      `}
                ${p?l`<div class="daily-bar-total">${_}</div>`:v}
                <div class="daily-bar-label" style="${A}">${S}</div>
                <div class="daily-bar-tooltip">
                  <strong>${Kf(g.date)}</strong><br />
                  ${B(g.totalTokens)} tokens<br />
                  ${ee(g.totalCost)}
                  ${C.length?l`${C.map(T=>l`<div>${T}</div>`)}`:v}
                </div>
              </div>
            `})}
        </div>
      </div>
    </div>
  `}function nh(e,t){const n=Xf(e),s=t==="tokens",i=e.totalTokens||1,a={output:mt(e.output,i),input:mt(e.input,i),cacheWrite:mt(e.cacheWrite,i),cacheRead:mt(e.cacheRead,i)};return l`
    <div class="cost-breakdown cost-breakdown-compact">
      <div class="cost-breakdown-header">${s?"Tokens":"Cost"} by Type</div>
      <div class="cost-breakdown-bar">
        <div class="cost-segment output" style="width: ${(s?a.output:n.output.pct).toFixed(1)}%"
          title="Output: ${s?B(e.output):ee(n.output.cost)}"></div>
        <div class="cost-segment input" style="width: ${(s?a.input:n.input.pct).toFixed(1)}%"
          title="Input: ${s?B(e.input):ee(n.input.cost)}"></div>
        <div class="cost-segment cache-write" style="width: ${(s?a.cacheWrite:n.cacheWrite.pct).toFixed(1)}%"
          title="Cache Write: ${s?B(e.cacheWrite):ee(n.cacheWrite.cost)}"></div>
        <div class="cost-segment cache-read" style="width: ${(s?a.cacheRead:n.cacheRead.pct).toFixed(1)}%"
          title="Cache Read: ${s?B(e.cacheRead):ee(n.cacheRead.cost)}"></div>
      </div>
      <div class="cost-breakdown-legend">
        <span class="legend-item"><span class="legend-dot output"></span>Output ${s?B(e.output):ee(n.output.cost)}</span>
        <span class="legend-item"><span class="legend-dot input"></span>Input ${s?B(e.input):ee(n.input.cost)}</span>
        <span class="legend-item"><span class="legend-dot cache-write"></span>Cache Write ${s?B(e.cacheWrite):ee(n.cacheWrite.cost)}</span>
        <span class="legend-item"><span class="legend-dot cache-read"></span>Cache Read ${s?B(e.cacheRead):ee(n.cacheRead.cost)}</span>
      </div>
      <div class="cost-breakdown-total">
        Total: ${s?B(e.totalTokens):ee(e.totalCost)}
      </div>
    </div>
  `}function Bt(e,t,n){return l`
    <div class="usage-insight-card">
      <div class="usage-insight-title">${e}</div>
      ${t.length===0?l`<div class="muted">${n}</div>`:l`
              <div class="usage-list">
                ${t.map(s=>l`
                    <div class="usage-list-item">
                      <span>${s.label}</span>
                      <span class="usage-list-value">
                        <span>${s.value}</span>
                        ${s.sub?l`<span class="usage-list-sub">${s.sub}</span>`:v}
                      </span>
                    </div>
                  `)}
              </div>
            `}
    </div>
  `}function yr(e,t,n){return l`
    <div class="usage-insight-card">
      <div class="usage-insight-title">${e}</div>
      ${t.length===0?l`<div class="muted">${n}</div>`:l`
              <div class="usage-error-list">
                ${t.map(s=>l`
                    <div class="usage-error-row">
                      <div class="usage-error-date">${s.label}</div>
                      <div class="usage-error-rate">${s.value}</div>
                      ${s.sub?l`<div class="usage-error-sub">${s.sub}</div>`:v}
                    </div>
                  `)}
              </div>
            `}
    </div>
  `}function sh(e,t,n,s,i,a,o){if(!e)return v;const r=t.messages.total?Math.round(e.totalTokens/t.messages.total):0,c=t.messages.total?e.totalCost/t.messages.total:0,u=e.input+e.cacheRead,p=u>0?e.cacheRead/u:0,g=u>0?`${(p*100).toFixed(1)}%`:"—",d=n.errorRate*100,h=n.throughputTokensPerMin!==void 0?`${B(Math.round(n.throughputTokensPerMin))} tok/min`:"—",f=n.throughputCostPerMin!==void 0?`${ee(n.throughputCostPerMin,4)} / min`:"—",m=n.durationCount>0?Ra(n.avgDurationMs,{spaced:!0})??"—":"—",w="Cache hit rate = cache read / (input + cache read). Higher is better.",S="Error rate = errors / total messages. Lower is better.",A="Throughput shows tokens per minute over active time. Higher is better.",k="Average tokens per message in this range.",C=s?"Average cost per message when providers report costs. Cost data is missing for some or all sessions in this range.":"Average cost per message when providers report costs.",_=t.daily.filter(P=>P.messages>0&&P.errors>0).map(P=>{const W=P.errors/P.messages;return{label:Rc(P.date),value:`${(W*100).toFixed(2)}%`,sub:`${P.errors} errors · ${P.messages} msgs · ${B(P.tokens)}`,rate:W}}).toSorted((P,W)=>W.rate-P.rate).slice(0,5).map(({rate:P,...W})=>W),T=t.byModel.slice(0,5).map(P=>({label:P.model??"unknown",value:ee(P.totals.totalCost),sub:`${B(P.totals.totalTokens)} · ${P.count} msgs`})),M=t.byProvider.slice(0,5).map(P=>({label:P.provider??"unknown",value:ee(P.totals.totalCost),sub:`${B(P.totals.totalTokens)} · ${P.count} msgs`})),Y=t.tools.tools.slice(0,6).map(P=>({label:P.name,value:`${P.count}`,sub:"calls"})),X=t.byAgent.slice(0,5).map(P=>({label:P.agentId,value:ee(P.totals.totalCost),sub:B(P.totals.totalTokens)})),te=t.byChannel.slice(0,5).map(P=>({label:P.channel,value:ee(P.totals.totalCost),sub:B(P.totals.totalTokens)}));return l`
    <section class="card" style="margin-top: 16px;">
      <div class="card-title">Usage Overview</div>
      <div class="usage-summary-grid">
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Messages
            <span class="usage-summary-hint" title="Total user + assistant messages in range.">?</span>
          </div>
          <div class="usage-summary-value">${t.messages.total}</div>
          <div class="usage-summary-sub">
            ${t.messages.user} user · ${t.messages.assistant} assistant
          </div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Tool Calls
            <span class="usage-summary-hint" title="Total tool call count across sessions.">?</span>
          </div>
          <div class="usage-summary-value">${t.tools.totalCalls}</div>
          <div class="usage-summary-sub">${t.tools.uniqueTools} tools used</div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Errors
            <span class="usage-summary-hint" title="Total message/tool errors in range.">?</span>
          </div>
          <div class="usage-summary-value">${t.messages.errors}</div>
          <div class="usage-summary-sub">${t.messages.toolResults} tool results</div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Avg Tokens / Msg
            <span class="usage-summary-hint" title=${k}>?</span>
          </div>
          <div class="usage-summary-value">${B(r)}</div>
          <div class="usage-summary-sub">Across ${t.messages.total||0} messages</div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Avg Cost / Msg
            <span class="usage-summary-hint" title=${C}>?</span>
          </div>
          <div class="usage-summary-value">${ee(c,4)}</div>
          <div class="usage-summary-sub">${ee(e.totalCost)} total</div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Sessions
            <span class="usage-summary-hint" title="Distinct sessions in the range.">?</span>
          </div>
          <div class="usage-summary-value">${a}</div>
          <div class="usage-summary-sub">of ${o} in range</div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Throughput
            <span class="usage-summary-hint" title=${A}>?</span>
          </div>
          <div class="usage-summary-value">${h}</div>
          <div class="usage-summary-sub">${f}</div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Error Rate
            <span class="usage-summary-hint" title=${S}>?</span>
          </div>
          <div class="usage-summary-value ${d>5?"bad":d>1?"warn":"good"}">${d.toFixed(2)}%</div>
          <div class="usage-summary-sub">
            ${t.messages.errors} errors · ${m} avg session
          </div>
        </div>
        <div class="usage-summary-card">
          <div class="usage-summary-title">
            Cache Hit Rate
            <span class="usage-summary-hint" title=${w}>?</span>
          </div>
          <div class="usage-summary-value ${p>.6?"good":p>.3?"warn":"bad"}">${g}</div>
          <div class="usage-summary-sub">
            ${B(e.cacheRead)} cached · ${B(u)} prompt
          </div>
        </div>
      </div>
      <div class="usage-insights-grid">
        ${Bt("Top Models",T,"No model data")}
        ${Bt("Top Providers",M,"No provider data")}
        ${Bt("Top Tools",Y,"No tool calls")}
        ${Bt("Top Agents",X,"No agent data")}
        ${Bt("Top Channels",te,"No channel data")}
        ${yr("Peak Error Days",_,"No error data")}
        ${yr("Peak Error Hours",i,"No error data")}
      </div>
    </section>
  `}function ih(e,t,n,s,i,a,o,r,c,u,p,g,d,h,f){const m=E=>d.includes(E),w=E=>{const H=E.label||E.key;return H.startsWith("agent:")&&H.includes("?token=")?H.slice(0,H.indexOf("?token=")):H},S=async E=>{const H=w(E);try{await navigator.clipboard.writeText(H)}catch{}},A=E=>{const H=[];return m("channel")&&E.channel&&H.push(`channel:${E.channel}`),m("agent")&&E.agentId&&H.push(`agent:${E.agentId}`),m("provider")&&(E.modelProvider||E.providerOverride)&&H.push(`provider:${E.modelProvider??E.providerOverride}`),m("model")&&E.model&&H.push(`model:${E.model}`),m("messages")&&E.usage?.messageCounts&&H.push(`msgs:${E.usage.messageCounts.total}`),m("tools")&&E.usage?.toolUsage&&H.push(`tools:${E.usage.toolUsage.totalCalls}`),m("errors")&&E.usage?.messageCounts&&H.push(`errors:${E.usage.messageCounts.errors}`),m("duration")&&E.usage?.durationMs&&H.push(`dur:${Ra(E.usage.durationMs,{spaced:!0})??"—"}`),H},k=E=>{const H=E.usage;if(!H)return 0;if(n.length>0&&H.dailyBreakdown&&H.dailyBreakdown.length>0){const G=H.dailyBreakdown.filter(le=>n.includes(le.date));return s?G.reduce((le,fe)=>le+fe.tokens,0):G.reduce((le,fe)=>le+fe.cost,0)}return s?H.totalTokens??0:H.totalCost??0},C=[...e].toSorted((E,H)=>{switch(i){case"recent":return(H.updatedAt??0)-(E.updatedAt??0);case"messages":return(H.usage?.messageCounts?.total??0)-(E.usage?.messageCounts?.total??0);case"errors":return(H.usage?.messageCounts?.errors??0)-(E.usage?.messageCounts?.errors??0);case"cost":return k(H)-k(E);default:return k(H)-k(E)}}),_=a==="asc"?C.toReversed():C,T=_.reduce((E,H)=>E+k(H),0),M=_.length?T/_.length:0,Y=_.reduce((E,H)=>E+(H.usage?.messageCounts?.errors??0),0),X=(E,H)=>{const G=k(E),le=w(E),fe=A(E);return l`
      <div
        class="session-bar-row ${H?"selected":""}"
        @click=${I=>c(E.key,I.shiftKey)}
        title="${E.key}"
      >
        <div class="session-bar-label">
          <div class="session-bar-title">${le}</div>
          ${fe.length>0?l`<div class="session-bar-meta">${fe.join(" · ")}</div>`:v}
        </div>
        <div class="session-bar-track" style="display: none;"></div>
        <div class="session-bar-actions">
          <button
            class="session-copy-btn"
            title="Copy session name"
            @click=${I=>{I.stopPropagation(),S(E)}}
          >
            Copy
          </button>
          <div class="session-bar-value">${s?B(G):ee(G)}</div>
        </div>
      </div>
    `},te=new Set(t),P=_.filter(E=>te.has(E.key)),W=P.length,ne=new Map(_.map(E=>[E.key,E])),re=o.map(E=>ne.get(E)).filter(E=>!!E);return l`
    <div class="card sessions-card">
      <div class="sessions-card-header">
        <div class="card-title">Sessions</div>
        <div class="sessions-card-count">
          ${e.length} shown${h!==e.length?` · ${h} total`:""}
        </div>
      </div>
      <div class="sessions-card-meta">
        <div class="sessions-card-stats">
          <span>${s?B(M):ee(M)} avg</span>
          <span>${Y} errors</span>
        </div>
        <div class="chart-toggle small">
          <button
            class="toggle-btn ${r==="all"?"active":""}"
            @click=${()=>g("all")}
          >
            All
          </button>
          <button
            class="toggle-btn ${r==="recent"?"active":""}"
            @click=${()=>g("recent")}
          >
            Recently viewed
          </button>
        </div>
        <label class="sessions-sort">
          <span>Sort</span>
          <select
            @change=${E=>u(E.target.value)}
          >
            <option value="cost" ?selected=${i==="cost"}>Cost</option>
            <option value="errors" ?selected=${i==="errors"}>Errors</option>
            <option value="messages" ?selected=${i==="messages"}>Messages</option>
            <option value="recent" ?selected=${i==="recent"}>Recent</option>
            <option value="tokens" ?selected=${i==="tokens"}>Tokens</option>
          </select>
        </label>
        <button
          class="btn btn-sm sessions-action-btn icon"
          @click=${()=>p(a==="desc"?"asc":"desc")}
          title=${a==="desc"?"Descending":"Ascending"}
        >
          ${a==="desc"?"↓":"↑"}
        </button>
        ${W>0?l`
                <button class="btn btn-sm sessions-action-btn sessions-clear-btn" @click=${f}>
                  Clear Selection
                </button>
              `:v}
      </div>
      ${r==="recent"?re.length===0?l`
                <div class="muted" style="padding: 20px; text-align: center">No recent sessions</div>
              `:l`
	                <div class="session-bars" style="max-height: 220px; margin-top: 6px;">
	                  ${re.map(E=>X(E,te.has(E.key)))}
	                </div>
	              `:e.length===0?l`
                <div class="muted" style="padding: 20px; text-align: center">No sessions in range</div>
              `:l`
	                <div class="session-bars">
	                  ${_.slice(0,50).map(E=>X(E,te.has(E.key)))}
	                  ${e.length>50?l`<div class="muted" style="padding: 8px; text-align: center; font-size: 11px;">+${e.length-50} more</div>`:v}
	                </div>
	              `}
      ${W>1?l`
              <div style="margin-top: 10px;">
                <div class="sessions-card-count">Selected (${W})</div>
                <div class="session-bars" style="max-height: 160px; margin-top: 6px;">
                  ${P.map(E=>X(E,!0))}
                </div>
              </div>
            `:v}
    </div>
  `}const ah=.75,oh=8,rh=.06,cs=5,Ie=12,ft=.7;function bt(e,t){return!t||t<=0?0:e/t*100}function lh(){return v}function Pc(e){return e<1e12?e*1e3:e}function ch(e,t,n){const s=Math.min(t,n),i=Math.max(t,n);return e.filter(a=>{if(a.timestamp<=0)return!0;const o=Pc(a.timestamp);return o>=s&&o<=i})}function dh(e,t,n){const s=t||e.usage;if(!s)return l`
      <div class="muted">No usage data for this session.</div>
    `;const i=g=>g?new Date(g).toLocaleString():"—",a=[];e.channel&&a.push(`channel:${e.channel}`),e.agentId&&a.push(`agent:${e.agentId}`),(e.modelProvider||e.providerOverride)&&a.push(`provider:${e.modelProvider??e.providerOverride}`),e.model&&a.push(`model:${e.model}`);const o=s.toolUsage?.tools.slice(0,6)??[];let r,c,u;if(n){const g=new Map;for(const d of n){const{tools:h}=Lc(d.content);for(const[f]of h)g.set(f,(g.get(f)||0)+1)}u=o.map(d=>({label:d.name,value:`${g.get(d.name)??0}`,sub:"calls"})),r=[...g.values()].reduce((d,h)=>d+h,0),c=g.size}else u=o.map(g=>({label:g.name,value:`${g.count}`,sub:"calls"})),r=s.toolUsage?.totalCalls??0,c=s.toolUsage?.uniqueTools??0;const p=s.modelUsage?.slice(0,6).map(g=>({label:g.model??"unknown",value:ee(g.totals.totalCost),sub:B(g.totals.totalTokens)}))??[];return l`
    ${a.length>0?l`<div class="usage-badges">${a.map(g=>l`<span class="usage-badge">${g}</span>`)}</div>`:v}
    <div class="session-summary-grid">
      <div class="session-summary-card">
        <div class="session-summary-title">Messages</div>
        <div class="session-summary-value">${s.messageCounts?.total??0}</div>
        <div class="session-summary-meta">${s.messageCounts?.user??0} user · ${s.messageCounts?.assistant??0} assistant</div>
      </div>
      <div class="session-summary-card">
        <div class="session-summary-title">Tool Calls</div>
        <div class="session-summary-value">${r}</div>
        <div class="session-summary-meta">${c} tools</div>
      </div>
      <div class="session-summary-card">
        <div class="session-summary-title">Errors</div>
        <div class="session-summary-value">${s.messageCounts?.errors??0}</div>
        <div class="session-summary-meta">${s.messageCounts?.toolResults??0} tool results</div>
      </div>
      <div class="session-summary-card">
        <div class="session-summary-title">Duration</div>
        <div class="session-summary-value">${Ra(s.durationMs,{spaced:!0})??"—"}</div>
        <div class="session-summary-meta">${i(s.firstActivity)} → ${i(s.lastActivity)}</div>
      </div>
    </div>
    <div class="usage-insights-grid" style="margin-top: 12px;">
      ${Bt("Top Tools",u,"No tool calls")}
      ${Bt("Model Mix",p,"No model data")}
    </div>
  `}function uh(e,t,n,s){const i=Math.min(n,s),a=Math.max(n,s),o=t.filter(m=>m.timestamp>=i&&m.timestamp<=a);if(o.length===0)return;let r=0,c=0,u=0,p=0,g=0,d=0,h=0,f=0;for(const m of o)r+=m.totalTokens||0,c+=m.cost||0,g+=m.input||0,d+=m.output||0,h+=m.cacheRead||0,f+=m.cacheWrite||0,m.output>0&&p++,m.input>0&&u++;return{...e,totalTokens:r,totalCost:c,input:g,output:d,cacheRead:h,cacheWrite:f,durationMs:o[o.length-1].timestamp-o[0].timestamp,firstActivity:o[0].timestamp,lastActivity:o[o.length-1].timestamp,messageCounts:{total:o.length,user:u,assistant:p,toolCalls:0,toolResults:0,errors:0}}}function gh(e,t,n,s,i,a,o,r,c,u,p,g,d,h,f,m,w,S,A,k,C,_,T,M,Y,X){const te=e.label||e.key,P=te.length>50?te.slice(0,50)+"…":te,W=e.usage,ne=r!==null&&c!==null,re=r!==null&&c!==null&&t?.points&&W?uh(W,t.points,r,c):void 0,E=re?{totalTokens:re.totalTokens,totalCost:re.totalCost}:{totalTokens:W?.totalTokens??0,totalCost:W?.totalCost??0},H=re?" (filtered)":"";return l`
    <div class="card session-detail-panel">
      <div class="session-detail-header">
        <div class="session-detail-header-left">
          <div class="session-detail-title">
            ${P}
            ${H?l`<span style="font-size: 11px; color: var(--muted); margin-left: 8px;">${H}</span>`:v}
          </div>
        </div>
        <div class="session-detail-stats">
          ${W?l`
            <span><strong>${B(E.totalTokens)}</strong> tokens${H}</span>
            <span><strong>${ee(E.totalCost)}</strong>${H}</span>
          `:v}
        </div>
        <button class="session-close-btn" @click=${X} title="Close session details">×</button>
      </div>
      <div class="session-detail-content">
        ${dh(e,re,r!=null&&c!=null&&h?ch(h,r,c):void 0)}
        <div class="session-detail-row">
          ${ph(t,n,s,i,a,o,p,g,d,r,c,u)}
        </div>
        <div class="session-detail-bottom">
          ${hh(h,f,m,w,S,A,k,C,_,T,ne?r:null,ne?c:null)}
          ${fh(e.contextWeight,W,M,Y)}
        </div>
      </div>
    </div>
  `}function ph(e,t,n,s,i,a,o,r,c,u,p,g){if(t)return l`
      <div class="session-timeseries-compact">
        <div class="muted" style="padding: 20px; text-align: center">Loading...</div>
      </div>
    `;if(!e||e.points.length<2)return l`
      <div class="session-timeseries-compact">
        <div class="muted" style="padding: 20px; text-align: center">No timeline data</div>
      </div>
    `;let d=e.points;if(o||r||c&&c.length>0){const U=o?new Date(o+"T00:00:00").getTime():0,ie=r?new Date(r+"T23:59:59").getTime():1/0;d=e.points.filter(ce=>{if(ce.timestamp<U||ce.timestamp>ie)return!1;if(c&&c.length>0){const he=new Date(ce.timestamp),Ee=`${he.getFullYear()}-${String(he.getMonth()+1).padStart(2,"0")}-${String(he.getDate()).padStart(2,"0")}`;return c.includes(Ee)}return!0})}if(d.length<2)return l`
      <div class="session-timeseries-compact">
        <div class="muted" style="padding: 20px; text-align: center">No data in range</div>
      </div>
    `;let h=0,f=0,m=0,w=0,S=0,A=0;d=d.map(U=>(h+=U.totalTokens,f+=U.cost,m+=U.output,w+=U.input,S+=U.cacheRead,A+=U.cacheWrite,{...U,cumulativeTokens:h,cumulativeCost:f}));const k=u!=null&&p!=null,C=k?Math.min(u,p):0,_=k?Math.max(u,p):1/0;let T=0,M=d.length;if(k){T=d.findIndex(ie=>ie.timestamp>=C),T===-1&&(T=d.length);const U=d.findIndex(ie=>ie.timestamp>_);M=U===-1?d.length:U}const Y=k?d.slice(T,M):d;let X=0,te=0,P=0,W=0;for(const U of Y)X+=U.output,te+=U.input,P+=U.cacheRead,W+=U.cacheWrite;const ne=400,re=100,E={top:8,right:4,bottom:14,left:30},H=ne-E.left-E.right,G=re-E.top-E.bottom,le=n==="cumulative",fe=n==="per-turn"&&i==="by-type",I=X+te+P+W,D=d.map(U=>le?U.cumulativeTokens:fe?U.input+U.output+U.cacheRead+U.cacheWrite:U.totalTokens),N=Math.max(...D,1),j=H/d.length,de=Math.min(oh,Math.max(1,j*ah)),Z=j-de,se=E.left+T*(de+Z),V=M>=d.length?E.left+(d.length-1)*(de+Z)+de:E.left+(M-1)*(de+Z)+de;return l`
    <div class="session-timeseries-compact">
      <div class="timeseries-header-row">
        <div class="card-title" style="font-size: 12px; color: var(--text);">Usage Over Time</div>
        <div class="timeseries-controls">
          ${k?l`
            <div class="chart-toggle small">
              <button class="toggle-btn active" @click=${()=>g?.(null,null)}>Reset</button>
            </div>
          `:v}
          <div class="chart-toggle small">
            <button
              class="toggle-btn ${le?"":"active"}"
              @click=${()=>s("per-turn")}
            >
              Per Turn
            </button>
            <button
              class="toggle-btn ${le?"active":""}"
              @click=${()=>s("cumulative")}
            >
              Cumulative
            </button>
          </div>
          ${le?v:l`
                  <div class="chart-toggle small">
                    <button
                      class="toggle-btn ${i==="total"?"active":""}"
                      @click=${()=>a("total")}
                    >
                      Total
                    </button>
                    <button
                      class="toggle-btn ${i==="by-type"?"active":""}"
                      @click=${()=>a("by-type")}
                    >
                      By Type
                    </button>
                  </div>
                `}
        </div>
      </div>
      <div class="timeseries-chart-wrapper" style="position: relative; cursor: crosshair;">
        <svg 
          viewBox="0 0 ${ne} ${re+18}" 
          class="timeseries-svg" 
          style="width: 100%; height: auto; display: block;"
        >
          <!-- Y axis -->
          <line x1="${E.left}" y1="${E.top}" x2="${E.left}" y2="${E.top+G}" stroke="var(--border)" />
          <!-- X axis -->
          <line x1="${E.left}" y1="${E.top+G}" x2="${ne-E.right}" y2="${E.top+G}" stroke="var(--border)" />
          <!-- Y axis labels -->
          <text x="${E.left-4}" y="${E.top+5}" text-anchor="end" class="ts-axis-label">${B(N)}</text>
          <text x="${E.left-4}" y="${E.top+G}" text-anchor="end" class="ts-axis-label">0</text>
          <!-- X axis labels (first and last) -->
          ${d.length>0?_t`
            <text x="${E.left}" y="${E.top+G+10}" text-anchor="start" class="ts-axis-label">${new Date(d[0].timestamp).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})}</text>
            <text x="${ne-E.right}" y="${E.top+G+10}" text-anchor="end" class="ts-axis-label">${new Date(d[d.length-1].timestamp).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})}</text>
          `:v}
          <!-- Bars -->
          ${d.map((U,ie)=>{const ce=D[ie],he=E.left+ie*(de+Z),Ee=ce/N*G,Ge=E.top+G-Ee,ve=[new Date(U.timestamp).toLocaleDateString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),`${B(ce)} tokens`];fe&&(ve.push(`Out ${B(U.output)}`),ve.push(`In ${B(U.input)}`),ve.push(`CW ${B(U.cacheWrite)}`),ve.push(`CR ${B(U.cacheRead)}`));const Ue=ve.join(" · "),Qe=k&&(ie<T||ie>=M);if(!fe)return _t`<rect x="${he}" y="${Ge}" width="${de}" height="${Ee}" class="ts-bar${Qe?" dimmed":""}" rx="1"><title>${Ue}</title></rect>`;const Ye=[{value:U.output,cls:"output"},{value:U.input,cls:"input"},{value:U.cacheWrite,cls:"cache-write"},{value:U.cacheRead,cls:"cache-read"}];let Ze=E.top+G;const dt=Qe?" dimmed":"";return _t`
              ${Ye.map(ut=>{if(ut.value<=0||ce<=0)return v;const At=Ee*(ut.value/ce);return Ze-=At,_t`<rect x="${he}" y="${Ze}" width="${de}" height="${At}" class="ts-bar ${ut.cls}${dt}" rx="1"><title>${Ue}</title></rect>`})}
            `})}
          <!-- Selection highlight overlay (always visible between handles) -->
          ${_t`
            <rect 
              x="${se}" 
              y="${E.top}" 
              width="${Math.max(1,V-se)}" 
              height="${G}" 
              fill="var(--accent)" 
              opacity="${rh}" 
              pointer-events="none"
            />
          `}
          <!-- Left cursor line + handle -->
          ${_t`
            <line x1="${se}" y1="${E.top}" x2="${se}" y2="${E.top+G}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
            <rect x="${se-cs/2}" y="${E.top+G/2-Ie/2}" width="${cs}" height="${Ie}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
            <line x1="${se-ft}" y1="${E.top+G/2-Ie/5}" x2="${se-ft}" y2="${E.top+G/2+Ie/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
            <line x1="${se+ft}" y1="${E.top+G/2-Ie/5}" x2="${se+ft}" y2="${E.top+G/2+Ie/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
          `}
          <!-- Right cursor line + handle -->
          ${_t`
            <line x1="${V}" y1="${E.top}" x2="${V}" y2="${E.top+G}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
            <rect x="${V-cs/2}" y="${E.top+G/2-Ie/2}" width="${cs}" height="${Ie}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
            <line x1="${V-ft}" y1="${E.top+G/2-Ie/5}" x2="${V-ft}" y2="${E.top+G/2+Ie/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
            <line x1="${V+ft}" y1="${E.top+G/2-Ie/5}" x2="${V+ft}" y2="${E.top+G/2+Ie/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
          `}
        </svg>
        <!-- Handle drag zones (only on handles, not full chart) -->
        ${(()=>{const U=`${(se/ne*100).toFixed(1)}%`,ie=`${(V/ne*100).toFixed(1)}%`,ce=he=>Ee=>{if(!g)return;Ee.preventDefault(),Ee.stopPropagation();const ct=Ee.currentTarget.closest(".timeseries-chart-wrapper")?.querySelector("svg");if(!ct)return;const ve=ct.getBoundingClientRect(),Ue=ve.width,Qe=E.left/ne*Ue,Ze=(ne-E.right)/ne*Ue-Qe,dt=He=>{const Ce=Math.max(0,Math.min(1,(He-ve.left-Qe)/Ze));return Math.min(Math.floor(Ce*d.length),d.length-1)},ut=he==="left"?se:V,At=ve.left+ut/ne*Ue,li=Ee.clientX-At;document.body.style.cursor="col-resize";const Jt=He=>{const Ce=He.clientX-li,fn=dt(Ce),Xt=d[fn];if(Xt)if(he==="left"){const pt=p??d[d.length-1].timestamp;g(Math.min(Xt.timestamp,pt),pt)}else{const pt=u??d[0].timestamp;g(pt,Math.max(Xt.timestamp,pt))}},gt=()=>{document.body.style.cursor="",document.removeEventListener("mousemove",Jt),document.removeEventListener("mouseup",gt)};document.addEventListener("mousemove",Jt),document.addEventListener("mouseup",gt)};return l`
            <div class="chart-handle-zone chart-handle-left" 
                 style="left: ${U};"
                 @mousedown=${ce("left")}></div>
            <div class="chart-handle-zone chart-handle-right" 
                 style="left: ${ie};"
                 @mousedown=${ce("right")}></div>
          `})()}
      </div>
      <div class="timeseries-summary">
        ${k?l`
              <span style="color: var(--accent);">▶ Turns ${T+1}–${M} of ${d.length}</span> · 
              ${new Date(C).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})}–${new Date(_).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})} · 
              ${B(X+te+P+W)} · 
              ${ee(Y.reduce((U,ie)=>U+(ie.cost||0),0))}
            `:l`${d.length} msgs · ${B(h)} · ${ee(f)}`}
      </div>
      ${fe?l`
              <div style="margin-top: 8px;">
                <div class="card-title" style="font-size: 12px; margin-bottom: 6px; color: var(--text);">Tokens by Type</div>
                <div class="cost-breakdown-bar" style="height: 18px;">
                  <div class="cost-segment output" style="width: ${bt(X,I).toFixed(1)}%"></div>
                  <div class="cost-segment input" style="width: ${bt(te,I).toFixed(1)}%"></div>
                  <div class="cost-segment cache-write" style="width: ${bt(W,I).toFixed(1)}%"></div>
                  <div class="cost-segment cache-read" style="width: ${bt(P,I).toFixed(1)}%"></div>
                </div>
                <div class="cost-breakdown-legend">
                  <div class="legend-item" title="Assistant output tokens">
                    <span class="legend-dot output"></span>Output ${B(X)}
                  </div>
                  <div class="legend-item" title="User + tool input tokens">
                    <span class="legend-dot input"></span>Input ${B(te)}
                  </div>
                  <div class="legend-item" title="Tokens written to cache">
                    <span class="legend-dot cache-write"></span>Cache Write ${B(W)}
                  </div>
                  <div class="legend-item" title="Tokens read from cache">
                    <span class="legend-dot cache-read"></span>Cache Read ${B(P)}
                  </div>
                </div>
                <div class="cost-breakdown-total">Total: ${B(I)}</div>
              </div>
            `:v}
    </div>
  `}function fh(e,t,n,s){if(!e)return l`
      <div class="context-details-panel">
        <div class="muted" style="padding: 20px; text-align: center">No context data</div>
      </div>
    `;const i=Mt(e.systemPrompt.chars),a=Mt(e.skills.promptChars),o=Mt(e.tools.listChars+e.tools.schemaChars),r=Mt(e.injectedWorkspaceFiles.reduce((k,C)=>k+C.injectedChars,0)),c=i+a+o+r;let u="";if(t&&t.totalTokens>0){const k=t.input+t.cacheRead;k>0&&(u=`~${Math.min(c/k*100,100).toFixed(0)}% of input`)}const p=e.skills.entries.toSorted((k,C)=>C.blockChars-k.blockChars),g=e.tools.entries.toSorted((k,C)=>C.summaryChars+C.schemaChars-(k.summaryChars+k.schemaChars)),d=e.injectedWorkspaceFiles.toSorted((k,C)=>C.injectedChars-k.injectedChars),h=4,f=n,m=f?p:p.slice(0,h),w=f?g:g.slice(0,h),S=f?d:d.slice(0,h),A=p.length>h||g.length>h||d.length>h;return l`
    <div class="context-details-panel">
      <div class="context-breakdown-header">
        <div class="card-title" style="font-size: 12px; color: var(--text);">System Prompt Breakdown</div>
        ${A?l`<button class="context-expand-btn" @click=${s}>
                ${f?"Collapse":"Expand all"}
              </button>`:v}
      </div>
      <p class="context-weight-desc">
        ${u||"Base context per message"}
      </p>
      <div class="context-stacked-bar">
        <div class="context-segment system" style="width: ${bt(i,c).toFixed(1)}%" title="System: ~${B(i)}"></div>
        <div class="context-segment skills" style="width: ${bt(a,c).toFixed(1)}%" title="Skills: ~${B(a)}"></div>
        <div class="context-segment tools" style="width: ${bt(o,c).toFixed(1)}%" title="Tools: ~${B(o)}"></div>
        <div class="context-segment files" style="width: ${bt(r,c).toFixed(1)}%" title="Files: ~${B(r)}"></div>
      </div>
      <div class="context-legend">
        <span class="legend-item"><span class="legend-dot system"></span>Sys ~${B(i)}</span>
        <span class="legend-item"><span class="legend-dot skills"></span>Skills ~${B(a)}</span>
        <span class="legend-item"><span class="legend-dot tools"></span>Tools ~${B(o)}</span>
        <span class="legend-item"><span class="legend-dot files"></span>Files ~${B(r)}</span>
      </div>
      <div class="context-total">Total: ~${B(c)}</div>
      <div class="context-breakdown-grid">
        ${p.length>0?(()=>{const k=p.length-m.length;return l`
                  <div class="context-breakdown-card">
                    <div class="context-breakdown-title">Skills (${p.length})</div>
                    <div class="context-breakdown-list">
                      ${m.map(C=>l`
                          <div class="context-breakdown-item">
                            <span class="mono">${C.name}</span>
                            <span class="muted">~${B(Mt(C.blockChars))}</span>
                          </div>
                        `)}
                    </div>
                    ${k>0?l`<div class="context-breakdown-more">+${k} more</div>`:v}
                  </div>
                `})():v}
        ${g.length>0?(()=>{const k=g.length-w.length;return l`
                  <div class="context-breakdown-card">
                    <div class="context-breakdown-title">Tools (${g.length})</div>
                    <div class="context-breakdown-list">
                      ${w.map(C=>l`
                          <div class="context-breakdown-item">
                            <span class="mono">${C.name}</span>
                            <span class="muted">~${B(Mt(C.summaryChars+C.schemaChars))}</span>
                          </div>
                        `)}
                    </div>
                    ${k>0?l`<div class="context-breakdown-more">+${k} more</div>`:v}
                  </div>
                `})():v}
        ${d.length>0?(()=>{const k=d.length-S.length;return l`
                  <div class="context-breakdown-card">
                    <div class="context-breakdown-title">Files (${d.length})</div>
                    <div class="context-breakdown-list">
                      ${S.map(C=>l`
                          <div class="context-breakdown-item">
                            <span class="mono">${C.name}</span>
                            <span class="muted">~${B(Mt(C.injectedChars))}</span>
                          </div>
                        `)}
                    </div>
                    ${k>0?l`<div class="context-breakdown-more">+${k} more</div>`:v}
                  </div>
                `})():v}
      </div>
    </div>
  `}function hh(e,t,n,s,i,a,o,r,c,u,p,g){if(t)return l`
      <div class="session-logs-compact">
        <div class="session-logs-header">Conversation</div>
        <div class="muted" style="padding: 20px; text-align: center">Loading...</div>
      </div>
    `;if(!e||e.length===0)return l`
      <div class="session-logs-compact">
        <div class="session-logs-header">Conversation</div>
        <div class="muted" style="padding: 20px; text-align: center">No messages</div>
      </div>
    `;const d=i.query.trim().toLowerCase(),h=e.map(_=>{const T=Lc(_.content),M=T.cleanContent||_.content;return{log:_,toolInfo:T,cleanContent:M}}),f=Array.from(new Set(h.flatMap(_=>_.toolInfo.tools.map(([T])=>T)))).toSorted((_,T)=>_.localeCompare(T)),m=h.filter(_=>{if(p!=null&&g!=null){const T=_.log.timestamp;if(T>0){const M=Math.min(p,g),Y=Math.max(p,g),X=Pc(T);if(X<M||X>Y)return!1}}return!(i.roles.length>0&&!i.roles.includes(_.log.role)||i.hasTools&&_.toolInfo.tools.length===0||i.tools.length>0&&!_.toolInfo.tools.some(([M])=>i.tools.includes(M))||d&&!_.cleanContent.toLowerCase().includes(d))}),w=i.roles.length>0||i.tools.length>0||i.hasTools||d,S=p!=null&&g!=null,A=w||S?`${m.length} of ${e.length} ${S?"(timeline filtered)":""}`:`${e.length}`,k=new Set(i.roles),C=new Set(i.tools);return l`
    <div class="session-logs-compact">
      <div class="session-logs-header">
        <span>Conversation <span style="font-weight: normal; color: var(--muted);">(${A} messages)</span></span>
        <button class="btn btn-sm usage-action-btn usage-secondary-btn" @click=${s}>
          ${n?"Collapse All":"Expand All"}
        </button>
      </div>
      <div class="usage-filters-inline" style="margin: 10px 12px;">
        <select
          multiple
          size="4"
          @change=${_=>a(Array.from(_.target.selectedOptions).map(T=>T.value))}
        >
          <option value="user" ?selected=${k.has("user")}>User</option>
          <option value="assistant" ?selected=${k.has("assistant")}>Assistant</option>
          <option value="tool" ?selected=${k.has("tool")}>Tool</option>
          <option value="toolResult" ?selected=${k.has("toolResult")}>Tool result</option>
        </select>
        <select
          multiple
          size="4"
          @change=${_=>o(Array.from(_.target.selectedOptions).map(T=>T.value))}
        >
          ${f.map(_=>l`<option value=${_} ?selected=${C.has(_)}>${_}</option>`)}
        </select>
        <label class="usage-filters-inline" style="gap: 6px;">
          <input
            type="checkbox"
            .checked=${i.hasTools}
            @change=${_=>r(_.target.checked)}
          />
          Has tools
        </label>
        <input
          type="text"
          placeholder="Search conversation"
          .value=${i.query}
          @input=${_=>c(_.target.value)}
        />
        <button class="btn btn-sm usage-action-btn usage-secondary-btn" @click=${u}>
          Clear
        </button>
      </div>
      <div class="session-logs-list">
        ${m.map(_=>{const{log:T,toolInfo:M,cleanContent:Y}=_,X=T.role==="user"?"user":"assistant",te=T.role==="user"?"You":T.role==="assistant"?"Assistant":"Tool";return l`
          <div class="session-log-entry ${X}">
            <div class="session-log-meta">
              <span class="session-log-role">${te}</span>
              <span>${new Date(T.timestamp).toLocaleString()}</span>
              ${T.tokens?l`<span>${B(T.tokens)}</span>`:v}
            </div>
            <div class="session-log-content">${Y}</div>
            ${M.tools.length>0?l`
                    <details class="session-log-tools" ?open=${n}>
                      <summary>${M.summary}</summary>
                      <div class="session-log-tools-list">
                        ${M.tools.map(([P,W])=>l`
                            <span class="session-log-tools-pill">${P} × ${W}</span>
                          `)}
                      </div>
                    </details>
                  `:v}
          </div>
        `})}
        ${m.length===0?l`
                <div class="muted" style="padding: 12px">No messages match the filters.</div>
              `:v}
      </div>
    </div>
  `}const vh=`
  .usage-page-header {
    margin: 4px 0 12px;
  }
  .usage-page-title {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
  }
  .usage-page-subtitle {
    font-size: 13px;
    color: var(--muted);
    margin: 0 0 12px;
  }
  /* ===== FILTERS & HEADER ===== */
  .usage-filters-inline {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
  .usage-filters-inline select {
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font-size: 13px;
  }
  .usage-filters-inline input[type="date"] {
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font-size: 13px;
  }
  .usage-filters-inline input[type="text"] {
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font-size: 13px;
    min-width: 180px;
  }
  .usage-filters-inline .btn-sm {
    padding: 6px 12px;
    font-size: 14px;
  }
  .usage-refresh-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: rgba(255, 77, 77, 0.1);
    border-radius: 4px;
    font-size: 12px;
    color: #ff4d4d;
  }
  .usage-refresh-indicator::before {
    content: "";
    width: 10px;
    height: 10px;
    border: 2px solid #ff4d4d;
    border-top-color: transparent;
    border-radius: 50%;
    animation: usage-spin 0.6s linear infinite;
  }
  @keyframes usage-spin {
    to { transform: rotate(360deg); }
  }
  .active-filters {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .filter-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px 4px 12px;
    background: var(--accent-subtle);
    border: 1px solid var(--accent);
    border-radius: 16px;
    font-size: 12px;
  }
  .filter-chip-label {
    color: var(--accent);
    font-weight: 500;
  }
  .filter-chip-remove {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    padding: 2px 4px;
    font-size: 14px;
    line-height: 1;
    opacity: 0.7;
    transition: opacity 0.15s;
  }
  .filter-chip-remove:hover {
    opacity: 1;
  }
  .filter-clear-btn {
    padding: 4px 10px !important;
    font-size: 12px !important;
    line-height: 1 !important;
    margin-left: 8px;
  }
  .usage-query-bar {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) auto;
    gap: 10px;
    align-items: center;
    /* Keep the dropdown filter row from visually touching the query row. */
    margin-bottom: 10px;
  }
  .usage-query-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: nowrap;
    justify-self: end;
  }
  .usage-query-actions .btn {
    height: 34px;
    padding: 0 14px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 13px;
    line-height: 1;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text);
    box-shadow: none;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .usage-query-actions .btn:hover {
    background: var(--bg);
    border-color: var(--border-strong);
  }
  .usage-action-btn {
    height: 34px;
    padding: 0 14px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 13px;
    line-height: 1;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text);
    box-shadow: none;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .usage-action-btn:hover {
    background: var(--bg);
    border-color: var(--border-strong);
  }
  .usage-primary-btn {
    background: #ff4d4d;
    color: #fff;
    border-color: #ff4d4d;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.12);
  }
  .btn.usage-primary-btn {
    background: #ff4d4d !important;
    border-color: #ff4d4d !important;
    color: #fff !important;
  }
  .usage-primary-btn:hover {
    background: #e64545;
    border-color: #e64545;
  }
  .btn.usage-primary-btn:hover {
    background: #e64545 !important;
    border-color: #e64545 !important;
  }
  .usage-primary-btn:disabled {
    background: rgba(255, 77, 77, 0.18);
    border-color: rgba(255, 77, 77, 0.3);
    color: #ff4d4d;
    box-shadow: none;
    cursor: default;
    opacity: 1;
  }
  .usage-primary-btn[disabled] {
    background: rgba(255, 77, 77, 0.18) !important;
    border-color: rgba(255, 77, 77, 0.3) !important;
    color: #ff4d4d !important;
    opacity: 1 !important;
  }
  .usage-secondary-btn {
    background: var(--bg-secondary);
    color: var(--text);
    border-color: var(--border);
  }
  .usage-query-input {
    width: 100%;
    min-width: 220px;
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font-size: 13px;
  }
  .usage-query-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  }
  .usage-query-suggestion {
    padding: 4px 8px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    font-size: 11px;
    color: var(--text);
    cursor: pointer;
    transition: background 0.15s;
  }
  .usage-query-suggestion:hover {
    background: var(--bg-hover);
  }
  .usage-filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin-top: 14px;
  }
  details.usage-filter-select {
    position: relative;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 6px 10px;
    background: var(--bg);
    font-size: 12px;
    min-width: 140px;
  }
  details.usage-filter-select summary {
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    font-weight: 500;
  }
  details.usage-filter-select summary::-webkit-details-marker {
    display: none;
  }
  .usage-filter-badge {
    font-size: 11px;
    color: var(--muted);
  }
  .usage-filter-popover {
    position: absolute;
    left: 0;
    top: calc(100% + 6px);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    min-width: 220px;
    z-index: 20;
  }
  .usage-filter-actions {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  }
  .usage-filter-actions button {
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 11px;
  }
  .usage-filter-options {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 200px;
    overflow: auto;
  }
  .usage-filter-option {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
  }
  .usage-query-hint {
    font-size: 11px;
    color: var(--muted);
  }
  .usage-query-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  }
  .usage-query-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    font-size: 11px;
  }
  .usage-query-chip button {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }
  .usage-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--bg);
  }
  .usage-header.pinned {
    position: sticky;
    top: 12px;
    z-index: 6;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  }
  .usage-pin-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    font-size: 11px;
    color: var(--text);
    cursor: pointer;
  }
  .usage-pin-btn.active {
    background: var(--accent-subtle);
    border-color: var(--accent);
    color: var(--accent);
  }
  .usage-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .usage-header-title {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .usage-header-metrics {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .usage-metric-badge {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: transparent;
    font-size: 11px;
    color: var(--muted);
  }
  .usage-metric-badge strong {
    font-size: 12px;
    color: var(--text);
  }
  .usage-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .usage-controls .active-filters {
    flex: 1 1 100%;
  }
  .usage-controls input[type="date"] {
    min-width: 140px;
  }
  .usage-presets {
    display: inline-flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .usage-presets .btn {
    padding: 4px 8px;
    font-size: 11px;
  }
  .usage-quick-filters {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
  .usage-select {
    min-width: 120px;
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font-size: 12px;
  }
  .usage-export-menu summary {
    cursor: pointer;
    font-weight: 500;
    color: var(--text);
    list-style: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .usage-export-menu summary::-webkit-details-marker {
    display: none;
  }
  .usage-export-menu {
    position: relative;
  }
  .usage-export-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg);
    font-size: 12px;
  }
  .usage-export-popover {
    position: absolute;
    right: 0;
    top: calc(100% + 6px);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    min-width: 160px;
    z-index: 10;
  }
  .usage-export-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .usage-export-item {
    text-align: left;
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    font-size: 12px;
  }
  .usage-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-top: 12px;
  }
  .usage-summary-card {
    padding: 12px;
    border-radius: 8px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
  }
  .usage-mosaic {
    margin-top: 16px;
    padding: 16px;
  }
  .usage-mosaic-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }
  .usage-mosaic-title {
    font-weight: 600;
  }
  .usage-mosaic-sub {
    font-size: 12px;
    color: var(--muted);
  }
  .usage-mosaic-grid {
    display: grid;
    grid-template-columns: minmax(200px, 1fr) minmax(260px, 2fr);
    gap: 16px;
    align-items: start;
  }
  .usage-mosaic-section {
    background: var(--bg-subtle);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px;
  }
  .usage-mosaic-section-title {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .usage-mosaic-total {
    font-size: 20px;
    font-weight: 700;
  }
  .usage-daypart-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: 8px;
  }
  .usage-daypart-cell {
    border-radius: 8px;
    padding: 10px;
    color: var(--text);
    background: rgba(255, 77, 77, 0.08);
    border: 1px solid rgba(255, 77, 77, 0.2);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .usage-daypart-label {
    font-size: 12px;
    font-weight: 600;
  }
  .usage-daypart-value {
    font-size: 14px;
  }
  .usage-hour-grid {
    display: grid;
    grid-template-columns: repeat(24, minmax(6px, 1fr));
    gap: 4px;
  }
  .usage-hour-cell {
    height: 28px;
    border-radius: 6px;
    background: rgba(255, 77, 77, 0.1);
    border: 1px solid rgba(255, 77, 77, 0.2);
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .usage-hour-cell.selected {
    border-color: rgba(255, 77, 77, 0.8);
    box-shadow: 0 0 0 2px rgba(255, 77, 77, 0.2);
  }
  .usage-hour-labels {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 6px;
    margin-top: 8px;
    font-size: 11px;
    color: var(--muted);
  }
  .usage-hour-legend {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 10px;
    font-size: 11px;
    color: var(--muted);
  }
  .usage-hour-legend span {
    display: inline-block;
    width: 14px;
    height: 10px;
    border-radius: 4px;
    background: rgba(255, 77, 77, 0.15);
    border: 1px solid rgba(255, 77, 77, 0.2);
  }
  .usage-calendar-labels {
    display: grid;
    grid-template-columns: repeat(7, minmax(10px, 1fr));
    gap: 6px;
    font-size: 10px;
    color: var(--muted);
    margin-bottom: 6px;
  }
  .usage-calendar {
    display: grid;
    grid-template-columns: repeat(7, minmax(10px, 1fr));
    gap: 6px;
  }
  .usage-calendar-cell {
    height: 18px;
    border-radius: 4px;
    border: 1px solid rgba(255, 77, 77, 0.2);
    background: rgba(255, 77, 77, 0.08);
  }
  .usage-calendar-cell.empty {
    background: transparent;
    border-color: transparent;
  }
  .usage-summary-title {
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 6px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .usage-info {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 6px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg);
    font-size: 10px;
    color: var(--muted);
    cursor: help;
  }
  .usage-summary-value {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-strong);
  }
  .usage-summary-value.good {
    color: #1f8f4e;
  }
  .usage-summary-value.warn {
    color: #c57a00;
  }
  .usage-summary-value.bad {
    color: #c9372c;
  }
  .usage-summary-hint {
    font-size: 10px;
    color: var(--muted);
    cursor: help;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0 6px;
    line-height: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .usage-summary-sub {
    font-size: 11px;
    color: var(--muted);
    margin-top: 4px;
  }
  .usage-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .usage-list-item {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 12px;
    color: var(--text);
    align-items: flex-start;
  }
  .usage-list-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    text-align: right;
  }
  .usage-list-sub {
    font-size: 11px;
    color: var(--muted);
  }
  .usage-list-item.button {
    border: none;
    background: transparent;
    padding: 0;
    text-align: left;
    cursor: pointer;
  }
  .usage-list-item.button:hover {
    color: var(--text-strong);
  }
`,mh=`
  .usage-list-item .muted {
    font-size: 11px;
  }
  .usage-error-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .usage-error-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
    align-items: center;
    font-size: 12px;
  }
  .usage-error-date {
    font-weight: 600;
  }
  .usage-error-rate {
    font-variant-numeric: tabular-nums;
  }
  .usage-error-sub {
    grid-column: 1 / -1;
    font-size: 11px;
    color: var(--muted);
  }
  .usage-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }
  .usage-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 8px;
    border: 1px solid var(--border);
    border-radius: 999px;
    font-size: 11px;
    background: var(--bg);
    color: var(--text);
  }
  .usage-meta-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }
  .usage-meta-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
  }
  .usage-meta-item span {
    color: var(--muted);
    font-size: 11px;
  }
  .usage-insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-top: 12px;
  }
  .usage-insight-card {
    padding: 14px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
  }
  .usage-insight-title {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .usage-insight-subtitle {
    font-size: 11px;
    color: var(--muted);
    margin-top: 6px;
  }
  /* ===== CHART TOGGLE ===== */
  .chart-toggle {
    display: flex;
    background: var(--bg);
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .chart-toggle .toggle-btn {
    padding: 6px 14px;
    font-size: 13px;
    background: transparent;
    border: none;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
  }
  .chart-toggle .toggle-btn:hover {
    color: var(--text);
  }
  .chart-toggle .toggle-btn.active {
    background: #ff4d4d;
    color: white;
  }
  .chart-toggle.small .toggle-btn {
    padding: 4px 8px;
    font-size: 11px;
  }
  .sessions-toggle {
    border-radius: 4px;
  }
  .sessions-toggle .toggle-btn {
    border-radius: 4px;
  }
  .daily-chart-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    margin-bottom: 6px;
  }

  /* ===== DAILY BAR CHART ===== */
  .daily-chart {
    margin-top: 12px;
  }
  .daily-chart-bars {
    display: flex;
    align-items: flex-end;
    height: 200px;
    gap: 4px;
    padding: 8px 4px 36px;
  }
  .daily-bar-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: flex-end;
    cursor: pointer;
    position: relative;
    border-radius: 4px 4px 0 0;
    transition: background 0.15s;
    min-width: 0;
  }
  .daily-bar-wrapper:hover {
    background: var(--bg-hover);
  }
  .daily-bar-wrapper.selected {
    background: var(--accent-subtle);
  }
  .daily-bar-wrapper.selected .daily-bar {
    background: var(--accent);
  }
  .daily-bar {
    width: 100%;
    max-width: var(--bar-max-width, 32px);
    background: #ff4d4d;
    border-radius: 3px 3px 0 0;
    min-height: 2px;
    transition: all 0.15s;
    overflow: hidden;
  }
  .daily-bar-wrapper:hover .daily-bar {
    background: #cc3d3d;
  }
  .daily-bar-label {
    position: absolute;
    bottom: -28px;
    font-size: 10px;
    color: var(--muted);
    white-space: nowrap;
    text-align: center;
    transform: rotate(-35deg);
    transform-origin: top center;
  }
  .daily-bar-total {
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: var(--muted);
    white-space: nowrap;
  }
  .daily-bar-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .daily-bar-wrapper:hover .daily-bar-tooltip {
    opacity: 1;
  }

  /* ===== COST/TOKEN BREAKDOWN BAR ===== */
  .cost-breakdown {
    margin-top: 18px;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 8px;
  }
  .cost-breakdown-header {
    font-weight: 600;
    font-size: 15px;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
    color: var(--text-strong);
  }
  .cost-breakdown-bar {
    height: 28px;
    background: var(--bg);
    border-radius: 6px;
    overflow: hidden;
    display: flex;
  }
  .cost-segment {
    height: 100%;
    transition: width 0.3s ease;
    position: relative;
  }
  .cost-segment.output {
    background: #ef4444;
  }
  .cost-segment.input {
    background: #f59e0b;
  }
  .cost-segment.cache-write {
    background: #10b981;
  }
  .cost-segment.cache-read {
    background: #06b6d4;
  }
  .cost-breakdown-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 12px;
  }
  .cost-breakdown-total {
    margin-top: 10px;
    font-size: 12px;
    color: var(--muted);
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text);
    cursor: help;
  }
  .legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .legend-dot.output {
    background: #ef4444;
  }
  .legend-dot.input {
    background: #f59e0b;
  }
  .legend-dot.cache-write {
    background: #10b981;
  }
  .legend-dot.cache-read {
    background: #06b6d4;
  }
  .legend-dot.system {
    background: #ff4d4d;
  }
  .legend-dot.skills {
    background: #8b5cf6;
  }
  .legend-dot.tools {
    background: #ec4899;
  }
  .legend-dot.files {
    background: #f59e0b;
  }
  .cost-breakdown-note {
    margin-top: 10px;
    font-size: 11px;
    color: var(--muted);
    line-height: 1.4;
  }

  /* ===== SESSION BARS (scrollable list) ===== */
  .session-bars {
    margin-top: 16px;
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
  }
  .session-bar-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.15s;
  }
  .session-bar-row:last-child {
    border-bottom: none;
  }
  .session-bar-row:hover {
    background: var(--bg-hover);
  }
  .session-bar-row.selected {
    background: var(--accent-subtle);
  }
  .session-bar-label {
    flex: 1 1 auto;
    min-width: 0;
    font-size: 13px;
    color: var(--text);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .session-bar-title {
    /* Prefer showing the full name; wrap instead of truncating. */
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
  .session-bar-meta {
    font-size: 10px;
    color: var(--muted);
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .session-bar-track {
    flex: 0 0 90px;
    height: 6px;
    background: var(--bg-secondary);
    border-radius: 4px;
    overflow: hidden;
    opacity: 0.6;
  }
  .session-bar-fill {
    height: 100%;
    background: rgba(255, 77, 77, 0.7);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  .session-bar-value {
    flex: 0 0 70px;
    text-align: right;
    font-size: 12px;
    font-family: var(--font-mono);
    color: var(--muted);
  }
  .session-bar-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex: 0 0 auto;
  }
  .session-copy-btn {
    height: 26px;
    padding: 0 10px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .session-copy-btn:hover {
    background: var(--bg);
    border-color: var(--border-strong);
    color: var(--text);
  }

  /* ===== TIME SERIES CHART ===== */
  .session-timeseries {
    margin-top: 24px;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 8px;
  }
  .timeseries-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .timeseries-controls {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .timeseries-header {
    font-weight: 600;
    color: var(--text);
  }
  .timeseries-chart {
    width: 100%;
    overflow: hidden;
  }
  .timeseries-svg {
    width: 100%;
    height: auto;
    display: block;
  }
  .timeseries-svg .axis-label {
    font-size: 10px;
    fill: var(--muted);
  }
  .timeseries-svg .ts-area {
    fill: #ff4d4d;
    fill-opacity: 0.1;
  }
  .timeseries-svg .ts-line {
    fill: none;
    stroke: #ff4d4d;
    stroke-width: 2;
  }
  .timeseries-svg .ts-dot {
    fill: #ff4d4d;
    transition: r 0.15s, fill 0.15s;
  }
  .timeseries-svg .ts-dot:hover {
    r: 5;
  }
  .timeseries-svg .ts-bar {
    fill: #ff4d4d;
    transition: fill 0.15s;
  }
  .timeseries-svg .ts-bar:hover {
    fill: #cc3d3d;
  }
  .timeseries-svg .ts-bar.output { fill: #ef4444; }
  .timeseries-svg .ts-bar.input { fill: #f59e0b; }
  .timeseries-svg .ts-bar.cache-write { fill: #10b981; }
  .timeseries-svg .ts-bar.cache-read { fill: #06b6d4; }
  .timeseries-summary {
    margin-top: 12px;
    font-size: 13px;
    color: var(--muted);
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .timeseries-loading {
    padding: 24px;
    text-align: center;
    color: var(--muted);
  }

  /* ===== SESSION LOGS ===== */
  .session-logs {
    margin-top: 24px;
    background: var(--bg-secondary);
    border-radius: 8px;
    overflow: hidden;
  }
  .session-logs-header {
    padding: 10px 14px;
    font-weight: 600;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    background: var(--bg-secondary);
  }
  .session-logs-loading {
    padding: 24px;
    text-align: center;
    color: var(--muted);
  }
  .session-logs-list {
    max-height: 400px;
    overflow-y: auto;
  }
  .session-log-entry {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: var(--bg);
  }
  .session-log-entry:last-child {
    border-bottom: none;
  }
  .session-log-entry.user {
    border-left: 3px solid var(--accent);
  }
  .session-log-entry.assistant {
    border-left: 3px solid var(--border-strong);
  }
  .session-log-meta {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 11px;
    color: var(--muted);
    flex-wrap: wrap;
  }
  .session-log-role {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 999px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
  }
  .session-log-entry.user .session-log-role {
    color: var(--accent);
  }
  .session-log-entry.assistant .session-log-role {
    color: var(--muted);
  }
  .session-log-content {
    font-size: 13px;
    line-height: 1.5;
    color: var(--text);
    white-space: pre-wrap;
    word-break: break-word;
    background: var(--bg-secondary);
    border-radius: 8px;
    padding: 8px 10px;
    border: 1px solid var(--border);
    max-height: 220px;
    overflow-y: auto;
  }

  /* ===== CONTEXT WEIGHT BREAKDOWN ===== */
  .context-weight-breakdown {
    margin-top: 24px;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 8px;
  }
  .context-weight-breakdown .context-weight-header {
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 4px;
    color: var(--text);
  }
  .context-weight-desc {
    font-size: 12px;
    color: var(--muted);
    margin: 0 0 12px 0;
  }
  .context-stacked-bar {
    height: 24px;
    background: var(--bg);
    border-radius: 6px;
    overflow: hidden;
    display: flex;
  }
  .context-segment {
    height: 100%;
    transition: width 0.3s ease;
  }
  .context-segment.system {
    background: #ff4d4d;
  }
  .context-segment.skills {
    background: #8b5cf6;
  }
  .context-segment.tools {
    background: #ec4899;
  }
  .context-segment.files {
    background: #f59e0b;
  }
  .context-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 12px;
  }
  .context-total {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
  }
  .context-details {
    margin-top: 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
  }
  .context-details summary {
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }
  .context-details[open] summary {
    border-bottom: 1px solid var(--border);
  }
  .context-list {
    max-height: 200px;
    overflow-y: auto;
  }
  .context-list-header {
    display: flex;
    justify-content: space-between;
    padding: 8px 14px;
    font-size: 11px;
    text-transform: uppercase;
    color: var(--muted);
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
  }
  .context-list-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 14px;
    font-size: 12px;
    border-bottom: 1px solid var(--border);
  }
  .context-list-item:last-child {
    border-bottom: none;
  }
  .context-list-item .mono {
    font-family: var(--font-mono);
    color: var(--text);
  }
  .context-list-item .muted {
    color: var(--muted);
    font-family: var(--font-mono);
  }

  /* ===== NO CONTEXT NOTE ===== */
  .no-context-note {
    margin-top: 24px;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 8px;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.5;
  }

  /* ===== TWO COLUMN LAYOUT ===== */
  .usage-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-top: 18px;
    align-items: stretch;
  }
  .usage-grid-left {
    display: flex;
    flex-direction: column;
  }
  .usage-grid-right {
    display: flex;
    flex-direction: column;
  }
  
  /* ===== LEFT CARD (Daily + Breakdown) ===== */
  .usage-left-card {
    /* inherits background, border, shadow from .card */
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .usage-left-card .daily-chart-bars {
    flex: 1;
    min-height: 200px;
  }
  .usage-left-card .sessions-panel-title {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 12px;
  }
`,bh=`
  
  /* ===== COMPACT DAILY CHART ===== */
  .daily-chart-compact {
    margin-bottom: 16px;
  }
  .daily-chart-compact .sessions-panel-title {
    margin-bottom: 8px;
  }
  .daily-chart-compact .daily-chart-bars {
    height: 100px;
    padding-bottom: 20px;
  }
  
  /* ===== COMPACT COST BREAKDOWN ===== */
  .cost-breakdown-compact {
    padding: 0;
    margin: 0;
    background: transparent;
    border-top: 1px solid var(--border);
    padding-top: 12px;
  }
  .cost-breakdown-compact .cost-breakdown-header {
    margin-bottom: 8px;
  }
  .cost-breakdown-compact .cost-breakdown-legend {
    gap: 12px;
  }
  .cost-breakdown-compact .cost-breakdown-note {
    display: none;
  }
  
  /* ===== SESSIONS CARD ===== */
  .sessions-card {
    /* inherits background, border, shadow from .card */
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .sessions-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .sessions-card-title {
    font-weight: 600;
    font-size: 14px;
  }
  .sessions-card-count {
    font-size: 12px;
    color: var(--muted);
  }
  .sessions-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 8px 0 10px;
    font-size: 12px;
    color: var(--muted);
  }
  .sessions-card-stats {
    display: inline-flex;
    gap: 12px;
  }
  .sessions-sort {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--muted);
  }
  .sessions-sort select {
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text);
    font-size: 12px;
  }
  .sessions-action-btn {
    height: 28px;
    padding: 0 10px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 1;
  }
  .sessions-action-btn.icon {
    width: 32px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .sessions-card-hint {
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .sessions-card .session-bars {
    max-height: 280px;
    background: var(--bg);
    border-radius: 6px;
    border: 1px solid var(--border);
    margin: 0;
    overflow-y: auto;
    padding: 8px;
  }
  .sessions-card .session-bar-row {
    padding: 6px 8px;
    border-radius: 6px;
    margin-bottom: 3px;
    border: 1px solid transparent;
    transition: all 0.15s;
  }
  .sessions-card .session-bar-row:hover {
    border-color: var(--border);
    background: var(--bg-hover);
  }
  .sessions-card .session-bar-row.selected {
    border-color: var(--accent);
    background: var(--accent-subtle);
    box-shadow: inset 0 0 0 1px rgba(255, 77, 77, 0.15);
  }
  .sessions-card .session-bar-label {
    flex: 1 1 auto;
    min-width: 140px;
    font-size: 12px;
  }
  .sessions-card .session-bar-value {
    flex: 0 0 60px;
    font-size: 11px;
    font-weight: 600;
  }
  .sessions-card .session-bar-track {
    flex: 0 0 70px;
    height: 5px;
    opacity: 0.5;
  }
  .sessions-card .session-bar-fill {
    background: rgba(255, 77, 77, 0.55);
  }
  .sessions-clear-btn {
    margin-left: auto;
  }
  
  /* ===== EMPTY DETAIL STATE ===== */
  .session-detail-empty {
    margin-top: 18px;
    background: var(--bg-secondary);
    border-radius: 8px;
    border: 2px dashed var(--border);
    padding: 32px;
    text-align: center;
  }
  .session-detail-empty-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 8px;
  }
  .session-detail-empty-desc {
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 16px;
    line-height: 1.5;
  }
  .session-detail-empty-features {
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
  }
  .session-detail-empty-feature {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--muted);
  }
  .session-detail-empty-feature .icon {
    font-size: 16px;
  }
  
  /* ===== SESSION DETAIL PANEL ===== */
  .session-detail-panel {
    margin-top: 12px;
    /* inherits background, border-radius, shadow from .card */
    border: 2px solid var(--accent) !important;
  }
  .session-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
  }
  .session-detail-header:hover {
    background: var(--bg-hover);
  }
  .session-detail-title {
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .session-detail-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .session-close-btn {
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
    cursor: pointer;
    padding: 2px 8px;
    font-size: 16px;
    line-height: 1;
    border-radius: 4px;
    transition: background 0.15s, color 0.15s;
  }
  .session-close-btn:hover {
    background: var(--bg-hover);
    color: var(--text);
    border-color: var(--accent);
  }
  .session-detail-stats {
    display: flex;
    gap: 10px;
    font-size: 12px;
    color: var(--muted);
  }
  .session-detail-stats strong {
    color: var(--text);
    font-family: var(--font-mono);
  }
  .session-detail-content {
    padding: 12px;
  }
  .session-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
    margin-bottom: 12px;
  }
  .session-summary-card {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px;
    background: var(--bg-secondary);
  }
  .session-summary-title {
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 4px;
  }
  .session-summary-value {
    font-size: 14px;
    font-weight: 600;
  }
  .session-summary-meta {
    font-size: 11px;
    color: var(--muted);
    margin-top: 4px;
  }
  .session-detail-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    /* Separate "Usage Over Time" from the summary + Top Tools/Model Mix cards above. */
    margin-top: 12px;
    margin-bottom: 10px;
  }
  .session-detail-bottom {
    display: grid;
    grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr);
    gap: 10px;
    align-items: stretch;
  }
  .session-detail-bottom .session-logs-compact {
    margin: 0;
    display: flex;
    flex-direction: column;
  }
  .session-detail-bottom .session-logs-compact .session-logs-list {
    flex: 1 1 auto;
    max-height: none;
  }
  .context-details-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: var(--bg);
    border-radius: 6px;
    border: 1px solid var(--border);
    padding: 12px;
  }
  .context-breakdown-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 10px;
    margin-top: 8px;
  }
  .context-breakdown-card {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px;
    background: var(--bg-secondary);
  }
  .context-breakdown-title {
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .context-breakdown-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 11px;
  }
  .context-breakdown-item {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }
  .context-breakdown-more {
    font-size: 10px;
    color: var(--muted);
    margin-top: 4px;
  }
  .context-breakdown-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .context-expand-btn {
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--muted);
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .context-expand-btn:hover {
    color: var(--text);
    border-color: var(--border-strong);
    background: var(--bg);
  }
  
  /* ===== COMPACT TIMESERIES ===== */
  .session-timeseries-compact {
    background: var(--bg);
    border-radius: 6px;
    border: 1px solid var(--border);
    padding: 12px;
    margin: 0;
  }
  .session-timeseries-compact .timeseries-header-row {
    margin-bottom: 8px;
  }
  .session-timeseries-compact .timeseries-header {
    font-size: 12px;
  }
  .session-timeseries-compact .timeseries-summary {
    font-size: 11px;
    margin-top: 8px;
  }
  
  /* ===== COMPACT CONTEXT ===== */
  .context-weight-compact {
    background: var(--bg);
    border-radius: 6px;
    border: 1px solid var(--border);
    padding: 12px;
    margin: 0;
  }
  .context-weight-compact .context-weight-header {
    font-size: 12px;
    margin-bottom: 4px;
  }
  .context-weight-compact .context-weight-desc {
    font-size: 11px;
    margin-bottom: 8px;
  }
  .context-weight-compact .context-stacked-bar {
    height: 16px;
  }
  .context-weight-compact .context-legend {
    font-size: 11px;
    gap: 10px;
    margin-top: 8px;
  }
  .context-weight-compact .context-total {
    font-size: 11px;
    margin-top: 6px;
  }
  .context-weight-compact .context-details {
    margin-top: 8px;
  }
  .context-weight-compact .context-details summary {
    font-size: 12px;
    padding: 6px 10px;
  }
  
  /* ===== COMPACT LOGS ===== */
  .session-logs-compact {
    background: var(--bg);
    border-radius: 10px;
    border: 1px solid var(--border);
    overflow: hidden;
    margin: 0;
    display: flex;
    flex-direction: column;
  }
  .session-logs-compact .session-logs-header {
    padding: 10px 12px;
    font-size: 12px;
  }
  .session-logs-compact .session-logs-list {
    max-height: none;
    flex: 1 1 auto;
    overflow: auto;
  }
  .session-logs-compact .session-log-entry {
    padding: 8px 12px;
  }
  .session-logs-compact .session-log-content {
    font-size: 12px;
    max-height: 160px;
  }
  .session-log-tools {
    margin-top: 6px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-secondary);
    padding: 6px 8px;
    font-size: 11px;
    color: var(--text);
  }
  .session-log-tools summary {
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
  }
  .session-log-tools summary::-webkit-details-marker {
    display: none;
  }
  .session-log-tools-list {
    margin-top: 6px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .session-log-tools-pill {
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 2px 8px;
    font-size: 10px;
    background: var(--bg);
    color: var(--text);
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 900px) {
    .usage-grid {
      grid-template-columns: 1fr;
    }
    .session-detail-row {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 600px) {
    .session-bar-label {
      flex: 0 0 100px;
    }
    .cost-breakdown-legend {
      gap: 10px;
    }
    .legend-item {
      font-size: 11px;
    }
    .daily-chart-bars {
      height: 170px;
      gap: 6px;
      padding-bottom: 40px;
    }
    .daily-bar-label {
      font-size: 8px;
      bottom: -30px;
      transform: rotate(-45deg);
    }
    .usage-mosaic-grid {
      grid-template-columns: 1fr;
    }
    .usage-hour-grid {
      grid-template-columns: repeat(12, minmax(10px, 1fr));
    }
    .usage-hour-cell {
      height: 22px;
    }
  }

  /* ===== CHART AXIS ===== */
  .ts-axis-label {
    font-size: 5px;
    fill: var(--muted);
  }

  /* ===== RANGE SELECTION HANDLES ===== */
  .chart-handle-zone {
    position: absolute;
    top: 0;
    width: 16px;
    height: 100%;
    cursor: col-resize;
    z-index: 10;
    transform: translateX(-50%);
  }

  .timeseries-chart-wrapper {
    position: relative;
  }

  .timeseries-reset-btn {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 2px 10px;
    font-size: 11px;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s ease;
    margin-left: 8px;
  }

  .timeseries-reset-btn:hover {
    background: var(--bg-hover);
    color: var(--text);
    border-color: var(--border-strong);
  }
`,yh=[vh,mh,bh].join(`
`);function xh(e){if(e.loading&&!e.totals)return l`
      <style>
        @keyframes initial-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes initial-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      </style>
      <section class="card">
        <div class="row" style="justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div style="flex: 1; min-width: 250px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 2px;">
              <div class="card-title" style="margin: 0;">Token Usage</div>
              <span style="
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                background: rgba(255, 77, 77, 0.1);
                border-radius: 4px;
                font-size: 12px;
                color: #ff4d4d;
              ">
                <span style="
                  width: 10px;
                  height: 10px;
                  border: 2px solid #ff4d4d;
                  border-top-color: transparent;
                  border-radius: 50%;
                  animation: initial-spin 0.6s linear infinite;
                "></span>
                Loading
              </span>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
            <div style="display: flex; gap: 8px; align-items: center;">
              <input type="date" .value=${e.startDate} disabled style="padding: 6px 10px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); color: var(--text); font-size: 13px; opacity: 0.6;" />
              <span style="color: var(--muted);">to</span>
              <input type="date" .value=${e.endDate} disabled style="padding: 6px 10px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); color: var(--text); font-size: 13px; opacity: 0.6;" />
            </div>
          </div>
        </div>
      </section>
    `;const t=e.chartMode==="tokens",n=e.query.trim().length>0,s=e.queryDraft.trim().length>0,i=[...e.sessions].toSorted((I,D)=>{const N=t?I.usage?.totalTokens??0:I.usage?.totalCost??0;return(t?D.usage?.totalTokens??0:D.usage?.totalCost??0)-N}),a=e.selectedDays.length>0?i.filter(I=>{if(I.usage?.activityDates?.length)return I.usage.activityDates.some(j=>e.selectedDays.includes(j));if(!I.updatedAt)return!1;const D=new Date(I.updatedAt),N=`${D.getFullYear()}-${String(D.getMonth()+1).padStart(2,"0")}-${String(D.getDate()).padStart(2,"0")}`;return e.selectedDays.includes(N)}):i,o=(I,D)=>{if(D.length===0)return!0;const N=I.usage,j=N?.firstActivity??I.updatedAt,de=N?.lastActivity??I.updatedAt;if(!j||!de)return!1;const Z=Math.min(j,de),se=Math.max(j,de);let V=Z;for(;V<=se;){const U=new Date(V),ie=Ga(U,e.timeZone);if(D.includes(ie))return!0;const ce=Qa(U,e.timeZone);V=Math.min(ce.getTime(),se)+1}return!1},r=e.selectedHours.length>0?a.filter(I=>o(I,e.selectedHours)):a,c=Df(r,e.query),u=c.sessions,p=c.warnings,g=Yf(e.queryDraft,i,e.aggregates),d=qa(e.query),h=I=>{const D=Ot(I);return d.filter(N=>Ot(N.key??"")===D).map(N=>N.value).filter(Boolean)},f=I=>{const D=new Set;for(const N of I)N&&D.add(N);return Array.from(D)},m=f(i.map(I=>I.agentId)).slice(0,12),w=f(i.map(I=>I.channel)).slice(0,12),S=f([...i.map(I=>I.modelProvider),...i.map(I=>I.providerOverride),...e.aggregates?.byProvider.map(I=>I.provider)??[]]).slice(0,12),A=f([...i.map(I=>I.model),...e.aggregates?.byModel.map(I=>I.model)??[]]).slice(0,12),k=f(e.aggregates?.tools.tools.map(I=>I.name)??[]).slice(0,12),C=e.selectedSessions.length===1?e.sessions.find(I=>I.key===e.selectedSessions[0])??u.find(I=>I.key===e.selectedSessions[0]):null,_=I=>I.reduce((D,N)=>(N.usage&&(D.input+=N.usage.input,D.output+=N.usage.output,D.cacheRead+=N.usage.cacheRead,D.cacheWrite+=N.usage.cacheWrite,D.totalTokens+=N.usage.totalTokens,D.totalCost+=N.usage.totalCost,D.inputCost+=N.usage.inputCost??0,D.outputCost+=N.usage.outputCost??0,D.cacheReadCost+=N.usage.cacheReadCost??0,D.cacheWriteCost+=N.usage.cacheWriteCost??0,D.missingCostEntries+=N.usage.missingCostEntries??0),D),{input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}),T=I=>e.costDaily.filter(N=>I.includes(N.date)).reduce((N,j)=>(N.input+=j.input,N.output+=j.output,N.cacheRead+=j.cacheRead,N.cacheWrite+=j.cacheWrite,N.totalTokens+=j.totalTokens,N.totalCost+=j.totalCost,N.inputCost+=j.inputCost??0,N.outputCost+=j.outputCost??0,N.cacheReadCost+=j.cacheReadCost??0,N.cacheWriteCost+=j.cacheWriteCost??0,N),{input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0});let M,Y;const X=i.length;if(e.selectedSessions.length>0){const I=u.filter(D=>e.selectedSessions.includes(D.key));M=_(I),Y=I.length}else e.selectedDays.length>0&&e.selectedHours.length===0?(M=T(e.selectedDays),Y=u.length):e.selectedHours.length>0||n?(M=_(u),Y=u.length):(M=e.totals,Y=X);const te=e.selectedSessions.length>0?u.filter(I=>e.selectedSessions.includes(I.key)):n||e.selectedHours.length>0?u:e.selectedDays.length>0?a:i,P=Wf(te,e.aggregates),W=e.selectedSessions.length>0?(()=>{const I=u.filter(N=>e.selectedSessions.includes(N.key)),D=new Set;for(const N of I)for(const j of N.usage?.activityDates??[])D.add(j);return D.size>0?e.costDaily.filter(N=>D.has(N.date)):e.costDaily})():e.costDaily,ne=Vf(te,M,P),re=!e.loading&&!e.totals&&e.sessions.length===0,E=(M?.missingCostEntries??0)>0||(M?M.totalTokens>0&&M.totalCost===0&&M.input+M.output+M.cacheRead+M.cacheWrite>0:!1),H=[{label:"Today",days:1},{label:"7d",days:7},{label:"30d",days:30}],G=I=>{const D=new Date,N=new Date;N.setDate(N.getDate()-(I-1)),e.onStartDateChange(Ci(N)),e.onEndDateChange(Ci(D))},le=(I,D,N)=>{if(N.length===0)return v;const j=h(I),de=new Set(j.map(V=>Ot(V))),Z=N.length>0&&N.every(V=>de.has(Ot(V))),se=j.length;return l`
      <details
        class="usage-filter-select"
        @toggle=${V=>{const U=V.currentTarget;if(!U.open)return;const ie=ce=>{ce.composedPath().includes(U)||(U.open=!1,window.removeEventListener("click",ie,!0))};window.addEventListener("click",ie,!0)}}
      >
        <summary>
          <span>${D}</span>
          ${se>0?l`<span class="usage-filter-badge">${se}</span>`:l`
                  <span class="usage-filter-badge">All</span>
                `}
        </summary>
        <div class="usage-filter-popover">
          <div class="usage-filter-actions">
            <button
              class="btn btn-sm"
              @click=${V=>{V.preventDefault(),V.stopPropagation(),e.onQueryDraftChange(br(e.queryDraft,I,N))}}
              ?disabled=${Z}
            >
              Select All
            </button>
            <button
              class="btn btn-sm"
              @click=${V=>{V.preventDefault(),V.stopPropagation(),e.onQueryDraftChange(br(e.queryDraft,I,[]))}}
              ?disabled=${se===0}
            >
              Clear
            </button>
          </div>
          <div class="usage-filter-options">
            ${N.map(V=>{const U=de.has(Ot(V));return l`
                <label class="usage-filter-option">
                  <input
                    type="checkbox"
                    .checked=${U}
                    @change=${ie=>{const ce=ie.target,he=`${I}:${V}`;e.onQueryDraftChange(ce.checked?Jf(e.queryDraft,he):mr(e.queryDraft,he))}}
                  />
                  <span>${V}</span>
                </label>
              `})}
          </div>
        </div>
      </details>
    `},fe=Ci(new Date);return l`
    <style>${yh}</style>

    <section class="usage-page-header">
      <div class="usage-page-title">Usage</div>
      <div class="usage-page-subtitle">See where tokens go, when sessions spike, and what drives cost.</div>
    </section>

    <section class="card usage-header ${e.headerPinned?"pinned":""}">
      <div class="usage-header-row">
        <div class="usage-header-title">
          <div class="card-title" style="margin: 0;">Filters</div>
          ${e.loading?l`
                  <span class="usage-refresh-indicator">Loading</span>
                `:v}
          ${re?l`
                  <span class="usage-query-hint">Select a date range and click Refresh to load usage.</span>
                `:v}
        </div>
        <div class="usage-header-metrics">
          ${M?l`
                <span class="usage-metric-badge">
                  <strong>${B(M.totalTokens)}</strong> tokens
                </span>
                <span class="usage-metric-badge">
                  <strong>${ee(M.totalCost)}</strong> cost
                </span>
                <span class="usage-metric-badge">
                  <strong>${Y}</strong>
                  session${Y!==1?"s":""}
                </span>
              `:v}
          <button
            class="usage-pin-btn ${e.headerPinned?"active":""}"
            title=${e.headerPinned?"Unpin filters":"Pin filters"}
            @click=${e.onToggleHeaderPinned}
          >
            ${e.headerPinned?"Pinned":"Pin"}
          </button>
          <details
            class="usage-export-menu"
            @toggle=${I=>{const D=I.currentTarget;if(!D.open)return;const N=j=>{j.composedPath().includes(D)||(D.open=!1,window.removeEventListener("click",N,!0))};window.addEventListener("click",N,!0)}}
          >
            <summary class="usage-export-button">Export ▾</summary>
            <div class="usage-export-popover">
              <div class="usage-export-list">
                <button
                  class="usage-export-item"
                  @click=${()=>Ti(`openclaw-usage-sessions-${fe}.csv`,Gf(u),"text/csv")}
                  ?disabled=${u.length===0}
                >
                  Sessions CSV
                </button>
                <button
                  class="usage-export-item"
                  @click=${()=>Ti(`openclaw-usage-daily-${fe}.csv`,Qf(W),"text/csv")}
                  ?disabled=${W.length===0}
                >
                  Daily CSV
                </button>
                <button
                  class="usage-export-item"
                  @click=${()=>Ti(`openclaw-usage-${fe}.json`,JSON.stringify({totals:M,sessions:u,daily:W,aggregates:P},null,2),"application/json")}
                  ?disabled=${u.length===0&&W.length===0}
                >
                  JSON
                </button>
              </div>
            </div>
          </details>
        </div>
      </div>
      <div class="usage-header-row">
        <div class="usage-controls">
          ${eh(e.selectedDays,e.selectedHours,e.selectedSessions,e.sessions,e.onClearDays,e.onClearHours,e.onClearSessions,e.onClearFilters)}
          <div class="usage-presets">
            ${H.map(I=>l`
                <button class="btn btn-sm" @click=${()=>G(I.days)}>
                  ${I.label}
                </button>
              `)}
          </div>
          <input
            type="date"
            .value=${e.startDate}
            title="Start Date"
            @change=${I=>e.onStartDateChange(I.target.value)}
          />
          <span style="color: var(--muted);">to</span>
          <input
            type="date"
            .value=${e.endDate}
            title="End Date"
            @change=${I=>e.onEndDateChange(I.target.value)}
          />
          <select
            title="Time zone"
            .value=${e.timeZone}
            @change=${I=>e.onTimeZoneChange(I.target.value)}
          >
            <option value="local">Local</option>
            <option value="utc">UTC</option>
          </select>
          <div class="chart-toggle">
            <button
              class="toggle-btn ${t?"active":""}"
              @click=${()=>e.onChartModeChange("tokens")}
            >
              Tokens
            </button>
            <button
              class="toggle-btn ${t?"":"active"}"
              @click=${()=>e.onChartModeChange("cost")}
            >
              Cost
            </button>
          </div>
          <button
            class="btn btn-sm usage-action-btn usage-primary-btn"
            @click=${e.onRefresh}
            ?disabled=${e.loading}
          >
            Refresh
          </button>
        </div>
        
      </div>

      <div style="margin-top: 12px;">
          <div class="usage-query-bar">
          <input
            class="usage-query-input"
            type="text"
            .value=${e.queryDraft}
            placeholder="Filter sessions (e.g. key:agent:main:cron* model:gpt-4o has:errors minTokens:2000)"
            @input=${I=>e.onQueryDraftChange(I.target.value)}
            @keydown=${I=>{I.key==="Enter"&&(I.preventDefault(),e.onApplyQuery())}}
          />
          <div class="usage-query-actions">
            <button
              class="btn btn-sm usage-action-btn usage-secondary-btn"
              @click=${e.onApplyQuery}
              ?disabled=${e.loading||!s&&!n}
            >
              Filter (client-side)
            </button>
            ${s||n?l`<button class="btn btn-sm usage-action-btn usage-secondary-btn" @click=${e.onClearQuery}>Clear</button>`:v}
            <span class="usage-query-hint">
              ${n?`${u.length} of ${X} sessions match`:`${X} sessions in range`}
            </span>
          </div>
        </div>
        <div class="usage-filter-row">
          ${le("agent","Agent",m)}
          ${le("channel","Channel",w)}
          ${le("provider","Provider",S)}
          ${le("model","Model",A)}
          ${le("tool","Tool",k)}
          <span class="usage-query-hint">
            Tip: use filters or click bars to filter days.
          </span>
        </div>
        ${d.length>0?l`
                <div class="usage-query-chips">
                  ${d.map(I=>{const D=I.raw;return l`
                      <span class="usage-query-chip">
                        ${D}
                        <button
                          title="Remove filter"
                          @click=${()=>e.onQueryDraftChange(mr(e.queryDraft,D))}
                        >
                          ×
                        </button>
                      </span>
                    `})}
                </div>
              `:v}
        ${g.length>0?l`
                <div class="usage-query-suggestions">
                  ${g.map(I=>l`
                      <button
                        class="usage-query-suggestion"
                        @click=${()=>e.onQueryDraftChange(Zf(e.queryDraft,I.value))}
                      >
                        ${I.label}
                      </button>
                    `)}
                </div>
              `:v}
        ${p.length>0?l`
                <div class="callout warning" style="margin-top: 8px;">
                  ${p.join(" · ")}
                </div>
              `:v}
      </div>

      ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:v}

      ${e.sessionsLimitReached?l`
              <div class="callout warning" style="margin-top: 12px">
                Showing first 1,000 sessions. Narrow date range for complete results.
              </div>
            `:v}
    </section>

    ${sh(M,P,ne,E,Bf(te,e.timeZone),Y,X)}

    ${jf(te,e.timeZone,e.selectedHours,e.onSelectHour)}

    <!-- Two-column layout: Daily+Breakdown on left, Sessions on right -->
    <div class="usage-grid">
      <div class="usage-grid-left">
        <div class="card usage-left-card">
          ${th(W,e.selectedDays,e.chartMode,e.dailyChartMode,e.onDailyChartModeChange,e.onSelectDay)}
          ${M?nh(M,e.chartMode):v}
        </div>
      </div>
      <div class="usage-grid-right">
        ${ih(u,e.selectedSessions,e.selectedDays,t,e.sessionSort,e.sessionSortDir,e.recentSessions,e.sessionsTab,e.onSelectSession,e.onSessionSortChange,e.onSessionSortDirChange,e.onSessionsTabChange,e.visibleColumns,X,e.onClearSessions)}
      </div>
    </div>

    <!-- Session Detail Panel (when selected) or Empty State -->
    ${C?gh(C,e.timeSeries,e.timeSeriesLoading,e.timeSeriesMode,e.onTimeSeriesModeChange,e.timeSeriesBreakdownMode,e.onTimeSeriesBreakdownChange,e.timeSeriesCursorStart,e.timeSeriesCursorEnd,e.onTimeSeriesCursorRangeChange,e.startDate,e.endDate,e.selectedDays,e.sessionLogs,e.sessionLogsLoading,e.sessionLogsExpanded,e.onToggleSessionLogsExpanded,{roles:e.logFilterRoles,tools:e.logFilterTools,hasTools:e.logFilterHasTools,query:e.logFilterQuery},e.onLogFilterRolesChange,e.onLogFilterToolsChange,e.onLogFilterHasToolsChange,e.onLogFilterQueryChange,e.onLogFilterClear,e.contextExpanded,e.onToggleContextExpanded,e.onClearSessions):lh()}
  `}let _i=null;const xr=e=>{_i&&clearTimeout(_i),_i=window.setTimeout(()=>{Mc(e)},400)};function $h(e){return e.tab!=="usage"?v:xh({loading:e.usageLoading,error:e.usageError,startDate:e.usageStartDate,endDate:e.usageEndDate,sessions:e.usageResult?.sessions??[],sessionsLimitReached:(e.usageResult?.sessions?.length??0)>=1e3,totals:e.usageResult?.totals??null,aggregates:e.usageResult?.aggregates??null,costDaily:e.usageCostSummary?.daily??[],selectedSessions:e.usageSelectedSessions,selectedDays:e.usageSelectedDays,selectedHours:e.usageSelectedHours,chartMode:e.usageChartMode,dailyChartMode:e.usageDailyChartMode,timeSeriesMode:e.usageTimeSeriesMode,timeSeriesBreakdownMode:e.usageTimeSeriesBreakdownMode,timeSeries:e.usageTimeSeries,timeSeriesLoading:e.usageTimeSeriesLoading,timeSeriesCursorStart:e.usageTimeSeriesCursorStart,timeSeriesCursorEnd:e.usageTimeSeriesCursorEnd,sessionLogs:e.usageSessionLogs,sessionLogsLoading:e.usageSessionLogsLoading,sessionLogsExpanded:e.usageSessionLogsExpanded,logFilterRoles:e.usageLogFilterRoles,logFilterTools:e.usageLogFilterTools,logFilterHasTools:e.usageLogFilterHasTools,logFilterQuery:e.usageLogFilterQuery,query:e.usageQuery,queryDraft:e.usageQueryDraft,sessionSort:e.usageSessionSort,sessionSortDir:e.usageSessionSortDir,recentSessions:e.usageRecentSessions,sessionsTab:e.usageSessionsTab,visibleColumns:e.usageVisibleColumns,timeZone:e.usageTimeZone,contextExpanded:e.usageContextExpanded,headerPinned:e.usageHeaderPinned,onStartDateChange:t=>{e.usageStartDate=t,e.usageSelectedDays=[],e.usageSelectedHours=[],e.usageSelectedSessions=[],xr(e)},onEndDateChange:t=>{e.usageEndDate=t,e.usageSelectedDays=[],e.usageSelectedHours=[],e.usageSelectedSessions=[],xr(e)},onRefresh:()=>Mc(e),onTimeZoneChange:t=>{e.usageTimeZone=t},onToggleContextExpanded:()=>{e.usageContextExpanded=!e.usageContextExpanded},onToggleSessionLogsExpanded:()=>{e.usageSessionLogsExpanded=!e.usageSessionLogsExpanded},onLogFilterRolesChange:t=>{e.usageLogFilterRoles=t},onLogFilterToolsChange:t=>{e.usageLogFilterTools=t},onLogFilterHasToolsChange:t=>{e.usageLogFilterHasTools=t},onLogFilterQueryChange:t=>{e.usageLogFilterQuery=t},onLogFilterClear:()=>{e.usageLogFilterRoles=[],e.usageLogFilterTools=[],e.usageLogFilterHasTools=!1,e.usageLogFilterQuery=""},onToggleHeaderPinned:()=>{e.usageHeaderPinned=!e.usageHeaderPinned},onSelectHour:(t,n)=>{if(n&&e.usageSelectedHours.length>0){const s=Array.from({length:24},(r,c)=>c),i=e.usageSelectedHours[e.usageSelectedHours.length-1],a=s.indexOf(i),o=s.indexOf(t);if(a!==-1&&o!==-1){const[r,c]=a<o?[a,o]:[o,a],u=s.slice(r,c+1);e.usageSelectedHours=[...new Set([...e.usageSelectedHours,...u])]}}else e.usageSelectedHours.includes(t)?e.usageSelectedHours=e.usageSelectedHours.filter(s=>s!==t):e.usageSelectedHours=[...e.usageSelectedHours,t]},onQueryDraftChange:t=>{e.usageQueryDraft=t,e.usageQueryDebounceTimer&&window.clearTimeout(e.usageQueryDebounceTimer),e.usageQueryDebounceTimer=window.setTimeout(()=>{e.usageQuery=e.usageQueryDraft,e.usageQueryDebounceTimer=null},250)},onApplyQuery:()=>{e.usageQueryDebounceTimer&&(window.clearTimeout(e.usageQueryDebounceTimer),e.usageQueryDebounceTimer=null),e.usageQuery=e.usageQueryDraft},onClearQuery:()=>{e.usageQueryDebounceTimer&&(window.clearTimeout(e.usageQueryDebounceTimer),e.usageQueryDebounceTimer=null),e.usageQueryDraft="",e.usageQuery=""},onSessionSortChange:t=>{e.usageSessionSort=t},onSessionSortDirChange:t=>{e.usageSessionSortDir=t},onSessionsTabChange:t=>{e.usageSessionsTab=t},onToggleColumn:t=>{e.usageVisibleColumns.includes(t)?e.usageVisibleColumns=e.usageVisibleColumns.filter(n=>n!==t):e.usageVisibleColumns=[...e.usageVisibleColumns,t]},onSelectSession:(t,n)=>{if(e.usageTimeSeries=null,e.usageSessionLogs=null,e.usageRecentSessions=[t,...e.usageRecentSessions.filter(s=>s!==t)].slice(0,8),n&&e.usageSelectedSessions.length>0){const s=e.usageChartMode==="tokens",a=[...e.usageResult?.sessions??[]].toSorted((u,p)=>{const g=s?u.usage?.totalTokens??0:u.usage?.totalCost??0;return(s?p.usage?.totalTokens??0:p.usage?.totalCost??0)-g}).map(u=>u.key),o=e.usageSelectedSessions[e.usageSelectedSessions.length-1],r=a.indexOf(o),c=a.indexOf(t);if(r!==-1&&c!==-1){const[u,p]=r<c?[r,c]:[c,r],g=a.slice(u,p+1),d=[...new Set([...e.usageSelectedSessions,...g])];e.usageSelectedSessions=d}}else e.usageSelectedSessions.length===1&&e.usageSelectedSessions[0]===t?e.usageSelectedSessions=[]:e.usageSelectedSessions=[t];e.usageTimeSeriesCursorStart=null,e.usageTimeSeriesCursorEnd=null,e.usageSelectedSessions.length===1&&(_f(e,e.usageSelectedSessions[0]),Ef(e,e.usageSelectedSessions[0]))},onSelectDay:(t,n)=>{if(n&&e.usageSelectedDays.length>0){const s=(e.usageCostSummary?.daily??[]).map(r=>r.date),i=e.usageSelectedDays[e.usageSelectedDays.length-1],a=s.indexOf(i),o=s.indexOf(t);if(a!==-1&&o!==-1){const[r,c]=a<o?[a,o]:[o,a],u=s.slice(r,c+1),p=[...new Set([...e.usageSelectedDays,...u])];e.usageSelectedDays=p}}else e.usageSelectedDays.includes(t)?e.usageSelectedDays=e.usageSelectedDays.filter(s=>s!==t):e.usageSelectedDays=[t]},onChartModeChange:t=>{e.usageChartMode=t},onDailyChartModeChange:t=>{e.usageDailyChartMode=t},onTimeSeriesModeChange:t=>{e.usageTimeSeriesMode=t},onTimeSeriesBreakdownChange:t=>{e.usageTimeSeriesBreakdownMode=t},onTimeSeriesCursorRangeChange:(t,n)=>{e.usageTimeSeriesCursorStart=t,e.usageTimeSeriesCursorEnd=n},onClearDays:()=>{e.usageSelectedDays=[]},onClearHours:()=>{e.usageSelectedHours=[]},onClearSessions:()=>{e.usageSelectedSessions=[],e.usageTimeSeries=null,e.usageSessionLogs=null},onClearFilters:()=>{e.usageSelectedDays=[],e.usageSelectedHours=[],e.usageSelectedSessions=[],e.usageTimeSeries=null,e.usageSessionLogs=null}})}const Ya={CHILD:2},Za=e=>(...t)=>({_$litDirective$:e,values:t});let Ja=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,n,s){this._$Ct=t,this._$AM=n,this._$Ci=s}_$AS(t,n){return this.update(t,n)}update(t,n){return this.render(...n)}};const{I:wh}=Zd,$r=e=>e,kh=e=>e.strings===void 0,wr=()=>document.createComment(""),mn=(e,t,n)=>{const s=e._$AA.parentNode,i=t===void 0?e._$AB:t._$AA;if(n===void 0){const a=s.insertBefore(wr(),i),o=s.insertBefore(wr(),i);n=new wh(a,o,e,e.options)}else{const a=n._$AB.nextSibling,o=n._$AM,r=o!==e;if(r){let c;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(c=e._$AU)!==o._$AU&&n._$AP(c)}if(a!==i||r){let c=n._$AA;for(;c!==a;){const u=$r(c).nextSibling;$r(s).insertBefore(c,i),c=u}}}return n},Lt=(e,t,n=e)=>(e._$AI(t,n),e),Sh={},Ah=(e,t=Sh)=>e._$AH=t,Ch=e=>e._$AH,Ei=e=>{e._$AR(),e._$AA.remove()};const kr=(e,t,n)=>{const s=new Map;for(let i=t;i<=n;i++)s.set(e[i],i);return s},Dc=Za(class extends Ja{constructor(e){if(super(e),e.type!==Ya.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,t,n){let s;n===void 0?n=t:t!==void 0&&(s=t);const i=[],a=[];let o=0;for(const r of e)i[o]=s?s(r,o):o,a[o]=n(r,o),o++;return{values:a,keys:i}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,s]){const i=Ch(e),{values:a,keys:o}=this.dt(t,n,s);if(!Array.isArray(i))return this.ut=o,a;const r=this.ut??=[],c=[];let u,p,g=0,d=i.length-1,h=0,f=a.length-1;for(;g<=d&&h<=f;)if(i[g]===null)g++;else if(i[d]===null)d--;else if(r[g]===o[h])c[h]=Lt(i[g],a[h]),g++,h++;else if(r[d]===o[f])c[f]=Lt(i[d],a[f]),d--,f--;else if(r[g]===o[f])c[f]=Lt(i[g],a[f]),mn(e,c[f+1],i[g]),g++,f--;else if(r[d]===o[h])c[h]=Lt(i[d],a[h]),mn(e,i[g],i[d]),d--,h++;else if(u===void 0&&(u=kr(o,h,f),p=kr(r,g,d)),u.has(r[g]))if(u.has(r[d])){const m=p.get(o[h]),w=m!==void 0?i[m]:null;if(w===null){const S=mn(e,i[g]);Lt(S,a[h]),c[h]=S}else c[h]=Lt(w,a[h]),mn(e,i[g],w),i[m]=null;h++}else Ei(i[d]),d--;else Ei(i[g]),g++;for(;h<=f;){const m=mn(e,c[f+1]);Lt(m,a[h]),c[h++]=m}for(;g<=d;){const m=i[g++];m!==null&&Ei(m)}return this.ut=o,Ah(e,c),xt}}),oe={messageSquare:l`
    <svg viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  `,barChart:l`
    <svg viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  `,link:l`
    <svg viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  `,radio:l`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2" />
      <path
        d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"
      />
    </svg>
  `,fileText:l`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  `,zap:l`
    <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  `,monitor:l`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  `,settings:l`
    <svg viewBox="0 0 24 24">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,bug:l`
    <svg viewBox="0 0 24 24">
      <path d="m8 2 1.88 1.88" />
      <path d="M14.12 3.88 16 2" />
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
      <path d="M12 20v-9" />
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
      <path d="M6 13H2" />
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
      <path d="M22 13h-4" />
      <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  `,scrollText:l`
    <svg viewBox="0 0 24 24">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M15 8h-5" />
      <path d="M15 12h-5" />
    </svg>
  `,folder:l`
    <svg viewBox="0 0 24 24">
      <path
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      />
    </svg>
  `,menu:l`
    <svg viewBox="0 0 24 24">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  `,x:l`
    <svg viewBox="0 0 24 24">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  `,check:l`
    <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
  `,arrowDown:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  `,copy:l`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  `,search:l`
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  `,brain:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  `,book:l`
    <svg viewBox="0 0 24 24">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  `,loader:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  `,wrench:l`
    <svg viewBox="0 0 24 24">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      />
    </svg>
  `,fileCode:l`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  `,edit:l`
    <svg viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  `,penLine:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  `,paperclip:l`
    <svg viewBox="0 0 24 24">
      <path
        d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
      />
    </svg>
  `,globe:l`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  `,image:l`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  `,smartphone:l`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  `,plug:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  `,circle:l`
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
  `,sun:l`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  `,moon:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  `,mic:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  `,speaker:l`
    <svg viewBox="0 0 24 24">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  `,cloud:l`
    <svg viewBox="0 0 24 24">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  `,server:l`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  `,puzzle:l`
    <svg viewBox="0 0 24 24">
      <path
        d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.076.874.54 1.02 1.02a2.5 2.5 0 1 0 3.237-3.237c-.48-.146-.944-.505-1.02-1.02a.98.98 0 0 1 .303-.917l1.526-1.526A2.402 2.402 0 0 1 11.998 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.236 3.236c-.464.18-.894.527-.967 1.02Z"
      />
    </svg>
  `,target:l`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  `,flag:l`
    <svg viewBox="0 0 24 24">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  `,activity:l`
    <svg viewBox="0 0 24 24">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  `};function Th(e){const t=e.hello?.snapshot,n=t?.sessionDefaults?.mainSessionKey?.trim();if(n)return n;const s=t?.sessionDefaults?.mainKey?.trim();return s||"main"}function _h(e,t){e.sessionKey=t,e.chatMessage="",e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:t,lastActiveSessionKey:t})}function Sr(e,t){const n=Xs(t,e.basePath);return l`
    <a
      href=${n}
      class="nav-item ${e.tab===t?"active":""}"
      @click=${s=>{if(!(s.defaultPrevented||s.button!==0||s.metaKey||s.ctrlKey||s.shiftKey||s.altKey)){if(s.preventDefault(),t==="chat"){const i=Th(e);e.sessionKey!==i&&(_h(e,i),e.loadAssistantIdentity())}e.setTab(t)}}}
      title=${Gi(t)}
    >
      <span class="nav-item__icon" aria-hidden="true">${oe[rp(t)]}</span>
      <span class="nav-item__text">${Gi(t)}</span>
    </a>
  `}function Eh(e){const t=Mh(e.hello,e.sessionsResult),n=Rh(e.sessionKey,e.sessionsResult,t),s=e.onboarding,i=e.onboarding,a=e.onboarding?!1:e.settings.chatShowThinking,o=e.onboarding?!0:e.settings.chatFocusMode,r=l`
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
      <path d="M21 3v5h-5"></path>
    </svg>
  `,c=l`
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4 7V4h3"></path>
      <path d="M20 7V4h-3"></path>
      <path d="M4 17v3h3"></path>
      <path d="M20 17v3h-3"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;return l`
    <div class="chat-controls">
      <label class="field chat-controls__session">
        <select
          .value=${e.sessionKey}
          ?disabled=${!e.connected}
          @change=${u=>{const p=u.target.value;e.sessionKey=p,e.chatMessage="",e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:p,lastActiveSessionKey:p}),e.loadAssistantIdentity(),kp(e,p),qn(e)}}
        >
          ${Dc(n,u=>u.key,u=>l`<option value=${u.key} title=${u.key}>
                ${u.displayName??u.key}
              </option>`)}
        </select>
      </label>
      <button
        class="btn btn--sm btn--icon"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${async()=>{const u=e;u.chatManualRefreshInFlight=!0,u.chatNewMessagesBelow=!1,await u.updateComplete,u.resetToolStream();try{await Ac(e,{scheduleScroll:!1}),u.scrollToBottom({smooth:!0})}finally{requestAnimationFrame(()=>{u.chatManualRefreshInFlight=!1,u.chatNewMessagesBelow=!1})}}}
        title=${R("chat.refreshTitle")}
      >
        ${r}
      </button>
      <span class="chat-controls__separator">|</span>
      <button
        class="btn btn--sm btn--icon ${a?"active":""}"
        ?disabled=${s}
        @click=${()=>{s||e.applySettings({...e.settings,chatShowThinking:!e.settings.chatShowThinking})}}
        aria-pressed=${a}
        title=${R(s?"chat.onboardingDisabled":"chat.thinkingToggle")}
      >
        ${oe.brain}
      </button>
      <button
        class="btn btn--sm btn--icon ${o?"active":""}"
        ?disabled=${i}
        @click=${()=>{i||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})}}
        aria-pressed=${o}
        title=${R(i?"chat.onboardingDisabled":"chat.focusToggle")}
      >
        ${c}
      </button>
      <span class="chat-controls__separator">|</span>
      ${Ph(e)}
      ${Dh(e)}
    </div>
  `}function Mh(e,t){const n=e?.snapshot,s=n?.sessionDefaults?.mainSessionKey?.trim();if(s)return s;const i=n?.sessionDefaults?.mainKey?.trim();return i||(t?.sessions?.some(a=>a.key==="main")?"main":null)}const ws={bluebubbles:"iMessage",telegram:"Telegram",discord:"Discord",signal:"Signal",slack:"Slack",whatsapp:"WhatsApp",matrix:"Matrix",email:"Email",sms:"SMS"},Lh=Object.keys(ws);function Ar(e){return e.charAt(0).toUpperCase()+e.slice(1)}function Ih(e){if(e==="main"||e==="agent:main:main")return{prefix:"",fallbackName:"Main Session"};if(e.includes(":subagent:"))return{prefix:"Subagent:",fallbackName:"Subagent:"};if(e.includes(":cron:"))return{prefix:"Cron:",fallbackName:"Cron Job:"};const t=e.match(/^agent:[^:]+:([^:]+):direct:(.+)$/);if(t){const s=t[1],i=t[2];return{prefix:"",fallbackName:`${ws[s]??Ar(s)} · ${i}`}}const n=e.match(/^agent:[^:]+:([^:]+):group:(.+)$/);if(n){const s=n[1];return{prefix:"",fallbackName:`${ws[s]??Ar(s)} Group`}}for(const s of Lh)if(e===s||e.startsWith(`${s}:`))return{prefix:"",fallbackName:`${ws[s]} Session`};return{prefix:"",fallbackName:e}}function Mi(e,t){const n=t?.label?.trim()||"",s=t?.displayName?.trim()||"",{prefix:i,fallbackName:a}=Ih(e),o=r=>i?new RegExp(`^${i.replace(/[.*+?^${}()|[\\]\\]/g,"\\$&")}\\s*`,"i").test(r)?r:`${i} ${r}`:r;return n&&n!==e?o(n):s&&s!==e?o(s):a}function Rh(e,t,n){const s=new Set,i=[],a=n&&t?.sessions?.find(r=>r.key===n),o=t?.sessions?.find(r=>r.key===e);if(n&&(s.add(n),i.push({key:n,displayName:Mi(n,a||void 0)})),s.has(e)||(s.add(e),i.push({key:e,displayName:Mi(e,o)})),t?.sessions)for(const r of t.sessions)s.has(r.key)||(s.add(r.key),i.push({key:r.key,displayName:Mi(r.key,r)}));return i}const Cr={dark:{icon:"moon",label:"Dark",next:"light"},light:{icon:"sun",label:"Light",next:"system"},system:{icon:"monitor",label:"Auto",next:"dark"}};function Ph(e){const t=e.llmMode==="local";return l`
    <button
      class="btn btn--sm btn--icon ${t?"active":""}"
      ?disabled=${!e.connected}
      @click=${()=>e.handleLlmModeToggle()}
      aria-pressed=${t}
      title="LLM: ${t?"Local (Ollama)":"Cloud (Claude)"}"
    >
      ${t?oe.server:oe.cloud}
    </button>
  `}function Dh(e){const t=e.ttsMode==="local";return l`
    <button
      class="btn btn--sm btn--icon ${t?"active":""}"
      ?disabled=${!e.connected}
      @click=${()=>e.handleTtsModeToggle()}
      aria-pressed=${t}
      title="TTS: ${t?"Local":"Cloud (ElevenLabs)"}"
    >
      ${oe.speaker}
    </button>
  `}function Nh(e){const t=e.theme??"dark",n=Cr[t]??Cr.dark;return l`
    <button
      class="pill theme-toggle"
      @click=${s=>{e.setTheme(n.next,{element:s.currentTarget,pointerClientX:s.clientX,pointerClientY:s.clientY})}}
      title="Theme: ${n.label}"
      aria-label="Switch theme, current: ${n.label}"
    >
      <span class="theme-icon" aria-hidden="true">${oe[n.icon]}</span>
      <span>${n.label}</span>
    </button>
  `}function Nc(e,t){if(!e)return e;const s=e.files.some(i=>i.name===t.name)?e.files.map(i=>i.name===t.name?t:i):[...e.files,t];return{...e,files:s}}async function Li(e,t){if(!(!e.client||!e.connected||e.agentFilesLoading)){e.agentFilesLoading=!0,e.agentFilesError=null;try{const n=await e.client.request("agents.files.list",{agentId:t});n&&(e.agentFilesList=n,e.agentFileActive&&!n.files.some(s=>s.name===e.agentFileActive)&&(e.agentFileActive=null))}catch(n){e.agentFilesError=String(n)}finally{e.agentFilesLoading=!1}}}async function Fh(e,t,n,s){if(!(!e.client||!e.connected||e.agentFilesLoading)&&!Object.hasOwn(e.agentFileContents,n)){e.agentFilesLoading=!0,e.agentFilesError=null;try{const i=await e.client.request("agents.files.get",{agentId:t,name:n});if(i?.file){const a=i.file.content??"",o=e.agentFileContents[n]??"",r=e.agentFileDrafts[n],c=s?.preserveDraft??!0;e.agentFilesList=Nc(e.agentFilesList,i.file),e.agentFileContents={...e.agentFileContents,[n]:a},(!c||!Object.hasOwn(e.agentFileDrafts,n)||r===o)&&(e.agentFileDrafts={...e.agentFileDrafts,[n]:a})}}catch(i){e.agentFilesError=String(i)}finally{e.agentFilesLoading=!1}}}async function Oh(e,t,n,s){if(!(!e.client||!e.connected||e.agentFileSaving)){e.agentFileSaving=!0,e.agentFilesError=null;try{const i=await e.client.request("agents.files.set",{agentId:t,name:n,content:s});i?.file&&(e.agentFilesList=Nc(e.agentFilesList,i.file),e.agentFileContents={...e.agentFileContents,[n]:s},e.agentFileDrafts={...e.agentFileDrafts,[n]:s})}catch(i){e.agentFilesError=String(i)}finally{e.agentFileSaving=!1}}}const Fc="wybe-mission";function Tr(){return{northStar:"",northStarProgress:0,goals:[]}}function Bh(){try{const e=localStorage.getItem(Fc);if(!e)return Tr();const t=JSON.parse(e);return{northStar:t.northStar??"",northStarProgress:t.northStarProgress??0,goals:Array.isArray(t.goals)?t.goals:[]}}catch{return Tr()}}function zh(e){localStorage.setItem(Fc,JSON.stringify(e))}function Uh(e){e.missionGoalsLoading=!0;const t=Bh();e.missionNorthStar=t.northStar,e.missionNorthStarProgress=t.northStarProgress,e.missionGoals=t.goals,e.missionGoalsLoading=!1}function ni(e){zh({northStar:e.missionNorthStar,northStarProgress:e.missionNorthStarProgress,goals:e.missionGoals})}function Hh(e,t,n){e.missionNorthStar=t,e.missionNorthStarProgress=Math.max(0,Math.min(100,n)),ni(e)}function jh(e,t){const n={...t,id:crypto.randomUUID(),createdAt:Date.now()};return e.missionGoals=[...e.missionGoals,n],ni(e),n}function Kh(e,t,n){e.missionGoals=e.missionGoals.map(s=>s.id===t?{...s,...n}:s),ni(e)}function Wh(e,t){e.missionGoals=e.missionGoals.filter(n=>n.id!==t),ni(e)}function Vh(e){const t=Date.now()-e;return t<6e4?"just now":t<36e5?`${Math.floor(t/6e4)} min ago`:t<864e5?`${Math.floor(t/36e5)}h ago`:new Date(e).toLocaleString()}function _r(e){const t=e,n=t.type??t.method??"";return n.includes("message")||n.includes("chat")?"message":n.includes("tool")?"tool":n.includes("cron")?"cron":n.includes("channel")?"channel":(n.includes("connect")||n.includes("disconnect"),"system")}function qh(e){const t=e,n=t.type??t.method??"",s=t.channel,i=t.toolName,a=t.name;return n.includes("chat.message")||n.includes("message.send")?"sent a message":n.includes("message.receive")||n.includes("message.in")?"received a message":n.includes("tool.call")?`used ${i??a??"a tool"}`:n.includes("tool.result")?`tool ${i??a??""} returned result`:n.includes("cron.run")?`ran scheduled job: ${a??""}`:n.includes("cron.skip")?`skipped scheduled job: ${a??""}`:n.includes("channel.send")?`posted to ${s??"a channel"}`:n.includes("channel.receive")?`received from ${s??"a channel"}`:n.includes("connect")?"connected to gateway":n.includes("disconnect")?"disconnected from gateway":n.includes("session")?"session updated":n.includes("config")?"configuration changed":n||"event occurred"}function Gh(e){switch(e){case"message":return"chip-ok";case"tool":return"chip-warn";case"cron":return"";case"channel":return"chip-ok";case"system":return"";default:return""}}function Qh(e){const n=[...e.eventLog.filter(s=>!(e.activityFilter&&e.activityFilter!=="all"&&_r(s)!==e.activityFilter))].reverse();return l`
    <div class="activity-view">
      <!-- Filters -->
      <div class="activity-filters">
        <div class="field">
          <span>Event Type</span>
          <select
            .value=${e.activityFilter||"all"}
            @change=${s=>{e.onFilterChange(s.target.value)}}
          >
            <option value="all">All events</option>
            <option value="message">Messages</option>
            <option value="tool">Tools</option>
            <option value="cron">Cron</option>
            <option value="channel">Channels</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      <!-- Feed -->
      <div class="activity-feed">
        ${n.length===0?l`<div class="activity-empty muted">No events to display.</div>`:n.map(s=>{const i=_r(s),o=s.channel;return l`
                <div class="activity-card">
                  <div class="activity-card__avatar agent-avatar">
                    ${e.assistantAvatar?l`<img src=${e.assistantAvatar} alt="" />`:e.assistantName.charAt(0).toUpperCase()}
                  </div>
                  <div class="activity-card__body">
                    <div class="activity-card__header">
                      <span class="activity-card__name">${e.assistantName}</span>
                      <span class="activity-card__desc">${qh(s)}</span>
                    </div>
                    <div class="activity-card__footer">
                      <span class="chip ${Gh(i)}">${i}</span>
                      ${o?l`<span class="chip">${o}</span>`:v}
                      <span class="activity-card__time muted">
                        ${Vh(s.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              `})}
      </div>
    </div>
  `}function Yh(e){const t=e.host??"unknown",n=e.ip?`(${e.ip})`:"",s=e.mode??"",i=e.version??"";return`${t} ${n} ${s} ${i}`.trim()}function Zh(e){const t=e.ts??null;return t?J(t):"n/a"}function Xa(e){return e?`${Vt(e)} (${J(e)})`:"n/a"}function Jh(e){if(e.totalTokens==null)return"n/a";const t=e.totalTokens??0,n=e.contextTokens??0;return n?`${t} / ${n}`:String(t)}function Xh(e){if(e==null)return"";try{return JSON.stringify(e,null,2)}catch{return String(e)}}function ev(e){const t=e.state??{},n=t.nextRunAtMs?Vt(t.nextRunAtMs):"n/a",s=t.lastRunAtMs?Vt(t.lastRunAtMs):"n/a";return`${t.lastStatus??"n/a"} · next ${n} · last ${s}`}function Oc(e){const t=e.schedule;if(t.kind==="at"){const n=Date.parse(t.at);return Number.isFinite(n)?`At ${Vt(n)}`:`At ${t.at}`}return t.kind==="every"?`Every ${Pa(t.everyMs)}`:`Cron ${t.expr}${t.tz?` (${t.tz})`:""}`}function tv(e){const t=e.payload;if(t.kind==="systemEvent")return`System: ${t.text}`;const n=`Agent: ${t.message}`,s=e.delivery;if(s&&s.mode!=="none"){const i=s.mode==="webhook"?s.to?` (${s.to})`:"":s.channel||s.to?` (${s.channel??"last"}${s.to?` -> ${s.to}`:""})`:"";return`${n} · ${s.mode}${i}`}return n}const nv={bash:"exec","apply-patch":"apply_patch"},sv={"group:memory":["memory_search","memory_get"],"group:web":["web_search","web_fetch"],"group:fs":["read","write","edit","apply_patch"],"group:runtime":["exec","process"],"group:sessions":["sessions_list","sessions_history","sessions_send","sessions_spawn","subagents","session_status"],"group:ui":["browser","canvas"],"group:automation":["cron","gateway"],"group:messaging":["message"],"group:nodes":["nodes"],"group:openclaw":["browser","canvas","nodes","cron","message","gateway","agents_list","sessions_list","sessions_history","sessions_send","sessions_spawn","subagents","session_status","memory_search","memory_get","web_search","web_fetch","image"]},iv={minimal:{allow:["session_status"]},coding:{allow:["group:fs","group:runtime","group:sessions","group:memory","image"]},messaging:{allow:["group:messaging","sessions_list","sessions_history","sessions_send","session_status"]},full:{}};function qe(e){const t=e.trim().toLowerCase();return nv[t]??t}function av(e){return e?e.map(qe).filter(Boolean):[]}function ov(e){const t=av(e),n=[];for(const s of t){const i=sv[s];if(i){n.push(...i);continue}n.push(s)}return Array.from(new Set(n))}function rv(e){if(!e)return;const t=iv[e];if(t&&!(!t.allow&&!t.deny))return{allow:t.allow?[...t.allow]:void 0,deny:t.deny?[...t.deny]:void 0}}const Er=[{id:"fs",label:"Files",tools:[{id:"read",label:"read",description:"Read file contents"},{id:"write",label:"write",description:"Create or overwrite files"},{id:"edit",label:"edit",description:"Make precise edits"},{id:"apply_patch",label:"apply_patch",description:"Patch files (OpenAI)"}]},{id:"runtime",label:"Runtime",tools:[{id:"exec",label:"exec",description:"Run shell commands"},{id:"process",label:"process",description:"Manage background processes"}]},{id:"web",label:"Web",tools:[{id:"web_search",label:"web_search",description:"Search the web"},{id:"web_fetch",label:"web_fetch",description:"Fetch web content"}]},{id:"memory",label:"Memory",tools:[{id:"memory_search",label:"memory_search",description:"Semantic search"},{id:"memory_get",label:"memory_get",description:"Read memory files"}]},{id:"sessions",label:"Sessions",tools:[{id:"sessions_list",label:"sessions_list",description:"List sessions"},{id:"sessions_history",label:"sessions_history",description:"Session history"},{id:"sessions_send",label:"sessions_send",description:"Send to session"},{id:"sessions_spawn",label:"sessions_spawn",description:"Spawn sub-agent"},{id:"session_status",label:"session_status",description:"Session status"}]},{id:"ui",label:"UI",tools:[{id:"browser",label:"browser",description:"Control web browser"},{id:"canvas",label:"canvas",description:"Control canvases"}]},{id:"messaging",label:"Messaging",tools:[{id:"message",label:"message",description:"Send messages"}]},{id:"automation",label:"Automation",tools:[{id:"cron",label:"cron",description:"Schedule tasks"},{id:"gateway",label:"gateway",description:"Gateway control"}]},{id:"nodes",label:"Nodes",tools:[{id:"nodes",label:"nodes",description:"Nodes + devices"}]},{id:"agents",label:"Agents",tools:[{id:"agents_list",label:"agents_list",description:"List agents"}]},{id:"media",label:"Media",tools:[{id:"image",label:"image",description:"Image understanding"}]}],lv=[{id:"minimal",label:"Minimal"},{id:"coding",label:"Coding"},{id:"messaging",label:"Messaging"},{id:"full",label:"Full"}];function Xi(e){return e.name?.trim()||e.identity?.name?.trim()||e.id}function ds(e){const t=e.trim();if(!t||t.length>16)return!1;let n=!1;for(let s=0;s<t.length;s+=1)if(t.charCodeAt(s)>127){n=!0;break}return!(!n||t.includes("://")||t.includes("/")||t.includes("."))}function si(e,t){const n=t?.emoji?.trim();if(n&&ds(n))return n;const s=e.identity?.emoji?.trim();if(s&&ds(s))return s;const i=t?.avatar?.trim();if(i&&ds(i))return i;const a=e.identity?.avatar?.trim();return a&&ds(a)?a:""}function Bc(e,t){return t&&e===t?"default":null}function cv(e){if(e==null||!Number.isFinite(e))return"-";if(e<1024)return`${e} B`;const t=["KB","MB","GB","TB"];let n=e/1024,s=0;for(;n>=1024&&s<t.length-1;)n/=1024,s+=1;return`${n.toFixed(n<10?1:0)} ${t[s]}`}function ii(e,t){const n=e;return{entry:(n?.agents?.list??[]).find(a=>a?.id===t),defaults:n?.agents?.defaults,globalTools:n?.tools}}function Mr(e,t,n,s,i){const a=ii(t,e.id),r=(n&&n.agentId===e.id?n.workspace:null)||a.entry?.workspace||a.defaults?.workspace||"default",c=a.entry?.model?In(a.entry?.model):In(a.defaults?.model),u=i?.name?.trim()||e.identity?.name?.trim()||e.name?.trim()||a.entry?.name||e.id,p=si(e,i)||"-",g=Array.isArray(a.entry?.skills)?a.entry?.skills:null,d=g?.length??null;return{workspace:r,model:c,identityName:u,identityEmoji:p,skillsLabel:g?`${d} selected`:"all skills",isDefault:!!(s&&e.id===s)}}function In(e){if(!e)return"-";if(typeof e=="string")return e.trim()||"-";if(typeof e=="object"&&e){const t=e,n=t.primary?.trim();if(n){const s=Array.isArray(t.fallbacks)?t.fallbacks.length:0;return s>0?`${n} (+${s} fallback)`:n}}return"-"}function Lr(e){const t=e.match(/^(.+) \(\+\d+ fallback\)$/);return t?t[1]:e}function Ir(e){if(!e)return null;if(typeof e=="string")return e.trim()||null;if(typeof e=="object"&&e){const t=e;return(typeof t.primary=="string"?t.primary:typeof t.model=="string"?t.model:typeof t.id=="string"?t.id:typeof t.value=="string"?t.value:null)?.trim()||null}return null}function dv(e){if(!e||typeof e=="string")return null;if(typeof e=="object"&&e){const t=e,n=Array.isArray(t.fallbacks)?t.fallbacks:Array.isArray(t.fallback)?t.fallback:null;return n?n.filter(s=>typeof s=="string"):null}return null}function uv(e){return e.split(",").map(t=>t.trim()).filter(Boolean)}function gv(e){const n=e?.agents?.defaults?.models;if(!n||typeof n!="object")return[];const s=[];for(const[i,a]of Object.entries(n)){const o=i.trim();if(!o)continue;const r=a&&typeof a=="object"&&"alias"in a&&typeof a.alias=="string"?a.alias?.trim():void 0,c=r&&r!==o?`${r} (${o})`:o;s.push({value:o,label:c})}return s}function pv(e,t){const n=gv(e),s=t?n.some(i=>i.value===t):!1;return t&&!s&&n.unshift({value:t,label:`Current (${t})`}),n.length===0?l`
      <option value="" disabled>No configured models</option>
    `:n.map(i=>l`<option value=${i.value}>${i.label}</option>`)}function fv(e){const t=qe(e);if(!t)return{kind:"exact",value:""};if(t==="*")return{kind:"all"};if(!t.includes("*"))return{kind:"exact",value:t};const n=t.replace(/[.*+?^${}()|[\\]\\]/g,"\\$&");return{kind:"regex",value:new RegExp(`^${n.replaceAll("\\*",".*")}$`)}}function ea(e){return Array.isArray(e)?ov(e).map(fv).filter(t=>t.kind!=="exact"||t.value.length>0):[]}function Rn(e,t){for(const n of t)if(n.kind==="all"||n.kind==="exact"&&e===n.value||n.kind==="regex"&&n.value.test(e))return!0;return!1}function hv(e,t){if(!t)return!0;const n=qe(e),s=ea(t.deny);if(Rn(n,s))return!1;const i=ea(t.allow);return!!(i.length===0||Rn(n,i)||n==="apply_patch"&&Rn("exec",i))}function Rr(e,t){if(!Array.isArray(t)||t.length===0)return!1;const n=qe(e),s=ea(t);return!!(Rn(n,s)||n==="apply_patch"&&Rn("exec",s))}function vv(e){return rv(e)??void 0}function zc(e,t){return l`
    <section class="card">
      <div class="card-title">Agent Context</div>
      <div class="card-sub">${t}</div>
      <div class="agents-overview-grid" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">Workspace</div>
          <div class="mono">${e.workspace}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Primary Model</div>
          <div class="mono">${e.model}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Identity Name</div>
          <div>${e.identityName}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Identity Emoji</div>
          <div>${e.identityEmoji}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Skills Filter</div>
          <div>${e.skillsLabel}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Default</div>
          <div>${e.isDefault?"yes":"no"}</div>
        </div>
      </div>
    </section>
  `}function mv(e,t){const n=e.channelMeta?.find(s=>s.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function bv(e){if(!e)return[];const t=new Set;for(const i of e.channelOrder??[])t.add(i);for(const i of e.channelMeta??[])t.add(i.id);for(const i of Object.keys(e.channelAccounts??{}))t.add(i);const n=[],s=e.channelOrder?.length?e.channelOrder:Array.from(t);for(const i of s)t.has(i)&&(n.push(i),t.delete(i));for(const i of t)n.push(i);return n.map(i=>({id:i,label:mv(e,i),accounts:e.channelAccounts?.[i]??[]}))}const yv=["groupPolicy","streamMode","dmPolicy"];function xv(e,t){if(!e)return null;const s=(e.channels??{})[t];if(s&&typeof s=="object")return s;const i=e[t];return i&&typeof i=="object"?i:null}function $v(e){if(e==null)return"n/a";if(typeof e=="string"||typeof e=="number"||typeof e=="boolean")return String(e);try{return JSON.stringify(e)}catch{return"n/a"}}function wv(e,t){const n=xv(e,t);return n?yv.flatMap(s=>s in n?[{label:s,value:$v(n[s])}]:[]):[]}function kv(e){let t=0,n=0,s=0;for(const i of e){const a=i.probe&&typeof i.probe=="object"&&"ok"in i.probe?!!i.probe.ok:!1;(i.connected===!0||i.running===!0||a)&&(t+=1),i.configured&&(n+=1),i.enabled&&(s+=1)}return{total:e.length,connected:t,configured:n,enabled:s}}function Sv(e){const t=bv(e.snapshot),n=e.lastSuccess?J(e.lastSuccess):"never";return l`
    <section class="grid grid-cols-2">
      ${zc(e.context,"Workspace, identity, and model configuration.")}
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Channels</div>
            <div class="card-sub">Gateway-wide channel status snapshot.</div>
          </div>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
        </div>
        <div class="muted" style="margin-top: 8px;">
          Last refresh: ${n}
        </div>
        ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:v}
        ${e.snapshot?v:l`
                <div class="callout info" style="margin-top: 12px">Load channels to see live status.</div>
              `}
        ${t.length===0?l`
                <div class="muted" style="margin-top: 16px">No channels found.</div>
              `:l`
                <div class="list" style="margin-top: 16px;">
                  ${t.map(s=>{const i=kv(s.accounts),a=i.total?`${i.connected}/${i.total} connected`:"no accounts",o=i.configured?`${i.configured} configured`:"not configured",r=i.total?`${i.enabled} enabled`:"disabled",c=wv(e.configForm,s.id);return l`
                      <div class="list-item">
                        <div class="list-main">
                          <div class="list-title">${s.label}</div>
                          <div class="list-sub mono">${s.id}</div>
                        </div>
                        <div class="list-meta">
                          <div>${a}</div>
                          <div>${o}</div>
                          <div>${r}</div>
                          ${c.length>0?c.map(u=>l`<div>${u.label}: ${u.value}</div>`):v}
                        </div>
                      </div>
                    `})}
                </div>
              `}
      </section>
    </section>
  `}function Av(e){const t=e.jobs.filter(n=>n.agentId===e.agentId);return l`
    <section class="grid grid-cols-2">
      ${zc(e.context,"Workspace and scheduling targets.")}
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Scheduler</div>
            <div class="card-sub">Gateway cron status.</div>
          </div>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
        </div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">Enabled</div>
            <div class="stat-value">
              ${e.status?e.status.enabled?"Yes":"No":"n/a"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">Jobs</div>
            <div class="stat-value">${e.status?.jobs??"n/a"}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Next wake</div>
            <div class="stat-value">${Xa(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:v}
      </section>
    </section>
    <section class="card">
      <div class="card-title">Agent Cron Jobs</div>
      <div class="card-sub">Scheduled jobs targeting this agent.</div>
      ${t.length===0?l`
              <div class="muted" style="margin-top: 16px">No jobs assigned.</div>
            `:l`
              <div class="list" style="margin-top: 16px;">
                ${t.map(n=>l`
                    <div class="list-item">
                      <div class="list-main">
                        <div class="list-title">${n.name}</div>
                        ${n.description?l`<div class="list-sub">${n.description}</div>`:v}
                        <div class="chip-row" style="margin-top: 6px;">
                          <span class="chip">${Oc(n)}</span>
                          <span class="chip ${n.enabled?"chip-ok":"chip-warn"}">
                            ${n.enabled?"enabled":"disabled"}
                          </span>
                          <span class="chip">${n.sessionTarget}</span>
                        </div>
                      </div>
                      <div class="list-meta">
                        <div class="mono">${ev(n)}</div>
                        <div class="muted">${tv(n)}</div>
                      </div>
                    </div>
                  `)}
              </div>
            `}
    </section>
  `}function Cv(e){const t=e.agentFilesList?.agentId===e.agentId?e.agentFilesList:null,n=t?.files??[],s=e.agentFileActive??null,i=s?n.find(c=>c.name===s)??null:null,a=s?e.agentFileContents[s]??"":"",o=s?e.agentFileDrafts[s]??a:"",r=s?o!==a:!1;return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Core Files</div>
          <div class="card-sub">Bootstrap persona, identity, and tool guidance.</div>
        </div>
        <button
          class="btn btn--sm"
          ?disabled=${e.agentFilesLoading}
          @click=${()=>e.onLoadFiles(e.agentId)}
        >
          ${e.agentFilesLoading?"Loading…":"Refresh"}
        </button>
      </div>
      ${t?l`<div class="muted mono" style="margin-top: 8px;">Workspace: ${t.workspace}</div>`:v}
      ${e.agentFilesError?l`<div class="callout danger" style="margin-top: 12px;">${e.agentFilesError}</div>`:v}
      ${t?l`
              <div class="agent-files-grid" style="margin-top: 16px;">
                <div class="agent-files-list">
                  ${n.length===0?l`
                          <div class="muted">No files found.</div>
                        `:n.map(c=>Tv(c,s,()=>e.onSelectFile(c.name)))}
                </div>
                <div class="agent-files-editor">
                  ${i?l`
                          <div class="agent-file-header">
                            <div>
                              <div class="agent-file-title mono">${i.name}</div>
                              <div class="agent-file-sub mono">${i.path}</div>
                            </div>
                            <div class="agent-file-actions">
                              <button
                                class="btn btn--sm"
                                ?disabled=${!r}
                                @click=${()=>e.onFileReset(i.name)}
                              >
                                Reset
                              </button>
                              <button
                                class="btn btn--sm primary"
                                ?disabled=${e.agentFileSaving||!r}
                                @click=${()=>e.onFileSave(i.name)}
                              >
                                ${e.agentFileSaving?"Saving…":"Save"}
                              </button>
                            </div>
                          </div>
                          ${i.missing?l`
                                  <div class="callout info" style="margin-top: 10px">
                                    This file is missing. Saving will create it in the agent workspace.
                                  </div>
                                `:v}
                          <label class="field" style="margin-top: 12px;">
                            <span>Content</span>
                            <textarea
                              .value=${o}
                              @input=${c=>e.onFileDraftChange(i.name,c.target.value)}
                            ></textarea>
                          </label>
                        `:l`
                          <div class="muted">Select a file to edit.</div>
                        `}
                </div>
              </div>
            `:l`
              <div class="callout info" style="margin-top: 12px">
                Load the agent workspace files to edit core instructions.
              </div>
            `}
    </section>
  `}function Tv(e,t,n){const s=e.missing?"Missing":`${cv(e.size)} · ${J(e.updatedAtMs??null)}`;return l`
    <button
      type="button"
      class="agent-file-row ${t===e.name?"active":""}"
      @click=${n}
    >
      <div>
        <div class="agent-file-name mono">${e.name}</div>
        <div class="agent-file-meta">${s}</div>
      </div>
      ${e.missing?l`
              <span class="agent-pill warn">missing</span>
            `:v}
    </button>
  `}const us=[{id:"workspace",label:"Workspace Skills",sources:["openclaw-workspace"]},{id:"built-in",label:"Built-in Skills",sources:["openclaw-bundled"]},{id:"installed",label:"Installed Skills",sources:["openclaw-managed"]},{id:"extra",label:"Extra Skills",sources:["openclaw-extra"]}];function Uc(e){const t=new Map;for(const a of us)t.set(a.id,{id:a.id,label:a.label,skills:[]});const n=us.find(a=>a.id==="built-in"),s={id:"other",label:"Other Skills",skills:[]};for(const a of e){const o=a.bundled?n:us.find(r=>r.sources.includes(a.source));o?t.get(o.id)?.skills.push(a):s.skills.push(a)}const i=us.map(a=>t.get(a.id)).filter(a=>!!(a&&a.skills.length>0));return s.skills.length>0&&i.push(s),i}function Hc(e){return[...e.missing.bins.map(t=>`bin:${t}`),...e.missing.env.map(t=>`env:${t}`),...e.missing.config.map(t=>`config:${t}`),...e.missing.os.map(t=>`os:${t}`)]}function jc(e){const t=[];return e.disabled&&t.push("disabled"),e.blockedByAllowlist&&t.push("blocked by allowlist"),t}function Kc(e){const t=e.skill,n=!!e.showBundledBadge;return l`
    <div class="chip-row" style="margin-top: 6px;">
      <span class="chip">${t.source}</span>
      ${n?l`
              <span class="chip">bundled</span>
            `:v}
      <span class="chip ${t.eligible?"chip-ok":"chip-warn"}">
        ${t.eligible?"eligible":"blocked"}
      </span>
      ${t.disabled?l`
              <span class="chip chip-warn">disabled</span>
            `:v}
    </div>
  `}function _v(e){const t=ii(e.configForm,e.agentId),n=t.entry?.tools??{},s=t.globalTools??{},i=n.profile??s.profile??"full",a=n.profile?"agent override":s.profile?"global default":"default",o=Array.isArray(n.allow)&&n.allow.length>0,r=Array.isArray(s.allow)&&s.allow.length>0,c=!!e.configForm&&!e.configLoading&&!e.configSaving&&!o,u=o?[]:Array.isArray(n.alsoAllow)?n.alsoAllow:[],p=o?[]:Array.isArray(n.deny)?n.deny:[],g=o?{allow:n.allow??[],deny:n.deny??[]}:vv(i)??void 0,d=Er.flatMap(S=>S.tools.map(A=>A.id)),h=S=>{const A=hv(S,g),k=Rr(S,u),C=Rr(S,p);return{allowed:(A||k)&&!C,baseAllowed:A,denied:C}},f=d.filter(S=>h(S).allowed).length,m=(S,A)=>{const k=new Set(u.map(M=>qe(M)).filter(M=>M.length>0)),C=new Set(p.map(M=>qe(M)).filter(M=>M.length>0)),_=h(S).baseAllowed,T=qe(S);A?(C.delete(T),_||k.add(T)):(k.delete(T),C.add(T)),e.onOverridesChange(e.agentId,[...k],[...C])},w=S=>{const A=new Set(u.map(C=>qe(C)).filter(C=>C.length>0)),k=new Set(p.map(C=>qe(C)).filter(C=>C.length>0));for(const C of d){const _=h(C).baseAllowed,T=qe(C);S?(k.delete(T),_||A.add(T)):(A.delete(T),k.add(T))}e.onOverridesChange(e.agentId,[...A],[...k])};return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Tool Access</div>
          <div class="card-sub">
            Profile + per-tool overrides for this agent.
            <span class="mono">${f}/${d.length}</span> enabled.
          </div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn btn--sm" ?disabled=${!c} @click=${()=>w(!0)}>
            Enable All
          </button>
          <button class="btn btn--sm" ?disabled=${!c} @click=${()=>w(!1)}>
            Disable All
          </button>
          <button class="btn btn--sm" ?disabled=${e.configLoading} @click=${e.onConfigReload}>
            Reload Config
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?"Saving…":"Save"}
          </button>
        </div>
      </div>

      ${e.configForm?v:l`
              <div class="callout info" style="margin-top: 12px">
                Load the gateway config to adjust tool profiles.
              </div>
            `}
      ${o?l`
              <div class="callout info" style="margin-top: 12px">
                This agent is using an explicit allowlist in config. Tool overrides are managed in the Config tab.
              </div>
            `:v}
      ${r?l`
              <div class="callout info" style="margin-top: 12px">
                Global tools.allow is set. Agent overrides cannot enable tools that are globally blocked.
              </div>
            `:v}

      <div class="agent-tools-meta" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">Profile</div>
          <div class="mono">${i}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Source</div>
          <div>${a}</div>
        </div>
        ${e.configDirty?l`
                <div class="agent-kv">
                  <div class="label">Status</div>
                  <div class="mono">unsaved</div>
                </div>
              `:v}
      </div>

      <div class="agent-tools-presets" style="margin-top: 16px;">
        <div class="label">Quick Presets</div>
        <div class="agent-tools-buttons">
          ${lv.map(S=>l`
              <button
                class="btn btn--sm ${i===S.id?"active":""}"
                ?disabled=${!c}
                @click=${()=>e.onProfileChange(e.agentId,S.id,!0)}
              >
                ${S.label}
              </button>
            `)}
          <button
            class="btn btn--sm"
            ?disabled=${!c}
            @click=${()=>e.onProfileChange(e.agentId,null,!1)}
          >
            Inherit
          </button>
        </div>
      </div>

      <div class="agent-tools-grid" style="margin-top: 20px;">
        ${Er.map(S=>l`
              <div class="agent-tools-section">
                <div class="agent-tools-header">${S.label}</div>
                <div class="agent-tools-list">
                  ${S.tools.map(A=>{const{allowed:k}=h(A.id);return l`
                      <div class="agent-tool-row">
                        <div>
                          <div class="agent-tool-title mono">${A.label}</div>
                          <div class="agent-tool-sub">${A.description}</div>
                        </div>
                        <label class="cfg-toggle">
                          <input
                            type="checkbox"
                            .checked=${k}
                            ?disabled=${!c}
                            @change=${C=>m(A.id,C.target.checked)}
                          />
                          <span class="cfg-toggle__track"></span>
                        </label>
                      </div>
                    `})}
                </div>
              </div>
            `)}
      </div>
    </section>
  `}function Ev(e){const t=!!e.configForm&&!e.configLoading&&!e.configSaving,n=ii(e.configForm,e.agentId),s=Array.isArray(n.entry?.skills)?n.entry?.skills:void 0,i=new Set((s??[]).map(h=>h.trim()).filter(Boolean)),a=s!==void 0,o=!!(e.report&&e.activeAgentId===e.agentId),r=o?e.report?.skills??[]:[],c=e.filter.trim().toLowerCase(),u=c?r.filter(h=>[h.name,h.description,h.source].join(" ").toLowerCase().includes(c)):r,p=Uc(u),g=a?r.filter(h=>i.has(h.name)).length:r.length,d=r.length;return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Skills</div>
          <div class="card-sub">
            Per-agent skill allowlist and workspace skills.
            ${d>0?l`<span class="mono">${g}/${d}</span>`:v}
          </div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn btn--sm" ?disabled=${!t} @click=${()=>e.onClear(e.agentId)}>
            Use All
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${!t}
            @click=${()=>e.onDisableAll(e.agentId)}
          >
            Disable All
          </button>
          <button class="btn btn--sm" ?disabled=${e.configLoading} @click=${e.onConfigReload}>
            Reload Config
          </button>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Loading…":"Refresh"}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?"Saving…":"Save"}
          </button>
        </div>
      </div>

      ${e.configForm?v:l`
              <div class="callout info" style="margin-top: 12px">
                Load the gateway config to set per-agent skills.
              </div>
            `}
      ${a?l`
              <div class="callout info" style="margin-top: 12px">This agent uses a custom skill allowlist.</div>
            `:l`
              <div class="callout info" style="margin-top: 12px">
                All skills are enabled. Disabling any skill will create a per-agent allowlist.
              </div>
            `}
      ${!o&&!e.loading?l`
              <div class="callout info" style="margin-top: 12px">
                Load skills for this agent to view workspace-specific entries.
              </div>
            `:v}
      ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:v}

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="flex: 1;">
          <span>Filter</span>
          <input
            .value=${e.filter}
            @input=${h=>e.onFilterChange(h.target.value)}
            placeholder="Search skills"
          />
        </label>
        <div class="muted">${u.length} shown</div>
      </div>

      ${u.length===0?l`
              <div class="muted" style="margin-top: 16px">No skills found.</div>
            `:l`
              <div class="agent-skills-groups" style="margin-top: 16px;">
                ${p.map(h=>Mv(h,{agentId:e.agentId,allowSet:i,usingAllowlist:a,editable:t,onToggle:e.onToggle}))}
              </div>
            `}
    </section>
  `}function Mv(e,t){const n=e.id==="workspace"||e.id==="built-in";return l`
    <details class="agent-skills-group" ?open=${!n}>
      <summary class="agent-skills-header">
        <span>${e.label}</span>
        <span class="muted">${e.skills.length}</span>
      </summary>
      <div class="list skills-grid">
        ${e.skills.map(s=>Lv(s,{agentId:t.agentId,allowSet:t.allowSet,usingAllowlist:t.usingAllowlist,editable:t.editable,onToggle:t.onToggle}))}
      </div>
    </details>
  `}function Lv(e,t){const n=t.usingAllowlist?t.allowSet.has(e.name):!0,s=Hc(e),i=jc(e);return l`
    <div class="list-item agent-skill-row">
      <div class="list-main">
        <div class="list-title">${e.emoji?`${e.emoji} `:""}${e.name}</div>
        <div class="list-sub">${e.description}</div>
        ${Kc({skill:e})}
        ${s.length>0?l`<div class="muted" style="margin-top: 6px;">Missing: ${s.join(", ")}</div>`:v}
        ${i.length>0?l`<div class="muted" style="margin-top: 6px;">Reason: ${i.join(", ")}</div>`:v}
      </div>
      <div class="list-meta">
        <label class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${n}
            ?disabled=${!t.editable}
            @change=${a=>t.onToggle(t.agentId,e.name,a.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </label>
      </div>
    </div>
  `}function Iv(e){const t=e.agentsList?.agents??[],n=e.agentsList?.defaultId??null,s=e.selectedAgentId??n??t[0]?.id??null,i=s?t.find(a=>a.id===s)??null:null;return l`
    <div class="agents-layout">
      <section class="card agents-sidebar">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Agents</div>
            <div class="card-sub">${t.length} configured.</div>
          </div>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Loading…":"Refresh"}
          </button>
        </div>
        ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:v}
        <div class="agent-list" style="margin-top: 12px;">
          ${t.length===0?l`
                  <div class="muted">No agents found.</div>
                `:t.map(a=>{const o=Bc(a.id,n),r=si(a,e.agentIdentityById[a.id]??null);return l`
                    <button
                      type="button"
                      class="agent-row ${s===a.id?"active":""}"
                      @click=${()=>e.onSelectAgent(a.id)}
                    >
                      <div class="agent-avatar">${r||Xi(a).slice(0,1)}</div>
                      <div class="agent-info">
                        <div class="agent-title">${Xi(a)}</div>
                        <div class="agent-sub mono">${a.id}</div>
                      </div>
                      ${o?l`<span class="agent-pill">${o}</span>`:v}
                    </button>
                  `})}
        </div>
      </section>
      <section class="agents-main">
        ${i?l`
                ${Rv(i,n,e.agentIdentityById[i.id]??null)}
                ${Pv(e.activePanel,a=>e.onSelectPanel(a))}
                ${e.activePanel==="overview"?Dv({agent:i,defaultId:n,configForm:e.configForm,agentFilesList:e.agentFilesList,agentIdentity:e.agentIdentityById[i.id]??null,agentIdentityError:e.agentIdentityError,agentIdentityLoading:e.agentIdentityLoading,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configDirty,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave,onModelChange:e.onModelChange,onModelFallbacksChange:e.onModelFallbacksChange}):v}
                ${e.activePanel==="files"?Cv({agentId:i.id,agentFilesList:e.agentFilesList,agentFilesLoading:e.agentFilesLoading,agentFilesError:e.agentFilesError,agentFileActive:e.agentFileActive,agentFileContents:e.agentFileContents,agentFileDrafts:e.agentFileDrafts,agentFileSaving:e.agentFileSaving,onLoadFiles:e.onLoadFiles,onSelectFile:e.onSelectFile,onFileDraftChange:e.onFileDraftChange,onFileReset:e.onFileReset,onFileSave:e.onFileSave}):v}
                ${e.activePanel==="tools"?_v({agentId:i.id,configForm:e.configForm,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configDirty,onProfileChange:e.onToolsProfileChange,onOverridesChange:e.onToolsOverridesChange,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):v}
                ${e.activePanel==="skills"?Ev({agentId:i.id,report:e.agentSkillsReport,loading:e.agentSkillsLoading,error:e.agentSkillsError,activeAgentId:e.agentSkillsAgentId,configForm:e.configForm,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configDirty,filter:e.skillsFilter,onFilterChange:e.onSkillsFilterChange,onRefresh:e.onSkillsRefresh,onToggle:e.onAgentSkillToggle,onClear:e.onAgentSkillsClear,onDisableAll:e.onAgentSkillsDisableAll,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):v}
                ${e.activePanel==="channels"?Sv({context:Mr(i,e.configForm,e.agentFilesList,n,e.agentIdentityById[i.id]??null),configForm:e.configForm,snapshot:e.channelsSnapshot,loading:e.channelsLoading,error:e.channelsError,lastSuccess:e.channelsLastSuccess,onRefresh:e.onChannelsRefresh}):v}
                ${e.activePanel==="cron"?Av({context:Mr(i,e.configForm,e.agentFilesList,n,e.agentIdentityById[i.id]??null),agentId:i.id,jobs:e.cronJobs,status:e.cronStatus,loading:e.cronLoading,error:e.cronError,onRefresh:e.onCronRefresh}):v}
              `:l`
                <div class="card">
                  <div class="card-title">Select an agent</div>
                  <div class="card-sub">Pick an agent to inspect its workspace and tools.</div>
                </div>
              `}
      </section>
    </div>
  `}function Rv(e,t,n){const s=Bc(e.id,t),i=Xi(e),a=e.identity?.theme?.trim()||"Agent workspace and routing.",o=si(e,n);return l`
    <section class="card agent-header">
      <div class="agent-header-main">
        <div class="agent-avatar agent-avatar--lg">${o||i.slice(0,1)}</div>
        <div>
          <div class="card-title">${i}</div>
          <div class="card-sub">${a}</div>
        </div>
      </div>
      <div class="agent-header-meta">
        <div class="mono">${e.id}</div>
        ${s?l`<span class="agent-pill">${s}</span>`:v}
      </div>
    </section>
  `}function Pv(e,t){return l`
    <div class="agent-tabs">
      ${[{id:"overview",label:"Overview"},{id:"files",label:"Files"},{id:"tools",label:"Tools"},{id:"skills",label:"Skills"},{id:"channels",label:"Channels"},{id:"cron",label:"Cron Jobs"}].map(s=>l`
          <button
            class="agent-tab ${e===s.id?"active":""}"
            type="button"
            @click=${()=>t(s.id)}
          >
            ${s.label}
          </button>
        `)}
    </div>
  `}function Dv(e){const{agent:t,configForm:n,agentFilesList:s,agentIdentity:i,agentIdentityLoading:a,agentIdentityError:o,configLoading:r,configSaving:c,configDirty:u,onConfigReload:p,onConfigSave:g,onModelChange:d,onModelFallbacksChange:h}=e,f=ii(n,t.id),w=(s&&s.agentId===t.id?s.workspace:null)||f.entry?.workspace||f.defaults?.workspace||"default",S=f.entry?.model?In(f.entry?.model):In(f.defaults?.model),A=In(f.defaults?.model),k=Ir(f.entry?.model)||(S!=="-"?Lr(S):null),C=Ir(f.defaults?.model)||(A!=="-"?Lr(A):null),_=k??C??null,T=dv(f.entry?.model),M=T?T.join(", "):"",Y=i?.name?.trim()||t.identity?.name?.trim()||t.name?.trim()||f.entry?.name||"-",te=si(t,i)||"-",P=Array.isArray(f.entry?.skills)?f.entry?.skills:null,W=P?.length??null,ne=a?"Loading…":o?"Unavailable":"",re=!!(e.defaultId&&t.id===e.defaultId);return l`
    <section class="card">
      <div class="card-title">Overview</div>
      <div class="card-sub">Workspace paths and identity metadata.</div>
      <div class="agents-overview-grid" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">Workspace</div>
          <div class="mono">${w}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Primary Model</div>
          <div class="mono">${S}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Identity Name</div>
          <div>${Y}</div>
          ${ne?l`<div class="agent-kv-sub muted">${ne}</div>`:v}
        </div>
        <div class="agent-kv">
          <div class="label">Default</div>
          <div>${re?"yes":"no"}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Identity Emoji</div>
          <div>${te}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Skills Filter</div>
          <div>${P?`${W} selected`:"all skills"}</div>
        </div>
      </div>

      <div class="agent-model-select" style="margin-top: 20px;">
        <div class="label">Model Selection</div>
        <div class="row" style="gap: 12px; flex-wrap: wrap;">
          <label class="field" style="min-width: 260px; flex: 1;">
            <span>Primary model${re?" (default)":""}</span>
            <select
              .value=${_??""}
              ?disabled=${!n||r||c}
              @change=${E=>d(t.id,E.target.value||null)}
            >
              ${re?v:l`
                      <option value="">
                        ${C?`Inherit default (${C})`:"Inherit default"}
                      </option>
                    `}
              ${pv(n,_??void 0)}
            </select>
          </label>
          <label class="field" style="min-width: 260px; flex: 1;">
            <span>Fallbacks (comma-separated)</span>
            <input
              .value=${M}
              ?disabled=${!n||r||c}
              placeholder="provider/model, provider/model"
              @input=${E=>h(t.id,uv(E.target.value))}
            />
          </label>
        </div>
        <div class="row" style="justify-content: flex-end; gap: 8px;">
          <button class="btn btn--sm" ?disabled=${r} @click=${p}>
            Reload Config
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${c||!u}
            @click=${g}
          >
            ${c?"Saving…":"Save"}
          </button>
        </div>
      </div>
    </section>
  `}const Nv=new Set(["title","description","default","nullable"]);function Fv(e){return Object.keys(e??{}).filter(n=>!Nv.has(n)).length===0}function Ov(e){if(e===void 0)return"";try{return JSON.stringify(e,null,2)??""}catch{return""}}const Gn={chevronDown:l`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,plus:l`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `,minus:l`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `,trash:l`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  `,edit:l`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  `};function wt(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:r}=e,c=e.showLabel??!0,u=Le(t),p=De(s,i),g=p?.label??t.title??rt(String(s.at(-1))),d=p?.help??t.description,h=$a(s);if(a.has(h))return l`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${g}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(t.anyOf||t.oneOf){const m=(t.anyOf??t.oneOf??[]).filter(_=>!(_.type==="null"||Array.isArray(_.type)&&_.type.includes("null")));if(m.length===1)return wt({...e,schema:m[0]});const w=_=>{if(_.const!==void 0)return _.const;if(_.enum&&_.enum.length===1)return _.enum[0]},S=m.map(w),A=S.every(_=>_!==void 0);if(A&&S.length>0&&S.length<=5){const _=n??t.default;return l`
        <div class="cfg-field">
          ${c?l`<label class="cfg-field__label">${g}</label>`:v}
          ${d?l`<div class="cfg-field__help">${d}</div>`:v}
          <div class="cfg-segmented">
            ${S.map(T=>l`
              <button
                type="button"
                class="cfg-segmented__btn ${T===_||String(T)===String(_)?"active":""}"
                ?disabled=${o}
                @click=${()=>r(s,T)}
              >
                ${String(T)}
              </button>
            `)}
          </div>
        </div>
      `}if(A&&S.length>5)return Dr({...e,options:S,value:n??t.default});const k=new Set(m.map(_=>Le(_)).filter(Boolean)),C=new Set([...k].map(_=>_==="integer"?"number":_));if([...C].every(_=>["string","number","boolean"].includes(_))){const _=C.has("string"),T=C.has("number");if(C.has("boolean")&&C.size===1)return wt({...e,schema:{...t,type:"boolean",anyOf:void 0,oneOf:void 0}});if(_||T)return Pr({...e,inputType:T&&!_?"number":"text"})}}if(t.enum){const f=t.enum;if(f.length<=5){const m=n??t.default;return l`
        <div class="cfg-field">
          ${c?l`<label class="cfg-field__label">${g}</label>`:v}
          ${d?l`<div class="cfg-field__help">${d}</div>`:v}
          <div class="cfg-segmented">
            ${f.map(w=>l`
              <button
                type="button"
                class="cfg-segmented__btn ${w===m||String(w)===String(m)?"active":""}"
                ?disabled=${o}
                @click=${()=>r(s,w)}
              >
                ${String(w)}
              </button>
            `)}
          </div>
        </div>
      `}return Dr({...e,options:f,value:n??t.default})}if(u==="object")return zv(e);if(u==="array")return Uv(e);if(u==="boolean"){const f=typeof n=="boolean"?n:typeof t.default=="boolean"?t.default:!1;return l`
      <label class="cfg-toggle-row ${o?"disabled":""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${g}</span>
          ${d?l`<span class="cfg-toggle-row__help">${d}</span>`:v}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${f}
            ?disabled=${o}
            @change=${m=>r(s,m.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `}return u==="number"||u==="integer"?Bv(e):u==="string"?Pr({...e,inputType:"text"}):l`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${g}</div>
      <div class="cfg-field__error">Unsupported type: ${u}. Use Raw mode.</div>
    </div>
  `}function Pr(e){const{schema:t,value:n,path:s,hints:i,disabled:a,onPatch:o,inputType:r}=e,c=e.showLabel??!0,u=De(s,i),p=u?.label??t.title??rt(String(s.at(-1))),g=u?.help??t.description,d=(u?.sensitive??!1)&&!/^\$\{[^}]*\}$/.test(String(n??"").trim()),h=u?.placeholder??(d?"••••":t.default!==void 0?`Default: ${String(t.default)}`:""),f=n??"";return l`
    <div class="cfg-field">
      ${c?l`<label class="cfg-field__label">${p}</label>`:v}
      ${g?l`<div class="cfg-field__help">${g}</div>`:v}
      <div class="cfg-input-wrap">
        <input
          type=${d?"password":r}
          class="cfg-input"
          placeholder=${h}
          .value=${f==null?"":String(f)}
          ?disabled=${a}
          @input=${m=>{const w=m.target.value;if(r==="number"){if(w.trim()===""){o(s,void 0);return}const S=Number(w);o(s,Number.isNaN(S)?w:S);return}o(s,w)}}
          @change=${m=>{if(r==="number")return;const w=m.target.value;o(s,w.trim())}}
        />
        ${t.default!==void 0?l`
          <button
            type="button"
            class="cfg-input__reset"
            title="Reset to default"
            ?disabled=${a}
            @click=${()=>o(s,t.default)}
          >↺</button>
        `:v}
      </div>
    </div>
  `}function Bv(e){const{schema:t,value:n,path:s,hints:i,disabled:a,onPatch:o}=e,r=e.showLabel??!0,c=De(s,i),u=c?.label??t.title??rt(String(s.at(-1))),p=c?.help??t.description,g=n??t.default??"",d=typeof g=="number"?g:0;return l`
    <div class="cfg-field">
      ${r?l`<label class="cfg-field__label">${u}</label>`:v}
      ${p?l`<div class="cfg-field__help">${p}</div>`:v}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${a}
          @click=${()=>o(s,d-1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${g==null?"":String(g)}
          ?disabled=${a}
          @input=${h=>{const f=h.target.value,m=f===""?void 0:Number(f);o(s,m)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${a}
          @click=${()=>o(s,d+1)}
        >+</button>
      </div>
    </div>
  `}function Dr(e){const{schema:t,value:n,path:s,hints:i,disabled:a,options:o,onPatch:r}=e,c=e.showLabel??!0,u=De(s,i),p=u?.label??t.title??rt(String(s.at(-1))),g=u?.help??t.description,d=n??t.default,h=o.findIndex(m=>m===d||String(m)===String(d)),f="__unset__";return l`
    <div class="cfg-field">
      ${c?l`<label class="cfg-field__label">${p}</label>`:v}
      ${g?l`<div class="cfg-field__help">${g}</div>`:v}
      <select
        class="cfg-select"
        ?disabled=${a}
        .value=${h>=0?String(h):f}
        @change=${m=>{const w=m.target.value;r(s,w===f?void 0:o[Number(w)])}}
      >
        <option value=${f}>Select...</option>
        ${o.map((m,w)=>l`
          <option value=${String(w)}>${String(m)}</option>
        `)}
      </select>
    </div>
  `}function zv(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:r}=e,c=De(s,i),u=c?.label??t.title??rt(String(s.at(-1))),p=c?.help??t.description,g=n??t.default,d=g&&typeof g=="object"&&!Array.isArray(g)?g:{},h=t.properties??{},m=Object.entries(h).toSorted((C,_)=>{const T=De([...s,C[0]],i)?.order??0,M=De([...s,_[0]],i)?.order??0;return T!==M?T-M:C[0].localeCompare(_[0])}),w=new Set(Object.keys(h)),S=t.additionalProperties,A=!!S&&typeof S=="object",k=l`
    ${m.map(([C,_])=>wt({schema:_,value:d[C],path:[...s,C],hints:i,unsupported:a,disabled:o,onPatch:r}))}
    ${A?Hv({schema:S,value:d,path:s,hints:i,unsupported:a,disabled:o,reservedKeys:w,onPatch:r}):v}
  `;return s.length===1?l`
      <div class="cfg-fields">
        ${k}
      </div>
    `:l`
    <details class="cfg-object" open>
      <summary class="cfg-object__header">
        <span class="cfg-object__title">${u}</span>
        <span class="cfg-object__chevron">${Gn.chevronDown}</span>
      </summary>
      ${p?l`<div class="cfg-object__help">${p}</div>`:v}
      <div class="cfg-object__content">
        ${k}
      </div>
    </details>
  `}function Uv(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,onPatch:r}=e,c=e.showLabel??!0,u=De(s,i),p=u?.label??t.title??rt(String(s.at(-1))),g=u?.help??t.description,d=Array.isArray(t.items)?t.items[0]:t.items;if(!d)return l`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${p}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;const h=Array.isArray(n)?n:Array.isArray(t.default)?t.default:[];return l`
    <div class="cfg-array">
      <div class="cfg-array__header">
        ${c?l`<span class="cfg-array__label">${p}</span>`:v}
        <span class="cfg-array__count">${h.length} item${h.length!==1?"s":""}</span>
        <button
          type="button"
          class="cfg-array__add"
          ?disabled=${o}
          @click=${()=>{const f=[...h,Tl(d)];r(s,f)}}
        >
          <span class="cfg-array__add-icon">${Gn.plus}</span>
          Add
        </button>
      </div>
      ${g?l`<div class="cfg-array__help">${g}</div>`:v}

      ${h.length===0?l`
              <div class="cfg-array__empty">No items yet. Click "Add" to create one.</div>
            `:l`
        <div class="cfg-array__items">
          ${h.map((f,m)=>l`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${m+1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  title="Remove item"
                  ?disabled=${o}
                  @click=${()=>{const w=[...h];w.splice(m,1),r(s,w)}}
                >
                  ${Gn.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${wt({schema:d,value:f,path:[...s,m],hints:i,unsupported:a,disabled:o,showLabel:!1,onPatch:r})}
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `}function Hv(e){const{schema:t,value:n,path:s,hints:i,unsupported:a,disabled:o,reservedKeys:r,onPatch:c}=e,u=Fv(t),p=Object.entries(n??{}).filter(([g])=>!r.has(g));return l`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          ?disabled=${o}
          @click=${()=>{const g={...n};let d=1,h=`custom-${d}`;for(;h in g;)d+=1,h=`custom-${d}`;g[h]=u?{}:Tl(t),c(s,g)}}
        >
          <span class="cfg-map__add-icon">${Gn.plus}</span>
          Add Entry
        </button>
      </div>

      ${p.length===0?l`
              <div class="cfg-map__empty">No custom entries.</div>
            `:l`
        <div class="cfg-map__items">
          ${p.map(([g,d])=>{const h=[...s,g],f=Ov(d);return l`
              <div class="cfg-map__item">
                <div class="cfg-map__item-key">
                  <input
                    type="text"
                    class="cfg-input cfg-input--sm"
                    placeholder="Key"
                    .value=${g}
                    ?disabled=${o}
                    @change=${m=>{const w=m.target.value.trim();if(!w||w===g)return;const S={...n};w in S||(S[w]=S[g],delete S[g],c(s,S))}}
                  />
                </div>
                <div class="cfg-map__item-value">
                  ${u?l`
                        <textarea
                          class="cfg-textarea cfg-textarea--sm"
                          placeholder="JSON value"
                          rows="2"
                          .value=${f}
                          ?disabled=${o}
                          @change=${m=>{const w=m.target,S=w.value.trim();if(!S){c(h,void 0);return}try{c(h,JSON.parse(S))}catch{w.value=f}}}
                        ></textarea>
                      `:wt({schema:t,value:d,path:h,hints:i,unsupported:a,disabled:o,showLabel:!1,onPatch:c})}
                </div>
                <button
                  type="button"
                  class="cfg-map__item-remove"
                  title="Remove entry"
                  ?disabled=${o}
                  @click=${()=>{const m={...n};delete m[g],c(s,m)}}
                >
                  ${Gn.trash}
                </button>
              </div>
            `})}
        </div>
      `}
    </div>
  `}const Nr={env:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M15 4V2"></path>
      <path d="M15 16v-2"></path>
      <path d="M8 9h2"></path>
      <path d="M20 9h2"></path>
      <path d="M17.8 11.8 19 13"></path>
      <path d="M15 9h0"></path>
      <path d="M17.8 6.2 19 5"></path>
      <path d="m3 21 9-9"></path>
      <path d="M12.2 6.2 11 5"></path>
    </svg>
  `,meta:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 2v6"></path>
      <path d="m4.93 10.93 4.24 4.24"></path>
      <path d="M2 12h6"></path>
      <path d="m4.93 13.07 4.24-4.24"></path>
      <path d="M12 22v-6"></path>
      <path d="m19.07 13.07-4.24-4.24"></path>
      <path d="M22 12h-6"></path>
      <path d="m19.07 10.93-4.24 4.24"></path>
    </svg>
  `,default:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},eo={env:{label:"Environment Variables",description:"Environment variables passed to the gateway process"},update:{label:"Updates",description:"Auto-update settings and release channel"},agents:{label:"Agents",description:"Agent configurations, models, and identities"},auth:{label:"Authentication",description:"API keys and authentication profiles"},channels:{label:"Channels",description:"Messaging channels (Telegram, Discord, Slack, etc.)"},messages:{label:"Messages",description:"Message handling and routing settings"},commands:{label:"Commands",description:"Custom slash commands"},hooks:{label:"Hooks",description:"Webhooks and event hooks"},skills:{label:"Skills",description:"Skill packs and capabilities"},tools:{label:"Tools",description:"Tool configurations (browser, search, etc.)"},gateway:{label:"Gateway",description:"Gateway server settings (port, auth, binding)"},wizard:{label:"Setup Wizard",description:"Setup wizard state and history"},meta:{label:"Metadata",description:"Gateway metadata and version information"},logging:{label:"Logging",description:"Log levels and output configuration"},browser:{label:"Browser",description:"Browser automation settings"},ui:{label:"UI",description:"User interface preferences"},models:{label:"Models",description:"AI model configurations and providers"},bindings:{label:"Bindings",description:"Key bindings and shortcuts"},broadcast:{label:"Broadcast",description:"Broadcast and notification settings"},audio:{label:"Audio",description:"Audio input/output settings"},session:{label:"Session",description:"Session management and persistence"},cron:{label:"Cron",description:"Scheduled tasks and automation"},web:{label:"Web",description:"Web server and API settings"},discovery:{label:"Discovery",description:"Service discovery and networking"},canvasHost:{label:"Canvas Host",description:"Canvas rendering and display"},talk:{label:"Talk",description:"Voice and speech settings"},plugins:{label:"Plugins",description:"Plugin management and extensions"}};function Fr(e){return Nr[e]??Nr.default}function jv(e,t,n){if(!n)return!0;const s=n.toLowerCase(),i=eo[e];return e.toLowerCase().includes(s)||i&&(i.label.toLowerCase().includes(s)||i.description.toLowerCase().includes(s))?!0:An(t,s)}function An(e,t){if(e.title?.toLowerCase().includes(t)||e.description?.toLowerCase().includes(t)||e.enum?.some(s=>String(s).toLowerCase().includes(t)))return!0;if(e.properties){for(const[s,i]of Object.entries(e.properties))if(s.toLowerCase().includes(t)||An(i,t))return!0}if(e.items){const s=Array.isArray(e.items)?e.items:[e.items];for(const i of s)if(i&&An(i,t))return!0}if(e.additionalProperties&&typeof e.additionalProperties=="object"&&An(e.additionalProperties,t))return!0;const n=e.anyOf??e.oneOf??e.allOf;if(n){for(const s of n)if(s&&An(s,t))return!0}return!1}function Kv(e){if(!e.schema)return l`
      <div class="muted">Schema unavailable.</div>
    `;const t=e.schema,n=e.value??{};if(Le(t)!=="object"||!t.properties)return l`
      <div class="callout danger">Unsupported schema. Use Raw.</div>
    `;const s=new Set(e.unsupportedPaths??[]),i=t.properties,a=e.searchQuery??"",o=e.activeSection,r=e.activeSubsection??null,u=Object.entries(i).toSorted((g,d)=>{const h=De([g[0]],e.uiHints)?.order??50,f=De([d[0]],e.uiHints)?.order??50;return h!==f?h-f:g[0].localeCompare(d[0])}).filter(([g,d])=>!(o&&g!==o||a&&!jv(g,d,a)));let p=null;if(o&&r&&u.length===1){const g=u[0]?.[1];g&&Le(g)==="object"&&g.properties&&g.properties[r]&&(p={sectionKey:o,subsectionKey:r,schema:g.properties[r]})}return u.length===0?l`
      <div class="config-empty">
        <div class="config-empty__icon">${oe.search}</div>
        <div class="config-empty__text">
          ${a?`No settings match "${a}"`:"No settings in this section"}
        </div>
      </div>
    `:l`
    <div class="config-form config-form--modern">
      ${p?(()=>{const{sectionKey:g,subsectionKey:d,schema:h}=p,f=De([g,d],e.uiHints),m=f?.label??h.title??rt(d),w=f?.help??h.description??"",S=n[g],A=S&&typeof S=="object"?S[d]:void 0,k=`config-section-${g}-${d}`;return l`
              <section class="config-section-card" id=${k}>
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Fr(g)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${m}</h3>
                    ${w?l`<p class="config-section-card__desc">${w}</p>`:v}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${wt({schema:h,value:A,path:[g,d],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})():u.map(([g,d])=>{const h=eo[g]??{label:g.charAt(0).toUpperCase()+g.slice(1),description:d.description??""};return l`
              <section class="config-section-card" id="config-section-${g}">
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Fr(g)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${h.label}</h3>
                    ${h.description?l`<p class="config-section-card__desc">${h.description}</p>`:v}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${wt({schema:d,value:n[g],path:[g],hints:e.uiHints,unsupported:s,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})}
    </div>
  `}const Wv=new Set(["title","description","default","nullable"]);function Vv(e){return Object.keys(e??{}).filter(n=>!Wv.has(n)).length===0}function Wc(e){const t=e.filter(i=>i!=null),n=t.length!==e.length,s=[];for(const i of t)s.some(a=>Object.is(a,i))||s.push(i);return{enumValues:s,nullable:n}}function Vc(e){return!e||typeof e!="object"?{schema:null,unsupportedPaths:["<root>"]}:Pn(e,[])}function Pn(e,t){const n=new Set,s={...e},i=$a(t)||"<root>";if(e.anyOf||e.oneOf||e.allOf){const r=qv(e,t);return r||{schema:e,unsupportedPaths:[i]}}const a=Array.isArray(e.type)&&e.type.includes("null"),o=Le(e)??(e.properties||e.additionalProperties?"object":void 0);if(s.type=o??e.type,s.nullable=a||e.nullable,s.enum){const{enumValues:r,nullable:c}=Wc(s.enum);s.enum=r,c&&(s.nullable=!0),r.length===0&&n.add(i)}if(o==="object"){const r=e.properties??{},c={};for(const[u,p]of Object.entries(r)){const g=Pn(p,[...t,u]);g.schema&&(c[u]=g.schema);for(const d of g.unsupportedPaths)n.add(d)}if(s.properties=c,e.additionalProperties===!0)n.add(i);else if(e.additionalProperties===!1)s.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties=="object"&&!Vv(e.additionalProperties)){const u=Pn(e.additionalProperties,[...t,"*"]);s.additionalProperties=u.schema??e.additionalProperties,u.unsupportedPaths.length>0&&n.add(i)}}else if(o==="array"){const r=Array.isArray(e.items)?e.items[0]:e.items;if(!r)n.add(i);else{const c=Pn(r,[...t,"*"]);s.items=c.schema??r,c.unsupportedPaths.length>0&&n.add(i)}}else o!=="string"&&o!=="number"&&o!=="integer"&&o!=="boolean"&&!s.enum&&n.add(i);return{schema:s,unsupportedPaths:Array.from(n)}}function qv(e,t){if(e.allOf)return null;const n=e.anyOf??e.oneOf;if(!n)return null;const s=[],i=[];let a=!1;for(const r of n){if(!r||typeof r!="object")return null;if(Array.isArray(r.enum)){const{enumValues:c,nullable:u}=Wc(r.enum);s.push(...c),u&&(a=!0);continue}if("const"in r){if(r.const==null){a=!0;continue}s.push(r.const);continue}if(Le(r)==="null"){a=!0;continue}i.push(r)}if(s.length>0&&i.length===0){const r=[];for(const c of s)r.some(u=>Object.is(u,c))||r.push(c);return{schema:{...e,enum:r,nullable:a,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}}if(i.length===1){const r=Pn(i[0],t);return r.schema&&(r.schema.nullable=a||r.schema.nullable),r}const o=new Set(["string","number","integer","boolean"]);return i.length>0&&s.length===0&&i.every(r=>r.type&&o.has(String(r.type)))?{schema:{...e,nullable:a},unsupportedPaths:[]}:null}function Gv(e,t){let n=e;for(const s of t){if(!n)return null;const i=Le(n);if(i==="object"){const a=n.properties??{};if(typeof s=="string"&&a[s]){n=a[s];continue}const o=n.additionalProperties;if(typeof s=="string"&&o&&typeof o=="object"){n=o;continue}return null}if(i==="array"){if(typeof s!="number")return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function Qv(e,t){const s=(e.channels??{})[t],i=e[t];return(s&&typeof s=="object"?s:null)??(i&&typeof i=="object"?i:null)??{}}const Yv=["groupPolicy","streamMode","dmPolicy"];function Zv(e){if(e==null)return"n/a";if(typeof e=="string"||typeof e=="number"||typeof e=="boolean")return String(e);try{return JSON.stringify(e)}catch{return"n/a"}}function Jv(e){const t=Yv.flatMap(n=>n in e?[[n,e[n]]]:[]);return t.length===0?null:l`
    <div class="status-list" style="margin-top: 12px;">
      ${t.map(([n,s])=>l`
          <div>
            <span class="label">${n}</span>
            <span>${Zv(s)}</span>
          </div>
        `)}
    </div>
  `}function Xv(e){const t=Vc(e.schema),n=t.schema;if(!n)return l`
      <div class="callout danger">Schema unavailable. Use Raw.</div>
    `;const s=Gv(n,["channels",e.channelId]);if(!s)return l`
      <div class="callout danger">Channel config schema unavailable.</div>
    `;const i=e.configValue??{},a=Qv(i,e.channelId);return l`
    <div class="config-form">
      ${wt({schema:s,value:a,path:["channels",e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
    ${Jv(a)}
  `}function lt(e){const{channelId:t,props:n}=e,s=n.configSaving||n.configSchemaLoading;return l`
    <div style="margin-top: 16px;">
      ${n.configSchemaLoading?l`
              <div class="muted">Loading config schema…</div>
            `:Xv({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:s,onPatch:n.onConfigPatch})}
      <div class="row" style="margin-top: 12px;">
        <button
          class="btn primary"
          ?disabled=${s||!n.configFormDirty}
          @click=${()=>n.onConfigSave()}
        >
          ${n.configSaving?"Saving…":"Save"}
        </button>
        <button
          class="btn"
          ?disabled=${s}
          @click=${()=>n.onConfigReload()}
        >
          Reload
        </button>
      </div>
    </div>
  `}function em(e){const{props:t,discord:n,accountCountLabel:s}=e;return l`
    <div class="card">
      <div class="card-title">Discord</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${n?.lastStartAt?J(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?J(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:v}

      ${n?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:v}

      ${lt({channelId:"discord",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function tm(e){const{props:t,googleChat:n,accountCountLabel:s}=e;return l`
    <div class="card">
      <div class="card-title">Google Chat</div>
      <div class="card-sub">Chat API webhook status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?n.configured?"Yes":"No":"n/a"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?n.running?"Yes":"No":"n/a"}</span>
        </div>
        <div>
          <span class="label">Credential</span>
          <span>${n?.credentialSource??"n/a"}</span>
        </div>
        <div>
          <span class="label">Audience</span>
          <span>
            ${n?.audienceType?`${n.audienceType}${n.audience?` · ${n.audience}`:""}`:"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${n?.lastStartAt?J(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?J(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:v}

      ${n?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:v}

      ${lt({channelId:"googlechat",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function nm(e){const{props:t,imessage:n,accountCountLabel:s}=e;return l`
    <div class="card">
      <div class="card-title">iMessage</div>
      <div class="card-sub">macOS bridge status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${n?.lastStartAt?J(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?J(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:v}

      ${n?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.error??""}
          </div>`:v}

      ${lt({channelId:"imessage",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Or(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:"n/a"}function sm(e){const{props:t,nostr:n,nostrAccounts:s,accountCountLabel:i,profileFormState:a,profileFormCallbacks:o,onEditProfile:r}=e,c=s[0],u=n?.configured??c?.configured??!1,p=n?.running??c?.running??!1,g=n?.publicKey??c?.publicKey,d=n?.lastStartAt??c?.lastStartAt??null,h=n?.lastError??c?.lastError??null,f=s.length>1,m=a!=null,w=A=>{const k=A.publicKey,C=A.profile,_=C?.displayName??C?.name??A.name??A.accountId;return l`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${_}</div>
          <div class="account-card-id">${A.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${A.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${A.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Public Key</span>
            <span class="monospace" title="${k??""}">${Or(k)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${A.lastInboundAt?J(A.lastInboundAt):"n/a"}</span>
          </div>
          ${A.lastError?l`
                <div class="account-card-error">${A.lastError}</div>
              `:v}
        </div>
      </div>
    `},S=()=>{if(m&&o)return mu({state:a,callbacks:o,accountId:s[0]?.accountId??"default"});const A=c?.profile??n?.profile,{name:k,displayName:C,about:_,picture:T,nip05:M}=A??{},Y=k||C||_||T||M;return l`
      <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 500;">Profile</div>
          ${u?l`
                <button
                  class="btn btn-sm"
                  @click=${r}
                  style="font-size: 12px; padding: 4px 8px;"
                >
                  Edit Profile
                </button>
              `:v}
        </div>
        ${Y?l`
              <div class="status-list">
                ${T?l`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${T}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${X=>{X.target.style.display="none"}}
                        />
                      </div>
                    `:v}
                ${k?l`<div><span class="label">Name</span><span>${k}</span></div>`:v}
                ${C?l`<div><span class="label">Display Name</span><span>${C}</span></div>`:v}
                ${_?l`<div><span class="label">About</span><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${_}</span></div>`:v}
                ${M?l`<div><span class="label">NIP-05</span><span>${M}</span></div>`:v}
              </div>
            `:l`
                <div style="color: var(--text-muted); font-size: 13px">
                  No profile set. Click "Edit Profile" to add your name, bio, and avatar.
                </div>
              `}
      </div>
    `};return l`
    <div class="card">
      <div class="card-title">Nostr</div>
      <div class="card-sub">Decentralized DMs via Nostr relays (NIP-04).</div>
      ${i}

      ${f?l`
            <div class="account-card-list">
              ${s.map(A=>w(A))}
            </div>
          `:l`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${u?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${p?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Public Key</span>
                <span class="monospace" title="${g??""}"
                  >${Or(g)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${d?J(d):"n/a"}</span>
              </div>
            </div>
          `}

      ${h?l`<div class="callout danger" style="margin-top: 12px;">${h}</div>`:v}

      ${S()}

      ${lt({channelId:"nostr",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function im(e,t){const n=t.snapshot,s=n?.channels;if(!n||!s)return!1;const i=s[e],a=typeof i?.configured=="boolean"&&i.configured,o=typeof i?.running=="boolean"&&i.running,r=typeof i?.connected=="boolean"&&i.connected,u=(n.channelAccounts?.[e]??[]).some(p=>p.configured||p.running||p.connected);return a||o||r||u}function am(e,t){return t?.[e]?.length??0}function qc(e,t){const n=am(e,t);return n<2?v:l`<div class="account-count">Accounts (${n})</div>`}function om(e){const{props:t,signal:n,accountCountLabel:s}=e;return l`
    <div class="card">
      <div class="card-title">Signal</div>
      <div class="card-sub">signal-cli status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Base URL</span>
          <span>${n?.baseUrl??"n/a"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${n?.lastStartAt?J(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?J(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:v}

      ${n?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:v}

      ${lt({channelId:"signal",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function rm(e){const{props:t,slack:n,accountCountLabel:s}=e;return l`
    <div class="card">
      <div class="card-title">Slack</div>
      <div class="card-sub">Socket mode status and channel configuration.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${n?.lastStartAt?J(n.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${n?.lastProbeAt?J(n.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${n?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:v}

      ${n?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:v}

      ${lt({channelId:"slack",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function lm(e){const{props:t,telegram:n,telegramAccounts:s,accountCountLabel:i}=e,a=s.length>1,o=r=>{const u=r.probe?.bot?.username,p=r.name||r.accountId;return l`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">
            ${u?`@${u}`:p}
          </div>
          <div class="account-card-id">${r.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${r.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${r.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${r.lastInboundAt?J(r.lastInboundAt):"n/a"}</span>
          </div>
          ${r.lastError?l`
                <div class="account-card-error">
                  ${r.lastError}
                </div>
              `:v}
        </div>
      </div>
    `};return l`
    <div class="card">
      <div class="card-title">Telegram</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${i}

      ${a?l`
            <div class="account-card-list">
              ${s.map(r=>o(r))}
            </div>
          `:l`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${n?.configured?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${n?.running?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Mode</span>
                <span>${n?.mode??"n/a"}</span>
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${n?.lastStartAt?J(n.lastStartAt):"n/a"}</span>
              </div>
              <div>
                <span class="label">Last probe</span>
                <span>${n?.lastProbeAt?J(n.lastProbeAt):"n/a"}</span>
              </div>
            </div>
          `}

      ${n?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:v}

      ${n?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${n.probe.ok?"ok":"failed"} ·
            ${n.probe.status??""} ${n.probe.error??""}
          </div>`:v}

      ${lt({channelId:"telegram",props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function cm(e){const{props:t,whatsapp:n,accountCountLabel:s}=e;return l`
    <div class="card">
      <div class="card-title">WhatsApp</div>
      <div class="card-sub">Link WhatsApp Web and monitor connection health.</div>
      ${s}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${n?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Linked</span>
          <span>${n?.linked?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${n?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Connected</span>
          <span>${n?.connected?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last connect</span>
          <span>
            ${n?.lastConnectedAt?J(n.lastConnectedAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last message</span>
          <span>
            ${n?.lastMessageAt?J(n.lastMessageAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Auth age</span>
          <span>
            ${n?.authAgeMs!=null?Pa(n.authAgeMs):"n/a"}
          </span>
        </div>
      </div>

      ${n?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${n.lastError}
          </div>`:v}

      ${t.whatsappMessage?l`<div class="callout" style="margin-top: 12px;">
            ${t.whatsappMessage}
          </div>`:v}

      ${t.whatsappQrDataUrl?l`<div class="qr-wrap">
            <img src=${t.whatsappQrDataUrl} alt="WhatsApp QR" />
          </div>`:v}

      <div class="row" style="margin-top: 14px; flex-wrap: wrap;">
        <button
          class="btn primary"
          ?disabled=${t.whatsappBusy}
          @click=${()=>t.onWhatsAppStart(!1)}
        >
          ${t.whatsappBusy?"Working…":"Show QR"}
        </button>
        <button
          class="btn"
          ?disabled=${t.whatsappBusy}
          @click=${()=>t.onWhatsAppStart(!0)}
        >
          Relink
        </button>
        <button
          class="btn"
          ?disabled=${t.whatsappBusy}
          @click=${()=>t.onWhatsAppWait()}
        >
          Wait for scan
        </button>
        <button
          class="btn danger"
          ?disabled=${t.whatsappBusy}
          @click=${()=>t.onWhatsAppLogout()}
        >
          Logout
        </button>
        <button class="btn" @click=${()=>t.onRefresh(!0)}>
          Refresh
        </button>
      </div>

      ${lt({channelId:"whatsapp",props:t})}
    </div>
  `}function dm(e){const t=e.snapshot?.channels,n=t?.whatsapp??void 0,s=t?.telegram??void 0,i=t?.discord??null,a=t?.googlechat??null,o=t?.slack??null,r=t?.signal??null,c=t?.imessage??null,u=t?.nostr??null,g=um(e.snapshot).map((d,h)=>({key:d,enabled:im(d,e),order:h})).toSorted((d,h)=>d.enabled!==h.enabled?d.enabled?-1:1:d.order-h.order);return l`
    <section class="grid grid-cols-2">
      ${g.map(d=>gm(d.key,e,{whatsapp:n,telegram:s,discord:i,googlechat:a,slack:o,signal:r,imessage:c,nostr:u,channelAccounts:e.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Channel health</div>
          <div class="card-sub">Channel status snapshots from the gateway.</div>
        </div>
        <div class="muted">${e.lastSuccessAt?J(e.lastSuccessAt):"n/a"}</div>
      </div>
      ${e.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:v}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):"No snapshot yet."}
      </pre>
    </section>
  `}function um(e){return e?.channelMeta?.length?e.channelMeta.map(t=>t.id):e?.channelOrder?.length?e.channelOrder:["whatsapp","telegram","discord","googlechat","slack","signal","imessage","nostr"]}function gm(e,t,n){const s=qc(e,n.channelAccounts);switch(e){case"whatsapp":return cm({props:t,whatsapp:n.whatsapp,accountCountLabel:s});case"telegram":return lm({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:s});case"discord":return em({props:t,discord:n.discord,accountCountLabel:s});case"googlechat":return tm({props:t,googleChat:n.googlechat,accountCountLabel:s});case"slack":return rm({props:t,slack:n.slack,accountCountLabel:s});case"signal":return om({props:t,signal:n.signal,accountCountLabel:s});case"imessage":return nm({props:t,imessage:n.imessage,accountCountLabel:s});case"nostr":{const i=n.channelAccounts?.nostr??[],a=i[0],o=a?.accountId??"default",r=a?.profile??null,c=t.nostrProfileAccountId===o?t.nostrProfileFormState:null,u=c?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return sm({props:t,nostr:n.nostr,nostrAccounts:i,accountCountLabel:s,profileFormState:c,profileFormCallbacks:u,onEditProfile:()=>t.onNostrProfileEdit(o,r)})}default:return pm(e,t,n.channelAccounts??{})}}function pm(e,t,n){const s=hm(t.snapshot,e),i=t.snapshot?.channels?.[e],a=typeof i?.configured=="boolean"?i.configured:void 0,o=typeof i?.running=="boolean"?i.running:void 0,r=typeof i?.connected=="boolean"?i.connected:void 0,c=typeof i?.lastError=="string"?i.lastError:void 0,u=n[e]??[],p=qc(e,n);return l`
    <div class="card">
      <div class="card-title">${s}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${p}

      ${u.length>0?l`
            <div class="account-card-list">
              ${u.map(g=>ym(g))}
            </div>
          `:l`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${a==null?"n/a":a?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${o==null?"n/a":o?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Connected</span>
                <span>${r==null?"n/a":r?"Yes":"No"}</span>
              </div>
            </div>
          `}

      ${c?l`<div class="callout danger" style="margin-top: 12px;">
            ${c}
          </div>`:v}

      ${lt({channelId:e,props:t})}
    </div>
  `}function fm(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(t=>[t.id,t])):{}}function hm(e,t){return fm(e)[t]?.label??e?.channelLabels?.[t]??t}const vm=600*1e3;function Gc(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<vm:!1}function mm(e){return e.running?"Yes":Gc(e)?"Active":"No"}function bm(e){return e.connected===!0?"Yes":e.connected===!1?"No":Gc(e)?"Active":"n/a"}function ym(e){const t=mm(e),n=bm(e);return l`
    <div class="account-card">
      <div class="account-card-header">
        <div class="account-card-title">${e.name||e.accountId}</div>
        <div class="account-card-id">${e.accountId}</div>
      </div>
      <div class="status-list account-card-status">
        <div>
          <span class="label">Running</span>
          <span>${t}</span>
        </div>
        <div>
          <span class="label">Configured</span>
          <span>${e.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Connected</span>
          <span>${n}</span>
        </div>
        <div>
          <span class="label">Last inbound</span>
          <span>${e.lastInboundAt?J(e.lastInboundAt):"n/a"}</span>
        </div>
        ${e.lastError?l`
              <div class="account-card-error">
                ${e.lastError}
              </div>
            `:v}
      </div>
    </div>
  `}const Dn=(e,t)=>{const n=e._$AN;if(n===void 0)return!1;for(const s of n)s._$AO?.(t,!1),Dn(s,t);return!0},Ns=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},Qc=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),wm(t)}};function xm(e){this._$AN!==void 0?(Ns(this),this._$AM=e,Qc(this)):this._$AM=e}function $m(e,t=!1,n=0){const s=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(s))for(let a=n;a<s.length;a++)Dn(s[a],!1),Ns(s[a]);else s!=null&&(Dn(s,!1),Ns(s));else Dn(this,e)}const wm=e=>{e.type==Ya.CHILD&&(e._$AP??=$m,e._$AQ??=xm)};class km extends Ja{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,n,s){super._$AT(t,n,s),Qc(this),this.isConnected=t._$AU}_$AO(t,n=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),n&&(Dn(this,t),Ns(this))}setValue(t){if(kh(this._$Ct))this._$Ct._$AI(t,this);else{const n=[...this._$Ct._$AH];n[this._$Ci]=t,this._$Ct._$AI(n,this,0)}}disconnected(){}reconnected(){}}const Ii=new WeakMap,Sm=Za(class extends km{render(e){return v}update(e,[t]){const n=t!==this.G;return n&&this.G!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),v}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let n=Ii.get(t);n===void 0&&(n=new WeakMap,Ii.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?Ii.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});class ta extends Ja{constructor(t){if(super(t),this.it=v,t.type!==Ya.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===v||t==null)return this._t=void 0,this.it=t;if(t===xt)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const n=[t];return n.raw=n,this._t={_$litType$:this.constructor.resultType,strings:n,values:[]}}}ta.directiveName="unsafeHTML",ta.resultType=1;const na=Za(ta);const{entries:Yc,setPrototypeOf:Br,isFrozen:Am,getPrototypeOf:Cm,getOwnPropertyDescriptor:Tm}=Object;let{freeze:Se,seal:Ne,create:sa}=Object,{apply:ia,construct:aa}=typeof Reflect<"u"&&Reflect;Se||(Se=function(t){return t});Ne||(Ne=function(t){return t});ia||(ia=function(t,n){for(var s=arguments.length,i=new Array(s>2?s-2:0),a=2;a<s;a++)i[a-2]=arguments[a];return t.apply(n,i)});aa||(aa=function(t){for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return new t(...s)});const gs=Ae(Array.prototype.forEach),_m=Ae(Array.prototype.lastIndexOf),zr=Ae(Array.prototype.pop),bn=Ae(Array.prototype.push),Em=Ae(Array.prototype.splice),ks=Ae(String.prototype.toLowerCase),Ri=Ae(String.prototype.toString),Pi=Ae(String.prototype.match),yn=Ae(String.prototype.replace),Mm=Ae(String.prototype.indexOf),Lm=Ae(String.prototype.trim),Fe=Ae(Object.prototype.hasOwnProperty),xe=Ae(RegExp.prototype.test),xn=Im(TypeError);function Ae(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,s=new Array(n>1?n-1:0),i=1;i<n;i++)s[i-1]=arguments[i];return ia(e,t,s)}}function Im(e){return function(){for(var t=arguments.length,n=new Array(t),s=0;s<t;s++)n[s]=arguments[s];return aa(e,n)}}function K(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:ks;Br&&Br(e,null);let s=t.length;for(;s--;){let i=t[s];if(typeof i=="string"){const a=n(i);a!==i&&(Am(t)||(t[s]=a),i=a)}e[i]=!0}return e}function Rm(e){for(let t=0;t<e.length;t++)Fe(e,t)||(e[t]=null);return e}function We(e){const t=sa(null);for(const[n,s]of Yc(e))Fe(e,n)&&(Array.isArray(s)?t[n]=Rm(s):s&&typeof s=="object"&&s.constructor===Object?t[n]=We(s):t[n]=s);return t}function $n(e,t){for(;e!==null;){const s=Tm(e,t);if(s){if(s.get)return Ae(s.get);if(typeof s.value=="function")return Ae(s.value)}e=Cm(e)}function n(){return null}return n}const Ur=Se(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Di=Se(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Ni=Se(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Pm=Se(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Fi=Se(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Dm=Se(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Hr=Se(["#text"]),jr=Se(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Oi=Se(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Kr=Se(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),ps=Se(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Nm=Ne(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Fm=Ne(/<%[\w\W]*|[\w\W]*%>/gm),Om=Ne(/\$\{[\w\W]*/gm),Bm=Ne(/^data-[\-\w.\u00B7-\uFFFF]+$/),zm=Ne(/^aria-[\-\w]+$/),Zc=Ne(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Um=Ne(/^(?:\w+script|data):/i),Hm=Ne(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Jc=Ne(/^html$/i),jm=Ne(/^[a-z][.\w]*(-[.\w]+)+$/i);var Wr=Object.freeze({__proto__:null,ARIA_ATTR:zm,ATTR_WHITESPACE:Hm,CUSTOM_ELEMENT:jm,DATA_ATTR:Bm,DOCTYPE_NAME:Jc,ERB_EXPR:Fm,IS_ALLOWED_URI:Zc,IS_SCRIPT_OR_DATA:Um,MUSTACHE_EXPR:Nm,TMPLIT_EXPR:Om});const wn={element:1,text:3,progressingInstruction:7,comment:8,document:9},Km=function(){return typeof window>"u"?null:window},Wm=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let s=null;const i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(s=n.getAttribute(i));const a="dompurify"+(s?"#"+s:"");try{return t.createPolicy(a,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+a+" could not be created."),null}},Vr=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Xc(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Km();const t=z=>Xc(z);if(t.version="3.3.1",t.removed=[],!e||!e.document||e.document.nodeType!==wn.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e;const s=n,i=s.currentScript,{DocumentFragment:a,HTMLTemplateElement:o,Node:r,Element:c,NodeFilter:u,NamedNodeMap:p=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:g,DOMParser:d,trustedTypes:h}=e,f=c.prototype,m=$n(f,"cloneNode"),w=$n(f,"remove"),S=$n(f,"nextSibling"),A=$n(f,"childNodes"),k=$n(f,"parentNode");if(typeof o=="function"){const z=n.createElement("template");z.content&&z.content.ownerDocument&&(n=z.content.ownerDocument)}let C,_="";const{implementation:T,createNodeIterator:M,createDocumentFragment:Y,getElementsByTagName:X}=n,{importNode:te}=s;let P=Vr();t.isSupported=typeof Yc=="function"&&typeof k=="function"&&T&&T.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:W,ERB_EXPR:ne,TMPLIT_EXPR:re,DATA_ATTR:E,ARIA_ATTR:H,IS_SCRIPT_OR_DATA:G,ATTR_WHITESPACE:le,CUSTOM_ELEMENT:fe}=Wr;let{IS_ALLOWED_URI:I}=Wr,D=null;const N=K({},[...Ur,...Di,...Ni,...Fi,...Hr]);let j=null;const de=K({},[...jr,...Oi,...Kr,...ps]);let Z=Object.seal(sa(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),se=null,V=null;const U=Object.seal(sa(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let ie=!0,ce=!0,he=!1,Ee=!0,Ge=!1,ct=!0,ve=!1,Ue=!1,Qe=!1,Ye=!1,Ze=!1,dt=!1,ut=!0,At=!1;const li="user-content-";let Jt=!0,gt=!1,He={},Ce=null;const fn=K({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let Xt=null;const pt=K({},["audio","video","img","source","image","track"]);let ci=null;const wo=K({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),es="http://www.w3.org/1998/Math/MathML",ts="http://www.w3.org/2000/svg",Je="http://www.w3.org/1999/xhtml";let en=Je,di=!1,ui=null;const Ad=K({},[es,ts,Je],Ri);let ns=K({},["mi","mo","mn","ms","mtext"]),ss=K({},["annotation-xml"]);const Cd=K({},["title","style","font","a","script"]);let hn=null;const Td=["application/xhtml+xml","text/html"],_d="text/html";let ge=null,tn=null;const Ed=n.createElement("form"),ko=function($){return $ instanceof RegExp||$ instanceof Function},gi=function(){let $=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(tn&&tn===$)){if((!$||typeof $!="object")&&($={}),$=We($),hn=Td.indexOf($.PARSER_MEDIA_TYPE)===-1?_d:$.PARSER_MEDIA_TYPE,ge=hn==="application/xhtml+xml"?Ri:ks,D=Fe($,"ALLOWED_TAGS")?K({},$.ALLOWED_TAGS,ge):N,j=Fe($,"ALLOWED_ATTR")?K({},$.ALLOWED_ATTR,ge):de,ui=Fe($,"ALLOWED_NAMESPACES")?K({},$.ALLOWED_NAMESPACES,Ri):Ad,ci=Fe($,"ADD_URI_SAFE_ATTR")?K(We(wo),$.ADD_URI_SAFE_ATTR,ge):wo,Xt=Fe($,"ADD_DATA_URI_TAGS")?K(We(pt),$.ADD_DATA_URI_TAGS,ge):pt,Ce=Fe($,"FORBID_CONTENTS")?K({},$.FORBID_CONTENTS,ge):fn,se=Fe($,"FORBID_TAGS")?K({},$.FORBID_TAGS,ge):We({}),V=Fe($,"FORBID_ATTR")?K({},$.FORBID_ATTR,ge):We({}),He=Fe($,"USE_PROFILES")?$.USE_PROFILES:!1,ie=$.ALLOW_ARIA_ATTR!==!1,ce=$.ALLOW_DATA_ATTR!==!1,he=$.ALLOW_UNKNOWN_PROTOCOLS||!1,Ee=$.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Ge=$.SAFE_FOR_TEMPLATES||!1,ct=$.SAFE_FOR_XML!==!1,ve=$.WHOLE_DOCUMENT||!1,Ye=$.RETURN_DOM||!1,Ze=$.RETURN_DOM_FRAGMENT||!1,dt=$.RETURN_TRUSTED_TYPE||!1,Qe=$.FORCE_BODY||!1,ut=$.SANITIZE_DOM!==!1,At=$.SANITIZE_NAMED_PROPS||!1,Jt=$.KEEP_CONTENT!==!1,gt=$.IN_PLACE||!1,I=$.ALLOWED_URI_REGEXP||Zc,en=$.NAMESPACE||Je,ns=$.MATHML_TEXT_INTEGRATION_POINTS||ns,ss=$.HTML_INTEGRATION_POINTS||ss,Z=$.CUSTOM_ELEMENT_HANDLING||{},$.CUSTOM_ELEMENT_HANDLING&&ko($.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(Z.tagNameCheck=$.CUSTOM_ELEMENT_HANDLING.tagNameCheck),$.CUSTOM_ELEMENT_HANDLING&&ko($.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(Z.attributeNameCheck=$.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),$.CUSTOM_ELEMENT_HANDLING&&typeof $.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(Z.allowCustomizedBuiltInElements=$.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Ge&&(ce=!1),Ze&&(Ye=!0),He&&(D=K({},Hr),j=[],He.html===!0&&(K(D,Ur),K(j,jr)),He.svg===!0&&(K(D,Di),K(j,Oi),K(j,ps)),He.svgFilters===!0&&(K(D,Ni),K(j,Oi),K(j,ps)),He.mathMl===!0&&(K(D,Fi),K(j,Kr),K(j,ps))),$.ADD_TAGS&&(typeof $.ADD_TAGS=="function"?U.tagCheck=$.ADD_TAGS:(D===N&&(D=We(D)),K(D,$.ADD_TAGS,ge))),$.ADD_ATTR&&(typeof $.ADD_ATTR=="function"?U.attributeCheck=$.ADD_ATTR:(j===de&&(j=We(j)),K(j,$.ADD_ATTR,ge))),$.ADD_URI_SAFE_ATTR&&K(ci,$.ADD_URI_SAFE_ATTR,ge),$.FORBID_CONTENTS&&(Ce===fn&&(Ce=We(Ce)),K(Ce,$.FORBID_CONTENTS,ge)),$.ADD_FORBID_CONTENTS&&(Ce===fn&&(Ce=We(Ce)),K(Ce,$.ADD_FORBID_CONTENTS,ge)),Jt&&(D["#text"]=!0),ve&&K(D,["html","head","body"]),D.table&&(K(D,["tbody"]),delete se.tbody),$.TRUSTED_TYPES_POLICY){if(typeof $.TRUSTED_TYPES_POLICY.createHTML!="function")throw xn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof $.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw xn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');C=$.TRUSTED_TYPES_POLICY,_=C.createHTML("")}else C===void 0&&(C=Wm(h,i)),C!==null&&typeof _=="string"&&(_=C.createHTML(""));Se&&Se($),tn=$}},So=K({},[...Di,...Ni,...Pm]),Ao=K({},[...Fi,...Dm]),Md=function($){let L=k($);(!L||!L.tagName)&&(L={namespaceURI:en,tagName:"template"});const O=ks($.tagName),ae=ks(L.tagName);return ui[$.namespaceURI]?$.namespaceURI===ts?L.namespaceURI===Je?O==="svg":L.namespaceURI===es?O==="svg"&&(ae==="annotation-xml"||ns[ae]):!!So[O]:$.namespaceURI===es?L.namespaceURI===Je?O==="math":L.namespaceURI===ts?O==="math"&&ss[ae]:!!Ao[O]:$.namespaceURI===Je?L.namespaceURI===ts&&!ss[ae]||L.namespaceURI===es&&!ns[ae]?!1:!Ao[O]&&(Cd[O]||!So[O]):!!(hn==="application/xhtml+xml"&&ui[$.namespaceURI]):!1},je=function($){bn(t.removed,{element:$});try{k($).removeChild($)}catch{w($)}},Ct=function($,L){try{bn(t.removed,{attribute:L.getAttributeNode($),from:L})}catch{bn(t.removed,{attribute:null,from:L})}if(L.removeAttribute($),$==="is")if(Ye||Ze)try{je(L)}catch{}else try{L.setAttribute($,"")}catch{}},Co=function($){let L=null,O=null;if(Qe)$="<remove></remove>"+$;else{const ue=Pi($,/^[\r\n\t ]+/);O=ue&&ue[0]}hn==="application/xhtml+xml"&&en===Je&&($='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+$+"</body></html>");const ae=C?C.createHTML($):$;if(en===Je)try{L=new d().parseFromString(ae,hn)}catch{}if(!L||!L.documentElement){L=T.createDocument(en,"template",null);try{L.documentElement.innerHTML=di?_:ae}catch{}}const be=L.body||L.documentElement;return $&&O&&be.insertBefore(n.createTextNode(O),be.childNodes[0]||null),en===Je?X.call(L,ve?"html":"body")[0]:ve?L.documentElement:be},To=function($){return M.call($.ownerDocument||$,$,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT|u.SHOW_PROCESSING_INSTRUCTION|u.SHOW_CDATA_SECTION,null)},pi=function($){return $ instanceof g&&(typeof $.nodeName!="string"||typeof $.textContent!="string"||typeof $.removeChild!="function"||!($.attributes instanceof p)||typeof $.removeAttribute!="function"||typeof $.setAttribute!="function"||typeof $.namespaceURI!="string"||typeof $.insertBefore!="function"||typeof $.hasChildNodes!="function")},_o=function($){return typeof r=="function"&&$ instanceof r};function Xe(z,$,L){gs(z,O=>{O.call(t,$,L,tn)})}const Eo=function($){let L=null;if(Xe(P.beforeSanitizeElements,$,null),pi($))return je($),!0;const O=ge($.nodeName);if(Xe(P.uponSanitizeElement,$,{tagName:O,allowedTags:D}),ct&&$.hasChildNodes()&&!_o($.firstElementChild)&&xe(/<[/\w!]/g,$.innerHTML)&&xe(/<[/\w!]/g,$.textContent)||$.nodeType===wn.progressingInstruction||ct&&$.nodeType===wn.comment&&xe(/<[/\w]/g,$.data))return je($),!0;if(!(U.tagCheck instanceof Function&&U.tagCheck(O))&&(!D[O]||se[O])){if(!se[O]&&Lo(O)&&(Z.tagNameCheck instanceof RegExp&&xe(Z.tagNameCheck,O)||Z.tagNameCheck instanceof Function&&Z.tagNameCheck(O)))return!1;if(Jt&&!Ce[O]){const ae=k($)||$.parentNode,be=A($)||$.childNodes;if(be&&ae){const ue=be.length;for(let Te=ue-1;Te>=0;--Te){const et=m(be[Te],!0);et.__removalCount=($.__removalCount||0)+1,ae.insertBefore(et,S($))}}}return je($),!0}return $ instanceof c&&!Md($)||(O==="noscript"||O==="noembed"||O==="noframes")&&xe(/<\/no(script|embed|frames)/i,$.innerHTML)?(je($),!0):(Ge&&$.nodeType===wn.text&&(L=$.textContent,gs([W,ne,re],ae=>{L=yn(L,ae," ")}),$.textContent!==L&&(bn(t.removed,{element:$.cloneNode()}),$.textContent=L)),Xe(P.afterSanitizeElements,$,null),!1)},Mo=function($,L,O){if(ut&&(L==="id"||L==="name")&&(O in n||O in Ed))return!1;if(!(ce&&!V[L]&&xe(E,L))){if(!(ie&&xe(H,L))){if(!(U.attributeCheck instanceof Function&&U.attributeCheck(L,$))){if(!j[L]||V[L]){if(!(Lo($)&&(Z.tagNameCheck instanceof RegExp&&xe(Z.tagNameCheck,$)||Z.tagNameCheck instanceof Function&&Z.tagNameCheck($))&&(Z.attributeNameCheck instanceof RegExp&&xe(Z.attributeNameCheck,L)||Z.attributeNameCheck instanceof Function&&Z.attributeNameCheck(L,$))||L==="is"&&Z.allowCustomizedBuiltInElements&&(Z.tagNameCheck instanceof RegExp&&xe(Z.tagNameCheck,O)||Z.tagNameCheck instanceof Function&&Z.tagNameCheck(O))))return!1}else if(!ci[L]){if(!xe(I,yn(O,le,""))){if(!((L==="src"||L==="xlink:href"||L==="href")&&$!=="script"&&Mm(O,"data:")===0&&Xt[$])){if(!(he&&!xe(G,yn(O,le,"")))){if(O)return!1}}}}}}}return!0},Lo=function($){return $!=="annotation-xml"&&Pi($,fe)},Io=function($){Xe(P.beforeSanitizeAttributes,$,null);const{attributes:L}=$;if(!L||pi($))return;const O={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:j,forceKeepAttr:void 0};let ae=L.length;for(;ae--;){const be=L[ae],{name:ue,namespaceURI:Te,value:et}=be,nn=ge(ue),fi=et;let me=ue==="value"?fi:Lm(fi);if(O.attrName=nn,O.attrValue=me,O.keepAttr=!0,O.forceKeepAttr=void 0,Xe(P.uponSanitizeAttribute,$,O),me=O.attrValue,At&&(nn==="id"||nn==="name")&&(Ct(ue,$),me=li+me),ct&&xe(/((--!?|])>)|<\/(style|title|textarea)/i,me)){Ct(ue,$);continue}if(nn==="attributename"&&Pi(me,"href")){Ct(ue,$);continue}if(O.forceKeepAttr)continue;if(!O.keepAttr){Ct(ue,$);continue}if(!Ee&&xe(/\/>/i,me)){Ct(ue,$);continue}Ge&&gs([W,ne,re],Po=>{me=yn(me,Po," ")});const Ro=ge($.nodeName);if(!Mo(Ro,nn,me)){Ct(ue,$);continue}if(C&&typeof h=="object"&&typeof h.getAttributeType=="function"&&!Te)switch(h.getAttributeType(Ro,nn)){case"TrustedHTML":{me=C.createHTML(me);break}case"TrustedScriptURL":{me=C.createScriptURL(me);break}}if(me!==fi)try{Te?$.setAttributeNS(Te,ue,me):$.setAttribute(ue,me),pi($)?je($):zr(t.removed)}catch{Ct(ue,$)}}Xe(P.afterSanitizeAttributes,$,null)},Ld=function z($){let L=null;const O=To($);for(Xe(P.beforeSanitizeShadowDOM,$,null);L=O.nextNode();)Xe(P.uponSanitizeShadowNode,L,null),Eo(L),Io(L),L.content instanceof a&&z(L.content);Xe(P.afterSanitizeShadowDOM,$,null)};return t.sanitize=function(z){let $=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},L=null,O=null,ae=null,be=null;if(di=!z,di&&(z="<!-->"),typeof z!="string"&&!_o(z))if(typeof z.toString=="function"){if(z=z.toString(),typeof z!="string")throw xn("dirty is not a string, aborting")}else throw xn("toString is not a function");if(!t.isSupported)return z;if(Ue||gi($),t.removed=[],typeof z=="string"&&(gt=!1),gt){if(z.nodeName){const et=ge(z.nodeName);if(!D[et]||se[et])throw xn("root node is forbidden and cannot be sanitized in-place")}}else if(z instanceof r)L=Co("<!---->"),O=L.ownerDocument.importNode(z,!0),O.nodeType===wn.element&&O.nodeName==="BODY"||O.nodeName==="HTML"?L=O:L.appendChild(O);else{if(!Ye&&!Ge&&!ve&&z.indexOf("<")===-1)return C&&dt?C.createHTML(z):z;if(L=Co(z),!L)return Ye?null:dt?_:""}L&&Qe&&je(L.firstChild);const ue=To(gt?z:L);for(;ae=ue.nextNode();)Eo(ae),Io(ae),ae.content instanceof a&&Ld(ae.content);if(gt)return z;if(Ye){if(Ze)for(be=Y.call(L.ownerDocument);L.firstChild;)be.appendChild(L.firstChild);else be=L;return(j.shadowroot||j.shadowrootmode)&&(be=te.call(s,be,!0)),be}let Te=ve?L.outerHTML:L.innerHTML;return ve&&D["!doctype"]&&L.ownerDocument&&L.ownerDocument.doctype&&L.ownerDocument.doctype.name&&xe(Jc,L.ownerDocument.doctype.name)&&(Te="<!DOCTYPE "+L.ownerDocument.doctype.name+`>
`+Te),Ge&&gs([W,ne,re],et=>{Te=yn(Te,et," ")}),C&&dt?C.createHTML(Te):Te},t.setConfig=function(){let z=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};gi(z),Ue=!0},t.clearConfig=function(){tn=null,Ue=!1},t.isValidAttribute=function(z,$,L){tn||gi({});const O=ge(z),ae=ge($);return Mo(O,ae,L)},t.addHook=function(z,$){typeof $=="function"&&bn(P[z],$)},t.removeHook=function(z,$){if($!==void 0){const L=_m(P[z],$);return L===-1?void 0:Em(P[z],L,1)[0]}return zr(P[z])},t.removeHooks=function(z){P[z]=[]},t.removeAllHooks=function(){P=Vr()},t}var oa=Xc();function to(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Zt=to();function ed(e){Zt=e}var zt={exec:()=>null};function q(e,t=""){let n=typeof e=="string"?e:e.source,s={replace:(i,a)=>{let o=typeof a=="string"?a:a.source;return o=o.replace(ke.caret,"$1"),n=n.replace(i,o),s},getRegex:()=>new RegExp(n,t)};return s}var Vm=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),ke={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},qm=/^(?:[ \t]*(?:\n|$))+/,Gm=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Qm=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Xn=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Ym=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,no=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,td=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,nd=q(td).replace(/bull/g,no).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Zm=q(td).replace(/bull/g,no).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),so=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Jm=/^[^\n]+/,io=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Xm=q(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",io).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),eb=q(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,no).getRegex(),ai="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",ao=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,tb=q("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",ao).replace("tag",ai).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),sd=q(so).replace("hr",Xn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ai).getRegex(),nb=q(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",sd).getRegex(),oo={blockquote:nb,code:Gm,def:Xm,fences:Qm,heading:Ym,hr:Xn,html:tb,lheading:nd,list:eb,newline:qm,paragraph:sd,table:zt,text:Jm},qr=q("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Xn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ai).getRegex(),sb={...oo,lheading:Zm,table:qr,paragraph:q(so).replace("hr",Xn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",qr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ai).getRegex()},ib={...oo,html:q(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",ao).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:zt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:q(so).replace("hr",Xn).replace("heading",` *#{1,6} *[^
]`).replace("lheading",nd).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ab=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,ob=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,id=/^( {2,}|\\)\n(?!\s*$)/,rb=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,oi=/[\p{P}\p{S}]/u,ro=/[\s\p{P}\p{S}]/u,ad=/[^\s\p{P}\p{S}]/u,lb=q(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,ro).getRegex(),od=/(?!~)[\p{P}\p{S}]/u,cb=/(?!~)[\s\p{P}\p{S}]/u,db=/(?:[^\s\p{P}\p{S}]|~)/u,rd=/(?![*_])[\p{P}\p{S}]/u,ub=/(?![*_])[\s\p{P}\p{S}]/u,gb=/(?:[^\s\p{P}\p{S}]|[*_])/u,pb=q(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Vm?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),ld=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,fb=q(ld,"u").replace(/punct/g,oi).getRegex(),hb=q(ld,"u").replace(/punct/g,od).getRegex(),cd="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",vb=q(cd,"gu").replace(/notPunctSpace/g,ad).replace(/punctSpace/g,ro).replace(/punct/g,oi).getRegex(),mb=q(cd,"gu").replace(/notPunctSpace/g,db).replace(/punctSpace/g,cb).replace(/punct/g,od).getRegex(),bb=q("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,ad).replace(/punctSpace/g,ro).replace(/punct/g,oi).getRegex(),yb=q(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,rd).getRegex(),xb="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",$b=q(xb,"gu").replace(/notPunctSpace/g,gb).replace(/punctSpace/g,ub).replace(/punct/g,rd).getRegex(),wb=q(/\\(punct)/,"gu").replace(/punct/g,oi).getRegex(),kb=q(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Sb=q(ao).replace("(?:-->|$)","-->").getRegex(),Ab=q("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Sb).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Fs=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Cb=q(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Fs).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),dd=q(/^!?\[(label)\]\[(ref)\]/).replace("label",Fs).replace("ref",io).getRegex(),ud=q(/^!?\[(ref)\](?:\[\])?/).replace("ref",io).getRegex(),Tb=q("reflink|nolink(?!\\()","g").replace("reflink",dd).replace("nolink",ud).getRegex(),Gr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,lo={_backpedal:zt,anyPunctuation:wb,autolink:kb,blockSkip:pb,br:id,code:ob,del:zt,delLDelim:zt,delRDelim:zt,emStrongLDelim:fb,emStrongRDelimAst:vb,emStrongRDelimUnd:bb,escape:ab,link:Cb,nolink:ud,punctuation:lb,reflink:dd,reflinkSearch:Tb,tag:Ab,text:rb,url:zt},_b={...lo,link:q(/^!?\[(label)\]\((.*?)\)/).replace("label",Fs).getRegex(),reflink:q(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Fs).getRegex()},ra={...lo,emStrongRDelimAst:mb,emStrongLDelim:hb,delLDelim:yb,delRDelim:$b,url:q(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Gr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:q(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Gr).getRegex()},Eb={...ra,br:q(id).replace("{2,}","*").getRegex(),text:q(ra.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},fs={normal:oo,gfm:sb,pedantic:ib},kn={normal:lo,gfm:ra,breaks:Eb,pedantic:_b},Mb={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Qr=e=>Mb[e];function Ve(e,t){if(t){if(ke.escapeTest.test(e))return e.replace(ke.escapeReplace,Qr)}else if(ke.escapeTestNoEncode.test(e))return e.replace(ke.escapeReplaceNoEncode,Qr);return e}function Yr(e){try{e=encodeURI(e).replace(ke.percentDecode,"%")}catch{return null}return e}function Zr(e,t){let n=e.replace(ke.findPipe,(a,o,r)=>{let c=!1,u=o;for(;--u>=0&&r[u]==="\\";)c=!c;return c?"|":" |"}),s=n.split(ke.splitPipe),i=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;i<s.length;i++)s[i]=s[i].trim().replace(ke.slashPipe,"|");return s}function Sn(e,t,n){let s=e.length;if(s===0)return"";let i=0;for(;i<s&&e.charAt(s-i-1)===t;)i++;return e.slice(0,s-i)}function Lb(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function Ib(e,t=0){let n=t,s="";for(let i of e)if(i==="	"){let a=4-n%4;s+=" ".repeat(a),n+=a}else s+=i,n++;return s}function Jr(e,t,n,s,i){let a=t.href,o=t.title||null,r=e[1].replace(i.other.outputLinkReplace,"$1");s.state.inLink=!0;let c={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:a,title:o,text:r,tokens:s.inlineTokens(r)};return s.state.inLink=!1,c}function Rb(e,t,n){let s=e.match(n.other.indentCodeCompensation);if(s===null)return t;let i=s[1];return t.split(`
`).map(a=>{let o=a.match(n.other.beginningSpace);if(o===null)return a;let[r]=o;return r.length>=i.length?a.slice(i.length):a}).join(`
`)}var Os=class{options;rules;lexer;constructor(e){this.options=e||Zt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Sn(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=Rb(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=Sn(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:Sn(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=Sn(t[0],`
`).split(`
`),s="",i="",a=[];for(;n.length>0;){let o=!1,r=[],c;for(c=0;c<n.length;c++)if(this.rules.other.blockquoteStart.test(n[c]))r.push(n[c]),o=!0;else if(!o)r.push(n[c]);else break;n=n.slice(c);let u=r.join(`
`),p=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${u}`:u,i=i?`${i}
${p}`:p;let g=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(p,a,!0),this.lexer.state.top=g,n.length===0)break;let d=a.at(-1);if(d?.type==="code")break;if(d?.type==="blockquote"){let h=d,f=h.raw+`
`+n.join(`
`),m=this.blockquote(f);a[a.length-1]=m,s=s.substring(0,s.length-h.raw.length)+m.raw,i=i.substring(0,i.length-h.text.length)+m.text;break}else if(d?.type==="list"){let h=d,f=h.raw+`
`+n.join(`
`),m=this.list(f);a[a.length-1]=m,s=s.substring(0,s.length-d.raw.length)+m.raw,i=i.substring(0,i.length-h.raw.length)+m.raw,n=f.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:a,text:i}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,i={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let a=this.rules.other.listItemRegex(n),o=!1;for(;e;){let c=!1,u="",p="";if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;u=t[0],e=e.substring(u.length);let g=Ib(t[2].split(`
`,1)[0],t[1].length),d=e.split(`
`,1)[0],h=!g.trim(),f=0;if(this.options.pedantic?(f=2,p=g.trimStart()):h?f=t[1].length+1:(f=g.search(this.rules.other.nonSpaceChar),f=f>4?1:f,p=g.slice(f),f+=t[1].length),h&&this.rules.other.blankLine.test(d)&&(u+=d+`
`,e=e.substring(d.length+1),c=!0),!c){let m=this.rules.other.nextBulletRegex(f),w=this.rules.other.hrRegex(f),S=this.rules.other.fencesBeginRegex(f),A=this.rules.other.headingBeginRegex(f),k=this.rules.other.htmlBeginRegex(f),C=this.rules.other.blockquoteBeginRegex(f);for(;e;){let _=e.split(`
`,1)[0],T;if(d=_,this.options.pedantic?(d=d.replace(this.rules.other.listReplaceNesting,"  "),T=d):T=d.replace(this.rules.other.tabCharGlobal,"    "),S.test(d)||A.test(d)||k.test(d)||C.test(d)||m.test(d)||w.test(d))break;if(T.search(this.rules.other.nonSpaceChar)>=f||!d.trim())p+=`
`+T.slice(f);else{if(h||g.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||S.test(g)||A.test(g)||w.test(g))break;p+=`
`+d}h=!d.trim(),u+=_+`
`,e=e.substring(_.length+1),g=T.slice(f)}}i.loose||(o?i.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(o=!0)),i.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(p),loose:!1,text:p,tokens:[]}),i.raw+=u}let r=i.items.at(-1);if(r)r.raw=r.raw.trimEnd(),r.text=r.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let c of i.items){if(this.lexer.state.top=!1,c.tokens=this.lexer.blockTokens(c.text,[]),c.task){if(c.text=c.text.replace(this.rules.other.listReplaceTask,""),c.tokens[0]?.type==="text"||c.tokens[0]?.type==="paragraph"){c.tokens[0].raw=c.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),c.tokens[0].text=c.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let p=this.lexer.inlineQueue.length-1;p>=0;p--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[p].src)){this.lexer.inlineQueue[p].src=this.lexer.inlineQueue[p].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(c.raw);if(u){let p={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};c.checked=p.checked,i.loose?c.tokens[0]&&["paragraph","text"].includes(c.tokens[0].type)&&"tokens"in c.tokens[0]&&c.tokens[0].tokens?(c.tokens[0].raw=p.raw+c.tokens[0].raw,c.tokens[0].text=p.raw+c.tokens[0].text,c.tokens[0].tokens.unshift(p)):c.tokens.unshift({type:"paragraph",raw:p.raw,text:p.raw,tokens:[p]}):c.tokens.unshift(p)}}if(!i.loose){let u=c.tokens.filter(g=>g.type==="space"),p=u.length>0&&u.some(g=>this.rules.other.anyLine.test(g.raw));i.loose=p}}if(i.loose)for(let c of i.items){c.loose=!0;for(let u of c.tokens)u.type==="text"&&(u.type="paragraph")}return i}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:i}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Zr(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let o of s)this.rules.other.tableAlignRight.test(o)?a.align.push("right"):this.rules.other.tableAlignCenter.test(o)?a.align.push("center"):this.rules.other.tableAlignLeft.test(o)?a.align.push("left"):a.align.push(null);for(let o=0;o<n.length;o++)a.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:a.align[o]});for(let o of i)a.rows.push(Zr(o,a.header.length).map((r,c)=>({text:r,tokens:this.lexer.inline(r),header:!1,align:a.align[c]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let a=Sn(n.slice(0,-1),"\\");if((n.length-a.length)%2===0)return}else{let a=Lb(t[2],"()");if(a===-2)return;if(a>-1){let o=(t[0].indexOf("!")===0?5:4)+t[1].length+a;t[2]=t[2].substring(0,a),t[0]=t[0].substring(0,o).trim(),t[3]=""}}let s=t[2],i="";if(this.options.pedantic){let a=this.rules.other.pedanticHrefTitle.exec(s);a&&(s=a[1],i=a[3])}else i=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),Jr(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=t[s.toLowerCase()];if(!i){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return Jr(n,i,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let i=[...s[0]].length-1,a,o,r=i,c=0,u=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,t=t.slice(-1*e.length+i);(s=u.exec(t))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a)continue;if(o=[...a].length,s[3]||s[4]){r+=o;continue}else if((s[5]||s[6])&&i%3&&!((i+o)%3)){c+=o;continue}if(r-=o,r>0)continue;o=Math.min(o,o+r+c);let p=[...s[0]][0].length,g=e.slice(0,i+s.index+p+o);if(Math.min(i,o)%2){let h=g.slice(1,-1);return{type:"em",raw:g,text:h,tokens:this.lexer.inlineTokens(h)}}let d=g.slice(2,-2);return{type:"strong",raw:g,text:d,tokens:this.lexer.inlineTokens(d)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let i=[...s[0]].length-1,a,o,r=i,c=this.rules.inline.delRDelim;for(c.lastIndex=0,t=t.slice(-1*e.length+i);(s=c.exec(t))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a||(o=[...a].length,o!==i))continue;if(s[3]||s[4]){r+=o;continue}if(r-=o,r>0)continue;o=Math.min(o,o+r);let u=[...s[0]][0].length,p=e.slice(0,i+s.index+u+o),g=p.slice(i,-i);return{type:"del",raw:p,text:g,tokens:this.lexer.inlineTokens(g)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let i;do i=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(i!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},Oe=class la{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Zt,this.options.tokenizer=this.options.tokenizer||new Os,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:ke,block:fs.normal,inline:kn.normal};this.options.pedantic?(n.block=fs.pedantic,n.inline=kn.pedantic):this.options.gfm&&(n.block=fs.gfm,this.options.breaks?n.inline=kn.breaks:n.inline=kn.gfm),this.tokenizer.rules=n}static get rules(){return{block:fs,inline:kn}}static lex(t,n){return new la(n).lex(t)}static lexInline(t,n){return new la(n).inlineTokens(t)}lex(t){t=t.replace(ke.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){for(this.options.pedantic&&(t=t.replace(ke.tabCharGlobal,"    ").replace(ke.spaceLine,""));t;){let i;if(this.options.extensions?.block?.some(o=>(i=o.call({lexer:this},t,n))?(t=t.substring(i.raw.length),n.push(i),!0):!1))continue;if(i=this.tokenizer.space(t)){t=t.substring(i.raw.length);let o=n.at(-1);i.raw.length===1&&o!==void 0?o.raw+=`
`:n.push(i);continue}if(i=this.tokenizer.code(t)){t=t.substring(i.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.at(-1).src=o.text):n.push(i);continue}if(i=this.tokenizer.fences(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.heading(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.hr(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.blockquote(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.list(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.html(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.def(t)){t=t.substring(i.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title},n.push(i));continue}if(i=this.tokenizer.table(t)){t=t.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.lheading(t)){t=t.substring(i.raw.length),n.push(i);continue}let a=t;if(this.options.extensions?.startBlock){let o=1/0,r=t.slice(1),c;this.options.extensions.startBlock.forEach(u=>{c=u.call({lexer:this},r),typeof c=="number"&&c>=0&&(o=Math.min(o,c))}),o<1/0&&o>=0&&(a=t.substring(0,o+1))}if(this.state.top&&(i=this.tokenizer.paragraph(a))){let o=n.at(-1);s&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(i),s=a.length!==t.length,t=t.substring(i.raw.length);continue}if(i=this.tokenizer.text(t)){t=t.substring(i.raw.length);let o=n.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(i);continue}if(t){let o="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let s=t,i=null;if(this.tokens.links){let c=Object.keys(this.tokens.links);if(c.length>0)for(;(i=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)c.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(i=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,i.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let a;for(;(i=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)a=i[2]?i[2].length:0,s=s.slice(0,i.index+a)+"["+"a".repeat(i[0].length-a-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let o=!1,r="";for(;t;){o||(r=""),o=!1;let c;if(this.options.extensions?.inline?.some(p=>(c=p.call({lexer:this},t,n))?(t=t.substring(c.raw.length),n.push(c),!0):!1))continue;if(c=this.tokenizer.escape(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.tag(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.link(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(c.raw.length);let p=n.at(-1);c.type==="text"&&p?.type==="text"?(p.raw+=c.raw,p.text+=c.text):n.push(c);continue}if(c=this.tokenizer.emStrong(t,s,r)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.codespan(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.br(t)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.del(t,s,r)){t=t.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.autolink(t)){t=t.substring(c.raw.length),n.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(t))){t=t.substring(c.raw.length),n.push(c);continue}let u=t;if(this.options.extensions?.startInline){let p=1/0,g=t.slice(1),d;this.options.extensions.startInline.forEach(h=>{d=h.call({lexer:this},g),typeof d=="number"&&d>=0&&(p=Math.min(p,d))}),p<1/0&&p>=0&&(u=t.substring(0,p+1))}if(c=this.tokenizer.inlineText(u)){t=t.substring(c.raw.length),c.raw.slice(-1)!=="_"&&(r=c.raw.slice(-1)),o=!0;let p=n.at(-1);p?.type==="text"?(p.raw+=c.raw,p.text+=c.text):n.push(c);continue}if(t){let p="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(p);break}else throw new Error(p)}}return n}},Bs=class{options;parser;constructor(e){this.options=e||Zt}space(e){return""}code({text:e,lang:t,escaped:n}){let s=(t||"").match(ke.notSpaceStart)?.[0],i=e.replace(ke.endingNewline,"")+`
`;return s?'<pre><code class="language-'+Ve(s)+'">'+(n?i:Ve(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:Ve(i,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,s="";for(let o=0;o<e.items.length;o++){let r=e.items[o];s+=this.listitem(r)}let i=t?"ol":"ul",a=t&&n!==1?' start="'+n+'"':"";return"<"+i+a+`>
`+s+"</"+i+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let i=0;i<e.header.length;i++)n+=this.tablecell(e.header[i]);t+=this.tablerow({text:n});let s="";for(let i=0;i<e.rows.length;i++){let a=e.rows[i];n="";for(let o=0;o<a.length;o++)n+=this.tablecell(a[o]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+s+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Ve(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let s=this.parser.parseInline(n),i=Yr(e);if(i===null)return s;e=i;let a='<a href="'+e+'"';return t&&(a+=' title="'+Ve(t)+'"'),a+=">"+s+"</a>",a}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let i=Yr(e);if(i===null)return Ve(n);e=i;let a=`<img src="${e}" alt="${Ve(n)}"`;return t&&(a+=` title="${Ve(t)}"`),a+=">",a}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Ve(e.text)}},co=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},Be=class ca{options;renderer;textRenderer;constructor(t){this.options=t||Zt,this.options.renderer=this.options.renderer||new Bs,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new co}static parse(t,n){return new ca(n).parse(t)}static parseInline(t,n){return new ca(n).parseInline(t)}parse(t){let n="";for(let s=0;s<t.length;s++){let i=t[s];if(this.options.extensions?.renderers?.[i.type]){let o=i,r=this.options.extensions.renderers[o.type].call({parser:this},o);if(r!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(o.type)){n+=r||"";continue}}let a=i;switch(a.type){case"space":{n+=this.renderer.space(a);break}case"hr":{n+=this.renderer.hr(a);break}case"heading":{n+=this.renderer.heading(a);break}case"code":{n+=this.renderer.code(a);break}case"table":{n+=this.renderer.table(a);break}case"blockquote":{n+=this.renderer.blockquote(a);break}case"list":{n+=this.renderer.list(a);break}case"checkbox":{n+=this.renderer.checkbox(a);break}case"html":{n+=this.renderer.html(a);break}case"def":{n+=this.renderer.def(a);break}case"paragraph":{n+=this.renderer.paragraph(a);break}case"text":{n+=this.renderer.text(a);break}default:{let o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}parseInline(t,n=this.renderer){let s="";for(let i=0;i<t.length;i++){let a=t[i];if(this.options.extensions?.renderers?.[a.type]){let r=this.options.extensions.renderers[a.type].call({parser:this},a);if(r!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){s+=r||"";continue}}let o=a;switch(o.type){case"escape":{s+=n.text(o);break}case"html":{s+=n.html(o);break}case"link":{s+=n.link(o);break}case"image":{s+=n.image(o);break}case"checkbox":{s+=n.checkbox(o);break}case"strong":{s+=n.strong(o);break}case"em":{s+=n.em(o);break}case"codespan":{s+=n.codespan(o);break}case"br":{s+=n.br(o);break}case"del":{s+=n.del(o);break}case"text":{s+=n.text(o);break}default:{let r='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(r),"";throw new Error(r)}}}return s}},Cn=class{options;block;constructor(e){this.options=e||Zt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?Oe.lex:Oe.lexInline}provideParser(){return this.block?Be.parse:Be.parseInline}},Pb=class{defaults=to();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Be;Renderer=Bs;TextRenderer=co;Lexer=Oe;Tokenizer=Os;Hooks=Cn;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let s of e)switch(n=n.concat(t.call(this,s)),s.type){case"table":{let i=s;for(let a of i.header)n=n.concat(this.walkTokens(a.tokens,t));for(let a of i.rows)for(let o of a)n=n.concat(this.walkTokens(o.tokens,t));break}case"list":{let i=s;n=n.concat(this.walkTokens(i.items,t));break}default:{let i=s;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(a=>{let o=i[a].flat(1/0);n=n.concat(this.walkTokens(o,t))}):i.tokens&&(n=n.concat(this.walkTokens(i.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let a=t.renderers[i.name];a?t.renderers[i.name]=function(...o){let r=i.renderer.apply(this,o);return r===!1&&(r=a.apply(this,o)),r}:t.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=t[i.level];a?a.unshift(i.tokenizer):t[i.level]=[i.tokenizer],i.start&&(i.level==="block"?t.startBlock?t.startBlock.push(i.start):t.startBlock=[i.start]:i.level==="inline"&&(t.startInline?t.startInline.push(i.start):t.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(t.childTokens[i.name]=i.childTokens)}),s.extensions=t),n.renderer){let i=this.defaults.renderer||new Bs(this.defaults);for(let a in n.renderer){if(!(a in i))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let o=a,r=n.renderer[o],c=i[o];i[o]=(...u)=>{let p=r.apply(i,u);return p===!1&&(p=c.apply(i,u)),p||""}}s.renderer=i}if(n.tokenizer){let i=this.defaults.tokenizer||new Os(this.defaults);for(let a in n.tokenizer){if(!(a in i))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let o=a,r=n.tokenizer[o],c=i[o];i[o]=(...u)=>{let p=r.apply(i,u);return p===!1&&(p=c.apply(i,u)),p}}s.tokenizer=i}if(n.hooks){let i=this.defaults.hooks||new Cn;for(let a in n.hooks){if(!(a in i))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let o=a,r=n.hooks[o],c=i[o];Cn.passThroughHooks.has(a)?i[o]=u=>{if(this.defaults.async&&Cn.passThroughHooksRespectAsync.has(a))return(async()=>{let g=await r.call(i,u);return c.call(i,g)})();let p=r.call(i,u);return c.call(i,p)}:i[o]=(...u)=>{if(this.defaults.async)return(async()=>{let g=await r.apply(i,u);return g===!1&&(g=await c.apply(i,u)),g})();let p=r.apply(i,u);return p===!1&&(p=c.apply(i,u)),p}}s.hooks=i}if(n.walkTokens){let i=this.defaults.walkTokens,a=n.walkTokens;s.walkTokens=function(o){let r=[];return r.push(a.call(this,o)),i&&(r=r.concat(i.call(this,o))),r}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Oe.lex(e,t??this.defaults)}parser(e,t){return Be.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let s={...n},i={...this.defaults,...s},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&s.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let o=i.hooks?await i.hooks.preprocess(t):t,r=await(i.hooks?await i.hooks.provideLexer():e?Oe.lex:Oe.lexInline)(o,i),c=i.hooks?await i.hooks.processAllTokens(r):r;i.walkTokens&&await Promise.all(this.walkTokens(c,i.walkTokens));let u=await(i.hooks?await i.hooks.provideParser():e?Be.parse:Be.parseInline)(c,i);return i.hooks?await i.hooks.postprocess(u):u})().catch(a);try{i.hooks&&(t=i.hooks.preprocess(t));let o=(i.hooks?i.hooks.provideLexer():e?Oe.lex:Oe.lexInline)(t,i);i.hooks&&(o=i.hooks.processAllTokens(o)),i.walkTokens&&this.walkTokens(o,i.walkTokens);let r=(i.hooks?i.hooks.provideParser():e?Be.parse:Be.parseInline)(o,i);return i.hooks&&(r=i.hooks.postprocess(r)),r}catch(o){return a(o)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+Ve(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},Qt=new Pb;function Q(e,t){return Qt.parse(e,t)}Q.options=Q.setOptions=function(e){return Qt.setOptions(e),Q.defaults=Qt.defaults,ed(Q.defaults),Q};Q.getDefaults=to;Q.defaults=Zt;Q.use=function(...e){return Qt.use(...e),Q.defaults=Qt.defaults,ed(Q.defaults),Q};Q.walkTokens=function(e,t){return Qt.walkTokens(e,t)};Q.parseInline=Qt.parseInline;Q.Parser=Be;Q.parser=Be.parse;Q.Renderer=Bs;Q.TextRenderer=co;Q.Lexer=Oe;Q.lexer=Oe.lex;Q.Tokenizer=Os;Q.Hooks=Cn;Q.parse=Q;Q.options;Q.setOptions;Q.use;Q.walkTokens;Q.parseInline;Be.parse;Oe.lex;Q.setOptions({gfm:!0,breaks:!0});const Db=["a","b","blockquote","br","code","del","em","h1","h2","h3","h4","hr","i","li","ol","p","pre","strong","table","tbody","td","th","thead","tr","ul","img"],Nb=["class","href","rel","target","title","start","src","alt"],Xr={ALLOWED_TAGS:Db,ALLOWED_ATTR:Nb,ADD_DATA_URI_TAGS:["img"]};let el=!1;const Fb=14e4,Ob=4e4,Bb=200,Bi=5e4,Ht=new Map;function zb(e){const t=Ht.get(e);return t===void 0?null:(Ht.delete(e),Ht.set(e,t),t)}function tl(e,t){if(Ht.set(e,t),Ht.size<=Bb)return;const n=Ht.keys().next().value;n&&Ht.delete(n)}function Ub(){el||(el=!0,oa.addHook("afterSanitizeAttributes",e=>{!(e instanceof HTMLAnchorElement)||!e.getAttribute("href")||(e.setAttribute("rel","noreferrer noopener"),e.setAttribute("target","_blank"))}))}function da(e){const t=e.trim();if(!t)return"";if(Ub(),t.length<=Bi){const o=zb(t);if(o!==null)return o}const n=Hl(t,Fb),s=n.truncated?`

… truncated (${n.total} chars, showing first ${n.text.length}).`:"";if(n.text.length>Ob){const r=`<pre class="code-block">${pd(`${n.text}${s}`)}</pre>`,c=oa.sanitize(r,Xr);return t.length<=Bi&&tl(t,c),c}const i=Q.parse(`${n.text}${s}`,{renderer:gd}),a=oa.sanitize(i,Xr);return t.length<=Bi&&tl(t,a),a}const gd=new Q.Renderer;gd.html=({text:e})=>pd(e);function pd(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Hb=new RegExp("\\p{Script=Hebrew}|\\p{Script=Arabic}|\\p{Script=Syriac}|\\p{Script=Thaana}|\\p{Script=Nko}|\\p{Script=Samaritan}|\\p{Script=Mandaic}|\\p{Script=Adlam}|\\p{Script=Phoenician}|\\p{Script=Lydian}","u");function fd(e,t=/[\s\p{P}\p{S}]/u){if(!e)return"ltr";for(const n of e)if(!t.test(n))return Hb.test(n)?"rtl":"ltr";return"ltr"}const jb=1500,Kb=2e3,hd="Copy as markdown",Wb="Copied",Vb="Copy failed";async function qb(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function hs(e,t){e.title=t,e.setAttribute("aria-label",t)}function Gb(e){const t=e.label??hd;return l`
    <button
      class="chat-copy-btn"
      type="button"
      title=${t}
      aria-label=${t}
      @click=${async n=>{const s=n.currentTarget;if(!s||s.dataset.copying==="1")return;s.dataset.copying="1",s.setAttribute("aria-busy","true"),s.disabled=!0;const i=await qb(e.text());if(s.isConnected){if(delete s.dataset.copying,s.removeAttribute("aria-busy"),s.disabled=!1,!i){s.dataset.error="1",hs(s,Vb),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.error,hs(s,t))},Kb);return}s.dataset.copied="1",hs(s,Wb),window.setTimeout(()=>{s.isConnected&&(delete s.dataset.copied,hs(s,t))},jb)}}}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${oe.copy}</span>
        <span class="chat-copy-btn__icon-check">${oe.check}</span>
      </span>
    </button>
  `}function Qb(e){return Gb({text:()=>e,label:hd})}function vd(e){const t=e;let n=typeof t.role=="string"?t.role:"unknown";const s=typeof t.toolCallId=="string"||typeof t.tool_call_id=="string",i=t.content,a=Array.isArray(i)?i:null,o=Array.isArray(a)&&a.some(g=>{const d=g,h=(typeof d.type=="string"?d.type:"").toLowerCase();return h==="toolresult"||h==="tool_result"}),r=typeof t.toolName=="string"||typeof t.tool_name=="string";(s||o||r)&&(n="toolResult");let c=[];typeof t.content=="string"?c=[{type:"text",text:t.content}]:Array.isArray(t.content)?c=t.content.map(g=>({type:g.type||"text",text:g.text,name:g.name,args:g.args||g.arguments})):typeof t.text=="string"&&(c=[{type:"text",text:t.text}]);const u=typeof t.timestamp=="number"?t.timestamp:Date.now(),p=typeof t.id=="string"?t.id:void 0;return{role:n,content:c,timestamp:u,id:p}}function uo(e){const t=e.toLowerCase();return e==="user"||e==="User"?e:e==="assistant"?"assistant":e==="system"?"system":t==="toolresult"||t==="tool_result"||t==="tool"||t==="function"?"tool":e}function md(e){const t=e,n=typeof t.role=="string"?t.role.toLowerCase():"";return n==="toolresult"||n==="tool_result"}function pn(e){return e&&typeof e=="object"?e:void 0}function Yb(e){return(e??"tool").trim()}function Zb(e){const t=e.replace(/_/g," ").trim();return t?t.split(/\s+/).map(n=>n.length<=2&&n.toUpperCase()===n?n:`${n.at(0)?.toUpperCase()??""}${n.slice(1)}`).join(" "):"Tool"}function Jb(e){const t=e?.trim();if(t)return t.replace(/_/g," ")}function bd(e,t={}){const n=t.maxStringChars??160,s=t.maxArrayEntries??3;if(e!=null){if(typeof e=="string"){const i=e.trim();if(!i)return;const a=i.split(/\r?\n/)[0]?.trim()??"";return a?a.length>n?`${a.slice(0,Math.max(0,n-3))}…`:a:void 0}if(typeof e=="boolean")return!e&&!t.includeFalse?void 0:e?"true":"false";if(typeof e=="number")return Number.isFinite(e)?e===0&&!t.includeZero?void 0:String(e):t.includeNonFinite?String(e):void 0;if(Array.isArray(e)){const i=e.map(o=>bd(o,t)).filter(o=>!!o);if(i.length===0)return;const a=i.slice(0,s).join(", ");return i.length>s?`${a}…`:a}}}function Xb(e,t){if(!e||typeof e!="object")return;let n=e;for(const s of t.split(".")){if(!s||!n||typeof n!="object")return;n=n[s]}return n}function yd(e){const t=pn(e);if(t)for(const n of[t.path,t.file_path,t.filePath]){if(typeof n!="string")continue;const s=n.trim();if(s)return s}}function ey(e){const t=pn(e);if(!t)return;const n=yd(t);if(!n)return;const s=typeof t.offset=="number"&&Number.isFinite(t.offset)?Math.floor(t.offset):void 0,i=typeof t.limit=="number"&&Number.isFinite(t.limit)?Math.floor(t.limit):void 0,a=s!==void 0?Math.max(1,s):void 0,o=i!==void 0?Math.max(1,i):void 0;return a!==void 0&&o!==void 0?`${o===1?"line":"lines"} ${a}-${a+o-1} from ${n}`:a!==void 0?`from line ${a} in ${n}`:o!==void 0?`first ${o} ${o===1?"line":"lines"} of ${n}`:`from ${n}`}function ty(e,t){const n=pn(t);if(!n)return;const s=yd(n)??(typeof n.url=="string"?n.url.trim():void 0);if(!s)return;if(e==="attach")return`from ${s}`;const i=e==="edit"?"in":"to",a=typeof n.content=="string"?n.content:typeof n.newText=="string"?n.newText:typeof n.new_string=="string"?n.new_string:void 0;return a&&a.length>0?`${i} ${s} (${a.length} chars)`:`${i} ${s}`}function ny(e){const t=pn(e);if(!t)return;const n=typeof t.query=="string"?t.query.trim():void 0,s=typeof t.count=="number"&&Number.isFinite(t.count)&&t.count>0?Math.floor(t.count):void 0;if(n)return s!==void 0?`for "${n}" (top ${s})`:`for "${n}"`}function sy(e){const t=pn(e);if(!t)return;const n=typeof t.url=="string"?t.url.trim():void 0;if(!n)return;const s=typeof t.extractMode=="string"?t.extractMode.trim():void 0,i=typeof t.maxChars=="number"&&Number.isFinite(t.maxChars)&&t.maxChars>0?Math.floor(t.maxChars):void 0,a=[s?`mode ${s}`:void 0,i!==void 0?`max ${i} chars`:void 0].filter(o=>!!o).join(", ");return a?`from ${n} (${a})`:`from ${n}`}function go(e){if(!e)return e;const t=e.trim();return t.length>=2&&(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))?t.slice(1,-1).trim():t}function Tn(e,t=48){if(!e)return[];const n=[];let s="",i,a=!1;for(let o=0;o<e.length;o+=1){const r=e[o];if(a){s+=r,a=!1;continue}if(r==="\\"){a=!0;continue}if(i){r===i?i=void 0:s+=r;continue}if(r==='"'||r==="'"){i=r;continue}if(/\s/.test(r)){if(!s)continue;if(n.push(s),n.length>=t)return n;s="";continue}s+=r}return s&&n.push(s),n}function po(e){if(!e)return;const t=go(e)??e;return(t.split(/[/]/).at(-1)??t).trim().toLowerCase()}function It(e,t){const n=new Set(t);for(let s=0;s<e.length;s+=1){const i=e[s];if(i){if(n.has(i)){const a=e[s+1];if(a&&!a.startsWith("-"))return a;continue}for(const a of t)if(a.startsWith("--")&&i.startsWith(`${a}=`))return i.slice(a.length+1)}}}function on(e,t=1,n=[]){const s=[],i=new Set(n);for(let a=t;a<e.length;a+=1){const o=e[a];if(o){if(o==="--"){for(let r=a+1;r<e.length;r+=1){const c=e[r];c&&s.push(c)}break}if(o.startsWith("--")){if(o.includes("="))continue;i.has(o)&&(a+=1);continue}if(o.startsWith("-")){i.has(o)&&(a+=1);continue}s.push(o)}}return s}function st(e,t=1,n=[]){return on(e,t,n)[0]}function vs(e){if(e.length===0)return e;let t=0;if(po(e[0])==="env"){for(t=1;t<e.length;){const n=e[t];if(!n)break;if(n.startsWith("-")){t+=1;continue}if(/^[A-Za-z_][A-Za-z0-9_]*=/.test(n)){t+=1;continue}break}return e.slice(t)}for(;t<e.length&&/^[A-Za-z_][A-Za-z0-9_]*=/.test(e[t]);)t+=1;return e.slice(t)}function iy(e){const t=Tn(e,10);if(t.length<3)return e;const n=po(t[0]);if(!(n==="bash"||n==="sh"||n==="zsh"||n==="fish"))return e;const s=t.findIndex((a,o)=>o>0&&(a==="-c"||a==="-lc"||a==="-ic"));if(s===-1)return e;const i=t.slice(s+1).join(" ").trim();return i?go(i)??e:e}function xd(e,t){let n,s=!1;for(let i=0;i<e.length;i+=1){const a=e[i];if(s){s=!1;continue}if(a==="\\"){s=!0;continue}if(n){a===n&&(n=void 0);continue}if(a==='"'||a==="'"){n=a;continue}if(t(a,i)===!1)return}}function ay(e){let t=-1;return xd(e,(n,s)=>n===";"||(n==="&"||n==="|")&&e[s+1]===n?(t=s,!1):!0),t>=0?e.slice(0,t):e}function oy(e){const t=[];let n=0;return xd(e,(s,i)=>(s==="|"&&e[i-1]!=="|"&&e[i+1]!=="|"&&(t.push(e.slice(n,i)),n=i+1),!0)),t.push(e.slice(n)),t.map(s=>s.trim()).filter(s=>s.length>0)}function ry(e){let t=e.trim();for(let n=0;n<4;n+=1){const s=t.indexOf("&&"),i=t.indexOf(";"),a=t.indexOf(`
`),r=[{index:s,length:2},{index:i,length:1},{index:a,length:1}].filter(p=>p.index>=0).toSorted((p,g)=>p.index-g.index)[0],c=(r?t.slice(0,r.index):t).trim();if(!(c.startsWith("set ")||c.startsWith("export ")||c.startsWith("unset "))||(t=r?t.slice(r.index+r.length).trimStart():"",!t))break}return t.trim()}function ms(e){if(e.length===0)return"run command";const t=po(e[0])??"command";if(t==="git"){const s=new Set(["-C","-c","--git-dir","--work-tree","--namespace","--config-env"]),i=It(e,["-C"]);let a;for(let r=1;r<e.length;r+=1){const c=e[r];if(c){if(c==="--"){a=st(e,r+1);break}if(c.startsWith("--")){if(c.includes("="))continue;s.has(c)&&(r+=1);continue}if(c.startsWith("-")){s.has(c)&&(r+=1);continue}a=c;break}}const o={status:"check git status",diff:"check git diff",log:"view git history",show:"show git object",branch:"list git branches",checkout:"switch git branch",switch:"switch git branch",commit:"create git commit",pull:"pull git changes",push:"push git changes",fetch:"fetch git changes",merge:"merge git changes",rebase:"rebase git branch",add:"stage git changes",restore:"restore git files",reset:"reset git state",stash:"stash git changes"};return a&&o[a]?o[a]:!a||a.startsWith("/")||a.startsWith("~")||a.includes("/")?i?`run git command in ${i}`:"run git command":`run git ${a}`}if(t==="grep"||t==="rg"||t==="ripgrep"){const s=on(e,1,["-e","--regexp","-f","--file","-m","--max-count","-A","--after-context","-B","--before-context","-C","--context"]),i=It(e,["-e","--regexp"])??s[0],a=s.length>1?s.at(-1):void 0;return i?a?`search "${i}" in ${a}`:`search "${i}"`:"search text"}if(t==="find"){const s=e[1]&&!e[1].startsWith("-")?e[1]:".",i=It(e,["-name","-iname"]);return i?`find files named "${i}" in ${s}`:`find files in ${s}`}if(t==="ls"){const s=st(e,1);return s?`list files in ${s}`:"list files"}if(t==="head"||t==="tail"){const s=It(e,["-n","--lines"])??e.slice(1).find(c=>/^-\d+$/.test(c))?.slice(1),i=on(e,1,["-n","--lines"]);let a=i.at(-1);a&&/^\d+$/.test(a)&&i.length===1&&(a=void 0);const o=t==="head"?"first":"last",r=s==="1"?"line":"lines";return s&&a?`show ${o} ${s} ${r} of ${a}`:s?`show ${o} ${s} ${r}`:a?`show ${a}`:`show ${t} output`}if(t==="cat"){const s=st(e,1);return s?`show ${s}`:"show output"}if(t==="sed"){const s=It(e,["-e","--expression"]),i=on(e,1,["-e","--expression","-f","--file"]),a=s??i[0],o=s?i[0]:i[1];if(a){const r=(go(a)??a).replace(/\s+/g,""),c=r.match(/^([0-9]+),([0-9]+)p$/);if(c)return o?`print lines ${c[1]}-${c[2]} from ${o}`:`print lines ${c[1]}-${c[2]}`;const u=r.match(/^([0-9]+)p$/);if(u)return o?`print line ${u[1]} from ${o}`:`print line ${u[1]}`}return o?`run sed on ${o}`:"run sed transform"}if(t==="printf"||t==="echo")return"print text";if(t==="cp"||t==="mv"){const s=on(e,1,["-t","--target-directory","-S","--suffix"]),i=s[0],a=s[1],o=t==="cp"?"copy":"move";return i&&a?`${o} ${i} to ${a}`:i?`${o} ${i}`:`${o} files`}if(t==="rm"){const s=st(e,1);return s?`remove ${s}`:"remove files"}if(t==="mkdir"){const s=st(e,1);return s?`create folder ${s}`:"create folder"}if(t==="touch"){const s=st(e,1);return s?`create file ${s}`:"create file"}if(t==="curl"||t==="wget"){const s=e.find(i=>/^https?:\/\//i.test(i));return s?`fetch ${s}`:"fetch url"}if(t==="npm"||t==="pnpm"||t==="yarn"||t==="bun"){const s=on(e,1,["--prefix","-C","--cwd","--config"]),i=s[0]??"command";return{install:"install dependencies",test:"run tests",build:"run build",start:"start app",lint:"run lint",run:s[1]?`run ${s[1]}`:"run script"}[i]??`run ${t} ${i}`}if(t==="node"||t==="python"||t==="python3"||t==="ruby"||t==="php"){if(e.slice(1).find(c=>c.startsWith("<<")))return`run ${t} inline script (heredoc)`;if((t==="node"?It(e,["-e","--eval"]):t==="python"||t==="python3"?It(e,["-c"]):void 0)!==void 0)return`run ${t} inline script`;const r=st(e,1,t==="node"?["-e","--eval","-m"]:["-c","-e","--eval","-m"]);return r?t==="node"?`${e.includes("--check")||e.includes("-c")?"check js syntax for":"run node script"} ${r}`:`run ${t} ${r}`:`run ${t}`}if(t==="openclaw"){const s=st(e,1);return s?`run openclaw ${s}`:"run openclaw"}const n=st(e,1);return!n||n.length>48?`run ${t}`:/^[A-Za-z0-9._/-]+$/.test(n)?`run ${t} ${n}`:`run ${t}`}function nl(e){const t=ry(e),n=ay(t).trim();if(!n)return t?ms(vs(Tn(t))):void 0;const s=oy(n);if(s.length>1){const i=ms(vs(Tn(s[0]))),a=ms(vs(Tn(s[s.length-1]))),o=s.length>2?` (+${s.length-2} steps)`:"";return`${i} -> ${a}${o}`}return ms(vs(Tn(n)))}function ly(e){const t=pn(e);if(!t)return;const n=typeof t.command=="string"?t.command.trim():void 0;if(!n)return;const s=iy(n),i=nl(s)??nl(n)??"run command",o=(typeof t.workdir=="string"?t.workdir:typeof t.cwd=="string"?t.cwd:void 0)?.trim();return o?`${i} (in ${o})`:i}function cy(e,t){if(!(!e||!t))return e.actions?.[t]??void 0}function dy(e,t,n){{for(const s of t){const i=Xb(e,s),a=bd(i,n.coerce);if(a)return a}return}}const uy={icon:"puzzle",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},gy={bash:{icon:"wrench",title:"Bash",detailKeys:["command"]},process:{icon:"wrench",title:"Process",detailKeys:["sessionId"]},read:{icon:"fileText",title:"Read",detailKeys:["path"]},write:{icon:"edit",title:"Write",detailKeys:["path"]},edit:{icon:"penLine",title:"Edit",detailKeys:["path"]},attach:{icon:"paperclip",title:"Attach",detailKeys:["path","url","fileName"]},browser:{icon:"globe",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{icon:"image",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{icon:"smartphone",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{icon:"loader",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{icon:"plug",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{icon:"circle",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{icon:"messageSquare",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{icon:"messageSquare",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},py={fallback:uy,tools:gy},$d=py,sl=$d.fallback??{icon:"puzzle"},fy=$d.tools??{};function hy(e){if(!e)return e;const t=[{re:/^\/Users\/[^/]+(\/|$)/,replacement:"~$1"},{re:/^\/home\/[^/]+(\/|$)/,replacement:"~$1"},{re:/^C:\\Users\\[^\\]+(\\|$)/i,replacement:"~$1"}];for(const n of t)if(n.re.test(e))return e.replace(n.re,n.replacement);return e}function vy(e){const t=Yb(e.name),n=t.toLowerCase(),s=fy[n],i=s?.icon??sl.icon??"puzzle",a=s?.title??Zb(t),o=s?.label??a,r=e.args&&typeof e.args=="object"?e.args.action:void 0,c=typeof r=="string"?r.trim():void 0,u=cy(s,c),p=n==="web_search"?"search":n==="web_fetch"?"fetch":n.replace(/_/g," ").replace(/\./g," "),g=Jb(u?.label??c??p);let d;n==="exec"&&(d=ly(e.args)),!d&&n==="read"&&(d=ey(e.args)),!d&&(n==="write"||n==="edit"||n==="attach")&&(d=ty(n,e.args)),!d&&n==="web_search"&&(d=ny(e.args)),!d&&n==="web_fetch"&&(d=sy(e.args));const h=u?.detailKeys??s?.detailKeys??sl.detailKeys??[];return!d&&h.length>0&&(d=dy(e.args,h,{coerce:{includeFalse:!0,includeZero:!0}})),!d&&e.meta&&(d=e.meta),d&&(d=hy(d)),{name:t,icon:i,title:a,label:o,verb:g,detail:d}}function my(e){if(e.detail){if(e.detail.includes(" · ")){const t=e.detail.split(" · ").map(n=>n.trim()).filter(n=>n.length>0).join(", ");return t?`with ${t}`:void 0}return e.detail}}const by=80,yy=2,il=100;function xy(e){const t=e.trim();if(t.startsWith("{")||t.startsWith("["))try{const n=JSON.parse(t);return"```json\n"+JSON.stringify(n,null,2)+"\n```"}catch{}return e}function $y(e){const t=e.split(`
`),n=t.slice(0,yy),s=n.join(`
`);return s.length>il?s.slice(0,il)+"…":n.length<t.length?s+"…":s}function wy(e){const t=e,n=ky(t.content),s=[];for(const i of n){const a=(typeof i.type=="string"?i.type:"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(a)||typeof i.name=="string"&&i.arguments!=null)&&s.push({kind:"call",name:i.name??"tool",args:Sy(i.arguments??i.args)})}for(const i of n){const a=(typeof i.type=="string"?i.type:"").toLowerCase();if(a!=="toolresult"&&a!=="tool_result")continue;const o=Ay(i),r=typeof i.name=="string"?i.name:"tool";s.push({kind:"result",name:r,text:o})}if(md(e)&&!s.some(i=>i.kind==="result")){const i=typeof t.toolName=="string"&&t.toolName||typeof t.tool_name=="string"&&t.tool_name||"tool",a=yc(e)??void 0;s.push({kind:"result",name:i,text:a})}return s}function al(e,t){const n=vy({name:e.name,args:e.args}),s=my(n),i=!!e.text?.trim(),a=!!t,o=a?()=>{if(i){t(xy(e.text));return}const g=`## ${n.label}

${s?`**Command:** \`${s}\`

`:""}*No output — tool completed successfully.*`;t(g)}:void 0,r=i&&(e.text?.length??0)<=by,c=i&&!r,u=i&&r,p=!i;return l`
    <div
      class="chat-tool-card ${a?"chat-tool-card--clickable":""}"
      @click=${o}
      role=${a?"button":v}
      tabindex=${a?"0":v}
      @keydown=${a?g=>{g.key!=="Enter"&&g.key!==" "||(g.preventDefault(),o?.())}:v}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${oe[n.icon]}</span>
          <span>${n.label}</span>
        </div>
        ${a?l`<span class="chat-tool-card__action">${i?"View":""} ${oe.check}</span>`:v}
        ${p&&!a?l`<span class="chat-tool-card__status">${oe.check}</span>`:v}
      </div>
      ${s?l`<div class="chat-tool-card__detail">${s}</div>`:v}
      ${p?l`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `:v}
      ${c?l`<div class="chat-tool-card__preview mono">${$y(e.text)}</div>`:v}
      ${u?l`<div class="chat-tool-card__inline mono">${e.text}</div>`:v}
    </div>
  `}function ky(e){return Array.isArray(e)?e.filter(Boolean):[]}function Sy(e){if(typeof e!="string")return e;const t=e.trim();if(!t||!t.startsWith("{")&&!t.startsWith("["))return e;try{return JSON.parse(t)}catch{return e}}function Ay(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function Cy(e){const n=e.content,s=[];if(Array.isArray(n))for(const i of n){if(typeof i!="object"||i===null)continue;const a=i;if(a.type==="image"){const o=a.source;if(o?.type==="base64"&&typeof o.data=="string"){const r=o.data,c=o.media_type||"image/png",u=r.startsWith("data:")?r:`data:${c};base64,${r}`;s.push({url:u})}else typeof a.url=="string"&&s.push({url:a.url})}else if(a.type==="image_url"){const o=a.image_url;typeof o?.url=="string"&&s.push({url:o.url})}}return s}function Ty(e){return l`
    <div class="chat-group assistant">
      ${fo("assistant",e)}
      <div class="chat-group-messages">
        <div class="chat-bubble chat-reading-indicator" aria-hidden="true">
          <span class="chat-reading-indicator__dots">
            <span></span><span></span><span></span>
          </span>
        </div>
      </div>
    </div>
  `}function _y(e,t,n,s){const i=new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),a=s?.name??"Assistant";return l`
    <div class="chat-group assistant">
      ${fo("assistant",s)}
      <div class="chat-group-messages">
        ${wd({role:"assistant",content:[{type:"text",text:e}],timestamp:t},{isStreaming:!0,showReasoning:!1},n)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${a}</span>
          <span class="chat-group-timestamp">${i}</span>
        </div>
      </div>
    </div>
  `}function Ey(e,t){const n=uo(e.role),s=t.assistantName??"Assistant",i=n==="user"?"You":n==="assistant"?s:n,a=n==="user"?"user":n==="assistant"?"assistant":"other",o=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return l`
    <div class="chat-group ${a}">
      ${fo(e.role,{name:s,avatar:t.assistantAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((r,c)=>wd(r.message,{isStreaming:e.isStreaming&&c===e.messages.length-1,showReasoning:t.showReasoning},t.onOpenSidebar))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${i}</span>
          <span class="chat-group-timestamp">${o}</span>
        </div>
      </div>
    </div>
  `}function fo(e,t){const n=uo(e),s=t?.name?.trim()||"Assistant",i=t?.avatar?.trim()||"",a=n==="user"?"U":n==="assistant"?s.charAt(0).toUpperCase()||"A":n==="tool"?"⚙":"?",o=n==="user"?"user":n==="assistant"?"assistant":n==="tool"?"tool":"other";return i&&n==="assistant"?My(i)?l`<img
        class="chat-avatar ${o}"
        src="${i}"
        alt="${s}"
      />`:l`<div class="chat-avatar ${o}">${i}</div>`:l`<div class="chat-avatar ${o}">${a}</div>`}function My(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||e.startsWith("/")}function Ly(e){return e.length===0?v:l`
    <div class="chat-message-images">
      ${e.map(t=>l`
          <img
            src=${t.url}
            alt=${t.alt??"Attached image"}
            class="chat-message-image"
            @click=${()=>window.open(t.url,"_blank")}
          />
        `)}
    </div>
  `}function wd(e,t,n){const s=e,i=typeof s.role=="string"?s.role:"unknown",a=md(e)||i.toLowerCase()==="toolresult"||i.toLowerCase()==="tool_result"||typeof s.toolCallId=="string"||typeof s.tool_call_id=="string",o=wy(e),r=o.length>0,c=Cy(e),u=c.length>0,p=yc(e),g=t.showReasoning&&i==="assistant"?Hp(e):null,d=p?.trim()?p:null,h=g?Kp(g):null,f=d,m=i==="assistant"&&!!f?.trim(),w=["chat-bubble",m?"has-copy":"",t.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");return!f&&r&&a?l`${o.map(S=>al(S,n))}`:!f&&!r&&!u?v:l`
    <div class="${w}">
      ${m?Qb(f):v}
      ${Ly(c)}
      ${h?l`<div class="chat-thinking">${na(da(h))}</div>`:v}
      ${f?l`<div class="chat-text" dir="${fd(f)}">${na(da(f))}</div>`:v}
      ${o.map(S=>al(S,n))}
    </div>
  `}function Iy(e){return l`
    <div class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title">Tool Output</div>
        <button @click=${e.onClose} class="btn" title="Close sidebar">
          ${oe.x}
        </button>
      </div>
      <div class="sidebar-content">
        ${e.error?l`
              <div class="callout danger">${e.error}</div>
              <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
                View Raw Text
              </button>
            `:e.content?l`<div class="sidebar-markdown">${na(da(e.content))}</div>`:l`
                  <div class="muted">No content available</div>
                `}
      </div>
    </div>
  `}var Ry=Object.defineProperty,Py=Object.getOwnPropertyDescriptor,ri=(e,t,n,s)=>{for(var i=s>1?void 0:s?Py(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(s?o(t,n,i):o(i))||i);return s&&i&&Ry(t,n,i),i};let gn=class extends ln{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.isDragging=!1,this.startX=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startX=e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const t=this.parentElement;if(!t)return;const n=t.getBoundingClientRect().width,i=(e.clientX-this.startX)/n;let a=this.startRatio+i;a=Math.max(this.minRatio,Math.min(this.maxRatio,a)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:a},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return v}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};gn.styles=Rd`
    :host {
      width: 4px;
      cursor: col-resize;
      background: var(--border, #333);
      transition: background 150ms ease-out;
      flex-shrink: 0;
      position: relative;
    }
    :host::before {
      content: "";
      position: absolute;
      top: 0;
      left: -4px;
      right: -4px;
      bottom: 0;
    }
    :host(:hover) {
      background: var(--accent, #007bff);
    }
    :host(.dragging) {
      background: var(--accent, #007bff);
    }
  `;ri([Vs({type:Number})],gn.prototype,"splitRatio",2);ri([Vs({type:Number})],gn.prototype,"minRatio",2);ri([Vs({type:Number})],gn.prototype,"maxRatio",2);gn=ri([Cl("resizable-divider")],gn);const Dy=5e3,Ny=8e3;function ol(e){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}function Fy(e){return e?e.active?l`
      <div class="compaction-indicator compaction-indicator--active" role="status" aria-live="polite">
        ${oe.loader} Compacting context...
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<Dy?l`
        <div class="compaction-indicator compaction-indicator--complete" role="status" aria-live="polite">
          ${oe.check} Context compacted
        </div>
      `:v:v}function Oy(e){if(!e)return v;const t=e.phase??"active";if(Date.now()-e.occurredAt>=Ny)return v;const s=[`Selected: ${e.selected}`,t==="cleared"?`Active: ${e.selected}`:`Active: ${e.active}`,t==="cleared"&&e.previous?`Previous fallback: ${e.previous}`:null,e.reason?`Reason: ${e.reason}`:null,e.attempts.length>0?`Attempts: ${e.attempts.slice(0,3).join(" | ")}`:null].filter(Boolean).join(" • "),i=t==="cleared"?`Fallback cleared: ${e.selected}`:`Fallback active: ${e.active}`,a=t==="cleared"?"compaction-indicator compaction-indicator--fallback-cleared":"compaction-indicator compaction-indicator--fallback",o=t==="cleared"?oe.check:oe.brain;return l`
    <div
      class=${a}
      role="status"
      aria-live="polite"
      title=${s}
    >
      ${o} ${i}
    </div>
  `}function By(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function zy(e,t){const n=e.clipboardData?.items;if(!n||!t.onAttachmentsChange)return;const s=[];for(let i=0;i<n.length;i++){const a=n[i];a.type.startsWith("image/")&&s.push(a)}if(s.length!==0){e.preventDefault();for(const i of s){const a=i.getAsFile();if(!a)continue;const o=new FileReader;o.addEventListener("load",()=>{const r=o.result,c={id:By(),dataUrl:r,mimeType:a.type},u=t.attachments??[];t.onAttachmentsChange?.([...u,c])}),o.readAsDataURL(a)}}}function Uy(e){const t=e.attachments??[];return t.length===0?v:l`
    <div class="chat-attachments">
      ${t.map(n=>l`
          <div class="chat-attachment">
            <img
              src=${n.dataUrl}
              alt="Attachment preview"
              class="chat-attachment__img"
            />
            <button
              class="chat-attachment__remove"
              type="button"
              aria-label="Remove attachment"
              @click=${()=>{const s=(e.attachments??[]).filter(i=>i.id!==n.id);e.onAttachmentsChange?.(s)}}
            >
              ${oe.x}
            </button>
          </div>
        `)}
    </div>
  `}function Hy(e){const t=e.connected,n=e.sending||e.stream!==null,s=!!(e.canAbort&&e.onAbort),a=e.sessions?.sessions?.find(f=>f.key===e.sessionKey)?.reasoningLevel??"off",o=e.showThinking&&a!=="off",r={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},c=(e.attachments?.length??0)>0,u=e.connected?c?"Add a message or paste more images...":"Message (↩ to send, Shift+↩ for line breaks, paste images)":"Connect to the gateway to start chatting…",p=e.splitRatio??.6,g=!!(e.sidebarOpen&&e.onCloseSidebar),d=l`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${e.onChatScroll}
    >
      ${e.loading?l`
              <div class="muted">Loading chat…</div>
            `:v}
      ${Dc(Ky(e),f=>f.key,f=>f.kind==="divider"?l`
              <div class="chat-divider" role="separator" data-ts=${String(f.timestamp)}>
                <span class="chat-divider__line"></span>
                <span class="chat-divider__label">${f.label}</span>
                <span class="chat-divider__line"></span>
              </div>
            `:f.kind==="reading-indicator"?Ty(r):f.kind==="stream"?_y(f.text,f.startedAt,e.onOpenSidebar,r):f.kind==="group"?Ey(f,{onOpenSidebar:e.onOpenSidebar,showReasoning:o,assistantName:e.assistantName,assistantAvatar:r.avatar}):v)}
    </div>
  `,h=(()=>{if(e.cognitionValence==null)return v;const f=e.cognitionValence,m=f>.3?"#22c55e":f<-.3?"#ef4444":"#eab308",w=f>.3?"Positive":f<-.3?"Negative":"Neutral";return l`
      <button
        class="mind-badge"
        title="Cognitive state: ${w} (valence ${f.toFixed(2)}). Click to open Mind tab."
        @click=${e.onMindClick}
      >
        <span class="mind-badge__dot" style="background: ${m};"></span>
        <span class="mind-badge__label">${w}</span>
      </button>
    `})();return l`
    <section class="card chat">
      ${h}
      ${e.disabledReason?l`<div class="callout">${e.disabledReason}</div>`:v}

      ${e.error?l`<div class="callout danger">${e.error}</div>`:v}

      ${e.focusMode?l`
            <button
              class="chat-focus-exit"
              type="button"
              @click=${e.onToggleFocusMode}
              aria-label="Exit focus mode"
              title="Exit focus mode"
            >
              ${oe.x}
            </button>
          `:v}

      <div
        class="chat-split-container ${g?"chat-split-container--open":""}"
      >
        <div
          class="chat-main"
          style="flex: ${g?`0 0 ${p*100}%`:"1 1 100%"}"
        >
          ${d}
        </div>

        ${g?l`
              <resizable-divider
                .splitRatio=${p}
                @resize=${f=>e.onSplitRatioChange?.(f.detail.splitRatio)}
              ></resizable-divider>
              <div class="chat-sidebar">
                ${Iy({content:e.sidebarContent??null,error:e.sidebarError??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(`\`\`\`
${e.sidebarContent}
\`\`\``)}})}
              </div>
            `:v}
      </div>

      ${e.queue.length?l`
            <div class="chat-queue" role="status" aria-live="polite">
              <div class="chat-queue__title">Queued (${e.queue.length})</div>
              <div class="chat-queue__list">
                ${e.queue.map(f=>l`
                    <div class="chat-queue__item">
                      <div class="chat-queue__text">
                        ${f.text||(f.attachments?.length?`Image (${f.attachments.length})`:"")}
                      </div>
                      <button
                        class="btn chat-queue__remove"
                        type="button"
                        aria-label="Remove queued message"
                        @click=${()=>e.onQueueRemove(f.id)}
                      >
                        ${oe.x}
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:v}

      ${Oy(e.fallbackStatus)}
      ${Fy(e.compactionStatus)}

      ${e.showNewMessages?l`
            <button
              class="btn chat-new-messages"
              type="button"
              @click=${e.onScrollToBottom}
            >
              New messages ${oe.arrowDown}
            </button>
          `:v}

      <div class="chat-compose">
        ${Uy(e)}
        <div class="chat-compose__row">
          <label class="field chat-compose__field">
            <span>Message</span>
            <textarea
              ${Sm(f=>f&&ol(f))}
              .value=${e.draft}
              dir=${fd(e.draft)}
              ?disabled=${!e.connected}
              @keydown=${f=>{f.key==="Enter"&&(f.isComposing||f.keyCode===229||f.shiftKey||e.connected&&(f.preventDefault(),t&&e.onSend()))}}
              @input=${f=>{const m=f.target;ol(m),e.onDraftChange(m.value)}}
              @paste=${f=>zy(f,e)}
              placeholder=${u}
            ></textarea>
          </label>
          <div class="chat-compose__actions">
            ${e.onToggleMic?l`<button
                  class="chat-mic ${e.micActive?`chat-mic--active chat-mic--${(e.micState??"IDLE").toLowerCase()}`:""}"
                  @click=${e.onToggleMic}
                  title=${e.micActive?"Stop voice input":"Voice input"}
                  aria-label=${e.micActive?"Stop voice input":"Voice input"}
                >
                  <svg viewBox="0 0 24 24" class="chat-mic__icon">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </button>`:v}
            <button
              class="btn"
              ?disabled=${!e.connected||!s&&e.sending}
              @click=${s?e.onAbort:e.onNewSession}
            >
              ${s?"Stop":"New session"}
            </button>
            <button
              class="btn primary"
              ?disabled=${!e.connected}
              @click=${e.onSend}
            >
              ${n?"Queue":"Send"}<kbd class="btn-kbd">↵</kbd>
            </button>
          </div>
        </div>
      </div>
    </section>
  `}const rl=200;function jy(e){const t=[];let n=null;for(const s of e){if(s.kind!=="message"){n&&(t.push(n),n=null),t.push(s);continue}const i=vd(s.message),a=uo(i.role),o=i.timestamp||Date.now();!n||n.role!==a?(n&&t.push(n),n={kind:"group",key:`group:${a}:${s.key}`,role:a,messages:[{message:s.message,key:s.key}],timestamp:o,isStreaming:!1}):n.messages.push({message:s.message,key:s.key})}return n&&t.push(n),t}function Ky(e){const t=[],n=Array.isArray(e.messages)?e.messages:[],s=Array.isArray(e.toolMessages)?e.toolMessages:[],i=Math.max(0,n.length-rl);i>0&&t.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${rl} messages (${i} hidden).`,timestamp:Date.now()}});for(let a=i;a<n.length;a++){const o=n[a],r=vd(o),u=o.__openclaw;if(u&&u.kind==="compaction"){t.push({kind:"divider",key:typeof u.id=="string"?`divider:compaction:${u.id}`:`divider:compaction:${r.timestamp}:${a}`,label:"Compaction",timestamp:r.timestamp??Date.now()});continue}!e.showThinking&&r.role.toLowerCase()==="toolresult"||t.push({kind:"message",key:ll(o,a),message:o})}if(e.showThinking)for(let a=0;a<s.length;a++)t.push({kind:"message",key:ll(s[a],a+n.length),message:s[a]});if(e.stream!==null){const a=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?t.push({kind:"stream",key:a,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):t.push({kind:"reading-indicator",key:a})}return jy(t)}function ll(e,t){const n=e,s=typeof n.toolCallId=="string"?n.toolCallId:"";if(s)return`tool:${s}`;const i=typeof n.id=="string"?n.id:"";if(i)return`msg:${i}`;const a=typeof n.messageId=="string"?n.messageId:"";if(a)return`msg:${a}`;const o=typeof n.timestamp=="number"?n.timestamp:null,r=typeof n.role=="string"?n.role:"unknown";return o!=null?`msg:${r}:${o}:${t}`:`msg:${r}:${t}`}const ua={all:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  `,env:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M15 4V2"></path>
      <path d="M15 16v-2"></path>
      <path d="M8 9h2"></path>
      <path d="M20 9h2"></path>
      <path d="M17.8 11.8 19 13"></path>
      <path d="M15 9h0"></path>
      <path d="M17.8 6.2 19 5"></path>
      <path d="m3 21 9-9"></path>
      <path d="M12.2 6.2 11 5"></path>
    </svg>
  `,meta:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2v6"></path>
      <path d="m4.93 10.93 4.24 4.24"></path>
      <path d="M2 12h6"></path>
      <path d="m4.93 13.07 4.24-4.24"></path>
      <path d="M12 22v-6"></path>
      <path d="m19.07 13.07-4.24-4.24"></path>
      <path d="M22 12h-6"></path>
      <path d="m19.07 10.93-4.24 4.24"></path>
    </svg>
  `,default:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},cl=[{key:"env",label:"Environment"},{key:"update",label:"Updates"},{key:"agents",label:"Agents"},{key:"auth",label:"Authentication"},{key:"channels",label:"Channels"},{key:"messages",label:"Messages"},{key:"commands",label:"Commands"},{key:"hooks",label:"Hooks"},{key:"skills",label:"Skills"},{key:"tools",label:"Tools"},{key:"gateway",label:"Gateway"},{key:"wizard",label:"Setup Wizard"}],dl="__all__";function ul(e){return ua[e]??ua.default}function Wy(e,t){const n=eo[e];return n||{label:t?.title??rt(e),description:t?.description??""}}function Vy(e){const{key:t,schema:n,uiHints:s}=e;if(!n||Le(n)!=="object"||!n.properties)return[];const i=Object.entries(n.properties).map(([a,o])=>{const r=De([t,a],s),c=r?.label??o.title??rt(a),u=r?.help??o.description??"",p=r?.order??50;return{key:a,label:c,description:u,order:p}});return i.sort((a,o)=>a.order!==o.order?a.order-o.order:a.key.localeCompare(o.key)),i}function qy(e,t){if(!e||!t)return[];const n=[];function s(i,a,o){if(i===a)return;if(typeof i!=typeof a){n.push({path:o,from:i,to:a});return}if(typeof i!="object"||i===null||a===null){i!==a&&n.push({path:o,from:i,to:a});return}if(Array.isArray(i)&&Array.isArray(a)){JSON.stringify(i)!==JSON.stringify(a)&&n.push({path:o,from:i,to:a});return}const r=i,c=a,u=new Set([...Object.keys(r),...Object.keys(c)]);for(const p of u)s(r[p],c[p],o?`${o}.${p}`:p)}return s(e,t,""),n}function gl(e,t=40){let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:n.slice(0,t-3)+"..."}function Gy(e){const t=e.valid==null?"unknown":e.valid?"valid":"invalid",n=Vc(e.schema),s=n.schema?n.unsupportedPaths.length>0:!1,i=n.schema?.properties??{},a=cl.filter(T=>T.key in i),o=new Set(cl.map(T=>T.key)),r=Object.keys(i).filter(T=>!o.has(T)).map(T=>({key:T,label:T.charAt(0).toUpperCase()+T.slice(1)})),c=[...a,...r],u=e.activeSection&&n.schema&&Le(n.schema)==="object"?n.schema.properties?.[e.activeSection]:void 0,p=e.activeSection?Wy(e.activeSection,u):null,g=e.activeSection?Vy({key:e.activeSection,schema:u,uiHints:e.uiHints}):[],d=e.formMode==="form"&&!!e.activeSection&&g.length>0,h=e.activeSubsection===dl,f=e.searchQuery||h?null:e.activeSubsection??g[0]?.key??null,m=e.formMode==="form"?qy(e.originalValue,e.formValue):[],w=e.formMode==="raw"&&e.raw!==e.originalRaw,S=e.formMode==="form"?m.length>0:w,A=!!e.formValue&&!e.loading&&!!n.schema,k=e.connected&&!e.saving&&S&&(e.formMode==="raw"?!0:A),C=e.connected&&!e.applying&&!e.updating&&S&&(e.formMode==="raw"?!0:A),_=e.connected&&!e.applying&&!e.updating;return l`
    <div class="config-layout">
      <!-- Sidebar -->
      <aside class="config-sidebar">
        <div class="config-sidebar__header">
          <div class="config-sidebar__title">Settings</div>
          <span
            class="pill pill--sm ${t==="valid"?"pill--ok":t==="invalid"?"pill--danger":""}"
            >${t}</span
          >
        </div>

        <!-- Search -->
        <div class="config-search">
          <svg
            class="config-search__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            class="config-search__input"
            placeholder="Search settings..."
            .value=${e.searchQuery}
            @input=${T=>e.onSearchChange(T.target.value)}
          />
          ${e.searchQuery?l`
                <button
                  class="config-search__clear"
                  @click=${()=>e.onSearchChange("")}
                >
                  ×
                </button>
              `:v}
        </div>

        <!-- Section nav -->
        <nav class="config-nav">
          <button
            class="config-nav__item ${e.activeSection===null?"active":""}"
            @click=${()=>e.onSectionChange(null)}
          >
            <span class="config-nav__icon">${ua.all}</span>
            <span class="config-nav__label">All Settings</span>
          </button>
          ${c.map(T=>l`
              <button
                class="config-nav__item ${e.activeSection===T.key?"active":""}"
                @click=${()=>e.onSectionChange(T.key)}
              >
                <span class="config-nav__icon"
                  >${ul(T.key)}</span
                >
                <span class="config-nav__label">${T.label}</span>
              </button>
            `)}
        </nav>

        <!-- Mode toggle at bottom -->
        <div class="config-sidebar__footer">
          <div class="config-mode-toggle">
            <button
              class="config-mode-toggle__btn ${e.formMode==="form"?"active":""}"
              ?disabled=${e.schemaLoading||!e.schema}
              @click=${()=>e.onFormModeChange("form")}
            >
              Form
            </button>
            <button
              class="config-mode-toggle__btn ${e.formMode==="raw"?"active":""}"
              @click=${()=>e.onFormModeChange("raw")}
            >
              Raw
            </button>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="config-main">
        <!-- Action bar -->
        <div class="config-actions">
          <div class="config-actions__left">
            ${S?l`
                  <span class="config-changes-badge"
                    >${e.formMode==="raw"?"Unsaved changes":`${m.length} unsaved change${m.length!==1?"s":""}`}</span
                  >
                `:l`
                    <span class="config-status muted">No changes</span>
                  `}
          </div>
          <div class="config-actions__right">
            <button
              class="btn btn--sm"
              ?disabled=${e.loading}
              @click=${e.onReload}
            >
              ${e.loading?"Loading…":"Reload"}
            </button>
            <button
              class="btn btn--sm primary"
              ?disabled=${!k}
              @click=${e.onSave}
            >
              ${e.saving?"Saving…":"Save"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!C}
              @click=${e.onApply}
            >
              ${e.applying?"Applying…":"Apply"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!_}
              @click=${e.onUpdate}
            >
              ${e.updating?"Updating…":"Update"}
            </button>
          </div>
        </div>

        <!-- Diff panel (form mode only - raw mode doesn't have granular diff) -->
        ${S&&e.formMode==="form"?l`
              <details class="config-diff">
                <summary class="config-diff__summary">
                  <span
                    >View ${m.length} pending
                    change${m.length!==1?"s":""}</span
                  >
                  <svg
                    class="config-diff__chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </summary>
                <div class="config-diff__content">
                  ${m.map(T=>l`
                      <div class="config-diff__item">
                        <div class="config-diff__path">${T.path}</div>
                        <div class="config-diff__values">
                          <span class="config-diff__from"
                            >${gl(T.from)}</span
                          >
                          <span class="config-diff__arrow">→</span>
                          <span class="config-diff__to"
                            >${gl(T.to)}</span
                          >
                        </div>
                      </div>
                    `)}
                </div>
              </details>
            `:v}
        ${p&&e.formMode==="form"?l`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">
                  ${ul(e.activeSection??"")}
                </div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">
                    ${p.label}
                  </div>
                  ${p.description?l`<div class="config-section-hero__desc">
                        ${p.description}
                      </div>`:v}
                </div>
              </div>
            `:v}
        ${d?l`
              <div class="config-subnav">
                <button
                  class="config-subnav__item ${f===null?"active":""}"
                  @click=${()=>e.onSubsectionChange(dl)}
                >
                  All
                </button>
                ${g.map(T=>l`
                    <button
                      class="config-subnav__item ${f===T.key?"active":""}"
                      title=${T.description||T.label}
                      @click=${()=>e.onSubsectionChange(T.key)}
                    >
                      ${T.label}
                    </button>
                  `)}
              </div>
            `:v}

        <!-- Form content -->
        <div class="config-content">
          ${e.formMode==="form"?l`
                ${e.schemaLoading?l`
                        <div class="config-loading">
                          <div class="config-loading__spinner"></div>
                          <span>Loading schema…</span>
                        </div>
                      `:Kv({schema:n.schema,uiHints:e.uiHints,value:e.formValue,disabled:e.loading||!e.formValue,unsupportedPaths:n.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:f})}
                ${s?l`
                        <div class="callout danger" style="margin-top: 12px">
                          Form view can't safely edit some fields. Use Raw to avoid losing config entries.
                        </div>
                      `:v}
              `:l`
                <label class="field config-raw-field">
                  <span>Raw JSON5</span>
                  <textarea
                    .value=${e.raw}
                    @input=${T=>e.onRawChange(T.target.value)}
                  ></textarea>
                </label>
              `}
        </div>

        ${e.issues.length>0?l`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">
${JSON.stringify(e.issues,null,2)}</pre
              >
            </div>`:v}
      </main>
    </div>
  `}function Qy(e){const t=["last",...e.channels.filter(Boolean)],n=e.form.deliveryChannel?.trim();n&&!t.includes(n)&&t.push(n);const s=new Set;return t.filter(i=>s.has(i)?!1:(s.add(i),!0))}function Yy(e,t){if(t==="last")return"last";const n=e.channelMeta?.find(s=>s.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function Zy(e){const t=Qy(e),s=(e.runsJobId==null?void 0:e.jobs.find(r=>r.id===e.runsJobId))?.name??e.runsJobId??"(select a job)",i=e.runs.toSorted((r,c)=>c.ts-r.ts),a=e.form.sessionTarget==="isolated"&&e.form.payloadKind==="agentTurn",o=e.form.deliveryMode==="announce"&&!a?"none":e.form.deliveryMode;return l`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="card-title">Scheduler</div>
        <div class="card-sub">Gateway-owned cron scheduler status.</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">Enabled</div>
            <div class="stat-value">
              ${e.status?e.status.enabled?"Yes":"No":"n/a"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">Jobs</div>
            <div class="stat-value">${e.status?.jobs??"n/a"}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Next wake</div>
            <div class="stat-value">${Xa(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
          ${e.error?l`<span class="muted">${e.error}</span>`:v}
        </div>
      </div>

      <div class="card">
        <div class="card-title">New Job</div>
        <div class="card-sub">Create a scheduled wakeup or agent run.</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>Name</span>
            <input
              .value=${e.form.name}
              @input=${r=>e.onFormChange({name:r.target.value})}
            />
          </label>
          <label class="field">
            <span>Description</span>
            <input
              .value=${e.form.description}
              @input=${r=>e.onFormChange({description:r.target.value})}
            />
          </label>
          <label class="field">
            <span>Agent ID</span>
            <input
              .value=${e.form.agentId}
              @input=${r=>e.onFormChange({agentId:r.target.value})}
              placeholder="default"
            />
          </label>
          <label class="field checkbox">
            <span>Enabled</span>
            <input
              type="checkbox"
              .checked=${e.form.enabled}
              @change=${r=>e.onFormChange({enabled:r.target.checked})}
            />
          </label>
          <label class="field">
            <span>Schedule</span>
            <select
              .value=${e.form.scheduleKind}
              @change=${r=>e.onFormChange({scheduleKind:r.target.value})}
            >
              <option value="every">Every</option>
              <option value="at">At</option>
              <option value="cron">Cron</option>
            </select>
          </label>
        </div>
        ${Jy(e)}
        <div class="form-grid" style="margin-top: 12px;">
          <label class="field">
            <span>Session</span>
            <select
              .value=${e.form.sessionTarget}
              @change=${r=>e.onFormChange({sessionTarget:r.target.value})}
            >
              <option value="main">Main</option>
              <option value="isolated">Isolated</option>
            </select>
          </label>
          <label class="field">
            <span>Wake mode</span>
            <select
              .value=${e.form.wakeMode}
              @change=${r=>e.onFormChange({wakeMode:r.target.value})}
            >
              <option value="now">Now</option>
              <option value="next-heartbeat">Next heartbeat</option>
            </select>
          </label>
          <label class="field">
            <span>Payload</span>
            <select
              .value=${e.form.payloadKind}
              @change=${r=>e.onFormChange({payloadKind:r.target.value})}
            >
              <option value="systemEvent">System event</option>
              <option value="agentTurn">Agent turn</option>
            </select>
          </label>
        </div>
        <label class="field" style="margin-top: 12px;">
          <span>${e.form.payloadKind==="systemEvent"?"System text":"Agent message"}</span>
          <textarea
            .value=${e.form.payloadText}
            @input=${r=>e.onFormChange({payloadText:r.target.value})}
            rows="4"
          ></textarea>
        </label>
        <div class="form-grid" style="margin-top: 12px;">
          <label class="field">
            <span>Delivery</span>
            <select
              .value=${o}
              @change=${r=>e.onFormChange({deliveryMode:r.target.value})}
            >
              ${a?l`
                      <option value="announce">Announce summary (default)</option>
                    `:v}
              <option value="webhook">Webhook POST</option>
              <option value="none">None (internal)</option>
            </select>
          </label>
          ${e.form.payloadKind==="agentTurn"?l`
                  <label class="field">
                    <span>Timeout (seconds)</span>
                    <input
                      .value=${e.form.timeoutSeconds}
                      @input=${r=>e.onFormChange({timeoutSeconds:r.target.value})}
                    />
                  </label>
                `:v}
          ${o!=="none"?l`
                  <label class="field">
                    <span>${o==="webhook"?"Webhook URL":"Channel"}</span>
                    ${o==="webhook"?l`
                            <input
                              .value=${e.form.deliveryTo}
                              @input=${r=>e.onFormChange({deliveryTo:r.target.value})}
                              placeholder="https://example.invalid/cron"
                            />
                          `:l`
                            <select
                              .value=${e.form.deliveryChannel||"last"}
                              @change=${r=>e.onFormChange({deliveryChannel:r.target.value})}
                            >
                              ${t.map(r=>l`<option value=${r}>
                                    ${Yy(e,r)}
                                  </option>`)}
                            </select>
                          `}
                  </label>
                  ${o==="announce"?l`
                          <label class="field">
                            <span>To</span>
                            <input
                              .value=${e.form.deliveryTo}
                              @input=${r=>e.onFormChange({deliveryTo:r.target.value})}
                              placeholder="+1555… or chat id"
                            />
                          </label>
                        `:v}
                `:v}
        </div>
        <div class="row" style="margin-top: 14px;">
          <button class="btn primary" ?disabled=${e.busy} @click=${e.onAdd}>
            ${e.busy?"Saving…":"Add job"}
          </button>
        </div>
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Jobs</div>
      <div class="card-sub">All scheduled jobs stored in the gateway.</div>
      ${e.jobs.length===0?l`
              <div class="muted" style="margin-top: 12px">No jobs yet.</div>
            `:l`
            <div class="list" style="margin-top: 12px;">
              ${e.jobs.map(r=>Xy(r,e))}
            </div>
          `}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Run history</div>
      <div class="card-sub">Latest runs for ${s}.</div>
      ${e.runsJobId==null?l`
              <div class="muted" style="margin-top: 12px">Select a job to inspect run history.</div>
            `:i.length===0?l`
                <div class="muted" style="margin-top: 12px">No runs yet.</div>
              `:l`
              <div class="list" style="margin-top: 12px;">
                ${i.map(r=>n0(r,e.basePath))}
              </div>
            `}
    </section>
  `}function Jy(e){const t=e.form;return t.scheduleKind==="at"?l`
      <label class="field" style="margin-top: 12px;">
        <span>Run at</span>
        <input
          type="datetime-local"
          .value=${t.scheduleAt}
          @input=${n=>e.onFormChange({scheduleAt:n.target.value})}
        />
      </label>
    `:t.scheduleKind==="every"?l`
      <div class="form-grid" style="margin-top: 12px;">
        <label class="field">
          <span>Every</span>
          <input
            .value=${t.everyAmount}
            @input=${n=>e.onFormChange({everyAmount:n.target.value})}
          />
        </label>
        <label class="field">
          <span>Unit</span>
          <select
            .value=${t.everyUnit}
            @change=${n=>e.onFormChange({everyUnit:n.target.value})}
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </label>
      </div>
    `:l`
    <div class="form-grid" style="margin-top: 12px;">
      <label class="field">
        <span>Expression</span>
        <input
          .value=${t.cronExpr}
          @input=${n=>e.onFormChange({cronExpr:n.target.value})}
        />
      </label>
      <label class="field">
        <span>Timezone (optional)</span>
        <input
          .value=${t.cronTz}
          @input=${n=>e.onFormChange({cronTz:n.target.value})}
        />
      </label>
    </div>
  `}function Xy(e,t){const s=`list-item list-item-clickable cron-job${t.runsJobId===e.id?" list-item-selected":""}`;return l`
    <div class=${s} @click=${()=>t.onLoadRuns(e.id)}>
      <div class="list-main">
        <div class="list-title">${e.name}</div>
        <div class="list-sub">${Oc(e)}</div>
        ${e0(e)}
        ${e.agentId?l`<div class="muted cron-job-agent">Agent: ${e.agentId}</div>`:v}
      </div>
      <div class="list-meta">
        ${t0(e)}
      </div>
      <div class="cron-job-footer">
        <div class="chip-row cron-job-chips">
          <span class=${`chip ${e.enabled?"chip-ok":"chip-danger"}`}>
            ${e.enabled?"enabled":"disabled"}
          </span>
          <span class="chip">${e.sessionTarget}</span>
          <span class="chip">${e.wakeMode}</span>
        </div>
        <div class="row cron-job-actions">
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${i=>{i.stopPropagation(),t.onToggle(e,!e.enabled)}}
          >
            ${e.enabled?"Disable":"Enable"}
          </button>
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${i=>{i.stopPropagation(),t.onRun(e)}}
          >
            Run
          </button>
          <button
            class="btn"
            ?disabled=${t.busy}
            @click=${i=>{i.stopPropagation(),t.onLoadRuns(e.id)}}
          >
            History
          </button>
          <button
            class="btn danger"
            ?disabled=${t.busy}
            @click=${i=>{i.stopPropagation(),t.onRemove(e)}}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  `}function e0(e){if(e.payload.kind==="systemEvent")return l`<div class="cron-job-detail">
      <span class="cron-job-detail-label">System</span>
      <span class="muted cron-job-detail-value">${e.payload.text}</span>
    </div>`;const t=e.delivery,n=t?.mode==="webhook"?t.to?` (${t.to})`:"":t?.channel||t?.to?` (${t.channel??"last"}${t.to?` -> ${t.to}`:""})`:"";return l`
    <div class="cron-job-detail">
      <span class="cron-job-detail-label">Prompt</span>
      <span class="muted cron-job-detail-value">${e.payload.message}</span>
    </div>
    ${t?l`<div class="cron-job-detail">
            <span class="cron-job-detail-label">Delivery</span>
            <span class="muted cron-job-detail-value">${t.mode}${n}</span>
          </div>`:v}
  `}function pl(e){return typeof e!="number"||!Number.isFinite(e)?"n/a":J(e)}function t0(e){const t=e.state?.lastStatus??"n/a",n=t==="ok"?"cron-job-status-ok":t==="error"?"cron-job-status-error":t==="skipped"?"cron-job-status-skipped":"cron-job-status-na",s=e.state?.nextRunAtMs,i=e.state?.lastRunAtMs;return l`
    <div class="cron-job-state">
      <div class="cron-job-state-row">
        <span class="cron-job-state-key">Status</span>
        <span class=${`cron-job-status-pill ${n}`}>${t}</span>
      </div>
      <div class="cron-job-state-row">
        <span class="cron-job-state-key">Next</span>
        <span class="cron-job-state-value" title=${Vt(s)}>
          ${pl(s)}
        </span>
      </div>
      <div class="cron-job-state-row">
        <span class="cron-job-state-key">Last</span>
        <span class="cron-job-state-value" title=${Vt(i)}>
          ${pl(i)}
        </span>
      </div>
    </div>
  `}function n0(e,t){const n=typeof e.sessionKey=="string"&&e.sessionKey.trim().length>0?`${Xs("chat",t)}?session=${encodeURIComponent(e.sessionKey)}`:null;return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.status}</div>
        <div class="list-sub">${e.summary??""}</div>
      </div>
      <div class="list-meta">
        <div>${Vt(e.ts)}</div>
        <div class="muted">${e.durationMs??0}ms</div>
        ${n?l`<div><a class="session-link" href=${n}>Open run chat</a></div>`:v}
        ${e.error?l`<div class="muted">${e.error}</div>`:v}
      </div>
    </div>
  `}function s0(e){const n=(e.status&&typeof e.status=="object"?e.status.securityAudit:null)?.summary??null,s=n?.critical??0,i=n?.warn??0,a=n?.info??0,o=s>0?"danger":i>0?"warn":"success",r=s>0?`${s} critical`:i>0?`${i} warnings`:"No critical issues";return l`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Snapshots</div>
            <div class="card-sub">Status, health, and heartbeat data.</div>
          </div>
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
        </div>
        <div class="stack" style="margin-top: 12px;">
          <div>
            <div class="muted">Status</div>
            ${n?l`<div class="callout ${o}" style="margin-top: 8px;">
                  Security audit: ${r}${a>0?` · ${a} info`:""}. Run
                  <span class="mono">openclaw security audit --deep</span> for details.
                </div>`:v}
            <pre class="code-block">${JSON.stringify(e.status??{},null,2)}</pre>
          </div>
          <div>
            <div class="muted">Health</div>
            <pre class="code-block">${JSON.stringify(e.health??{},null,2)}</pre>
          </div>
          <div>
            <div class="muted">Last heartbeat</div>
            <pre class="code-block">${JSON.stringify(e.heartbeat??{},null,2)}</pre>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Manual RPC</div>
        <div class="card-sub">Send a raw gateway method with JSON params.</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>Method</span>
            <input
              .value=${e.callMethod}
              @input=${c=>e.onCallMethodChange(c.target.value)}
              placeholder="system-presence"
            />
          </label>
          <label class="field">
            <span>Params (JSON)</span>
            <textarea
              .value=${e.callParams}
              @input=${c=>e.onCallParamsChange(c.target.value)}
              rows="6"
            ></textarea>
          </label>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn primary" @click=${e.onCall}>Call</button>
        </div>
        ${e.callError?l`<div class="callout danger" style="margin-top: 12px;">
              ${e.callError}
            </div>`:v}
        ${e.callResult?l`<pre class="code-block" style="margin-top: 12px;">${e.callResult}</pre>`:v}
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Models</div>
      <div class="card-sub">Catalog from models.list.</div>
      <pre class="code-block" style="margin-top: 12px;">${JSON.stringify(e.models??[],null,2)}</pre>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Event Log</div>
      <div class="card-sub">Latest gateway events.</div>
      ${e.eventLog.length===0?l`
              <div class="muted" style="margin-top: 12px">No events yet.</div>
            `:l`
            <div class="list" style="margin-top: 12px;">
              ${e.eventLog.map(c=>l`
                  <div class="list-item">
                    <div class="list-main">
                      <div class="list-title">${c.event}</div>
                      <div class="list-sub">${new Date(c.ts).toLocaleTimeString()}</div>
                    </div>
                    <div class="list-meta">
                      <pre class="code-block">${Xh(c.payload)}</pre>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function i0(e){const t=Math.max(0,e),n=Math.floor(t/1e3);if(n<60)return`${n}s`;const s=Math.floor(n/60);return s<60?`${s}m`:`${Math.floor(s/60)}h`}function Rt(e,t){return t?l`<div class="exec-approval-meta-row"><span>${e}</span><span>${t}</span></div>`:v}function a0(e){const t=e.execApprovalQueue[0];if(!t)return v;const n=t.request,s=t.expiresAtMs-Date.now(),i=s>0?`expires in ${i0(s)}`:"expired",a=e.execApprovalQueue.length;return l`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Exec approval needed</div>
            <div class="exec-approval-sub">${i}</div>
          </div>
          ${a>1?l`<div class="exec-approval-queue">${a} pending</div>`:v}
        </div>
        <div class="exec-approval-command mono">${n.command}</div>
        <div class="exec-approval-meta">
          ${Rt("Host",n.host)}
          ${Rt("Agent",n.agentId)}
          ${Rt("Session",n.sessionKey)}
          ${Rt("CWD",n.cwd)}
          ${Rt("Resolved",n.resolvedPath)}
          ${Rt("Security",n.security)}
          ${Rt("Ask",n.ask)}
        </div>
        ${e.execApprovalError?l`<div class="exec-approval-error">${e.execApprovalError}</div>`:v}
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            ?disabled=${e.execApprovalBusy}
            @click=${()=>e.handleExecApprovalDecision("allow-once")}
          >
            Allow once
          </button>
          <button
            class="btn"
            ?disabled=${e.execApprovalBusy}
            @click=${()=>e.handleExecApprovalDecision("allow-always")}
          >
            Always allow
          </button>
          <button
            class="btn danger"
            ?disabled=${e.execApprovalBusy}
            @click=${()=>e.handleExecApprovalDecision("deny")}
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  `}function o0(e){const{pendingGatewayUrl:t}=e;return t?l`
    <div class="exec-approval-overlay" role="dialog" aria-modal="true" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Change Gateway URL</div>
            <div class="exec-approval-sub">This will reconnect to a different gateway server</div>
          </div>
        </div>
        <div class="exec-approval-command mono">${t}</div>
        <div class="callout danger" style="margin-top: 12px;">
          Only confirm if you trust this URL. Malicious URLs can compromise your system.
        </div>
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            @click=${()=>e.handleGatewayUrlConfirm()}
          >
            Confirm
          </button>
          <button
            class="btn"
            @click=${()=>e.handleGatewayUrlCancel()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  `:v}function r0(e){const t=e.goals.filter(i=>i.status!=="completed"),n=e.goals.filter(i=>i.status==="completed"),s=e.agentsList?.agents??[];return l`
    <div class="goals-view">
      <!-- North Star -->
      <div class="goals-northstar card">
        <div class="goals-northstar__header">
          <div class="stat-label">North Star</div>
        </div>
        <div class="goals-northstar__body">
          <input
            type="text"
            class="goals-northstar__input"
            placeholder="What is the overarching goal?"
            .value=${e.northStar}
            @change=${i=>{const a=i.target.value;e.onNorthStarChange(a,e.northStarProgress)}}
          />
          <div class="goals-northstar__progress">
            <label class="muted">Progress</label>
            <input
              type="range"
              min="0"
              max="100"
              .value=${String(e.northStarProgress)}
              @input=${i=>{const a=Number(i.target.value);e.onNorthStarChange(e.northStar,a)}}
            />
            <span class="muted">${e.northStarProgress}%</span>
          </div>
        </div>
      </div>

      <!-- Goal List -->
      <div class="goals-list">
        ${t.map(i=>fl(i,s,e))}
      </div>

      <!-- Create Goal Form -->
      <div class="goals-form card">
        <div class="card-title">New Goal</div>
        <form
          class="goals-form__fields"
          @submit=${i=>{i.preventDefault();const a=i.target,o=a.querySelector("[name=title]").value.trim();if(!o)return;const r=a.querySelector("[name=description]").value.trim(),c=a.querySelector("[name=agentId]").value||null,u=a.querySelector("[name=dueDate]").value||null;e.onAddGoal({title:o,description:r,agentId:c,dueDate:u,status:"active",progress:0}),a.reset()}}
        >
          <div class="field">
            <span>Title</span>
            <input type="text" name="title" required placeholder="Goal title" />
          </div>
          <div class="field">
            <span>Description</span>
            <textarea name="description" rows="2" placeholder="What should be achieved?"></textarea>
          </div>
          <div class="goals-form__row">
            <div class="field">
              <span>Agent</span>
              <select name="agentId">
                <option value="">Unassigned</option>
                ${s.map(i=>l`<option value=${i.id}>${i.id}</option>`)}
              </select>
            </div>
            <div class="field">
              <span>Due Date</span>
              <input type="date" name="dueDate" />
            </div>
          </div>
          <button type="submit" class="btn primary">Add Goal</button>
        </form>
      </div>

      <!-- Completed Goals -->
      ${n.length>0?l`
          <details class="goals-completed">
            <summary class="goals-completed__toggle">
              <span class="stat-label">Completed (${n.length})</span>
            </summary>
            <div class="goals-list">
              ${n.map(i=>fl(i,s,e))}
            </div>
          </details>
        `:v}
    </div>
  `}function fl(e,t,n){return l`
    <div class="goals-card card ${e.status==="completed"?"goals-card--completed":""}">
      <div class="goals-card__header">
        <div class="goals-card__title">${e.title}</div>
        <div class="goals-card__actions">
          <select
            class="goals-card__status"
            .value=${e.status}
            @change=${s=>{n.onUpdateGoal(e.id,{status:s.target.value})}}
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
          <button
            class="btn btn--sm danger"
            @click=${()=>n.onRemoveGoal(e.id)}
          >Remove</button>
        </div>
      </div>
      ${e.description?l`<div class="goals-card__desc muted">${e.description}</div>`:v}
      <div class="goals-card__meta">
        <div class="field">
          <span>Agent</span>
          <select
            .value=${e.agentId??""}
            @change=${s=>{n.onUpdateGoal(e.id,{agentId:s.target.value||null})}}
          >
            <option value="">Unassigned</option>
            ${t.map(s=>l`<option value=${s.id}>${s.id}</option>`)}
          </select>
        </div>
        <div class="field">
          <span>Due Date</span>
          <input
            type="date"
            .value=${e.dueDate??""}
            @change=${s=>{n.onUpdateGoal(e.id,{dueDate:s.target.value||null})}}
          />
        </div>
        <div class="field">
          <span>Progress: ${e.progress}%</span>
          <input
            type="range"
            min="0"
            max="100"
            .value=${String(e.progress)}
            @input=${s=>{n.onUpdateGoal(e.id,{progress:Number(s.target.value)})}}
          />
        </div>
      </div>
      <div class="goals-card__footer">
        <button
          class="btn btn--sm"
          @click=${()=>n.onNavigate("cron")}
        >Add automation</button>
      </div>
    </div>
  `}function l0(e){return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Connected Instances</div>
          <div class="card-sub">Presence beacons from the gateway and clients.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>
      ${e.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:v}
      ${e.statusMessage?l`<div class="callout" style="margin-top: 12px;">
            ${e.statusMessage}
          </div>`:v}
      <div class="list" style="margin-top: 16px;">
        ${e.entries.length===0?l`
                <div class="muted">No instances reported yet.</div>
              `:e.entries.map(t=>c0(t))}
      </div>
    </section>
  `}function c0(e){const t=e.lastInputSeconds!=null?`${e.lastInputSeconds}s ago`:"n/a",n=e.mode??"unknown",s=Array.isArray(e.roles)?e.roles.filter(Boolean):[],i=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],a=i.length>0?i.length>3?`${i.length} scopes`:`scopes: ${i.join(", ")}`:null;return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.host??"unknown host"}</div>
        <div class="list-sub">${Yh(e)}</div>
        <div class="chip-row">
          <span class="chip">${n}</span>
          ${s.map(o=>l`<span class="chip">${o}</span>`)}
          ${a?l`<span class="chip">${a}</span>`:v}
          ${e.platform?l`<span class="chip">${e.platform}</span>`:v}
          ${e.deviceFamily?l`<span class="chip">${e.deviceFamily}</span>`:v}
          ${e.modelIdentifier?l`<span class="chip">${e.modelIdentifier}</span>`:v}
          ${e.version?l`<span class="chip">${e.version}</span>`:v}
        </div>
      </div>
      <div class="list-meta">
        <div>${Zh(e)}</div>
        <div class="muted">Last input ${t}</div>
        <div class="muted">Reason ${e.reason??""}</div>
      </div>
    </div>
  `}const hl=["trace","debug","info","warn","error","fatal"];function d0(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleTimeString()}function u0(e,t){return t?[e.message,e.subsystem,e.raw].filter(Boolean).join(" ").toLowerCase().includes(t):!0}function g0(e){const t=e.filterText.trim().toLowerCase(),n=hl.some(a=>!e.levelFilters[a]),s=e.entries.filter(a=>a.level&&!e.levelFilters[a.level]?!1:u0(a,t)),i=t||n?"filtered":"visible";return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Logs</div>
          <div class="card-sub">Gateway file logs (JSONL).</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Loading…":"Refresh"}
          </button>
          <button
            class="btn"
            ?disabled=${s.length===0}
            @click=${()=>e.onExport(s.map(a=>a.raw),i)}
          >
            Export ${i}
          </button>
        </div>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="min-width: 220px;">
          <span>Filter</span>
          <input
            .value=${e.filterText}
            @input=${a=>e.onFilterTextChange(a.target.value)}
            placeholder="Search logs"
          />
        </label>
        <label class="field checkbox">
          <span>Auto-follow</span>
          <input
            type="checkbox"
            .checked=${e.autoFollow}
            @change=${a=>e.onToggleAutoFollow(a.target.checked)}
          />
        </label>
      </div>

      <div class="chip-row" style="margin-top: 12px;">
        ${hl.map(a=>l`
            <label class="chip log-chip ${a}">
              <input
                type="checkbox"
                .checked=${e.levelFilters[a]}
                @change=${o=>e.onLevelToggle(a,o.target.checked)}
              />
              <span>${a}</span>
            </label>
          `)}
      </div>

      ${e.file?l`<div class="muted" style="margin-top: 10px;">File: ${e.file}</div>`:v}
      ${e.truncated?l`
              <div class="callout" style="margin-top: 10px">Log output truncated; showing latest chunk.</div>
            `:v}
      ${e.error?l`<div class="callout danger" style="margin-top: 10px;">${e.error}</div>`:v}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${e.onScroll}>
        ${s.length===0?l`
                <div class="muted" style="padding: 12px">No log entries.</div>
              `:s.map(a=>l`
                <div class="log-row">
                  <div class="log-time mono">${d0(a.time)}</div>
                  <div class="log-level ${a.level??""}">${a.level??""}</div>
                  <div class="log-subsystem mono">${a.subsystem??""}</div>
                  <div class="log-message mono">${a.message??a.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}const Ft={outer:"#3b82f6",thalamus:"#f59e0b",inner:"#a855f7",body:"#10b981"},Nn=[{id:"text-input",label:"Text Input",zone:"outer",x:.08,y:.45},{id:"perception",label:"Perception",zone:"outer",x:.22,y:.25},{id:"memory",label:"Memory",zone:"outer",x:.22,y:.65},{id:"attention",label:"Attention",zone:"thalamus",x:.42,y:.3},{id:"binder",label:"Binder",zone:"thalamus",x:.42,y:.6},{id:"arbiter",label:"Arbiter",zone:"thalamus",x:.55,y:.2},{id:"metacognition",label:"Meta",zone:"thalamus",x:.55,y:.75},{id:"emotion-inference",label:"Emotion",zone:"inner",x:.7,y:.25},{id:"imagination",label:"Imagine",zone:"inner",x:.7,y:.55},{id:"default-mode",label:"Default",zone:"inner",x:.7,y:.8},{id:"expression",label:"Expression",zone:"body",x:.88,y:.35},{id:"voice",label:"Voice",zone:"body",x:.88,y:.65}],p0=[["text-input","perception"],["perception","attention"],["perception","memory"],["memory","binder"],["attention","binder"],["binder","arbiter"],["arbiter","emotion-inference"],["arbiter","imagination"],["metacognition","arbiter"],["metacognition","attention"],["emotion-inference","expression"],["imagination","expression"],["default-mode","imagination"],["expression","voice"]],f0={wandering:"rgba(255,255,255,0.5)",emotional:"#f59e0b",memory:"#60a5fa",curiosity:"#a78bfa",reflection:"#34d399",urge:"#fb923c",metacognitive:"#06b6d4"};function h0(e,t,n){const i=200+(e?.selfState?.valence??0)*30,a=new Map((t??[]).map(u=>[u.id,u])),o=new Set((n??[]).filter(u=>u.active).map(u=>`${u.from}->${u.to}`)),r=800,c=500;return l`
    <svg viewBox="0 0 ${r} ${c}" class="mind-brain-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="brain-bg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="hsl(${i}, 40%, 8%)" />
          <stop offset="100%" stop-color="#030308" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="${r}" height="${c}" fill="url(#brain-bg)" rx="12" />

      <!-- Zone labels -->
      <text x="60" y="30" fill="${Ft.outer}" font-size="10" font-family="var(--mono)" opacity="0.5">OUTER</text>
      <text x="310" y="30" fill="${Ft.thalamus}" font-size="10" font-family="var(--mono)" opacity="0.5">THALAMUS</text>
      <text x="530" y="30" fill="${Ft.inner}" font-size="10" font-family="var(--mono)" opacity="0.5">INNER</text>
      <text x="670" y="30" fill="${Ft.body}" font-size="10" font-family="var(--mono)" opacity="0.5">BODY</text>

      <!-- Signal lines -->
      ${p0.map(([u,p])=>{const g=Nn.find(_=>_.id===u),d=Nn.find(_=>_.id===p);if(!g||!d)return"";const h=g.x*r,f=g.y*c,m=d.x*r,w=d.y*c,S=o.has(`${u}->${p}`),A=S?.8:.08,k=S?"none":"2,4",C=S?Ft[d.zone]:"rgba(255,255,255,0.3)";return l`
          <line x1="${h}" y1="${f}" x2="${m}" y2="${w}"
                stroke="${C}" stroke-width="${S?1.5:.5}"
                stroke-dasharray="${k}" opacity="${A}" />
          ${S?l`
            <circle r="2.5" fill="${C}" opacity="0.9">
              <animateMotion dur="0.6s" repeatCount="indefinite"
                path="M${h},${f} L${m},${w}" />
            </circle>
          `:""}
        `})}

      <!-- Engine nodes -->
      ${Nn.map(u=>{const p=u.x*r,g=u.y*c,d=Ft[u.zone],f=a.get(u.id)?.active??!1,m=f?1:.4;return l`
          <g filter="${f?"url(#glow)":""}">
            <!-- Outer glow -->
            <circle cx="${p}" cy="${g}" r="18"
                    fill="none" stroke="${d}" stroke-width="1"
                    opacity="${m*.4}" />
            <!-- Core -->
            <circle cx="${p}" cy="${g}" r="14"
                    fill="${d}" fill-opacity="0.12"
                    stroke="${d}" stroke-width="${f?1.5:.5}"
                    opacity="${m}" />
            ${f?l`
              <circle cx="${p}" cy="${g}" r="4" fill="${d}" opacity="0.8">
                <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
            `:""}
            <!-- Label -->
            <text x="${p}" y="${g+28}" text-anchor="middle"
                  fill="rgba(255,255,255,${m*.7})"
                  font-size="8" font-family="var(--mono)">
              ${u.label}
            </text>
          </g>
        `})}
    </svg>
  `}function v0(e,t=!0){const n=e??{valence:0,arousal:.3,curiosity:.5,social:.3},s=n.valence??0,i=n.arousal??.3,a=n.curiosity??.5,o=n.social??.3,r=240+s*30,c=t?5:.5,u=1.5+a*1.5,p=(i+a)*3,g=68+(1-i)*2,d=g+s*6,h=o>.5?(o-.5)*.4:0,f=b0(s,i,a);return l`
    <svg viewBox="0 0 100 100" class="mind-face-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="face-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="hsl(${r}, 50%, 15%)" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
      </defs>

      <!-- Face outline -->
      <circle cx="50" cy="45" r="32" fill="url(#face-glow)"
              stroke="hsl(${r}, 40%, 40%)" stroke-width="0.8" opacity="0.8" />

      <!-- Cheek glow -->
      ${h>0?l`
        <circle cx="35" cy="55" r="6" fill="hsl(350, 60%, 50%)" opacity="${h}" />
        <circle cx="65" cy="55" r="6" fill="hsl(350, 60%, 50%)" opacity="${h}" />
      `:""}

      <!-- Left eye -->
      <ellipse cx="40" cy="${48-p*.3}" rx="4" ry="${c}"
               fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="0.8" />
      ${t?l`
        <circle cx="40" cy="${48-p*.3}" r="${u}" fill="rgba(255,255,255,0.85)" />
      `:""}

      <!-- Right eye -->
      <ellipse cx="60" cy="${48-p*.3}" rx="4" ry="${c}"
               fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="0.8" />
      ${t?l`
        <circle cx="60" cy="${48-p*.3}" r="${u}" fill="rgba(255,255,255,0.85)" />
      `:""}

      <!-- Eyebrows -->
      <line x1="35" y1="${41-p}" x2="45" y2="${40-p*1.2}"
            stroke="rgba(255,255,255,0.4)" stroke-width="0.6" stroke-linecap="round" />
      <line x1="55" y1="${40-p*1.2}" x2="65" y2="${41-p}"
            stroke="rgba(255,255,255,0.4)" stroke-width="0.6" stroke-linecap="round" />

      <!-- Mouth -->
      <path d="M 40 ${g} Q 50 ${d} 60 ${g}"
            fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="0.8" stroke-linecap="round" />

      <!-- Mood label -->
      <text x="50" y="90" text-anchor="middle" fill="rgba(255,255,255,0.4)"
            font-size="6" font-family="var(--mono)">
        ${f}
      </text>
    </svg>
  `}function m0(e){const n=(e??{valence:0}).valence??0,s=240+n*30,i=21+n*3;return l`
    <svg viewBox="0 0 30 30" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="13" r="10" fill="none" stroke="hsl(${s}, 40%, 40%)" stroke-width="0.6" opacity="0.6" />
      <circle cx="12" cy="11" r="1.2" fill="rgba(255,255,255,0.7)" />
      <circle cx="18" cy="11" r="1.2" fill="rgba(255,255,255,0.7)" />
      <path d="M 11 ${18} Q 15 ${i} 19 ${18}" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.6" />
    </svg>
  `}function b0(e,t,n){const s=[];return n>.6&&s.push("Curious"),e>.3?s.push("Positive"):e<-.3&&s.push("Troubled"),t>.6?s.push("Alert"):t<.2&&s.push("Calm"),s.length===0&&s.push("Neutral"),s.join(" & ")}function y0(e){if(!e||e.length===0)return l`<div class="muted" style="font-size:12px; font-style:italic;">Inner life stream quiet...</div>`;const t=Date.now();return l`
    <div class="mind-stream">
      ${e.map(n=>{const s=t-n.timestamp,i=Math.max(.3,1-s/3e4),a=f0[n.flavor]??"rgba(255,255,255,0.5)",o=n.flavor==="wandering";return l`
          <div class="mind-stream__entry" style="opacity:${i}">
            <span class="mind-stream__dot" style="background:${a}"></span>
            <span class="mind-stream__text" style="color:${a}; ${o?"font-style:italic;":""}">
              ${n.text}
            </span>
          </div>
        `})}
    </div>
  `}const x0=[{key:"valence",label:"Valence",color:"#f59e0b",min:-1,max:1},{key:"arousal",label:"Arousal",color:"#ef4444",min:0,max:1},{key:"confidence",label:"Confidence",color:"#3b82f6",min:0,max:1},{key:"energy",label:"Energy",color:"#10b981",min:0,max:1},{key:"social",label:"Social",color:"#ec4899",min:0,max:1},{key:"curiosity",label:"Curiosity",color:"#8b5cf6",min:0,max:1}];function $0(e){return e?l`
    <div class="mind-dimensions">
      ${x0.map(t=>{const n=e[t.key],s=t.max-t.min,i=Math.max(0,Math.min(100,(n-t.min)/s*100)),a=.6+Math.abs(n)*.4,o=t.key==="valence";return l`
          <div class="mind-dimension">
            <div class="mind-dimension__header">
              <span class="mind-dimension__label">${t.label}</span>
              <span class="mind-dimension__value">${n.toFixed(2)}</span>
            </div>
            <div class="mind-dimension__track">
              ${o?l`<div class="mind-dimension__center"></div>`:""}
              <div class="mind-dimension__fill"
                   style="width:${i}%; background:${t.color}; opacity:${a}">
              </div>
            </div>
          </div>
        `})}
    </div>
  `:l`<div class="muted" style="font-size:12px;">No state data</div>`}function w0(e){if(!e||e.length===0)return l`<div class="muted" style="font-size:12px;">No recent signals</div>`;const t=Date.now(),n=e.slice(0,20);return l`
    <div class="mind-signals">
      ${n.map(s=>{const i=t-s.timestamp,a=Math.max(.3,1-i/2e4),o=Nn.find(u=>u.id===s.to),r=Nn.find(u=>u.id===s.from),c=o?Ft[o.zone]:"rgba(255,255,255,0.4)";return l`
          <div class="mind-signal" style="opacity:${a}">
            <span class="mind-signal__dot" style="background:${c}"></span>
            <span class="mind-signal__from">${r?.label??s.from}</span>
            <span class="mind-signal__arrow">\u2192</span>
            <span class="mind-signal__to">${o?.label??s.to}</span>
            <span class="mind-signal__type">${s.type}</span>
          </div>
        `})}
    </div>
  `}function k0(e){const t=Date.now()-new Date(e).getTime(),n=Math.floor(t/1e3);if(n<60)return"just now";const s=Math.floor(n/60);if(s<60)return`${s}m ago`;const i=Math.floor(s/60);return i<24?`${i}h ago`:`${Math.floor(i/24)}d ago`}function S0(e){const{cognition:t,loading:n,blinkOpen:s=!0}=e;if(!t&&n)return l`
      <div class="muted" style="padding: 24px">Loading cognitive state...</div>
    `;if(!t)return l`
      <section class="mind-section" style="max-width: 600px;">
        <div class="mind-section__title">Cognitive State</div>
        <div style="color: rgba(255,255,255,0.5); font-size: 13px; margin-bottom: 12px;">
          Connect to Wybe OS to see the inner world.
        </div>
        <div class="muted" style="font-size: 12px;">
          Not connected. Configure the Wybe OS URL in settings.
        </div>
        <button class="btn" style="margin-top: 12px;" @click=${e.onRefresh}>Retry</button>
      </section>
    `;const i=t.selfState,a=t.engineStatuses??[],o=(t.recentSignals??[]).map(u=>({...u,active:u.active??!0})),r=t.innerLifeStream,c=(t.recentSignals??[]).map(u=>({id:u.id,from:u.from,to:u.to,type:u.type,timestamp:u.timestamp}));return l`
    <div class="mind-dashboard">
      <!-- Brain Map -->
      <div class="mind-section mind-brain-map">
        <div class="mind-section__title">Neural Map</div>
        ${h0(t,a,o)}
      </div>

      <!-- Sidebar: Face + State + Signals -->
      <div class="mind-sidebar">
        <div class="mind-section">
          <div class="mind-section__title">Presence</div>
          <div class="mind-face">
            ${v0(i,s)}
          </div>
          <div style="text-align: center; margin-top: 4px;">
            <span style="font-size: 13px; color: rgba(255,255,255,0.7); text-transform: capitalize;">
              ${t.stateDescription}
            </span>
          </div>
        </div>

        <div class="mind-section">
          <div class="mind-section__title">Dimensions</div>
          ${$0(i)}
        </div>

        <div class="mind-section">
          <div class="mind-section__title">Signals</div>
          ${w0(c)}
        </div>
      </div>

      <!-- Inner Life Stream -->
      <div class="mind-section mind-stream-container">
        <div class="mind-section__title">Inner Life</div>
        ${y0(r)}
      </div>

      <!-- Stats row -->
      <div style="display: flex; gap: 16px; grid-column: 1 / -1;">
        <div class="mind-section" style="flex: 1;">
          <div class="mind-section__title">Memories</div>
          <div style="font-size: 24px; font-weight: 600; color: rgba(255,255,255,0.9);">
            ${t.memoryCount}
          </div>
          <div class="muted" style="font-size: 11px; margin-top: 2px;">stored experiences</div>
        </div>
        <div class="mind-section" style="flex: 1;">
          <div class="mind-section__title">Last Interaction</div>
          <div style="font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.9);">
            ${t.lastInteraction?k0(t.lastInteraction):"Never"}
          </div>
          <div class="muted" style="font-size: 11px; margin-top: 2px;">most recent exchange</div>
        </div>
        ${t.tick!=null?l`
          <div class="mind-section" style="flex: 1;">
            <div class="mind-section__title">Tick</div>
            <div style="font-size: 24px; font-weight: 600; color: rgba(255,255,255,0.9);">
              ${t.tick}
            </div>
            <div class="muted" style="font-size: 11px; margin-top: 2px;">cognitive cycle</div>
          </div>
        `:v}
        <div class="mind-section" style="flex: 0 0 auto;">
          <button class="btn" @click=${e.onRefresh} style="margin-top: 8px;">Refresh</button>
        </div>
      </div>
    </div>
  `}const yt="__defaults__",vl=[{value:"deny",label:"Deny"},{value:"allowlist",label:"Allowlist"},{value:"full",label:"Full"}],A0=[{value:"off",label:"Off"},{value:"on-miss",label:"On miss"},{value:"always",label:"Always"}];function ml(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function C0(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function T0(e){const t=e?.defaults??{};return{security:ml(t.security),ask:C0(t.ask),askFallback:ml(t.askFallback??"deny"),autoAllowSkills:!!(t.autoAllowSkills??!1)}}function _0(e){const t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],s=[];return n.forEach(i=>{if(!i||typeof i!="object")return;const a=i,o=typeof a.id=="string"?a.id.trim():"";if(!o)return;const r=typeof a.name=="string"?a.name.trim():void 0,c=a.default===!0;s.push({id:o,name:r||void 0,isDefault:c})}),s}function E0(e,t){const n=_0(e),s=Object.keys(t?.agents??{}),i=new Map;n.forEach(o=>i.set(o.id,o)),s.forEach(o=>{i.has(o)||i.set(o,{id:o})});const a=Array.from(i.values());return a.length===0&&a.push({id:"main",isDefault:!0}),a.sort((o,r)=>{if(o.isDefault&&!r.isDefault)return-1;if(!o.isDefault&&r.isDefault)return 1;const c=o.name?.trim()?o.name:o.id,u=r.name?.trim()?r.name:r.id;return c.localeCompare(u)}),a}function M0(e,t){return e===yt?yt:e&&t.some(n=>n.id===e)?e:yt}function L0(e){const t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,n=!!t,s=T0(t),i=E0(e.configForm,t),a=O0(e.nodes),o=e.execApprovalsTarget;let r=o==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;o==="node"&&r&&!a.some(g=>g.id===r)&&(r=null);const c=M0(e.execApprovalsSelectedAgent,i),u=c!==yt?(t?.agents??{})[c]??null:null,p=Array.isArray(u?.allowlist)?u.allowlist??[]:[];return{ready:n,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:s,selectedScope:c,selectedAgent:u,agents:i,allowlist:p,target:o,targetNodeId:r,targetNodes:a,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function I0(e){const t=e.ready,n=e.target!=="node"||!!e.targetNodeId;return l`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">Exec approvals</div>
          <div class="card-sub">
            Allowlist and approval policy for <span class="mono">exec host=gateway/node</span>.
          </div>
        </div>
        <button
          class="btn"
          ?disabled=${e.disabled||!e.dirty||!n}
          @click=${e.onSave}
        >
          ${e.saving?"Saving…":"Save"}
        </button>
      </div>

      ${R0(e)}

      ${t?l`
            ${P0(e)}
            ${D0(e)}
            ${e.selectedScope===yt?v:N0(e)}
          `:l`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?"Loading…":"Load approvals"}
            </button>
          </div>`}
    </section>
  `}function R0(e){const t=e.targetNodes.length>0,n=e.targetNodeId??"";return l`
    <div class="list" style="margin-top: 12px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Target</div>
          <div class="list-sub">
            Gateway edits local approvals; node edits the selected node.
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Host</span>
            <select
              ?disabled=${e.disabled}
              @change=${s=>{if(s.target.value==="node"){const o=e.targetNodes[0]?.id??null;e.onSelectTarget("node",n||o)}else e.onSelectTarget("gateway",null)}}
            >
              <option value="gateway" ?selected=${e.target==="gateway"}>Gateway</option>
              <option value="node" ?selected=${e.target==="node"}>Node</option>
            </select>
          </label>
          ${e.target==="node"?l`
                <label class="field">
                  <span>Node</span>
                  <select
                    ?disabled=${e.disabled||!t}
                    @change=${s=>{const a=s.target.value.trim();e.onSelectTarget("node",a||null)}}
                  >
                    <option value="" ?selected=${n===""}>Select node</option>
                    ${e.targetNodes.map(s=>l`<option
                          value=${s.id}
                          ?selected=${n===s.id}
                        >
                          ${s.label}
                        </option>`)}
                  </select>
                </label>
              `:v}
        </div>
      </div>
      ${e.target==="node"&&!t?l`
              <div class="muted">No nodes advertise exec approvals yet.</div>
            `:v}
    </div>
  `}function P0(e){return l`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===yt?"active":""}"
          @click=${()=>e.onSelectScope(yt)}
        >
          Defaults
        </button>
        ${e.agents.map(t=>{const n=t.name?.trim()?`${t.name} (${t.id})`:t.id;return l`
            <button
              class="btn btn--sm ${e.selectedScope===t.id?"active":""}"
              @click=${()=>e.onSelectScope(t.id)}
            >
              ${n}
            </button>
          `})}
      </div>
    </div>
  `}function D0(e){const t=e.selectedScope===yt,n=e.defaults,s=e.selectedAgent??{},i=t?["defaults"]:["agents",e.selectedScope],a=typeof s.security=="string"?s.security:void 0,o=typeof s.ask=="string"?s.ask:void 0,r=typeof s.askFallback=="string"?s.askFallback:void 0,c=t?n.security:a??"__default__",u=t?n.ask:o??"__default__",p=t?n.askFallback:r??"__default__",g=typeof s.autoAllowSkills=="boolean"?s.autoAllowSkills:void 0,d=g??n.autoAllowSkills,h=g==null;return l`
    <div class="list" style="margin-top: 16px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Security</div>
          <div class="list-sub">
            ${t?"Default security mode.":`Default: ${n.security}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${e.disabled}
              @change=${f=>{const w=f.target.value;!t&&w==="__default__"?e.onRemove([...i,"security"]):e.onPatch([...i,"security"],w)}}
            >
              ${t?v:l`<option value="__default__" ?selected=${c==="__default__"}>
                    Use default (${n.security})
                  </option>`}
              ${vl.map(f=>l`<option
                    value=${f.value}
                    ?selected=${c===f.value}
                  >
                    ${f.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Ask</div>
          <div class="list-sub">
            ${t?"Default prompt policy.":`Default: ${n.ask}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${e.disabled}
              @change=${f=>{const w=f.target.value;!t&&w==="__default__"?e.onRemove([...i,"ask"]):e.onPatch([...i,"ask"],w)}}
            >
              ${t?v:l`<option value="__default__" ?selected=${u==="__default__"}>
                    Use default (${n.ask})
                  </option>`}
              ${A0.map(f=>l`<option
                    value=${f.value}
                    ?selected=${u===f.value}
                  >
                    ${f.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Ask fallback</div>
          <div class="list-sub">
            ${t?"Applied when the UI prompt is unavailable.":`Default: ${n.askFallback}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Fallback</span>
            <select
              ?disabled=${e.disabled}
              @change=${f=>{const w=f.target.value;!t&&w==="__default__"?e.onRemove([...i,"askFallback"]):e.onPatch([...i,"askFallback"],w)}}
            >
              ${t?v:l`<option value="__default__" ?selected=${p==="__default__"}>
                    Use default (${n.askFallback})
                  </option>`}
              ${vl.map(f=>l`<option
                    value=${f.value}
                    ?selected=${p===f.value}
                  >
                    ${f.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Auto-allow skill CLIs</div>
          <div class="list-sub">
            ${t?"Allow skill executables listed by the Gateway.":h?`Using default (${n.autoAllowSkills?"on":"off"}).`:`Override (${d?"on":"off"}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${d}
              @change=${f=>{const m=f.target;e.onPatch([...i,"autoAllowSkills"],m.checked)}}
            />
          </label>
          ${!t&&!h?l`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...i,"autoAllowSkills"])}
              >
                Use default
              </button>`:v}
        </div>
      </div>
    </div>
  `}function N0(e){const t=["agents",e.selectedScope,"allowlist"],n=e.allowlist;return l`
    <div class="row" style="margin-top: 18px; justify-content: space-between;">
      <div>
        <div class="card-title">Allowlist</div>
        <div class="card-sub">Case-insensitive glob patterns.</div>
      </div>
      <button
        class="btn btn--sm"
        ?disabled=${e.disabled}
        @click=${()=>{const s=[...n,{pattern:""}];e.onPatch(t,s)}}
      >
        Add pattern
      </button>
    </div>
    <div class="list" style="margin-top: 12px;">
      ${n.length===0?l`
              <div class="muted">No allowlist entries yet.</div>
            `:n.map((s,i)=>F0(e,s,i))}
    </div>
  `}function F0(e,t,n){const s=t.lastUsedAt?J(t.lastUsedAt):"never",i=t.lastUsedCommand?ji(t.lastUsedCommand,120):null,a=t.lastResolvedPath?ji(t.lastResolvedPath,120):null;return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t.pattern?.trim()?t.pattern:"New pattern"}</div>
        <div class="list-sub">Last used: ${s}</div>
        ${i?l`<div class="list-sub mono">${i}</div>`:v}
        ${a?l`<div class="list-sub mono">${a}</div>`:v}
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Pattern</span>
          <input
            type="text"
            .value=${t.pattern??""}
            ?disabled=${e.disabled}
            @input=${o=>{const r=o.target;e.onPatch(["agents",e.selectedScope,"allowlist",n,"pattern"],r.value)}}
          />
        </label>
        <button
          class="btn btn--sm danger"
          ?disabled=${e.disabled}
          @click=${()=>{if(e.allowlist.length<=1){e.onRemove(["agents",e.selectedScope,"allowlist"]);return}e.onRemove(["agents",e.selectedScope,"allowlist",n])}}
        >
          Remove
        </button>
      </div>
    </div>
  `}function O0(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(r=>String(r)==="system.execApprovals.get"||String(r)==="system.execApprovals.set"))continue;const a=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!a)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():a;t.push({id:a,label:o===a?a:`${o} · ${a}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function B0(e){const t=K0(e),n=L0(e);return l`
    ${I0(n)}
    ${W0(t)}
    ${z0(e)}
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Nodes</div>
          <div class="card-sub">Paired devices and live links.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>
      <div class="list" style="margin-top: 16px;">
        ${e.nodes.length===0?l`
                <div class="muted">No nodes found.</div>
              `:e.nodes.map(s=>Q0(s))}
      </div>
    </section>
  `}function z0(e){const t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],s=Array.isArray(t.paired)?t.paired:[];return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Devices</div>
          <div class="card-sub">Pairing requests + role tokens.</div>
        </div>
        <button class="btn" ?disabled=${e.devicesLoading} @click=${e.onDevicesRefresh}>
          ${e.devicesLoading?"Loading…":"Refresh"}
        </button>
      </div>
      ${e.devicesError?l`<div class="callout danger" style="margin-top: 12px;">${e.devicesError}</div>`:v}
      <div class="list" style="margin-top: 16px;">
        ${n.length>0?l`
              <div class="muted" style="margin-bottom: 8px;">Pending</div>
              ${n.map(i=>U0(i,e))}
            `:v}
        ${s.length>0?l`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${s.map(i=>H0(i,e))}
            `:v}
        ${n.length===0&&s.length===0?l`
                <div class="muted">No paired devices.</div>
              `:v}
      </div>
    </section>
  `}function U0(e,t){const n=e.displayName?.trim()||e.deviceId,s=typeof e.ts=="number"?J(e.ts):"n/a",i=e.role?.trim()?`role: ${e.role}`:"role: -",a=e.isRepair?" · repair":"",o=e.remoteIp?` · ${e.remoteIp}`:"";return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${o}</div>
        <div class="muted" style="margin-top: 6px;">
          ${i} · requested ${s}${a}
        </div>
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn--sm primary" @click=${()=>t.onDeviceApprove(e.requestId)}>
            Approve
          </button>
          <button class="btn btn--sm" @click=${()=>t.onDeviceReject(e.requestId)}>
            Reject
          </button>
        </div>
      </div>
    </div>
  `}function H0(e,t){const n=e.displayName?.trim()||e.deviceId,s=e.remoteIp?` · ${e.remoteIp}`:"",i=`roles: ${Hi(e.roles)}`,a=`scopes: ${Hi(e.scopes)}`,o=Array.isArray(e.tokens)?e.tokens:[];return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${s}</div>
        <div class="muted" style="margin-top: 6px;">${i} · ${a}</div>
        ${o.length===0?l`
                <div class="muted" style="margin-top: 6px">Tokens: none</div>
              `:l`
              <div class="muted" style="margin-top: 10px;">Tokens</div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                ${o.map(r=>j0(e.deviceId,r,t))}
              </div>
            `}
      </div>
    </div>
  `}function j0(e,t,n){const s=t.revokedAtMs?"revoked":"active",i=`scopes: ${Hi(t.scopes)}`,a=J(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return l`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${t.role} · ${s} · ${i} · ${a}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
        >
          Rotate
        </button>
        ${t.revokedAtMs?v:l`
              <button
                class="btn btn--sm danger"
                @click=${()=>n.onDeviceRevoke(e,t.role)}
              >
                Revoke
              </button>
            `}
      </div>
    </div>
  `}function K0(e){const t=e.configForm,n=q0(e.nodes),{defaultBinding:s,agents:i}=G0(t),a=!!t,o=e.configSaving||e.configFormMode==="raw";return{ready:a,disabled:o,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:s,agents:i,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function W0(e){const t=e.nodes.length>0,n=e.defaultBinding??"";return l`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">Exec node binding</div>
          <div class="card-sub">
            Pin agents to a specific node when using <span class="mono">exec host=node</span>.
          </div>
        </div>
        <button
          class="btn"
          ?disabled=${e.disabled||!e.configDirty}
          @click=${e.onSave}
        >
          ${e.configSaving?"Saving…":"Save"}
        </button>
      </div>

      ${e.formMode==="raw"?l`
              <div class="callout warn" style="margin-top: 12px">
                Switch the Config tab to <strong>Form</strong> mode to edit bindings here.
              </div>
            `:v}

      ${e.ready?l`
            <div class="list" style="margin-top: 16px;">
              <div class="list-item">
                <div class="list-main">
                  <div class="list-title">Default binding</div>
                  <div class="list-sub">Used when agents do not override a node binding.</div>
                </div>
                <div class="list-meta">
                  <label class="field">
                    <span>Node</span>
                    <select
                      ?disabled=${e.disabled||!t}
                      @change=${s=>{const a=s.target.value.trim();e.onBindDefault(a||null)}}
                    >
                      <option value="" ?selected=${n===""}>Any node</option>
                      ${e.nodes.map(s=>l`<option
                            value=${s.id}
                            ?selected=${n===s.id}
                          >
                            ${s.label}
                          </option>`)}
                    </select>
                  </label>
                  ${t?v:l`
                          <div class="muted">No nodes with system.run available.</div>
                        `}
                </div>
              </div>

              ${e.agents.length===0?l`
                      <div class="muted">No agents found.</div>
                    `:e.agents.map(s=>V0(s,e))}
            </div>
          `:l`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"Loading…":"Load config"}
            </button>
          </div>`}
    </section>
  `}function V0(e,t){const n=e.binding??"__default__",s=e.name?.trim()?`${e.name} (${e.id})`:e.id,i=t.nodes.length>0;return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${s}</div>
        <div class="list-sub">
          ${e.isDefault?"default agent":"agent"} ·
          ${n==="__default__"?`uses default (${t.defaultBinding??"any"})`:`override: ${e.binding}`}
        </div>
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Binding</span>
          <select
            ?disabled=${t.disabled||!i}
            @change=${a=>{const r=a.target.value.trim();t.onBindAgent(e.index,r==="__default__"?null:r)}}
          >
            <option value="__default__" ?selected=${n==="__default__"}>
              Use default
            </option>
            ${t.nodes.map(a=>l`<option
                  value=${a.id}
                  ?selected=${n===a.id}
                >
                  ${a.label}
                </option>`)}
          </select>
        </label>
      </div>
    </div>
  `}function q0(e){const t=[];for(const n of e){if(!(Array.isArray(n.commands)?n.commands:[]).some(r=>String(r)==="system.run"))continue;const a=typeof n.nodeId=="string"?n.nodeId.trim():"";if(!a)continue;const o=typeof n.displayName=="string"&&n.displayName.trim()?n.displayName.trim():a;t.push({id:a,label:o===a?a:`${o} · ${a}`})}return t.sort((n,s)=>n.label.localeCompare(s.label)),t}function G0(e){const t={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[t]};const s=(e.tools??{}).exec??{},i=typeof s.node=="string"&&s.node.trim()?s.node.trim():null,a=e.agents??{},o=Array.isArray(a.list)?a.list:[];if(o.length===0)return{defaultBinding:i,agents:[t]};const r=[];return o.forEach((c,u)=>{if(!c||typeof c!="object")return;const p=c,g=typeof p.id=="string"?p.id.trim():"";if(!g)return;const d=typeof p.name=="string"?p.name.trim():void 0,h=p.default===!0,m=(p.tools??{}).exec??{},w=typeof m.node=="string"&&m.node.trim()?m.node.trim():null;r.push({id:g,name:d||void 0,index:u,isDefault:h,binding:w})}),r.length===0&&r.push(t),{defaultBinding:i,agents:r}}function Q0(e){const t=!!e.connected,n=!!e.paired,s=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),i=Array.isArray(e.caps)?e.caps:[],a=Array.isArray(e.commands)?e.commands:[];return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${s}</div>
        <div class="list-sub">
          ${typeof e.nodeId=="string"?e.nodeId:""}
          ${typeof e.remoteIp=="string"?` · ${e.remoteIp}`:""}
          ${typeof e.version=="string"?` · ${e.version}`:""}
        </div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${n?"paired":"unpaired"}</span>
          <span class="chip ${t?"chip-ok":"chip-warn"}">
            ${t?"connected":"offline"}
          </span>
          ${i.slice(0,12).map(o=>l`<span class="chip">${String(o)}</span>`)}
          ${a.slice(0,8).map(o=>l`<span class="chip">${String(o)}</span>`)}
        </div>
      </div>
    </div>
  `}function Y0(e){const t=e.hello?.snapshot,n=t?.uptimeMs?Pa(t.uptimeMs):R("common.na"),s=t?.policy?.tickIntervalMs?`${t.policy.tickIntervalMs}ms`:R("common.na"),a=t?.authMode==="trusted-proxy",o=(()=>{if(e.connected||!e.lastError)return null;const u=e.lastError.toLowerCase();if(!(u.includes("unauthorized")||u.includes("connect failed")))return null;const g=!!e.settings.token.trim(),d=!!e.password.trim();return!g&&!d?l`
        <div class="muted" style="margin-top: 8px">
          ${R("overview.auth.required")}
          <div style="margin-top: 6px">
            <span class="mono">openclaw dashboard --no-open</span> → tokenized URL<br />
            <span class="mono">openclaw doctor --generate-gateway-token</span> → set token
          </div>
          <div style="margin-top: 6px">
            <a
              class="session-link"
              href="https://docs.openclaw.ai/web/dashboard"
              target="_blank"
              rel="noreferrer"
              title="Control UI auth docs (opens in new tab)"
              >Docs: Control UI auth</a
            >
          </div>
        </div>
      `:l`
      <div class="muted" style="margin-top: 8px">
        ${R("overview.auth.failed",{command:"openclaw dashboard --no-open"})}
        <div style="margin-top: 6px">
          <a
            class="session-link"
            href="https://docs.openclaw.ai/web/dashboard"
            target="_blank"
            rel="noreferrer"
            title="Control UI auth docs (opens in new tab)"
            >Docs: Control UI auth</a
          >
        </div>
      </div>
    `})(),r=(()=>{if(e.connected||!e.lastError||(typeof window<"u"?window.isSecureContext:!0))return null;const p=e.lastError.toLowerCase();return!p.includes("secure context")&&!p.includes("device identity required")?null:l`
      <div class="muted" style="margin-top: 8px">
        ${R("overview.insecure.hint",{url:"http://127.0.0.1:18789"})}
        <div style="margin-top: 6px">
          ${R("overview.insecure.stayHttp",{config:"gateway.controlUi.allowInsecureAuth: true"})}
        </div>
        <div style="margin-top: 6px">
          <a
            class="session-link"
            href="https://docs.openclaw.ai/gateway/tailscale"
            target="_blank"
            rel="noreferrer"
            title="Tailscale Serve docs (opens in new tab)"
            >Docs: Tailscale Serve</a
          >
          <span class="muted"> · </span>
          <a
            class="session-link"
            href="https://docs.openclaw.ai/web/control-ui#insecure-http"
            target="_blank"
            rel="noreferrer"
            title="Insecure HTTP docs (opens in new tab)"
            >Docs: Insecure HTTP</a
          >
        </div>
      </div>
    `})(),c=Un.getLocale();return l`
    ${e.cognitionState?l`
      <section class="mind-section" style="margin-bottom: 16px;">
        <div class="cognitive-summary">
          <div class="cognitive-summary__face">
            ${m0(e.cognitionState.selfState)}
          </div>
          <div class="cognitive-summary__info">
            <div class="cognitive-summary__desc">${e.cognitionState.stateDescription}</div>
            <div class="cognitive-summary__meta">
              ${e.cognitionState.memoryCount} memories
              ${e.cognitionState.lastInteraction?l` · Last active ${J(new Date(e.cognitionState.lastInteraction).getTime())}`:""}
            </div>
          </div>
        </div>
      </section>
    `:""}
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="card-title">${R("overview.access.title")}</div>
        <div class="card-sub">${R("overview.access.subtitle")}</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>${R("overview.access.wsUrl")}</span>
            <input
              .value=${e.settings.gatewayUrl}
              @input=${u=>{const p=u.target.value;e.onSettingsChange({...e.settings,gatewayUrl:p})}}
              placeholder="ws://100.x.y.z:18789"
            />
          </label>
          ${a?"":l`
                <label class="field">
                  <span>${R("overview.access.token")}</span>
                  <input
                    .value=${e.settings.token}
                    @input=${u=>{const p=u.target.value;e.onSettingsChange({...e.settings,token:p})}}
                    placeholder="OPENCLAW_GATEWAY_TOKEN"
                  />
                </label>
                <label class="field">
                  <span>${R("overview.access.password")}</span>
                  <input
                    type="password"
                    .value=${e.password}
                    @input=${u=>{const p=u.target.value;e.onPasswordChange(p)}}
                    placeholder="system or shared password"
                  />
                </label>
              `}
          <label class="field">
            <span>${R("overview.access.sessionKey")}</span>
            <input
              .value=${e.settings.sessionKey}
              @input=${u=>{const p=u.target.value;e.onSessionKeyChange(p)}}
            />
          </label>
          <label class="field">
            <span>${R("overview.access.language")}</span>
            <select
              .value=${c}
              @change=${u=>{const p=u.target.value;Un.setLocale(p),e.onSettingsChange({...e.settings,locale:p})}}
            >
              <option value="en">${R("languages.en")}</option>
              <option value="zh-CN">${R("languages.zhCN")}</option>
              <option value="zh-TW">${R("languages.zhTW")}</option>
              <option value="pt-BR">${R("languages.ptBR")}</option>
            </select>
          </label>
        </div>
        <div class="row" style="margin-top: 14px;">
          <button class="btn" @click=${()=>e.onConnect()}>${R("common.connect")}</button>
          <button class="btn" @click=${()=>e.onRefresh()}>${R("common.refresh")}</button>
          <span class="muted">${R(a?"overview.access.trustedProxy":"overview.access.connectHint")}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">${R("overview.snapshot.title")}</div>
        <div class="card-sub">${R("overview.snapshot.subtitle")}</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">${R("overview.snapshot.status")}</div>
            <div class="stat-value ${e.connected?"ok":"warn"}">
              ${e.connected?R("common.ok"):R("common.offline")}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">${R("overview.snapshot.uptime")}</div>
            <div class="stat-value">${n}</div>
          </div>
          <div class="stat">
            <div class="stat-label">${R("overview.snapshot.tickInterval")}</div>
            <div class="stat-value">${s}</div>
          </div>
          <div class="stat">
            <div class="stat-label">${R("overview.snapshot.lastChannelsRefresh")}</div>
            <div class="stat-value">
              ${e.lastChannelsRefresh?J(e.lastChannelsRefresh):R("common.na")}
            </div>
          </div>
        </div>
        ${e.lastError?l`<div class="callout danger" style="margin-top: 14px;">
              <div>${e.lastError}</div>
              ${o??""}
              ${r??""}
            </div>`:l`
                <div class="callout" style="margin-top: 14px">
                  ${R("overview.snapshot.channelsHint")}
                </div>
              `}
      </div>
    </section>

    <section class="grid grid-cols-3" style="margin-top: 18px;">
      <div class="card stat-card">
        <div class="stat-label">${R("overview.stats.instances")}</div>
        <div class="stat-value">${e.presenceCount}</div>
        <div class="muted">${R("overview.stats.instancesHint")}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">${R("overview.stats.sessions")}</div>
        <div class="stat-value">${e.sessionsCount??R("common.na")}</div>
        <div class="muted">${R("overview.stats.sessionsHint")}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">${R("overview.stats.cron")}</div>
        <div class="stat-value">
          ${e.cronEnabled==null?R("common.na"):e.cronEnabled?R("common.enabled"):R("common.disabled")}
        </div>
        <div class="muted">${R("overview.stats.cronNext",{time:Xa(e.cronNext)})}</div>
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">${R("overview.notes.title")}</div>
      <div class="card-sub">${R("overview.notes.subtitle")}</div>
      <div class="note-grid" style="margin-top: 14px;">
        <div>
          <div class="note-title">${R("overview.notes.tailscaleTitle")}</div>
          <div class="muted">
            ${R("overview.notes.tailscaleText")}
          </div>
        </div>
        <div>
          <div class="note-title">${R("overview.notes.sessionTitle")}</div>
          <div class="muted">${R("overview.notes.sessionText")}</div>
        </div>
        <div>
          <div class="note-title">${R("overview.notes.cronTitle")}</div>
          <div class="muted">${R("overview.notes.cronText")}</div>
        </div>
      </div>
    </section>
  `}const Z0=["","off","minimal","low","medium","high","xhigh"],J0=["","off","on"],X0=[{value:"",label:"inherit"},{value:"off",label:"off (explicit)"},{value:"on",label:"on"},{value:"full",label:"full"}],ex=["","off","on","stream"];function tx(e){if(!e)return"";const t=e.trim().toLowerCase();return t==="z.ai"||t==="z-ai"?"zai":t}function kd(e){return tx(e)==="zai"}function nx(e){return kd(e)?J0:Z0}function bl(e,t){return t?e.includes(t)?[...e]:[...e,t]:[...e]}function sx(e,t){return t?e.some(n=>n.value===t)?[...e]:[...e,{value:t,label:`${t} (custom)`}]:[...e]}function ix(e,t){return!t||!e||e==="off"?e:"on"}function ax(e,t){return e?t&&e==="on"?"low":e:null}function ox(e){const t=e.result?.sessions??[];return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Sessions</div>
          <div class="card-sub">Active session keys and per-session overrides.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field">
          <span>Active within (minutes)</span>
          <input
            .value=${e.activeMinutes}
            @input=${n=>e.onFiltersChange({activeMinutes:n.target.value,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field">
          <span>Limit</span>
          <input
            .value=${e.limit}
            @input=${n=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:n.target.value,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field checkbox">
          <span>Include global</span>
          <input
            type="checkbox"
            .checked=${e.includeGlobal}
            @change=${n=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:n.target.checked,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field checkbox">
          <span>Include unknown</span>
          <input
            type="checkbox"
            .checked=${e.includeUnknown}
            @change=${n=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:n.target.checked})}
          />
        </label>
      </div>

      ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:v}

      <div class="muted" style="margin-top: 12px;">
        ${e.result?`Store: ${e.result.path}`:""}
      </div>

      <div class="table" style="margin-top: 16px;">
        <div class="table-head">
          <div>Key</div>
          <div>Label</div>
          <div>Kind</div>
          <div>Updated</div>
          <div>Tokens</div>
          <div>Thinking</div>
          <div>Verbose</div>
          <div>Reasoning</div>
          <div>Actions</div>
        </div>
        ${t.length===0?l`
                <div class="muted">No sessions found.</div>
              `:t.map(n=>rx(n,e.basePath,e.onPatch,e.onDelete,e.loading))}
      </div>
    </section>
  `}function rx(e,t,n,s,i){const a=e.updatedAt?J(e.updatedAt):"n/a",o=e.thinkingLevel??"",r=kd(e.modelProvider),c=ix(o,r),u=bl(nx(e.modelProvider),c),p=e.verboseLevel??"",g=sx(X0,p),d=e.reasoningLevel??"",h=bl(ex,d),f=typeof e.displayName=="string"&&e.displayName.trim().length>0?e.displayName.trim():null,m=typeof e.label=="string"?e.label.trim():"",w=!!(f&&f!==e.key&&f!==m),S=e.kind!=="global",A=S?`${Xs("chat",t)}?session=${encodeURIComponent(e.key)}`:null;return l`
    <div class="table-row">
      <div class="mono session-key-cell">
        ${S?l`<a href=${A} class="session-link">${e.key}</a>`:e.key}
        ${w?l`<span class="muted session-key-display-name">${f}</span>`:v}
      </div>
      <div>
        <input
          .value=${e.label??""}
          ?disabled=${i}
          placeholder="(optional)"
          @change=${k=>{const C=k.target.value.trim();n(e.key,{label:C||null})}}
        />
      </div>
      <div>${e.kind}</div>
      <div>${a}</div>
      <div>${Jh(e)}</div>
      <div>
        <select
          ?disabled=${i}
          @change=${k=>{const C=k.target.value;n(e.key,{thinkingLevel:ax(C,r)})}}
        >
          ${u.map(k=>l`<option value=${k} ?selected=${c===k}>
                ${k||"inherit"}
              </option>`)}
        </select>
      </div>
      <div>
        <select
          ?disabled=${i}
          @change=${k=>{const C=k.target.value;n(e.key,{verboseLevel:C||null})}}
        >
          ${g.map(k=>l`<option value=${k.value} ?selected=${p===k.value}>
                ${k.label}
              </option>`)}
        </select>
      </div>
      <div>
        <select
          ?disabled=${i}
          @change=${k=>{const C=k.target.value;n(e.key,{reasoningLevel:C||null})}}
        >
          ${h.map(k=>l`<option value=${k} ?selected=${d===k}>
                ${k||"inherit"}
              </option>`)}
        </select>
      </div>
      <div>
        <button class="btn danger" ?disabled=${i} @click=${()=>s(e.key)}>
          Delete
        </button>
      </div>
    </div>
  `}function lx(e){const t=e.report?.skills??[],n=e.filter.trim().toLowerCase(),s=n?t.filter(a=>[a.name,a.description,a.source].join(" ").toLowerCase().includes(n)):t,i=Uc(s);return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Skills</div>
          <div class="card-sub">Bundled, managed, and workspace skills.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="flex: 1;">
          <span>Filter</span>
          <input
            .value=${e.filter}
            @input=${a=>e.onFilterChange(a.target.value)}
            placeholder="Search skills"
          />
        </label>
        <div class="muted">${s.length} shown</div>
      </div>

      ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:v}

      ${s.length===0?l`
              <div class="muted" style="margin-top: 16px">No skills found.</div>
            `:l`
            <div class="agent-skills-groups" style="margin-top: 16px;">
              ${i.map(a=>{const o=a.id==="workspace"||a.id==="built-in";return l`
                  <details class="agent-skills-group" ?open=${!o}>
                    <summary class="agent-skills-header">
                      <span>${a.label}</span>
                      <span class="muted">${a.skills.length}</span>
                    </summary>
                    <div class="list skills-grid">
                      ${a.skills.map(r=>cx(r,e))}
                    </div>
                  </details>
                `})}
            </div>
          `}
    </section>
  `}function cx(e,t){const n=t.busyKey===e.skillKey,s=t.edits[e.skillKey]??"",i=t.messages[e.skillKey]??null,a=e.install.length>0&&e.missing.bins.length>0,o=!!(e.bundled&&e.source!=="openclaw-bundled"),r=Hc(e),c=jc(e);return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${ji(e.description,140)}</div>
        ${Kc({skill:e,showBundledBadge:o})}
        ${r.length>0?l`
              <div class="muted" style="margin-top: 6px;">
                Missing: ${r.join(", ")}
              </div>
            `:v}
        ${c.length>0?l`
              <div class="muted" style="margin-top: 6px;">
                Reason: ${c.join(", ")}
              </div>
            `:v}
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; flex-wrap: wrap;">
          <button
            class="btn"
            ?disabled=${n}
            @click=${()=>t.onToggle(e.skillKey,e.disabled)}
          >
            ${e.disabled?"Enable":"Disable"}
          </button>
          ${a?l`<button
                class="btn"
                ?disabled=${n}
                @click=${()=>t.onInstall(e.skillKey,e.name,e.install[0].id)}
              >
                ${n?"Installing…":e.install[0].label}
              </button>`:v}
        </div>
        ${i?l`<div
              class="muted"
              style="margin-top: 8px; color: ${i.kind==="error"?"var(--danger-color, #d14343)":"var(--success-color, #0a7f5a)"};"
            >
              ${i.message}
            </div>`:v}
        ${e.primaryEnv?l`
              <div class="field" style="margin-top: 10px;">
                <span>API key</span>
                <input
                  type="password"
                  .value=${s}
                  @input=${u=>t.onEdit(e.skillKey,u.target.value)}
                />
              </div>
              <button
                class="btn primary"
                style="margin-top: 8px;"
                ?disabled=${n}
                @click=${()=>t.onSaveKey(e.skillKey)}
              >
                Save key
              </button>
            `:v}
      </div>
    </div>
  `}let we=null,Pt=null,Fn=null,zs=null,Us=[],Hs=!1,ot=null,ho=null,vo=null,mo=null,bo=null,yo=null,xo=null,$o=null;function Sd(){we&&(we.readyState===WebSocket.OPEN||we.readyState===WebSocket.CONNECTING)||(we=new WebSocket("ws://localhost:8765"),we.binaryType="arraybuffer",we.onopen=()=>{console.log("[voice-ws] connected"),ot!=null&&(clearTimeout(ot),ot=null)},we.onmessage=e=>{typeof e.data=="string"&&ux(JSON.parse(e.data))},we.onclose=()=>{console.log("[voice-ws] disconnected"),we=null,dx()},we.onerror=()=>we?.close())}function dx(){ot==null&&(ot=window.setTimeout(()=>{ot=null,Sd()},3e3))}function ga(e){we?.readyState===WebSocket.OPEN&&we.send(JSON.stringify(e))}function ux(e){switch(e.type){case"state":ho?.(e.state);break;case"openclaw_status":vo?.(e.connected);break;case"vad":$o?.(e.speaking);break;case"transcription":{const t=(e.language||"").toUpperCase(),n=e.audio_duration,s=e.latency_ms,i=`${t} · ${n}s · ${Math.round(s)}ms`;mo?.(e.text,i);break}case"response_start":bo?.();break;case"response_delta":yo?.(e.text);break;case"response_end":xo?.(e.text);break;case"tts_sentence":fx(e.text);break;case"error":console.error("[voice-server]",e.message);break}}async function gx(){Pt||(Pt=new AudioContext({sampleRate:16e3}),await Pt.audioWorklet.addModule("/audio-processor.js")),Pt.state==="suspended"&&await Pt.resume(),zs=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0}});const e=Pt.createMediaStreamSource(zs);Fn=new AudioWorkletNode(Pt,"audio-capture"),Fn.port.onmessage=t=>{we?.readyState===WebSocket.OPEN&&we.send(t.data)},e.connect(Fn)}function px(){Fn?.disconnect(),Fn=null,zs?.getTracks().forEach(e=>e.stop()),zs=null}function fx(e){Us.push(e),Hs||pa()}function pa(){if(Us.length===0){Hs=!1,ga({type:"tts_done"});return}Hs=!0;const e=Us.shift(),t=new SpeechSynthesisUtterance(e);t.rate=1,t.onend=()=>pa(),t.onerror=()=>pa(),speechSynthesis.speak(t)}function hx(e){ho=e.onStateChange,vo=e.onOpenclawStatus,mo=e.onUserMessage,bo=e.onAssistantStart,yo=e.onAssistantDelta,xo=e.onAssistantEnd,$o=e.onVad,Sd()}function vx(){ho=null,vo=null,mo=null,bo=null,yo=null,xo=null,$o=null,ot!=null&&(clearTimeout(ot),ot=null)}async function mx(e){return e?(speechSynthesis.cancel(),Us=[],Hs=!1,px(),ga({type:"stop"}),!1):(await gx(),ga({type:"start"}),!0)}function bx(e,t){const n=`voice-msg voice-msg--${e.role}${e.streaming?" voice-msg--streaming":""}`;return l`
    <div class=${n} data-index=${t}>
      <div class="voice-msg__text">${e.streaming?l`${e.text}<span class="voice-cursor"></span>`:e.text}</div>
      ${e.meta?l`<div class="voice-msg__meta">${e.meta}</div>`:v}
    </div>
  `}function yx(e){const t=e.state.toLowerCase();return l`
    <section class="card voice-view">
      <div class="voice-header">
        <div class="voice-status">
          <span class="voice-badge voice-badge--${t}">${e.state}</span>
          <span class="voice-badge voice-badge--openclaw ${e.openclawConnected?"voice-badge--ok":"voice-badge--off"}">
            OpenClaw ${e.openclawConnected?"Connected":"Offline"}
          </span>
        </div>
      </div>

      <div class="voice-messages" id="voice-messages">
        ${e.messages.length===0?l`<div class="voice-empty">Click the microphone to start a voice conversation.</div>`:e.messages.map((n,s)=>bx(n,s))}
      </div>

      <div class="voice-controls">
        <button
          class="voice-mic ${e.active?"voice-mic--active":""}"
          @click=${e.onToggleMic}
          title=${e.active?"Stop listening":"Start listening"}
          aria-label=${e.active?"Stop listening":"Start listening"}
        >
          <svg viewBox="0 0 24 24" class="voice-mic__icon">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </button>
      </div>
    </section>
  `}const xx=/^data:/i,$x=/^https?:\/\//i;function wx(e){const t=e.agentsList?.agents??[],s=Ol(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",a=t.find(r=>r.id===s)?.identity,o=a?.avatarUrl??a?.avatar;if(o)return xx.test(o)||$x.test(o)?o:a?.avatarUrl}function kx(e){const t=e.presenceEntries.length,n=e.sessionsResult?.count??null,s=e.cronStatus?.nextWakeAtMs??null,i=e.connected?null:R("chat.disconnected"),a=e.tab==="chat",o=a&&(e.settings.chatFocusMode||e.onboarding),r=e.onboarding?!1:e.settings.chatShowThinking,c=wx(e),u=e.chatAvatarUrl??c??null,p=e.configForm??e.configSnapshot?.config,g=e.agentsSelectedId??e.agentsList?.defaultId??e.agentsList?.agents?.[0]?.id??null;return l`
    <div class="shell ${a?"shell--chat":""} ${o?"shell--chat-focus":""} ${e.settings.navCollapsed?"shell--nav-collapsed":""} ${e.onboarding?"shell--onboarding":""}">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${()=>e.applySettings({...e.settings,navCollapsed:!e.settings.navCollapsed})}
            title="${e.settings.navCollapsed?R("nav.expand"):R("nav.collapse")}"
            aria-label="${e.settings.navCollapsed?R("nav.expand"):R("nav.collapse")}"
          >
            <span class="nav-collapse-toggle__icon">${oe.menu}</span>
          </button>
          <div class="brand">
            <div class="brand-text">
              <div class="brand-title">WYBE OS</div>
              <div class="brand-sub">Cognitive Control</div>
            </div>
          </div>
        </div>
        <div class="topbar-status">
          <div class="pill">
            <span class="statusDot ${e.connected?"ok":""}"></span>
            <span>${R("common.health")}</span>
            <span class="mono">${e.connected?R("common.ok"):R("common.offline")}</span>
          </div>
          <div class="pill">
            <span class="statusDot ${e.connected?"ok":""}"></span>
            <span>${e.assistantName}</span>
            <span class="mono">${e.connected?"active":"offline"}</span>
          </div>
          ${Nh(e)}
        </div>
      </header>
      <aside class="nav ${e.settings.navCollapsed?"nav--collapsed":""}">
        ${""}
        <div class="nav-group">
          <div class="nav-group__items">
            ${cc.tabs.map(d=>Sr(e,d))}
          </div>
        </div>

        ${""}
        <div class="nav-group">
          <button
            class="nav-label"
            @click=${()=>e.toggleAdvanced()}
            aria-expanded=${e.showAdvanced}
            title=${e.showAdvanced?R("nav.hideAdvanced"):R("nav.showAdvanced")}
          >
            <span class="nav-label__text">${e.showAdvanced?R("nav.hideAdvanced"):R("nav.showAdvanced")}</span>
            <span class="nav-label__chevron">${e.showAdvanced?"−":"+"}</span>
          </button>
        </div>

        ${e.showAdvanced?sp.map(d=>{const h=e.settings.navGroupsCollapsed[d.label]??!1,f=d.tabs.some(m=>m===e.tab);return l`
                  <div class="nav-group ${h&&!f?"nav-group--collapsed":""}">
                    <button
                      class="nav-label"
                      @click=${()=>{const m={...e.settings.navGroupsCollapsed};m[d.label]=!h,e.applySettings({...e.settings,navGroupsCollapsed:m})}}
                      aria-expanded=${!h}
                    >
                      <span class="nav-label__text">${R(`nav.${d.label}`)}</span>
                      <span class="nav-label__chevron">${h?"+":"−"}</span>
                    </button>
                    <div class="nav-group__items">
                      ${d.tabs.map(m=>Sr(e,m))}
                    </div>
                  </div>
                `}):v}

        <div class="nav-group nav-group--links">
          <div class="nav-label nav-label--static">
            <span class="nav-label__text">${R("common.resources")}</span>
          </div>
          <div class="nav-group__items">
            <a
              class="nav-item nav-item--external"
              href="https://docs.openclaw.ai"
              target="_blank"
              rel="noreferrer"
              title="${R("common.docs")} (opens in new tab)"
            >
              <span class="nav-item__icon" aria-hidden="true">${oe.book}</span>
              <span class="nav-item__text">${R("common.docs")}</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${a?"content--chat":""}">
        ${e.updateAvailable?l`<div class="update-banner callout danger" role="alert">
              <strong>Update available:</strong> v${e.updateAvailable.latestVersion}
              (running v${e.updateAvailable.currentVersion}).
              <button
                class="btn btn--sm update-banner__btn"
                ?disabled=${e.updateRunning||!e.connected}
                @click=${()=>Qo(e)}
              >${e.updateRunning?"Updating…":"Update now"}</button>
            </div>`:v}
        <section class="content-header">
          <div>
            ${e.tab==="usage"?v:l`<div class="page-title">${Gi(e.tab)}</div>`}
            ${e.tab==="usage"?v:l`<div class="page-sub">${lp(e.tab)}</div>`}
          </div>
          <div class="page-meta">
            ${e.lastError?l`<div class="pill danger">${e.lastError}</div>`:v}
            ${a?Eh(e):v}
          </div>
        </section>

        ${e.tab==="goals"?r0({northStar:e.missionNorthStar,northStarProgress:e.missionNorthStarProgress,goals:e.missionGoals,goalsLoading:e.missionGoalsLoading,agentsList:e.agentsList,onNorthStarChange:(d,h)=>Hh(e,d,h),onAddGoal:d=>jh(e,d),onUpdateGoal:(d,h)=>Kh(e,d,h),onRemoveGoal:d=>Wh(e,d),onNavigate:d=>e.setTab(d)}):v}

        ${e.tab==="activity"?Qh({eventLog:e.eventLog,activityFilter:e.activityFilter,activityAgentFilter:e.activityAgentFilter,assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,onFilterChange:d=>e.activityFilter=d,onAgentFilterChange:d=>e.activityAgentFilter=d}):v}

        ${e.tab==="overview"?Y0({connected:e.connected,hello:e.hello,settings:e.settings,password:e.password,lastError:e.lastError,presenceCount:t,sessionsCount:n,cronEnabled:e.cronStatus?.enabled??null,cronNext:s,cognitionState:e.cognitionState,lastChannelsRefresh:e.channelsLastSuccess,onSettingsChange:d=>e.applySettings(d),onPasswordChange:d=>e.password=d,onSessionKeyChange:d=>{e.sessionKey=d,e.chatMessage="",e.resetToolStream(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d}),e.loadAssistantIdentity()},onConnect:()=>e.connect(),onRefresh:()=>e.loadOverview()}):v}

        ${e.tab==="channels"?dm({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:d=>_e(e,d),onWhatsAppStart:d=>e.handleWhatsAppStart(d),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(d,h)=>Me(e,d,h),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(d,h)=>e.handleNostrProfileEdit(d,h),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(d,h)=>e.handleNostrProfileFieldChange(d,h),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):v}

        ${e.tab==="instances"?l0({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>Ha(e)}):v}

        ${e.tab==="sessions"?ox({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,onFiltersChange:d=>{e.sessionsFilterActive=d.activeMinutes,e.sessionsFilterLimit=d.limit,e.sessionsIncludeGlobal=d.includeGlobal,e.sessionsIncludeUnknown=d.includeUnknown},onRefresh:()=>Yt(e),onPatch:(d,h)=>Yg(e,d,h),onDelete:d=>Jg(e,d)}):v}

        ${$h(e)}

        ${e.tab==="cron"?Zy({basePath:e.basePath,loading:e.cronLoading,status:e.cronStatus,jobs:e.cronJobs,error:e.cronError,busy:e.cronBusy,form:e.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(d=>d.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,onFormChange:d=>e.cronForm=jl({...e.cronForm,...d}),onRefresh:()=>e.loadCron(),onAdd:()=>cg(e),onToggle:(d,h)=>dg(e,d,h),onRun:d=>ug(e,d),onRemove:d=>gg(e,d),onLoadRuns:d=>Kl(e,d)}):v}

        ${e.tab==="agents"?Iv({loading:e.agentsLoading,error:e.agentsError,agentsList:e.agentsList,selectedAgentId:g,activePanel:e.agentsPanel,configForm:p,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,channelsLoading:e.channelsLoading,channelsError:e.channelsError,channelsSnapshot:e.channelsSnapshot,channelsLastSuccess:e.channelsLastSuccess,cronLoading:e.cronLoading,cronStatus:e.cronStatus,cronJobs:e.cronJobs,cronError:e.cronError,agentFilesLoading:e.agentFilesLoading,agentFilesError:e.agentFilesError,agentFilesList:e.agentFilesList,agentFileActive:e.agentFileActive,agentFileContents:e.agentFileContents,agentFileDrafts:e.agentFileDrafts,agentFileSaving:e.agentFileSaving,agentIdentityLoading:e.agentIdentityLoading,agentIdentityError:e.agentIdentityError,agentIdentityById:e.agentIdentityById,agentSkillsLoading:e.agentSkillsLoading,agentSkillsReport:e.agentSkillsReport,agentSkillsError:e.agentSkillsError,agentSkillsAgentId:e.agentSkillsAgentId,skillsFilter:e.skillsFilter,onRefresh:async()=>{await Ia(e);const d=e.agentsList?.agents?.map(h=>h.id)??[];d.length>0&&Ul(e,d)},onSelectAgent:d=>{e.agentsSelectedId!==d&&(e.agentsSelectedId=d,e.agentFilesList=null,e.agentFilesError=null,e.agentFilesLoading=!1,e.agentFileActive=null,e.agentFileContents={},e.agentFileDrafts={},e.agentSkillsReport=null,e.agentSkillsError=null,e.agentSkillsAgentId=null,zl(e,d),e.agentsPanel==="files"&&Li(e,d),e.agentsPanel==="skills"&&xs(e,d))},onSelectPanel:d=>{e.agentsPanel=d,d==="files"&&g&&e.agentFilesList?.agentId!==g&&(e.agentFilesList=null,e.agentFilesError=null,e.agentFileActive=null,e.agentFileContents={},e.agentFileDrafts={},Li(e,g)),d==="skills"&&g&&xs(e,g),d==="channels"&&_e(e,!1),d==="cron"&&e.loadCron()},onLoadFiles:d=>Li(e,d),onSelectFile:d=>{e.agentFileActive=d,g&&Fh(e,g,d)},onFileDraftChange:(d,h)=>{e.agentFileDrafts={...e.agentFileDrafts,[d]:h}},onFileReset:d=>{const h=e.agentFileContents[d]??"";e.agentFileDrafts={...e.agentFileDrafts,[d]:h}},onFileSave:d=>{if(!g)return;const h=e.agentFileDrafts[d]??e.agentFileContents[d]??"";Oh(e,g,d,h)},onToolsProfileChange:(d,h,f)=>{if(!p)return;const m=p.agents?.list;if(!Array.isArray(m))return;const w=m.findIndex(A=>A&&typeof A=="object"&&"id"in A&&A.id===d);if(w<0)return;const S=["agents","list",w,"tools"];h?Me(e,[...S,"profile"],h):tt(e,[...S,"profile"]),f&&tt(e,[...S,"allow"])},onToolsOverridesChange:(d,h,f)=>{if(!p)return;const m=p.agents?.list;if(!Array.isArray(m))return;const w=m.findIndex(A=>A&&typeof A=="object"&&"id"in A&&A.id===d);if(w<0)return;const S=["agents","list",w,"tools"];h.length>0?Me(e,[...S,"alsoAllow"],h):tt(e,[...S,"alsoAllow"]),f.length>0?Me(e,[...S,"deny"],f):tt(e,[...S,"deny"])},onConfigReload:()=>ze(e),onConfigSave:()=>ys(e),onChannelsRefresh:()=>_e(e,!1),onCronRefresh:()=>e.loadCron(),onSkillsFilterChange:d=>e.skillsFilter=d,onSkillsRefresh:()=>{g&&xs(e,g)},onAgentSkillToggle:(d,h,f)=>{if(!p)return;const m=p.agents?.list;if(!Array.isArray(m))return;const w=m.findIndex(M=>M&&typeof M=="object"&&"id"in M&&M.id===d);if(w<0)return;const S=m[w],A=h.trim();if(!A)return;const k=e.agentSkillsReport?.skills?.map(M=>M.name).filter(Boolean)??[],_=(Array.isArray(S.skills)?S.skills.map(M=>String(M).trim()).filter(Boolean):void 0)??k,T=new Set(_);f?T.add(A):T.delete(A),Me(e,["agents","list",w,"skills"],[...T])},onAgentSkillsClear:d=>{if(!p)return;const h=p.agents?.list;if(!Array.isArray(h))return;const f=h.findIndex(m=>m&&typeof m=="object"&&"id"in m&&m.id===d);f<0||tt(e,["agents","list",f,"skills"])},onAgentSkillsDisableAll:d=>{if(!p)return;const h=p.agents?.list;if(!Array.isArray(h))return;const f=h.findIndex(m=>m&&typeof m=="object"&&"id"in m&&m.id===d);f<0||Me(e,["agents","list",f,"skills"],[])},onModelChange:(d,h)=>{if(!p)return;const f=p.agents?.list;if(!Array.isArray(f))return;const m=f.findIndex(k=>k&&typeof k=="object"&&"id"in k&&k.id===d);if(m<0)return;const w=["agents","list",m,"model"];if(!h){tt(e,w);return}const A=f[m]?.model;if(A&&typeof A=="object"&&!Array.isArray(A)){const k=A.fallbacks,C={primary:h,...Array.isArray(k)?{fallbacks:k}:{}};Me(e,w,C)}else Me(e,w,h)},onModelFallbacksChange:(d,h)=>{if(!p)return;const f=p.agents?.list;if(!Array.isArray(f))return;const m=f.findIndex(M=>M&&typeof M=="object"&&"id"in M&&M.id===d);if(m<0)return;const w=["agents","list",m,"model"],S=f[m],A=h.map(M=>M.trim()).filter(Boolean),k=S.model,_=(()=>{if(typeof k=="string")return k.trim()||null;if(k&&typeof k=="object"&&!Array.isArray(k)){const M=k.primary;if(typeof M=="string")return M.trim()||null}return null})();if(A.length===0){_?Me(e,w,_):tt(e,w);return}Me(e,w,_?{primary:_,fallbacks:A}:{fallbacks:A})}}):v}

        ${e.tab==="skills"?lx({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,onFilterChange:d=>e.skillsFilter=d,onRefresh:()=>Zn(e,{clearMessages:!0}),onToggle:(d,h)=>ep(e,d,h),onEdit:(d,h)=>Xg(e,d,h),onSaveKey:d=>tp(e,d),onInstall:(d,h,f)=>np(e,d,h,f)}):v}

        ${e.tab==="nodes"?B0({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>Qs(e),onDevicesRefresh:()=>St(e),onDeviceApprove:d=>zg(e,d),onDeviceReject:d=>Ug(e,d),onDeviceRotate:(d,h,f)=>Hg(e,{deviceId:d,role:h,scopes:f}),onDeviceRevoke:(d,h)=>jg(e,{deviceId:d,role:h}),onLoadConfig:()=>ze(e),onLoadExecApprovals:()=>{const d=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return Ua(e,d)},onBindDefault:d=>{d?Me(e,["tools","exec","node"],d):tt(e,["tools","exec","node"])},onBindAgent:(d,h)=>{const f=["agents","list",d,"tools","exec","node"];h?Me(e,f,h):tt(e,f)},onSaveBindings:()=>ys(e),onExecApprovalsTargetChange:(d,h)=>{e.execApprovalsTarget=d,e.execApprovalsTargetNodeId=h,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:d=>{e.execApprovalsSelectedAgent=d},onExecApprovalsPatch:(d,h)=>Gg(e,d,h),onExecApprovalsRemove:d=>Qg(e,d),onSaveExecApprovals:()=>{const d=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return qg(e,d)}}):v}

        ${e.tab==="chat"?Hy({cognitionValence:e.cognitionState?.selfState?.valence??null,onMindClick:()=>e.setTab("mind"),sessionKey:e.sessionKey,onSessionKeyChange:d=>{e.sessionKey=d,e.chatMessage="",e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:d,lastActiveSessionKey:d}),e.loadAssistantIdentity(),qn(e),Yi(e)},thinkingLevel:e.chatThinkingLevel,showThinking:r,loading:e.chatLoading,sending:e.chatSending,compactionStatus:e.compactionStatus,fallbackStatus:e.fallbackStatus,assistantAvatarUrl:u,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:i,error:e.lastError,sessions:e.sessionsResult,focusMode:o,onRefresh:()=>(e.resetToolStream(),Promise.all([qn(e),Yi(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:d=>e.handleChatScroll(d),onDraftChange:d=>e.chatMessage=d,attachments:e.chatAttachments,onAttachmentsChange:d=>e.chatAttachments=d,onSend:()=>e.handleSendChat(),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onQueueRemove:d=>e.removeQueuedMessage(d),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),showNewMessages:e.chatNewMessagesBelow&&!e.chatManualRefreshInFlight,onScrollToBottom:()=>e.scrollToBottom(),sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,splitRatio:e.splitRatio,onOpenSidebar:d=>e.handleOpenSidebar(d),onCloseSidebar:()=>e.handleCloseSidebar(),onSplitRatioChange:d=>e.handleSplitRatioChange(d),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,micActive:e.chatMicActive,micState:e.chatMicState,onToggleMic:()=>e.handleChatMicToggle()}):v}

        ${e.tab==="mind"?S0({loading:e.cognitionLoading,cognition:e.cognitionState,blinkOpen:e.mindBlinkOpen,onRefresh:()=>e.loadCognition()}):v}

        ${e.tab==="voice"?(e.initVoiceTab(),yx({active:e.voiceActive,state:e.voiceState,messages:e.voiceMessages,openclawConnected:e.voiceOpenclawConnected,onToggleMic:()=>e.handleToggleMic()})):v}

        ${e.tab==="config"?Gy({raw:e.configRaw,originalRaw:e.configRawOriginal,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:d=>{e.configRaw=d},onFormModeChange:d=>e.configFormMode=d,onFormPatch:(d,h)=>Me(e,d,h),onSearchChange:d=>e.configSearchQuery=d,onSectionChange:d=>{e.configActiveSection=d,e.configActiveSubsection=null},onSubsectionChange:d=>e.configActiveSubsection=d,onReload:()=>ze(e),onSave:()=>ys(e),onApply:()=>hu(e),onUpdate:()=>Qo(e)}):v}

        ${e.tab==="debug"?s0({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:d=>e.debugCallMethod=d,onCallParamsChange:d=>e.debugCallParams=d,onRefresh:()=>Gs(e),onCall:()=>Qu(e)}):v}

        ${e.tab==="logs"?g0({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:d=>e.logsFilterText=d,onLevelToggle:(d,h)=>{e.logsLevelFilters={...e.logsLevelFilters,[d]:h}},onToggleAutoFollow:d=>e.logsAutoFollow=d,onRefresh:()=>Ta(e,{reset:!0}),onExport:(d,h)=>e.exportLogs(d,h),onScroll:d=>e.handleLogsScroll(d)}):v}
      </main>
      ${a0(e)}
      ${o0(e)}
    </div>
  `}var Sx=Object.defineProperty,Ax=Object.getOwnPropertyDescriptor,y=(e,t,n,s)=>{for(var i=s>1?void 0:s?Ax(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(s?o(t,n,i):o(i))||i);return s&&i&&Sx(t,n,i),i};const zi=Va({});function Cx(){if(!window.location.search)return!1;const t=new URLSearchParams(window.location.search).get("onboarding");if(!t)return!1;const n=t.trim().toLowerCase();return n==="1"||n==="true"||n==="yes"||n==="on"}let b=class extends ln{constructor(){super(),this.i18nController=new lu(this),this.settings=cp(),this.password="",this.tab="chat",this.onboarding=Cx(),this.showAdvanced=this.settings.showAdvanced??!1,this.cognitionState=null,this.cognitionLoading=!1,this.mindBlinkOpen=!0,this.cognitionPollTimer=null,this.mindBlinkTimer=null,this.connected=!1,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.eventLog=[],this.missionGoals=[],this.missionNorthStar="",this.missionNorthStarProgress=0,this.missionGoalsLoading=!1,this.activityFilter="",this.activityAgentFilter=null,this.eventLogBuffer=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.assistantName=zi.name,this.assistantAvatar=zi.avatar,this.assistantAgentId=zi.agentId??null,this.sessionKey=this.settings.sessionKey,this.chatLoading=!1,this.chatSending=!1,this.chatMessage="",this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.compactionStatus=null,this.fallbackStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.chatAttachments=[],this.chatManualRefreshInFlight=!1,this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.splitRatio=this.settings.splitRatio,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.pendingGatewayUrl=null,this.configLoading=!1,this.configRaw=`{
}
`,this.configRawOriginal="",this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.agentsSelectedId=null,this.agentsPanel="overview",this.agentFilesLoading=!1,this.agentFilesError=null,this.agentFilesList=null,this.agentFileContents={},this.agentFileDrafts={},this.agentFileActive=null,this.agentFileSaving=!1,this.agentIdentityLoading=!1,this.agentIdentityError=null,this.agentIdentityById={},this.agentSkillsLoading=!1,this.agentSkillsError=null,this.agentSkillsReport=null,this.agentSkillsAgentId=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.usageLoading=!1,this.usageResult=null,this.usageCostSummary=null,this.usageError=null,this.usageStartDate=(()=>{const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`})(),this.usageEndDate=(()=>{const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`})(),this.usageSelectedSessions=[],this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageChartMode="tokens",this.usageDailyChartMode="by-type",this.usageTimeSeriesMode="per-turn",this.usageTimeSeriesBreakdownMode="by-type",this.usageTimeSeries=null,this.usageTimeSeriesLoading=!1,this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null,this.usageSessionLogs=null,this.usageSessionLogsLoading=!1,this.usageSessionLogsExpanded=!1,this.usageQuery="",this.usageQueryDraft="",this.usageSessionSort="recent",this.usageSessionSortDir="desc",this.usageRecentSessions=[],this.usageTimeZone="local",this.usageContextExpanded=!1,this.usageHeaderPinned=!1,this.usageSessionsTab="all",this.usageVisibleColumns=["channel","agent","provider","model","messages","tools","errors","duration"],this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery="",this.usageQueryDebounceTimer=null,this.cronLoading=!1,this.cronJobs=[],this.cronStatus=null,this.cronError=null,this.cronForm={...lf},this.cronRunsJobId=null,this.cronRuns=[],this.cronBusy=!1,this.updateAvailable=null,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...rf},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.voiceActive=!1,this.voiceState="IDLE",this.voiceMessages=[],this.voiceOpenclawConnected=!1,this.voiceVadSpeaking=!1,this.voiceInitialized=!1,this.voiceCurrentAssistantText="",this.llmMode=this.settings.llmMode??"cloud",this.ttsMode=this.settings.ttsMode??"cloud",this.chatMicActive=!1,this.chatMicState="IDLE",this.chatVoiceInitialized=!1,this.chatVoiceChunkIndex=0,this.chatVoiceStreamActive=!1,this.chatVoiceFirstChunkSent=!1,this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatHasAutoScrolled=!1,this.chatUserNearBottom=!0,this.chatNewMessagesBelow=!1,this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.refreshSessionsAfterChat=new Set,this.basePath="",this.popStateHandler=()=>wp(this),this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null,xa(this.settings.locale)&&Un.setLocale(this.settings.locale)}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),Uh(this),Sf(this)}firstUpdated(){Af(this)}disconnectedCallback(){Cf(this),super.disconnectedCallback()}updated(e){Tf(this,e),this.handleChatVoiceStreamUpdate(e)}connect(){Ec(this)}handleChatScroll(e){Wu(this,e)}handleLogsScroll(e){Vu(this,e)}exportLogs(e,t){qu(e,t)}resetToolStream(){ti(this)}resetChatScroll(){Yo(this)}scrollToBottom(e){Yo(this),Qn(this,!0,!!e?.smooth)}async loadAssistantIdentity(){await Cc(this)}applySettings(e){$t(this,e)}setTab(e){hp(this,e)}setTheme(e,t){vp(this,e,t)}async loadOverview(){await mc(this)}async loadCron(){await Is(this)}async handleAbortChat(){await wc(this)}removeQueuedMessage(e){tf(this,e)}async handleSendChat(e,t){await nf(this,e,t)}async handleWhatsAppStart(e){await yu(this,e)}async handleWhatsAppWait(){await xu(this)}async handleWhatsAppLogout(){await $u(this)}async handleChannelConfigSave(){await wu(this)}async handleChannelConfigReload(){await ku(this)}handleNostrProfileEdit(e,t){Cu(this,e,t)}handleNostrProfileCancel(){Tu(this)}handleNostrProfileFieldChange(e,t){_u(this,e,t)}async handleNostrProfileSave(){await Mu(this)}async handleNostrProfileImport(){await Lu(this)}handleNostrProfileToggleAdvanced(){Eu(this)}async handleExecApprovalDecision(e){const t=this.execApprovalQueue[0];if(!(!t||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:t.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(n=>n.id!==t.id)}catch(n){this.execApprovalError=`Exec approval failed: ${String(n)}`}finally{this.execApprovalBusy=!1}}}handleGatewayUrlConfirm(){const e=this.pendingGatewayUrl;e&&(this.pendingGatewayUrl=null,$t(this,{...this.settings,gatewayUrl:e}),this.connect())}handleGatewayUrlCancel(){this.pendingGatewayUrl=null}handleOpenSidebar(e){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarCloseTimer=null)},200)}handleSplitRatioChange(e){const t=Math.max(.4,Math.min(.7,e));this.splitRatio=t,this.applySettings({...this.settings,splitRatio:t})}toggleAdvanced(){this.showAdvanced=!this.showAdvanced,this.applySettings({...this.settings,showAdvanced:this.showAdvanced})}async loadCognition(){if(!this.cognitionLoading){this.cognitionLoading=!0;try{const e=this.settings.aliveIntelligenceUrl||"",t=await fetch(`${e}/api/openclaw/cognition`);if(t.ok){this.cognitionState=await t.json();const n=this.cognitionState;if(n?.selfState){const s=220+(n.selfState.valence??0)*30,i=20+(n.selfState.arousal??.3)*30;this.style.setProperty("--mood-hue",String(Math.round(s))),this.style.setProperty("--mood-saturation",`${Math.round(i)}%`)}}}catch{}finally{this.cognitionLoading=!1}}}startCognitionPolling(){this.stopCognitionPolling(),this.loadCognition(),this.cognitionPollTimer=window.setInterval(()=>{this.loadCognition()},1e4)}stopCognitionPolling(){this.cognitionPollTimer!=null&&(window.clearInterval(this.cognitionPollTimer),this.cognitionPollTimer=null)}startMindBlink(){this.stopMindBlink();const e=()=>{const t=3e3+Math.random()*4e3;this.mindBlinkTimer=window.setTimeout(()=>{this.mindBlinkOpen=!1,window.setTimeout(()=>{this.mindBlinkOpen=!0,e()},150)},t)};e()}stopMindBlink(){this.mindBlinkTimer!=null&&(window.clearTimeout(this.mindBlinkTimer),this.mindBlinkTimer=null),this.mindBlinkOpen=!0}initVoiceTab(){this.voiceInitialized||(this.voiceInitialized=!0,hx({onStateChange:e=>this.voiceState=e,onOpenclawStatus:e=>this.voiceOpenclawConnected=e,onUserMessage:(e,t)=>{this.voiceMessages=[...this.voiceMessages,{role:"user",text:e,meta:t}],this.voiceCurrentAssistantText="",this.scrollVoiceMessages()},onAssistantStart:()=>{this.voiceMessages=[...this.voiceMessages,{role:"assistant",text:"",streaming:!0}],this.voiceCurrentAssistantText="",this.scrollVoiceMessages()},onAssistantDelta:e=>{this.voiceCurrentAssistantText=e;const t=[...this.voiceMessages],n=t[t.length-1];n?.role==="assistant"&&n.streaming&&(t[t.length-1]={...n,text:e},this.voiceMessages=t),this.scrollVoiceMessages()},onAssistantEnd:e=>{const t=[...this.voiceMessages],n=t[t.length-1];n?.role==="assistant"&&(t[t.length-1]={...n,text:e,streaming:!1},this.voiceMessages=t),this.voiceCurrentAssistantText="",this.scrollVoiceMessages()},onVad:e=>this.voiceVadSpeaking=e}))}teardownVoiceTab(){this.voiceInitialized&&(this.voiceInitialized=!1,vx())}async handleToggleMic(){try{this.voiceActive=await mx(this.voiceActive)}catch(e){console.error("Mic access denied:",e)}}scrollVoiceMessages(){requestAnimationFrame(()=>{const e=this.querySelector?.("#voice-messages");e&&(e.scrollTop=e.scrollHeight)})}initChatVoice(){this.chatVoiceInitialized||(this.chatVoiceInitialized=!0,zu({onStateChange:e=>this.chatMicState=e,onTranscription:e=>{this.connected?this.handleSendChat(e):this.chatMessages=[...this.chatMessages,{role:"user",content:[{type:"text",text:e}]}]},onResponseDelta:e=>{this.chatStream=e},onResponseEnd:e=>{this.chatStream=null,e&&(this.chatMessages=[...this.chatMessages,{role:"assistant",content:[{type:"text",text:e}]}])},onVad:e=>{}}))}teardownChatVoice(){this.chatVoiceInitialized&&(this.chatVoiceInitialized=!1,Uu(),this.chatMicActive=!1,this.chatMicState="IDLE")}async handleChatMicToggle(){this.chatVoiceInitialized||this.initChatVoice();try{this.chatMicActive=await Hu(this.chatMicActive),this.chatMicActive||(this.chatMicState="IDLE",_s())}catch(e){console.error("Chat mic access denied:",e)}}async handleLlmModeToggle(){const e=this.llmMode==="cloud"?"local":"cloud";if(this.llmMode=e,this.applySettings({...this.settings,llmMode:e}),this.client)try{await this.client.request("sessions.patch",{key:this.sessionKey,model:e==="local"?"ollama/qwen3-vl:32b":null})}catch(t){console.error("[llm-toggle] failed to patch session model:",t)}}async handleTtsModeToggle(){const e=this.ttsMode==="cloud"?"local":"cloud";if(this.ttsMode=e,this.applySettings({...this.settings,ttsMode:e}),this.client)try{await this.client.request("tts.setProvider",{provider:e==="local"?"local":"elevenlabs"})}catch(t){console.error("[tts-toggle] failed to set provider:",t)}}handleChatVoiceStreamUpdate(e){if(this.chatMicActive){if(e.has("chatRunId")){const t=e.get("chatRunId");if(t==null&&this.chatRunId!=null){_s(),this.chatVoiceChunkIndex=0,this.chatVoiceStreamActive=!0,this.chatVoiceFirstChunkSent=!1,Ku();return}if(t!=null&&this.chatRunId==null&&this.chatVoiceStreamActive){this.chatVoiceStreamActive=!1;const n=this.chatMessages;for(let s=n.length-1;s>=0;s--){const i=n[s];if(i.role==="assistant"){const a=Rs(i);if(a){const o=a.slice(this.chatVoiceChunkIndex).trim();o.length>0&&this.client&&vi(o,this.client)}break}}ju();return}}this.chatVoiceStreamActive&&e.has("chatStream")&&this.chatStream&&this.client&&this.extractAndSynthesizeChunks(this.chatStream)}}extractAndSynthesizeChunks(e){const t=e.slice(this.chatVoiceChunkIndex);if(!t)return;const n=this.client;if(!n)return;if(!this.chatVoiceFirstChunkSent){const o=t.indexOf(" ");if(o>0){const r=t.slice(0,o).trim();if(r){this.chatVoiceChunkIndex+=o+1,this.chatVoiceFirstChunkSent=!0,vi(r,n),this.extractAndSynthesizeChunks(e);return}}return}const s=/[,;:!?.\u2013\u2014\n]\s*/g;let i=-1,a;for(;(a=s.exec(t))!==null;){const o=a.index+a[0].length;o<=t.length&&(i=o)}if(i>0){const o=t.slice(0,i).trim();o.length>=2&&(this.chatVoiceChunkIndex+=i,vi(o,n))}}render(){return kx(this)}};y([x()],b.prototype,"settings",2);y([x()],b.prototype,"password",2);y([x()],b.prototype,"tab",2);y([x()],b.prototype,"onboarding",2);y([x()],b.prototype,"showAdvanced",2);y([x()],b.prototype,"cognitionState",2);y([x()],b.prototype,"cognitionLoading",2);y([x()],b.prototype,"mindBlinkOpen",2);y([x()],b.prototype,"connected",2);y([x()],b.prototype,"theme",2);y([x()],b.prototype,"themeResolved",2);y([x()],b.prototype,"hello",2);y([x()],b.prototype,"lastError",2);y([x()],b.prototype,"eventLog",2);y([x()],b.prototype,"missionGoals",2);y([x()],b.prototype,"missionNorthStar",2);y([x()],b.prototype,"missionNorthStarProgress",2);y([x()],b.prototype,"missionGoalsLoading",2);y([x()],b.prototype,"activityFilter",2);y([x()],b.prototype,"activityAgentFilter",2);y([x()],b.prototype,"assistantName",2);y([x()],b.prototype,"assistantAvatar",2);y([x()],b.prototype,"assistantAgentId",2);y([x()],b.prototype,"sessionKey",2);y([x()],b.prototype,"chatLoading",2);y([x()],b.prototype,"chatSending",2);y([x()],b.prototype,"chatMessage",2);y([x()],b.prototype,"chatMessages",2);y([x()],b.prototype,"chatToolMessages",2);y([x()],b.prototype,"chatStream",2);y([x()],b.prototype,"chatStreamStartedAt",2);y([x()],b.prototype,"chatRunId",2);y([x()],b.prototype,"compactionStatus",2);y([x()],b.prototype,"fallbackStatus",2);y([x()],b.prototype,"chatAvatarUrl",2);y([x()],b.prototype,"chatThinkingLevel",2);y([x()],b.prototype,"chatQueue",2);y([x()],b.prototype,"chatAttachments",2);y([x()],b.prototype,"chatManualRefreshInFlight",2);y([x()],b.prototype,"sidebarOpen",2);y([x()],b.prototype,"sidebarContent",2);y([x()],b.prototype,"sidebarError",2);y([x()],b.prototype,"splitRatio",2);y([x()],b.prototype,"nodesLoading",2);y([x()],b.prototype,"nodes",2);y([x()],b.prototype,"devicesLoading",2);y([x()],b.prototype,"devicesError",2);y([x()],b.prototype,"devicesList",2);y([x()],b.prototype,"execApprovalsLoading",2);y([x()],b.prototype,"execApprovalsSaving",2);y([x()],b.prototype,"execApprovalsDirty",2);y([x()],b.prototype,"execApprovalsSnapshot",2);y([x()],b.prototype,"execApprovalsForm",2);y([x()],b.prototype,"execApprovalsSelectedAgent",2);y([x()],b.prototype,"execApprovalsTarget",2);y([x()],b.prototype,"execApprovalsTargetNodeId",2);y([x()],b.prototype,"execApprovalQueue",2);y([x()],b.prototype,"execApprovalBusy",2);y([x()],b.prototype,"execApprovalError",2);y([x()],b.prototype,"pendingGatewayUrl",2);y([x()],b.prototype,"configLoading",2);y([x()],b.prototype,"configRaw",2);y([x()],b.prototype,"configRawOriginal",2);y([x()],b.prototype,"configValid",2);y([x()],b.prototype,"configIssues",2);y([x()],b.prototype,"configSaving",2);y([x()],b.prototype,"configApplying",2);y([x()],b.prototype,"updateRunning",2);y([x()],b.prototype,"applySessionKey",2);y([x()],b.prototype,"configSnapshot",2);y([x()],b.prototype,"configSchema",2);y([x()],b.prototype,"configSchemaVersion",2);y([x()],b.prototype,"configSchemaLoading",2);y([x()],b.prototype,"configUiHints",2);y([x()],b.prototype,"configForm",2);y([x()],b.prototype,"configFormOriginal",2);y([x()],b.prototype,"configFormDirty",2);y([x()],b.prototype,"configFormMode",2);y([x()],b.prototype,"configSearchQuery",2);y([x()],b.prototype,"configActiveSection",2);y([x()],b.prototype,"configActiveSubsection",2);y([x()],b.prototype,"channelsLoading",2);y([x()],b.prototype,"channelsSnapshot",2);y([x()],b.prototype,"channelsError",2);y([x()],b.prototype,"channelsLastSuccess",2);y([x()],b.prototype,"whatsappLoginMessage",2);y([x()],b.prototype,"whatsappLoginQrDataUrl",2);y([x()],b.prototype,"whatsappLoginConnected",2);y([x()],b.prototype,"whatsappBusy",2);y([x()],b.prototype,"nostrProfileFormState",2);y([x()],b.prototype,"nostrProfileAccountId",2);y([x()],b.prototype,"presenceLoading",2);y([x()],b.prototype,"presenceEntries",2);y([x()],b.prototype,"presenceError",2);y([x()],b.prototype,"presenceStatus",2);y([x()],b.prototype,"agentsLoading",2);y([x()],b.prototype,"agentsList",2);y([x()],b.prototype,"agentsError",2);y([x()],b.prototype,"agentsSelectedId",2);y([x()],b.prototype,"agentsPanel",2);y([x()],b.prototype,"agentFilesLoading",2);y([x()],b.prototype,"agentFilesError",2);y([x()],b.prototype,"agentFilesList",2);y([x()],b.prototype,"agentFileContents",2);y([x()],b.prototype,"agentFileDrafts",2);y([x()],b.prototype,"agentFileActive",2);y([x()],b.prototype,"agentFileSaving",2);y([x()],b.prototype,"agentIdentityLoading",2);y([x()],b.prototype,"agentIdentityError",2);y([x()],b.prototype,"agentIdentityById",2);y([x()],b.prototype,"agentSkillsLoading",2);y([x()],b.prototype,"agentSkillsError",2);y([x()],b.prototype,"agentSkillsReport",2);y([x()],b.prototype,"agentSkillsAgentId",2);y([x()],b.prototype,"sessionsLoading",2);y([x()],b.prototype,"sessionsResult",2);y([x()],b.prototype,"sessionsError",2);y([x()],b.prototype,"sessionsFilterActive",2);y([x()],b.prototype,"sessionsFilterLimit",2);y([x()],b.prototype,"sessionsIncludeGlobal",2);y([x()],b.prototype,"sessionsIncludeUnknown",2);y([x()],b.prototype,"usageLoading",2);y([x()],b.prototype,"usageResult",2);y([x()],b.prototype,"usageCostSummary",2);y([x()],b.prototype,"usageError",2);y([x()],b.prototype,"usageStartDate",2);y([x()],b.prototype,"usageEndDate",2);y([x()],b.prototype,"usageSelectedSessions",2);y([x()],b.prototype,"usageSelectedDays",2);y([x()],b.prototype,"usageSelectedHours",2);y([x()],b.prototype,"usageChartMode",2);y([x()],b.prototype,"usageDailyChartMode",2);y([x()],b.prototype,"usageTimeSeriesMode",2);y([x()],b.prototype,"usageTimeSeriesBreakdownMode",2);y([x()],b.prototype,"usageTimeSeries",2);y([x()],b.prototype,"usageTimeSeriesLoading",2);y([x()],b.prototype,"usageTimeSeriesCursorStart",2);y([x()],b.prototype,"usageTimeSeriesCursorEnd",2);y([x()],b.prototype,"usageSessionLogs",2);y([x()],b.prototype,"usageSessionLogsLoading",2);y([x()],b.prototype,"usageSessionLogsExpanded",2);y([x()],b.prototype,"usageQuery",2);y([x()],b.prototype,"usageQueryDraft",2);y([x()],b.prototype,"usageSessionSort",2);y([x()],b.prototype,"usageSessionSortDir",2);y([x()],b.prototype,"usageRecentSessions",2);y([x()],b.prototype,"usageTimeZone",2);y([x()],b.prototype,"usageContextExpanded",2);y([x()],b.prototype,"usageHeaderPinned",2);y([x()],b.prototype,"usageSessionsTab",2);y([x()],b.prototype,"usageVisibleColumns",2);y([x()],b.prototype,"usageLogFilterRoles",2);y([x()],b.prototype,"usageLogFilterTools",2);y([x()],b.prototype,"usageLogFilterHasTools",2);y([x()],b.prototype,"usageLogFilterQuery",2);y([x()],b.prototype,"cronLoading",2);y([x()],b.prototype,"cronJobs",2);y([x()],b.prototype,"cronStatus",2);y([x()],b.prototype,"cronError",2);y([x()],b.prototype,"cronForm",2);y([x()],b.prototype,"cronRunsJobId",2);y([x()],b.prototype,"cronRuns",2);y([x()],b.prototype,"cronBusy",2);y([x()],b.prototype,"updateAvailable",2);y([x()],b.prototype,"skillsLoading",2);y([x()],b.prototype,"skillsReport",2);y([x()],b.prototype,"skillsError",2);y([x()],b.prototype,"skillsFilter",2);y([x()],b.prototype,"skillEdits",2);y([x()],b.prototype,"skillsBusyKey",2);y([x()],b.prototype,"skillMessages",2);y([x()],b.prototype,"debugLoading",2);y([x()],b.prototype,"debugStatus",2);y([x()],b.prototype,"debugHealth",2);y([x()],b.prototype,"debugModels",2);y([x()],b.prototype,"debugHeartbeat",2);y([x()],b.prototype,"debugCallMethod",2);y([x()],b.prototype,"debugCallParams",2);y([x()],b.prototype,"debugCallResult",2);y([x()],b.prototype,"debugCallError",2);y([x()],b.prototype,"logsLoading",2);y([x()],b.prototype,"logsError",2);y([x()],b.prototype,"logsFile",2);y([x()],b.prototype,"logsEntries",2);y([x()],b.prototype,"logsFilterText",2);y([x()],b.prototype,"logsLevelFilters",2);y([x()],b.prototype,"logsAutoFollow",2);y([x()],b.prototype,"logsTruncated",2);y([x()],b.prototype,"logsCursor",2);y([x()],b.prototype,"logsLastFetchAt",2);y([x()],b.prototype,"logsLimit",2);y([x()],b.prototype,"logsMaxBytes",2);y([x()],b.prototype,"logsAtBottom",2);y([x()],b.prototype,"voiceActive",2);y([x()],b.prototype,"voiceState",2);y([x()],b.prototype,"voiceMessages",2);y([x()],b.prototype,"voiceOpenclawConnected",2);y([x()],b.prototype,"voiceVadSpeaking",2);y([x()],b.prototype,"llmMode",2);y([x()],b.prototype,"ttsMode",2);y([x()],b.prototype,"chatMicActive",2);y([x()],b.prototype,"chatMicState",2);y([x()],b.prototype,"chatNewMessagesBelow",2);b=y([Cl("openclaw-app")],b);
//# sourceMappingURL=index-CQGHxOYN.js.map
