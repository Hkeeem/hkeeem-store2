// lib/ai/extractOffer.ts
export async function extractOfferWithAI(rawText: string, defaultStore: string, defaultCity: string) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    // fallback بدون AI لو ما عندك مفتاح
    const m = rawText.match(/(\d{1,2})\s*%/)
    return {
      store: defaultStore,
      title: rawText.slice(0, 60).trim(),
      discount_percent: m? parseInt(m[1]) : null,
      price: null, old_price: null,
      city: defaultCity,
      expiry_date: null,
      category: "عروض"
    }
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `
استخرج JSON فقط بهذا الشكل من النص:
{"store":"اسم المتجر","title":"عنوان مختصر","discount_percent":رقم,"price":رقم,"old_price":رقم,"city":"الرياض|جدة|مكة|المدينة|الدمام|أبها|الكل","expiry_date":"YYYY-MM-DD أو null","category":"إلكترونيات|أزياء|سيارات|عقار|سوبرماركت"}
النص: """${rawText.slice(0, 4000)}"""
افتراضي store=${defaultStore} city=${defaultCity}
أعد JSON فقط.` }]
        }],
        generationConfig: { responseMimeType: "application/json" }
      })
    })
    const data = await res.json()
    const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text
    return txt? JSON.parse(txt) : null
  } catch (e) {
    console.error(e)
    return null
  }
}
