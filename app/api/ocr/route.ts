import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { extractOfferWithAI } from "@/lib/ai/extractOffer"

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, store, city } = await req.json()
    if (!imageBase64) {
      return NextResponse.json({ ok: false, error: "imageBase64 missing" }, { status: 400 })
    }

    // 1. استخدم مفتاح Vision الصحيح
    const visionKey = process.env.GOOGLE_CLOUD_VISION_API_KEY || process.env.GEMINI_API_KEY
    const visionRes = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${visionKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [{ image: { content: imageBase64 }, features: [{ type: "TEXT_DETECTION" }] }],
        }),
      }
    ).then((r) => r.json())

    const text = visionRes?.responses?.[0]?.fullTextAnnotation?.text || ""
    if (!text) {
      return NextResponse.json({ ok: false, error: "No text detected" }, { status: 422 })
    }

    // 2. استخراج العرض
    const ex: any = await extractOfferWithAI(text, store || "متجر", city || "الكل")

    // 3. توحيد الأسماء - حول أي اسم يجي من الذكاء الاصطناعي إلى أسماء Supabase
    const dbPayload = {
      title: ex.title,
      description: ex.description,
      store_name: ex.store_name || store,
      city: ex.city || city,
      discount_percent: ex.discount_percent?? ex.discount?? 0,
      expiry_date: ex.expiry_date?? ex.endAt?? null,
      source_url: "ocr#" + Date.now(),
      is_active: true,
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase.from("offers").insert(dbPayload).select().single()
    if (error) throw error

    // 4. رجع للواجهة بالأسماء اللي يتوقعها page.tsx
    const forFrontend = {
     ...data,
      discount: data.discount_percent,
      endAt: data.expiry_date,
    }

    return NextResponse.json({ ok: true, offer: forFrontend })
  } catch (e: any) {
    console.error("OCR Route Error:", e)
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
