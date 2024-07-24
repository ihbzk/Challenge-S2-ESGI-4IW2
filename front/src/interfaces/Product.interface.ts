export interface BrandInterface {
  id: number;
  name: string;
}

export interface CategoryInterface {
  id: number;
  name: string;
}

export interface ProductInterface {
  id: number;
  productName: string;
  image: string;
  price: number;
  description: string;
  category: CategoryInterface;
  brand: BrandInterface;
}