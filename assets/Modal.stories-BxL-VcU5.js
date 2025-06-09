import{j as e}from"./jsx-runtime-DEBomnog.js";import{R as D,r}from"./iframe-D9LwMJHb.js";import{r as A}from"./index-1RjEUIMD.js";import{t as h}from"./tw-merge-Ds6tgvmq.js";import{A as P,m as g}from"./proxy-JAQPZyJa.js";import{B as n}from"./Button-Z1K3WbOv.js";import{I as Y}from"./Icon-B8ePxFyl.js";import"./index-265QdNlj.js";const a=D.forwardRef(({className:t,children:o,isOpen:s,onClose:i,size:I="md",showCloseButton:z=!0,closeOnBackdropClick:T=!0,closeOnEsc:f=!0,centered:E=!0,scrollable:N=!0,...W},q)=>{r.useEffect(()=>{if(s&&f){const l=_=>{_.key==="Escape"&&i()};return document.addEventListener("keydown",l),()=>{document.removeEventListener("keydown",l)}}},[s,f,i]),r.useEffect(()=>{if(s)return document.body.style.overflow="hidden",()=>{document.body.style.overflow=""}},[s]);const L=h("relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full mx-auto",{sm:"sm:max-w-sm",md:"sm:max-w-md",lg:"sm:max-w-lg",xl:"sm:max-w-xl",full:"sm:max-w-full sm:m-4"}[I],N&&"max-h-[calc(100vh-2rem)] overflow-y-auto",t),V=h("fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"),R=h("fixed inset-0 z-50 overflow-y-auto",E?"flex items-center justify-center":"flex items-start","p-4 sm:p-6 md:p-8"),F=l=>{T&&l.target===l.currentTarget&&i()};return A.createPortal(e.jsx(P,{children:s&&e.jsxs("div",{"data-testid":"modal-dialog",className:"relative z-50","aria-labelledby":"modal-title",role:"dialog","aria-modal":"true",children:[e.jsx(g.div,{"data-testid":"modal-backdrop",className:V,onClick:F,"aria-hidden":"true",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.2}}),e.jsx("div",{className:R,children:e.jsxs(g.div,{ref:q,className:L,initial:{opacity:0,scale:.95,y:-20},animate:{opacity:1,scale:1,y:-10},exit:{opacity:0,scale:.95,y:-20},transition:{duration:.2,ease:[.4,0,.2,1]},style:{transform:"translateY(-10%)"},...W,children:[z&&e.jsx(n,{variant:"ghost",size:"sm",className:"absolute top-4 right-4",onClick:i,"aria-label":"Close",children:e.jsx(Y,{name:"close",size:"lg"})}),o]})})]})}),document.body)});a.displayName="Modal";a.__docgenInfo={description:"",methods:[],displayName:"Modal",props:{isOpen:{required:!0,tsType:{name:"boolean"},description:"Whether the modal is open"},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Callback when the modal should close"},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg" | "xl" | "full"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'},{name:"literal",value:'"xl"'},{name:"literal",value:'"full"'}]},description:"The size of the modal",defaultValue:{value:'"md"',computed:!1}},showCloseButton:{required:!1,tsType:{name:"boolean"},description:"Whether to show the close button",defaultValue:{value:"true",computed:!1}},closeOnBackdropClick:{required:!1,tsType:{name:"boolean"},description:"Whether to close the modal when clicking the backdrop",defaultValue:{value:"true",computed:!1}},closeOnEsc:{required:!1,tsType:{name:"boolean"},description:"Whether to close the modal when pressing escape",defaultValue:{value:"true",computed:!1}},centered:{required:!1,tsType:{name:"boolean"},description:"Whether to center the modal vertically",defaultValue:{value:"true",computed:!1}},scrollable:{required:!1,tsType:{name:"boolean"},description:"Whether to show a scrollbar when content overflows",defaultValue:{value:"true",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:"The content of the modal"}},composes:["Omit"]};const ee={title:"Navigation/Modal",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{isOpen:{control:"boolean",description:"Controls the visibility of the modal"},onClose:{action:"closed",description:"Callback when modal is closed"},size:{control:"select",options:["sm","md","lg","xl","full"],description:"Size of the modal"},showCloseButton:{control:"boolean",description:"Whether to show the close button"},closeOnBackdropClick:{control:"boolean",description:"Whether to close modal when clicking outside"},closeOnEsc:{control:"boolean",description:"Whether to close modal when pressing ESC"},centered:{control:"boolean",description:"Whether to center the modal vertically"},scrollable:{control:"boolean",description:"Whether to show a scrollbar when content overflows"}}},p=()=>e.jsxs("div",{className:"p-6",children:[e.jsx("h2",{className:"text-2xl font-bold mb-4",children:"Modal Title"}),e.jsx("p",{className:"mb-4",children:"This is a sample modal content. You can put any content here, including forms, images, or other components."}),e.jsxs("div",{className:"flex justify-end gap-4",children:[e.jsx(n,{variant:"outline",children:"Cancel"}),e.jsx(n,{children:"Confirm"})]})]}),c={render:t=>{const[o,s]=r.useState(!1);return e.jsxs("div",{children:[e.jsx(n,{onClick:()=>s(!0),children:"Open Modal"}),e.jsx(a,{...t,isOpen:o,onClose:()=>s(!1),children:e.jsx(p,{})})]})},args:{size:"md",closeOnBackdropClick:!0,closeOnEsc:!0,showCloseButton:!0,centered:!0,scrollable:!0}},d={render:t=>{const[o,s]=r.useState(!1);return e.jsxs("div",{children:[e.jsx(n,{onClick:()=>s(!0),children:"Open Small Modal"}),e.jsx(a,{...t,isOpen:o,onClose:()=>s(!1),children:e.jsx(p,{})})]})},args:{size:"sm"}},u={render:t=>{const[o,s]=r.useState(!1);return e.jsxs("div",{children:[e.jsx(n,{onClick:()=>s(!0),children:"Open Large Modal"}),e.jsx(a,{...t,isOpen:o,onClose:()=>s(!1),children:e.jsx(p,{})})]})},args:{size:"lg"}},m={render:t=>{const[o,s]=r.useState(!1);return e.jsxs("div",{children:[e.jsx(n,{onClick:()=>s(!0),children:"Open Full Screen Modal"}),e.jsx(a,{...t,isOpen:o,onClose:()=>s(!1),children:e.jsx(p,{})})]})},args:{size:"full"}};var x,v,O;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return <div>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalContent />
        </Modal>
      </div>;
  },
  args: {
    size: "md",
    closeOnBackdropClick: true,
    closeOnEsc: true,
    showCloseButton: true,
    centered: true,
    scrollable: true
  }
}`,...(O=(v=c.parameters)==null?void 0:v.docs)==null?void 0:O.source}}};var y,C,b;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return <div>
        <Button onClick={() => setIsOpen(true)}>Open Small Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalContent />
        </Modal>
      </div>;
  },
  args: {
    size: "sm"
  }
}`,...(b=(C=d.parameters)==null?void 0:C.docs)==null?void 0:b.source}}};var w,j,k;u.parameters={...u.parameters,docs:{...(w=u.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return <div>
        <Button onClick={() => setIsOpen(true)}>Open Large Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalContent />
        </Modal>
      </div>;
  },
  args: {
    size: "lg"
  }
}`,...(k=(j=u.parameters)==null?void 0:j.docs)==null?void 0:k.source}}};var M,S,B;m.parameters={...m.parameters,docs:{...(M=m.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: args => {
    const [isOpen, setIsOpen] = useState(false);
    return <div>
        <Button onClick={() => setIsOpen(true)}>Open Full Screen Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalContent />
        </Modal>
      </div>;
  },
  args: {
    size: "full"
  }
}`,...(B=(S=m.parameters)==null?void 0:S.docs)==null?void 0:B.source}}};const se=["Default","Small","Large","FullScreen"];export{c as Default,m as FullScreen,u as Large,d as Small,se as __namedExportsOrder,ee as default};
