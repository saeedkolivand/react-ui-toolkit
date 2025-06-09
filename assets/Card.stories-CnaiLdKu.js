import{j as e}from"./jsx-runtime-DSEU96bk.js";import{t as N}from"./tw-merge-Ds6tgvmq.js";import"./iframe-COMYaoSe.js";const n={default:"bg-white",primary:"bg-blue-50 border-blue-200",secondary:"bg-gray-50 border-gray-200",success:"bg-green-50 border-green-200",warning:"bg-yellow-50 border-yellow-200",danger:"bg-red-50 border-red-200"},S={sm:"p-3",md:"p-4",lg:"p-6"},a=({children:d,header:H,footer:j,hoverable:He=!1,elevated:je=!1,bordered:We=!0,variant:s="default",size:T="md",fullWidth:Fe=!0,className:Re})=>{const De=N("rounded-lg overflow-hidden transition-all duration-200",n[s],!Fe&&"inline-block",We&&"border",je&&"shadow-md",He&&"hover:shadow-lg hover:translate-y-[-2px]",Re),qe=N("border-b",S[T],s==="default"?"border-gray-200":`border-opacity-50 ${n[s].split(" ")[1]}`),Be=S[T],Ve=N("border-t",S[T],s==="default"?"border-gray-200 bg-gray-50":`border-opacity-50 ${n[s].split(" ")[1]} bg-opacity-50 ${n[s].split(" ")[0]}`);return e.jsxs("div",{className:De,children:[H&&e.jsx("div",{className:qe,children:H}),e.jsx("div",{className:Be,children:d}),j&&e.jsx("div",{className:Ve,children:j})]})};a.__docgenInfo={description:"",methods:[],displayName:"Card",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"The content of the card"},header:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"The header content of the card"},footer:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"The footer content of the card"},hoverable:{required:!1,tsType:{name:"boolean"},description:"Whether to add a hover effect",defaultValue:{value:"false",computed:!1}},elevated:{required:!1,tsType:{name:"boolean"},description:"Whether to add a shadow effect",defaultValue:{value:"false",computed:!1}},bordered:{required:!1,tsType:{name:"boolean"},description:"Whether the card has a border",defaultValue:{value:"true",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:'"default" | "primary" | "secondary" | "success" | "warning" | "danger"',elements:[{name:"literal",value:'"default"'},{name:"literal",value:'"primary"'},{name:"literal",value:'"secondary"'},{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"danger"'}]},description:"The variant of the card",defaultValue:{value:'"default"',computed:!1}},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"The size of the card padding",defaultValue:{value:'"md"',computed:!1}},fullWidth:{required:!1,tsType:{name:"boolean"},description:"Whether to make the card full width",defaultValue:{value:"true",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional classes to be applied to the card"}}};const Le={title:"Feedback/Card",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","primary","secondary","success","warning","danger"],description:"The variant of the card"},size:{control:"select",options:["sm","md","lg"],description:"The size of the card padding"},hoverable:{control:"boolean",description:"Whether to add a hover effect"},elevated:{control:"boolean",description:"Whether to add a shadow effect"},bordered:{control:"boolean",description:"Whether the card has a border"},fullWidth:{control:"boolean",description:"Whether to make the card full width"},header:{control:"text",description:"The header content of the card"},footer:{control:"text",description:"The footer content of the card"}}},r=d=>e.jsx("h3",{className:"font-semibold",children:d}),Se=d=>e.jsx("div",{className:"text-sm text-gray-500",children:d}),t={args:{children:"This is a basic card with some content."}},o={args:{header:r("Card Header"),children:"This card has a header section."}},c={args:{children:"This card has a footer section.",footer:Se("Card Footer")}},i={args:{header:r("Card Header"),children:"This card has both header and footer sections.",footer:Se("Card Footer")}},l={args:{variant:"primary",header:r("Primary Card"),children:"This is a primary variant card."}},h={args:{variant:"secondary",header:r("Secondary Card"),children:"This is a secondary variant card."}},m={args:{variant:"success",header:r("Success Card"),children:"This is a success variant card."}},u={args:{variant:"warning",header:r("Warning Card"),children:"This is a warning variant card."}},p={args:{variant:"danger",header:r("Danger Card"),children:"This is a danger variant card."}},g={args:{header:r("Hoverable Card"),children:"This card has a hover effect.",hoverable:!0}},f={args:{header:r("Elevated Card"),children:"This card has a shadow effect.",elevated:!0}},v={args:{header:r("Borderless Card"),children:"This card has no border.",bordered:!1}},y={args:{header:r("Inline Card"),children:"This card is not full width.",fullWidth:!1}},b={args:{header:r("Small Card"),children:"This card has small padding.",size:"sm"}},C={args:{header:r("Large Card"),children:"This card has large padding.",size:"lg"}},x={args:{header:r("Complex Card"),children:e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Card Title"}),e.jsx("p",{className:"text-gray-600",children:"This is a more complex card with multiple elements and rich content."}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{className:"px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700",children:"Action Button"}),e.jsx("button",{className:"px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200",children:"Secondary Button"})]})]}),footer:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-gray-500",children:"Last updated 2 hours ago"}),e.jsx("button",{className:"text-sm text-blue-600 hover:text-blue-700",children:"View Details"})]})}},w={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:[e.jsx(a,{variant:"default",header:r("Default Card"),children:"Basic card with default styling"}),e.jsx(a,{variant:"primary",header:r("Primary Card"),children:"Card with primary variant"}),e.jsx(a,{variant:"secondary",header:r("Secondary Card"),children:"Card with secondary variant"}),e.jsx(a,{variant:"success",header:r("Success Card"),children:"Card with success variant"}),e.jsx(a,{variant:"warning",header:r("Warning Card"),children:"Card with warning variant"}),e.jsx(a,{variant:"danger",header:r("Danger Card"),children:"Card with danger variant"})]})};var W,F,R;t.parameters={...t.parameters,docs:{...(W=t.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    children: "This is a basic card with some content."
  }
}`,...(R=(F=t.parameters)==null?void 0:F.docs)==null?void 0:R.source}}};var D,q,B;o.parameters={...o.parameters,docs:{...(D=o.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Card Header"),
    children: "This card has a header section."
  }
}`,...(B=(q=o.parameters)==null?void 0:q.docs)==null?void 0:B.source}}};var V,z,A;c.parameters={...c.parameters,docs:{...(V=c.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    children: "This card has a footer section.",
    footer: renderFooter("Card Footer")
  }
}`,...(A=(z=c.parameters)==null?void 0:z.docs)==null?void 0:A.source}}};var E,L,P;i.parameters={...i.parameters,docs:{...(E=i.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Card Header"),
    children: "This card has both header and footer sections.",
    footer: renderFooter("Card Footer")
  }
}`,...(P=(L=i.parameters)==null?void 0:L.docs)==null?void 0:P.source}}};var k,_,I;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    header: renderHeader("Primary Card"),
    children: "This is a primary variant card."
  }
}`,...(I=(_=l.parameters)==null?void 0:_.docs)==null?void 0:I.source}}};var $,M,O;h.parameters={...h.parameters,docs:{...($=h.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    variant: "secondary",
    header: renderHeader("Secondary Card"),
    children: "This is a secondary variant card."
  }
}`,...(O=(M=h.parameters)==null?void 0:M.docs)==null?void 0:O.source}}};var G,J,K;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    variant: "success",
    header: renderHeader("Success Card"),
    children: "This is a success variant card."
  }
}`,...(K=(J=m.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,U,X;u.parameters={...u.parameters,docs:{...(Q=u.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    variant: "warning",
    header: renderHeader("Warning Card"),
    children: "This is a warning variant card."
  }
}`,...(X=(U=u.parameters)==null?void 0:U.docs)==null?void 0:X.source}}};var Y,Z,ee;p.parameters={...p.parameters,docs:{...(Y=p.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    variant: "danger",
    header: renderHeader("Danger Card"),
    children: "This is a danger variant card."
  }
}`,...(ee=(Z=p.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var re,ae,se;g.parameters={...g.parameters,docs:{...(re=g.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Hoverable Card"),
    children: "This card has a hover effect.",
    hoverable: true
  }
}`,...(se=(ae=g.parameters)==null?void 0:ae.docs)==null?void 0:se.source}}};var de,ne,te;f.parameters={...f.parameters,docs:{...(de=f.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Elevated Card"),
    children: "This card has a shadow effect.",
    elevated: true
  }
}`,...(te=(ne=f.parameters)==null?void 0:ne.docs)==null?void 0:te.source}}};var oe,ce,ie;v.parameters={...v.parameters,docs:{...(oe=v.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Borderless Card"),
    children: "This card has no border.",
    bordered: false
  }
}`,...(ie=(ce=v.parameters)==null?void 0:ce.docs)==null?void 0:ie.source}}};var le,he,me;y.parameters={...y.parameters,docs:{...(le=y.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Inline Card"),
    children: "This card is not full width.",
    fullWidth: false
  }
}`,...(me=(he=y.parameters)==null?void 0:he.docs)==null?void 0:me.source}}};var ue,pe,ge;b.parameters={...b.parameters,docs:{...(ue=b.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Small Card"),
    children: "This card has small padding.",
    size: "sm"
  }
}`,...(ge=(pe=b.parameters)==null?void 0:pe.docs)==null?void 0:ge.source}}};var fe,ve,ye;C.parameters={...C.parameters,docs:{...(fe=C.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Large Card"),
    children: "This card has large padding.",
    size: "lg"
  }
}`,...(ye=(ve=C.parameters)==null?void 0:ve.docs)==null?void 0:ye.source}}};var be,Ce,xe;x.parameters={...x.parameters,docs:{...(be=x.parameters)==null?void 0:be.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Complex Card"),
    children: <div className="space-y-4">
        <h3 className="text-lg font-semibold">Card Title</h3>
        <p className="text-gray-600">
          This is a more complex card with multiple elements and rich content.
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Action Button
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            Secondary Button
          </button>
        </div>
      </div>,
    footer: <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Last updated 2 hours ago</span>
        <button className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
      </div>
  }
}`,...(xe=(Ce=x.parameters)==null?void 0:Ce.docs)==null?void 0:xe.source}}};var we,Te,Ne;w.parameters={...w.parameters,docs:{...(we=w.parameters)==null?void 0:we.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card variant="default" header={renderHeader("Default Card")}>
        Basic card with default styling
      </Card>
      <Card variant="primary" header={renderHeader("Primary Card")}>
        Card with primary variant
      </Card>
      <Card variant="secondary" header={renderHeader("Secondary Card")}>
        Card with secondary variant
      </Card>
      <Card variant="success" header={renderHeader("Success Card")}>
        Card with success variant
      </Card>
      <Card variant="warning" header={renderHeader("Warning Card")}>
        Card with warning variant
      </Card>
      <Card variant="danger" header={renderHeader("Danger Card")}>
        Card with danger variant
      </Card>
    </div>
}`,...(Ne=(Te=w.parameters)==null?void 0:Te.docs)==null?void 0:Ne.source}}};const Pe=["Default","WithHeader","WithFooter","WithHeaderAndFooter","Primary","Secondary","Success","Warning","Danger","Hoverable","Elevated","NotBordered","NotFullWidth","Small","Large","ComplexContent","AllVariants"];export{w as AllVariants,x as ComplexContent,p as Danger,t as Default,f as Elevated,g as Hoverable,C as Large,v as NotBordered,y as NotFullWidth,l as Primary,h as Secondary,b as Small,m as Success,u as Warning,c as WithFooter,o as WithHeader,i as WithHeaderAndFooter,Pe as __namedExportsOrder,Le as default};
