import{j as e}from"./jsx-runtime-DEBomnog.js";import{R as M}from"./iframe-D9LwMJHb.js";import{t as h}from"./tw-merge-Ds6tgvmq.js";const a=M.forwardRef(({type:r="horizontal",orientation:s="center",dashed:p=!1,children:m,className:L,...B},C)=>{const I=h("relative",r==="horizontal"?"w-full h-px":"h-full w-px",p?"border-dashed":"border-solid","border-gray-300",L);return m&&r==="horizontal"?e.jsxs("div",{className:"flex items-center w-full my-4",children:[e.jsx("div",{"data-testid":"divider-line",className:h("flex-1 h-px",p?"border-dashed":"border-solid","border-t-2 border-gray-300",s==="left"?"w-1/4":s==="right"?"w-3/4":"w-full")}),e.jsx("span",{className:"px-4 text-gray-500 text-sm whitespace-nowrap",children:m}),e.jsx("div",{"data-testid":"divider-line",className:h("flex-1 h-px",p?"border-dashed":"border-solid","border-t-2 border-gray-300",s==="left"?"w-3/4":s==="right"?"w-1/4":"w-full")})]}):e.jsx("div",{ref:C,"data-testid":"divider",className:I,...B})});a.displayName="Divider";a.__docgenInfo={description:"",methods:[],displayName:"Divider",props:{type:{required:!1,tsType:{name:"union",raw:'"horizontal" | "vertical"',elements:[{name:"literal",value:'"horizontal"'},{name:"literal",value:'"vertical"'}]},description:`The direction of the divider
@default 'horizontal'`,defaultValue:{value:'"horizontal"',computed:!1}},orientation:{required:!1,tsType:{name:"union",raw:'"left" | "right" | "center"',elements:[{name:"literal",value:'"left"'},{name:"literal",value:'"right"'},{name:"literal",value:'"center"'}]},description:`The orientation of the divider text
@default 'center'`,defaultValue:{value:'"center"',computed:!1}},dashed:{required:!1,tsType:{name:"boolean"},description:`Whether the divider is dashed
@default false`,defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"The text to show in the divider"}}};const F={title:"Base/Divider",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{type:{control:"select",options:["horizontal","vertical"],description:"The direction of the divider"},orientation:{control:"select",options:["left","right","center"],description:"The orientation of the divider text"},dashed:{control:"boolean",description:"Whether the divider is dashed"}}},t={args:{type:"horizontal"},render:r=>e.jsxs("div",{className:"w-96 p-8 bg-white rounded-lg shadow",children:[e.jsx("p",{className:"mb-4",children:"Text above"}),e.jsx(a,{...r}),e.jsx("p",{className:"mt-4",children:"Text below"})]})},i={args:{type:"vertical"},render:r=>e.jsxs("div",{className:"flex items-center h-32 p-8 bg-white rounded-lg shadow",children:[e.jsx("span",{children:"Text"}),e.jsx(a,{...r}),e.jsx("span",{children:"Text"})]})},n={args:{type:"horizontal",orientation:"center"},render:r=>e.jsxs("div",{className:"w-96 p-8 bg-white rounded-lg shadow",children:[e.jsx("p",{className:"mb-4",children:"Text above"}),e.jsx(a,{...r,children:"Section Title"}),e.jsx("p",{className:"mt-4",children:"Text below"})]})},o={args:{type:"horizontal",orientation:"left"},render:r=>e.jsxs("div",{className:"w-96 p-8 bg-white rounded-lg shadow",children:[e.jsx("p",{className:"mb-4",children:"Text above"}),e.jsx(a,{...r,children:"Section Title"}),e.jsx("p",{className:"mt-4",children:"Text below"})]})},d={args:{type:"horizontal",orientation:"right"},render:r=>e.jsxs("div",{className:"w-96 p-8 bg-white rounded-lg shadow",children:[e.jsx("p",{className:"mb-4",children:"Text above"}),e.jsx(a,{...r,children:"Section Title"}),e.jsx("p",{className:"mt-4",children:"Text below"})]})},l={args:{type:"horizontal",dashed:!0},render:r=>e.jsxs("div",{className:"w-96 p-8 bg-white rounded-lg shadow",children:[e.jsx("p",{className:"mb-4",children:"Text above"}),e.jsx(a,{...r}),e.jsx("p",{className:"mt-4",children:"Text below"})]})},c={args:{type:"horizontal",dashed:!0,orientation:"center"},render:r=>e.jsxs("div",{className:"w-96 p-8 bg-white rounded-lg shadow",children:[e.jsx("p",{className:"mb-4",children:"Text above"}),e.jsx(a,{...r,children:"Section Title"}),e.jsx("p",{className:"mt-4",children:"Text below"})]})};var x,g,u;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    type: "horizontal"
  },
  render: args => <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args} />
      <p className="mt-4">Text below</p>
    </div>
}`,...(u=(g=t.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};var v,w,b;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    type: "vertical"
  },
  render: args => <div className="flex items-center h-32 p-8 bg-white rounded-lg shadow">
      <span>Text</span>
      <Divider {...args} />
      <span>Text</span>
    </div>
}`,...(b=(w=i.parameters)==null?void 0:w.docs)==null?void 0:b.source}}};var T,f,N;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    type: "horizontal",
    orientation: "center"
  },
  render: args => <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args}>Section Title</Divider>
      <p className="mt-4">Text below</p>
    </div>
}`,...(N=(f=n.parameters)==null?void 0:f.docs)==null?void 0:N.source}}};var j,y,z;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    type: "horizontal",
    orientation: "left"
  },
  render: args => <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args}>Section Title</Divider>
      <p className="mt-4">Text below</p>
    </div>
}`,...(z=(y=o.parameters)==null?void 0:y.docs)==null?void 0:z.source}}};var D,S,R;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    type: "horizontal",
    orientation: "right"
  },
  render: args => <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args}>Section Title</Divider>
      <p className="mt-4">Text below</p>
    </div>
}`,...(R=(S=d.parameters)==null?void 0:S.docs)==null?void 0:R.source}}};var W,V,q;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    type: "horizontal",
    dashed: true
  },
  render: args => <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args} />
      <p className="mt-4">Text below</p>
    </div>
}`,...(q=(V=l.parameters)==null?void 0:V.docs)==null?void 0:q.source}}};var _,E,H;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    type: "horizontal",
    dashed: true,
    orientation: "center"
  },
  render: args => <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args}>Section Title</Divider>
      <p className="mt-4">Text below</p>
    </div>
}`,...(H=(E=c.parameters)==null?void 0:E.docs)==null?void 0:H.source}}};const G=["Horizontal","Vertical","WithText","WithTextLeft","WithTextRight","Dashed","DashedWithText"];export{l as Dashed,c as DashedWithText,t as Horizontal,i as Vertical,n as WithText,o as WithTextLeft,d as WithTextRight,G as __namedExportsOrder,F as default};
