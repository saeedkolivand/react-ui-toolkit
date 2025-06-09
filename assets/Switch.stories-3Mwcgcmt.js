import{j as e}from"./jsx-runtime-C06lrZbP.js";import{R as ge,r as T}from"./iframe-DE3FgLuB.js";import{t as h}from"./tw-merge-Ds6tgvmq.js";const t=ge.forwardRef(({className:s,label:o,helperText:r,error:i,size:a="md",disabled:l,checked:c,loading:n,onChange:y,...L},me)=>{const g={sm:{switch:"w-8 h-4",thumb:"h-3 w-3",translate:"translate-x-4",spinner:"h-2.5 w-2.5"},md:{switch:"w-11 h-6",thumb:"h-5 w-5",translate:"translate-x-5",spinner:"h-3.5 w-3.5"},lg:{switch:"w-14 h-7",thumb:"h-6 w-6",translate:"translate-x-7",spinner:"h-4 w-4"}},le={sm:"text-sm",md:"text-base",lg:"text-lg"},de=h("relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-800",g[a].switch,c?"bg-primary-600 dark:bg-primary-500":"bg-gray-200 dark:bg-gray-600",l&&"cursor-not-allowed opacity-50",n&&"cursor-wait",s),ie=h("pointer-events-none inline-flex items-center justify-center transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:bg-gray-100",g[a].thumb,c?g[a].translate:"translate-x-0"),ce=h("animate-spin rounded-full border-[1.5px] border-current border-t-transparent",g[a].spinner),oe=h("ml-3 font-medium text-gray-700 dark:text-gray-200",le[a],l&&"text-gray-400 dark:text-gray-500",i&&"text-red-500 dark:text-red-400",n&&"opacity-70"),he=pe=>{!l&&!n&&y&&y({target:{checked:!c}})};return e.jsxs("div",{className:"relative",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsxs("div",{className:de,role:"switch","aria-checked":c,onClick:he,children:[e.jsx("input",{type:"checkbox",className:"sr-only",checked:c,disabled:l||n,onChange:y,name:L.name,...L}),e.jsx("span",{className:ie,children:n&&e.jsx("div",{className:ce})})]}),o&&e.jsx("span",{className:oe,children:o})]}),(r||i)&&e.jsx("p",{className:h("mt-1 text-sm",i?"text-red-500 dark:text-red-400":"text-gray-500 dark:text-gray-400"),children:i||r})]})});t.displayName="Switch";t.__docgenInfo={description:"",methods:[],displayName:"Switch",props:{label:{required:!1,tsType:{name:"string"},description:"Label for the switch"},helperText:{required:!1,tsType:{name:"string"},description:"Helper text to be displayed below the switch"},error:{required:!1,tsType:{name:"string"},description:"Error message to be displayed"},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"The size of the switch",defaultValue:{value:'"md"',computed:!1}},checked:{required:!1,tsType:{name:"boolean"},description:"Whether the switch is checked"},loading:{required:!1,tsType:{name:"boolean"},description:"Whether the switch is in loading state"},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(event: React.ChangeEvent<HTMLInputElement>) => void",signature:{arguments:[{type:{name:"ReactChangeEvent",raw:"React.ChangeEvent<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},name:"event"}],return:{name:"void"}}},description:"Callback when the switch state changes"}},composes:["Omit"]};const Ce={title:"Base/Switch",component:t,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{label:{control:"text",description:"Label text for the switch"},size:{control:"select",options:["sm","md","lg"],description:"The size of the switch"},error:{control:"text",description:"Error message to display"},helperText:{control:"text",description:"Helper text to display below the switch"},disabled:{control:"boolean",description:"Whether the switch is disabled"},checked:{control:"boolean",description:"Whether the switch is checked"},loading:{control:"boolean",description:"Whether the switch is in loading state"}}},d=s=>{const[o,r]=T.useState(s.checked||!1),[i,a]=T.useState(s.loading||!1),l=c=>{a(!0),r(c.target.checked),setTimeout(()=>{a(!1)},2e3)};return e.jsx(t,{...s,checked:o,loading:i,onChange:l})},m={render:d,args:{label:"Switch"}},p={render:d,args:{label:"Checked",checked:!0}},u={render:d,args:{label:"Loading",loading:!0}},b={render:d,args:{label:"Loading Checked",checked:!0,loading:!0}},k={render:d,args:{label:"Small",size:"sm"}},f={render:d,args:{label:"Large",size:"lg"}},C={render:d,args:{label:"With Helper Text",helperText:"This is a helper text"}},x={render:d,args:{label:"With Error",error:"This field is required"}},S={render:d,args:{label:"Disabled",disabled:!0}},w={render:d,args:{label:"Disabled Checked",disabled:!0,checked:!0}},v={render:()=>{const[s,o]=T.useState({default:!1,checked:!0,loading:!1,loadingChecked:!0,small:!1,large:!1,helper:!1,error:!1,disabled:!1,disabledChecked:!0}),[r,i]=T.useState({default:!1,checked:!1,loading:!0,loadingChecked:!0,small:!1,large:!1,helper:!1,error:!1,disabled:!1,disabledChecked:!1}),a=l=>c=>{i(n=>({...n,[l]:!0})),o(n=>({...n,[l]:c.target.checked})),setTimeout(()=>{i(n=>({...n,[l]:!1}))},2e3)};return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{label:"Default",checked:s.default,loading:r.default,onChange:a("default")}),e.jsx(t,{label:"Checked",checked:s.checked,loading:r.checked,onChange:a("checked")}),e.jsx(t,{label:"Loading",checked:s.loading,loading:r.loading,onChange:a("loading")}),e.jsx(t,{label:"Loading Checked",checked:s.loadingChecked,loading:r.loadingChecked,onChange:a("loadingChecked")}),e.jsx(t,{label:"Small",size:"sm",checked:s.small,loading:r.small,onChange:a("small")}),e.jsx(t,{label:"Large",size:"lg",checked:s.large,loading:r.large,onChange:a("large")})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{label:"With Helper Text",helperText:"This is a helper text",checked:s.helper,loading:r.helper,onChange:a("helper")}),e.jsx(t,{label:"With Error",error:"This field is required",checked:s.error,loading:r.error,onChange:a("error")}),e.jsx(t,{label:"Disabled",disabled:!0,checked:s.disabled,loading:r.disabled,onChange:a("disabled")}),e.jsx(t,{label:"Disabled Checked",disabled:!0,checked:s.disabledChecked,loading:r.disabledChecked,onChange:a("disabledChecked")})]})]})}};var j,E,W;m.parameters={...m.parameters,docs:{...(j=m.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: InteractiveTemplate,
  args: {
    label: "Switch"
  }
}`,...(W=(E=m.parameters)==null?void 0:E.docs)==null?void 0:W.source}}};var D,I,N;p.parameters={...p.parameters,docs:{...(D=p.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: InteractiveTemplate,
  args: {
    label: "Checked",
    checked: true
  }
}`,...(N=(I=p.parameters)==null?void 0:I.docs)==null?void 0:N.source}}};var H,q,z;u.parameters={...u.parameters,docs:{...(H=u.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: InteractiveTemplate,
  args: {
    label: "Loading",
    loading: true
  }
}`,...(z=(q=u.parameters)==null?void 0:q.docs)==null?void 0:z.source}}};var R,M,_;b.parameters={...b.parameters,docs:{...(R=b.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: InteractiveTemplate,
  args: {
    label: "Loading Checked",
    checked: true,
    loading: true
  }
}`,...(_=(M=b.parameters)==null?void 0:M.docs)==null?void 0:_.source}}};var V,A,O;k.parameters={...k.parameters,docs:{...(V=k.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: InteractiveTemplate,
  args: {
    label: "Small",
    size: "sm"
  }
}`,...(O=(A=k.parameters)==null?void 0:A.docs)==null?void 0:O.source}}};var B,F,G;f.parameters={...f.parameters,docs:{...(B=f.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: InteractiveTemplate,
  args: {
    label: "Large",
    size: "lg"
  }
}`,...(G=(F=f.parameters)==null?void 0:F.docs)==null?void 0:G.source}}};var J,K,P;C.parameters={...C.parameters,docs:{...(J=C.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: InteractiveTemplate,
  args: {
    label: "With Helper Text",
    helperText: "This is a helper text"
  }
}`,...(P=(K=C.parameters)==null?void 0:K.docs)==null?void 0:P.source}}};var Q,U,X;x.parameters={...x.parameters,docs:{...(Q=x.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: InteractiveTemplate,
  args: {
    label: "With Error",
    error: "This field is required"
  }
}`,...(X=(U=x.parameters)==null?void 0:U.docs)==null?void 0:X.source}}};var Y,Z,$;S.parameters={...S.parameters,docs:{...(Y=S.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: InteractiveTemplate,
  args: {
    label: "Disabled",
    disabled: true
  }
}`,...($=(Z=S.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var ee,ae,se;w.parameters={...w.parameters,docs:{...(ee=w.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: InteractiveTemplate,
  args: {
    label: "Disabled Checked",
    disabled: true,
    checked: true
  }
}`,...(se=(ae=w.parameters)==null?void 0:ae.docs)==null?void 0:se.source}}};var re,te,ne;v.parameters={...v.parameters,docs:{...(re=v.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: () => {
    const [states, setStates] = useState({
      default: false,
      checked: true,
      loading: false,
      loadingChecked: true,
      small: false,
      large: false,
      helper: false,
      error: false,
      disabled: false,
      disabledChecked: true
    });
    const [loadingStates, setLoadingStates] = useState({
      default: false,
      checked: false,
      loading: true,
      loadingChecked: true,
      small: false,
      large: false,
      helper: false,
      error: false,
      disabled: false,
      disabledChecked: false
    });
    const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoadingStates(prev => ({
        ...prev,
        [key]: true
      }));
      setStates(prev => ({
        ...prev,
        [key]: e.target.checked
      }));
      // Simulate loading state
      setTimeout(() => {
        setLoadingStates(prev => ({
          ...prev,
          [key]: false
        }));
      }, 2000);
    };
    return <div className="space-y-4">
        <div className="space-y-2">
          <Switch label="Default" checked={states.default} loading={loadingStates.default} onChange={handleChange("default")} />
          <Switch label="Checked" checked={states.checked} loading={loadingStates.checked} onChange={handleChange("checked")} />
          <Switch label="Loading" checked={states.loading} loading={loadingStates.loading} onChange={handleChange("loading")} />
          <Switch label="Loading Checked" checked={states.loadingChecked} loading={loadingStates.loadingChecked} onChange={handleChange("loadingChecked")} />
          <Switch label="Small" size="sm" checked={states.small} loading={loadingStates.small} onChange={handleChange("small")} />
          <Switch label="Large" size="lg" checked={states.large} loading={loadingStates.large} onChange={handleChange("large")} />
        </div>
        <div className="space-y-2">
          <Switch label="With Helper Text" helperText="This is a helper text" checked={states.helper} loading={loadingStates.helper} onChange={handleChange("helper")} />
          <Switch label="With Error" error="This field is required" checked={states.error} loading={loadingStates.error} onChange={handleChange("error")} />
          <Switch label="Disabled" disabled checked={states.disabled} loading={loadingStates.disabled} onChange={handleChange("disabled")} />
          <Switch label="Disabled Checked" disabled checked={states.disabledChecked} loading={loadingStates.disabledChecked} onChange={handleChange("disabledChecked")} />
        </div>
      </div>;
  }
}`,...(ne=(te=v.parameters)==null?void 0:te.docs)==null?void 0:ne.source}}};const xe=["Default","Checked","Loading","LoadingChecked","Small","Large","WithHelperText","WithError","Disabled","DisabledChecked","AllVariants"];export{v as AllVariants,p as Checked,m as Default,S as Disabled,w as DisabledChecked,f as Large,u as Loading,b as LoadingChecked,k as Small,x as WithError,C as WithHelperText,xe as __namedExportsOrder,Ce as default};
