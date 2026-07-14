'use client'
import { useState, useRef, useEffect } from 'react'
const WHATSAPP='966565604856';const DISPLAY='0565604856';const DEALAPP='https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4'
export default function OfficeTab(){
 const [msgs,setMsgs]=useState<any[]>([{role:'assistant',text:'👋 أهلاً بك! أنا المساعد العقاري الذكي، كيف أقدر أساعدك اليوم؟'}])
 const [input,setInput]=useState('');const [step,setStep]=useState(0);const [data,setData]=useState<any>({});const bottomRef=useRef<HTMLDivElement>(null)
 useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'})},[msgs])
 const push=(m:any)=>setMsgs(p=>[...p,m])
 const start=(t:'طلب'|'عرض')=>{push({role:'user',text:t==='طلب'?'🔍 أطلب عقار':'🏠 أعرض عقاري'});push({role:'assistant',text:t==='طلب'?'تمام، وش نوع العقار اللي تدور عليه؟ شقة - فيلا - أرض - دور':'ممتاز، وش نوع عقارك؟'});setData({type:t});setStep(1)}
 const send=()=>{if(!input.trim())return;const txt=input.trim();push({role:'user',text:txt});setInput('');if(step===0){push({role:'assistant',text:'اختار من الأزرار فوق أو اكتب طلبك'});}else if(step===1){setData({...data,النوع:txt});push({role:'assistant',text:'وين الموقع المطلوب؟'});setStep(2)}else if(step===2){setData({...data,الموقع:txt});push({role:'assistant',text:'الميزانية أو تفاصيل إضافية؟'});setStep(3)}else{setData({...data,التفاصيل:txt});push({role:'assistant',text:`✅ تم، جاهز للإرسال لواتساب ${DISPLAY}`});setStep(4)}}
 const waUrl=()=>{const t=encodeURIComponent(`السلام عليكم جايك من متجر حكيم - عروضكم\n${Object.entries(data).map(([k,v])=>`${k}: ${v}`).join('\n')}\n\n${DEALAPP}`);return `https://wa.me/${WHATSAPP}?text=${t}`}
 return(<div className="space-y-4">
  <div className="rounded-[32px] bg-black text-white p-5">
   <div className="flex justify-between items-start gap-3">
    <div className="text-right"><h2 className="font-black text-[17px] leading-6">مؤسسة محسن لخدمات الأعمال</h2><p className="text-[12px] text-white/60 mt-1">محسن الحكمي • وسيط معتمد ✅ مرخص فال</p></div>
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E7C27A] to-[#8B6F2E] grid place-items-center text-xl font-black text-white">م</div>
   </div>
   <div className="grid grid-cols-3 gap-2 mt-5">
    <a href={`tel:${DISPLAY}`} className="h-11 rounded-full bg-white/10 border border-white/10 grid place-items-center text-sm">اتصال</a>
    <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="h-11 rounded-full bg-[#25D366] grid place-items-center text-[13px] font-black leading-3">واتساب<br/>{DISPLAY}</a>
    <a href={DEALAPP} target="_blank" className="h-11 rounded-full bg-white text-black grid place-items-center text-[13px] font-black">DealApp<br/><span className="text-[11px] font-normal">ملفي</span></a>
   </div>
  <div className="bg-white rounded-[24px] border shadow-sm overflow-hidden">
   <div className="m-3 rounded-2xl bg-gradient-to-l from-[#D4B26A] to-[#7A5A16] p-3 flex justify-between items-center text-white">
    <span className="font-bold text-sm">🤖 المساعد العقاري الذكي</span><span className="text-[11px] bg-black/20 px-3 py-1 rounded-full">متصل</span>
   </div>
   <div className="px-3 flex gap-2 justify-end"><button onClick={()=>start('طلب')} className="h-10 px-5 rounded-full bg-black text-white text-sm font-bold">🔍 أطلب عقار</button><button onClick={()=>start('عرض')} className="h-10 px-5 rounded-full bg-[#FFF3CC] border text-sm">🏠 أعرض عقاري</button></div>
   <div className="m-3 h-[320px] overflow-y-auto bg-[#FFFCF7] rounded-2xl p-3 space-y-2">
    {msgs.map((m,i)=><div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${m.role==='user'?'bg-black text-white':'bg-white border'}`}>{m.text}</div></div>)}
    {step>=3&&<a href={waUrl()} target="_blank" className="h-11 w-full rounded-full bg-[#25D366] text-white grid place-items-center font-black text-sm">إرسال واتساب ✅</a>}
    <div ref={bottomRef}/>
   </div>
   <div className="p-3 border-t flex gap-2"><button onClick={send} className="w-11 h-11 rounded-full bg-black text-white grid place-items-center">↑</button><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="اكتب هنا..." className="flex-1 h-11 rounded-full bg-[#F5F1E8] border px-4 text-sm text-right outline-none"/></div>
  </div>
 </div>)
}
