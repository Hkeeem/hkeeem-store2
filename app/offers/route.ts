// app/api/offers/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") || "الكل"
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json([])
  const supabase = createClient(url, key)
  let q = supabase.from("offers").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(40)
  if (city !== "الكل") q = q.eq("city", city)
  const { data } = await q
  return NextResponse.json(data || [])
}
