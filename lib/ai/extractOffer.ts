export type ExtractedOffer = {
  title?: string
  price?: number
  old_price?: number
  store?: string
  category?: string
}

function fallback(text: string): ExtractedOffer {
  return { title: text?.slice(0, 80) || "عرض جديد" }
}

export async function extractOffer(input: string): Promise<ExtractedOffer> {
  try {
    const prompt = `استخرج بيانات العرض من النص: ${input}`
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    })

    const data = await res.json() as any
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return fallback(input)
    }

    // محاولة تحويل النص إلى JSON
    try {
      const parsed = JSON.parse(text)
      return {
        title: parsed.title || input.slice(0, 80),
        price: Number(parsed.price) || undefined,
        old_price: Number(parsed.old_price) || undefined,
        store: parsed.store,
        category: parsed.category,
      }
    } catch {
      return { title: text.slice(0, 80) }
    }
  } catch (e) {
    return fallback(input)
  }
}

export default extractOffer
