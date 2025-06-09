import{j as r}from"./jsx-runtime-VVtj5fHL.js";import{I as F}from"./Icon-CUe3G0mZ.js";import{r as p}from"./iframe-CCGsSvNd.js";import{I as Q}from"./Input-BsDiMdAl.js";import{R as _,C as W}from"./Col-gMArGgAg.js";import{C as $}from"./Container-B-9uAEcE.js";import"./tw-merge-Ds6tgvmq.js";const U=["chevronLeft","chevronRight","chevronUp","chevronDown","arrowUp","arrowDown","arrowLeft","arrowRight","arrowUpRight","arrowUpLeft","arrowDownRight","arrowDownLeft","menu","close","home","externalLink","globe","play","pause","volumeUp","volumeDown","volumeOff","fastForward","rewind","skipForward","skipBackward","search","plus","minus","edit","trash","download","upload","copy","cut","paste","refresh","check","error","warning","info","eye","eyeOff","shield","flag","thumbsUp","thumbsDown","github","twitter","linkedin","facebook","instagram","youtube","file","folder","document","documentText","documentDuplicate","user","settings","bell","heart","star","filter","sort","grid","list","bookmark","mail","phone","chat","chatAlt","at","wrench","cog","scissors","pencil","sun","moon","cloud","umbrella","cart","tag","shoppingBag"],Y={title:"Base/Icon",component:F,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{name:{control:"select",options:U,description:"The name of the built-in icon to use"},size:{control:"select",options:["sm","md","lg","xl"],description:"The size of the icon"},color:{control:"color",description:"The color of the icon"}}},o={args:{name:"menu"}},s={args:{name:"menu",size:"sm"}},a={args:{name:"menu",size:"lg"}},n={args:{name:"menu",size:"xl"}},t={args:{name:"menu",color:"#FF0000"}},c={args:{customIcon:r.jsx("span",{children:"Custom Icon"})}},q=()=>{const[E,m]=p.useState(null),[l,A]=p.useState(""),B=async e=>{const G=`<Icon name="${e}" />`;await navigator.clipboard.writeText(G),m(e),setTimeout(()=>m(null),2e3)},O=U.filter(e=>e.toLowerCase().includes(l.toLowerCase()));return r.jsxs($,{maxWidth:"2xl",className:"overflow-hidden",children:[r.jsx("div",{className:"mb-6",children:r.jsx(Q,{placeholder:"Search icons...",value:l,onChange:e=>A(e.target.value),variant:"filled",size:"lg"})}),r.jsx(_,{justify:"center",spacing:4,className:"flex-wrap",children:O.map(e=>r.jsx(W,{span:2,sm:4,md:3,lg:2,children:r.jsxs("div",{className:"flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors",onClick:()=>B(e),children:[r.jsx("div",{className:"w-10 h-10 flex items-center justify-center mb-2",children:r.jsx(F,{name:e,size:"lg"})}),r.jsx("span",{className:"text-sm font-medium text-gray-700",children:e}),E===e&&r.jsx("span",{className:"text-xs text-green-600 mt-1",children:"Copied!"})]})},e))})]})},i={render:()=>r.jsx(q,{})};var u,d,g;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    name: "menu"
  }
}`,...(g=(d=o.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};var h,f,x;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    name: "menu",
    size: "sm"
  }
}`,...(x=(f=s.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var w,I,C;a.parameters={...a.parameters,docs:{...(w=a.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    name: "menu",
    size: "lg"
  }
}`,...(C=(I=a.parameters)==null?void 0:I.docs)==null?void 0:C.source}}};var j,v,b;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    name: "menu",
    size: "xl"
  }
}`,...(b=(v=n.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var y,S,L;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    name: "menu",
    color: "#FF0000"
  }
}`,...(L=(S=t.parameters)==null?void 0:S.docs)==null?void 0:L.source}}};var k,z,D;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    customIcon: <span>Custom Icon</span>
  }
}`,...(D=(z=c.parameters)==null?void 0:z.docs)==null?void 0:D.source}}};var N,T,R;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <IconGrid />
}`,...(R=(T=i.parameters)==null?void 0:T.docs)==null?void 0:R.source}}};const Z=["Default","Small","Large","ExtraLarge","Colored","CustomIcon","AllIcons"];export{i as AllIcons,t as Colored,c as CustomIcon,o as Default,n as ExtraLarge,a as Large,s as Small,Z as __namedExportsOrder,Y as default};
