import{j as e}from"./jsx-runtime-Bl_-tK0b.js";import{R as O}from"./iframe-rPefs_Tk.js";import{t}from"./tw-merge-Ds6tgvmq.js";const r=O.forwardRef(({type:a="horizontal",orientation:s="center",dashed:h=!1,children:m,className:M,...x},g)=>{const v=t("relative",a==="horizontal"?"w-full h-px":"h-full w-px border-l-2 mx-2",h?"border-dashed":"border-solid","border-gray-300",M),u=t("flex-1 h-px border-t-2",h?"border-dashed":"border-solid","border-gray-300");return a==="horizontal"?e.jsxs("div",{ref:g,"data-testid":"divider",...x,className:`${v} flex items-center w-full my-4`,children:[e.jsx("div",{"data-testid":"divider-line",className:t(u,s==="left"?"w-1/4":s==="right"?"w-3/4":"w-full")}),m&&e.jsx("span",{className:"px-4 text-gray-500 text-sm whitespace-nowrap",children:m}),m&&e.jsx("div",{"data-testid":"divider-line",className:t(u,s==="left"?"w-3/4":s==="right"?"w-1/4":"w-full")})]}):e.jsx("div",{ref:g,"data-testid":"divider",className:v,...x})});r.displayName="Divider";r.__docgenInfo={description:"",methods:[],displayName:"Divider",props:{type:{required:!1,tsType:{name:"union",raw:'"horizontal" | "vertical"',elements:[{name:"literal",value:'"horizontal"'},{name:"literal",value:'"vertical"'}]},description:`The direction of the divider
@default 'horizontal'`,defaultValue:{value:'"horizontal"',computed:!1}},orientation:{required:!1,tsType:{name:"union",raw:'"left" | "right" | "center"',elements:[{name:"literal",value:'"left"'},{name:"literal",value:'"right"'},{name:"literal",value:'"center"'}]},description:`The orientation of the divider text
@default 'center'`,defaultValue:{value:'"center"',computed:!1}},dashed:{required:!1,tsType:{name:"boolean"},description:`Whether the divider is dashed
@default false`,defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"The text to show in the divider"}}};const F={title:"Base/Divider",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{type:{control:"select",options:["horizontal","vertical"],description:"The direction of the divider"},orientation:{control:"select",options:["left","right","center"],description:"The orientation of the divider text"},dashed:{control:"boolean",description:"Whether the divider is dashed"}}},i={args:{type:"horizontal"},render:a=>e.jsxs("div",{className:"w-96 p-8 bg-white rounded-lg shadow",children:[e.jsx("p",{className:"mb-4",children:"Text above"}),e.jsx(r,{...a}),e.jsx("p",{className:"mt-4",children:"Text below"})]})},n={args:{type:"vertical"},render:a=>e.jsxs("div",{className:"flex items-center h-32 p-8 bg-white rounded-lg shadow",children:[e.jsx("span",{children:"Text"}),e.jsx(r,{...a}),e.jsx("span",{children:"Text"})]})},o={args:{type:"horizontal",orientation:"center"},render:a=>e.jsxs("div",{className:"w-96 p-8 bg-white rounded-lg shadow",children:[e.jsx("p",{className:"mb-4",children:"Text above"}),e.jsx(r,{...a,children:"Section Title"}),e.jsx("p",{className:"mt-4",children:"Text below"})]})},d={args:{type:"horizontal",orientation:"left"},render:a=>e.jsxs("div",{className:"w-96 p-8 bg-white rounded-lg shadow",children:[e.jsx("p",{className:"mb-4",children:"Text above"}),e.jsx(r,{...a,children:"Section Title"}),e.jsx("p",{className:"mt-4",children:"Text below"})]})},l={args:{type:"horizontal",orientation:"right"},render:a=>e.jsxs("div",{className:"w-96 p-8 bg-white rounded-lg shadow",children:[e.jsx("p",{className:"mb-4",children:"Text above"}),e.jsx(r,{...a,children:"Section Title"}),e.jsx("p",{className:"mt-4",children:"Text below"})]})},c={args:{type:"horizontal",dashed:!0},render:a=>e.jsxs("div",{className:"w-96 p-8 bg-white rounded-lg shadow",children:[e.jsx("p",{className:"mb-4",children:"Text above"}),e.jsx(r,{...a}),e.jsx("p",{className:"mt-4",children:"Text below"})]})},p={args:{type:"horizontal",dashed:!0,orientation:"center"},render:a=>e.jsxs("div",{className:"w-96 p-8 bg-white rounded-lg shadow",children:[e.jsx("p",{className:"mb-4",children:"Text above"}),e.jsx(r,{...a,children:"Section Title"}),e.jsx("p",{className:"mt-4",children:"Text below"})]})};var w,b,T;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    type: "horizontal"
  },
  render: args => <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args} />
      <p className="mt-4">Text below</p>
    </div>
}`,...(T=(b=i.parameters)==null?void 0:b.docs)==null?void 0:T.source}}};var N,f,j;n.parameters={...n.parameters,docs:{...(N=n.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    type: "vertical"
  },
  render: args => <div className="flex items-center h-32 p-8 bg-white rounded-lg shadow">
      <span>Text</span>
      <Divider {...args} />
      <span>Text</span>
    </div>
}`,...(j=(f=n.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};var y,z,D;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    type: "horizontal",
    orientation: "center"
  },
  render: args => <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args}>Section Title</Divider>
      <p className="mt-4">Text below</p>
    </div>
}`,...(D=(z=o.parameters)==null?void 0:z.docs)==null?void 0:D.source}}};var S,R,W;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    type: "horizontal",
    orientation: "left"
  },
  render: args => <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args}>Section Title</Divider>
      <p className="mt-4">Text below</p>
    </div>
}`,...(W=(R=d.parameters)==null?void 0:R.docs)==null?void 0:W.source}}};var V,q,_;l.parameters={...l.parameters,docs:{...(V=l.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    type: "horizontal",
    orientation: "right"
  },
  render: args => <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args}>Section Title</Divider>
      <p className="mt-4">Text below</p>
    </div>
}`,...(_=(q=l.parameters)==null?void 0:q.docs)==null?void 0:_.source}}};var L,C,E;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    type: "horizontal",
    dashed: true
  },
  render: args => <div className="w-96 p-8 bg-white rounded-lg shadow">
      <p className="mb-4">Text above</p>
      <Divider {...args} />
      <p className="mt-4">Text below</p>
    </div>
}`,...(E=(C=c.parameters)==null?void 0:C.docs)==null?void 0:E.source}}};var H,B,I;p.parameters={...p.parameters,docs:{...(H=p.parameters)==null?void 0:H.docs,source:{originalSource:`{
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
}`,...(I=(B=p.parameters)==null?void 0:B.docs)==null?void 0:I.source}}};const G=["Horizontal","Vertical","WithText","WithTextLeft","WithTextRight","Dashed","DashedWithText"];export{c as Dashed,p as DashedWithText,i as Horizontal,n as Vertical,o as WithText,d as WithTextLeft,l as WithTextRight,G as __namedExportsOrder,F as default};
