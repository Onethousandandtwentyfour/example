import{_ as t,g as s,c as a,w as e,i as l,o as n,a as r,b as i,r as c,F as o,d as h,n as d,e as u,t as f}from"./index-CP1YDlVe.js";const v=t({data:()=>({list:[],current:-1,interval:0}),computed:{listTransform(){const t=2*Math.PI/this.list.length;return this.list.map(((s,a)=>{const e=t*a;return{...s,styles:`transform:translate3d(${200*Math.cos(e)}%,${200*Math.sin(e)}%,0);width: 20%;height: 20%;`}}))}},onLoad(){this.list=s("date_list")||[]},methods:{start(){this.interval?(clearInterval(this.interval),this.interval=0):this.interval=setInterval((()=>{this.current=(this.current+1)%this.list.length}),50)}}},[["render",function(t,s,v,_,m,x){const p=l;return n(),a(p,{class:"content flex col j-cen a-cen"},{default:e((()=>[r(p,{class:"wrap"},{default:e((()=>[r(p,{class:"ul flex row j-cen a-cen"},{default:e((()=>[(n(!0),i(o,null,c(x.listTransform,((t,s)=>(n(),a(p,{key:t.value,class:d(["li flex j-cen a-cen",{active:m.current===s}]),style:u(t.styles)},{default:e((()=>[h(f(t.text),1)])),_:2},1032,["class","style"])))),128))])),_:1}),r(p,{class:"start-btn flex row j-cen a-cen",onClick:x.start},{default:e((()=>[h("开始")])),_:1},8,["onClick"])])),_:1})])),_:1})}],["__scopeId","data-v-09405a16"]]);export{v as default};
