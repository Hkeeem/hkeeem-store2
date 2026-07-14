export type ExtractedOffer = {
  title: string
  price?: number
  old_price?: number
  store?: string
  category?: string
}

function fallback(input: string): ExtractedOffer {
  return { title: input.slice(0, 80).trim() || "عرض جديد" }
}

// إصدار محسن: gemini-2.5-flash + إجبار JSON
export async function extractOffer(input: string): Promise<ExtractedOffer> {
  if (!input || !input.trim()) return { title: "عرض جديد" }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) return fallback(input)

  const prompt = `
أنت محلل عروض متجر سعودي. استخرج البيانات من النص التالي وأرجع JSON فقط بدون أي شرح.
النص: "${input}"

المطلوب JSON بهذا الشكل فقط:
{
  "title": "اسم المنتج مختصر",
  "price":  رقم السعر الحالي أو null,
  "old_price": رقم السعر القديم أو null,
  "store": "اسم المتجر أو null",
  "category": "جوالات أو أجهزة ذكية أو أزياء أو سوبرماركت أو null"
}
لا تكتب markdown ولا \`\`\`json ولا أي نص خارج JSON.
`.trim()

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        }),
      }
    )

    if (!res.ok) return fallback(input)

    const data = (await res.json()) as any
    let text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) return fallback(input)

    // تنظيف في حال رجع ```json ... ```
    text = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "")

    const parsed = JSON.parse(text)

    return {
      title: typeof parsed.title === "string" && parsed.title.trim() ? parsed.title.trim().slice(0, 100) : input.slice(0, 80),
      price: typeof parsed.price === "number" && !isNaN(parsed.price) ? parsed.price : undefined,
      old_price: typeof parsed.old_price === "number" && !isNaN(parsed.old_price) ? parsed.old_price : undefined,
      store: typeof parsed.store === "string" ? parsed.store : undefined,
      category: typeof parsed.category === "string" ? parsed.category : undefined,
    }
  } catch {
    return fallback(input)
  }
}

export default extractOffer
