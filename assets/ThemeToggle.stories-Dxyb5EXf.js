import{j as e}from"./jsx-runtime-kY6nksJd.js";import{u as x,T}from"./ThemeContext-DGayV1N1.js";import{B as j}from"./Button-DG3n9DdH.js";import"./iframe-BTFKCMRb.js";import"./tw-merge-Ds6tgvmq.js";const f=()=>{const{theme:s,toggleTheme:r}=x();return{theme:s,isDarkMode:s==="dark",isLightMode:s==="light",toggleTheme:r,setDarkMode:()=>{s!=="dark"&&r()},setLightMode:()=>{s!=="light"&&r()}}},t=()=>{const{isDarkMode:s,toggleTheme:r}=f();return e.jsx(j,{onClick:r,variant:"ghost",size:"sm",className:"flex items-center gap-2",children:s?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"text-lg",children:"🌞"}),e.jsx("span",{children:"Light Mode"})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"text-lg",children:"🌙"}),e.jsx("span",{children:"Dark Mode"})]})})};t.__docgenInfo={description:"",methods:[],displayName:"ThemeToggle"};const _={title:"Utils/Theme/ThemeToggle",component:t,decorators:[s=>e.jsx(T,{children:e.jsx("div",{className:"p-4",children:e.jsx(s,{})})})],parameters:{layout:"centered"},tags:["autodocs"]},o={render:()=>e.jsx(t,{})},a={render:()=>e.jsx("div",{className:"fixed top-4 right-4",children:e.jsx(t,{})})},i={render:()=>e.jsx("div",{className:"scale-150",children:e.jsx(t,{})})};var n,c,d;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <ThemeToggle />
}`,...(d=(c=o.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var m,l,h;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div className="fixed top-4 right-4">
      <ThemeToggle />
    </div>
}`,...(h=(l=a.parameters)==null?void 0:l.docs)==null?void 0:h.source}}};var g,p,u;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="scale-150">
      <ThemeToggle />
    </div>
}`,...(u=(p=i.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};const z=["Default","WithCustomPosition","WithCustomSize"];export{o as Default,a as WithCustomPosition,i as WithCustomSize,z as __namedExportsOrder,_ as default};
