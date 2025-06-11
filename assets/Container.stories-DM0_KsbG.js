import{j as e}from"./jsx-runtime-COmSruMi.js";import{C as u}from"./Container-hpC2ReND.js";import"./iframe-CeBVcp-l.js";import"./tw-merge-Ds6tgvmq.js";const te={title:"Layout/Container",component:u,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{maxWidth:{control:"select",options:["sm","md","lg","xl","2xl","full","none"],description:"Maximum width of the container"},padding:{control:"boolean",description:"Whether to add padding to the container"},center:{control:"boolean",description:"Whether the container should be centered"}}},n=({children:C,color:r="gray"})=>e.jsx("div",{className:`p-6 rounded-lg text-white ${r==="blue"?"bg-blue-500":r==="green"?"bg-green-500":r==="purple"?"bg-purple-500":r==="orange"?"bg-orange-500":r==="pink"?"bg-pink-500":"bg-gray-500"}`,children:C}),o=({children:C})=>e.jsx("div",{className:"py-8",children:C}),t={args:{children:e.jsx(o,{children:e.jsx(n,{children:"Default container with max-width lg"})})}},s={args:{maxWidth:"sm",children:e.jsx(o,{children:e.jsx(n,{color:"blue",children:"Small container (max-width: 640px)"})})}},a={args:{maxWidth:"md",children:e.jsx(o,{children:e.jsx(n,{color:"green",children:"Medium container (max-width: 768px)"})})}},i={args:{maxWidth:"lg",children:e.jsx(o,{children:e.jsx(n,{color:"purple",children:"Large container (max-width: 1024px)"})})}},c={args:{maxWidth:"xl",children:e.jsx(o,{children:e.jsx(n,{color:"orange",children:"Extra large container (max-width: 1280px)"})})}},l={args:{maxWidth:"2xl",children:e.jsx(o,{children:e.jsx(n,{color:"pink",children:"Two extra large container (max-width: 1536px)"})})}},d={args:{maxWidth:"full",children:e.jsx(o,{children:e.jsx(n,{color:"blue",children:"Full width container"})})}},x={args:{padding:!1,children:e.jsx(o,{children:e.jsx(n,{color:"green",children:"Container without padding"})})}},m={args:{center:!1,children:e.jsx(o,{children:e.jsx(n,{color:"purple",children:"Container not centered"})})}},p={render:()=>e.jsx(u,{children:e.jsx(o,{children:e.jsxs("div",{className:"space-y-6",children:[e.jsx(n,{color:"blue",children:"First section"}),e.jsx(n,{color:"green",children:"Second section"}),e.jsx(n,{color:"purple",children:"Third section"})]})})})},h={render:()=>e.jsx(u,{maxWidth:"lg",children:e.jsx(o,{children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[e.jsx(n,{color:"blue",children:"Responsive grid item 1"}),e.jsx(n,{color:"green",children:"Responsive grid item 2"}),e.jsx(n,{color:"purple",children:"Responsive grid item 3"})]})})})},g={render:()=>e.jsx(u,{children:e.jsx(o,{children:e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs(n,{color:"blue",children:[e.jsx("h2",{className:"text-xl font-bold mb-4",children:"Header Section"}),e.jsx("p",{children:"This is a header section with some content."})]}),e.jsxs(n,{color:"green",children:[e.jsx("h2",{className:"text-xl font-bold mb-4",children:"Navigation"}),e.jsx("p",{children:"This is a navigation section with some content."})]})]}),e.jsxs(n,{color:"purple",children:[e.jsx("h2",{className:"text-xl font-bold mb-4",children:"Main Content"}),e.jsx("p",{children:"This is the main content area with some example text."})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsx(n,{color:"orange",children:"Footer Item 1"}),e.jsx(n,{color:"pink",children:"Footer Item 2"}),e.jsx(n,{color:"blue",children:"Footer Item 3"})]})]})})})};var j,S,B;t.parameters={...t.parameters,docs:{...(j=t.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    children: <Section>
        <ContentBox>Default container with max-width lg</ContentBox>
      </Section>
  }
}`,...(B=(S=t.parameters)==null?void 0:S.docs)==null?void 0:B.source}}};var b,w,v;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    maxWidth: "sm",
    children: <Section>
        <ContentBox color="blue">Small container (max-width: 640px)</ContentBox>
      </Section>
  }
}`,...(v=(w=s.parameters)==null?void 0:w.docs)==null?void 0:v.source}}};var N,f,W;a.parameters={...a.parameters,docs:{...(N=a.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    maxWidth: "md",
    children: <Section>
        <ContentBox color="green">Medium container (max-width: 768px)</ContentBox>
      </Section>
  }
}`,...(W=(f=a.parameters)==null?void 0:f.docs)==null?void 0:W.source}}};var T,y,F;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    maxWidth: "lg",
    children: <Section>
        <ContentBox color="purple">Large container (max-width: 1024px)</ContentBox>
      </Section>
  }
}`,...(F=(y=i.parameters)==null?void 0:y.docs)==null?void 0:F.source}}};var L,E,R;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    maxWidth: "xl",
    children: <Section>
        <ContentBox color="orange">Extra large container (max-width: 1280px)</ContentBox>
      </Section>
  }
}`,...(R=(E=c.parameters)==null?void 0:E.docs)==null?void 0:R.source}}};var M,k,I;l.parameters={...l.parameters,docs:{...(M=l.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    maxWidth: "2xl",
    children: <Section>
        <ContentBox color="pink">Two extra large container (max-width: 1536px)</ContentBox>
      </Section>
  }
}`,...(I=(k=l.parameters)==null?void 0:k.docs)==null?void 0:I.source}}};var D,H,P;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    maxWidth: "full",
    children: <Section>
        <ContentBox color="blue">Full width container</ContentBox>
      </Section>
  }
}`,...(P=(H=d.parameters)==null?void 0:H.docs)==null?void 0:P.source}}};var _,O,$;x.parameters={...x.parameters,docs:{...(_=x.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    padding: false,
    children: <Section>
        <ContentBox color="green">Container without padding</ContentBox>
      </Section>
  }
}`,...($=(O=x.parameters)==null?void 0:O.docs)==null?void 0:$.source}}};var q,z,A;m.parameters={...m.parameters,docs:{...(q=m.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    center: false,
    children: <Section>
        <ContentBox color="purple">Container not centered</ContentBox>
      </Section>
  }
}`,...(A=(z=m.parameters)==null?void 0:z.docs)==null?void 0:A.source}}};var G,J,K;p.parameters={...p.parameters,docs:{...(G=p.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <Container>
      <Section>
        <div className="space-y-6">
          <ContentBox color="blue">First section</ContentBox>
          <ContentBox color="green">Second section</ContentBox>
          <ContentBox color="purple">Third section</ContentBox>
        </div>
      </Section>
    </Container>
}`,...(K=(J=p.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,U,V;h.parameters={...h.parameters,docs:{...(Q=h.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <Container maxWidth="lg">
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentBox color="blue">Responsive grid item 1</ContentBox>
          <ContentBox color="green">Responsive grid item 2</ContentBox>
          <ContentBox color="purple">Responsive grid item 3</ContentBox>
        </div>
      </Section>
    </Container>
}`,...(V=(U=h.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};var X,Y,Z;g.parameters={...g.parameters,docs:{...(X=g.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <Container>
      <Section>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContentBox color="blue">
              <h2 className="text-xl font-bold mb-4">Header Section</h2>
              <p>This is a header section with some content.</p>
            </ContentBox>
            <ContentBox color="green">
              <h2 className="text-xl font-bold mb-4">Navigation</h2>
              <p>This is a navigation section with some content.</p>
            </ContentBox>
          </div>
          <ContentBox color="purple">
            <h2 className="text-xl font-bold mb-4">Main Content</h2>
            <p>This is the main content area with some example text.</p>
          </ContentBox>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContentBox color="orange">Footer Item 1</ContentBox>
            <ContentBox color="pink">Footer Item 2</ContentBox>
            <ContentBox color="blue">Footer Item 3</ContentBox>
          </div>
        </div>
      </Section>
    </Container>
}`,...(Z=(Y=g.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};const se=["Default","Small","Medium","Large","ExtraLarge","TwoExtraLarge","FullWidth","NoPadding","NotCentered","WithNestedContent","ResponsiveExample","ComplexLayout"];export{g as ComplexLayout,t as Default,c as ExtraLarge,d as FullWidth,i as Large,a as Medium,x as NoPadding,m as NotCentered,h as ResponsiveExample,s as Small,l as TwoExtraLarge,p as WithNestedContent,se as __namedExportsOrder,te as default};
