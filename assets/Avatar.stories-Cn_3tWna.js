import{j as e}from"./jsx-runtime-kY6nksJd.js";import{t as h}from"./tw-merge-Ds6tgvmq.js";import"./iframe-BTFKCMRb.js";const ie={xs:{container:"w-6 h-6",status:"w-1.5 h-1.5",font:"text-xs"},sm:{container:"w-8 h-8",status:"w-2 h-2",font:"text-sm"},md:{container:"w-10 h-10",status:"w-2.5 h-2.5",font:"text-base"},lg:{container:"w-12 h-12",status:"w-3 h-3",font:"text-lg"},xl:{container:"w-14 h-14",status:"w-3.5 h-3.5",font:"text-xl"}},ce={online:"bg-green-500",offline:"bg-gray-500",away:"bg-yellow-500",busy:"bg-red-500"},me=r=>r.split(" ").map(f=>f[0]).join("").toUpperCase().slice(0,2),s=({src:r,alt:f="",size:Z="md",status:g,initials:v,squared:x=!1,bordered:ee=!1,className:ae})=>{const{container:se,status:re,font:te}=ie[Z],le=h("relative inline-flex items-center justify-center bg-gray-200",se,x?"rounded-lg":"rounded-full",ee&&"border-2 border-white ring-2 ring-gray-200",ae),ne=h("absolute bottom-0 right-0 rounded-full ring-2 ring-white",re,g&&ce[g]),oe=()=>r?e.jsx("img",{src:r,alt:f,className:`w-full h-full object-cover ${x?"rounded-lg":"rounded-full"}`}):v?e.jsx("span",{className:`${te} font-medium text-gray-600`,children:me(v)}):e.jsx("svg",{className:"w-1/2 h-1/2 text-gray-400",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z",clipRule:"evenodd"})});return e.jsxs("div",{className:le,children:[oe(),g&&e.jsx("span",{className:ne})]})};s.__docgenInfo={description:"",methods:[],displayName:"Avatar",props:{src:{required:!1,tsType:{name:"string"},description:"The source URL of the avatar image"},alt:{required:!1,tsType:{name:"string"},description:"Alt text for the avatar image",defaultValue:{value:'""',computed:!1}},size:{required:!1,tsType:{name:"union",raw:'"xs" | "sm" | "md" | "lg" | "xl"',elements:[{name:"literal",value:'"xs"'},{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'},{name:"literal",value:'"xl"'}]},description:"The size of the avatar",defaultValue:{value:'"md"',computed:!1}},status:{required:!1,tsType:{name:"union",raw:'"online" | "offline" | "away" | "busy"',elements:[{name:"literal",value:'"online"'},{name:"literal",value:'"offline"'},{name:"literal",value:'"away"'},{name:"literal",value:'"busy"'}]},description:"The status indicator of the avatar"},initials:{required:!1,tsType:{name:"string"},description:"The initials to display when no image is available"},squared:{required:!1,tsType:{name:"boolean"},description:"Whether the avatar is squared",defaultValue:{value:"false",computed:!1}},bordered:{required:!1,tsType:{name:"boolean"},description:"Whether to show a border",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional classes to be applied to the avatar"}}};const Ae={title:"Feedback/Avatar",component:s,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:"select",options:["xs","sm","md","lg","xl"],description:"The size of the avatar"},status:{control:"select",options:["online","offline","away","busy"],description:"The status indicator of the avatar"},squared:{control:"boolean",description:"Whether the avatar is squared"},bordered:{control:"boolean",description:"Whether to show a border"},src:{control:"text",description:"The source URL of the avatar image"},alt:{control:"text",description:"Alt text for the avatar image"},initials:{control:"text",description:"The initials to display when no image is available"}}},a={male1:"https://xsgames.co/randomusers/assets/avatars/male/1.jpg",female1:"https://xsgames.co/randomusers/assets/avatars/female/1.jpg",male2:"https://xsgames.co/randomusers/assets/avatars/male/2.jpg",female2:"https://xsgames.co/randomusers/assets/avatars/female/2.jpg"},t={args:{src:a.male1,alt:"User Avatar"}},l={args:{initials:"John Doe"}},n={args:{src:a.female1,alt:"User Avatar",status:"online"}},o={args:{src:a.male2,alt:"User Avatar",squared:!0}},i={args:{src:a.female2,alt:"User Avatar",bordered:!0}},c={args:{src:a.male1,alt:"User Avatar",size:"xs"}},m={args:{src:a.female1,alt:"User Avatar",size:"sm"}},d={args:{src:a.male2,alt:"User Avatar",size:"lg"}},u={args:{src:a.female2,alt:"User Avatar",size:"xl"}},p={render:()=>e.jsxs("div",{className:"flex gap-4",children:[e.jsx(s,{src:a.male1,alt:"Online",status:"online"}),e.jsx(s,{src:a.female1,alt:"Offline",status:"offline"}),e.jsx(s,{src:a.male2,alt:"Away",status:"away"}),e.jsx(s,{src:a.female2,alt:"Busy",status:"busy"})]})},A={render:()=>e.jsxs("div",{className:"flex items-end gap-4",children:[e.jsx(s,{src:a.male1,alt:"XS",size:"xs"}),e.jsx(s,{src:a.female1,alt:"SM",size:"sm"}),e.jsx(s,{src:a.male2,alt:"MD",size:"md"}),e.jsx(s,{src:a.female2,alt:"LG",size:"lg"}),e.jsx(s,{src:a.male1,alt:"XL",size:"xl"})]})};var S,y,T;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    src: AVATAR_IMAGES.male1,
    alt: "User Avatar"
  }
}`,...(T=(y=t.parameters)==null?void 0:y.docs)==null?void 0:T.source}}};var b,w,z;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    initials: "John Doe"
  }
}`,...(z=(w=l.parameters)==null?void 0:w.docs)==null?void 0:z.source}}};var j,E,M;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    src: AVATAR_IMAGES.female1,
    alt: "User Avatar",
    status: "online"
  }
}`,...(M=(E=n.parameters)==null?void 0:E.docs)==null?void 0:M.source}}};var R,I,V;o.parameters={...o.parameters,docs:{...(R=o.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    src: AVATAR_IMAGES.male2,
    alt: "User Avatar",
    squared: true
  }
}`,...(V=(I=o.parameters)==null?void 0:I.docs)==null?void 0:V.source}}};var _,G,U;i.parameters={...i.parameters,docs:{...(_=i.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    src: AVATAR_IMAGES.female2,
    alt: "User Avatar",
    bordered: true
  }
}`,...(U=(G=i.parameters)==null?void 0:G.docs)==null?void 0:U.source}}};var q,N,L;c.parameters={...c.parameters,docs:{...(q=c.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    src: AVATAR_IMAGES.male1,
    alt: "User Avatar",
    size: "xs"
  }
}`,...(L=(N=c.parameters)==null?void 0:N.docs)==null?void 0:L.source}}};var W,D,B;m.parameters={...m.parameters,docs:{...(W=m.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    src: AVATAR_IMAGES.female1,
    alt: "User Avatar",
    size: "sm"
  }
}`,...(B=(D=m.parameters)==null?void 0:D.docs)==null?void 0:B.source}}};var C,O,X;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    src: AVATAR_IMAGES.male2,
    alt: "User Avatar",
    size: "lg"
  }
}`,...(X=(O=d.parameters)==null?void 0:O.docs)==null?void 0:X.source}}};var F,J,$;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    src: AVATAR_IMAGES.female2,
    alt: "User Avatar",
    size: "xl"
  }
}`,...($=(J=u.parameters)==null?void 0:J.docs)==null?void 0:$.source}}};var k,H,K;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4">
      <Avatar src={AVATAR_IMAGES.male1} alt="Online" status="online" />
      <Avatar src={AVATAR_IMAGES.female1} alt="Offline" status="offline" />
      <Avatar src={AVATAR_IMAGES.male2} alt="Away" status="away" />
      <Avatar src={AVATAR_IMAGES.female2} alt="Busy" status="busy" />
    </div>
}`,...(K=(H=p.parameters)==null?void 0:H.docs)==null?void 0:K.source}}};var P,Q,Y;A.parameters={...A.parameters,docs:{...(P=A.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <div className="flex items-end gap-4">
      <Avatar src={AVATAR_IMAGES.male1} alt="XS" size="xs" />
      <Avatar src={AVATAR_IMAGES.female1} alt="SM" size="sm" />
      <Avatar src={AVATAR_IMAGES.male2} alt="MD" size="md" />
      <Avatar src={AVATAR_IMAGES.female2} alt="LG" size="lg" />
      <Avatar src={AVATAR_IMAGES.male1} alt="XL" size="xl" />
    </div>
}`,...(Y=(Q=A.parameters)==null?void 0:Q.docs)==null?void 0:Y.source}}};const fe=["Default","WithInitials","WithStatus","Squared","Bordered","ExtraSmall","Small","Large","ExtraLarge","AllStatuses","AllSizes"];export{A as AllSizes,p as AllStatuses,i as Bordered,t as Default,u as ExtraLarge,c as ExtraSmall,d as Large,m as Small,o as Squared,l as WithInitials,n as WithStatus,fe as __namedExportsOrder,Ae as default};
