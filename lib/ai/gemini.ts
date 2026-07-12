import { GoogleGenerativeAI } from "@google/generative-ai"

export async function extractOfferFromImage(base64: string){
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `حلّل صورة عرض تجاري وأرجع JSON فقط بدون شرح:
  {"title":"","store":"","category":"سوبرماركت|إلكترونيات|أزياء|مطاعم|سفر","price":0,"old_price":0,"discount":0,"coupon":"","city":"جدة"}`

  const result = await model.generateContent([
    prompt,
    { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
  ])
  let text = result.response.text().replace(/```json|```/g,'').trim()
  return JSON.parse(text)
}
