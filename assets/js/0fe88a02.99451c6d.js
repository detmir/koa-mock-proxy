"use strict";(self.webpackChunkkoa_mock_proxy_website=self.webpackChunkkoa_mock_proxy_website||[]).push([[798],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=p(n),m=o,k=d["".concat(s,".").concat(m)]||d[m]||u[m]||a;return n?r.createElement(k,i(i({ref:t},c),{},{components:n})):r.createElement(k,i({ref:t},c))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var p=2;p<a;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1091:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>m,frontMatter:()=>l,metadata:()=>p,toc:()=>u});var r=n(7462),o=(n(7294),n(3905));const a={toc:[{value:"Features",id:"features",level:2},{value:"Main advantages",id:"main-advantages",level:2},{value:"Installation",id:"installation",level:2},{value:"Docs",id:"docs",level:2},{value:"Debugging",id:"debugging",level:2}]};function i(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},a,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"koa-mock-proxy"},"Koa mock proxy"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"koa-mock-proxy")," is a tool for creating proxy servers with ability to record and replay responses (mocks)."),(0,o.kt)("p",null,"It can be useful for:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"service/integration tests (in case you want to test only frontend)"),(0,o.kt)("li",{parentName:"ul"},"e2e tests mocking only chosen endpoints"),(0,o.kt)("li",{parentName:"ul"},"Manually testing application without backend or for a specific scenario that's difficult to reproduce"),(0,o.kt)("li",{parentName:"ul"},"Logging activity between services")),(0,o.kt)("p",null,"You are free to use all possibilities of Koa (custom middlewares like ",(0,o.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/koa-router"},"koa-router"),")."),(0,o.kt)("h2",{id:"features"},"Features"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Proxy http requests"),(0,o.kt)("li",{parentName:"ul"},"Record requests and responses (body and headers) into human-readable files"),(0,o.kt)("li",{parentName:"ul"},"Log proxy requests, view it using the UI"),(0,o.kt)("li",{parentName:"ul"},"Manage different test scenarios (depending on a scenario, the same endpoint can return different responses).")),(0,o.kt)("h2",{id:"main-advantages"},"Main advantages"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"A public API made in a very familiar way for many JS developers (using middlewares)"),(0,o.kt)("li",{parentName:"ul"},"Recorded mocks are suitable to put in a version control system, easy to understand and update"),(0,o.kt)("li",{parentName:"ul"},"Composability with other libraries and code from custom mocks"),(0,o.kt)("li",{parentName:"ul"},"UI for easier debugging and recording of mocks")),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("p",null,"Install using npm:"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"npm i koa-mock-proxy")),(0,o.kt)("p",null,"Also, it's necessary to install koa, if you don't have it in your project:"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"npm i koa")),(0,o.kt)("h2",{id:"docs"},"Docs"),(0,o.kt)("p",null,"Full docs ",(0,o.kt)("a",{parentName:"p",href:"https://detmir.github.io/koa-mock-proxy/"},"are available here")),(0,o.kt)("p",null,"And ",(0,o.kt)("a",{parentName:"p",href:"https://detmir.github.io/koa-mock-proxy/docs/examples"},"a lot of examples are here")),(0,o.kt)("h2",{id:"debugging"},"Debugging"),(0,o.kt)("p",null,"You can set env variable ",(0,o.kt)("inlineCode",{parentName:"p"},"DEBUG_PROXY=true")," if you want to see in console all requests coming through mock server."))}i.isMDXComponent=!0;const l={},s="Getting started",p={unversionedId:"intro",id:"intro",title:"Getting started",description:"",source:"@site/../docs/intro.mdx",sourceDirName:".",slug:"/intro",permalink:"/koa-mock-proxy/docs/intro",draft:!1,editUrl:"https://github.com/detmir/koa-mock-proxy/tree/main/docs/../docs/intro.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",next:{title:"Working modes",permalink:"/koa-mock-proxy/docs/workingModes"}},c={},u=[],d={toc:u};function m(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"getting-started"},"Getting started"),(0,o.kt)(i,{mdxType:"Readme"}))}m.isMDXComponent=!0}}]);