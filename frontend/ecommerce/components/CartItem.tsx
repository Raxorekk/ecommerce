"use client";
import ProductImage from "./ProductImage";
import { Trash2 } from "lucide-react";
import { Cart } from "@/types/api";
import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import { deleteCartItem, updateCartItemQuantity } from "@/app/actions/cart";

const CartItem = ({
  item,
  onUpdate,
  setTotalCartPrice,
  setCartItemQuantity,
}: {
  item: Cart["items"][number];
  onUpdate: () => void;
  setTotalCartPrice: Dispatch<SetStateAction<number>>;
  setCartItemQuantity: Dispatch<SetStateAction<number>>;
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [totalProductPrice, setTotalProductPrice] = useState(
    item.quantity * Number(item.product.price),
  );

  const debounced = useDebouncedCallback(async () => {
    const response = await updateCartItemQuantity(item.id, quantity);
    onUpdate();
  }, 1000);

  const handleDeleteCartItem = async (itemId: Cart["items"][number]["id"]) => {
    const response = await deleteCartItem(itemId);
  };

  return (
    <div key={item.id} className="flex flex-row p-4 card bg-card/40 gap-4">
      <div>
        <Link
          href={`/products/categories/${item.product.category.slug}/${item.product.slug}`}
          className="flex h-28 w-28"
        >
          <ProductImage
            productImg={item.product.product_img}
            productName={item.product.slug}
          />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <Link
          href={`/products/categories/${item.product.category.slug}`}
          className="self-start uppercase text-light-blue text-[10px] font-semibold tracking-wider"
        >
          {item.product.category.name.toUpperCase()}
        </Link>

        <Link
          href={`/products/categories/${item.product.category.slug}/${item.product.slug}`}
          className="group self-start"
        >
          <h4 className="font-semibold group-hover:text-light-blue transition-colors">
            {item.product.name}
          </h4>
        </Link>
        <p className="mt-1 text-muted-foreground text-xs">
          ${item.product.price} each
        </p>
        <div className="flex flex-row mt-auto justify-between items-baseline">
          <div className="flex flex-row text-foreground h-8.5 self-start border items-center border-muted rounded-md bg-card text-sm font-medium">
            <button
              onClick={() => {
                if (quantity - 1 === 0) {
                  handleDeleteCartItem(item.id);
                  onUpdate();
                } else {
                  setQuantity(prev => prev - 1);
                  setCartItemQuantity(prev => prev - 1)
                  setTotalProductPrice((quantity - 1) * Number(item.product.price));
                  setTotalCartPrice(prev => prev - Number(item.product.price));
                  
                  debounced();
                }
              }}
              className="border-r border-muted-background px-2.5 h-full rounded-l-md cursor-pointer hover:bg-muted transition-colors"
            >
              −
            </button>
            <p className="px-2.5 self-center w-9 text-center text-xs">
              {quantity}
            </p>
            <button
              onClick={() => {
                setQuantity(prev => prev + 1);
                setCartItemQuantity(prev => prev + 1)
                setTotalProductPrice((quantity + 1) * Number(item.product.price));
                setTotalCartPrice(prev => prev + Number(item.product.price));
                debounced();
              }}
              className="border-l border-muted-background px-2.5 h-full rounded-r-md cursor-pointer hover:bg-muted transition-colors"
            >
              +
            </button>
          </div>
          <div className="flex flex-row self-baseline my-auto items-center gap-3">
            <h4 className="font-semibold mt-0.5">${totalProductPrice.toFixed(2)}</h4>
            <button
              onClick={() => {
                handleDeleteCartItem(item.id);
                onUpdate();
              }}
              className="group cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-red-700 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
