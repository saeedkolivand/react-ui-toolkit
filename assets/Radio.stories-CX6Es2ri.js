import{j as e}from"./jsx-runtime-SoHorTFJ.js";import{R as X}from"./iframe-CslfcfHY.js";import{t as g}from"./tw-merge-Ds6tgvmq.js";const a=X.forwardRef(({className:A,label:h,helperText:u,error:r,size:x="md",disabled:b,...s},J)=>{const K={sm:"h-3 w-3",md:"h-4 w-4",lg:"h-5 w-5"},P={sm:"text-sm",md:"text-base",lg:"text-lg"},Q=g("form-radio border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-primary-400 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-800 dark:bg-gray-800",K[x],r&&"border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400",A),U=g("ml-2 font-medium text-gray-700 dark:text-gray-200",P[x],b&&"text-gray-400 dark:text-gray-500",r&&"text-red-500 dark:text-red-400");return e.jsxs("div",{className:"relative",children:[e.jsxs("div",{className:"flex items-start",children:[e.jsx("div",{className:"flex items-center h-5",children:e.jsx("input",{ref:J,type:"radio",className:Q,disabled:b,"aria-invalid":r?"true":"false","aria-describedby":r||u?`${s.id}-description`:void 0,"aria-disabled":b,...s})}),h&&e.jsx("div",{className:"ml-2",children:e.jsx("label",{htmlFor:s.id,className:U,children:h})})]}),(u||r)&&e.jsx("p",{className:g("mt-1 text-sm",r?"text-red-500 dark:text-red-400":"text-gray-500 dark:text-gray-400"),id:`${s.id}-description`,children:r||u})]})});a.displayName="Radio";a.__docgenInfo={description:"",methods:[],displayName:"Radio",props:{label:{required:!1,tsType:{name:"string"},description:"Label for the radio button"},helperText:{required:!1,tsType:{name:"string"},description:"Helper text to be displayed below the radio button"},error:{required:!1,tsType:{name:"string"},description:"Error message to be displayed"},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"The size of the radio button",defaultValue:{value:'"md"',computed:!1}}},composes:["Omit"]};const ae={title:"Base/Radio",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{label:{control:"text",description:"Label text for the radio button"},size:{control:"select",options:["sm","md","lg"],description:"The size of the radio button"},error:{control:"text",description:"Error message to display"},helperText:{control:"text",description:"Helper text to display below the radio button"},disabled:{control:"boolean",description:"Whether the radio button is disabled"},checked:{control:"boolean",description:"Whether the radio button is checked"}}},t={args:{label:"Radio"}},l={args:{label:"Checked",checked:!0}},i={args:{label:"Small",size:"sm"}},o={args:{label:"Large",size:"lg"}},d={args:{label:"With Helper Text",helperText:"This is a helper text"}},n={args:{label:"With Error",error:"This field is required"}},c={args:{label:"Disabled",disabled:!0}},m={args:{label:"Disabled Checked",disabled:!0,checked:!0}},p={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{name:"group",label:"Option 1"}),e.jsx(a,{name:"group",label:"Option 2"}),e.jsx(a,{name:"group",label:"Option 3"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{name:"group2",label:"Small",size:"sm"}),e.jsx(a,{name:"group2",label:"Medium",size:"md"}),e.jsx(a,{name:"group2",label:"Large",size:"lg"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{name:"group3",label:"With Helper Text",helperText:"This is a helper text"}),e.jsx(a,{name:"group3",label:"With Error",error:"This field is required"}),e.jsx(a,{name:"group3",label:"Disabled",disabled:!0}),e.jsx(a,{name:"group3",label:"Disabled Checked",disabled:!0,checked:!0})]})]})};var y,f,k;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    label: "Radio"
  }
}`,...(k=(f=t.parameters)==null?void 0:f.docs)==null?void 0:k.source}}};var T,j,v;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    label: "Checked",
    checked: true
  }
}`,...(v=(j=l.parameters)==null?void 0:j.docs)==null?void 0:v.source}}};var R,N,S;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    label: "Small",
    size: "sm"
  }
}`,...(S=(N=i.parameters)==null?void 0:N.docs)==null?void 0:S.source}}};var z,C,D;o.parameters={...o.parameters,docs:{...(z=o.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    label: "Large",
    size: "lg"
  }
}`,...(D=(C=o.parameters)==null?void 0:C.docs)==null?void 0:D.source}}};var W,E,w;d.parameters={...d.parameters,docs:{...(W=d.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    label: "With Helper Text",
    helperText: "This is a helper text"
  }
}`,...(w=(E=d.parameters)==null?void 0:E.docs)==null?void 0:w.source}}};var q,H,L;n.parameters={...n.parameters,docs:{...(q=n.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    label: "With Error",
    error: "This field is required"
  }
}`,...(L=(H=n.parameters)==null?void 0:H.docs)==null?void 0:L.source}}};var O,_,M;c.parameters={...c.parameters,docs:{...(O=c.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    label: "Disabled",
    disabled: true
  }
}`,...(M=(_=c.parameters)==null?void 0:_.docs)==null?void 0:M.source}}};var G,$,B;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    label: "Disabled Checked",
    disabled: true,
    checked: true
  }
}`,...(B=($=m.parameters)==null?void 0:$.docs)==null?void 0:B.source}}};var F,I,V;p.parameters={...p.parameters,docs:{...(F=p.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">
      <div className="space-y-2">
        <Radio name="group" label="Option 1" />
        <Radio name="group" label="Option 2" />
        <Radio name="group" label="Option 3" />
      </div>
      <div className="space-y-2">
        <Radio name="group2" label="Small" size="sm" />
        <Radio name="group2" label="Medium" size="md" />
        <Radio name="group2" label="Large" size="lg" />
      </div>
      <div className="space-y-2">
        <Radio name="group3" label="With Helper Text" helperText="This is a helper text" />
        <Radio name="group3" label="With Error" error="This field is required" />
        <Radio name="group3" label="Disabled" disabled />
        <Radio name="group3" label="Disabled Checked" disabled checked />
      </div>
    </div>
}`,...(V=(I=p.parameters)==null?void 0:I.docs)==null?void 0:V.source}}};const re=["Default","Checked","Small","Large","WithHelperText","WithError","Disabled","DisabledChecked","RadioGroup"];export{l as Checked,t as Default,c as Disabled,m as DisabledChecked,o as Large,p as RadioGroup,i as Small,n as WithError,d as WithHelperText,re as __namedExportsOrder,ae as default};
