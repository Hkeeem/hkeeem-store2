// app/api/crawl/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { extractOfferWithAI } from "@/lib/ai/extractOffer"

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ error: "env missing" }, { status: 500 })
  const supabase = createClient(url, key)

  const targets = [
    { store: "نون", city: "الرياض", url: "https://www.noon.com/saudi-ar/perfumes/" },
    { store: "جرير", city: "الكل", url: "https://www.jarir.com/sa-ar/promotions" },
  ]

  let saved = 0
  for (const t of targets) {
    try {
      const html = await fetch(t.url, { headers: { "User-Agent": "Mozilla/5.0" }, cache: "no-store" }).then(r=>r.text())
      const text = html.replace(/<[^>]+>/g," ").replace(/\s+/g," ").slice(0,6000)
      const ex = await extractOfferWithAI(text, t.store, t.city)
      if(!ex?.title) continue
      await supabase.from("offers").upsert({
        store: ex.store || t.store,
        title: ex.title,
        price: ex.price || null,
        old_price: ex.old_price || null,
        discount: ex.discount_percent || null,
        city: ex.city || t.city,
        category: ex.category || "عروض",
        source_url: t.url + "#" + Date.now() + Math.random(),
        is_active: true,
      }, { onConflict: "source_url" })
      saved++
    } catch {}
  }
  return NextResponse.json({ ok: true, saved })
}
