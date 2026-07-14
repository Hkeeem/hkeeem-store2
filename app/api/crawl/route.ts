import { NextRequest, NextResponse } from "next/server"
import { extractOffer } from "@/lib/ai/extractOffer"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.CRAWL_TARGET_URL || ""
    if (!url) return NextResponse.json({ ok: true, message: "No URL configured" })
    // مثال بسيط يرجع عرض تجريبي بدل الزحف الكامل لتجاوز الـ Build
    const sample = "عرض جوال ايفون من جرير بسعر 4199 بدل 4619"
    const offer = await extractOffer(sample)
    return NextResponse.json({ ok: true, offer })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "crawl error" }, { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(()=>({}))
  const text = body?.text || ""
  const offer = await extractOffer(text)
  return NextResponse.json(offer)
}
