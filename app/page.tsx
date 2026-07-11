"use client"
import { useState, useEffect } from "react"

const STORES = ["الكل","نون","أمازون","جرير","إكسترا","كارفور","العثيم","بنده"]
const CITIES = ["الكل","الرياض","جدة","مكة","المدينة","الدمام","أبها","تبوك","القصيم","حائل","جازان","نجران","الباحة","الجوف","عرعر"]

const ECOM_OFFERS = [
  { id:1, store:"نون", title:"عطور فاخرة خصم حتى 75% + كوبون إضافي", price:149, old:599, disc:75, coupon:"ALHKMY75", ship:"توصيل نون السريع", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:2, store:"أمازون", title:"سماعة Anker عزل كامل صفقة اليوم", price:199, old:399, disc:50, coupon:"AMZ50", ship:"توصيل أمازون", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600" },
  { id:3, store:"جرير", title:"آيباد برو M2 ضمان سنتين", price:2199, old:3999, disc:45, coupon:"JARIR100", ship:"توصيل جرير", img:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600" },
  { id:4, store:"إكسترا", title:"ثلاجة LG تقسيط بدون فوائد", price:2899, old:4299, disc:32, coupon:"EXTRA20", ship:"تركيب منزلي", img:"https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600" },
  { id:5, store:"كارفور", title:"سلة مقاضي الشهر توفير كبير", price:89, old:149, disc:40, coupon:"CAR40", ship:"توصيل كارفور", img:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" },
  { id:6, store:"العثيم", title:"أرز أبو كاس 10 كجم - العرض الأسبوعي", price:45, old:69, disc:34, coupon:"OTHIM15", ship:"توصيل العثيم", img:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600" },
]

const HARAJ_STRONG = [
  { t:"سييرا 2026 حرق 169 ألف - نضمن أرخص سعر", pr:"169,000 ر.س", city:"الرياض", tag:"حرق نار", img:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600" },
  { t:"اكسنت 2026 سمارت كاش وتقسيط", pr:"59,900 ر.س", city:"الرياض", tag:"يا بلاش" },
  { t:"النترا 2026 فل كامل 2.0", pr:"78,500 ر.س", city:"جدة", tag:"فل كامل" },
  { t:"كامري 2025 ستاندر مطور", pr:"89,900 ر.س", city:"الدمام", tag:"عرض قوي" },
  { t:"فيلا 400م - حي طيبة الرحيلي بمسب
