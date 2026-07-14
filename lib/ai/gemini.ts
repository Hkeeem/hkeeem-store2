// @ts-nocheck
// Fix build - تم تعطيل Gemini مؤقتاً عشان يشتغل المتجر ومكتبك العقاري
export class GoogleGenerativeAI {
  constructor(_key?: string) {}
  getGenerativeModel(_opts?: any) {
    return {
      generateContent: async (_p: any) => ({
        response: { text: () => "" }
      })
    }
  }
}

export async function extractOffer(_text?: any) { return null }
export async function extractOfferFromText(_text: string) { return null }
export async function extractOfferFromImage(_file: any) { return null }
export const genAI = new GoogleGenerativeAI()

export default GoogleGenerativeAI
