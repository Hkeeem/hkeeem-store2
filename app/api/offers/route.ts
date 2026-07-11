import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
export async function GET(req: NextRequest){
 const city=req.nextUrl.searchParams.get("city")||"الكل"
 const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
 let q=supabase.from("offers").select("*").eq("is_active",true).order("created_at",{ascending:false}).limit(40)
 if(city!=="الكل") q=q.eq("city",city)
 const {data}=await q
 return NextResponse.json(data||[])
}
