import{j as r}from"./jsx-runtime-C06lrZbP.js";import{t as Br}from"./tw-merge-Ds6tgvmq.js";import"./iframe-DE3FgLuB.js";const e=({className:lr,variant:cr="primary",size:mr="md",rounded:gr=!1,outlined:a=!1,children:pr,...ur})=>{const vr="inline-flex items-center justify-center font-medium transition-colors duration-200",yr={primary:a?"border border-primary-500 text-primary-700 bg-transparent dark:border-primary-400 dark:text-primary-300":"bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300",secondary:a?"border border-gray-500 text-gray-700 bg-transparent dark:border-gray-400 dark:text-gray-300":"bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",success:a?"border border-green-500 text-green-700 bg-transparent dark:border-green-400 dark:text-green-300":"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",warning:a?"border border-yellow-500 text-yellow-700 bg-transparent dark:border-yellow-400 dark:text-yellow-300":"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",error:a?"border border-red-500 text-red-700 bg-transparent dark:border-red-400 dark:text-red-300":"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"},xr={sm:"text-xs px-2 py-0.5",md:"text-sm px-2.5 py-0.5",lg:"text-base px-3 py-1"},hr=gr?"rounded-full":"rounded",fr=Br(vr,yr[cr],xr[mr],hr,lr);return r.jsx("span",{className:fr,...ur,children:pr})};e.__docgenInfo={description:"",methods:[],displayName:"Badge",props:{variant:{required:!1,tsType:{name:"union",raw:'"primary" | "secondary" | "success" | "warning" | "error"',elements:[{name:"literal",value:'"primary"'},{name:"literal",value:'"secondary"'},{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"error"'}]},description:"The variant of the badge",defaultValue:{value:'"primary"',computed:!1}},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"The size of the badge",defaultValue:{value:'"md"',computed:!1}},rounded:{required:!1,tsType:{name:"boolean"},description:"Whether the badge is rounded",defaultValue:{value:"false",computed:!1}},outlined:{required:!1,tsType:{name:"boolean"},description:"Whether the badge is outlined",defaultValue:{value:"false",computed:!1}}}};const jr={title:"Feedback/Badge",component:e,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","success","warning","error"],description:"The variant of the badge"},size:{control:"select",options:["sm","md","lg"],description:"The size of the badge"},rounded:{control:"boolean",description:"Whether the badge is rounded"},outlined:{control:"boolean",description:"Whether the badge is outlined"}}},n={args:{children:"Badge",variant:"primary"}},s={args:{children:"Primary",variant:"primary"}},d={args:{children:"Secondary",variant:"secondary"}},i={args:{children:"Success",variant:"success"}},t={args:{children:"Warning",variant:"warning"}},o={args:{children:"Error",variant:"error"}},l={args:{children:"Outlined",variant:"primary",outlined:!0}},c={args:{children:"Rounded",variant:"primary",rounded:!0}},m={args:{children:"Small",variant:"primary",size:"sm"}},g={args:{children:"Large",variant:"primary",size:"lg"}},p={render:()=>r.jsxs("div",{className:"flex flex-wrap gap-2",children:[r.jsx(e,{variant:"primary",children:"Primary"}),r.jsx(e,{variant:"secondary",children:"Secondary"}),r.jsx(e,{variant:"success",children:"Success"}),r.jsx(e,{variant:"warning",children:"Warning"}),r.jsx(e,{variant:"error",children:"Error"})]})},u={render:()=>r.jsxs("div",{className:"flex items-center gap-2",children:[r.jsx(e,{size:"sm",children:"Small"}),r.jsx(e,{size:"md",children:"Medium"}),r.jsx(e,{size:"lg",children:"Large"})]})},v={render:()=>r.jsxs("div",{className:"flex flex-wrap gap-2",children:[r.jsx(e,{variant:"primary",children:"Default"}),r.jsx(e,{variant:"primary",outlined:!0,children:"Outlined"}),r.jsx(e,{variant:"primary",rounded:!0,children:"Rounded"}),r.jsx(e,{variant:"primary",outlined:!0,rounded:!0,children:"Outlined Rounded"})]})},y={render:()=>r.jsxs("div",{className:"flex flex-wrap gap-2",children:[r.jsx(e,{variant:"primary",children:"1"}),r.jsx(e,{variant:"secondary",children:"42"}),r.jsx(e,{variant:"success",children:"99+"}),r.jsx(e,{variant:"warning",children:"12"}),r.jsx(e,{variant:"error",children:"5"})]})},x={render:()=>r.jsxs("div",{className:"flex flex-wrap gap-2",children:[r.jsxs(e,{variant:"primary",children:[r.jsx("svg",{className:"w-4 h-4 mr-1",fill:"currentColor",viewBox:"0 0 20 20",children:r.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})}),"Success"]}),r.jsxs(e,{variant:"warning",children:[r.jsx("svg",{className:"w-4 h-4 mr-1",fill:"currentColor",viewBox:"0 0 20 20",children:r.jsx("path",{fillRule:"evenodd",d:"M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),"Warning"]}),r.jsxs(e,{variant:"error",children:[r.jsx("svg",{className:"w-4 h-4 mr-1",fill:"currentColor",viewBox:"0 0 20 20",children:r.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})}),"Error"]})]})};var h,f,B;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    children: "Badge",
    variant: "primary"
  }
}`,...(B=(f=n.parameters)==null?void 0:f.docs)==null?void 0:B.source}}};var b,w,S;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    children: "Primary",
    variant: "primary"
  }
}`,...(S=(w=s.parameters)==null?void 0:w.docs)==null?void 0:S.source}}};var j,z,k;d.parameters={...d.parameters,docs:{...(j=d.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    children: "Secondary",
    variant: "secondary"
  }
}`,...(k=(z=d.parameters)==null?void 0:z.docs)==null?void 0:k.source}}};var R,N,L;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    children: "Success",
    variant: "success"
  }
}`,...(L=(N=i.parameters)==null?void 0:N.docs)==null?void 0:L.source}}};var W,M,C;t.parameters={...t.parameters,docs:{...(W=t.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    children: "Warning",
    variant: "warning"
  }
}`,...(C=(M=t.parameters)==null?void 0:M.docs)==null?void 0:C.source}}};var E,O,T;o.parameters={...o.parameters,docs:{...(E=o.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    children: "Error",
    variant: "error"
  }
}`,...(T=(O=o.parameters)==null?void 0:O.docs)==null?void 0:T.source}}};var V,A,P;l.parameters={...l.parameters,docs:{...(V=l.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    children: "Outlined",
    variant: "primary",
    outlined: true
  }
}`,...(P=(A=l.parameters)==null?void 0:A.docs)==null?void 0:P.source}}};var q,D,_;c.parameters={...c.parameters,docs:{...(q=c.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    children: "Rounded",
    variant: "primary",
    rounded: true
  }
}`,...(_=(D=c.parameters)==null?void 0:D.docs)==null?void 0:_.source}}};var I,H,F;m.parameters={...m.parameters,docs:{...(I=m.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    children: "Small",
    variant: "primary",
    size: "sm"
  }
}`,...(F=(H=m.parameters)==null?void 0:H.docs)==null?void 0:F.source}}};var G,J,K;g.parameters={...g.parameters,docs:{...(G=g.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    children: "Large",
    variant: "primary",
    size: "lg"
  }
}`,...(K=(J=g.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,U,X;p.parameters={...p.parameters,docs:{...(Q=p.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
}`,...(X=(U=p.parameters)==null?void 0:U.docs)==null?void 0:X.source}}};var Y,Z,$;u.parameters={...u.parameters,docs:{...(Y=u.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
}`,...($=(Z=u.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var rr,er,ar;v.parameters={...v.parameters,docs:{...(rr=v.parameters)==null?void 0:rr.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Default</Badge>
      <Badge variant="primary" outlined>
        Outlined
      </Badge>
      <Badge variant="primary" rounded>
        Rounded
      </Badge>
      <Badge variant="primary" outlined rounded>
        Outlined Rounded
      </Badge>
    </div>
}`,...(ar=(er=v.parameters)==null?void 0:er.docs)==null?void 0:ar.source}}};var nr,sr,dr;y.parameters={...y.parameters,docs:{...(nr=y.parameters)==null?void 0:nr.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge variant="primary">1</Badge>
      <Badge variant="secondary">42</Badge>
      <Badge variant="success">99+</Badge>
      <Badge variant="warning">12</Badge>
      <Badge variant="error">5</Badge>
    </div>
}`,...(dr=(sr=y.parameters)==null?void 0:sr.docs)==null?void 0:dr.source}}};var ir,tr,or;x.parameters={...x.parameters,docs:{...(ir=x.parameters)==null?void 0:ir.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge variant="primary">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Success
      </Badge>
      <Badge variant="warning">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Warning
      </Badge>
      <Badge variant="error">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        Error
      </Badge>
    </div>
}`,...(or=(tr=x.parameters)==null?void 0:tr.docs)==null?void 0:or.source}}};const zr=["Default","Primary","Secondary","Success","Warning","Error","Outlined","Rounded","Small","Large","AllVariants","AllSizes","AllStyles","WithNumbers","WithIcons"];export{u as AllSizes,v as AllStyles,p as AllVariants,n as Default,o as Error,g as Large,l as Outlined,s as Primary,c as Rounded,d as Secondary,m as Small,i as Success,t as Warning,x as WithIcons,y as WithNumbers,zr as __namedExportsOrder,jr as default};
