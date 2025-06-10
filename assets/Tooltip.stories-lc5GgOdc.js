import{j as e}from"./jsx-runtime-kY6nksJd.js";import{r as p,R as P}from"./iframe-BTFKCMRb.js";import{H as Me}from"./index-FV0NjcTJ.js";import{c as Z}from"./index-DT6NSszB.js";import{A as We,m as qe}from"./proxy-F5JoMNz_.js";import"./index-Bm8yHGHK.js";const Ee=({children:v})=>{const[u,d]=p.useState(!1),b=p.useRef(null);return p.useEffect(()=>{const y="tooltip-portal-container";let r=document.getElementById(y);return r||(r=document.createElement("div"),r.id=y,r.style.position="fixed",r.style.zIndex="1050",r.style.top="0",r.style.left="0",r.style.width="0",r.style.height="0",document.body.appendChild(r)),b.current=r,d(!0),()=>{r.childNodes.length===0&&document.body.removeChild(r)}},[]),u&&b.current?Me.createPortal(v,b.current):null},l=({content:v,children:u,placement:d="top",trigger:b="hover",defaultVisible:y=!1,showDelay:r=50,hideDelay:me=50,className:Be,overlayClassName:fe,overlayInnerClassName:ge,overlayStyle:be,overlayInnerStyle:xe,width:T="auto",maxWidth:V=T==="auto"?void 0:250,arrow:ve=!0,visible:B,onVisibleChange:H,destroyTooltipOnHide:we=!1,zIndex:ye=1050,color:x,title:Te})=>{const F=v||Te,N=Array.isArray(b)?b:[b],[Ne,je]=p.useState(y),[I,Re]=p.useState({top:0,left:0}),[D,Ce]=p.useState({top:0,left:0}),j=p.useRef(null),A=p.useRef(null),m=p.useRef(),f=p.useRef(),g=B!==void 0?B:Ne,$=t=>{B===void 0&&je(t),H==null||H(t)},w=()=>{if(!j.current||!A.current)return;const t=j.current.getBoundingClientRect(),o=A.current.getBoundingClientRect(),c=8;let i=0,n=0,a=0,s=0;switch(d){case"top":i=t.top-o.height-c,n=t.left+t.width/2-o.width/2,a=o.height,s=o.width/2;break;case"bottom":i=t.bottom+c,n=t.left+t.width/2-o.width/2,a=-4,s=o.width/2;break;case"left":i=t.top+t.height/2-o.height/2,n=t.left-o.width-c,a=o.height/2,s=o.width;break;case"right":i=t.top+t.height/2-o.height/2,n=t.right+c,a=o.height/2,s=-4;break;case"topLeft":i=t.top-o.height-c,n=t.left,a=o.height,s=Math.min(t.width/2,20);break;case"topRight":i=t.top-o.height-c,n=t.right-o.width,a=o.height,s=o.width-Math.min(t.width/2,20);break;case"bottomLeft":i=t.bottom+c,n=t.left,a=-4,s=Math.min(t.width/2,20);break;case"bottomRight":i=t.bottom+c,n=t.right-o.width,a=-4,s=o.width-Math.min(t.width/2,20);break;case"leftTop":i=t.top,n=t.left-o.width-c,a=Math.min(t.height/2,10),s=o.width;break;case"leftBottom":i=t.bottom-o.height,n=t.left-o.width-c,a=o.height-Math.min(t.height/2,10),s=o.width;break;case"rightTop":i=t.top,n=t.right+c,a=Math.min(t.height/2,10),s=-4;break;case"rightBottom":i=t.bottom-o.height,n=t.right+c,a=o.height-Math.min(t.height/2,10),s=-4;break}const z=window.innerWidth,_=window.innerHeight;if(n<10){const h=n-10;n=10,(d.includes("top")||d.includes("bottom"))&&(s+=h)}else if(n+o.width>z-10){const h=n+o.width-(z-10);n-=h,(d.includes("top")||d.includes("bottom"))&&(s+=h)}if(i<10){const h=i-10;i=10,(d.includes("left")||d.includes("right"))&&(a+=h)}else if(i+o.height>_-10){const h=i+o.height-(_-10);i-=h,(d.includes("left")||d.includes("right"))&&(a+=h)}Re({top:i,left:n}),Ce({top:a,left:s})},R=()=>{f.current&&(clearTimeout(f.current),f.current=void 0),m.current||(m.current=setTimeout(()=>{$(!0),m.current=void 0},r))},C=()=>{m.current&&(clearTimeout(m.current),m.current=void 0),f.current||(f.current=setTimeout(()=>{$(!1),f.current=void 0},me))};p.useEffect(()=>{if(g){const t=setTimeout(()=>{w()},0);return window.addEventListener("resize",w),window.addEventListener("scroll",w,!0),()=>{clearTimeout(t),window.removeEventListener("resize",w),window.removeEventListener("scroll",w,!0)}}},[g,d]),p.useEffect(()=>()=>{m.current&&clearTimeout(m.current),f.current&&clearTimeout(f.current)},[]);const ke=()=>{const t={};return N.includes("hover")&&(t.onMouseEnter=R,t.onMouseLeave=C),N.includes("focus")&&(t.onFocus=R,t.onBlur=C),N.includes("click")&&(t.onClick=o=>{o.preventDefault(),g?C():R()}),N.includes("contextMenu")&&(t.onContextMenu=o=>{o.preventDefault(),g?C():R()}),t},Se=()=>{const t="absolute w-2 h-2";switch(d){case"top":case"topLeft":case"topRight":return`${t} rotate-[-135deg] bottom-[-5px]`;case"bottom":case"bottomLeft":case"bottomRight":return`${t} rotate-45 top-[-5px]`;case"left":case"leftTop":case"leftBottom":return`${t} rotate-[-45deg] right-[-5px]`;case"right":case"rightTop":case"rightBottom":return`${t} rotate-[135deg] left-[-5px]`;default:return t}},O=()=>{if(x)switch(x){case"pink":return"#eb2f96";case"red":return"#f5222d";case"yellow":return"#faad14";case"orange":return"#fa8c16";case"cyan":return"#13c2c2";case"green":return"#52c41a";case"blue":return"#1890ff";case"purple":return"#722ed1";case"geekblue":return"#2f54eb";case"magenta":return"#eb2f96";case"volcano":return"#fa541c";case"gold":return"#faad14";case"lime":return"#a0d911";default:return x}},Le=()=>{const t=ke();return P.isValidElement(u)&&(u.props.disabled||u.type==="button"&&u.props.disabled)?e.jsx("span",{ref:j,...t,className:"inline-block",children:u}):P.cloneElement(P.isValidElement(u)?u:e.jsx("span",{children:u}),{ref:j,...t})};return F?e.jsxs(e.Fragment,{children:[Le(),(g||!we)&&e.jsx(Ee,{children:e.jsx("div",{ref:A,className:Z("absolute z-[1050] pointer-events-none",fe),style:{...be,top:`${I.top}px`,left:`${I.left}px`,zIndex:ye,visibility:g?"visible":"hidden",opacity:g?1:0},children:e.jsx(We,{children:g&&e.jsxs(qe.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.95},transition:{type:"spring",damping:20,stiffness:300},className:Z("py-1 px-2 rounded-sm shadow-md text-white text-sm border border-gray-200 inline-block",ge,{"bg-gray-800":!x}),style:{...xe,width:T==="auto"?"auto":`${T}px`,maxWidth:V!==void 0?`${V}px`:void 0,whiteSpace:T==="auto"?"nowrap":"normal",backgroundColor:O()||(x?void 0:"#1f2937"),borderColor:"rgba(229, 231, 235, 0.8)"},children:[F,ve&&e.jsx("div",{className:Se(),style:{top:`${D.top}px`,left:`${D.left}px`,backgroundColor:O()||(x?void 0:"#1f2937"),boxShadow:"1px 1px 0 0 rgba(0, 0, 0, 0.05)",border:"1px solid rgba(229, 231, 235, 0.8)",borderRight:"none",borderBottom:"none"}})]})})})})]}):e.jsx(e.Fragment,{children:u})};l.__docgenInfo={description:`Tooltip component that shows additional information when hovering or clicking an element
Follows Ant Design's Tooltip implementation`,methods:[],displayName:"Tooltip",props:{content:{required:!0,tsType:{name:"ReactNode"},description:"The content to display inside the tooltip"},children:{required:!0,tsType:{name:"ReactNode"},description:"The element that triggers the tooltip"},placement:{required:!1,tsType:{name:"union",raw:`| "top"
| "left"
| "right"
| "bottom"
| "topLeft"
| "topRight"
| "bottomLeft"
| "bottomRight"
| "leftTop"
| "leftBottom"
| "rightTop"
| "rightBottom"`,elements:[{name:"literal",value:'"top"'},{name:"literal",value:'"left"'},{name:"literal",value:'"right"'},{name:"literal",value:'"bottom"'},{name:"literal",value:'"topLeft"'},{name:"literal",value:'"topRight"'},{name:"literal",value:'"bottomLeft"'},{name:"literal",value:'"bottomRight"'},{name:"literal",value:'"leftTop"'},{name:"literal",value:'"leftBottom"'},{name:"literal",value:'"rightTop"'},{name:"literal",value:'"rightBottom"'}]},description:"The preferred placement of the tooltip",defaultValue:{value:'"top"',computed:!1}},trigger:{required:!1,tsType:{name:"union",raw:"TooltipTrigger | TooltipTrigger[]",elements:[{name:"union",raw:'"hover" | "focus" | "click" | "contextMenu"',elements:[{name:"literal",value:'"hover"'},{name:"literal",value:'"focus"'},{name:"literal",value:'"click"'},{name:"literal",value:'"contextMenu"'}]},{name:"Array",elements:[{name:"union",raw:'"hover" | "focus" | "click" | "contextMenu"',elements:[{name:"literal",value:'"hover"'},{name:"literal",value:'"focus"'},{name:"literal",value:'"click"'},{name:"literal",value:'"contextMenu"'}]}],raw:"TooltipTrigger[]"}]},description:"How the tooltip is triggered",defaultValue:{value:'"hover"',computed:!1}},defaultVisible:{required:!1,tsType:{name:"boolean"},description:"Whether the tooltip is initially visible",defaultValue:{value:"false",computed:!1}},showDelay:{required:!1,tsType:{name:"number"},description:"Delay before showing the tooltip (in ms)",defaultValue:{value:"50",computed:!1}},hideDelay:{required:!1,tsType:{name:"number"},description:"Delay before hiding the tooltip (in ms)",defaultValue:{value:"50",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Custom CSS class for the tooltip"},overlayClassName:{required:!1,tsType:{name:"string"},description:"CSS class for the tooltip content"},overlayInnerClassName:{required:!1,tsType:{name:"string"},description:"CSS class for the tooltip inner content"},overlayStyle:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:"CSS style for the tooltip"},overlayInnerStyle:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:"CSS style for the tooltip inner content"},width:{required:!1,tsType:{name:"union",raw:'"auto" | number',elements:[{name:"literal",value:'"auto"'},{name:"number"}]},description:"Width of the tooltip - 'auto' or specific pixel value",defaultValue:{value:'"auto"',computed:!1}},maxWidth:{required:!1,tsType:{name:"number"},description:"Max width of the tooltip in pixels",defaultValue:{value:'"auto" === width ? undefined : 250',computed:!1}},arrow:{required:!1,tsType:{name:"boolean"},description:"Whether the tooltip should have an arrow",defaultValue:{value:"true",computed:!1}},visible:{required:!1,tsType:{name:"boolean"},description:"Whether the tooltip is visible (controlled mode)"},onVisibleChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(visible: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"visible"}],return:{name:"void"}}},description:"Callback when visibility changes"},destroyTooltipOnHide:{required:!1,tsType:{name:"boolean"},description:"Whether to destroy tooltip when hidden",defaultValue:{value:"false",computed:!1}},allowHoverOnDisabled:{required:!1,tsType:{name:"boolean"},description:"Whether the tooltip can be used with disabled elements"},zIndex:{required:!1,tsType:{name:"number"},description:"Z-index of the tooltip",defaultValue:{value:"1050",computed:!1}},title:{required:!1,tsType:{name:"string"},description:"HTML title of the tooltip"},color:{required:!1,tsType:{name:"string"},description:"Color of the tooltip (predefined or custom)"}}};const De={title:"Base/Tooltip",component:l,parameters:{layout:"centered",componentSubtitle:"Displays informative text when users hover over or click an element",docs:{description:{component:"A tooltip component that provides additional information when interacting with an element."}}},tags:["autodocs"],argTypes:{placement:{description:"The position of the tooltip relative to the target",table:{defaultValue:{summary:"top"}}},width:{control:{type:"radio"},options:["auto",150,200,300],description:"The width of the tooltip",table:{defaultValue:{summary:"auto"}}},maxWidth:{control:{type:"radio"},options:[void 0,150,200,300],description:"The maximum width of the tooltip"},trigger:{description:"How the tooltip is activated",table:{defaultValue:{summary:"hover"}}}},render:v=>e.jsx(l,{...v})},k={args:{content:"This is a simple tooltip",children:e.jsx("button",{className:"px-4 py-2 bg-blue-500 text-white rounded",children:"Hover Me"})}},S={args:{content:e.jsxs("div",{children:[e.jsx("h3",{className:"font-bold mb-1",children:"Rich Content Tooltip"}),e.jsx("p",{children:"Tooltips can contain complex content including:"}),e.jsxs("ul",{className:"list-disc pl-4 mt-1",children:[e.jsx("li",{children:"Formatted text"}),e.jsx("li",{children:"Images"}),e.jsx("li",{children:"Other components"})]})]}),maxWidth:300,children:e.jsx("button",{className:"px-4 py-2 bg-green-500 text-white rounded",children:"Hover for Rich Content"})}},L={args:{content:"Click again to close this tooltip",trigger:"click",children:e.jsx("button",{className:"px-4 py-2 bg-purple-500 text-white rounded",children:"Click Me"})}},M={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-4 justify-center items-center",children:[e.jsx(l,{content:"Top placement",placement:"top",children:e.jsx("button",{className:"px-4 py-2 bg-blue-500 text-white rounded",children:"Top"})}),e.jsx(l,{content:"Right placement",placement:"right",children:e.jsx("button",{className:"px-4 py-2 bg-green-500 text-white rounded",children:"Right"})}),e.jsx(l,{content:"Bottom placement",placement:"bottom",children:e.jsx("button",{className:"px-4 py-2 bg-yellow-500 text-white rounded",children:"Bottom"})}),e.jsx(l,{content:"Left placement",placement:"left",children:e.jsx("button",{className:"px-4 py-2 bg-red-500 text-white rounded",children:"Left"})})]})},W={render:()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-wrap gap-4",children:[e.jsx(l,{content:"Auto width tooltip that adjusts to content",width:"auto",children:e.jsx("button",{className:"px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded",children:"Auto Width"})}),e.jsx(l,{content:"Fixed width tooltip with a width of 150px",width:150,children:e.jsx("button",{className:"px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded",children:"Fixed Width (150px)"})})]}),e.jsxs("div",{className:"flex flex-wrap gap-4",children:[e.jsx(l,{content:"This tooltip has a lot of content that would normally wrap, but it's set to auto width so it stays on one line.",width:"auto",children:e.jsx("button",{className:"px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded",children:"Long Auto Width"})}),e.jsx(l,{content:"This tooltip has a lot of content that will wrap because it has a fixed width of 200px.",width:200,children:e.jsx("button",{className:"px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded",children:"Long Fixed Width"})})]})]})},q={render:()=>e.jsxs("div",{className:"w-full max-w-3xl mx-auto",children:[e.jsxs("div",{className:"p-4 border rounded mb-4 relative overflow-hidden",children:[e.jsx("h3",{className:"text-lg font-bold mb-2",children:"Tooltip in a container with overflow"}),e.jsx("div",{className:"h-32 overflow-auto border p-4",children:e.jsx("div",{className:"flex items-center justify-center h-full",children:e.jsx(l,{content:"This tooltip should appear on top, regardless of the container's overflow",children:e.jsx("button",{className:"px-4 py-2 bg-purple-500 text-white rounded",children:"Hover Me"})})})})]}),e.jsxs("div",{className:"p-4 border rounded mb-4 relative",children:[e.jsx("h3",{className:"text-lg font-bold mb-2",children:"Tooltip near the edge of the screen"}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx(l,{content:"Left-aligned tooltip that should stay within viewport",placement:"bottom",children:e.jsx("button",{className:"px-4 py-2 bg-indigo-500 text-white rounded",children:"Left Edge"})}),e.jsx(l,{content:"Right-aligned tooltip that should stay within viewport",placement:"bottom",children:e.jsx("button",{className:"px-4 py-2 bg-pink-500 text-white rounded",children:"Right Edge"})})]})]}),e.jsxs("div",{className:"p-4 border rounded relative",children:[e.jsx("h3",{className:"text-lg font-bold mb-2",children:"Tooltip in fixed position element"}),e.jsx("div",{className:"relative h-32 border",children:e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:e.jsx(l,{content:"This tooltip should appear correctly even though it's in an absolutely positioned container",children:e.jsx("button",{className:"px-4 py-2 bg-teal-500 text-white rounded",children:"Hover Me"})})})})]})]})},E={args:{content:"Custom styled tooltip",className:"bg-indigo-600 text-yellow-200 font-medium",children:e.jsx("button",{className:"px-4 py-2 bg-indigo-500 text-white rounded",children:"Custom Style"})}};var G,J,K;k.parameters={...k.parameters,docs:{...(G=k.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    content: "This is a simple tooltip",
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover Me</button>
  }
}`,...(K=(J=k.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,U,X;S.parameters={...S.parameters,docs:{...(Q=S.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    content: <div>
        <h3 className="font-bold mb-1">Rich Content Tooltip</h3>
        <p>Tooltips can contain complex content including:</p>
        <ul className="list-disc pl-4 mt-1">
          <li>Formatted text</li>
          <li>Images</li>
          <li>Other components</li>
        </ul>
      </div>,
    maxWidth: 300,
    children: <button className="px-4 py-2 bg-green-500 text-white rounded">Hover for Rich Content</button>
  }
}`,...(X=(U=S.parameters)==null?void 0:U.docs)==null?void 0:X.source}}};var Y,ee,te;L.parameters={...L.parameters,docs:{...(Y=L.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    content: "Click again to close this tooltip",
    trigger: "click",
    children: <button className="px-4 py-2 bg-purple-500 text-white rounded">Click Me</button>
  }
}`,...(te=(ee=L.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};var oe,ie,ne;M.parameters={...M.parameters,docs:{...(oe=M.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-4 justify-center items-center">
      <Tooltip content="Top placement" placement="top">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Top</button>
      </Tooltip>

      <Tooltip content="Right placement" placement="right">
        <button className="px-4 py-2 bg-green-500 text-white rounded">Right</button>
      </Tooltip>

      <Tooltip content="Bottom placement" placement="bottom">
        <button className="px-4 py-2 bg-yellow-500 text-white rounded">Bottom</button>
      </Tooltip>

      <Tooltip content="Left placement" placement="left">
        <button className="px-4 py-2 bg-red-500 text-white rounded">Left</button>
      </Tooltip>
    </div>
}`,...(ne=(ie=M.parameters)==null?void 0:ie.docs)==null?void 0:ne.source}}};var re,ae,se;W.parameters={...W.parameters,docs:{...(re=W.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <Tooltip content="Auto width tooltip that adjusts to content" width="auto">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
            Auto Width
          </button>
        </Tooltip>

        <Tooltip content="Fixed width tooltip with a width of 150px" width={150}>
          <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
            Fixed Width (150px)
          </button>
        </Tooltip>
      </div>

      <div className="flex flex-wrap gap-4">
        <Tooltip content="This tooltip has a lot of content that would normally wrap, but it's set to auto width so it stays on one line." width="auto">
          <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded">
            Long Auto Width
          </button>
        </Tooltip>

        <Tooltip content="This tooltip has a lot of content that will wrap because it has a fixed width of 200px." width={200}>
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded">
            Long Fixed Width
          </button>
        </Tooltip>
      </div>
    </div>
}`,...(se=(ae=W.parameters)==null?void 0:ae.docs)==null?void 0:se.source}}};var le,de,ce;q.parameters={...q.parameters,docs:{...(le=q.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => <div className="w-full max-w-3xl mx-auto">
      <div className="p-4 border rounded mb-4 relative overflow-hidden">
        <h3 className="text-lg font-bold mb-2">Tooltip in a container with overflow</h3>
        <div className="h-32 overflow-auto border p-4">
          <div className="flex items-center justify-center h-full">
            <Tooltip content="This tooltip should appear on top, regardless of the container's overflow">
              <button className="px-4 py-2 bg-purple-500 text-white rounded">Hover Me</button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded mb-4 relative">
        <h3 className="text-lg font-bold mb-2">Tooltip near the edge of the screen</h3>
        <div className="flex justify-between">
          <Tooltip content="Left-aligned tooltip that should stay within viewport" placement="bottom">
            <button className="px-4 py-2 bg-indigo-500 text-white rounded">Left Edge</button>
          </Tooltip>

          <Tooltip content="Right-aligned tooltip that should stay within viewport" placement="bottom">
            <button className="px-4 py-2 bg-pink-500 text-white rounded">Right Edge</button>
          </Tooltip>
        </div>
      </div>

      <div className="p-4 border rounded relative">
        <h3 className="text-lg font-bold mb-2">Tooltip in fixed position element</h3>
        <div className="relative h-32 border">
          <div className="absolute inset-0 flex items-center justify-center">
            <Tooltip content="This tooltip should appear correctly even though it's in an absolutely positioned container">
              <button className="px-4 py-2 bg-teal-500 text-white rounded">Hover Me</button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
}`,...(ce=(de=q.parameters)==null?void 0:de.docs)==null?void 0:ce.source}}};var pe,ue,he;E.parameters={...E.parameters,docs:{...(pe=E.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    content: "Custom styled tooltip",
    className: "bg-indigo-600 text-yellow-200 font-medium",
    children: <button className="px-4 py-2 bg-indigo-500 text-white rounded">Custom Style</button>
  }
}`,...(he=(ue=E.parameters)==null?void 0:ue.docs)==null?void 0:he.source}}};const $e=["Default","WithRichContent","ClickTrigger","Placements","WidthOptions","InContainers","CustomStyling"];export{L as ClickTrigger,E as CustomStyling,k as Default,q as InContainers,M as Placements,W as WidthOptions,S as WithRichContent,$e as __namedExportsOrder,De as default};
