import{j as e}from"./jsx-runtime-DybDIJL1.js";import{R as Q}from"./iframe-CvCZTrg7.js";import{t as g}from"./tw-merge-Ds6tgvmq.js";const r=Q.forwardRef(({className:I,label:b,error:u=!1,errorMessage:p,size:h="md",disabled:n,...F},G)=>{const H="rounded border transition-colors duration-200 focus:outline-none focus:ring-0 focus:ring-offset-0 dark:focus:ring-offset-gray-800",J={sm:"h-4 w-4",md:"h-5 w-5",lg:"h-6 w-6"},K={sm:"text-sm",md:"text-base",lg:"text-lg"},m={default:"border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:text-primary-400 dark:focus:ring-primary-400 dark:bg-gray-800",error:"border-red-500 text-red-600 focus:ring-red-500 dark:border-red-400 dark:text-red-400 dark:focus:ring-red-400",disabled:"opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700"},P=g(H,J[h],u?m.error:m.default,n&&m.disabled,I);return e.jsxs("div",{className:"flex flex-col",children:[e.jsxs("label",{className:"inline-flex items-center",children:[e.jsx("input",{type:"checkbox",className:P,disabled:n,ref:G,...F}),b&&e.jsx("span",{className:g("ml-2",K[h],"text-gray-900 dark:text-gray-100",n&&"text-gray-500 dark:text-gray-400"),children:b})]}),u&&p&&e.jsx("p",{className:"mt-1 text-sm text-red-600 dark:text-red-400",children:p})]})});r.displayName="Checkbox";r.__docgenInfo={description:"",methods:[],displayName:"Checkbox",props:{label:{required:!1,tsType:{name:"string"},description:"Label for the checkbox"},error:{required:!1,tsType:{name:"boolean"},description:"Error state",defaultValue:{value:"false",computed:!1}},errorMessage:{required:!1,tsType:{name:"string"},description:"Error message"},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"The size of the checkbox",defaultValue:{value:'"md"',computed:!1}}},composes:["Omit"]};const Z={title:"Base/Checkbox",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{label:{control:"text",description:"Label text for the checkbox"},size:{control:"select",options:["sm","md","lg"],description:"The size of the checkbox"},error:{control:"boolean",description:"Whether the checkbox is in an error state"},errorMessage:{control:"text",description:"Error message to display when error is true"},disabled:{control:"boolean",description:"Whether the checkbox is disabled"},checked:{control:"boolean",description:"Whether the checkbox is checked"}}},s={args:{label:"Checkbox"}},a={args:{label:"Checked",checked:!0}},o={args:{label:"Small",size:"sm"}},l={args:{label:"Large",size:"lg"}},t={args:{label:"Error",error:!0,errorMessage:"This field is required"}},c={args:{label:"Disabled",disabled:!0}},d={args:{label:"Disabled Checked",disabled:!0,checked:!0}},i={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsx(r,{label:"Default"}),e.jsx(r,{label:"Checked",checked:!0}),e.jsx(r,{label:"Small",size:"sm"}),e.jsx(r,{label:"Large",size:"lg"}),e.jsx(r,{label:"Error",error:!0,errorMessage:"This field is required"}),e.jsx(r,{label:"Disabled",disabled:!0}),e.jsx(r,{label:"Disabled Checked",disabled:!0,checked:!0})]})};var x,k,f;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    label: "Checkbox"
  }
}`,...(f=(k=s.parameters)==null?void 0:k.docs)==null?void 0:f.source}}};var C,y,D;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    label: "Checked",
    checked: true
  }
}`,...(D=(y=a.parameters)==null?void 0:y.docs)==null?void 0:D.source}}};var j,S,z;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    label: "Small",
    size: "sm"
  }
}`,...(z=(S=o.parameters)==null?void 0:S.docs)==null?void 0:z.source}}};var E,T,v;l.parameters={...l.parameters,docs:{...(E=l.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    label: "Large",
    size: "lg"
  }
}`,...(v=(T=l.parameters)==null?void 0:T.docs)==null?void 0:v.source}}};var N,q,w;t.parameters={...t.parameters,docs:{...(N=t.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    label: "Error",
    error: true,
    errorMessage: "This field is required"
  }
}`,...(w=(q=t.parameters)==null?void 0:q.docs)==null?void 0:w.source}}};var L,M,R;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    label: "Disabled",
    disabled: true
  }
}`,...(R=(M=c.parameters)==null?void 0:M.docs)==null?void 0:R.source}}};var V,_,W;d.parameters={...d.parameters,docs:{...(V=d.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    label: "Disabled Checked",
    disabled: true,
    checked: true
  }
}`,...(W=(_=d.parameters)==null?void 0:_.docs)==null?void 0:W.source}}};var A,O,B;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <Checkbox label="Default" />
      <Checkbox label="Checked" checked />
      <Checkbox label="Small" size="sm" />
      <Checkbox label="Large" size="lg" />
      <Checkbox label="Error" error errorMessage="This field is required" />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled Checked" disabled checked />
    </div>
}`,...(B=(O=i.parameters)==null?void 0:O.docs)==null?void 0:B.source}}};const $=["Default","Checked","Small","Large","Error","Disabled","DisabledChecked","AllVariants"];export{i as AllVariants,a as Checked,s as Default,c as Disabled,d as DisabledChecked,t as Error,l as Large,o as Small,$ as __namedExportsOrder,Z as default};
