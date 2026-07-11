
export async function GET() {
  const manifest = {
    id: "/",
    name: "متجر حكيم - وسيط عقاري مرخص فال - محسن الحكمي",
    short_name: "متجر حكيم",
    description: "متجر حكيم يقدم عروض ذكية حتى 55% مع شحن مجاني وخدمات وساطة عقارية مرخصة فال - محسن الحكمي 0565604856 رابط ديل الرسمي",
    start_url: "/?utm_source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#7c3aed",
    background_color: "#0f0720",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png", sizes: "72x72", type: "image/png", purpose: "any maskable" },
      { src: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png", sizes: "96x96", type: "image/png", purpose: "any maskable" },
      { src: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png", sizes: "128x128", type: "image/png", purpose: "any maskable" },
      { src: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png", sizes: "144x144", type: "image/png", purpose: "any maskable" },
      { src: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png", sizes: "152x152", type: "image/png", purpose: "any maskable" },
      { src: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png", sizes: "384x384", type: "image/png", purpose: "any maskable" },
      { src: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
    ]
  }
  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json", "Cache-Control": "public, max-age=0, must-revalidate" }
  })
}
