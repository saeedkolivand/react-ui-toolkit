import{j as e}from"./jsx-runtime-DybDIJL1.js";import{t as ce}from"./tw-merge-Ds6tgvmq.js";import{B as de}from"./Button-DfD0SiUp.js";import"./iframe-CvCZTrg7.js";import"./Icon-wvQ8gbJo.js";const r=({className:ee,size:re="md",variant:ae="primary",label:se="Loading...",...ne})=>{const ie="inline-block animate-spin rounded-full border-2 border-current border-t-transparent",oe={sm:"h-4 w-4",md:"h-6 w-6",lg:"h-8 w-8"},te={primary:"text-primary-600",secondary:"text-gray-600",success:"text-green-600",warning:"text-yellow-600",error:"text-red-600"},le=ce(ie,oe[re],te[ae],ee);return e.jsxs("div",{role:"status",...ne,children:[e.jsx("div",{className:le}),e.jsx("span",{className:"sr-only",children:se})]})};r.__docgenInfo={description:"",methods:[],displayName:"Spinner",props:{size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"The size of the spinner",defaultValue:{value:'"md"',computed:!1}},variant:{required:!1,tsType:{name:"union",raw:'"primary" | "secondary" | "success" | "warning" | "error"',elements:[{name:"literal",value:'"primary"'},{name:"literal",value:'"secondary"'},{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"error"'}]},description:"The variant of the spinner",defaultValue:{value:'"primary"',computed:!1}},label:{required:!1,tsType:{name:"string"},description:"The label for screen readers",defaultValue:{value:'"Loading..."',computed:!1}}}};const ve={title:"Feedback/Spinner",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:"select",options:["sm","md","lg"],description:"The size of the spinner"},variant:{control:"select",options:["primary","secondary","success","warning","error"],description:"The variant of the spinner"},label:{control:"text",description:"The label for screen readers"}}},a={args:{label:"Loading..."}},s={args:{size:"sm",label:"Loading..."}},n={args:{size:"lg",label:"Loading..."}},i={args:{variant:"primary",label:"Loading..."}},o={args:{variant:"secondary",label:"Loading..."}},t={args:{variant:"success",label:"Loading..."}},l={args:{variant:"warning",label:"Loading..."}},c={args:{variant:"error",label:"Loading..."}},d={args:{label:"Processing your request..."}},m={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(r,{size:"sm",label:"Small spinner"}),e.jsx(r,{size:"md",label:"Medium spinner"}),e.jsx(r,{size:"lg",label:"Large spinner"})]})},p={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(r,{variant:"primary",label:"Primary spinner"}),e.jsx(r,{variant:"secondary",label:"Secondary spinner"}),e.jsx(r,{variant:"success",label:"Success spinner"}),e.jsx(r,{variant:"warning",label:"Warning spinner"}),e.jsx(r,{variant:"error",label:"Error spinner"})]})},u={render:()=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(r,{size:"sm",label:"Loading"}),e.jsx("span",{className:"text-sm text-gray-600",children:"Loading..."})]})},g={render:()=>e.jsx(de,{loading:!0,disabled:!0,children:"Processing..."})};var b,v,y;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    label: "Loading..."
  }
}`,...(y=(v=a.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var x,S,f;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    size: "sm",
    label: "Loading..."
  }
}`,...(f=(S=s.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};var L,h,j;n.parameters={...n.parameters,docs:{...(L=n.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    size: "lg",
    label: "Loading..."
  }
}`,...(j=(h=n.parameters)==null?void 0:h.docs)==null?void 0:j.source}}};var z,w,T;i.parameters={...i.parameters,docs:{...(z=i.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    label: "Loading..."
  }
}`,...(T=(w=i.parameters)==null?void 0:w.docs)==null?void 0:T.source}}};var N,P,W;o.parameters={...o.parameters,docs:{...(N=o.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    variant: "secondary",
    label: "Loading..."
  }
}`,...(W=(P=o.parameters)==null?void 0:P.docs)==null?void 0:W.source}}};var B,E,q;t.parameters={...t.parameters,docs:{...(B=t.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    variant: "success",
    label: "Loading..."
  }
}`,...(q=(E=t.parameters)==null?void 0:E.docs)==null?void 0:q.source}}};var C,V,A;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    variant: "warning",
    label: "Loading..."
  }
}`,...(A=(V=l.parameters)==null?void 0:V.docs)==null?void 0:A.source}}};var _,I,M;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    variant: "error",
    label: "Loading..."
  }
}`,...(M=(I=c.parameters)==null?void 0:I.docs)==null?void 0:M.source}}};var k,D,F;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: "Processing your request..."
  }
}`,...(F=(D=d.parameters)==null?void 0:D.docs)==null?void 0:F.source}}};var O,R,G;m.parameters={...m.parameters,docs:{...(O=m.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Spinner size="sm" label="Small spinner" />
      <Spinner size="md" label="Medium spinner" />
      <Spinner size="lg" label="Large spinner" />
    </div>
}`,...(G=(R=m.parameters)==null?void 0:R.docs)==null?void 0:G.source}}};var H,J,K;p.parameters={...p.parameters,docs:{...(H=p.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Spinner variant="primary" label="Primary spinner" />
      <Spinner variant="secondary" label="Secondary spinner" />
      <Spinner variant="success" label="Success spinner" />
      <Spinner variant="warning" label="Warning spinner" />
      <Spinner variant="error" label="Error spinner" />
    </div>
}`,...(K=(J=p.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,U,X;u.parameters={...u.parameters,docs:{...(Q=u.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-2">
      <Spinner size="sm" label="Loading" />
      <span className="text-sm text-gray-600">Loading...</span>
    </div>
}`,...(X=(U=u.parameters)==null?void 0:U.docs)==null?void 0:X.source}}};var Y,Z,$;g.parameters={...g.parameters,docs:{...(Y=g.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <Button loading disabled>
      Processing...
    </Button>
}`,...($=(Z=g.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};const ye=["Default","Small","Large","Primary","Secondary","Success","Warning","Error","WithCustomLabel","AllSizes","AllVariants","WithText","InButton"];export{m as AllSizes,p as AllVariants,a as Default,c as Error,g as InButton,n as Large,i as Primary,o as Secondary,s as Small,t as Success,l as Warning,d as WithCustomLabel,u as WithText,ye as __namedExportsOrder,ve as default};
