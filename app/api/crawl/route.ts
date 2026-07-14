import { NextRequest, NextResponse } from "next/server"
import { extractOffer } from "@/lib/ai/extractOffer"
export async function POST(req: NextRequest){ const b=await req.json().catch(()=>({})); const o=await extractOffer(b?.text||""); return NextResponse.json(o) }
export async function GET(){ return NextResponse.json({ ok: true }) }
