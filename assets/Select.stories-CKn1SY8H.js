import{j as o}from"./jsx-runtime-DEBomnog.js";import{S as p}from"./Select-DzlGyutY.js";import"./iframe-D9LwMJHb.js";import"./index-1RjEUIMD.js";import"./index-265QdNlj.js";import"./tw-merge-Ds6tgvmq.js";import"./proxy-JAQPZyJa.js";const R={title:"Base/Select",component:p,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:"select",options:["sm","md","lg"],description:"Size of the select input"},error:{control:"boolean",description:"Whether the select is in error state"},disabled:{control:"boolean",description:"Whether the select is disabled"}}},t=[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"},{value:"option4",label:"Option 4",disabled:!0},{value:"option5",label:"Option 5"}],a={args:{value:"option1",options:t,label:"Select an option",onChange:e=>console.log("Selected:",e.target.value)}},n={args:{value:"",options:t,label:"Select an option",error:!0,errorMessage:"Please select an option",onChange:e=>console.log("Selected:",e.target.value)}},l={args:{value:"option1",options:t,label:"Select an option",disabled:!0,onChange:e=>console.log("Selected:",e.target.value)}},s={render:()=>o.jsxs("div",{className:"space-y-4",children:[o.jsx(p,{value:"option1",options:t,label:"Small Select",size:"sm",onChange:e=>console.log("Selected:",e.target.value)}),o.jsx(p,{value:"option1",options:t,label:"Medium Select",size:"md",onChange:e=>console.log("Selected:",e.target.value)}),o.jsx(p,{value:"option1",options:t,label:"Large Select",size:"lg",onChange:e=>console.log("Selected:",e.target.value)})]})},r={args:{value:"option1",options:t,onChange:e=>console.log("Selected:",e.target.value)}},i={args:{value:"option1",label:"Select with custom options",onChange:e=>console.log("Selected:",e.target.value),children:o.jsxs(o.Fragment,{children:[o.jsx("option",{value:"option1",children:"Custom Option 1"}),o.jsx("option",{value:"option2",children:"Custom Option 2"}),o.jsx("option",{value:"option3",children:"Custom Option 3"})]})}},c={parameters:{themes:{defaultTheme:"dark"}},args:{value:"option1",options:t,label:"Select in dark mode",onChange:e=>console.log("Selected:",e.target.value)}};var u,d,g;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    value: "option1",
    options,
    label: "Select an option",
    onChange: e => console.log("Selected:", e.target.value)
  }
}`,...(g=(d=a.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};var m,S,v;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    value: "",
    options,
    label: "Select an option",
    error: true,
    errorMessage: "Please select an option",
    onChange: e => console.log("Selected:", e.target.value)
  }
}`,...(v=(S=n.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};var h,b,C;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    value: "option1",
    options,
    label: "Select an option",
    disabled: true,
    onChange: e => console.log("Selected:", e.target.value)
  }
}`,...(C=(b=l.parameters)==null?void 0:b.docs)==null?void 0:C.source}}};var O,f,x;s.parameters={...s.parameters,docs:{...(O=s.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <Select value="option1" options={options} label="Small Select" size="sm" onChange={e => console.log("Selected:", e.target.value)} />
      <Select value="option1" options={options} label="Medium Select" size="md" onChange={e => console.log("Selected:", e.target.value)} />
      <Select value="option1" options={options} label="Large Select" size="lg" onChange={e => console.log("Selected:", e.target.value)} />
    </div>
}`,...(x=(f=s.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var j,z,D;r.parameters={...r.parameters,docs:{...(j=r.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    value: "option1",
    options,
    onChange: e => console.log("Selected:", e.target.value)
  }
}`,...(D=(z=r.parameters)==null?void 0:z.docs)==null?void 0:D.source}}};var W,k,M;i.parameters={...i.parameters,docs:{...(W=i.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    value: "option1",
    label: "Select with custom options",
    onChange: e => console.log("Selected:", e.target.value),
    children: <>
        <option value="option1">Custom Option 1</option>
        <option value="option2">Custom Option 2</option>
        <option value="option3">Custom Option 3</option>
      </>
  }
}`,...(M=(k=i.parameters)==null?void 0:k.docs)==null?void 0:M.source}}};var y,E,L;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
  parameters: {
    themes: {
      defaultTheme: "dark"
    }
  },
  args: {
    value: "option1",
    options,
    label: "Select in dark mode",
    onChange: e => console.log("Selected:", e.target.value)
  }
}`,...(L=(E=c.parameters)==null?void 0:E.docs)==null?void 0:L.source}}};const q=["Default","WithError","Disabled","DifferentSizes","WithoutLabel","WithCustomOptions","DarkMode"];export{c as DarkMode,a as Default,s as DifferentSizes,l as Disabled,i as WithCustomOptions,n as WithError,r as WithoutLabel,q as __namedExportsOrder,R as default};
