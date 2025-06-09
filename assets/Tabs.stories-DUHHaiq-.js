import{j as e}from"./jsx-runtime-DEBomnog.js";import{r as T}from"./iframe-D9LwMJHb.js";import{t as l}from"./tw-merge-Ds6tgvmq.js";const H=({tabs:i,defaultActiveTab:o=0,orientation:f="horizontal",variant:r="line",isFitted:J=!1,className:K,onTabChange:v})=>{const[n,y]=T.useState(o);T.useEffect(()=>{o!==void 0&&o!==n&&y(o)},[o]);const Q=t=>{i[t].disabled||(y(t),v==null||v(t))},U=l("flex",f==="vertical"?"flex-row":"flex-col",K),X=l("flex",f==="vertical"?"flex-col":"flex-row",r==="enclosed"&&"border-b border-gray-200 dark:border-gray-700",r==="soft-rounded"&&"bg-gray-100 dark:bg-gray-800 p-1 rounded-lg",r==="solid-rounded"&&"bg-gray-100 dark:bg-gray-800 p-1 rounded-lg"),Y=t=>{const a=t===n,x=i[t].disabled;return l("px-4 py-2 text-sm font-medium transition-colors duration-200",J&&"flex-1 text-center",x&&"opacity-50 cursor-not-allowed",!x&&"cursor-pointer hover:text-primary-600 dark:hover:text-primary-400",r==="line"&&["border-b-2",a?"border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400":"border-transparent text-gray-500 dark:text-gray-400"],r==="enclosed"&&["border-b-2 -mb-px",a?"border-primary-600 border-t border-l border-r rounded-t-lg bg-white text-primary-600 dark:bg-gray-800 dark:border-gray-700 dark:text-primary-400":"border-transparent text-gray-500 dark:text-gray-400"],r==="soft-rounded"&&["rounded-md",a?"bg-white text-primary-600 shadow dark:bg-gray-700 dark:text-primary-400":"text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"],r==="solid-rounded"&&["rounded-md",a?"bg-primary-600 text-white dark:bg-primary-500":"text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"])},Z=l("mt-4 text-gray-900 dark:text-gray-100",f==="vertical"&&"mt-0 ml-4");return e.jsxs("div",{className:U,role:"tablist",children:[e.jsx("div",{className:X,children:i.map((t,a)=>e.jsx("button",{className:Y(a),onClick:()=>Q(a),role:"tab","aria-selected":a===n,"aria-controls":`panel-${a}`,disabled:t.disabled,children:t.label},a))}),e.jsx("div",{className:Z,children:i.map((t,a)=>e.jsx("div",{id:`panel-${a}`,role:"tabpanel","aria-labelledby":`tab-${a}`,hidden:a!==n,children:a===n&&t.content},a))})]})};H.__docgenInfo={description:"",methods:[],displayName:"Tabs",props:{tabs:{required:!0,tsType:{name:"Array",elements:[{name:"TabItem"}],raw:"TabItem[]"},description:"The tabs to display"},defaultActiveTab:{required:!1,tsType:{name:"number"},description:"The index of the initially active tab",defaultValue:{value:"0",computed:!1}},orientation:{required:!1,tsType:{name:"union",raw:'"horizontal" | "vertical"',elements:[{name:"literal",value:'"horizontal"'},{name:"literal",value:'"vertical"'}]},description:"The orientation of the tabs",defaultValue:{value:'"horizontal"',computed:!1}},variant:{required:!1,tsType:{name:"union",raw:'"line" | "enclosed" | "soft-rounded" | "solid-rounded"',elements:[{name:"literal",value:'"line"'},{name:"literal",value:'"enclosed"'},{name:"literal",value:'"soft-rounded"'},{name:"literal",value:'"solid-rounded"'}]},description:"The variant of the tabs",defaultValue:{value:'"line"',computed:!1}},isFitted:{required:!1,tsType:{name:"boolean"},description:"Whether to stretch the tabs to full width",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional classes to be applied to the tabs container"},onTabChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number) => void",signature:{arguments:[{type:{name:"number"},name:"index"}],return:{name:"void"}}},description:"Callback when a tab is selected"}}};const re={title:"Navigation/Tabs",component:H,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{tabs:{control:"object",description:"Array of tab items"},defaultActiveTab:{control:"number",description:"Index of the tab to be active by default"},orientation:{control:"select",options:["horizontal","vertical"],description:"Orientation of the tabs"},variant:{control:"select",options:["line","enclosed","soft-rounded","solid-rounded"],description:"Visual style of the tabs"},isFitted:{control:"boolean",description:"Whether to stretch the tabs to full width"}}},s=[{label:"Profile",content:e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Profile Information"}),e.jsx("p",{children:"This is the profile tab content."})]})},{label:"Settings",content:e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Settings"}),e.jsx("p",{children:"This is the settings tab content."})]})},{label:"Messages",content:e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Messages"}),e.jsx("p",{children:"This is the messages tab content."})]})}],d={args:{tabs:s}},c={args:{tabs:s,variant:"enclosed"}},b={args:{tabs:s,variant:"soft-rounded"}},m={args:{tabs:s,variant:"solid-rounded"}},u={args:{tabs:s,orientation:"vertical"}},p={args:{tabs:s,isFitted:!0}},g={args:{tabs:s,defaultActiveTab:1}},h={args:{tabs:[{label:"Active Tab",content:e.jsx("div",{className:"p-4",children:"This tab is active"})},{label:"Disabled Tab",content:e.jsx("div",{className:"p-4",children:"This tab is disabled"}),disabled:!0},{label:"Another Tab",content:e.jsx("div",{className:"p-4",children:"This is another tab"})}]}};var k,j,N;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    tabs: defaultTabs
  }
}`,...(N=(j=d.parameters)==null?void 0:j.docs)==null?void 0:N.source}}};var w,S,A;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    tabs: defaultTabs,
    variant: "enclosed"
  }
}`,...(A=(S=c.parameters)==null?void 0:S.docs)==null?void 0:A.source}}};var D,q,V;b.parameters={...b.parameters,docs:{...(D=b.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    tabs: defaultTabs,
    variant: "soft-rounded"
  }
}`,...(V=(q=b.parameters)==null?void 0:q.docs)==null?void 0:V.source}}};var E,F,z;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    tabs: defaultTabs,
    variant: "solid-rounded"
  }
}`,...(z=(F=m.parameters)==null?void 0:F.docs)==null?void 0:z.source}}};var I,R,C;u.parameters={...u.parameters,docs:{...(I=u.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    tabs: defaultTabs,
    orientation: "vertical"
  }
}`,...(C=(R=u.parameters)==null?void 0:R.docs)==null?void 0:C.source}}};var _,M,$;p.parameters={...p.parameters,docs:{...(_=p.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    tabs: defaultTabs,
    isFitted: true
  }
}`,...($=(M=p.parameters)==null?void 0:M.docs)==null?void 0:$.source}}};var O,P,W;g.parameters={...g.parameters,docs:{...(O=g.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    tabs: defaultTabs,
    defaultActiveTab: 1
  }
}`,...(W=(P=g.parameters)==null?void 0:P.docs)==null?void 0:W.source}}};var L,B,G;h.parameters={...h.parameters,docs:{...(L=h.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    tabs: [{
      label: "Active Tab",
      content: <div className="p-4">This tab is active</div>
    }, {
      label: "Disabled Tab",
      content: <div className="p-4">This tab is disabled</div>,
      disabled: true
    }, {
      label: "Another Tab",
      content: <div className="p-4">This is another tab</div>
    }]
  }
}`,...(G=(B=h.parameters)==null?void 0:B.docs)==null?void 0:G.source}}};const se=["Default","Enclosed","SoftRounded","SolidRounded","Vertical","Fitted","DefaultActive","DisabledTab"];export{d as Default,g as DefaultActive,h as DisabledTab,c as Enclosed,p as Fitted,b as SoftRounded,m as SolidRounded,u as Vertical,se as __namedExportsOrder,re as default};
