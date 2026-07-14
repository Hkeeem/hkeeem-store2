export type ExtractedOffer = { title: string; price?: number; old_price?: number; store?: string; category?: string }
function fallback(input: string): ExtractedOffer { return { title: (input||"").slice(0,80).trim()||"عرض جديد" } }
export async function extractOffer(input: string): Promise<ExtractedOffer> {
  if (!input?.trim()) return { title: "عرض جديد" }
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) return fallback(input)
  const prompt = `استخرج JSON فقط من النص: "${input.slice(0,500)}" بالشكل {"title":"اسم","price":رقم,"old_price":رقم,"store":"متجر","category":"تصنيف"}`
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:prompt}]}],generationConfig:{temperature:0.1,responseMimeType:"application/json"}})})
    if(!res.ok) return fallback(input)
    const data = await res.json() as any
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if(!text) return fallback(input)
    text = text.trim().replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/\s*```$/i,"")
    const p = JSON.parse(text)
    return { title: p.title?.trim()?.slice(0,100) || input.slice(0,80), price: typeof p.price==="number"?p.price:undefined, old_price: typeof p.old_price==="number"?p.old_price:undefined, store: p.store, category: p.category }
  } catch { return fallback(input) }
}
export const extractOfferFromText = extractOffer
export const extractOfferFromImage = extractOffer
export const extractOfferWithAI = extractOffer
export default extractOffer
