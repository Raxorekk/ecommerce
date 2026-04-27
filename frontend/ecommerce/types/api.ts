export type Category = {
  name: string;
  slug: string;
  emoji: string;
  specifications: {
    name: string;
    type: string;
    slug: string;
    values: string[];
  }[];
};

export type SpecificationValues = {
  name: string;
  slug: string;
  value: string;
};

export type UserFullName = {
  first_name: string;
  last_name: string;
}

export type Review = {
  title: string;
  content: string;
  user: UserFullName
  created_at: string;
  rating: number;
  product: number;
}

export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: Category;
  reviews: Review[];
  slug: string;
  specification_values: SpecificationValues[];
  product_img: string;
};
