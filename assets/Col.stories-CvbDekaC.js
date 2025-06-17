import{j as e}from"./jsx-runtime-DybDIJL1.js";import{C as n,R as s}from"./Col-DFi9zeXS.js";import"./iframe-CvCZTrg7.js";import"./tw-merge-Ds6tgvmq.js";const J={title:"Layout/Col",component:n,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{span:{control:"select",options:[1,2,3,4,5,6,7,8,9,10,11,12],description:"Number of columns to span"},sm:{control:"select",options:[1,2,3,4,5,6,7,8,9,10,11,12],description:"Number of columns to span on small screens"},md:{control:"select",options:[1,2,3,4,5,6,7,8,9,10,11,12],description:"Number of columns to span on medium screens"},lg:{control:"select",options:[1,2,3,4,5,6,7,8,9,10,11,12],description:"Number of columns to span on large screens"},xl:{control:"select",options:[1,2,3,4,5,6,7,8,9,10,11,12],description:"Number of columns to span on extra large screens"},offset:{control:"select",options:[0,1,2,3,4,5,6,7,8,9,10,11],description:"Number of columns to offset"},order:{control:"select",options:[1,2,3,4,5,6,7,8,9,10,11,12,"first","last"],description:"Order of the column"}}},r=({children:o,className:T="",color:d="gray"})=>e.jsx("div",{className:`p-8 rounded-lg text-white text-lg ${d==="blue"?"bg-blue-500":d==="green"?"bg-green-500":d==="purple"?"bg-purple-500":d==="orange"?"bg-orange-500":d==="pink"?"bg-pink-500":"bg-gray-500"} ${T}`,children:o}),l=({children:o})=>e.jsx("div",{className:"py-16 w-full max-w-6xl mx-auto px-8",children:o}),a={args:{span:4},render:o=>e.jsx(l,{children:e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg",children:e.jsxs(s,{children:[e.jsx(n,{...o,children:e.jsx(r,{color:"blue",children:"Column 1"})}),e.jsx(n,{span:4,children:e.jsx(r,{color:"green",children:"Column 2"})}),e.jsx(n,{span:4,children:e.jsx(r,{color:"purple",children:"Column 3"})})]})})})},t={args:{span:4},render:o=>e.jsx(l,{children:e.jsx("div",{className:"space-y-16",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Different Column Spans"}),e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg",children:e.jsxs(s,{children:[e.jsx(n,{span:2,children:e.jsx(r,{color:"blue",children:"Span 2"})}),e.jsx(n,{...o,children:e.jsx(r,{color:"green",children:"Controlled Span"})}),e.jsx(n,{span:6,children:e.jsx(r,{color:"purple",children:"Span 6"})})]})})]})})})},c={args:{span:12},render:o=>e.jsx(l,{children:e.jsx("div",{className:"space-y-16",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Full Width Column"}),e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg",children:e.jsxs(s,{children:[e.jsx(n,{...o,children:e.jsx(r,{color:"blue",children:"Full Width"})}),e.jsx(n,{span:4,children:e.jsx(r,{color:"green",children:"Fixed Width"})})]})})]})})})},i={args:{span:12},render:o=>e.jsx(l,{children:e.jsx("div",{className:"space-y-16",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Full Width Column"}),e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg",children:e.jsx(s,{children:e.jsx(n,{...o,children:e.jsx(r,{color:"blue",children:"Full Width"})})})})]})})})},p={args:{span:4,offset:2},render:o=>e.jsx(l,{children:e.jsx("div",{className:"space-y-16",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Column with Offset"}),e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg",children:e.jsxs(s,{children:[e.jsx(n,{...o,children:e.jsx(r,{color:"blue",children:"With Offset"})}),e.jsx(n,{span:4,children:e.jsx(r,{color:"green",children:"No Offset"})})]})})]})})})},x={args:{span:4,order:2},render:o=>e.jsx(l,{children:e.jsx("div",{className:"space-y-16",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Column Order"}),e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg",children:e.jsxs(s,{children:[e.jsx(n,{...o,children:e.jsx(r,{color:"blue",children:"Order 2"})}),e.jsx(n,{span:4,order:1,children:e.jsx(r,{color:"green",children:"Order 1"})}),e.jsx(n,{span:4,order:3,children:e.jsx(r,{color:"purple",children:"Order 3"})})]})})]})})})},m={args:{span:12,sm:6,md:4,lg:3},render:o=>e.jsx(l,{children:e.jsx("div",{className:"space-y-16",children:e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Responsive Columns"}),e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg",children:e.jsxs(s,{children:[e.jsx(n,{...o,children:e.jsx(r,{color:"blue",children:"Responsive"})}),e.jsx(n,{span:12,sm:6,md:4,lg:3,children:e.jsx(r,{color:"green",children:"Responsive"})}),e.jsx(n,{span:12,sm:6,md:4,lg:3,children:e.jsx(r,{color:"purple",children:"Responsive"})}),e.jsx(n,{span:12,sm:6,md:4,lg:3,children:e.jsx(r,{color:"orange",children:"Responsive"})})]})})]})})})},h={args:{span:4,offset:0,order:1},render:o=>e.jsx(l,{children:e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg",children:e.jsxs(s,{children:[e.jsx(n,{...o,children:e.jsx(r,{color:"blue",children:"Interactive Column"})}),e.jsx(n,{span:4,children:e.jsx(r,{color:"green",children:"Fixed Column"})}),e.jsx(n,{span:4,children:e.jsx(r,{color:"purple",children:"Fixed Column"})})]})})})};var u,g,C;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    span: 4
  },
  render: args => <Section>
      <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
        <Row>
          <Col {...args}>
            <ContentBox color="blue">Column 1</ContentBox>
          </Col>
          <Col span={4}>
            <ContentBox color="green">Column 2</ContentBox>
          </Col>
          <Col span={4}>
            <ContentBox color="purple">Column 3</ContentBox>
          </Col>
        </Row>
      </div>
    </Section>
}`,...(C=(g=a.parameters)==null?void 0:g.docs)==null?void 0:C.source}}};var b,j,v;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    span: 4
  },
  render: args => <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Different Column Spans</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row>
              <Col span={2}>
                <ContentBox color="blue">Span 2</ContentBox>
              </Col>
              <Col {...args}>
                <ContentBox color="green">Controlled Span</ContentBox>
              </Col>
              <Col span={6}>
                <ContentBox color="purple">Span 6</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
}`,...(v=(j=t.parameters)==null?void 0:j.docs)==null?void 0:v.source}}};var f,N,B;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    span: 12
  },
  render: args => <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Full Width Column</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row>
              <Col {...args}>
                <ContentBox color="blue">Full Width</ContentBox>
              </Col>
              <Col span={4}>
                <ContentBox color="green">Fixed Width</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
}`,...(B=(N=c.parameters)==null?void 0:N.docs)==null?void 0:B.source}}};var S,y,R;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    span: 12
  },
  render: args => <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Full Width Column</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row>
              <Col {...args}>
                <ContentBox color="blue">Full Width</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
}`,...(R=(y=i.parameters)==null?void 0:y.docs)==null?void 0:R.source}}};var w,O,W;p.parameters={...p.parameters,docs:{...(w=p.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    span: 4,
    offset: 2
  },
  render: args => <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Column with Offset</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row>
              <Col {...args}>
                <ContentBox color="blue">With Offset</ContentBox>
              </Col>
              <Col span={4}>
                <ContentBox color="green">No Offset</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
}`,...(W=(O=p.parameters)==null?void 0:O.docs)==null?void 0:W.source}}};var F,D,E;x.parameters={...x.parameters,docs:{...(F=x.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    span: 4,
    order: 2
  },
  render: args => <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Column Order</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row>
              <Col {...args}>
                <ContentBox color="blue">Order 2</ContentBox>
              </Col>
              <Col span={4} order={1}>
                <ContentBox color="green">Order 1</ContentBox>
              </Col>
              <Col span={4} order={3}>
                <ContentBox color="purple">Order 3</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
}`,...(E=(D=x.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};var I,k,A;m.parameters={...m.parameters,docs:{...(I=m.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    span: 12,
    sm: 6,
    md: 4,
    lg: 3
  },
  render: args => <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Responsive Columns</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row>
              <Col {...args}>
                <ContentBox color="blue">Responsive</ContentBox>
              </Col>
              <Col span={12} sm={6} md={4} lg={3}>
                <ContentBox color="green">Responsive</ContentBox>
              </Col>
              <Col span={12} sm={6} md={4} lg={3}>
                <ContentBox color="purple">Responsive</ContentBox>
              </Col>
              <Col span={12} sm={6} md={4} lg={3}>
                <ContentBox color="orange">Responsive</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
}`,...(A=(k=m.parameters)==null?void 0:k.docs)==null?void 0:A.source}}};var _,$,L;h.parameters={...h.parameters,docs:{...(_=h.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    span: 4,
    offset: 0,
    order: 1
  },
  render: args => <Section>
      <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
        <Row>
          <Col {...args}>
            <ContentBox color="blue">Interactive Column</ContentBox>
          </Col>
          <Col span={4}>
            <ContentBox color="green">Fixed Column</ContentBox>
          </Col>
          <Col span={4}>
            <ContentBox color="purple">Fixed Column</ContentBox>
          </Col>
        </Row>
      </div>
    </Section>
}`,...(L=($=h.parameters)==null?void 0:$.docs)==null?void 0:L.source}}};const K=["Default","DifferentSpans","AutoWidth","FullWidth","WithOffset","WithOrder","Responsive","InteractiveExample"];export{c as AutoWidth,a as Default,t as DifferentSpans,i as FullWidth,h as InteractiveExample,m as Responsive,p as WithOffset,x as WithOrder,K as __namedExportsOrder,J as default};
