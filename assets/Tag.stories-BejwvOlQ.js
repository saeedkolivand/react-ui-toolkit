import{j as a}from"./jsx-runtime-VVtj5fHL.js";import{R as E}from"./iframe-CCGsSvNd.js";import{T as r}from"./Tag-CqiAHRfZ.js";import"./index-BRZpdFmu.js";const R={title:"Base/Tag",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","outline","solid"],description:"The visual style of the tag"},color:{control:"select",options:["default","primary","success","warning","error","info"],description:"The color scheme of the tag"},closable:{control:"boolean",description:"Whether the tag can be closed"}}},n={args:{children:"Default Tag"}},o={args:{children:"Closable Tag",closable:!0}},s={render:()=>a.jsx("div",{className:"flex flex-col gap-4",children:a.jsxs("div",{className:"flex gap-2",children:[a.jsx(r,{variant:"default",children:"Default"}),a.jsx(r,{variant:"outline",children:"Outline"}),a.jsx(r,{variant:"solid",children:"Solid"})]})})},l={render:()=>a.jsxs("div",{className:"flex flex-col gap-4",children:[a.jsxs("div",{className:"flex gap-2",children:[a.jsx(r,{color:"default",children:"Default"}),a.jsx(r,{color:"primary",children:"Primary"}),a.jsx(r,{color:"success",children:"Success"}),a.jsx(r,{color:"warning",children:"Warning"}),a.jsx(r,{color:"error",children:"Error"}),a.jsx(r,{color:"info",children:"Info"})]}),a.jsxs("div",{className:"flex gap-2",children:[a.jsx(r,{variant:"outline",color:"default",children:"Default"}),a.jsx(r,{variant:"outline",color:"primary",children:"Primary"}),a.jsx(r,{variant:"outline",color:"success",children:"Success"}),a.jsx(r,{variant:"outline",color:"warning",children:"Warning"}),a.jsx(r,{variant:"outline",color:"error",children:"Error"}),a.jsx(r,{variant:"outline",color:"info",children:"Info"})]}),a.jsxs("div",{className:"flex gap-2",children:[a.jsx(r,{variant:"solid",color:"default",children:"Default"}),a.jsx(r,{variant:"solid",color:"primary",children:"Primary"}),a.jsx(r,{variant:"solid",color:"success",children:"Success"}),a.jsx(r,{variant:"solid",color:"warning",children:"Warning"}),a.jsx(r,{variant:"solid",color:"error",children:"Error"}),a.jsx(r,{variant:"solid",color:"info",children:"Info"})]})]})},i={render:()=>{const[c,D]=E.useState(["Tag 1","Tag 2","Tag 3"]),b=e=>{D(c.filter(C=>C!==e))};return a.jsx("div",{className:"flex gap-2",children:c.map(e=>a.jsx(r,{color:"primary",closable:!0,onClose:()=>b(e),children:e},e))})}};var t,d,g;n.parameters={...n.parameters,docs:{...(t=n.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    children: "Default Tag"
  }
}`,...(g=(d=n.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};var u,m,T;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    children: "Closable Tag",
    closable: true
  }
}`,...(T=(m=o.parameters)==null?void 0:m.docs)==null?void 0:T.source}}};var f,p,v;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Tag variant="default">Default</Tag>
        <Tag variant="outline">Outline</Tag>
        <Tag variant="solid">Solid</Tag>
      </div>
    </div>
}`,...(v=(p=s.parameters)==null?void 0:p.docs)==null?void 0:v.source}}};var x,h,j;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Tag color="default">Default</Tag>
        <Tag color="primary">Primary</Tag>
        <Tag color="success">Success</Tag>
        <Tag color="warning">Warning</Tag>
        <Tag color="error">Error</Tag>
        <Tag color="info">Info</Tag>
      </div>
      <div className="flex gap-2">
        <Tag variant="outline" color="default">
          Default
        </Tag>
        <Tag variant="outline" color="primary">
          Primary
        </Tag>
        <Tag variant="outline" color="success">
          Success
        </Tag>
        <Tag variant="outline" color="warning">
          Warning
        </Tag>
        <Tag variant="outline" color="error">
          Error
        </Tag>
        <Tag variant="outline" color="info">
          Info
        </Tag>
      </div>
      <div className="flex gap-2">
        <Tag variant="solid" color="default">
          Default
        </Tag>
        <Tag variant="solid" color="primary">
          Primary
        </Tag>
        <Tag variant="solid" color="success">
          Success
        </Tag>
        <Tag variant="solid" color="warning">
          Warning
        </Tag>
        <Tag variant="solid" color="error">
          Error
        </Tag>
        <Tag variant="solid" color="info">
          Info
        </Tag>
      </div>
    </div>
}`,...(j=(h=l.parameters)==null?void 0:h.docs)==null?void 0:j.source}}};var y,S,N;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => {
    const [tags, setTags] = React.useState(["Tag 1", "Tag 2", "Tag 3"]);
    const handleClose = (tagToRemove: string) => {
      setTags(tags.filter(tag => tag !== tagToRemove));
    };
    return <div className="flex gap-2">
        {tags.map(tag => <Tag key={tag} color="primary" closable onClose={() => handleClose(tag)}>
            {tag}
          </Tag>)}
      </div>;
  }
}`,...(N=(S=i.parameters)==null?void 0:S.docs)==null?void 0:N.source}}};const O=["Default","Closable","Variants","Colors","Interactive"];export{o as Closable,l as Colors,n as Default,i as Interactive,s as Variants,O as __namedExportsOrder,R as default};
