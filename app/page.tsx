"use client"
import { useEffect, useMemo, useState } from 'react'

type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; lat:number; lng:number; city:string; isOwn?:boolean; dist?:number }

const CATS_BOX = [
 {n:'متجر حكيم'}, {n:'سوبرماركت'},
 {n:'ازياء'}, {n:'مطاعم'},
 {n:'ملابس'}, {n:'عطور'},
 {n:'سفر'}, {n:'صحة وجمال'},
]

const BEST_SAUDI = [
 {name:'متجر حكيم', rating:4.9, offers:24, strength:95},
 {name:'بنده', rating:4.8, offers:128, strength:88},
 {name:'العثيم', rating:4.7, offers:96, strength:82},
 {name:'جرير', rating:4.9, offers:112, strength:90},
 {name:'نون', rating:4.6, offers:210, strength:85},
 {name:'نعناع', rating:4.7, offers:54, strength:70},
]

const BEST_ELEC = [
 {name:'جرير', rating:4.9, offers:112, strength:96},
 {name:'اكسترا', rating:4.8, offers:98, strength:92},
 {name:'نون الكترونيات', rating:4.6, offers:180, strength:88},
 {name:'امازون', rating:4.7, offers:150, strength:85},
 {name:'ردسي', rating:4.8, offers:60, strength:80},
 {name:'STC', rating:4.5, offers:40, strength:65},
]

const HERO = [
 {store:'متجر حكيم', d:40, t:'عطر حكيم الملكي مع محفظة جلد فاخر', p:399, old:649, img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900', g:'from-violet-700 via-fuchsia-600 to-indigo-700'},
 {store:'بنده', d:55, t:'سلة التوفير الكبرى', p:89, old:199, img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900', g:'from-violet-600 to-purple-700'},
 {store:'جرير', d:45, t:'ايباد برو M2', p:2199, old:3999, img:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900', g:'from-violet-700 to-indigo-700'},
]

const OFFERS: Offer[] = [
 {id:1,title:'عطر حكيم الملكي 100 مل',store:'متجر حكيم',category:'عطور',price:199,old_price:349,discount:43,image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',isOwn:true,lat:21.5433,lng:39.1728,city:'جدة'},
 {id:2,title:'محفظة جلد مع ساعة',store:'متجر حكيم',category:'ملابس',price:399,old_price:619,discount:35,image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600',isOwn:true,lat:21.545,lng:39.174,city:'جدة'},
 {id:3,title:'سلة التوفير بنده',store:'بنده',category:'سوبرماركت',price:89,old_price:149,discount:40,image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',lat:21.54,lng:39.16,city:'جدة'},
 {id:4,title:'ايباد برو',store:'جرير',category:'الكترونيات',price:2199,old_price:3999,discount:45,image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',lat:21.56,lng:39.19,city:'جدة'},
 {id:5,title:'وجبة عائلية دجاج مع رز',store:'هنقرستيشن',category:'مطاعم',price:69,old_price:120,discount:42,image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',lat:21.54,lng:39.17,city:'جدة'},
 {id:6,title:'تيشيرتات 3 قطع',store:'نمشي',category:'ملابس',price:129,old_price:249,discount:48,image:'https://images.unsplash.com
