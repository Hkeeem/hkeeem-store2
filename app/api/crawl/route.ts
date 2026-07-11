// app/api/crawl/route.ts
import { NextResponse } from "next/server"
import * as cheerio from "cheerio"
import { createClient } from "@supabase/supabase-js"
import { extractOfferWithAI } from "@/lib/ai/extractOffer"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

const TARGETS = [
  { store: "نون", city: "الرياض", url: "https://www.noon.com/saudi-ar/perfumes/" },
  { store: "جرير", city: "الكل", url: "https://www.jarir.com/sa-ar/promotions" },
  { store: "حراج", city: "الرياض", url: "https://haraj.com.sa/" },
]

export async function GET() {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Missing Supabase env" }, { status: 500 })
  }

  let saved = 0
  for (const t of TARGETS) {
    try {
      const html = await fetch(t.url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        cache: "no-store",
      }).then((r) => r.text())

      const $ = cheerio.load(html)
      const text = $("body").text().replace(/\s+/g, " ").slice(0, 8000)
      if (!text) continue

      const extracted = await extractOfferWithAI(text, t.store, t.city)
      if (!extracted?.title) continue

      const { error } = await supabase.from("offers").upsert(
        {
          store: extracted.store || t.store,
          title: extracted.title,
          price: extracted.price || null,
          old_price: extracted.old_price || null,
          discount: extracted.discount_percent || null,
          city: extracted.city || t.city,
          category: extracted.category || "عروض",
          expiry_date: extracted.expiry_date || null,
          source_url: t.url + "#" + Date.now() + Math.random(),
          is_active: true,
        },
        { onConflict: "source_url" }
      )

      if (!error) saved++
    } catch (e) {
      console.log("crawl skip", t.url, e)
    }
  }

  return NextResponse.json({ ok: true, saved })
}
