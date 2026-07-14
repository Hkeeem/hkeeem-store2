// @ts-nocheck
export class GoogleGenerativeAI{constructor(_k?:string){}getGenerativeModel(){return{generateContent:async()=>({response:{text:()=>""}})}as any}}
export async function extractOffer(){return null}
export async function extractOfferFromText(){return null}
export async function extractOfferFromImage(){return null}
export const genAI=new GoogleGenerativeAI()
export default GoogleGenerativeAI
