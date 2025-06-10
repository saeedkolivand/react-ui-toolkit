import{j as e}from"./jsx-runtime-kY6nksJd.js";import{r as U}from"./iframe-BTFKCMRb.js";import{t as g}from"./tw-merge-Ds6tgvmq.js";const _=({items:p,allowMultiple:h=!1,defaultExpanded:a,className:B})=>{const[P,O]=U.useState(()=>a===void 0?[]:Array.isArray(a)?a:[a]),z=t=>{p[t].disabled||O(n=>h?n.includes(t)?n.filter(s=>s!==t):[...n,t]:n.includes(t)?[]:[t])},J=g("divide-y divide-gray-200 border-t border-b border-gray-200",B);return e.jsx("div",{className:J,role:"tablist",children:p.map((t,n)=>{const s=P.includes(n);return e.jsxs("div",{className:"py-2",children:[e.jsxs("button",{className:g("w-full flex justify-between items-center py-2 px-4 text-left","focus:outline-none",t.disabled&&"opacity-50 cursor-not-allowed",!t.disabled&&"hover:bg-gray-50"),onClick:()=>z(n),disabled:t.disabled,"aria-expanded":s,"aria-controls":`panel-${n}`,role:"tab",children:[e.jsx("span",{className:"font-medium",children:t.title}),e.jsx("svg",{className:g("w-5 h-5 transform transition-transform duration-200",s&&"rotate-180"),fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M19 9l-7 7-7-7",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2})})]}),s&&e.jsx("div",{id:`panel-${n}`,role:"tabpanel","aria-hidden":!s,className:"px-4 py-2",children:t.content})]},n)})})};_.__docgenInfo={description:"",methods:[],displayName:"Accordion",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"AccordionItem"}],raw:"AccordionItem[]"},description:"The items to display in the accordion"},allowMultiple:{required:!1,tsType:{name:"boolean"},description:"Whether multiple panels can be expanded at once",defaultValue:{value:"false",computed:!1}},defaultExpanded:{required:!1,tsType:{name:"union",raw:"number | number[]",elements:[{name:"number"},{name:"Array",elements:[{name:"number"}],raw:"number[]"}]},description:"The index of the initially expanded panel(s)"},className:{required:!1,tsType:{name:"string"},description:"Additional classes to be applied to the accordion"}}};const V={title:"Navigation/Accordion",component:_,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{items:{control:"object",description:"Array of accordion items"},defaultExpanded:{control:"number",description:"Index of the item to be open by default"},allowMultiple:{control:"boolean",description:"Whether multiple items can be open at once"}}},i=[{title:"What is React?",content:"React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies."},{title:"What is TypeScript?",content:"TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale."},{title:"What is Tailwind CSS?",content:"Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces."}],r={args:{items:i}},o={args:{items:i,defaultExpanded:0}},l={args:{items:i,allowMultiple:!0}},c={args:{items:[{title:"Custom Styled Content",content:e.jsxs("div",{className:"p-4 bg-gray-50 rounded-lg",children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Custom Content"}),e.jsx("p",{className:"text-gray-600",children:"This is an example of custom content in an accordion item. You can put any React component here."}),e.jsx("button",{className:"mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700",children:"Click me"})]})},{title:"Another Custom Item",content:e.jsx("div",{className:"p-4 bg-gray-50 rounded-lg",children:e.jsxs("ul",{className:"list-disc list-inside",children:[e.jsx("li",{children:"Item 1"}),e.jsx("li",{children:"Item 2"}),e.jsx("li",{children:"Item 3"})]})})}]}},d={args:{items:[...i.slice(0,1),{title:"Disabled Section",content:"This section cannot be expanded because it is disabled.",disabled:!0},...i.slice(2)]}},m={args:{items:[{title:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("svg",{className:"w-5 h-5 text-primary-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),e.jsx("span",{children:"Rich Title with Icon"})]}),content:e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium",children:"Rich Content Example"}),e.jsx("p",{children:"This panel contains formatted content with multiple elements."}),e.jsxs("ul",{className:"list-disc list-inside",children:[e.jsx("li",{children:"List item 1"}),e.jsx("li",{children:"List item 2"}),e.jsx("li",{children:"List item 3"})]}),e.jsx("button",{className:"px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700",children:"Action Button"})]})},{title:"Regular Section",content:"This is a regular section for comparison."}]}},u={args:{items:[{title:"Long Content Section",content:e.jsx("div",{children:Array.from({length:5}).map((p,h)=>e.jsx("p",{className:"mb-4",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."},h))})},...i.slice(1)]}};var b,x,f;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    items: defaultItems
  }
}`,...(f=(x=r.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var y,v,j;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    items: defaultItems,
    defaultExpanded: 0
  }
}`,...(j=(v=o.parameters)==null?void 0:v.docs)==null?void 0:j.source}}};var N,C,w;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    items: defaultItems,
    allowMultiple: true
  }
}`,...(w=(C=l.parameters)==null?void 0:C.docs)==null?void 0:w.source}}};var S,I,T;c.parameters={...c.parameters,docs:{...(S=c.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    items: [{
      title: "Custom Styled Content",
      content: <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Custom Content</h3>
            <p className="text-gray-600">
              This is an example of custom content in an accordion item. You can put any React
              component here.
            </p>
            <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              Click me
            </button>
          </div>
    }, {
      title: "Another Custom Item",
      content: <div className="p-4 bg-gray-50 rounded-lg">
            <ul className="list-disc list-inside">
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </div>
    }]
  }
}`,...(T=(I=c.parameters)==null?void 0:I.docs)==null?void 0:T.source}}};var A,k,L;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    items: [...defaultItems.slice(0, 1), {
      title: "Disabled Section",
      content: "This section cannot be expanded because it is disabled.",
      disabled: true
    }, ...defaultItems.slice(2)]
  }
}`,...(L=(k=d.parameters)==null?void 0:k.docs)==null?void 0:L.source}}};var W,R,q;m.parameters={...m.parameters,docs:{...(W=m.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    items: [{
      title: <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Rich Title with Icon</span>
          </div>,
      content: <div className="space-y-4">
            <h3 className="text-lg font-medium">Rich Content Example</h3>
            <p>This panel contains formatted content with multiple elements.</p>
            <ul className="list-disc list-inside">
              <li>List item 1</li>
              <li>List item 2</li>
              <li>List item 3</li>
            </ul>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              Action Button
            </button>
          </div>
    }, {
      title: "Regular Section",
      content: "This is a regular section for comparison."
    }]
  }
}`,...(q=(R=m.parameters)==null?void 0:R.docs)==null?void 0:q.source}}};var M,D,E;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    items: [{
      title: "Long Content Section",
      content: <div>
            {Array.from({
          length: 5
        }).map((_, i) => <p key={i} className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>)}
          </div>
    }, ...defaultItems.slice(1)]
  }
}`,...(E=(D=u.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};const G=["Default","DefaultOpen","AllowMultiple","CustomContent","WithDisabledPanel","WithRichContent","WithLongContent"];export{l as AllowMultiple,c as CustomContent,r as Default,o as DefaultOpen,d as WithDisabledPanel,u as WithLongContent,m as WithRichContent,G as __namedExportsOrder,V as default};
