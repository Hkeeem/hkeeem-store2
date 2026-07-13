export interface LatLng {
  lat: number;
  lng: number;
}

export interface Offer {
  id: string | number;
  title: string;
  description?: any;
  store?: any;
  category?: any;
  price?: any;
  oldPrice?: any;
  discount?: any;
  image?: any;
  city?: any;
  location?: any;
  rating?: any;
  views?: any;
  createdAt?: any;
  endAt?: any;
  featured?: any;
  [key: string]: any;
}
