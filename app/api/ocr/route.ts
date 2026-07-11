import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { extractOfferWithAI } from "@/lib/ai/extractOffer"

export async function POST(req: NextRequest){
 const {imageBase64, store, city} = await req.json()
 const r=await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.GEMINI_API_KEY}`,{
  method:"POST", headers:{"Content-Type":"application/json"},
  body:JSON.stringify({requests:[{image:{content:imageBase64},features:[{type:"TEXT_DETECTION"}]}]})
 }).then(r=>r.json())
 const text=r?.responses?.[0]?.fullTextAnnotation?.text||""
 const ex=await extractOfferWithAI(text, store||"متجر", city||"الكل")
 const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!)
 const {data}=await supabase.from("offers").insert({...ex,source_url:"ocr#"+Date.now(),is_active:true}).select().single()
 return NextResponse.json({ok:true,offer:data})
}
