// @ts-nocheck
export const genAI = null as any
export class GoogleGenerativeAI{
 constructor(){}
 getGenerativeModel(){
  return{
   generateContent:async()=>{
    return{
     response:{
      text:()=>""
     }
    }
   }
  }
 }
}
export async function extractOffer(){
 return null
}
export async function extractOfferFromText(){
 return null
}
export async function extractOfferFromImage(){
 return null
}
