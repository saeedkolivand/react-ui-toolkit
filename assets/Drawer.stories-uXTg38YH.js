import{j as e}from"./jsx-runtime-COmSruMi.js";import{R as A,r as l}from"./iframe-CeBVcp-l.js";import{r as M}from"./index-DcFVYrTC.js";import{t as w}from"./tw-merge-Ds6tgvmq.js";import{A as Y,m as g}from"./proxy-DPgFR6zo.js";import{B as o}from"./Button-Bnc00qeH.js";import{I as F}from"./Icon-DwxvNRbf.js";import"./index-BJWOwdTD.js";const a=A.forwardRef(({className:s,children:n,isOpen:t,onClose:c,position:r="right",size:T="md",showCloseButton:z=!0,closeOnBackdropClick:S=!0,closeOnEsc:f=!0,...N},R)=>{l.useEffect(()=>{if(t&&f){const i=P=>{P.key==="Escape"&&c()};return document.addEventListener("keydown",i),()=>{document.removeEventListener("keydown",i)}}},[t,f,c]),l.useEffect(()=>{if(t)return document.body.style.overflow="hidden",()=>{document.body.style.overflow=""}},[t]);const q={sm:"w-72",md:"w-96",lg:"w-[32rem]",xl:"w-[40rem]",full:"w-screen"},W={left:"left-0 top-0 bottom-0",right:"right-0 top-0 bottom-0",top:"top-0 left-0 right-0",bottom:"bottom-0 left-0 right-0"},L=w("fixed bg-white dark:bg-gray-800 shadow-xl",r==="left"||r==="right"?q[T]:"",r==="left"||r==="right"?"h-full":"w-full",W[r],s),V=w("fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"),_=i=>{S&&i.target===i.currentTarget&&c()};return M.createPortal(e.jsx(Y,{children:t&&e.jsxs("div",{"data-testid":"drawer-dialog",className:"relative z-50","aria-labelledby":"drawer-title",role:"dialog","aria-modal":"true",children:[e.jsx(g.div,{"data-testid":"drawer-backdrop",className:V,onClick:_,"aria-hidden":"true",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.2}}),e.jsxs(g.div,{ref:R,className:L,initial:{opacity:0,x:r==="left"?"-100%":r==="right"?"100%":0,y:r==="top"?"-100%":r==="bottom"?"100%":0},animate:{opacity:1,x:0,y:0},exit:{opacity:0,x:r==="left"?"-100%":r==="right"?"100%":0,y:r==="top"?"-100%":r==="bottom"?"100%":0},transition:{duration:.2,ease:[.4,0,.2,1]},...N,children:[z&&e.jsx(o,{variant:"ghost",size:"sm",className:"absolute top-4 right-4",onClick:c,"aria-label":"Close",children:e.jsx(F,{name:"close",size:"lg"})}),n]})]})}),document.body)});a.displayName="Drawer";a.__docgenInfo={description:"",methods:[],displayName:"Drawer",props:{isOpen:{required:!0,tsType:{name:"boolean"},description:"Whether the drawer is open"},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when the drawer should close"},position:{required:!1,tsType:{name:"union",raw:'"left" | "right" | "top" | "bottom"',elements:[{name:"literal",value:'"left"'},{name:"literal",value:'"right"'},{name:"literal",value:'"top"'},{name:"literal",value:'"bottom"'}]},description:"The position of the drawer",defaultValue:{value:'"right"',computed:!1}},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg" | "xl" | "full"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'},{name:"literal",value:'"xl"'},{name:"literal",value:'"full"'}]},description:"The size of the drawer",defaultValue:{value:'"md"',computed:!1}},showCloseButton:{required:!1,tsType:{name:"boolean"},description:"Whether to show the close button",defaultValue:{value:"true",computed:!1}},closeOnBackdropClick:{required:!1,tsType:{name:"boolean"},description:"Whether to close the drawer when clicking the backdrop",defaultValue:{value:"true",computed:!1}},closeOnEsc:{required:!1,tsType:{name:"boolean"},description:"Whether to close the drawer when pressing escape",defaultValue:{value:"true",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:"The content of the drawer"}},composes:["Omit"]};const $={title:"Navigation/Drawer",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{isOpen:{control:"boolean",description:"Controls the visibility of the drawer"},onClose:{action:"closed",description:"Callback when drawer is closed"},position:{control:"select",options:["left","right","top","bottom"],description:"Position of the drawer"},size:{control:"select",options:["sm","md","lg","xl","full"],description:"Size of the drawer"},closeOnBackdropClick:{control:"boolean",description:"Whether to close drawer when clicking outside"},closeOnEsc:{control:"boolean",description:"Whether to close drawer when pressing ESC"},showCloseButton:{control:"boolean",description:"Whether to show the close button"}}},h=()=>e.jsxs("div",{className:"p-6",children:[e.jsx("h2",{className:"text-2xl font-bold mb-4",children:"Drawer Title"}),e.jsx("p",{className:"mb-4",children:"This is a sample drawer content. You can put any content here, including forms, images, or other components."}),e.jsxs("div",{className:"flex justify-end gap-4",children:[e.jsx(o,{variant:"outline",children:"Cancel"}),e.jsx(o,{children:"Confirm"})]})]}),d={render:s=>{const[n,t]=l.useState(!1);return e.jsxs("div",{children:[e.jsx(o,{onClick:()=>t(!0),children:"Open Left Drawer"}),e.jsx(a,{...s,isOpen:n,onClose:()=>t(!1),children:e.jsx(h,{})})]})},args:{position:"left",size:"md",closeOnBackdropClick:!0,closeOnEsc:!0,showCloseButton:!0}},u={render:s=>{const[n,t]=l.useState(!1);return e.jsxs("div",{children:[e.jsx(o,{onClick:()=>t(!0),children:"Open Right Drawer"}),e.jsx(a,{...s,isOpen:n,onClose:()=>t(!1),children:e.jsx(h,{})})]})},args:{position:"right",size:"md",closeOnBackdropClick:!0,closeOnEsc:!0,showCloseButton:!0}},p={render:s=>{const[n,t]=l.useState(!1);return e.jsxs("div",{children:[e.jsx(o,{onClick:()=>t(!0),children:"Open Top Drawer"}),e.jsx(a,{...s,isOpen:n,onClose:()=>t(!1),children:e.jsx(h,{})})]})},args:{position:"top",size:"md",closeOnBackdropClick:!0,closeOnEsc:!0,showCloseButton:!0}},m={render:s=>{const[n,t]=l.useState(!1);return e.jsxs("div",{children:[e.jsx(o,{onClick:()=>t(!0),children:"Open Bottom Drawer"}),e.jsx(a,{...s,isOpen:n,onClose:()=>t(!1),children:e.jsx(h,{})})]})},args:{position:"bottom",size:"md",closeOnBackdropClick:!0,closeOnEsc:!0,showCloseButton:!0}};var O,C,x;d.parameters={...d.parameters,docs:{...(O=d.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return <div>
        <Button onClick={() => setIsOpen(true)}>Open Left Drawer</Button>
        <Drawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DrawerContent />
        </Drawer>
      </div>;
  },
  args: {
    position: "left",
    size: "md",
    closeOnBackdropClick: true,
    closeOnEsc: true,
    showCloseButton: true
  }
}`,...(x=(C=d.parameters)==null?void 0:C.docs)==null?void 0:x.source}}};var k,b,v;u.parameters={...u.parameters,docs:{...(k=u.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return <div>
        <Button onClick={() => setIsOpen(true)}>Open Right Drawer</Button>
        <Drawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DrawerContent />
        </Drawer>
      </div>;
  },
  args: {
    position: "right",
    size: "md",
    closeOnBackdropClick: true,
    closeOnEsc: true,
    showCloseButton: true
  }
}`,...(v=(b=u.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};var y,B,j;p.parameters={...p.parameters,docs:{...(y=p.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return <div>
        <Button onClick={() => setIsOpen(true)}>Open Top Drawer</Button>
        <Drawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DrawerContent />
        </Drawer>
      </div>;
  },
  args: {
    position: "top",
    size: "md",
    closeOnBackdropClick: true,
    closeOnEsc: true,
    showCloseButton: true
  }
}`,...(j=(B=p.parameters)==null?void 0:B.docs)==null?void 0:j.source}}};var D,E,I;m.parameters={...m.parameters,docs:{...(D=m.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return <div>
        <Button onClick={() => setIsOpen(true)}>Open Bottom Drawer</Button>
        <Drawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DrawerContent />
        </Drawer>
      </div>;
  },
  args: {
    position: "bottom",
    size: "md",
    closeOnBackdropClick: true,
    closeOnEsc: true,
    showCloseButton: true
  }
}`,...(I=(E=m.parameters)==null?void 0:E.docs)==null?void 0:I.source}}};const ee=["Left","Right","Top","Bottom"];export{m as Bottom,d as Left,u as Right,p as Top,ee as __namedExportsOrder,$ as default};
