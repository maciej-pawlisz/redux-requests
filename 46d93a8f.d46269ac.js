(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{118:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return s})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return u}));var r=n(1),i=n(6),o=(n(0),n(149)),a={title:"Server side rendering"},s={id:"guides/server-side-rendering",title:"Server side rendering",description:"## What is server side rendering?",source:"@site/docs/guides/server-side-rendering.md",permalink:"/redux-requests/docs/guides/server-side-rendering",editUrl:"https://github.com/klis87/redux-requests/edit/master/docusaurus/docs/guides/server-side-rendering.md",lastUpdatedBy:"klis87",lastUpdatedAt:1593953995,sidebar:"docs",previous:{title:"Selectors",permalink:"/redux-requests/docs/guides/selectors"},next:{title:"Usage with redux-saga",permalink:"/redux-requests/docs/guides/usage-with-redux-saga"}},c=[{value:"What is server side rendering?",id:"what-is-server-side-rendering",children:[]},{value:"Prerequisites",id:"prerequisites",children:[]},{value:"Basic setup",id:"basic-setup",children:[]},{value:"How does it work?",id:"how-does-it-work",children:[]}],d={rightToc:c};function u(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},d,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h2",{id:"what-is-server-side-rendering"},"What is server side rendering?"),Object(o.b)("p",null,"Like its name suggests, it is just a way to render you app on the server side. Why\nwould you do that for single page application? There are many reasons, like SEO,\nimproving performance in some cases, static rendering like in Gatsby and probably many\nothers."),Object(o.b)("p",null,"Anyway server side rendering is a very complex topic and there are many ways how to go about it.\nMany people use the strategy around React components, for instance they attach static methods to components which\nmake requests and return promises with responses, then they wrap them in ",Object(o.b)("inlineCode",{parentName:"p"},"Promise.all"),". I don't recommend this strategy\nwhen using Redux, because this requires additional code and potentially double rendering on server, but if you really want\nto do it, it is possible as dispatched request actions return promise resolved with response."),Object(o.b)("p",null,"However, this guide won't be for introducing server side rendering, it will show alternative\nstrategies for SSR with the help of this library. You don't need to use any of them,\nbut you might want to check them out as they could potentially simplify your SSR apps."),Object(o.b)("h2",{id:"prerequisites"},"Prerequisites"),Object(o.b)("p",null,"Before we begin, be advised that this strategy requires to dispatch request actions on Redux level, at least those which have to be\nfired on application load. So for instance you cannot dispatch them inside React ",Object(o.b)("inlineCode",{parentName:"p"},"componentDidMount"),"\nor in ",Object(o.b)("inlineCode",{parentName:"p"},"useEffect"),". The obvious place to dispatch them is in the place you create store, like ",Object(o.b)("inlineCode",{parentName:"p"},"store.dispatch(fetchBooks())"),". However, what if your app has multiple routes, and each route has to send different requests?\nWell, you need to make Redux aware of current route. I recommend to use a router with first class support for\nRedux, namely ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://github.com/faceyspacey/redux-first-router"}),"redux-first-router"),".\nIf you use ",Object(o.b)("inlineCode",{parentName:"p"},"react-router")," though, it is fine too, you just need to integrate it with Redux with\n",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://github.com/supasate/connected-react-router"}),"connected-react-router")," or\n",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://github.com/salvoravida/redux-first-history"}),"redux-first-history"),". Then you\ncould listen to route change actions and dispatch proper request actions, for example\nfrom middleware, sagas, just whatever you use."),Object(o.b)("h2",{id:"basic-setup"},"Basic setup"),Object(o.b)("p",null,"On the server you need to pass ",Object(o.b)("inlineCode",{parentName:"p"},"ssr: 'server'")," to ",Object(o.b)("inlineCode",{parentName:"p"},"handleRequests")," when running on\nthe server (to resolve/reject ",Object(o.b)("inlineCode",{parentName:"p"},"requestsPromise")," in the right time) and ",Object(o.b)("inlineCode",{parentName:"p"},"ssr: 'client'"),"\non the client (not to repeat requests again on the client which we run on the server)\noption to ",Object(o.b)("inlineCode",{parentName:"p"},"handleRequests"),". Here you can see a possible implementation:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),"import { createStore, applyMiddleware, combineReducers } from 'redux';\nimport axios from 'axios';\nimport { handleRequests } from '@redux-requests/core';\nimport { createDriver } from '@redux-requests/axios';\n\nimport { fetchBooks } from './actions';\n\nexport const configureStore = (initialState = undefined) => {\n  const ssr = !initialState; // if initialState is not passed, it means we run it on server\n\n  const {\n    requestsReducer,\n    requestsMiddleware,\n    requestsPromise,\n  } = handleRequests({\n    driver: createDriver(\n      axios.create({\n        baseURL: 'http://localhost:3000',\n      }),\n    ),\n    ssr: ssr ? 'server' : 'client',\n  });\n\n  const reducers = combineReducers({\n    requests: requestsReducer,\n  });\n\n  const store = createStore(\n    reducers,\n    initialState,\n    applyMiddleware(...requestsMiddleware),\n  );\n\n  store.dispatch(fetchBooks());\n  return { store, requestsPromise };\n};\n\n// on the server\nimport React from 'react';\nimport { renderToString } from 'react-dom/server';\nimport { Provider } from 'react-redux';\n\n// in an express/another server handler\nconst { store, requestsPromise } = configureStore();\n\nrequestsPromise\n  .then(() => {\n    const html = renderToString(\n      <Provider store={store}>\n        <App />\n      </Provider>,\n    );\n\n    res.render('index', {\n      html,\n      initialState: JSON.stringify(store.getState()),\n    });\n  })\n  .catch(e => {\n    console.log('error', e);\n    res.status(400).send('something went wrong');\n    // you can also render React too, like for 404 error\n  });\n")),Object(o.b)("p",null,"As you can see, compared to what you would normally do in SSR for redux app, you only need to\npass the extra ",Object(o.b)("inlineCode",{parentName:"p"},"ssr")," option to ",Object(o.b)("inlineCode",{parentName:"p"},"handleRequests")," and wait for ",Object(o.b)("inlineCode",{parentName:"p"},"requestsPromise")," to be resolved."),Object(o.b)("h2",{id:"how-does-it-work"},"How does it work?"),Object(o.b)("p",null,"But how does it work? The logic is based on an internal counter. Initially it is set to ",Object(o.b)("inlineCode",{parentName:"p"},"0")," and is\nincreased by ",Object(o.b)("inlineCode",{parentName:"p"},"1")," after each request is initialized. Then, after each response it is decreased by ",Object(o.b)("inlineCode",{parentName:"p"},"1"),". So, initially after a first\nrequest it gets positive and after all requests are finished, its value is again set back to ",Object(o.b)("inlineCode",{parentName:"p"},"0"),". And this is the moment\nwhich means that all requests are finished and ",Object(o.b)("inlineCode",{parentName:"p"},"requestsPromise")," is resolved (with all success actions)."),Object(o.b)("p",null,"In case of any request error, ",Object(o.b)("inlineCode",{parentName:"p"},"requestsPromise")," will be rejected with object ",Object(o.b)("inlineCode",{parentName:"p"},"{ errorActions: [], successActions: [] }"),"."),Object(o.b)("p",null,"There is also more complex case. Imagine you have a request ",Object(o.b)("inlineCode",{parentName:"p"},"x"),", after which you would like to dispatch\nanother ",Object(o.b)("inlineCode",{parentName:"p"},"y"),". You cannot do it immediately because ",Object(o.b)("inlineCode",{parentName:"p"},"y")," requires some information from ",Object(o.b)("inlineCode",{parentName:"p"},"x")," response.\nAbove algorythm would not wait for ",Object(o.b)("inlineCode",{parentName:"p"},"y")," to be finished, because on ",Object(o.b)("inlineCode",{parentName:"p"},"x")," response counter would be\nalready reset to ",Object(o.b)("inlineCode",{parentName:"p"},"0"),". There are two ",Object(o.b)("inlineCode",{parentName:"p"},"action.meta")," attributes to help here:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"dependentRequestsNumber")," - a positive integer, a number of requests which will be fired after this one,\nin above example we would put ",Object(o.b)("inlineCode",{parentName:"li"},"dependentRequestsNumber: 1")," to ",Object(o.b)("inlineCode",{parentName:"li"},"x")," action, because only ",Object(o.b)("inlineCode",{parentName:"li"},"y")," depends on ",Object(o.b)("inlineCode",{parentName:"li"},"x")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"isDependentRequest")," - mark a request as ",Object(o.b)("inlineCode",{parentName:"li"},"isDependentRequest: true")," when it depends on another request,\nin our example we would put ",Object(o.b)("inlineCode",{parentName:"li"},"isDependentRequest: true")," to ",Object(o.b)("inlineCode",{parentName:"li"},"y"),", because it depends on ",Object(o.b)("inlineCode",{parentName:"li"},"x"))),Object(o.b)("p",null,"You could even have a more complicated situation, in which you would need to dispatch ",Object(o.b)("inlineCode",{parentName:"p"},"z")," after ",Object(o.b)("inlineCode",{parentName:"p"},"y"),". Then\nyou would also add ",Object(o.b)("inlineCode",{parentName:"p"},"dependentRequestsNumber: 1")," to ",Object(o.b)("inlineCode",{parentName:"p"},"y")," and ",Object(o.b)("inlineCode",{parentName:"p"},"isDependentRequest: true")," to ",Object(o.b)("inlineCode",{parentName:"p"},"z"),". Yes, a request\ncan have both of those attibutes at the same time! Anyway, how does it work? Easy, just a request with\n",Object(o.b)("inlineCode",{parentName:"p"},"dependentRequestsNumber: 2")," would increase counter by ",Object(o.b)("inlineCode",{parentName:"p"},"3")," on request and decrease by ",Object(o.b)("inlineCode",{parentName:"p"},"1")," on response,\nwhile an action with ",Object(o.b)("inlineCode",{parentName:"p"},"isDependentRequest: true")," would increase counter on request by ",Object(o.b)("inlineCode",{parentName:"p"},"1")," as usual but decrease\nit on response by ",Object(o.b)("inlineCode",{parentName:"p"},"2"),". So, the counter will be reset to ",Object(o.b)("inlineCode",{parentName:"p"},"0")," after all requests are finished, also dependent ones."))}u.isMDXComponent=!0},149:function(e,t,n){"use strict";n.d(t,"a",(function(){return l})),n.d(t,"b",(function(){return m}));var r=n(0),i=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var d=i.a.createContext({}),u=function(e){var t=i.a.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):s({},t,{},e)),n},l=function(e){var t=u(e.components);return i.a.createElement(d.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},b=Object(r.forwardRef)((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,a=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),l=u(n),b=r,m=l["".concat(a,".").concat(b)]||l[b]||p[b]||o;return n?i.a.createElement(m,s({ref:t},d,{components:n})):i.a.createElement(m,s({ref:t},d))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,a=new Array(o);a[0]=b;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:r,a[1]=s;for(var d=2;d<o;d++)a[d]=n[d];return i.a.createElement.apply(null,a)}return i.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);