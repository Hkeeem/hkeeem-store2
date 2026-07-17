import React from 'react';
import { Sparkles } from 'lucide-react'; // تأكد من تثبيت مكتبة lucide-react

const SmartShopperButton = () => {
  return (
    <a
      href="https://smart-shopper-spotter-hkeeem.lovable.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center justify-center gap-2 px-4 py-2 bg-black border border-amber-500 rounded-lg transition-all duration-300 hover:bg-amber-500 hover:text-black overflow-hidden"
    >
      <Sparkles className="w-4 h-4 text-amber-500 group-hover:text-black transition-colors" />
      <span className="text-amber-500 font-semibold text-sm tracking-wide group-hover:text-black transition-colors">
        Smart Shopper
      </span>
      
      {/* تأثير لمعة ذهبية خفيفة عند التمرير */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    </a>
  );
};

export default SmartShopperButton;
