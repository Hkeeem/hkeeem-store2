// lib/ai/extractOffer.ts

export async function extractOfferWithAI(
  rawText: string,
  defaultStore: string,
  defaultCity: string
) {
  const fallback = () => {
    const discount = rawText.match(/(\d{1,2})\s*%/)
    const prices = rawText.match(/\d+(?:\.\d+)?/g)

    return {
      store_name: defaultStore,
      title: rawText.slice(0, 60).trim() || "عرض جديد",
      description: rawText.slice(0, 300),
      discount_percent: discount ? Number(discount[1]) : 0,
      price: prices?.[0] ? Number(prices[0]) : null,
      old_price: prices?.[1] ? Number(prices[1]) : null,
      city: defaultCity,
      expiry_date: null,
      category: "عروض",
    }
  }

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return fallback()
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
استخرج البيانات التالية من النص وأعد JSON فقط بدون أي شرح.

{
  "store_name":"",
  "title":"",
  "description":"",
  "discount_percent":0,
  "price":0,
  "old_price":0,
  "city":"",
  "expiry_date":null,
  "category":""
}

إذا لم تجد قيمة ضع null.
إذا لم تجد اسم المتجر استخدم ${defaultStore}
إذا لم تجد المدينة استخدم ${defaultCity}

النص:
${rawText.slice(0, 4000)}
                  `,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    )

    if (!response.ok) {
      return fallback()
    }

    const data = await response.json()

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return fallback()
