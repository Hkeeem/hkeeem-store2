import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { extractOfferWithAI } from "@/lib/ai/extractOffer";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, store, city } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { ok: false, error: "imageBase64 is required" },
        { status: 400 }
      );
    }

    const visionKey =
      process.env.GOOGLE_CLOUD_VISION_API_KEY ||
      process.env.GEMINI_API_KEY;

    if (!visionKey) {
      return NextResponse.json(
        { ok: false, error: "Vision API key not configured" },
        { status: 500 }
      );
    }

    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${visionKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: imageBase64,
              },
              features: [
                {
                  type: "TEXT_DETECTION",
                },
              ],
            },
          ],
        }),
      }
    );

    if (!visionResponse.ok) {
      throw new Error("Vision API request failed");
    }

    const visionData = await visionResponse.json();

    const text =
      visionData?.responses?.[0]?.fullTextAnnotation?.text?.trim() || "";

    if (!text) {
      return NextResponse.json(
        { ok: false, error: "No text detected" },
        { status: 422 }
      );
    }

    const extracted = await extractOfferWithAI(
      text,
      store || "متجر",
      city || "الكل"
    );

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRole) {
      throw new Error("Supabase environment variables are missing");
    }

    const supabase = createClient(supabaseUrl, serviceRole);

    const dbPayload = {
      title: extracted.title ?? "",
      description: extracted.description ?? "",
      store_name: extracted.store_name ?? store ?? "",
      city: extracted.city ?? city ?? "",
      discount_percent:
        extracted.discount_percent ??
        extracted.discount ??
        0,
      expiry_date:
        extracted.expiry_date ??
        extracted.endAt ??
        null,
      source_url: `ocr-${Date.now()}`,
      is_active: true,
    };

    const { data, error } = await supabase
      .from("offers")
      .insert(dbPayload)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      ok: true,
      offer: {
        ...data,
        discount: data.discount_percent,
        endAt: data.expiry_date,
      },
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}
