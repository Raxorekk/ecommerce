export type Category = {
  name: string;
  slug: string;
  emoji: string;
  specifications: {
    name: string;
    type: string;
    values: string[];
  }[];
};

export type SpecificationValues = {
  name: string;
  value: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: Category;
  reviews: Object[];
  slug: string;
  specification_values: SpecificationValues[];
  product_img: string;
};
