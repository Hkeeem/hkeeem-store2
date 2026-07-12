export async function extractOfferFromImage(base64Image: string){
  const apiKey = process.env.GEMINI_API_KEY!
  const prompt = `استخرج من صورة العرض JSON فقط: {"title":"","store":"","category":"سوبرماركت|إلكترونيات|أزياء|مطاعم|سفر","price":0,"old_price":0,"discount":0,"coupon":"","city":"جدة"}`
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,{
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ contents:[{ parts:[{text:prompt},{inline_data:{mime_type:"image/jpeg", data: base64Image.split(',')[1]}}]}]})
  })
  const j = await res.json()
  let txt = j?.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
  txt = txt.replace(/```json|```/g,'').trim()
  return JSON.parse(txt)
}
