'use client'
import { useState,useRef,useEffect } from 'react'
const WHATSAPP='966565604856';const DISPLAY='0565604856';const DEALAPP='https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4';const EMAIL='alhkmy11@gmail.com';
export default function OfficeTab(){
 const [msgs,setMsgs]=useState<any[]>([{role:'assistant',text:'👋 أهلاً! أنا مساعدك العقاري'}]);const [input,setInput]=useState('');const [step,setStep]=useState(0);const [data,setData]=useState<any>({});const b=useRef<HTMLDivElement>(null)
 useEffect(()=>{b.current?.scrollIntoView({behavior:'smooth'})},[msgs])
 const push=(m:any)=>setMsgs(p=>[...p,m])
 const start=(t:any)=>{push({role:'user',text:t});push({role:'assistant',text:t==='طلب'?'وش نوع العقار؟ شقة - فيلا - أرض':'وش نوع عقارك للعرض؟'});setData({type:t});setStep(1)}
 const send=()=>{if(!input.trim())return;const t=input.trim();push({role:'user',text:t});setInput('');if(step===1){setData({...data,النوع:t});push({role:'assistant',text:'وين الموقع؟'});setStep(2)}else if(step===2){setData({...data,الموقع:t});push({role:'assistant',text:'الميزانية؟'});setStep(3)}else{setData({...data,التفاصيل:t});push({role:'assistant',text:'✅ جاهز للواتساب'});setStep(4)}}
 const wa=()=>{const q=encodeURIComponent(`من متجر حكيم\n${Object.entries(data).map(([k,v])=>k+':'+v).join('\n')}\n${DEALAPP}`);return `https://wa.me/${WHATSAPP}?text=${q}`}
 return(<div className="space-y-3">
  <div className="rounded-[28px] bg-black text-white p-5">
   <div className="flex justify-between items-start"><div className="text-right"><h2 className="font-black">مؤسسة محسن لخدمات الأعمال</h2><p className="text-xs text-white/60 mt-1">محسن الحكمي • وسيط معتمد ✅ مرخص فال</p></div><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E7C27A] to-[#8B6F2E] grid place-items-center font-black">م</div></div>
   <div className="grid grid-cols-3 gap-2 mt-4">
    <a href={`mailto:${EMAIL}`} className="h-11 rounded-full bg-white/10 border border-white/10 grid place-items-center text-sm">ايميل</a>
    <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="h-11 rounded-full bg-[#25D366] grid place-items-center text-xs font-black">واتساب<br/>{DISPLAY}</a>
    <a href={DEALAPP} target="_blank" className="h-11 rounded-full bg-white text-black grid place-items-center text-xs font-black">DealApp ملفي</a>
   </div>
  <div className="bg-white rounded-[24px] border overflow-hidden">
   <div className="m-3 rounded-2xl bg-gradient-to-l from-[#D4B26A] to-[#7A5A16] p-3 flex justify-between text-white"><span className="font-bold text-sm">🤖 المساعد العقاري</span><span className="text-xs bg-black/20 px-3 py-1 rounded-full">متصل</span></div>
   <div className="px-3 flex gap-2"><button onClick={()=>start('طلب')} className="h-9 px-4 rounded-full bg-black text-white text-xs font-bold">🔍 أطلب عقار</button><button onClick={()=>start('عرض')} className="h-9 px-4 rounded-full bg-[#FFF3CC] text-xs">🏠 أعرض</button></div>
   <div className="m-3 h-[260px] overflow-auto bg-[#FFFCF7] rounded-xl p-2 space-y-2">{msgs.map((m,i)=><div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.role==='user'?'bg-black text-white':'bg-white border'}`}>{m.text}</div></div>)}{step>=3&&<a href={wa()} target="_blank" className="block h-10 rounded-full bg-[#25D366] text-white grid place-items-center font-bold text-sm">إرسال واتساب ✅</a>}<div ref={b}/></div>
   <div className="p-2 border-t flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="اكتب هنا..." className="flex-1 h-10 rounded-full bg-[#F5F1E8] border px-3 text-sm text-right"/><button onClick={send} className="w-10 h-10 rounded-full bg-black text-white">↑</button></div>
  </div>
 </div>)
  }
