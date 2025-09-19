export interface Product {
  _id?: string;
  name: string;
  price: number;
  oldprice?: number;
  desc: string;
  stock: number;
  images: string[];
  category: string;
  brand: string;
  size: string[];
  colors: string[];
}
