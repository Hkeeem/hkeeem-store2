"use client"
import { useState, useEffect } from "react"

const STORES = ["الكل","نون","أمازون","جرير","إكسترا","كارفور"]
const CITIES = ["الكل","الرياض","جدة","مكة","المدينة","الدمام","أبها","تبوك","القصيم"]

const CITY_COORDS: Record<string,{lat:number,lng:number}> = {
  "الرياض":{lat:24.7136,lng:46.6753}, "جدة":{lat:21.5433,lng:39.1728},
  "مكة":{lat:21.3891,lng:39.8579}, "المدينة":{lat:24.4672,lng:39.6111},
  "الدمام":{lat:26.4207,lng:50.0888}, "أبها":{lat:18.2164,lng:42.5053},
  "تبوك":{lat:28.3835,lng:36.5662}, "القصيم":{lat:26.3260,lng:43.9750},
}

const ECOM_OFFERS = [
  { id:1, store:"نون", city:"الرياض", title:"عطور فاخرة خصم حتى 75%", price:149, old:599, disc:75, coupon:"ALHKMY75", ship:"توصيل نون السريع", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:2, store:"نون", city:"جدة", title:"عطور فاخرة - عرض جدة", price:149, old:599, disc:75, coupon:"JED75", ship:"توصيل جدة", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:3, store:"أمازون", city:"الكل", title:"سماعة Anker عزل كامل", price:199, old:399, disc:50, coupon:"AMZ50", ship:"توصيل لكل المدن", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600" },
  { id:4, store:"جرير", city:"الرياض", title:"آيباد برو M2 ضمان جرير", price:2199, old:3999, disc:45, coupon:"JARIR100", ship:"توصيل جرير", img:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600" },
]

const HARAJ_ALL = [
 
