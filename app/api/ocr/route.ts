import { NextRequest, NextResponse } from "next/server"
import { extractOffer } from "@/lib/ai/extractOffer"
export async function POST(req: NextRequest) {
  try { const b=await req.json().catch(()=>({})); const t=(b?.text as string)||""; const r=await extractOffer(t||""); return NextResponse.json(r) }
  catch { return NextResponse.json({ title: "عرض جديد" }) }
}
