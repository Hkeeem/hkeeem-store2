export interface LatLng {
  lat: number;
  lng: number;
}

export interface Offer {
  id: number;
  title: string;
  description?: string;
  store: string;
  category: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  city: string;
  location: LatLng;
  rating?: number;
  views?: number;
  createdAt: string;
  endAt: string;
  featured?: boolean;
}
