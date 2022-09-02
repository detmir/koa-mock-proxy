"use strict";(self.webpackChunkkoa_mock_proxy_website=self.webpackChunkkoa_mock_proxy_website||[]).push([[510],{3905:(e,r,t)=>{t.d(r,{Zo:()=>l,kt:()=>y});var o=t(7294);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function c(e,r){if(null==e)return{};var t,o,n=function(e,r){if(null==e)return{};var t,o,n={},a=Object.keys(e);for(o=0;o<a.length;o++)t=a[o],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)t=a[o],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var i=o.createContext({}),m=function(e){var r=o.useContext(i),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},l=function(e){var r=m(e.components);return o.createElement(i.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return o.createElement(o.Fragment,{},r)}},u=o.forwardRef((function(e,r){var t=e.components,n=e.mdxType,a=e.originalType,i=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),u=m(t),y=n,k=u["".concat(i,".").concat(y)]||u[y]||p[y]||a;return t?o.createElement(k,s(s({ref:r},l),{},{components:t})):o.createElement(k,s({ref:r},l))}));function y(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var a=t.length,s=new Array(a);s[0]=u;var c={};for(var i in r)hasOwnProperty.call(r,i)&&(c[i]=r[i]);c.originalType=e,c.mdxType="string"==typeof e?e:n,s[1]=c;for(var m=2;m<a;m++)s[m]=t[m];return o.createElement.apply(null,s)}return o.createElement.apply(null,t)}u.displayName="MDXCreateElement"},974:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>i,contentTitle:()=>s,default:()=>p,frontMatter:()=>a,metadata:()=>c,toc:()=>m});var o=t(7462),n=(t(7294),t(3905));const a={},s="Examples",c={unversionedId:"examples",id:"examples",title:"Examples",description:"The simplest implementation",source:"@site/../docs/examples.md",sourceDirName:".",slug:"/examples",permalink:"/koa-mock-proxy/docs/examples",draft:!1,editUrl:"https://github.com/detmir/koa-mock-proxy/tree/main/docs/../docs/examples.md",tags:[],version:"current",frontMatter:{}},i={},m=[{value:"The simplest implementation",id:"the-simplest-implementation",level:2},{value:"Proxy only a specific route",id:"proxy-only-a-specific-route",level:2},{value:"More complex examples",id:"more-complex-examples",level:2},{value:"Mocks structure",id:"mocks-structure",level:3},{value:"Mocks recording",id:"mocks-recording",level:3},{value:"Mocks scenarios",id:"mocks-scenarios",level:3}],l={toc:m};function p(e){let{components:r,...t}=e;return(0,n.kt)("wrapper",(0,o.Z)({},l,t,{components:r,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"examples"},"Examples"),(0,n.kt)("h2",{id:"the-simplest-implementation"},"The simplest implementation"),(0,n.kt)("p",null,"(Server proxies and records all requests)"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"import Koa from 'koa';\nimport { mockProxyMiddleware } from '@detmir/koa-mock-proxy';\n\nconst server = new Koa();\n\nserver.use(mockProxyMiddleware({\n  mocksDirectory: './mocks/',\n  targetUrl: 'http://my-service.com/api'\n}));\n\nserver.listen(9000);\n\n")),(0,n.kt)("h2",{id:"proxy-only-a-specific-route"},"Proxy only a specific route"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"  import Koa from 'koa';\n  import Router from '@koa/router';\n  import { mockProxy, mockProxyConfig } from 'koa-mock-proxy';\n\n  const server = new Koa();\n  server.use(mockProxyConfig({\n    targetUrl: 'http://my-service.com/api'\n  }))\n\n  const userRouter = new Router();\n  // This route will record or replay depending on global configuration\n  userRouter.post('/users', mockProxy());\n\n  // This route will replay or proxy\n  userRouter.post('/users', mockProxy({ mode: 'replayOrProxy' }));\n\n  // this route proxy to custom url\n  userRouter.get('/user/:id', mockProxy({\n    mode: 'record',\n    targetUrl: 'http://my-service2.com/api'\n  }));\n\n  server.use(userRouter.routes());\n\n  server.use(koaMockProxy({\n    targetUrl: 'http://my-service.com/api'\n  }));\n\n  server.listen(9000);\n")),(0,n.kt)("h2",{id:"more-complex-examples"},"More complex examples"),(0,n.kt)("h3",{id:"mocks-structure"},(0,n.kt)("a",{parentName:"h3",href:"https://github.com/detmir/koa-mock-proxy/tree/main/examples/01%20-%20mocksStructure"},"Mocks structure")),(0,n.kt)("h3",{id:"mocks-recording"},(0,n.kt)("a",{parentName:"h3",href:"https://github.com/detmir/koa-mock-proxy/tree/main/examples/02%20-%20recordMocks"},"Mocks recording")),(0,n.kt)("h3",{id:"mocks-scenarios"},(0,n.kt)("a",{parentName:"h3",href:"https://github.com/detmir/koa-mock-proxy/tree/main/examples/03%20-%20mocksScenarios"},"Mocks scenarios")))}p.isMDXComponent=!0}}]);