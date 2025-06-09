import{j as e}from"./jsx-runtime-DSEU96bk.js";import{t as u}from"./tw-merge-Ds6tgvmq.js";import{B as K}from"./Button-D_r2u3Iw.js";import{I as t}from"./Icon-BXljKVba.js";import"./iframe-COMYaoSe.js";const O=({className:V,variant:r="info",dismissible:$=!1,onDismiss:B,title:h,showIcon:Y=!0,children:F,...M})=>{const R="relative rounded-lg p-4 mb-4 transition-colors duration-200",G={info:"bg-blue-50 text-blue-800 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-800",success:"bg-green-50 text-green-800 border border-green-100 dark:bg-green-900/30 dark:text-green-100 dark:border-green-800",warning:"bg-yellow-50 text-yellow-800 border border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-100 dark:border-yellow-800",error:"bg-red-50 text-red-800 border border-red-100 dark:bg-red-900/30 dark:text-red-100 dark:border-red-800"},s={info:"text-blue-400 dark:text-blue-300",success:"text-green-400 dark:text-green-300",warning:"text-yellow-400 dark:text-yellow-300",error:"text-red-400 dark:text-red-300"},H=u(R,G[r],V),J=()=>{switch(r){case"info":return e.jsx(t,{name:"info",size:"md",className:s[r]});case"success":return e.jsx(t,{name:"check",size:"md",className:s[r]});case"warning":return e.jsx(t,{name:"warning",size:"md",className:s[r]});case"error":return e.jsx(t,{name:"error",size:"md",className:s[r]})}};return e.jsx("div",{className:H,role:"alert",...M,children:e.jsxs("div",{className:"flex",children:[Y&&e.jsx("div",{className:u("flex-shrink-0 mr-3",s[r]),children:J()}),e.jsxs("div",{className:"flex-1",children:[h&&e.jsx("h3",{className:"text-sm font-medium mb-1",children:h}),e.jsx("div",{className:"text-sm opacity-90",children:F})]}),$&&e.jsx(K,{variant:"ghost",size:"sm",className:u("flex-shrink-0 ml-3 w-5 h-5 p-0 min-w-0",`text-${r}-500 hover:bg-${r}-100 dark:hover:bg-${r}-900/50`),onClick:B,"aria-label":"Dismiss",children:e.jsx(t,{name:"close",size:"sm"})})]})})};O.__docgenInfo={description:"",methods:[],displayName:"Alert",props:{variant:{required:!1,tsType:{name:"union",raw:'"info" | "success" | "warning" | "error"',elements:[{name:"literal",value:'"info"'},{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"error"'}]},description:"The variant of the alert",defaultValue:{value:'"info"',computed:!1}},dismissible:{required:!1,tsType:{name:"boolean"},description:"Whether the alert is dismissible",defaultValue:{value:"false",computed:!1}},onDismiss:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when the alert is dismissed"},title:{required:!1,tsType:{name:"string"},description:"The title of the alert"},showIcon:{required:!1,tsType:{name:"boolean"},description:"Whether to show an icon",defaultValue:{value:"true",computed:!1}}}};const re={title:"Feedback/Alert",component:O,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["info","success","warning","error"],description:"The variant of the alert"},dismissible:{control:"boolean",description:"Whether the alert is dismissible"},showIcon:{control:"boolean",description:"Whether to show an icon"},title:{control:"text",description:"The title of the alert"},onDismiss:{action:"dismissed",description:"Callback when the alert is dismissed"}}},a={args:{children:"This is a default alert message.",variant:"info"}},n={args:{title:"Alert Title",children:"This is an alert with a title.",variant:"info"}},i={args:{title:"Success",children:"Operation completed successfully!",variant:"success"}},o={args:{title:"Warning",children:"Please be careful with this action.",variant:"warning"}},l={args:{title:"Error",children:"Something went wrong. Please try again.",variant:"error"}},c={args:{title:"Dismissible Alert",children:"You can dismiss this alert by clicking the close button.",variant:"info",dismissible:!0}},d={args:{title:"No Icon",children:"This alert does not show an icon.",variant:"info",showIcon:!1}},m={args:{title:"Long Content Alert",children:"This is a longer alert message that might span multiple lines. It demonstrates how the alert component handles content that requires more vertical space. The component should maintain its visual consistency and readability even with extended content.",variant:"info"}};var g,p,b;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    children: "This is a default alert message.",
    variant: "info"
  }
}`,...(b=(p=a.parameters)==null?void 0:p.docs)==null?void 0:b.source}}};var f,w,x;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    title: "Alert Title",
    children: "This is an alert with a title.",
    variant: "info"
  }
}`,...(x=(w=n.parameters)==null?void 0:w.docs)==null?void 0:x.source}}};var v,y,k;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    title: "Success",
    children: "Operation completed successfully!",
    variant: "success"
  }
}`,...(k=(y=i.parameters)==null?void 0:y.docs)==null?void 0:k.source}}};var T,j,I;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    title: "Warning",
    children: "Please be careful with this action.",
    variant: "warning"
  }
}`,...(I=(j=o.parameters)==null?void 0:j.docs)==null?void 0:I.source}}};var N,S,W;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    title: "Error",
    children: "Something went wrong. Please try again.",
    variant: "error"
  }
}`,...(W=(S=l.parameters)==null?void 0:S.docs)==null?void 0:W.source}}};var C,A,D;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    title: "Dismissible Alert",
    children: "You can dismiss this alert by clicking the close button.",
    variant: "info",
    dismissible: true
  }
}`,...(D=(A=c.parameters)==null?void 0:A.docs)==null?void 0:D.source}}};var q,z,E;d.parameters={...d.parameters,docs:{...(q=d.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    title: "No Icon",
    children: "This alert does not show an icon.",
    variant: "info",
    showIcon: false
  }
}`,...(E=(z=d.parameters)==null?void 0:z.docs)==null?void 0:E.source}}};var L,P,_;m.parameters={...m.parameters,docs:{...(L=m.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    title: "Long Content Alert",
    children: "This is a longer alert message that might span multiple lines. It demonstrates how the alert component handles content that requires more vertical space. The component should maintain its visual consistency and readability even with extended content.",
    variant: "info"
  }
}`,...(_=(P=m.parameters)==null?void 0:P.docs)==null?void 0:_.source}}};const se=["Default","WithTitle","Success","Warning","Error","Dismissible","WithoutIcon","LongContent"];export{a as Default,c as Dismissible,l as Error,m as LongContent,i as Success,o as Warning,n as WithTitle,d as WithoutIcon,se as __namedExportsOrder,re as default};
