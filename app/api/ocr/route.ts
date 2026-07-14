import { NextRequest, NextResponse } from "next/server"
import { extractOffer } from "@/lib/ai/extractOffer"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(()=>({}))
    const text = (body?.text as string) || ""
    const result = await extractOffer(text || "")
    return NextResponse.json(result)
  } catch { return NextResponse.json({ title: "عرض جديد" }) }
}
