import Image from 'next/image'
import Link from 'next/link'
import SmartShopperButton from './SmartShopperButton' // تأكد من وجود الملف في نفس المجلد

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D4AF37]/20 bg-[#0A0A0A]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          {/* تم تعديل الحجم إلى 48px ليقع ضمن النطاق المطلوب 44-52px */}
          <div className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-[#D4AF37]/40">
            <Image
              src="/logo-circle.png"
              alt="hkeeem"
              width={48}
              height={48}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[20px] font-bold tracking-widest text-[#D4AF37]">
              hkeeem
            </span>
            <span className="text-[10px] tracking-[0.2em] text-white/60">
              متجر حكيم
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* تم دمج زر التحليل الذكي الجديد */}
          <SmartShopperButton />
          
          <Link
            href="/cart"
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-[#D4AF37] hover:text-black border border-transparent hover:border-[#D4AF37]"
          >
            السلة
          </Link>
        </div>
      </div>
    </header>
  )
}
