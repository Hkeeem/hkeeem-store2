'use client'
import { useState, useRef, useEffect } from 'react'

const WHATSAPP = '966565604856'
const DISPLAY = '05xxxxxxxx'

export default function OfficeTab() {
  const [msgs, setMsgs] = useState<any[]>([
    { role: 'assistant', content: 'أهلا بك في مكتب حكيم، تبي عرض أو طلب؟' }
  ])
  const [input, setInput] = useState('')
  const [flow, setFlow] = useState<'عرض' | 'طلب' | null>(null)
  const [step, setStep] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  const push = (m: any) => setMsgs(p => [...p, m])

  const start = (t: 'عرض' | 'طلب') => {
    setFlow(t)
    setStep(1)
    push({ role: 'assistant', content: `تمام، اخترت ${t}، اكتب التفاصيل` })
  }

  const send = () => {
    if (!input.trim()) return
    const t = input.trim()
    push({ role: 'user', content: t })
    setInput('')
    // كمل منطق الطلب هنا
    push({ role: 'assistant', content: 'تم استلام رسالتك، راح نتواصل معك' })
  }

  const wa = () => {
    const all = msgs.map(m => m.content).join('\n')
    const t = encodeURIComponent(`حكيم للخدمات\n${all}\n${input}`)
    window.open(`https://wa.me/${WHATSAPP}?text=${t}`, '_blank')
  }

  return (
    <div className="space-y-4 pb-24 p-3">
      <div className="space-y-2">
        {msgs.map((m, i) => (
          <div key={i} className={m.role === 'user'? 'text-right' : ''}>
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <button onClick={() => start('عرض')} className="btn">عرض</button>
        <button onClick={() => start('طلب')} className="btn">طلب</button>
        <button onClick={wa} className="btn">واتساب {DISPLAY}</button>
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="اكتب هنا..."
          className="flex-1 border rounded p-2"
        />
        <button onClick={send} className="bg-green-600 text-white px-4 rounded">
          إرسال
        </button>
      </div>
    </div>
  )
}
