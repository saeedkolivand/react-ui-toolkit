import{j as e}from"./jsx-runtime-C06lrZbP.js";import{R as xe}from"./iframe-DE3FgLuB.js";import{t as b}from"./tw-merge-Ds6tgvmq.js";const fe="_autoResize_12l63_1",be={autoResize:fe},a=xe.forwardRef(({className:y,variant:oe="default",size:de="md",label:T,helperText:v,error:r,fullWidth:ie=!1,autoResize:z=!1,disabled:E,onChange:x,...f},ne)=>{const ce="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:focus:border-primary-400 dark:focus:ring-primary-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400 dark:text-white dark:shadow-none",ue={default:"border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800",filled:"border-transparent bg-gray-100 focus:bg-white dark:bg-gray-700 dark:focus:bg-gray-800",outlined:"border-gray-300 bg-transparent dark:border-gray-600"},pe={sm:"px-3 py-1.5 text-sm min-h-[80px]",md:"px-4 py-2 text-base min-h-[100px]",lg:"px-6 py-3 text-lg min-h-[120px]"},me=b("relative",ie&&"w-full",y),he=b(ce,ue[oe],pe[de],r&&"border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400",z&&be.autoResize,y),ge=t=>{z&&(t.target.style.height="auto",t.target.style.height=`${t.target.scrollHeight}px`),x==null||x(t)};return e.jsxs("div",{className:me,children:[T&&e.jsx("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1",children:T}),e.jsx("textarea",{ref:ne,className:he,disabled:E,onChange:ge,"aria-invalid":r?"true":"false","aria-describedby":r?`${f.id}-error`:void 0,"aria-disabled":E,...f}),(v||r)&&e.jsx("p",{className:b("mt-1 text-sm",r?"text-red-500 dark:text-red-400":"text-gray-500 dark:text-gray-400"),id:r?`${f.id}-error`:void 0,children:r||v})]})});a.displayName="Textarea";a.__docgenInfo={description:"",methods:[],displayName:"Textarea",props:{variant:{required:!1,tsType:{name:"union",raw:'"default" | "filled" | "outlined"',elements:[{name:"literal",value:'"default"'},{name:"literal",value:'"filled"'},{name:"literal",value:'"outlined"'}]},description:"The variant of the textarea",defaultValue:{value:'"default"',computed:!1}},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"The size of the textarea",defaultValue:{value:'"md"',computed:!1}},label:{required:!1,tsType:{name:"string"},description:"Label for the textarea"},helperText:{required:!1,tsType:{name:"string"},description:"Helper text to be displayed below the textarea"},error:{required:!1,tsType:{name:"string"},description:"Error message to be displayed"},fullWidth:{required:!1,tsType:{name:"boolean"},description:"Whether the textarea is full width",defaultValue:{value:"false",computed:!1}},autoResize:{required:!1,tsType:{name:"boolean"},description:"Whether to auto-resize the textarea based on content",defaultValue:{value:"false",computed:!1}}}};const ze={title:"Base/Textarea",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","filled","outlined"],description:"The visual style of the textarea"},size:{control:"select",options:["sm","md","lg"],description:"The size of the textarea"},label:{control:"text",description:"Label text for the textarea"},helperText:{control:"text",description:"Helper text to display below the textarea"},error:{control:"text",description:"Error message to display"},fullWidth:{control:"boolean",description:"Whether the textarea should take full width"},autoResize:{control:"boolean",description:"Whether the textarea should auto-resize based on content"},disabled:{control:"boolean",description:"Whether the textarea is disabled"},placeholder:{control:"text",description:"Placeholder text for the textarea"}}},s={args:{placeholder:"Enter your message..."}},l={args:{label:"Message",placeholder:"Enter your message..."}},o={args:{label:"Message",placeholder:"Enter your message...",helperText:"Please enter your message here"}},d={args:{label:"Message",placeholder:"Enter your message...",error:"This field is required"}},i={args:{variant:"filled",placeholder:"Enter your message..."}},n={args:{variant:"outlined",placeholder:"Enter your message..."}},c={args:{size:"sm",placeholder:"Enter your message..."}},u={args:{size:"lg",placeholder:"Enter your message..."}},p={args:{autoResize:!0,placeholder:"This textarea will resize automatically..."}},m={args:{disabled:!0,placeholder:"Disabled textarea..."}},h={args:{fullWidth:!0,placeholder:"Full width textarea..."},parameters:{layout:"padded"}},g={render:()=>e.jsxs("div",{className:"space-y-4 w-96",children:[e.jsx(a,{placeholder:"Default textarea"}),e.jsx(a,{variant:"filled",placeholder:"Filled textarea"}),e.jsx(a,{variant:"outlined",placeholder:"Outlined textarea"}),e.jsx(a,{size:"sm",placeholder:"Small textarea"}),e.jsx(a,{size:"lg",placeholder:"Large textarea"}),e.jsx(a,{label:"Message",placeholder:"With label"}),e.jsx(a,{helperText:"Helper text",placeholder:"With helper text"}),e.jsx(a,{error:"Error message",placeholder:"With error"}),e.jsx(a,{autoResize:!0,placeholder:"Auto-resizing textarea"}),e.jsx(a,{disabled:!0,placeholder:"Disabled textarea"})]})};var W,w,k;s.parameters={...s.parameters,docs:{...(W=s.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    placeholder: "Enter your message..."
  }
}`,...(k=(w=s.parameters)==null?void 0:w.docs)==null?void 0:k.source}}};var j,S,R;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    label: "Message",
    placeholder: "Enter your message..."
  }
}`,...(R=(S=l.parameters)==null?void 0:S.docs)==null?void 0:R.source}}};var D,q,M;o.parameters={...o.parameters,docs:{...(D=o.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    label: "Message",
    placeholder: "Enter your message...",
    helperText: "Please enter your message here"
  }
}`,...(M=(q=o.parameters)==null?void 0:q.docs)==null?void 0:M.source}}};var F,L,H;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    label: "Message",
    placeholder: "Enter your message...",
    error: "This field is required"
  }
}`,...(H=(L=d.parameters)==null?void 0:L.docs)==null?void 0:H.source}}};var N,_,A;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    variant: "filled",
    placeholder: "Enter your message..."
  }
}`,...(A=(_=i.parameters)==null?void 0:_.docs)==null?void 0:A.source}}};var V,O,C;n.parameters={...n.parameters,docs:{...(V=n.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    variant: "outlined",
    placeholder: "Enter your message..."
  }
}`,...(C=(O=n.parameters)==null?void 0:O.docs)==null?void 0:C.source}}};var P,$,B;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    size: "sm",
    placeholder: "Enter your message..."
  }
}`,...(B=($=c.parameters)==null?void 0:$.docs)==null?void 0:B.source}}};var I,G,J;u.parameters={...u.parameters,docs:{...(I=u.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    size: "lg",
    placeholder: "Enter your message..."
  }
}`,...(J=(G=u.parameters)==null?void 0:G.docs)==null?void 0:J.source}}};var K,Q,U;p.parameters={...p.parameters,docs:{...(K=p.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    autoResize: true,
    placeholder: "This textarea will resize automatically..."
  }
}`,...(U=(Q=p.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};var X,Y,Z;m.parameters={...m.parameters,docs:{...(X=m.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    disabled: true,
    placeholder: "Disabled textarea..."
  }
}`,...(Z=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,ae,re;h.parameters={...h.parameters,docs:{...(ee=h.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    fullWidth: true,
    placeholder: "Full width textarea..."
  },
  parameters: {
    layout: "padded"
  }
}`,...(re=(ae=h.parameters)==null?void 0:ae.docs)==null?void 0:re.source}}};var te,se,le;g.parameters={...g.parameters,docs:{...(te=g.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-96">
      <Textarea placeholder="Default textarea" />
      <Textarea variant="filled" placeholder="Filled textarea" />
      <Textarea variant="outlined" placeholder="Outlined textarea" />
      <Textarea size="sm" placeholder="Small textarea" />
      <Textarea size="lg" placeholder="Large textarea" />
      <Textarea label="Message" placeholder="With label" />
      <Textarea helperText="Helper text" placeholder="With helper text" />
      <Textarea error="Error message" placeholder="With error" />
      <Textarea autoResize placeholder="Auto-resizing textarea" />
      <Textarea disabled placeholder="Disabled textarea" />
    </div>
}`,...(le=(se=g.parameters)==null?void 0:se.docs)==null?void 0:le.source}}};const Ee=["Default","WithLabel","WithHelperText","WithError","Filled","Outlined","Small","Large","AutoResize","Disabled","FullWidth","AllVariants"];export{g as AllVariants,p as AutoResize,s as Default,m as Disabled,i as Filled,h as FullWidth,u as Large,n as Outlined,c as Small,d as WithError,o as WithHelperText,l as WithLabel,Ee as __namedExportsOrder,ze as default};
