"use strict";(self.webpackChunkkoa_mock_proxy_website=self.webpackChunkkoa_mock_proxy_website||[]).push([[589],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>u});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=a.createContext({}),s=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},m=function(e){var t=s(e.components);return a.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,l=e.originalType,p=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),d=s(n),u=i,k=d["".concat(p,".").concat(u)]||d[u]||c[u]||l;return n?a.createElement(k,r(r({ref:t},m),{},{components:n})):a.createElement(k,r({ref:t},m))}));function u(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var l=n.length,r=new Array(l);r[0]=d;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:i,r[1]=o;for(var s=2;s<l;s++)r[s]=n[s];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},2431:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>r,default:()=>c,frontMatter:()=>l,metadata:()=>o,toc:()=>s});var a=n(7462),i=(n(7294),n(3905));const l={},r="Mocks format and location",o={unversionedId:"mocks",id:"mocks",title:"Mocks format and location",description:"Mocks are stored in file system in mocksDirectory. The exact location depends on http method, uri path,",source:"@site/../docs/mocks.md",sourceDirName:".",slug:"/mocks",permalink:"/koa-mock-proxy/docs/mocks",draft:!1,editUrl:"https://github.com/detmir/koa-mock-proxy/tree/main/docs/../docs/mocks.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Recording mocks",permalink:"/koa-mock-proxy/docs/recording"},next:{title:"Mock scenarios",permalink:"/koa-mock-proxy/docs/scenarios"}},p={},s=[{value:"Mock file location",id:"mock-file-location",level:2},{value:"index.js file",id:"indexjs-file",level:2},{value:"Example",id:"example",level:2},{value:"JS mocks",id:"js-mocks",level:2},{value:"JSON mocks",id:"json-mocks",level:2}],m={toc:s};function c(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"mocks-format-and-location"},"Mocks format and location"),(0,i.kt)("p",null,"Mocks are stored in file system in ",(0,i.kt)("inlineCode",{parentName:"p"},"mocksDirectory"),". The exact location depends on http method, uri path,\nscenario and query location."),(0,i.kt)("h2",{id:"mock-file-location"},"Mock file location"),(0,i.kt)("p",null,"File path location:"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"[path]/[httpMethod]_[pathSlug][_posfix]?[.scenario]*[.paramName=paramValue]*.[json|js]")),(0,i.kt)("p",null,"(",(0,i.kt)("inlineCode",{parentName:"p"},"*")," means this filename part is optional and can be multiple, ",(0,i.kt)("inlineCode",{parentName:"p"},"?")," means this filename part is optional)"),(0,i.kt)("p",null,"where:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"path")," - HTTP request path (except the last path fragment)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"httpMethod")," - HTTP method (GET/POST, etc...)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"pathSlug")," - the last part of HTTP path fragment (for example, for path /products/list ",(0,i.kt)("inlineCode",{parentName:"li"},"pathSlug")," will be ",(0,i.kt)("inlineCode",{parentName:"li"},"list"),")."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"posfix")," (optional) - string that returns ",(0,i.kt)("inlineCode",{parentName:"li"},"recordOptions.getFilenamePostfix")," from middleware options"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"scenario")," (optional) - one of current active scenarios. It's possible to set multiple scenarios in filename (for example, ",(0,i.kt)("inlineCode",{parentName:"li"},"GET_path.scenario1.scenario2.json"),")"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"paramName=paramValue")," (optional) - query params for HTTP requests. It's possible specify multiple query parameters (",(0,i.kt)("inlineCode",{parentName:"li"},"GET_path.param1=value1.param2=value2.json"),")")),(0,i.kt)("p",null,"Some rules to mention:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Query parameters are optional. If parameter is not specified, it can be any value."),(0,i.kt)("li",{parentName:"ul"},"If you specify query params, it doesn't mean that matched request can not have other query params."),(0,i.kt)("li",{parentName:"ul"},"If there is no last part of path (path is ",(0,i.kt)("inlineCode",{parentName:"li"},"/"),"), ",(0,i.kt)("inlineCode",{parentName:"li"},"pathSlug")," is ",(0,i.kt)("inlineCode",{parentName:"li"},"__root__"),"."),(0,i.kt)("li",{parentName:"ul"},"If scenarios are not specified, it can be any scenario."),(0,i.kt)("li",{parentName:"ul"},"Prohibited symbols for filenames (for Windows, Linux or macOS) will be replaced to ",(0,i.kt)("inlineCode",{parentName:"li"},"_")," (underscore)")),(0,i.kt)("p",null,"If multiple files match http request, the system choose the most specific file.\nIt will be determined by the biggest weight of the filename:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"1 scenario")," increases weight by ",(0,i.kt)("inlineCode",{parentName:"li"},"100")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"1 query parameter")," increases weight by ",(0,i.kt)("inlineCode",{parentName:"li"},"10")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},".js extension")," increases weight by ",(0,i.kt)("inlineCode",{parentName:"li"},"1"))),(0,i.kt)("h2",{id:"indexjs-file"},"index.js file"),(0,i.kt)("p",null,"Also, if index.js exists in target directory, default middleware from there will be called first."),(0,i.kt)("p",null,"If middleware from index.js will calls ",(0,i.kt)("inlineCode",{parentName:"p"},"next()")," function, the library will look for another suitable file that can be matched with URL."),(0,i.kt)("h2",{id:"example"},"Example"),(0,i.kt)("p",null,"For example, we have the following file structure:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"mocks/\n\u251c\u2500 products/\n\u2502  \u251c\u2500 GET_1.js\n\u2502  \u251c\u2500 index.js\n\u251c\u2500 GET_products.json\n\u251c\u2500 GET_products_postfix.json\n\u251c\u2500 GET_products.popular=1.json\n\u251c\u2500 GET_products.popular=1.sort=asc.json\n\u251c\u2500 GET_products.empty.json\n\u251c\u2500 GET_products.empty.popular=0.json\n\u251c\u2500 GET___root__.json\n")),(0,i.kt)("p",null,"Then, HTTP requests match the following files:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"GET /")," => ",(0,i.kt)("inlineCode",{parentName:"li"},"/GET___root__.json")," (special case for empty path)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"GET /products/1")," => ",(0,i.kt)("inlineCode",{parentName:"li"},"/products/index.js"),", ",(0,i.kt)("inlineCode",{parentName:"li"},"/products/GET_1.json")," (first, it runs index.js. If middleware in index.js calls ",(0,i.kt)("inlineCode",{parentName:"li"},"next"),", ",(0,i.kt)("inlineCode",{parentName:"li"},"/products/GET_1.json")," will be included)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"GET /products?a=b")," => ",(0,i.kt)("inlineCode",{parentName:"li"},"/GET_products.json")," (since there are no files with exact query parameters)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"GET /products?popular=1")," => ",(0,i.kt)("inlineCode",{parentName:"li"},"/GET_products.popular=1.json")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"GET /products?popular=1&sort=desc")," => ",(0,i.kt)("inlineCode",{parentName:"li"},"/GET_products.popular=1.json")," (since this file is the most specific)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"GET /products?popular=1&sort=asc")," => ",(0,i.kt)("inlineCode",{parentName:"li"},"/GET_products.popular=1.sort=asc.json"))),(0,i.kt)("p",null,"If scenario ",(0,i.kt)("inlineCode",{parentName:"p"},"empty")," is active:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"GET /products/1")," => ",(0,i.kt)("inlineCode",{parentName:"li"},"/products/GET_1.json")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"GET /products?popular=1")," => ",(0,i.kt)("inlineCode",{parentName:"li"},"/GET_products.empty.json")," (because ",(0,i.kt)("inlineCode",{parentName:"li"},"scenario")," in filename has bigger weight than query parameter)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"GET /products?popular=0")," => ",(0,i.kt)("inlineCode",{parentName:"li"},"/GET_products.empty.popular=0.json"))),(0,i.kt)("p",null,"If ",(0,i.kt)("inlineCode",{parentName:"p"},"getFilenamePostfix")," is applied:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"mockProxyMiddleware({\n  recordOptions: {\n    getFilenamePostfix: () => 'postfix'\n  }\n})\n")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"GET /products")," => ",(0,i.kt)("inlineCode",{parentName:"li"},"/GET_products_postfix.json"))),(0,i.kt)("h2",{id:"js-mocks"},"JS mocks"),(0,i.kt)("p",null,"If mock file has ",(0,i.kt)("inlineCode",{parentName:"p"},"js")," extension, it must return middleware function ",(0,i.kt)("inlineCode",{parentName:"p"},"(ctx, next) => Promise"),"."),(0,i.kt)("p",null,"If middleware calls ",(0,i.kt)("inlineCode",{parentName:"p"},"next"),", the library will look for a more specific mock file."),(0,i.kt)("p",null,"Example of index.js file:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"module.export = (ctx, next) => {\n  const { id } = ctx.query;\n  if (!id) {\n    ctx.status = 400;\n    ctx.body = { message: 'Id query param is required!' };\n    return;\n  }\n\n  return next();\n}\n")),(0,i.kt)("h2",{id:"json-mocks"},"JSON mocks"),(0,i.kt)("p",null,"JSON mocks have the following fields:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"code")," (optional) - http status code. 200 by default."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"headers")," (optional) - http response headers (an object with ",(0,i.kt)("inlineCode",{parentName:"li"},"headerName")," as a key, ",(0,i.kt)("inlineCode",{parentName:"li"},"headerValue")," as a value)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"body")," (optional) - http response"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"bodyEncoding")," (optional) - encoding of body field (",(0,i.kt)("inlineCode",{parentName:"li"},"json")," by default). Possible values:",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"json")," - ",(0,i.kt)("inlineCode",{parentName:"li"},"body")," will be stringified in JSON"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"utf-8")," - string in UTF-8"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"base64")," - binary data encoded in base64")))))}c.isMDXComponent=!0}}]);