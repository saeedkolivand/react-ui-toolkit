import{j as e}from"./jsx-runtime-wExe0b-h.js";import{t as j}from"./tw-merge-Ds6tgvmq.js";import"./iframe-BDOo6nJy.js";const Le={sm:"h-1.5",md:"h-2.5",lg:"h-4"},Ne={sm:"text-[8px] leading-3",md:"text-[10px] leading-4",lg:"text-xs leading-5"},Ae={primary:"bg-primary-600",secondary:"bg-gray-600",success:"bg-green-600",warning:"bg-yellow-600",error:"bg-red-600"},qe={primary:"bg-primary-100",secondary:"bg-gray-200",success:"bg-green-100",warning:"bg-yellow-100",error:"bg-red-100"},a=({className:r,value:w,max:V=100,variant:C="primary",size:P="md",showValue:fe=!1,striped:S=!1,animated:we=!1,indeterminate:Pe=!1,label:ye,...je})=>{const n=Pe||typeof w!="number",y=n?0:Math.min(100,Math.max(0,w/V*100)),Ve=j("relative w-full min-w-[8rem] overflow-hidden rounded-full transition-all duration-300",qe[C],Le[P],r),Ce=S&&!n?"bg-[length:1rem_100%] bg-gradient-to-r from-white/20 via-white/20 to-transparent bg-repeat-x":"",Se=we?n?"relative before:absolute before:inset-0 before:w-1/3 before:animate-indeterminate before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent":S?"animate-progress-stripes":"":"",Te=j("absolute inset-0 flex items-center transition-all duration-300 ease-out",Ae[C],Ce,Se,n?"w-full":void 0),ze=j("absolute inset-0 flex items-center justify-center font-medium text-white whitespace-nowrap",Ne[P]),T=n?"Loading...":`${Math.round(y)}%`,We=ye||`Progress ${n?"loading":`${Math.round(y)}%`}`;return e.jsx("div",{className:Ve,role:"progressbar","aria-label":We,"aria-valuemin":0,"aria-valuemax":V,"aria-valuenow":n?void 0:w,"aria-valuetext":T,...je,children:e.jsx("div",{className:Te,style:n?void 0:{width:`${y}%`},children:fe&&!n&&P!=="sm"&&e.jsx("span",{className:ze,children:T})})})};a.__docgenInfo={description:"",methods:[],displayName:"Progress",props:{value:{required:!1,tsType:{name:"number"},description:"The current value of the progress bar (0-100)"},max:{required:!1,tsType:{name:"number"},description:"The maximum value of the progress bar",defaultValue:{value:"100",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:'"primary" | "secondary" | "success" | "warning" | "error"',elements:[{name:"literal",value:'"primary"'},{name:"literal",value:'"secondary"'},{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"error"'}]},description:"The variant of the progress bar",defaultValue:{value:'"primary"',computed:!1}},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"The size of the progress bar",defaultValue:{value:'"md"',computed:!1}},showValue:{required:!1,tsType:{name:"boolean"},description:"Whether to show the value label",defaultValue:{value:"false",computed:!1}},striped:{required:!1,tsType:{name:"boolean"},description:"Whether to show stripes",defaultValue:{value:"false",computed:!1}},animated:{required:!1,tsType:{name:"boolean"},description:"Whether to animate the stripes",defaultValue:{value:"false",computed:!1}},indeterminate:{required:!1,tsType:{name:"boolean"},description:"Whether the progress is indeterminate",defaultValue:{value:"false",computed:!1}},label:{required:!1,tsType:{name:"string"},description:"Label for accessibility"}},composes:["Omit"]};const Be={title:"Feedback/Progress",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{value:{control:{type:"range",min:0,max:100,step:1},description:"The current value of the progress bar (0-100)"},max:{control:{type:"number",min:1},description:"The maximum value of the progress bar"},variant:{control:"select",options:["primary","secondary","success","warning","error"],description:"The variant of the progress bar"},size:{control:"select",options:["sm","md","lg"],description:"The size of the progress bar"},showValue:{control:"boolean",description:"Whether to show the value label"},striped:{control:"boolean",description:"Whether to show stripes"},animated:{control:"boolean",description:"Whether to animate the stripes"},indeterminate:{control:"boolean",description:"Whether the progress is indeterminate"},label:{control:"text",description:"Label for accessibility"}}},s=({children:r})=>e.jsx("div",{className:"w-[600px] p-4 bg-white dark:bg-gray-800 rounded-lg shadow",children:r}),o={render:r=>e.jsx(s,{children:e.jsx(a,{...r})}),args:{value:60,max:100}},t={render:r=>e.jsx(s,{children:e.jsx(a,{...r})}),args:{value:40,max:100,size:"sm"}},l={render:r=>e.jsx(s,{children:e.jsx(a,{...r})}),args:{value:80,max:100,size:"lg",showValue:!0}},i={render:r=>e.jsx(s,{children:e.jsx(a,{...r})}),args:{value:75,max:100,variant:"primary",showValue:!0}},u={render:r=>e.jsx(s,{children:e.jsx(a,{...r})}),args:{value:65,max:100,variant:"secondary",showValue:!0}},c={render:r=>e.jsx(s,{children:e.jsx(a,{...r})}),args:{value:100,max:100,variant:"success",showValue:!0}},d={render:r=>e.jsx(s,{children:e.jsx(a,{...r})}),args:{value:85,max:100,variant:"warning",showValue:!0}},m={render:r=>e.jsx(s,{children:e.jsx(a,{...r})}),args:{value:25,max:100,variant:"error",showValue:!0}},g={render:r=>e.jsx(s,{children:e.jsx(a,{...r})}),args:{value:70,max:100,variant:"primary",showValue:!0,striped:!0}},p={render:r=>e.jsx(s,{children:e.jsx(a,{...r})}),args:{value:90,max:100,variant:"success",showValue:!0,striped:!0,animated:!0}},v={render:r=>e.jsx(s,{children:e.jsx(a,{...r})}),args:{indeterminate:!0,variant:"primary",animated:!0}},h={render:r=>e.jsx(s,{children:e.jsx(a,{...r})}),args:{value:60,variant:"primary",showValue:!0,label:"Uploading files..."}},x={render:()=>e.jsx(s,{children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(a,{value:60,variant:"primary",showValue:!0,label:"Primary progress"}),e.jsx(a,{value:60,variant:"secondary",showValue:!0,label:"Secondary progress"}),e.jsx(a,{value:60,variant:"success",showValue:!0,label:"Success progress"}),e.jsx(a,{value:60,variant:"warning",showValue:!0,label:"Warning progress"}),e.jsx(a,{value:60,variant:"error",showValue:!0,label:"Error progress"}),e.jsx(a,{indeterminate:!0,animated:!0,variant:"primary",label:"Loading..."})]})})},b={render:()=>e.jsx(s,{children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(a,{value:60,size:"sm",label:"Small progress"}),e.jsx(a,{value:60,size:"md",showValue:!0,label:"Medium progress"}),e.jsx(a,{value:60,size:"lg",showValue:!0,label:"Large progress"})]})})},f={render:()=>e.jsx(s,{children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(a,{value:60,showValue:!0,label:"Basic progress"}),e.jsx(a,{value:60,showValue:!0,striped:!0,label:"Striped progress"}),e.jsx(a,{value:60,showValue:!0,striped:!0,animated:!0,label:"Animated striped progress"}),e.jsx(a,{indeterminate:!0,animated:!0,label:"Indeterminate progress"})]})})};var z,W,L;o.parameters={...o.parameters,docs:{...(z=o.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: args => <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>,
  args: {
    value: 60,
    max: 100
  }
}`,...(L=(W=o.parameters)==null?void 0:W.docs)==null?void 0:L.source}}};var N,A,q;t.parameters={...t.parameters,docs:{...(N=t.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: args => <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>,
  args: {
    value: 40,
    max: 100,
    size: "sm"
  }
}`,...(q=(A=t.parameters)==null?void 0:A.docs)==null?void 0:q.source}}};var M,E,I;l.parameters={...l.parameters,docs:{...(M=l.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: args => <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>,
  args: {
    value: 80,
    max: 100,
    size: "lg",
    showValue: true
  }
}`,...(I=(E=l.parameters)==null?void 0:E.docs)==null?void 0:I.source}}};var _,B,$;i.parameters={...i.parameters,docs:{...(_=i.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: args => <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>,
  args: {
    value: 75,
    max: 100,
    variant: "primary",
    showValue: true
  }
}`,...($=(B=i.parameters)==null?void 0:B.docs)==null?void 0:$.source}}};var k,O,U;u.parameters={...u.parameters,docs:{...(k=u.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: args => <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>,
  args: {
    value: 65,
    max: 100,
    variant: "secondary",
    showValue: true
  }
}`,...(U=(O=u.parameters)==null?void 0:O.docs)==null?void 0:U.source}}};var F,R,D;c.parameters={...c.parameters,docs:{...(F=c.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: args => <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>,
  args: {
    value: 100,
    max: 100,
    variant: "success",
    showValue: true
  }
}`,...(D=(R=c.parameters)==null?void 0:R.docs)==null?void 0:D.source}}};var G,H,J;d.parameters={...d.parameters,docs:{...(G=d.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: args => <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>,
  args: {
    value: 85,
    max: 100,
    variant: "warning",
    showValue: true
  }
}`,...(J=(H=d.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var K,Q,X;m.parameters={...m.parameters,docs:{...(K=m.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: args => <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>,
  args: {
    value: 25,
    max: 100,
    variant: "error",
    showValue: true
  }
}`,...(X=(Q=m.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,ee;g.parameters={...g.parameters,docs:{...(Y=g.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: args => <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>,
  args: {
    value: 70,
    max: 100,
    variant: "primary",
    showValue: true,
    striped: true
  }
}`,...(ee=(Z=g.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var re,ae,se;p.parameters={...p.parameters,docs:{...(re=p.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: args => <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>,
  args: {
    value: 90,
    max: 100,
    variant: "success",
    showValue: true,
    striped: true,
    animated: true
  }
}`,...(se=(ae=p.parameters)==null?void 0:ae.docs)==null?void 0:se.source}}};var ne,oe,te;v.parameters={...v.parameters,docs:{...(ne=v.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: args => <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>,
  args: {
    indeterminate: true,
    variant: "primary",
    animated: true
  }
}`,...(te=(oe=v.parameters)==null?void 0:oe.docs)==null?void 0:te.source}}};var le,ie,ue;h.parameters={...h.parameters,docs:{...(le=h.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: args => <ProgressContainer>
      <Progress {...args} />
    </ProgressContainer>,
  args: {
    value: 60,
    variant: "primary",
    showValue: true,
    label: "Uploading files..."
  }
}`,...(ue=(ie=h.parameters)==null?void 0:ie.docs)==null?void 0:ue.source}}};var ce,de,me;x.parameters={...x.parameters,docs:{...(ce=x.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: () => <ProgressContainer>
      <div className="flex flex-col gap-4">
        <Progress value={60} variant="primary" showValue label="Primary progress" />
        <Progress value={60} variant="secondary" showValue label="Secondary progress" />
        <Progress value={60} variant="success" showValue label="Success progress" />
        <Progress value={60} variant="warning" showValue label="Warning progress" />
        <Progress value={60} variant="error" showValue label="Error progress" />
        <Progress indeterminate animated variant="primary" label="Loading..." />
      </div>
    </ProgressContainer>
}`,...(me=(de=x.parameters)==null?void 0:de.docs)==null?void 0:me.source}}};var ge,pe,ve;b.parameters={...b.parameters,docs:{...(ge=b.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  render: () => <ProgressContainer>
      <div className="flex flex-col gap-4">
        <Progress value={60} size="sm" label="Small progress" />
        <Progress value={60} size="md" showValue label="Medium progress" />
        <Progress value={60} size="lg" showValue label="Large progress" />
      </div>
    </ProgressContainer>
}`,...(ve=(pe=b.parameters)==null?void 0:pe.docs)==null?void 0:ve.source}}};var he,xe,be;f.parameters={...f.parameters,docs:{...(he=f.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: () => <ProgressContainer>
      <div className="flex flex-col gap-4">
        <Progress value={60} showValue label="Basic progress" />
        <Progress value={60} showValue striped label="Striped progress" />
        <Progress value={60} showValue striped animated label="Animated striped progress" />
        <Progress indeterminate animated label="Indeterminate progress" />
      </div>
    </ProgressContainer>
}`,...(be=(xe=f.parameters)==null?void 0:xe.docs)==null?void 0:be.source}}};const $e=["Basic","Small","Large","Primary","Secondary","Success","Warning","Error","WithStripes","Animated","Indeterminate","WithLabel","AllVariants","AllSizes","AllStates"];export{b as AllSizes,f as AllStates,x as AllVariants,p as Animated,o as Basic,m as Error,v as Indeterminate,l as Large,i as Primary,u as Secondary,t as Small,c as Success,d as Warning,h as WithLabel,g as WithStripes,$e as __namedExportsOrder,Be as default};
