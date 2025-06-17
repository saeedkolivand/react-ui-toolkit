import{j as e}from"./jsx-runtime-DybDIJL1.js";import{I as U}from"./Icon-wvQ8gbJo.js";import{r as u}from"./iframe-CvCZTrg7.js";import{T as _}from"./ThemeContext-CHb_KHx3.js";import{N as $,u as W}from"./NotificationProvider-DtyZT9P1.js";import{C as p,R as d}from"./Col-DFi9zeXS.js";import{I as q}from"./Input-LZYlLl8J.js";import{C as H}from"./Container-Dzl1W9rr.js";import"./tw-merge-Ds6tgvmq.js";import"./index-E-22a_Bq.js";import"./index-D2rjmfm6.js";import"./proxy-Df5340CY.js";const A=["chevronLeft","chevronRight","chevronUp","chevronDown","arrowUp","arrowDown","arrowLeft","arrowRight","arrowUpRight","arrowUpLeft","arrowDownRight","arrowDownLeft","menu","close","home","externalLink","globe","play","pause","volumeUp","volumeDown","volumeOff","fastForward","rewind","skipForward","skipBackward","search","plus","minus","edit","trash","download","upload","copy","cut","paste","refresh","check","error","warning","info","eye","eyeOff","shield","flag","thumbsUp","thumbsDown","github","twitter","linkedin","facebook","instagram","youtube","file","folder","document","documentText","documentDuplicate","user","settings","bell","heart","star","filter","sort","grid","list","bookmark","mail","phone","chat","chatAlt","at","wrench","cog","scissors","pencil","sun","moon","cloud","umbrella","cart","tag","shoppingBag"],J=()=>{const[o,B]=u.useState(""),{success:O}=W(),G=u.useCallback(r=>{const Q=`<Icon name="${r}" />`,s=document.createElement("textarea");s.value=Q,document.body.appendChild(s),s.select(),document.execCommand("copy"),document.body.removeChild(s),O("Copied!",`<Icon name="${r}" />`)},[]),P=A.filter(r=>r.toLowerCase().includes(o.toLowerCase()));return e.jsxs(H,{maxWidth:"full",children:[e.jsx(p,{span:12,className:"mb-6 mt-2 w-full",children:e.jsx(d,{justify:"center",spacing:4,className:"flex-wrap",children:e.jsx(q,{placeholder:"Search icons...",value:o,onChange:r=>B(r.target.value),variant:"filled",size:"lg",className:"w-full max-w-2xl mx-auto block"})})}),e.jsx(d,{justify:"center",spacing:4,className:"flex-wrap",children:P.map(r=>e.jsx(p,{span:2,sm:4,md:3,lg:2,children:e.jsxs("div",{className:"flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors",onClick:()=>G(r),children:[e.jsx("div",{className:"w-10 h-10 flex items-center justify-center mb-2",children:e.jsx(U,{name:r,size:"lg"})}),e.jsx("span",{className:"text-sm font-medium text-gray-700",children:r})]})},r))})]})},te={title:"Base/Icon",component:U,tags:["autodocs"],argTypes:{name:{control:"select",options:A,description:"The name of the built-in icon to use"},size:{control:"select",options:["sm","md","lg","xl"],description:"The size of the icon"},color:{control:"color",description:"The color of the icon"}},decorators:[o=>e.jsx(_,{children:e.jsx($,{position:"bottom-right",maxCount:3,children:e.jsx(o,{})})})]},a={args:{name:"menu"}},n={args:{name:"menu",size:"sm"}},t={args:{name:"menu",size:"lg"}},c={args:{name:"menu",size:"xl"}},m={args:{name:"menu",color:"#FF0000"}},i={args:{customIcon:e.jsx("span",{children:"Custom Icon"})}},l={render:()=>e.jsx(J,{})};var g,h,f;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    name: "menu"
  }
}`,...(f=(h=a.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var x,w,C;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    name: "menu",
    size: "sm"
  }
}`,...(C=(w=n.parameters)==null?void 0:w.docs)==null?void 0:C.source}}};var j,b,I;t.parameters={...t.parameters,docs:{...(j=t.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    name: "menu",
    size: "lg"
  }
}`,...(I=(b=t.parameters)==null?void 0:b.docs)==null?void 0:I.source}}};var v,y,k;c.parameters={...c.parameters,docs:{...(v=c.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    name: "menu",
    size: "xl"
  }
}`,...(k=(y=c.parameters)==null?void 0:y.docs)==null?void 0:k.source}}};var S,L,N;m.parameters={...m.parameters,docs:{...(S=m.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    name: "menu",
    color: "#FF0000"
  }
}`,...(N=(L=m.parameters)==null?void 0:L.docs)==null?void 0:N.source}}};var z,D,T;i.parameters={...i.parameters,docs:{...(z=i.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    customIcon: <span>Custom Icon</span>
  }
}`,...(T=(D=i.parameters)==null?void 0:D.docs)==null?void 0:T.source}}};var R,E,F;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <IconGrid />
}`,...(F=(E=l.parameters)==null?void 0:E.docs)==null?void 0:F.source}}};const ce=["Default","Small","Large","ExtraLarge","Colored","CustomIcon","AllIcons"];export{l as AllIcons,m as Colored,i as CustomIcon,a as Default,c as ExtraLarge,t as Large,n as Small,ce as __namedExportsOrder,te as default};
