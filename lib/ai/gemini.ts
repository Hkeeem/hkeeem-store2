// @ts-nocheck

import { extractOfferWithAI } from "./extractOffer"

export const genAI = null as any

export class GoogleGenerativeAI {
  constructor() {}

  getGenerativeModel() {
    return {
      generateContent: async () => ({
        response: {
          text: () => "",
        },
      }),
    }
  }
}

export async function extractOffer(
  rawText: string,
  store = "متجر",
  city = "الكل"
) {
  return extractOfferWithAI(rawText, store, city)
}

export async function extractOfferFromText(
  rawText: string,
  store = "متجر",
  city = "الكل"
) {
  return extractOfferWithAI(rawText, store, city)
}

export async function extractOfferFromImage(
  rawText: string,
  store = "متجر",
  city = "الكل"
) {
  return extractOfferWithAI(rawText, store, city)
}
