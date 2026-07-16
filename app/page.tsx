'use client';

import { useState } from 'react';
import { Search, MapPin, Bell, Heart, User, TrendingUp, Zap } from 'lucide-react';

export default function HkeeemHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location] = useState('الرياض، حي الملقا');

  const offers = [
    {
      id: 1,
      title: "سامسونج Galaxy S25 Ultra",
      store: "جرير",
      discount: "28%",
      price: "4299",
      oldPrice: "5999",
      image: "📱"
    },
    {
      id: 2,
      title: "ثلاجة LG 600 لتر",
      store: "إكسترا",
      discount: "35%",
      price: "2899",
      oldPrice: "4499",
      image: "❄️"
    },
    {
      id: 3,
      title: "دجاج طازج 2 كجم",
      store: "بنده",
      discount: "22%",
      price: "29",
      oldPrice: "37",
      image: "🍗"
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-900/95 border-b backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">ح</div>
            <div>
              <div className="text-3xl font-bold tracking-tighter">متجر حكيم</div>
              <p className="text-[10px] text-emerald-600 -mt-1 font-medium">AI • عروض • توفير</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#offers" className="hover:text-emerald-600 transition">العروض</a>
            <a href="#" className="hover:text-emerald-600 transition">المتاجر</a>
            <a href="#" className="hover:text-emerald-600 transition">السلة الذكية</a>
            <a href="#" className="hover:text-emerald-600 transition">مساعد حكيم</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm bg-white dark:bg-zinc-800 px-4 py-2 rounded-2xl border">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{location}</span>
            </div>
            <Bell className="w-5 h-5 cursor-pointer hover:text-emerald-600" />
            <Heart className="w-5 h-5 cursor-pointer hover:text-emerald-600" />
            <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center cursor-pointer">
              👤
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-600 text-white pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-5 py-2 rounded-full mb-6 text-sm">
            🤖 أ
