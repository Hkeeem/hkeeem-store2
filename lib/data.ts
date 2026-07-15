export type Offer = {
  id: string;
  store: string;
  product: string;
  price: number;
  old: number;
  saving: number;
  coupon: string;
  rating: number;
  uses: number;
  dist: number;
  time: string;
  img: string;
  cat: string;
  isDrop: boolean;
};

export const offers: Offer[] = [
  {
    id: "1",
    store: "أمازون",
    product: "iPhone 15 Pro 256GB تيتانيوم أزرق",
    price: 4199,
    old: 4619,
    saving: 420,
    coupon: "HKEEM50",
    rating: 4.8,
    uses: 1243,
    dist: 0.8,
    time: "قبل ساعتين",
    img: "https://images.unsplash.com/photo-1592899677977-9bb10ba128a0?w=700&q=80",
    cat: "electronics",
    isDrop: true,
  },
  {
    id: "2",
    store: "إكسترا",
    product: "غسالة LG 7 كيلو أوتوماتيك",
    price: 1449,
    old: 1799,
    saving: 350,
    coupon: "EXTRA30",
    rating: 4.6,
    uses: 890,
    dist: 1.2,
    time: "قبل 45 دقيقة",
    img: "https://images.unsplash.com/photo-1585237672818-80a90c05d9a6?w=700&q=80",
    cat: "home",
    isDrop: true,
  }
];

