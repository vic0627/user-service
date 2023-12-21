export interface ProductInfo {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface ProductModel {
  title: string;
  price: number;
  description: string;
  image: File;
  category: string;
}
