import{j as a}from"./jsx-runtime-C06lrZbP.js";import{r as S}from"./iframe-DE3FgLuB.js";import{c as p}from"./index-DF4cMLBe.js";import{C as P}from"./Container-BrIadCdd.js";import{S as le,O as ce}from"./Select-Cgibu0ij.js";import{B as j}from"./Button-Nbz_CEKJ.js";import{I as N}from"./Icon-VnSB2ZlB.js";import{T as ue}from"./Tag-f28sRgNO.js";import"./tw-merge-Ds6tgvmq.js";import"./index-BnkdCXS1.js";import"./index-B1xQ7Pdy.js";import"./proxy-JRkpVqov.js";function k({dataSource:o,columns:t,rowKey:g,size:m="middle",bordered:i=!1,loading:me=!1,pagination:e,scroll:C,onChange:T}){const[l,ee]=S.useState(()=>{const r=t.find(s=>s.defaultSortOrder);return{column:(r==null?void 0:r.dataIndex)||null,order:(r==null?void 0:r.defaultSortOrder)||null}}),re=p("w-full",{"border border-gray-200":i,"text-sm":m==="small","text-base":m==="middle","text-lg":m==="large"}),ae=r=>{if(!r.sorter)return;let s="ascend";l.column===r.dataIndex&&(l.order==="ascend"?s="descend":l.order==="descend"&&(s=null));const n={column:s?r.dataIndex:null,order:s};ee(n),T==null||T({sorter:s?{column:r.dataIndex,order:s}:void 0,pagination:e?{current:e.current,pageSize:e.pageSize}:void 0})},ne=()=>{if(!l.column||!l.order)return o;const r=t.find(s=>s.dataIndex===l.column);return r!=null&&r.sorter?[...o].sort((s,n)=>{const d=r.sorter(s,n);return l.order==="ascend"?d:-d}):o},te=r=>{if(!r.sorter)return null;const s=l.column===r.dataIndex,n=s&&l.order==="ascend",d=s&&l.order==="descend";return a.jsxs("span",{className:"ml-1 flex flex-col",children:[a.jsx(N,{name:"chevronUp",className:p("h-3 w-3",{"text-primary-600":n,"text-gray-400":!n})}),a.jsx(N,{name:"chevronDown",className:p("h-3 w-3 -mt-1",{"text-primary-600":d,"text-gray-400":!d})})]})},se=()=>a.jsx("thead",{children:a.jsx("tr",{className:"bg-gray-50",children:t.map(r=>a.jsx("th",{className:p("px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",{"cursor-pointer hover:bg-gray-100":r.sorter}),style:{width:r.width},onClick:()=>ae(r),children:a.jsxs("div",{className:"flex items-center",children:[r.title,te(r)]})},r.key))})}),oe=()=>{const r=ne(),s=e?r.slice((e.current-1)*e.pageSize,e.current*e.pageSize):r;return a.jsx("tbody",{className:"bg-white divide-y divide-gray-200",children:s.map(n=>a.jsx("tr",{className:"hover:bg-gray-50",children:t.map(d=>a.jsx("td",{className:"px-4 py-2 whitespace-nowrap",children:d.render?d.render(n[d.dataIndex],n):String(n[d.dataIndex])},d.key))},String(n[g])))})},de=()=>{if(!e)return null;const r=Math.ceil(e.total/e.pageSize),s=Array.from({length:r},(n,d)=>d+1);return a.jsxs(P,{className:"flex items-center justify-end gap-4 mt-4",children:[a.jsxs("div",{className:"flex items-center gap-2",children:[e.showSizeChanger&&a.jsx(le,{value:e.pageSize.toString(),onChange:n=>{const d=n.target.value;if(d&&e.onPageSizeChange){const ie=parseInt(d,10);e.onPageSizeChange(ie),e.onChange(1)}},size:"sm",className:"w-20",children:(e.pageSizeOptions||[10,20,30,40,50]).map(n=>a.jsx(ce,{value:n.toString(),children:n},n))}),a.jsxs("span",{className:"text-sm text-gray-600",children:[(e.current-1)*e.pageSize+1,"-",Math.min(e.current*e.pageSize,e.total)," of"," ",e.total]})]}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx(j,{variant:"outline",size:"sm",onClick:()=>e.onChange(e.current-1),disabled:e.current===1,className:"rounded-md",children:"←"}),a.jsx("div",{className:"flex items-center gap-1",children:s.map(n=>a.jsx(j,{variant:n===e.current?"primary":"outline",size:"sm",onClick:()=>e.onChange(n),className:p("min-w-[32px]",{"z-10":n===e.current}),children:n},n))}),a.jsx(j,{variant:"outline",size:"sm",onClick:()=>e.onChange(e.current+1),disabled:e.current===r,className:"rounded-md",children:"→"})]})]})};return a.jsxs(P,{className:"overflow-x-auto",style:{maxWidth:C==null?void 0:C.x},children:[a.jsxs("table",{className:re,children:[se(),oe()]}),de()]})}k.__docgenInfo={description:"",methods:[],displayName:"Table",props:{dataSource:{required:!0,tsType:{name:"Array",elements:[{name:"T"}],raw:"T[]"},description:""},columns:{required:!0,tsType:{name:"Array",elements:[{name:"ColumnType",elements:[{name:"T"}],raw:"ColumnType<T>"}],raw:"ColumnType<T>[]"},description:""},rowKey:{required:!0,tsType:{name:"T"},description:""},size:{required:!1,tsType:{name:"union",raw:'"small" | "middle" | "large"',elements:[{name:"literal",value:'"small"'},{name:"literal",value:'"middle"'},{name:"literal",value:'"large"'}]},description:"",defaultValue:{value:'"middle"',computed:!1}},bordered:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},pagination:{required:!1,tsType:{name:"union",raw:"TablePagination | false",elements:[{name:"TablePagination"},{name:"literal",value:"false"}]},description:""},scroll:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  x?: number | string;
  y?: number | string;
}`,signature:{properties:[{key:"x",value:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}],required:!1}},{key:"y",value:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}],required:!1}}]}},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:`(params: {
  sorter?: { column: keyof T; order: SortOrder };
  pagination?: { current: number; pageSize: number };
}) => void`,signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  sorter?: { column: keyof T; order: SortOrder };
  pagination?: { current: number; pageSize: number };
}`,signature:{properties:[{key:"sorter",value:{name:"signature",type:"object",raw:"{ column: keyof T; order: SortOrder }",signature:{properties:[{key:"column",value:{name:"T",required:!0}},{key:"order",value:{name:"union",raw:'"ascend" | "descend" | null',elements:[{name:"literal",value:'"ascend"'},{name:"literal",value:'"descend"'},{name:"null"}],required:!0}}]},required:!1}},{key:"pagination",value:{name:"signature",type:"object",raw:"{ current: number; pageSize: number }",signature:{properties:[{key:"current",value:{name:"number",required:!0}},{key:"pageSize",value:{name:"number",required:!0}}]},required:!1}}]}},name:"params"}],return:{name:"void"}}},description:""}}};const u=[{title:"Name",dataIndex:"name",key:"name",render:o=>a.jsx("a",{children:o}),sorter:(o,t)=>o.name.localeCompare(t.name)},{title:"Age",dataIndex:"age",key:"age",sorter:(o,t)=>o.age-t.age,defaultSortOrder:"descend"},{title:"Address",dataIndex:"address",key:"address",sorter:(o,t)=>o.address.localeCompare(t.address)},{title:"Tags",key:"tags",dataIndex:"tags",render:o=>a.jsx("span",{className:"flex flex-wrap gap-1",children:o.map(t=>a.jsx(ue,{color:"primary",variant:"outline",children:t},t))})}],c=[{id:1,name:"John Brown",age:32,address:"New York No. 1 Lake Park",tags:["nice","developer"]},{id:2,name:"Jim Green",age:42,address:"London No. 1 Lake Park",tags:["loser"]},{id:3,name:"Joe Black",age:32,address:"Sidney No. 1 Lake Park",tags:["cool","teacher"]},{id:4,name:"Alice White",age:28,address:"Paris No. 1 Lake Park",tags:["nice","designer"]},{id:5,name:"Bob Red",age:35,address:"Tokyo No. 1 Lake Park",tags:["cool","developer"]},{id:6,name:"Charlie Blue",age:29,address:"Berlin No. 1 Lake Park",tags:["nice","developer"]},{id:7,name:"David Yellow",age:31,address:"Rome No. 1 Lake Park",tags:["cool","designer"]},{id:8,name:"Eve Purple",age:27,address:"Madrid No. 1 Lake Park",tags:["nice","teacher"]}],Ce={title:"Base/Table",component:k,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{size:{control:"select",options:["small","middle","large"],description:"The size of the table"},bordered:{control:"boolean",description:"Whether to show all table borders"},loading:{control:"boolean",description:"Loading state of table"}}},h={args:{dataSource:c,columns:u,rowKey:"id"}},y={args:{dataSource:c,columns:u,rowKey:"id",bordered:!0}},x={args:{dataSource:c,columns:u,rowKey:"id",size:"small"}},f={args:{dataSource:c,columns:u,rowKey:"id",size:"large"}},w={args:{dataSource:c,columns:u,rowKey:"id",loading:!0}},z={render:()=>{const[o,t]=S.useState(1),[g,m]=S.useState(3);return a.jsx(k,{dataSource:c,columns:u,rowKey:"id",pagination:{current:o,pageSize:g,total:c.length,onChange:i=>t(i),showSizeChanger:!0,pageSizeOptions:[3,5,10],onPageSizeChange:i=>{m(i),t(1)}}})}},b={render:()=>{const[o,t]=S.useState(1),[g,m]=S.useState(3);return a.jsx(k,{dataSource:c,columns:u,rowKey:"id",pagination:{current:o,pageSize:g,total:c.length,onChange:i=>t(i),showSizeChanger:!0,pageSizeOptions:[3,5,10],onPageSizeChange:i=>{m(i),t(1)}},onChange:i=>{console.log("Sort changed:",i.sorter),console.log("Pagination changed:",i.pagination)}})}},v={args:{dataSource:c,columns:u,rowKey:"id",scroll:{x:800}}};var q,I,K;h.parameters={...h.parameters,docs:{...(q=h.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    dataSource: data,
    columns,
    rowKey: "id"
  }
}`,...(K=(I=h.parameters)==null?void 0:I.docs)==null?void 0:K.source}}};var O,L,B;y.parameters={...y.parameters,docs:{...(O=y.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    dataSource: data,
    columns,
    rowKey: "id",
    bordered: true
  }
}`,...(B=(L=y.parameters)==null?void 0:L.docs)==null?void 0:B.source}}};var A,D,W;x.parameters={...x.parameters,docs:{...(A=x.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    dataSource: data,
    columns,
    rowKey: "id",
    size: "small"
  }
}`,...(W=(D=x.parameters)==null?void 0:D.docs)==null?void 0:W.source}}};var _,E,J;f.parameters={...f.parameters,docs:{...(_=f.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    dataSource: data,
    columns,
    rowKey: "id",
    size: "large"
  }
}`,...(J=(E=f.parameters)==null?void 0:E.docs)==null?void 0:J.source}}};var M,R,U;w.parameters={...w.parameters,docs:{...(M=w.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    dataSource: data,
    columns,
    rowKey: "id",
    loading: true
  }
}`,...(U=(R=w.parameters)==null?void 0:R.docs)==null?void 0:U.source}}};var V,Y,G;z.parameters={...z.parameters,docs:{...(V=z.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => {
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    return <Table<User> dataSource={data} columns={columns} rowKey="id" pagination={{
      current,
      pageSize,
      total: data.length,
      onChange: page => setCurrent(page),
      showSizeChanger: true,
      pageSizeOptions: [3, 5, 10],
      onPageSizeChange: size => {
        setPageSize(size);
        setCurrent(1);
      }
    }} />;
  }
}`,...(G=(Y=z.parameters)==null?void 0:Y.docs)==null?void 0:G.source}}};var H,F,Q;b.parameters={...b.parameters,docs:{...(H=b.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => {
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    return <Table<User> dataSource={data} columns={columns} rowKey="id" pagination={{
      current,
      pageSize,
      total: data.length,
      onChange: page => setCurrent(page),
      showSizeChanger: true,
      pageSizeOptions: [3, 5, 10],
      onPageSizeChange: size => {
        setPageSize(size);
        setCurrent(1);
      }
    }} onChange={params => {
      console.log("Sort changed:", params.sorter);
      console.log("Pagination changed:", params.pagination);
    }} />;
  }
}`,...(Q=(F=b.parameters)==null?void 0:F.docs)==null?void 0:Q.source}}};var X,Z,$;v.parameters={...v.parameters,docs:{...(X=v.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    dataSource: data,
    columns,
    rowKey: "id",
    scroll: {
      x: 800
    }
  }
}`,...($=(Z=v.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};const Te=["Default","Bordered","Small","Large","Loading","WithPagination","WithSortingAndPagination","Scrollable"];export{y as Bordered,h as Default,f as Large,w as Loading,v as Scrollable,x as Small,z as WithPagination,b as WithSortingAndPagination,Te as __namedExportsOrder,Ce as default};
