import{j as e}from"./jsx-runtime-DybDIJL1.js";import{I as r}from"./Input-LZYlLl8J.js";import"./iframe-CvCZTrg7.js";import"./tw-merge-Ds6tgvmq.js";const R={title:"Base/Input",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","filled","outline"],description:"The visual style of the input"},size:{control:"select",options:["sm","md","lg"],description:"The size of the input"},error:{control:"boolean",description:"Whether the input is in an error state"},errorMessage:{control:"text",description:"Error message to display when error is true"},label:{control:"text",description:"Label text for the input"},disabled:{control:"boolean",description:"Whether the input is disabled"},placeholder:{control:"text",description:"Placeholder text for the input"}}},a={args:{placeholder:"Enter text..."}},s={args:{label:"Username",placeholder:"Enter your username"}},t={args:{variant:"filled",placeholder:"Filled input..."}},l={args:{variant:"outline",placeholder:"Outline input..."}},o={args:{size:"sm",placeholder:"Small input..."}},n={args:{size:"lg",placeholder:"Large input..."}},i={args:{error:!0,errorMessage:"This field is required",placeholder:"Error state..."}},p={args:{disabled:!0,placeholder:"Disabled input..."}},c={render:()=>e.jsxs("div",{className:"space-y-4 w-64",children:[e.jsx(r,{placeholder:"Default input"}),e.jsx(r,{variant:"filled",placeholder:"Filled input"}),e.jsx(r,{variant:"outline",placeholder:"Outline input"}),e.jsx(r,{size:"sm",placeholder:"Small input"}),e.jsx(r,{size:"lg",placeholder:"Large input"}),e.jsx(r,{error:!0,errorMessage:"This field is required",placeholder:"Error state"}),e.jsx(r,{disabled:!0,placeholder:"Disabled input"}),e.jsx(r,{label:"Username",placeholder:"With label"})]})};var d,u,m;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    placeholder: "Enter text..."
  }
}`,...(m=(u=a.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var h,g,b;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    label: "Username",
    placeholder: "Enter your username"
  }
}`,...(b=(g=s.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var f,x,S;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    variant: "filled",
    placeholder: "Filled input..."
  }
}`,...(S=(x=t.parameters)==null?void 0:x.docs)==null?void 0:S.source}}};var v,E,j;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    variant: "outline",
    placeholder: "Outline input..."
  }
}`,...(j=(E=l.parameters)==null?void 0:E.docs)==null?void 0:j.source}}};var I,z,D;o.parameters={...o.parameters,docs:{...(I=o.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    size: "sm",
    placeholder: "Small input..."
  }
}`,...(D=(z=o.parameters)==null?void 0:z.docs)==null?void 0:D.source}}};var L,y,O;n.parameters={...n.parameters,docs:{...(L=n.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    size: "lg",
    placeholder: "Large input..."
  }
}`,...(O=(y=n.parameters)==null?void 0:y.docs)==null?void 0:O.source}}};var T,F,W;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    error: true,
    errorMessage: "This field is required",
    placeholder: "Error state..."
  }
}`,...(W=(F=i.parameters)==null?void 0:F.docs)==null?void 0:W.source}}};var M,q,U;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    disabled: true,
    placeholder: "Disabled input..."
  }
}`,...(U=(q=p.parameters)==null?void 0:q.docs)==null?void 0:U.source}}};var w,A,N;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-64">
      <Input placeholder="Default input" />
      <Input variant="filled" placeholder="Filled input" />
      <Input variant="outline" placeholder="Outline input" />
      <Input size="sm" placeholder="Small input" />
      <Input size="lg" placeholder="Large input" />
      <Input error errorMessage="This field is required" placeholder="Error state" />
      <Input disabled placeholder="Disabled input" />
      <Input label="Username" placeholder="With label" />
    </div>
}`,...(N=(A=c.parameters)==null?void 0:A.docs)==null?void 0:N.source}}};const k=["Default","WithLabel","Filled","Outline","Small","Large","Error","Disabled","AllVariants"];export{c as AllVariants,a as Default,p as Disabled,i as Error,t as Filled,n as Large,l as Outline,o as Small,s as WithLabel,k as __namedExportsOrder,R as default};
