import{j as r}from"./jsx-runtime-Bl_-tK0b.js";import{T as a}from"./ThemeContext-GAvaBGiR.js";import{N as s,u as P}from"./NotificationProvider-CdZH2Xfd.js";import{B as i}from"./Button-Cat-UgQ9.js";import"./iframe-rPefs_Tk.js";import"./index-DXk5olUk.js";import"./index-DZETyjRJ.js";import"./proxy-B5nbZ2E4.js";import"./tw-merge-Ds6tgvmq.js";const w={title:"Feedback/Notification",component:s,parameters:{layout:"centered"},tags:["autodocs"],decorators:[o=>r.jsx(a,{children:r.jsx(s,{children:r.jsx(o,{})})})]},c=()=>{const{success:o,error:v,info:g,warning:N}=P();return r.jsxs("div",{style:{display:"flex",gap:"8px"},children:[r.jsx(i,{onClick:()=>o("Success","This is a success notification"),variant:"success",children:"Success"}),r.jsx(i,{onClick:()=>v("Error","This is an error notification"),variant:"error",children:"Error"}),r.jsx(i,{onClick:()=>g("Info","This is an info notification"),variant:"info",children:"Info"}),r.jsx(i,{onClick:()=>N("Warning","This is a warning notification"),variant:"warning",children:"Warning"})]})},e={render:()=>r.jsx(c,{})},t={decorators:[o=>r.jsx(a,{children:r.jsx(s,{position:"bottom-right",children:r.jsx(o,{})})})],render:()=>r.jsx(c,{})},n={decorators:[o=>r.jsx(a,{children:r.jsx(s,{maxCount:2,children:r.jsx(o,{})})})],render:()=>r.jsx(c,{})};var d,m,p;e.parameters={...e.parameters,docs:{...(d=e.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <NotificationDemo />
}`,...(p=(m=e.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var f,u,x;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  decorators: [Story => <ThemeProvider>
        <NotificationProvider position="bottom-right">
          <Story />
        </NotificationProvider>
      </ThemeProvider>],
  render: () => <NotificationDemo />
}`,...(x=(u=t.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var l,h,j;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
  decorators: [Story => <ThemeProvider>
        <NotificationProvider maxCount={2}>
          <Story />
        </NotificationProvider>
      </ThemeProvider>],
  render: () => <NotificationDemo />
}`,...(j=(h=n.parameters)==null?void 0:h.docs)==null?void 0:j.source}}};const R=["Default","BottomRight","MaxCount"];export{t as BottomRight,e as Default,n as MaxCount,R as __namedExportsOrder,w as default};
