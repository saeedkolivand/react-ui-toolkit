import{j as e}from"./jsx-runtime-SoHorTFJ.js";import{R as s,C as n}from"./Col-CtvbpQ2c.js";import"./iframe-CslfcfHY.js";import"./tw-merge-Ds6tgvmq.js";const J={title:"Layout/Row",component:s,parameters:{layout:"fullscreen"},tags:["autodocs"],argTypes:{justify:{control:"select",options:["start","end","center","between","around","evenly"],description:"Horizontal alignment of columns"},align:{control:"select",options:["start","end","center","baseline","stretch"],description:"Vertical alignment of columns"},spacing:{control:"select",options:[0,1,2,3,4,5,6,8,10,12,16],description:"Space between columns"},wrap:{control:"boolean",description:"Whether to wrap columns to multiple lines"},reverse:{control:"boolean",description:"Whether to reverse the order of columns"}}},r=({children:o,className:y="",color:B="gray"})=>{const N=()=>{switch(B){case"blue":return"bg-blue-500";case"green":return"bg-green-500";case"purple":return"bg-purple-500";case"orange":return"bg-orange-500";case"pink":return"bg-pink-500";default:return"bg-gray-500"}};return e.jsx("div",{className:`p-8 rounded-lg text-white text-lg ${N()} ${y}`,children:o})},c=({children:o})=>e.jsx("div",{className:"py-16 w-full max-w-6xl mx-auto px-8",children:o}),l={args:{justify:"start",align:"stretch",spacing:4,wrap:!0,reverse:!1},render:o=>e.jsx(c,{children:e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg",children:e.jsxs(s,{...o,children:[e.jsx(n,{span:4,children:e.jsx(r,{color:"blue",children:"Column 1"})}),e.jsx(n,{span:4,children:e.jsx(r,{color:"green",children:"Column 2"})}),e.jsx(n,{span:4,children:e.jsx(r,{color:"purple",children:"Column 3"})})]})})})},t={args:{spacing:4},render:o=>e.jsx(c,{children:e.jsxs("div",{className:"space-y-16",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Justify Start"}),e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg",children:e.jsxs(s,{...o,justify:"start",children:[e.jsx(n,{span:3,children:e.jsx(r,{color:"blue",children:"Start"})}),e.jsx(n,{span:3,children:e.jsx(r,{color:"green",children:"Start"})})]})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Justify Center"}),e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg",children:e.jsxs(s,{...o,justify:"center",children:[e.jsx(n,{span:3,children:e.jsx(r,{color:"blue",children:"Center"})}),e.jsx(n,{span:3,children:e.jsx(r,{color:"green",children:"Center"})})]})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Justify End"}),e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg",children:e.jsxs(s,{...o,justify:"end",children:[e.jsx(n,{span:3,children:e.jsx(r,{color:"blue",children:"End"})}),e.jsx(n,{span:3,children:e.jsx(r,{color:"green",children:"End"})})]})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Justify Between"}),e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg",children:e.jsxs(s,{...o,justify:"between",children:[e.jsx(n,{span:3,children:e.jsx(r,{color:"blue",children:"Between"})}),e.jsx(n,{span:3,children:e.jsx(r,{color:"green",children:"Between"})})]})})]})]})})},d={args:{spacing:4},render:o=>e.jsx(c,{children:e.jsxs("div",{className:"space-y-16",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Align Start"}),e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg h-48",children:e.jsxs(s,{...o,align:"start",children:[e.jsx(n,{span:4,children:e.jsx(r,{color:"blue",children:"Start"})}),e.jsx(n,{span:4,children:e.jsx(r,{color:"green",className:"h-24",children:"Start"})})]})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Align Center"}),e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg h-48",children:e.jsxs(s,{...o,align:"center",children:[e.jsx(n,{span:4,children:e.jsx(r,{color:"blue",children:"Center"})}),e.jsx(n,{span:4,children:e.jsx(r,{color:"green",className:"h-24",children:"Center"})})]})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Align End"}),e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg h-48",children:e.jsxs(s,{...o,align:"end",children:[e.jsx(n,{span:4,children:e.jsx(r,{color:"blue",children:"End"})}),e.jsx(n,{span:4,children:e.jsx(r,{color:"green",className:"h-24",children:"End"})})]})})]})]})})},a={args:{justify:"start",align:"stretch",spacing:4,wrap:!0,reverse:!1},render:o=>e.jsx(c,{children:e.jsx("div",{className:"border-2 border-dashed border-gray-300 p-8 rounded-lg",children:e.jsxs(s,{...o,children:[e.jsx(n,{span:4,children:e.jsx(r,{color:"blue",children:"Column 1"})}),e.jsx(n,{span:4,children:e.jsx(r,{color:"green",children:"Column 2"})}),e.jsx(n,{span:4,children:e.jsx(r,{color:"purple",children:"Column 3"})})]})})})};var i,x,h;l.parameters={...l.parameters,docs:{...(i=l.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    justify: "start",
    align: "stretch",
    spacing: 4,
    wrap: true,
    reverse: false
  },
  render: args => <Section>
      <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
        <Row {...args}>
          <Col span={4}>
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
}`,...(h=(x=l.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};var p,m,g;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    spacing: 4
  },
  render: args => <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Justify Start</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row {...args} justify="start">
              <Col span={3}>
                <ContentBox color="blue">Start</ContentBox>
              </Col>
              <Col span={3}>
                <ContentBox color="green">Start</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Justify Center</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row {...args} justify="center">
              <Col span={3}>
                <ContentBox color="blue">Center</ContentBox>
              </Col>
              <Col span={3}>
                <ContentBox color="green">Center</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Justify End</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row {...args} justify="end">
              <Col span={3}>
                <ContentBox color="blue">End</ContentBox>
              </Col>
              <Col span={3}>
                <ContentBox color="green">End</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Justify Between</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
            <Row {...args} justify="between">
              <Col span={3}>
                <ContentBox color="blue">Between</ContentBox>
              </Col>
              <Col span={3}>
                <ContentBox color="green">Between</ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
}`,...(g=(m=t.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var u,b,C;d.parameters={...d.parameters,docs:{...(u=d.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    spacing: 4
  },
  render: args => <Section>
      <div className="space-y-16">
        <div>
          <h3 className="text-xl font-semibold mb-4">Align Start</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg h-48">
            <Row {...args} align="start">
              <Col span={4}>
                <ContentBox color="blue">Start</ContentBox>
              </Col>
              <Col span={4}>
                <ContentBox color="green" className="h-24">
                  Start
                </ContentBox>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Align Center</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg h-48">
            <Row {...args} align="center">
              <Col span={4}>
                <ContentBox color="blue">Center</ContentBox>
              </Col>
              <Col span={4}>
                <ContentBox color="green" className="h-24">
                  Center
                </ContentBox>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Align End</h3>
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg h-48">
            <Row {...args} align="end">
              <Col span={4}>
                <ContentBox color="blue">End</ContentBox>
              </Col>
              <Col span={4}>
                <ContentBox color="green" className="h-24">
                  End
                </ContentBox>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Section>
}`,...(C=(b=d.parameters)==null?void 0:b.docs)==null?void 0:C.source}}};var j,v,f;a.parameters={...a.parameters,docs:{...(j=a.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    justify: "start",
    align: "stretch",
    spacing: 4,
    wrap: true,
    reverse: false
  },
  render: args => <Section>
      <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
        <Row {...args}>
          <Col span={4}>
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
}`,...(f=(v=a.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};const A=["Default","JustifyExamples","AlignExamples","InteractiveExample"];export{d as AlignExamples,l as Default,a as InteractiveExample,t as JustifyExamples,A as __namedExportsOrder,J as default};
