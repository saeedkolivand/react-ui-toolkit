import{j as r}from"./jsx-runtime-SoHorTFJ.js";import{C as a}from"./Card-9YWy7oO-.js";import"./iframe-CslfcfHY.js";import"./tw-merge-Ds6tgvmq.js";const we={title:"Feedback/Card",component:a,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","primary","secondary","success","warning","danger"],description:"The variant of the card"},size:{control:"select",options:["sm","md","lg"],description:"The size of the card padding"},hoverable:{control:"boolean",description:"Whether to add a hover effect"},elevated:{control:"boolean",description:"Whether to add a shadow effect"},bordered:{control:"boolean",description:"Whether the card has a border"},fullWidth:{control:"boolean",description:"Whether to make the card full width"},header:{control:"text",description:"The header content of the card"},footer:{control:"text",description:"The footer content of the card"}}},e=y=>r.jsx("h3",{className:"font-semibold",children:y}),fe=y=>r.jsx("div",{className:"text-sm text-gray-500",children:y}),s={args:{children:"This is a basic card with some content."}},d={args:{header:e("Card Header"),children:"This card has a header section."}},n={args:{children:"This card has a footer section.",footer:fe("Card Footer")}},t={args:{header:e("Card Header"),children:"This card has both header and footer sections.",footer:fe("Card Footer")}},o={args:{variant:"primary",header:e("Primary Card"),children:"This is a primary variant card."}},c={args:{variant:"secondary",header:e("Secondary Card"),children:"This is a secondary variant card."}},i={args:{variant:"success",header:e("Success Card"),children:"This is a success variant card."}},h={args:{variant:"warning",header:e("Warning Card"),children:"This is a warning variant card."}},l={args:{variant:"danger",header:e("Danger Card"),children:"This is a danger variant card."}},m={args:{header:e("Hoverable Card"),children:"This card has a hover effect.",hoverable:!0}},g={args:{header:e("Elevated Card"),children:"This card has a shadow effect.",elevated:!0}},p={args:{header:e("Borderless Card"),children:"This card has no border.",bordered:!1}},u={args:{header:e("Inline Card"),children:"This card is not full width.",fullWidth:!1}},v={args:{header:e("Small Card"),children:"This card has small padding.",size:"sm"}},C={args:{header:e("Large Card"),children:"This card has large padding.",size:"lg"}},f={args:{header:e("Complex Card"),children:r.jsxs("div",{className:"space-y-4",children:[r.jsx("h3",{className:"text-lg font-semibold",children:"Card Title"}),r.jsx("p",{className:"text-gray-600",children:"This is a more complex card with multiple elements and rich content."}),r.jsxs("div",{className:"flex gap-2",children:[r.jsx("button",{className:"px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700",children:"Action Button"}),r.jsx("button",{className:"px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200",children:"Secondary Button"})]})]}),footer:r.jsxs("div",{className:"flex justify-between items-center",children:[r.jsx("span",{className:"text-sm text-gray-500",children:"Last updated 2 hours ago"}),r.jsx("button",{className:"text-sm text-blue-600 hover:text-blue-700",children:"View Details"})]})}},x={render:()=>r.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:[r.jsx(a,{variant:"default",header:e("Default Card"),children:"Basic card with default styling"}),r.jsx(a,{variant:"primary",header:e("Primary Card"),children:"Card with primary variant"}),r.jsx(a,{variant:"secondary",header:e("Secondary Card"),children:"Card with secondary variant"}),r.jsx(a,{variant:"success",header:e("Success Card"),children:"Card with success variant"}),r.jsx(a,{variant:"warning",header:e("Warning Card"),children:"Card with warning variant"}),r.jsx(a,{variant:"danger",header:e("Danger Card"),children:"Card with danger variant"})]})};var b,T,w;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    children: "This is a basic card with some content."
  }
}`,...(w=(T=s.parameters)==null?void 0:T.docs)==null?void 0:w.source}}};var S,H,N;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Card Header"),
    children: "This card has a header section."
  }
}`,...(N=(H=d.parameters)==null?void 0:H.docs)==null?void 0:N.source}}};var j,W,F;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    children: "This card has a footer section.",
    footer: renderFooter("Card Footer")
  }
}`,...(F=(W=n.parameters)==null?void 0:W.docs)==null?void 0:F.source}}};var D,B,z;t.parameters={...t.parameters,docs:{...(D=t.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Card Header"),
    children: "This card has both header and footer sections.",
    footer: renderFooter("Card Footer")
  }
}`,...(z=(B=t.parameters)==null?void 0:B.docs)==null?void 0:z.source}}};var A,E,L;o.parameters={...o.parameters,docs:{...(A=o.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    header: renderHeader("Primary Card"),
    children: "This is a primary variant card."
  }
}`,...(L=(E=o.parameters)==null?void 0:E.docs)==null?void 0:L.source}}};var P,V,k;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    variant: "secondary",
    header: renderHeader("Secondary Card"),
    children: "This is a secondary variant card."
  }
}`,...(k=(V=c.parameters)==null?void 0:V.docs)==null?void 0:k.source}}};var I,_,O;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    variant: "success",
    header: renderHeader("Success Card"),
    children: "This is a success variant card."
  }
}`,...(O=(_=i.parameters)==null?void 0:_.docs)==null?void 0:O.source}}};var R,q,G;h.parameters={...h.parameters,docs:{...(R=h.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    variant: "warning",
    header: renderHeader("Warning Card"),
    children: "This is a warning variant card."
  }
}`,...(G=(q=h.parameters)==null?void 0:q.docs)==null?void 0:G.source}}};var J,K,M;l.parameters={...l.parameters,docs:{...(J=l.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    variant: "danger",
    header: renderHeader("Danger Card"),
    children: "This is a danger variant card."
  }
}`,...(M=(K=l.parameters)==null?void 0:K.docs)==null?void 0:M.source}}};var Q,U,X;m.parameters={...m.parameters,docs:{...(Q=m.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Hoverable Card"),
    children: "This card has a hover effect.",
    hoverable: true
  }
}`,...(X=(U=m.parameters)==null?void 0:U.docs)==null?void 0:X.source}}};var Y,Z,$;g.parameters={...g.parameters,docs:{...(Y=g.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Elevated Card"),
    children: "This card has a shadow effect.",
    elevated: true
  }
}`,...($=(Z=g.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var ee,re,ae;p.parameters={...p.parameters,docs:{...(ee=p.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Borderless Card"),
    children: "This card has no border.",
    bordered: false
  }
}`,...(ae=(re=p.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};var se,de,ne;u.parameters={...u.parameters,docs:{...(se=u.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Inline Card"),
    children: "This card is not full width.",
    fullWidth: false
  }
}`,...(ne=(de=u.parameters)==null?void 0:de.docs)==null?void 0:ne.source}}};var te,oe,ce;v.parameters={...v.parameters,docs:{...(te=v.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Small Card"),
    children: "This card has small padding.",
    size: "sm"
  }
}`,...(ce=(oe=v.parameters)==null?void 0:oe.docs)==null?void 0:ce.source}}};var ie,he,le;C.parameters={...C.parameters,docs:{...(ie=C.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    header: renderHeader("Large Card"),
    children: "This card has large padding.",
    size: "lg"
  }
}`,...(le=(he=C.parameters)==null?void 0:he.docs)==null?void 0:le.source}}};var me,ge,pe;f.parameters={...f.parameters,docs:{...(me=f.parameters)==null?void 0:me.docs,source:{originalSource:`{
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
}`,...(pe=(ge=f.parameters)==null?void 0:ge.docs)==null?void 0:pe.source}}};var ue,ve,Ce;x.parameters={...x.parameters,docs:{...(ue=x.parameters)==null?void 0:ue.docs,source:{originalSource:`{
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
}`,...(Ce=(ve=x.parameters)==null?void 0:ve.docs)==null?void 0:Ce.source}}};const Se=["Default","WithHeader","WithFooter","WithHeaderAndFooter","Primary","Secondary","Success","Warning","Danger","Hoverable","Elevated","NotBordered","NotFullWidth","Small","Large","ComplexContent","AllVariants"];export{x as AllVariants,f as ComplexContent,l as Danger,s as Default,g as Elevated,m as Hoverable,C as Large,p as NotBordered,u as NotFullWidth,o as Primary,c as Secondary,v as Small,i as Success,h as Warning,n as WithFooter,d as WithHeader,t as WithHeaderAndFooter,Se as __namedExportsOrder,we as default};
